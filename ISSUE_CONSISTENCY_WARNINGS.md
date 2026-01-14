# Command Consistency Warnings - Technical Debt

## Summary

The build-time consistency verification (`npm run verify:consistency`) reports 28 warnings across 28 commands that have incomplete or inconsistent command definitions. While these don't prevent the CLI from functioning, they represent quality issues that impact user experience and maintainability.

## Issue Categories

### 1. Missing Usage Specifications (14 commands)

Commands without `usage:` strings lack structured documentation of their argument patterns, making it impossible for automated tooling to validate correctness or generate smart completions.

**Affected Commands:**

- `login list profile`
- `login list context`
- `login show context`
- `completion bash`
- `completion zsh`
- `completion fish`
- `subscription show plan`
- `subscription show quota-limits`
- `subscription show usage-current`
- `subscription show report-summary`
- `subscription list plan`
- `subscription list billing-payment`
- `subscription status addon`
- `subscription show`

**Impact:**

- No automated validation of command structure
- Cannot use smart completion features
- Inconsistent with other commands
- Harder to maintain and document

**Recommended Fix:**
Add `usage:` field to each command definition following the pattern:

- No args: `usage: ""` or omit field
- Optional flags only: `usage: "[--flag <value>]"`
- Required args: `usage: "<arg>"`
- Mixed: `usage: "<required> [--optional <value>]"`

### 2. Missing Completion Handlers (12 commands)

Commands that accept arguments but lack completion handlers provide poor UX, as users get no tab-completion assistance when typing command arguments.

**Affected Commands:**

- `cloudstatus status` (1 arg)
- `cloudstatus summary` (1 arg)
- `cloudstatus components` (1 arg)
- `cloudstatus incidents` (1 arg)
- `cloudstatus maintenance` (1 arg)
- `ai_services eval query` (1 arg)
- `ai_services eval feedback` (2 args)
- `ai_services query` (1 arg)
- `ai_services feedback` (2 args)
- `subscription show addon` (1 arg)
- `subscription show quota-usage` (1 arg)
- `subscription list addon` (1 arg)

**Impact:**

- No tab completion for arguments
- Poor user experience
- Users must guess or remember argument formats
- Inconsistent with completed commands

**Recommended Fix:**
Add completion handlers using the smart completion pattern:

```typescript
completion: async (_currentWord: string, args: string[]) => {
    return generateSmartCompletions(
        commandDefinition.usage,
        args,
        ["--flag1", "--flag2"]  // Available flags
    );
}
```

For commands with dynamic completions (e.g., listing available resources), implement context-aware completion logic.

### 3. Usage/Completion Mismatches (2 commands)

Commands where the completion handler suggests flags that aren't documented in the usage specification, creating inconsistency.

**Affected Commands:**

**`login create profile`:**

- Issue: Completion suggests `--namespace` but usage specification doesn't explicitly list it
- Current usage: `"<name> --url <api-url> --token <api-token> [--namespace <ns>]"`
- Current completion: Returns `["<name>", "--url", "--token", "--namespace"]`
- **Note:** This appears to be a false positive - `--namespace` IS in the usage as optional `[--namespace <ns>]`. The consistency checker may need improvement to recognize optional flags.

**`login banner`:**

- Issue: Completion suggests `--logo` but usage doesn't document it
- Current usage: `"[--logo <mode>]"`
- Current completion: Returns flag suggestions including `--logo`
- **Note:** Another potential false positive - `--logo` IS in the usage. The checker logic may need refinement.

**Impact:**

- May indicate actual inconsistencies OR checker false positives
- Requires investigation to determine which is the case
- If real: confusing to users, incorrect documentation
- If false positive: noisy build output, obscures real issues

**Recommended Fix:**

1. Investigate consistency checker logic in `scripts/verify-command-consistency.ts`
2. Review optional flag detection - pattern `[--flag <value>]` should be recognized
3. Fix either the checker or the command definitions based on investigation
4. Document expected behavior for optional flags

## Statistics

```text
Total Commands:        36
✅ Clean:              8 (22%)
⚠️  Warnings:          28 (78%)
📝 Missing Completion: 12 (33%)
📋 Missing Usage:      14 (39%)
🔧 Mismatches:         2 (6%)
```

## Verification Tool

The consistency checker is implemented in:

- `scripts/verify-command-consistency.ts`
- Runs automatically during `npm run validate`
- Reports are actionable with clear remediation steps

## Priority Assessment

### High Priority (User-Facing Impact)

- **Missing completion handlers** - Directly impacts UX, users notice immediately
- Commands with arguments especially need this (cloudstatus, ai_services)

### Medium Priority (Quality/Maintenance)

- **Missing usage specifications** - Affects documentation and tooling but not immediate UX
- Particularly important for commands that will get completion handlers

### Low Priority (Possible False Positives)

- **Usage/completion mismatches** - May be checker issues, requires investigation first
- Fix checker before fixing commands if false positives

## Implementation Plan

### Phase 1: Complete Specifications (Quick Wins)

1. Add `usage:` fields to all 14 commands missing them
2. Follow existing patterns from well-formed commands
3. Validate with consistency checker

**Effort:** 1-2 hours
**Files:** Command definition files in respective domains

### Phase 2: Add Completion Handlers (UX Improvement)

1. Implement completion for cloudstatus commands (5 commands)
2. Implement completion for ai_services commands (4 commands)
3. Implement completion for subscription commands (3 commands)
4. Use smart completion pattern from `docs/smart-completion-guide.md`

**Effort:** 4-6 hours
**Dependencies:** Phase 1 must complete first (need usage strings)

### Phase 3: Investigate Checker (Quality Improvement)

1. Review consistency checker optional flag detection
2. Fix false positives if found
3. Add test cases for optional flag patterns
4. Document expected checker behavior

**Effort:** 2-3 hours
**Files:** `scripts/verify-command-consistency.ts`

## Testing Requirements

For each fixed command:

- [ ] Add acceptance test for completion behavior
- [ ] Verify usage string parsing works correctly
- [ ] Test smart completion with various input states
- [ ] Ensure consistency checker reports clean

## Related Documentation

- **Smart Completion Guide:** `docs/smart-completion-guide.md`
- **Usage Parser API:** `src/utils/usage-parser.ts`
- **Example Implementation:** `src/domains/login/profile/create.ts`
- **Test Examples:** `tests/acceptance/login-completion-matrix.test.ts`

## Success Criteria

- [ ] Consistency checker reports 0 warnings (or only known false positives)
- [ ] All commands with arguments have completion handlers
- [ ] All commands have usage specifications
- [ ] 100% of commands follow established patterns
- [ ] Documentation updated to reflect changes

## Technical Debt Impact

**Current State:**

- Inconsistent command definitions across codebase
- Poor discoverability for users
- Difficult to maintain and extend
- No automated enforcement of quality standards

**After Resolution:**

- Uniform command structure
- Excellent tab completion UX
- Self-documenting command interface
- Automated quality gates prevent regression

## Additional Context

This issue was identified after implementing smart completion for `login create profile`. The consistency verification tool highlighted that while one command now follows best practices, many others lag behind. Resolving this will bring the entire CLI up to a consistent quality standard.

## References

- Original smart completion implementation: PR #XXX (to be filled)
- Consistency verification script: `scripts/verify-command-consistency.ts`
- Usage parser utility: `src/utils/usage-parser.ts`
