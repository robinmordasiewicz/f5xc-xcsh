# CRITICAL FINDING - Domain Routing Issue

**Date**: 2026-01-20
**Severity**: HIGH
**Test Phase**: Phase 1 - Help System Verification

## Issue Summary

The manual testing plan specifies testing `app_firewall` in the `virtual` domain, but actual testing reveals the resource only functions correctly in the `waf` domain.

## Detailed Findings

### Test Plan Statement

```
**Branch**: `feature/sync-specs-v2.0.45`
**Resource**: `app_firewall` (moved to `virtual` domain in v2.0.45)
```

### Actual Behavior

#### ✅ WAF Domain (CORRECT)

```bash
$ ./dist/index.js waf create app_firewall --name test --namespace default --blocking-mode MONITORING -o json

Result: Creates app_firewall with correct spec:
{
  "spec": {
    "monitoring": {},
    "default_detection_settings": {},
    "default_bot_setting": {},
    "allow_all_response_codes": {},
    "default_anonymization": {},
    "use_default_blocking_page": {}
  }
}
```

#### ❌ Virtual Domain (INCORRECT)

```bash
$ ./dist/index.js virtual create app_firewall --name test --namespace default --blocking-mode MONITORING -o json

Result: Creates origin_pool instead (WRONG):
{
  "spec": {
    "endpoints": [],
    "health_checks": [],
    "loadbalancer_algorithm": "ROUND_ROBIN",
    "endpoint_subsets": [],
    "fallback_policy": "NO_FALLBACK",
    ...
  }
}
```

## Root Cause Analysis

### Code Investigation

1. **domains_generated.ts**: Shows `app_firewall` in BOTH domains
   - Line 10278: `app_firewall` in `virtual` domain's `primaryResources`
   - Appears in `waf` domain as well (needs verification)

2. **Executor Behavior**:
   - When using `virtual create app_firewall`, the executor fails to recognize "app_firewall" as a valid resource type for the virtual domain
   - Falls back to treating it as a resource name
   - Defaults to creating an `origin_pool` (likely the first/default resource in virtual domain)

3. **IMPLEMENTATION_SUMMARY.md Contradiction**:

   ```markdown
   ### Domain Location
   ⚠️ `app_firewall` is a resource in the **`waf` domain**, not `virtual` domain.

   **Correct**: `waf create app_firewall ...`
   **Incorrect**: `virtual create app_firewall ...`
   ```

## Impact on Testing

### Test Plan Requires Correction

**ALL test commands in the manual testing plan must be changed from:**

```bash
./dist/index.js virtual create app_firewall --name test --namespace default
```

**TO:**

```bash
./dist/index.js waf create app_firewall --name test --namespace default
```

This affects **ALL 13 testing phases** with 100+ test cases.

## Recommended Actions

### Immediate (For Testing)

1. ✅ Update all test commands to use `waf` domain instead of `virtual`
2. ✅ Re-run Phase 1 tests with corrected domain
3. ✅ Proceed with remaining test phases using `waf` domain

### Medium-Term (For Code Review)

1. 🔍 **Investigate why `virtual` domain fails to route app_firewall correctly**
   - Check if `domainResourceTypes` set includes "app_firewall" for virtual domain
   - Verify resource type detection logic in `parseCommandArgs()`
   - Check if there's a priority/ordering issue when resource appears in multiple domains

2. 🔍 **Clarify intended domain for app_firewall**
   - Should it be in `waf` domain only?
   - Should it be in `virtual` domain only?
   - Should it be in BOTH domains with proper routing?
   - Update IMPLEMENTATION_SUMMARY.md accordingly

3. 🔍 **Verify API endpoint paths**
   - WAF domain API path: `/api/config/namespaces/{namespace}/app_firewalls`
   - Virtual domain API path: (needs verification)
   - Ensure operation definitions match actual domain usage

### Long-Term (For Architecture)

1. 📋 **Document domain assignment strategy**
   - When should resources appear in multiple domains?
   - How should executor handle resource type conflicts across domains?
   - Should there be a priority order for domain resolution?

2. 📋 **Add validation tests**
   - Test resource creation for every domain/resource combination in domains_generated.ts
   - Verify created resources match expected types
   - Catch domain routing regressions automatically

## Test Results So Far

### Phase 1: Help System Verification

#### Test 1.1: Domain-level Help

- ✅ **WAF domain**: app_firewall appears in help output (needs verification)
- ❌ **Virtual domain**: app_firewall shown but doesn't work correctly

#### Test 1.2: Creation Behavior

- ✅ **WAF domain**: Creates correct app_firewall resource
- ❌ **Virtual domain**: Creates origin_pool instead

## Next Steps

1. Update testing plan to use `waf` domain
2. Complete all 13 test phases with corrected commands
3. Document all findings in final test report
4. Create GitHub issue for domain routing investigation
5. Update IMPLEMENTATION_SUMMARY.md if domain is confirmed as `waf`

## Files to Review

- `src/types/domains_generated.ts` - Domain definitions
- `src/repl/executor.ts` - Resource type routing logic
- `src/types/operations_generated.ts` - API operation definitions
- `IMPLEMENTATION_SUMMARY.md` - Documentation
- Manual testing plan - Command corrections needed

## Conclusion

The test plan contains an incorrect assumption about the domain location. Testing must proceed using the `waf` domain to properly validate app_firewall functionality. A separate investigation is needed to determine if the `virtual` domain routing is a bug or if the domains_generated.ts file is incorrect.

**Impact**: ALL test phases affected
**Workaround**: Use `waf` domain for all tests
**Risk**: Medium - Could indicate broader domain routing issues
