# GitHub Actions Workflow Fixes - Phased Implementation Plan

## Overview

This document breaks down remaining workflow fixes into manageable phases to isolate development work into segments.

## Current Status

### ✅ Phase 1 Complete: Critical Fixes

All 3 critical fixes successfully implemented:

- Fix 1: docs.yml action versions (@v4)
- Fix 2: Remove || true from test-regression.yml
- Fix 3: Remove fake status from sync-upstream-specs.yml
- Fix 5: Pick canonical docs trigger (removed release: trigger)
- Fix 6: Remove redundant docs triggers

### ⚠️ Phase 2: High Priority - Deferred Due to Complexity

Deferred fixes requiring manual YAML editing:

- Fix 4: Gate release.yml via workflow_run (complex file structure)
- Fix 7: Make verify-generated actually fail OR remove from build deps

### ⏳ Phase 3: Medium Priority - Pending

- Fix 8: Align Node version in test-regression.yml to 22
- Fix 9: Clarify purpose of test-regression.yml (schedule only, not on PRs)

---

## Proposed Phased Approach

### Phase 2: Release Workflow Fixes (High Priority)

**Files**: `.github/workflows/release.yml`

**Changes Required**:

1. Replace `push` trigger with `workflow_run` on CI success
2. Decide on verify-generated (Option A: make fail OR Option B: remove from build needs)

**Complexity**: Medium - Single file with clear replacement targets

**Estimated Effort**: 30-60 minutes

**Success Criteria**:

- Release only triggers after CI completes
- verify-generated either blocks on drift OR is removed from dependencies
- Manual YAML editing ensures correct formatting

---

### Phase 3: Test Regression Workflow Fixes (Medium Priority)

**File**: `.github/workflows/test-regression.yml`

**Changes Required**:

1. Change Node version from 20 to 22
2. Change triggers from push/PR to schedule + workflow_dispatch

**Complexity**: Low - Simple version string change, trigger adjustment

**Estimated Effort**: 10-15 minutes

**Success Criteria**:

- Uses Node 22 (consistent with rest of automation)
- Runs on schedule only (no conflict with CI)
- Workflow purpose is clear (scheduled validation)

---

## Rationale for Phased Approach

### Why Phase Release First?

**Impact**: Fixing release.yml gating eliminates the **highest risk** in automation chain:

- Currently: release can run without real CI validation
- After fix: release guaranteed to run only after CI passes

**Value**: This prevents broken releases and ensures all code is validated before publishing

### Why Verify-Generated Together with Release?

**Decision Point**: These both relate to release workflow behavior:

- verify-generated affects when code drifts (would be committed in PRs)
- release.yml gating affects when releases are created
- Fixing both in same phase ensures consistent behavior

---

## Implementation Checklist

### Phase 2: Release Workflow Fixes

- [ ] Read release.yml fully to understand structure
- [ ] Determine verify-generated approach (Option A or B)
- [ ] Manually edit YAML in code editor
- [ ] Test YAML syntax
- [ ] Commit changes

### Phase 3: Test Regression Workflow Fixes

- [ ] Change Node version to 22
- [ ] Change triggers (schedule + workflow_dispatch)
- [ ] Update workflow purpose comment
- [ ] Commit changes

### Phase 4: Final Cleanup

- [ ] Verify all workflows run correctly
- [ ] Update Workflow_Fixes_Plan.md with actual results
- [ ] Create summary document of changes made

---

## Success Metrics

### Overall Progress

| Phase | Tasks | Status |
|-------|--------|---------|
| **Phase 1**: Critical Fixes | 5/6 complete (83%) |
| **Phase 2**: Release fixes | 0/2 complete (0%) |
| **Phase 3**: Test regression | 0/2 complete (0%) |

### Critical Fixes Impact

Before Phase 1:

- ❌ docs.yml wouldn't run (non-existent actions)
- ❌ test-regression.yml could fail silently
- ❌ sync-upstream-specs.yml bypasses branch protection
- ❌ docs.yml could run twice (redundant triggers)

After Phase 1:

- ✅ docs.yml uses correct action versions
- ✅ test-regression.yml properly reports failures
- ✅ sync-upstream-specs.yml uses real CI checks
- ✅ docs.yml has canonical trigger path
- ✅ No redundant docs triggers

### Remaining Work

| Fix # | Description | Priority | Complexity |
|--------|------------|----------|------------|
| **Fix 4** | Gate release via workflow_run | HIGH | Complex YAML structure |
| **Fix 7** | Make verify-generated fail OR remove | HIGH | Complex file structure |
| **Fix 8** | Align Node version | MEDIUM | Simple version change |
| **Fix 9** | Change triggers to schedule | MEDIUM | Simple trigger change |

---

## Related Documentation

- [Workflow_Fixes_Plan.md](./Workflow_Fixes_Plan.md) - Original comprehensive plan
- [CI_CD_Automation.md](./CI_CD_Automation.md) - Complete automation documentation
- [CICD_Flow_Diagram.md](./CICD_Flow_Diagram.md) - Visual flow diagrams

---

## Next Steps

1. **Choose Phase 2 or 3** to implement next:
   - Phase 2 has higher impact (prevents broken releases)
   - Phase 3 is simpler to complete

2. **Follow phased checklist** to avoid scope creep

3. **After completing Phase 2 or 3**: Re-evaluate if additional work is needed

---

**Recommendation**: Start with **Phase 2 (Release Workflow Fixes)** as it addresses the highest remaining risk in the automation chain.
