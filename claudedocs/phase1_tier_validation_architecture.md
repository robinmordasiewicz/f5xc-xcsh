# Phase 1: Tier-Based Validation Architecture Analysis

**Task 1.1 Deliverable**: Architecture diagram and implementation points for tier-based validation

**Date**: 2025-12-24
**Status**: Architecture Analysis Complete
**Foundation**: Issues #263-#264 Complete (11/11 metadata fields extracted)

---

## Executive Summary

Tier-based validation enforces subscription tier requirements across all 42 domains. The xcsh CLI now has complete metadata about each domain's tier requirements (`RequiresTier` field from upstream specs). This architecture analysis identifies the optimal implementation strategy for enforcing these requirements at CLI runtime.

**Key Finding**: There is already a subscription validation framework in place (`pkg/subscription/` package). The new tier validation will leverage and extend this existing infrastructure, rather than creating parallel validation systems.

---

## Current State

### Subscription Framework (Already in Place)

The xcsh CLI already has comprehensive subscription validation infrastructure:

**Files in `pkg/subscription/`:**
1. `types.go` - Defines subscription types and tier constants
   - `TierStandard = "STANDARD"`
   - `TierAdvanced = "ADVANCED"`
   - Note: These are "addon service tiers" for subscription addons, NOT domain tiers

2. `validator.go` - Provides the `Validator` struct
   - `NewValidator(client *Client) *Validator`
   - `GetCurrentTier(ctx context.Context) (string, error)` - Gets current subscription tier
   - `GetRegistry() *FeatureRegistry` - Accesses feature registry

3. `features.go` - Feature requirement mapping
   - `FeatureRequirement` - Maps features to tier requirements
   - `FeatureRegistry` - Maps features, resources, and fields to requirements
   - Already supports tier validation pattern

4. `tier_cache.go` - Tier caching for performance

5. `client.go` - API client for subscription queries

**Root command infrastructure (`cmd/root.go`):**
- `subscriptionValidator` variable - Global validator instance
- `initSubscriptionContext()` - Initializes subscription context on startup
- `GetSubscriptionValidator()` - Accessor function
- `EnsureSubscriptionTier(ctx context.Context) (string, error)` - **Already exists!**
  - Returns the current subscription tier
  - Falls back to "Standard" if client unavailable

### New Metadata from Issue #263-#264

All 42 domains now have 11 metadata fields including:
- **`RequiresTier`** (string) - Required subscription tier: "Standard", "Professional", or "Enterprise"
- **`IsPreview`** (bool) - Domain is in preview/beta
- **`Category`** (string) - Domain category (Security, Platform, AI, etc.)
- **`UseCases`** ([]string) - Use case descriptions
- **`RelatedDomains`** ([]string) - Related domain names
- **`Complexity`** (string) - Complexity level

**Tier distribution across 42 domains:**
- Standard: 28 domains (most common)
- Professional: 10 domains (add advanced security/performance features)
- Enterprise: 4 domains (specialized, advanced features: generative_ai, threat_intelligence, bot_defense, etc.)

---

## Architecture Overview

### System Architecture

```
User executes CLI command
    ↓
cmd/root.go: Execute()
    ↓
cmd/root.go: init() - Initializes subscription context
    ↓
    └─→ initSubscriptionContext()
        └─→ Creates subscriptionValidator
            └─→ Detects current tier (Standard/Professional/Enterprise)
            └─→ Caches tier for performance
    ↓
cmd/domains.go: init() - Registers domain commands
    ↓
    └─→ buildDomainCmd(domain)
        └─→ [NEW] Check tier requirement for domain
            └─→ If insufficient tier → Show warning or error
        └─→ Add subcommands (list, get, create, etc.)
    ↓
Subcommand executes with validated tier
```

### Tier Hierarchy

The tier comparison hierarchy is **strict ordering**:

```
Standard < Professional < Enterprise

Example comparisons:
- User with Standard tier can use: Standard domains only
- User with Professional tier can use: Standard + Professional domains
- User with Enterprise tier can use: All domains (Standard + Professional + Enterprise)
```

### Command Entry Points

All domain commands are registered through a single initialization location:

**File**: `cmd/domains.go`

**Key functions** (all domain access goes through here):

1. **`init()` (lines 14-18)** - SINGLE POINT OF INITIALIZATION
   ```go
   func init() {
       for domain := range types.DomainRegistry {
           rootCmd.AddCommand(buildDomainCmd(domain))
       }
   }
   ```
   - Iterates through all 42 domains in DomainRegistry
   - Calls `buildDomainCmd(domain)` for each
   - **This is where tier validation for domain availability should be added**

2. **`buildDomainCmd(domain)` (line 22)** - DOMAIN COMMAND BUILDER
   - Creates top-level domain command (e.g., `xcsh api`, `xcsh kubernetes`)
   - Retrieves domain metadata: `info, _ := types.GetDomainInfo(domain)`
   - Sets up help text and command structure
   - **This is where tier validation warnings can be added to help text**
   - Adds operation subcommands (list, get, create, etc.)

3. **Operation subcommand builders** (lines 73-700+):
   - `buildDomainListCmd()` - List operation (line 73)
   - `buildDomainGetCmd()` - Get operation (line 135)
   - `buildDomainCreateCmd()` - Create operation (line 201)
   - `buildDomainDeleteCmd()` - Delete operation (line 265)
   - `buildDomainReplaceCmd()` - Replace operation (line 331)
   - `buildDomainStatusCmd()` - Status operation (line 394)
   - `buildDomainApplyCmd()` - Apply operation (line 455)
   - `buildDomainPatchCmd()` - Patch operation (line 515)
   - `buildDomainAddLabelsCmd()` - Add labels operation (line 578)
   - `buildDomainRemoveLabelsCmd()` - Remove labels operation (line 639)

   Each calls `types.GetDomainInfo(domain)` to get metadata.
   **Each can check tier requirement independently or inherit from parent domain command.**

### Current Subscription Context Flow

The subscription context is initialized in `cmd/root.go`:

```go
// Global variables (line ~140-160)
var subscriptionValidator *subscription.Validator

// Initialization (init function, line ~250-270)
func initSubscriptionContext() {
    // Called during rootCmd initialization
    // Creates validator and detects current tier
    // Tier is cached for performance
}

// Public accessor (line ~420+)
func EnsureSubscriptionTier(ctx context.Context) (string, error) {
    validator := GetSubscriptionValidator()
    if validator == nil {
        return "Standard", nil  // Fallback to Standard if no API client
    }
    return validator.GetCurrentTier(ctx)
}
```

---

## Validation Placement Options

### Option A: Early Validation in Domain Initialization (RECOMMENDED)

**Where**: `cmd/domains.go: init()` function (lines 14-18)

**How it works**:
```go
func init() {
    for domain := range types.DomainRegistry {
        // NEW: Check tier requirement
        info, _ := types.GetDomainInfo(domain)

        if !isUserTierSufficient(info.RequiresTier) {
            // Option A1: Don't register command (silent filtering)
            // Option A2: Register but mark hidden (still accessible but not shown)
            // Option A3: Register with warning (visible but warns on use)
            continue  // Skip registration
        }

        rootCmd.AddCommand(buildDomainCmd(domain))
    }
}
```

**Pros:**
- ✅ Prevents unavailable commands from appearing in help/completion
- ✅ Simplest implementation (single point of control)
- ✅ Performance: Validation happens once at startup, not per command

**Cons:**
- ⚠️ Commands completely hidden from users (no discovery of upgradeable domains)
- ⚠️ Breaks if user upgrades subscription mid-session (tier change not detected)

**Best for**: Strict access control scenarios

---

### Option B: Runtime Validation in Command Execution (COMPREHENSIVE)

**Where**: Each command's `RunE` function or within the command's run logic

**How it works**:
```go
// In buildDomainCmd() - wrap RunE function
cmd.RunE = func(c *cobra.Command, args []string) error {
    // Check tier before execution
    ctx := c.Context()
    currentTier, err := EnsureSubscriptionTier(ctx)
    if err != nil {
        return fmt.Errorf("failed to check subscription: %w", err)
    }

    if !tierSufficient(currentTier, info.RequiresTier) {
        return formatTierError(info, currentTier)
    }

    // Proceed with normal execution
    return c.Help()
}
```

**Pros:**
- ✅ Commands always visible (users discover what they don't have access to)
- ✅ Clear upgrade path presented at access attempt
- ✅ Handles mid-session subscription upgrades
- ✅ Detailed error messages with upgrade guidance

**Cons:**
- ⚠️ More verbose help output (shows inaccessible commands)
- ⚠️ Requires validation on every command invocation (minor performance impact)

**Best for**: User-friendly discovery and upgrading

---

### Option C: Hybrid (Recommended for Balance)

**Strategy**:
1. **Init time** (Option A): Filter out Enterprise-only commands for Standard tier users
2. **Runtime** (Option B): Check tier when command is actually invoked
3. **Help text**: Show tier requirement in command help if insufficient tier

**Implementation layers**:
```
Layer 1: Init-time filtering (optional, for cleaner help)
    └─→ Remove Enterprise commands from Standard tier users

Layer 2: Runtime tier check (required)
    └─→ Check tier before command execution
    └─→ Show clear error with upgrade path

Layer 3: Help text enhancement (UX improvement)
    └─→ Add "[Requires Professional]" to help
    └─→ Show in domain command description
```

**Best for**: Production use with good UX

---

## Implementation Strategy

### Step 1: Add Tier Comparison Helper Functions

**Location**: `pkg/validation/tier.go` (new file)

```go
package validation

const (
    TierStandard     = "Standard"
    TierProfessional = "Professional"
    TierEnterprise   = "Enterprise"
)

// TierLevel returns the numeric level of a tier (for comparison)
func TierLevel(tier string) int {
    switch tier {
    case TierStandard:
        return 1
    case TierProfessional:
        return 2
    case TierEnterprise:
        return 3
    default:
        return 0
    }
}

// IsSufficientTier checks if current tier is sufficient for required tier
func IsSufficientTier(currentTier, requiredTier string) bool {
    // Standard >= Standard ✓
    // Professional >= Professional ✓
    // Professional >= Standard ✓
    // Standard >= Professional ✗
    return TierLevel(currentTier) >= TierLevel(requiredTier)
}

// GetUpgradePath returns upgrade suggestions
func GetUpgradePath(currentTier, requiredTier string) string {
    if IsSufficientTier(currentTier, requiredTier) {
        return ""
    }
    return fmt.Sprintf("Upgrade from %s to %s tier", currentTier, requiredTier)
}
```

### Step 2: Add Domain Tier Validation Helper

**Location**: Extend `cmd/root.go` or new `cmd/validation.go`

```go
// ValidateDomainTier checks if domain is accessible in current tier
func ValidateDomainTier(ctx context.Context, domain string) error {
    info, err := types.GetDomainInfo(domain)
    if err != nil {
        return fmt.Errorf("domain not found: %s", domain)
    }

    currentTier, err := EnsureSubscriptionTier(ctx)
    if err != nil {
        // If we can't determine tier, allow access (offline mode)
        return nil
    }

    if !validation.IsSufficientTier(currentTier, info.RequiresTier) {
        return &tierError{
            domain: domain,
            current: currentTier,
            required: info.RequiresTier,
        }
    }

    return nil
}

// tierError provides detailed tier access error
type tierError struct {
    domain   string
    current  string
    required string
}

func (e *tierError) Error() string {
    return fmt.Sprintf(
        "Domain '%s' requires %s tier (you have %s)\n\n"+
        "Upgrade your subscription at: https://console.volterra.io/account/upgrade\n"+
        "Need help? Contact: support@volterra.io",
        e.domain, e.required, e.current,
    )
}
```

### Step 3: Integrate into Domain Command Building

**Location**: `cmd/domains.go`

```go
// Modified init() with tier filtering
func init() {
    ctx := context.Background()

    for domain := range types.DomainRegistry {
        // Early filter: Don't register if no tier support at all
        // (handles Enterprise-only domains for Standard tier)
        if shouldRegisterDomain(ctx, domain) {
            rootCmd.AddCommand(buildDomainCmd(domain))
        }
    }
}

// Modified buildDomainCmd() with runtime validation
func buildDomainCmd(domain string) *cobra.Command {
    info, _ := types.GetDomainInfo(domain)

    cmd := &cobra.Command{
        Use: domain,
        // ... existing setup ...
    }

    // ADDED: Runtime tier validation
    originalRunE := cmd.RunE
    cmd.RunE = func(c *cobra.Command, args []string) error {
        // Check tier before help or execution
        if err := ValidateDomainTier(c.Context(), domain); err != nil {
            fmt.Fprintf(os.Stderr, "Error: %v\n", err)
            return err
        }

        if originalRunE != nil {
            return originalRunE(c, args)
        }
        return c.Help()
    }

    // ADDED: Enhance help text with tier requirement
    if info.RequiresTier != "Standard" {
        cmd.Short = fmt.Sprintf(
            "[Requires %s] Manage %s resources",
            info.RequiresTier, info.DisplayName,
        )
    }

    // ... rest of command building ...
    return cmd
}
```

---

## Tier Requirement Mapping

**Current distribution of 42 domains** (from Issue #263-#264):

### Standard Tier Domains (28 domains)
Accessible to all users - includes core functionality:
- Kubernetes, DNS, Intrusion Prevention, WAF, etc.

### Professional Tier Domains (10 domains)
Require Professional+ subscription - advanced features:
- API, Malicious User Detection, Network Security, etc.

### Enterprise Tier Domains (4 domains)
Require Enterprise subscription - specialized features:
- Generative AI, Threat Intelligence, Bot Defense, etc.

**Validation rules**:
- User with Standard can access: Standard domains (28)
- User with Professional can access: Standard + Professional (38)
- User with Enterprise can access: All (42)

---

## Implementation Checklist for Task 1.2-1.5

### Task 1.2: Implement Tier Validation Logic
- [ ] Create `pkg/validation/tier.go` with comparison functions
- [ ] Create `pkg/validation/tier_test.go` with comprehensive tests
- [ ] Add `ValidateDomainTier()` helper to root.go
- [ ] Add tier error type with user-friendly messages
- [ ] Test with all three tier levels (Standard, Professional, Enterprise)

### Task 1.3: Add Tier Checks to Domain Access Points
- [ ] Update `cmd/domains.go: init()` with tier filtering (optional)
- [ ] Update `cmd/domains.go: buildDomainCmd()` with runtime validation
- [ ] Add tier requirement to command help text
- [ ] Test domain availability by tier
- [ ] Test error messages are clear and actionable

### Task 1.4: Add Tier Error Messages and Guidance
- [ ] Design user-friendly error messages
- [ ] Include upgrade URL in errors
- [ ] Add contact info for sales/support
- [ ] Show current vs. required tier clearly
- [ ] Suggest upgrade path where applicable
- [ ] Test error formatting and readability

### Task 1.5: Test Tier Validation
- [ ] Create test scenarios for each tier
- [ ] Verify Standard domains accessible to all
- [ ] Verify Professional domains blocked for Standard
- [ ] Verify Enterprise domains blocked for Standard/Professional
- [ ] Test tier detection caching
- [ ] Test offline mode (no API client)
- [ ] Test error message display

---

## Success Criteria

- ✅ All tier checks working correctly
- ✅ Professional-only domains blocked for Standard tier users
- ✅ Enterprise-only domains blocked for Standard/Professional tier users
- ✅ Clear error messages shown with upgrade guidance
- ✅ No false positives (correct domains accessible per tier)
- ✅ No false negatives (required domains blocked appropriately)
- ✅ All 42 domains validated across tier hierarchy

---

## Risk Mitigation

### Risk: Tier validation breaks existing workflows
**Mitigation**:
- Add feature flag to disable tier checks (dev mode)
- Fall back to Standard tier if API unavailable (offline support)
- Cache tier detection to minimize API calls
- Clear error messages for users to understand requirements

### Risk: Performance impact from tier checks
**Mitigation**:
- Check once at command initialization, not per invocation
- Cache tier detection result
- Validation check is simple comparison (<10ms)
- No additional API calls required (uses cached tier)

### Risk: User confusion about tier requirements
**Mitigation**:
- Clear "[Requires Professional]" indicators in help
- Provide upgrade URL in error messages
- Show current tier in errors
- Link to documentation with feature comparison

---

## Files to Modify

| File | Location | Changes | Complexity |
|------|----------|---------|------------|
| `pkg/validation/tier.go` | NEW | Add tier comparison logic | Low |
| `pkg/validation/tier_test.go` | NEW | Add tier validation tests | Low |
| `cmd/domains.go` | lines 14-70 | Add tier checks in domain building | Medium |
| `cmd/root.go` | lines ~150-160 | Add validation helper functions | Low |

**Total lines of code**: ~150-200 lines across new and modified files

---

## Conclusion

The xcsh CLI already has a strong subscription validation foundation. Tier-based domain validation will leverage the existing framework (`pkg/subscription/` package and `cmd/root.go` infrastructure) to enforce the tier requirements captured in the new metadata fields.

The recommended approach is **Hybrid validation** (Option C):
1. Register all domains at init time (discovery)
2. Validate tier at command execution time (enforcement)
3. Show clear error messages with upgrade path

This provides the best balance of user experience and access control.

---

**Task 1.1 Status**: ✅ COMPLETE
**Ready for Task 1.2**: Implementation of tier validation logic

---

*Generated as part of Phase 1: Tier-Based Validation for xcsh CLI*
*Timestamp: 2025-12-24*
