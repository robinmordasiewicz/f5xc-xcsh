# Testing Dependency Detection Feature

## Overview

The automatic resource dependency detection feature is now integrated into the CLI. When a delete operation fails with "resource is in use", the CLI will automatically query related domains to find which resources are preventing the deletion.

## Manual Testing Steps

### Test 1: Origin Pool with Load Balancer Dependency

**Scenario:** Try to delete an origin pool that is referenced by a load balancer.

```bash
# Start the CLI
./dist/index.js

# Expected behavior when trying to delete an in-use origin pool:
xcsh> /virtual delete origin_pool --name foo

# OLD ERROR (before this feature):
ERROR: Cannot delete origin_pool 'foo' - resource is in use
Tip: Check 'list http_loadbalancer' or 'list tcp_loadbalancer' to find which load balancers use this pool

# NEW ERROR (with automatic detection):
ERROR: Cannot delete origin_pool 'foo' - resource is in use

Referenced by 2 resource(s) across 1 domain(s):
  http_loadbalancer:
    - my-frontend-lb (in spec.pools[].origin_pool)
    - my-api-lb (in spec.default_pool)

Tip: Delete the resources listed above first, then retry
```

### Test 2: Healthcheck with Multiple Dependencies

**Scenario:** Try to delete a healthcheck that is referenced by multiple resources.

```bash
xcsh> /virtual delete healthcheck --name my-healthcheck

# Expected output shows ALL resources that reference it:
ERROR: Cannot delete healthcheck 'my-healthcheck' - resource is in use

Referenced by 3 resource(s) across 2 domain(s):
  origin_pool:
    - pool-1 (in spec.healthcheck)
  http_loadbalancer:
    - lb-1 (in spec.health_check)
    - lb-2 (in spec.health_check)

Tip: Delete the resources listed above first, then retry
```

### Test 3: Resource with No Known Dependencies

**Scenario:** Try to delete a resource type that doesn't have known relationship patterns.

```bash
xcsh> /virtual delete custom_resource --name foo

# Expected fallback behavior (detection times out or finds nothing):
ERROR: Cannot delete custom_resource 'foo' - resource is in use
Tip: Check if any other resources reference this before deleting
```

### Test 4: Performance Check

**Scenario:** Verify that detection completes quickly (< 3 seconds).

```bash
# Time the delete operation
time xcsh -c "/virtual delete origin_pool --name foo"

# Should complete in < 3 seconds total
# Detection itself should be < 500ms for known patterns
```

## Expected Behavior Summary

### What Changed

**Before:**

- Generic error messages with manual tips ("Check 'list X' to find dependencies")
- User had to manually query multiple domains
- Suggestions to use external tools (web console, support)

**After:**

- Automatic dependency detection queries related domains
- Shows actual resource names and where they reference the deleted resource
- Self-contained - no external tool suggestions
- Fast (<3s timeout with graceful fallback)

### Key Features

1. **Automatic Detection:** Queries related domains in parallel to find dependencies
2. **Detailed Output:** Shows domain, resource name, and field path of each reference
3. **Grouped Display:** Groups references by domain for readability
4. **Fast Performance:** Tier 1 known patterns complete in < 500ms
5. **Graceful Fallback:** If detection fails/times out, shows generic tip

### Performance Targets

- Known patterns (Tier 1): < 500ms
- Detection timeout: 3 seconds maximum
- Parallel queries: 5 domains at a time
- No impact on successful deletes

## Debugging

If dependency detection doesn't work as expected:

1. **Check console output:** Detection logs debug information

   ```bash
   # Set debug logging
   export DEBUG=xcsh:*
   ./dist/index.js
   ```

2. **Verify relationship patterns:** Check `src/dependencies/relationships.ts` for the resource type

3. **Test detection directly:** Use the test script

   ```bash
   npm run test -- dependency
   ```

## Known Limitations

1. **Tier 1 Only (v1):** Currently implements only known relationship patterns
2. **Same Namespace:** Only searches current namespace (not cross-namespace)
3. **Resource Name Matching:** Searches by resource name, not UUID
4. **API Limitations:** Cannot detect dependencies if API doesn't return referring_objects

## Next Steps (Future Enhancements)

1. **Tier 2 Detection:** Field-based discovery for unknown resource types
2. **Cross-Namespace:** Search all namespaces for references
3. **UUID Matching:** Search by UUID in addition to name
4. **Cascade Delete:** Option to delete all dependent resources automatically
5. **Dependency Graph:** Show full dependency tree visualization
