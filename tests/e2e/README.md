# End-to-End CRUD Tests

This directory contains end-to-end tests that make **REAL API calls** to F5 Distributed Cloud and create **REAL resources**.

## ⚠️ IMPORTANT WARNINGS

- **REAL API CALLS**: These tests create actual resources in your F5 XC tenant
- **REQUIRES AUTHENTICATION**: You must be logged in with valid credentials
- **CREATES RESOURCES**: Resources are created in the specified namespace
- **AUTOMATIC CLEANUP**: Tests clean up after themselves, but failures may leave orphaned resources
- **NETWORK REQUIRED**: Requires connectivity to F5 XC API endpoints
- **API RATE LIMITS**: Running many tests may hit rate limits

## Prerequisites

### 1. Authentication

You must be authenticated with F5 XC. Choose one method:

## Option A: Login via xcsh CLI

```bash
xcsh login create profile --name test-tenant
# Follow prompts to authenticate
xcsh login use profile --name test-tenant
```

## Option B: Environment Variable

```bash
export VESCTL_API_TOKEN="your-api-token-here"
```

## Option C: Configuration File

```bash
# Create ~/.xcsh/config.yaml with your credentials
```

### 2. Permissions

Your credentials must have permissions to:

- Create origin_pool resources
- Read origin_pool resources
- Delete origin_pool resources
- List origin_pool resources

Minimum required role: **Origin Pool Admin** or equivalent

### 3. Network Access

- Outbound HTTPS access to F5 XC API endpoints
- No firewall blocking API calls
- DNS resolution for F5 XC domains

## Running the Tests

### Verify Authentication First

```bash
# Verify you're logged in
xcsh login show context

# Should show your tenant and profile
```

### Run All E2E Tests

```bash
npm test tests/e2e/origin-pool-crud.test.ts
```

### Run Specific Test Category

```bash
# Run only minimal command tests
npm test tests/e2e/origin-pool-crud.test.ts -t "Minimal Command"

# Run only circuit breaker tests
npm test tests/e2e/origin-pool-crud.test.ts -t "Circuit Breaker"

# Run only CRUD lifecycle test
npm test tests/e2e/origin-pool-crud.test.ts -t "FULL CRUD"
```

### Run with Verbose Output

```bash
npm test tests/e2e/origin-pool-crud.test.ts -- --reporter=verbose
```

## Test Configuration

### Namespace

Tests default to `default` namespace. To change:

```typescript
// Edit tests/e2e/origin-pool-crud.test.ts
const TEST_NAMESPACE = "your-namespace";
```

### Resource Naming

Resources are created with unique names:

```bash
xcsh-test-{category}-{timestamp}-{random}
```

Example: `xcsh-test-minimal-1705516800123-456`

### Timeouts

- Default test timeout: 60 seconds
- Complex operations: 90 seconds
- Authentication check: 30 seconds

## What Gets Tested

### ✅ Test Coverage

## Category 1: Minimal Command (3 tests)

- Create with smart defaults
- Read created resource
- Delete resource

## Category 2: Multiple Origins (2 tests)

- Multiple public IPs
- Multiple public names

## Category 3: Circuit Breaker (3 tests)

- Default mode
- Custom mode with child flags
- Validation of invalid combinations

## Category 4: Outlier Detection (1 test)

- Custom mode with children

## Category 5: HTTP Protocol (2 tests)

- HTTP1 with header transform
- HTTP2 configuration

## Category 6: Subset Load Balancing (1 test)

- Enable with subset keys

## Category 7: Complex Multi-Feature (2 tests)

- Multiple features combined
- Full CRUD lifecycle test

## Category 8: List Operations (1 test)

- List and find resources

## Total: 15 E2E tests

### What Each Test Does

1. **CREATE**: Executes `xcsh virtual create origin_pool` with specific flags
2. **WAIT**: Allows API time for consistency (1 second)
3. **READ**: Executes `xcsh virtual get origin_pool` to verify creation
4. **VALIDATE**: Checks returned JSON matches expected structure
5. **DELETE**: Executes `xcsh virtual delete origin_pool` to clean up

## Cleanup Strategy

### Automatic Cleanup

- `afterEach` hook deletes all resources created in each test
- Even if tests fail, cleanup runs
- Resources tracked in `createdResources` array

### Manual Cleanup

If tests crash and leave orphaned resources:

```bash
# List all test resources
xcsh virtual list origin_pool --namespace default | grep xcsh-test

# Delete specific resource
xcsh virtual delete origin_pool --name xcsh-test-minimal-1705516800123-456

# Delete all test resources (DANGER!)
xcsh virtual list origin_pool --namespace default -o json | \
  jq -r '.items[] | select(.metadata.name | startswith("xcsh-test")) | .metadata.name' | \
  xargs -I {} xcsh virtual delete origin_pool --name {} --namespace default
```

## Troubleshooting

### Authentication Failures

```bash
Error: Authentication failed
```

**Solution**:

```bash
# Re-authenticate
xcsh login create profile --name test
xcsh login use profile --name test

# Verify
xcsh login show context
```

### Permission Denied

```bash
Error: Permission denied
Error: 403 Forbidden
```

**Solution**: Verify your account has origin_pool create/delete permissions

### Resource Already Exists

```bash
Error: Resource already exists
```

**Solution**: Run cleanup script or change TEST_PREFIX in test file

### Rate Limiting

```bash
Error: 429 Too Many Requests
```

**Solution**: Wait a few minutes between test runs

### Network Timeout

```bash
Error: timeout of 30000ms exceeded
```

**Solution**:

1. Check network connectivity
2. Increase timeout in test file
3. Check F5 XC API status

## Safety Features

### 1. Unique Naming

- Uses timestamp + random number
- Prevents conflicts with existing resources
- Easy to identify test resources

### 2. Automatic Cleanup

- `afterEach` hook runs even on failures
- Tracks all created resources
- Deletes in reverse order

### 3. Namespace Isolation

- Tests use specific namespace
- Won't affect other namespaces
- Can use test-only namespace

### 4. Validation First

- Authentication check before running tests
- Fails fast if not authenticated
- Verifies context before operations

## Example Test Output

```bash
✓ PREREQUISITE: Authentication > Verifies authentication is configured (500ms)
✓ CATEGORY 1: Minimal Command with Smart Defaults > CREATE: Minimal command succeeds (2.3s)
✓ CATEGORY 1: Minimal Command with Smart Defaults > READ: Can retrieve created minimal resource (3.1s)
✓ CATEGORY 1: Minimal Command with Smart Defaults > DELETE: Can delete created resource (2.8s)
✓ CATEGORY 2: Multiple Origins (PRIMARY USE CASE) > CREATE: Multiple public IPs (2.5s)
✓ CATEGORY 3: Circuit Breaker Features > CREATE: --circuit-breaker custom with children works (3.2s)
✓ CATEGORY 3: Circuit Breaker Features > VALIDATION: Child flag without parent fails (1.2s)
✓ CATEGORY 7: Complex Multi-Feature Configurations > FULL CRUD: Production-grade configuration lifecycle (5.4s)

Test Files  1 passed (1)
     Tests  15 passed (15)
   Duration  45.2s
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Configure F5 XC Auth
        run: |
          echo "${{ secrets.F5_XC_API_TOKEN }}" > ~/.xcsh/token

      - name: Run E2E Tests
        run: npm test tests/e2e/origin-pool-crud.test.ts
        timeout-minutes: 10

      - name: Cleanup on failure
        if: failure()
        run: |
          # Run cleanup script
          npm run cleanup-test-resources
```

### Environment-Specific Testing

```bash
# Development tenant
export F5_XC_TENANT="dev-tenant"
npm test tests/e2e/origin-pool-crud.test.ts

# Staging tenant
export F5_XC_TENANT="staging-tenant"
npm test tests/e2e/origin-pool-crud.test.ts

# Never run against production!
```

## Best Practices

### 1. Use Test Namespace

```bash
# Create dedicated test namespace
xcsh ... create namespace --name e2e-tests

# Update test file
const TEST_NAMESPACE = "e2e-tests";
```

### 2. Run Tests Sequentially

```bash
# Avoid parallel execution which may hit rate limits
npm test tests/e2e/origin-pool-crud.test.ts -- --no-parallel
```

### 3. Monitor Created Resources

```bash
# During test run, watch resources being created
watch -n 2 'xcsh virtual list origin_pool --namespace default | grep xcsh-test'
```

### 4. Clean Up After Failed Runs

```bash
# Add to your workflow
npm test tests/e2e/origin-pool-crud.test.ts || npm run cleanup-test-resources
```

### 5. Set Resource Quotas

```bash
# Prevent runaway resource creation
# Limit test namespace to small quotas
```

## Cost Considerations

- **API calls are metered**: Each test makes 3-5 API calls
- **Resource creation may incur costs**: Check your F5 XC pricing
- **Rate limits apply**: Too many tests = throttling
- **Network egress**: API responses consume bandwidth

**Recommendation**: Run E2E tests sparingly (pre-release, critical changes only)

## Support

If tests fail unexpectedly:

1. Check F5 XC service status
2. Verify authentication is valid
3. Check API rate limits
4. Review test logs for specific errors
5. Run cleanup script
6. Report issues with full error output
