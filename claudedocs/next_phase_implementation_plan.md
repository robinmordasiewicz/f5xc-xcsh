# Next Phase Implementation Plan: Data-Driven CLI Features

**Date**: 2025-12-24
**Foundation**: Issues #263-#264 Complete ✅
**Status**: Ready for Implementation
**Metadata Available**: 11 fields per domain (100% extraction)

---

## Overview

This plan systematically implements 5 major features using the newly extracted metadata from upstream specifications. All features are data-driven and require no hardcoding.

**Total Tasks**: 25 actionable items
**Estimated Approach**: Implement in feature sequences with testing between phases
**Architecture**: Build upon extracted metadata fields (Complexity, IsPreview, RequiresTier, Category, UseCases, RelatedDomains)

---

## Phase 1: Tier-Based Validation (Tasks 1-5)

### Goal
Enforce subscription tier requirements using `RequiresTier` metadata. Prevent users with insufficient tier access from using features.

### Tasks

**Task 1.1**: Analyze Architecture for Tier Validation
- Identify all command entry points where tier validation should occur
- Map domain usage across CLI commands
- Determine validation placement (early validation vs. runtime checks)
- Document tier hierarchy: Standard < Professional < Enterprise
- **Deliverable**: Architecture diagram or documentation

**Task 1.2**: Implement Tier Validation Logic
- Create tier checking helper functions in `pkg/subscription` or new `pkg/validation` package
- Implement tier comparison logic (Standard ≤ Professional ≤ Enterprise)
- Create user tier context (from environment or config)
- Build validation error helper functions
- **Deliverable**: Reusable tier validation package

**Task 1.3**: Add Tier Checks to Domain Access Points
- Identify where domains are accessed/used in CLI
- Insert tier validation before domain operations
- Handle tier mismatch gracefully
- Support both domain-level and operation-level checking
- **Deliverable**: Integration into main CLI workflows

**Task 1.4**: Add Tier Error Messages and Guidance
- Create user-friendly error messages for tier violations
- Include available actions for insufficient tier
- Suggest upgrade paths
- Show required tier clearly
- Example: "API domain requires Professional tier. Your current: Standard. Upgrade at: https://..."
- **Deliverable**: Error message templates

**Task 1.5**: Test Tier Validation
- Test each subscription tier: Standard, Professional, Enterprise
- Verify domain access patterns by tier
- Test tier validation across all 42 domains
- Verify error messages display correctly
- **Deliverable**: Test cases and validation results

---

## Phase 2: Preview Domain Warnings (Tasks 6-9)

### Goal
Clearly identify experimental/preview domains using `IsPreview` flag. Warn users about unstable features.

### Tasks

**Task 2.1**: Add Preview Warning Display in Domain Listings
- Add indicator (e.g., "⚠️ PREVIEW" or "[BETA]") to domain listings
- Make indicator configurable (some users want warnings, others don't)
- Implement in `ListDomains()` or domain enumeration functions
- Show preview status in all relevant output
- **Deliverable**: Preview display in domain listings

**Task 2.2**: Add Preview Flags to Help Text
- Modify help command to show preview status
- Format: Show clearly when domain is preview/experimental
- Include stability note: "This domain is in preview and subject to changes"
- Example: `xcsh help generative_ai` shows PREVIEW warning at top
- **Deliverable**: Help text integration

**Task 2.3**: Add Preview Indicators to Completions
- Update bash/zsh completion generation to mark preview domains
- Show preview status in shell completion descriptions
- Help users know about experimental features via tab completion
- **Deliverable**: Completion script enhancements

**Task 2.4**: Test Preview Warnings
- Verify all preview domains (IsPreview=true) show warnings
- Test non-preview domains don't show warnings
- Verify consistency across help, listings, and completions
- Example: generative_ai should show preview warning everywhere
- **Deliverable**: Test coverage for all 42 domains

---

## Phase 3: Domain Categorization (Tasks 10-13)

### Goal
Organize domains using `Category` field. Improve discoverability and help organization.

### Tasks

**Task 3.1**: Implement Category-Based Grouping
- Create domain grouping logic by `Category` field
- Build category → domains mapping
- Handle domains with empty categories
- Create helper functions for category queries
- **Deliverable**: Category grouping package

**Task 3.2**: Update Help Command to Show Categories
- Modify `xcsh help` output to show categories
- Group domains by category in listings
- Format: Categories as sections with domains under each
- Example:
  ```
  SECURITY DOMAINS:
    - api (Professional tier)
    - application_firewall (Standard tier)

  PLATFORM DOMAINS:
    - kubernetes (Standard tier)

  AI DOMAINS:
    - generative_ai (Enterprise, PREVIEW)
  ```
- **Deliverable**: Categorized help output

**Task 3.3**: Add Category Filters to Domain Search
- Implement `xcsh domains --category security` style filtering
- Support multiple category filters: `--category security,platform`
- Add category tab completion
- Show available categories in help
- **Deliverable**: Category filtering CLI feature

**Task 3.4**: Test Category Organization
- Verify all 42 domains properly categorized
- Test category filtering
- Verify no domains fall into "unknown" categories
- Test with various filter combinations
- **Deliverable**: Category feature test suite

---

## Phase 4: Use Case Documentation (Tasks 14-17)

### Goal
Display domain use cases from `UseCases` metadata. Help users understand domain purposes.

### Tasks

**Task 4.1**: Implement Use Case Display in Domain Help
- Extract and format `UseCases` array for display
- Create attractive formatting for use cases
- Example output:
  ```
  API Domain - Use Cases:
    • Discover and catalog APIs
    • Test API security and behavior
    • Manage API credentials
    • Define API groups and testing policies
  ```
- Support both short and detailed listings
- **Deliverable**: Use case display logic

**Task 4.2**: Format and Render Use Cases in CLI Output
- Implement use case rendering in help command
- Add to domain detail views
- Include in search results
- Make formatting consistent across CLI
- **Deliverable**: Formatted use case output

**Task 4.3**: Add Use Cases to Command Completion
- Include use cases in completion descriptions
- Show first use case as completion description
- Example: `kubernetes` → "Kubernetes - Discover and manage Kubernetes clusters"
- Help users understand domain purpose via tab completion
- **Deliverable**: Completion integration

**Task 4.4**: Test Use Case Display
- Verify all 42 domains have use cases (or empty handled gracefully)
- Test formatting with various use case counts
- Verify completions show use cases
- Test with different output terminals
- **Deliverable**: Use case display test suite

---

## Phase 5: Workflow Suggestions (Tasks 18-21)

### Goal
Suggest related domains using `RelatedDomains` metadata. Enable cross-domain workflow discovery.

### Tasks

**Task 5.1**: Implement Related Domain Suggestion Logic
- Create function to look up `RelatedDomains` for any domain
- Build bidirectional suggestion (if A→B, consider B→A)
- Handle missing/empty related domains
- Create suggestion ranking logic
- **Deliverable**: Suggestion engine package

**Task 5.2**: Add Related Domain Recommendations to Help
- Show related domains in help output
- Format: "Domains often used with this domain:"
- Example: API domain suggests ["application_firewall", "network_security"]
- Include related domain descriptions
- **Deliverable**: Help text integration

**Task 5.3**: Implement Cross-Domain Workflow Suggestions
- Detect when user is working with related domains
- Suggest complementary domains proactively
- Example: "You're using api - consider also using application_firewall for security"
- Store suggestion history (optional: for learning user workflows)
- **Deliverable**: Workflow suggestion engine

**Task 5.4**: Test Workflow Suggestions
- Verify `RelatedDomains` suggestions are relevant
- Test bidirectional suggestions
- Verify suggestion accuracy across all 42 domains
- Test workflow detection
- **Deliverable**: Suggestion test suite

---

## Phase 6: Integration and Quality (Tasks 22-25)

### Goal
Ensure all features work together, no regressions, and proper documentation.

### Tasks

**Task 6.1**: Run Comprehensive Integration Testing
- Test all 5 features together in realistic scenarios
- Test feature interactions (e.g., preview warnings + tier validation)
- Test with all 42 domains
- Verify performance is acceptable
- **Deliverable**: Integration test suite results

**Task 6.2**: Verify No Regressions
- Run all existing tests
- Verify original functionality unchanged
- Test backwards compatibility
- Performance regression testing
- **Deliverable**: Regression test results

**Task 6.3**: Create Documentation for New Features
- Write user documentation for each feature
- Create examples for each feature
- Document configuration options
- Add troubleshooting guide
- **Deliverable**: Feature documentation

**Task 6.4**: Update Help and Examples
- Update README with new features
- Add examples for tier validation
- Add examples for domain categories
- Add examples for use case search
- Add examples for workflow suggestions
- **Deliverable**: Updated documentation

---

## Implementation Sequence

### Recommended Order
1. **Phase 1** (Tier Validation) - Foundation for feature access control
2. **Phase 2** (Preview Warnings) - Quick win, improves user safety
3. **Phase 3** (Categorization) - Improves discoverability
4. **Phase 4** (Use Cases) - Documentation improvement
5. **Phase 5** (Workflow Suggestions) - Advanced feature
6. **Phase 6** (Integration & Testing) - Final quality assurance

### Parallelization Opportunities
- Phases 2, 3, 4 can be partially parallelized (independent features)
- Testing can happen in parallel with implementation
- Documentation can start during Phase 1

### Dependencies
- Phase 1 → Phase 2 (tier validation helps with preview features)
- Phase 3, 4 → Phase 5 (suggestion logic builds on categorization/use cases)
- Phase 6 depends on all others

---

## Architecture Notes

### New Metadata Fields Used

| Feature | Fields Used | Purpose |
|---------|-------------|---------|
| Tier Validation | `RequiresTier` | Check user access level |
| Preview Warnings | `IsPreview` | Identify experimental domains |
| Categorization | `Category` | Group related domains |
| Use Cases | `UseCases` | Explain domain purposes |
| Workflows | `RelatedDomains` | Suggest complementary domains |

### Suggested Package Organization

```
pkg/
  validation/
    tier.go          # Tier checking logic
    tier_test.go
  domain/
    categorization.go # Category grouping
    categorization_test.go
    preview.go       # Preview handling
    preview_test.go
  workflow/
    suggestions.go   # Workflow suggestions
    suggestions_test.go
  display/
    format.go        # Formatting helpers
    usecases.go      # Use case display
```

### Configuration Considerations
- Allow disabling preview warnings (for experienced users)
- Allow tier requirements to be optional in dev/test mode
- Support custom tier definitions
- Make suggestion frequency configurable

---

## Success Metrics

### Phase 1: Tier Validation
- ✅ All tier checks working
- ✅ Professional-only domains blocked for Standard tier
- ✅ Clear error messages shown
- ✅ No false positives/negatives

### Phase 2: Preview Warnings
- ✅ All preview domains (3-5 estimated) clearly marked
- ✅ Warnings visible in help, listings, completions
- ✅ No false positives (non-preview domains unmarked)

### Phase 3: Domain Categorization
- ✅ All 42 domains categorized
- ✅ Categories align with upstream spec
- ✅ Category filtering works correctly
- ✅ Help output is well-organized

### Phase 4: Use Case Documentation
- ✅ Use cases display correctly
- ✅ All domains with use cases show them
- ✅ Empty use cases handled gracefully
- ✅ Formatting is consistent

### Phase 5: Workflow Suggestions
- ✅ Related domains are relevant
- ✅ Suggestions are helpful to users
- ✅ No irrelevant suggestions
- ✅ Performance acceptable

### Phase 6: Overall Quality
- ✅ All tests passing
- ✅ No regressions
- ✅ Documentation complete
- ✅ Features are user-friendly

---

## Risk Mitigation

### Risks and Mitigation Strategies

**Risk**: Tier validation breaks existing workflows
- **Mitigation**: Implement feature flag to disable tier checks initially
- **Mitigation**: Comprehensive testing with various tier levels
- **Mitigation**: Dev/test mode override

**Risk**: Too many warnings overwhelm users
- **Mitigation**: Make warnings configurable
- **Mitigation**: Show warnings only once per session
- **Mitigation**: Use colors/symbols for quick scanning

**Risk**: Category organization is confusing
- **Mitigation**: Follow upstream category structure
- **Mitigation**: User testing of help output
- **Mitigation**: Allow sorting/filtering by other criteria

**Risk**: Use cases are too verbose
- **Mitigation**: Limit to first 3-4 use cases in listings
- **Mitigation**: Show all use cases only in detailed help
- **Mitigation**: Make formatting concise

**Risk**: Workflow suggestions are inaccurate
- **Mitigation**: Validate against upstream `RelatedDomains`
- **Mitigation**: User feedback mechanism
- **Mitigation**: Suggestion confidence levels

---

## Checkpoints

### After Phase 1
- [ ] Tier validation working correctly
- [ ] All tests passing
- [ ] Documentation written
- [ ] Decision: Proceed to Phase 2?

### After Phase 3
- [ ] Categories organized correctly
- [ ] Filtering working
- [ ] Help output improved
- [ ] Decision: Proceed to Phase 4?

### After Phase 5
- [ ] All features implemented
- [ ] Integration testing complete
- [ ] Documentation updated
- [ ] Ready for release?

---

## Estimated Effort

| Phase | Tasks | Complexity | Estimated Effort |
|-------|-------|-----------|-----------------|
| 1: Tier Validation | 5 | Medium | 4-6 hours |
| 2: Preview Warnings | 4 | Low | 2-3 hours |
| 3: Categorization | 4 | Medium | 3-5 hours |
| 4: Use Cases | 4 | Low | 2-3 hours |
| 5: Workflows | 4 | Medium | 4-6 hours |
| 6: Integration | 4 | Medium | 3-5 hours |
| **Total** | **25** | **Low-Medium** | **18-28 hours** |

---

## Next Steps

1. **Review this plan** - Confirm direction and priorities
2. **Start Phase 1** - Begin tier validation implementation
3. **Track progress** - Update todo list as tasks complete
4. **Test incrementally** - Verify each phase before moving to next
5. **Iterate based on feedback** - Adjust based on user experience

---

## Success Vision

After completing all phases:

✅ CLI is fully **data-driven** - no hardcoded metadata
✅ Users understand domain **purposes** via use cases
✅ Users can **discover domains** via categorization
✅ Users **stay safe** via preview warnings
✅ Users have **appropriate access** via tier validation
✅ Users discover **workflows** via suggestions

The xcsh CLI becomes a smart, metadata-driven tool that guides users toward the right domains and features for their needs.

---

**Plan Created**: 2025-12-24
**Status**: Ready for Implementation
**Next Action**: Begin Phase 1 - Tier-Based Validation
