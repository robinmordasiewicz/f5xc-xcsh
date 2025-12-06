# Acceptable Differences

This document lists the known acceptable differences between the original F5 vesctl binary and our implementation. These differences are intentional or expected due to API evolution and design choices.

## 1. Resource List Differences (API Evolution)

The original vesctl was built against older F5 XC API specifications. Our implementation uses current API specs, resulting in:

### Deprecated Resources (22)
Resources in original but not in current API specs:
- These resources no longer exist in the F5 XC API
- Attempting to use them would fail on the server anyway
- Not reimplemented as they are obsolete

### New Resources (151)
Resources in current API specs but not in original:
- New F5 XC features and capabilities
- Our implementation supports all current API endpoints

**Test Impact**: Commands like `vesctl configuration list --help` will show different available resources. This is expected.

---

## 2. Version Output Format

| Aspect | Original | Ours |
|--------|----------|------|
| Format | HTML with `<br>` tags | Structured YAML |
| Content | Version info embedded in markup | Clean key-value pairs |

**Example - Original:**
```
vesctl version 0.2.35<br>commit: abc123<br>...
```

**Example - Ours:**
```yaml
version: 0.1.0
commit: abc123
buildDate: 2024-01-01
```

**Rationale**: YAML is more machine-parseable and consistent with modern CLI tools.

---

## 3. Enhancement Commands

Our implementation includes additional commands not present in the original:

| Command | Purpose | Status |
|---------|---------|--------|
| `configure` | Interactive CLI setup wizard | Enhancement |
| `login` | Authenticate with F5 XC | Enhancement |
| `logout` | Clear authentication | Enhancement |
| `whoami` | Display current identity | Enhancement |

**Test Impact**: These commands will show as "unknown command" when compared against the original. This is expected.

---

## 3a. Enhanced Command Flags

Some commands have additional flags for improved usability:

### `request rpc` Command

| Flag | Purpose | Original |
|------|---------|----------|
| `--http-method` | HTTP method (GET, POST, PUT, DELETE) | Not present |
| `-i, --input-file` | File containing request data (YAML or JSON) | Not present |
| `-n, --namespace` | Namespace for the API call | Not present |
| `--uri` | URI path for the API call | Not present |

**Rationale**: These flags provide a more complete and usable RPC interface.

**Test Impact**: The `request rpc --help` output will show additional flags. This is expected.

---

## 4. Original Binary TLS Bug (EXIT_MISMATCH)

### Critical Bug in Original vesctl v0.2.36+

Versions 0.2.36 and later of the original vesctl have a fatal TLS bug that causes crashes:

```
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation]
...
crypto/tls.(*CertificateRequestInfo).SupportsCertificate(0x0, 0x1400010e040)
```

### Working Version for Testing

- **Use version 0.2.35 on Linux amd64** for compatibility testing
- This is the last working version before the TLS regression
- No working macOS arm64 version exists

### Test Impact

When running tests against buggy original versions (0.2.36+), you will see:

- **EXIT_MISMATCH**: Original exits with code 2 (panic), ours exits with 0 (success)
- **All API operations affected**: list, get, create, replace, delete

**Interpretation**: EXIT_MISMATCH results where our exit code is 0 and original is 2 indicate **our implementation works correctly** while the original crashes.

---

## 5. Help Text Minor Differences

### Flag Descriptions

Some flag descriptions may have minor wording differences for clarity improvements.

### Example Text

Example commands in help text may show different placeholder values:

| Original | Ours |
|----------|------|
| `vesctl configuration list namespace` | `vesctl cfg list namespace` |

**Rationale**: Both are valid; ours may prefer shorter aliases.

---

## 6. Error Message Formatting

Error messages convey the same information but may have different formatting:

| Aspect | Original | Ours |
|--------|----------|------|
| Repeated errors | May show twice | Shows once |
| Error prefix | `Error:` | `error:` |

**Test Impact**: Error style tests use pattern matching to verify errors contain the same key phrases regardless of exact formatting.

---

## Test Result Classification

| Result | Meaning | Action Required |
|--------|---------|-----------------|
| `PASS` | Output identical | None |
| `PASS_ERROR` | Both errored consistently | None |
| `STDOUT_DIFFERS` | Output different | Review diff |
| `EXIT_MISMATCH` | Different exit codes | Check if original crashed (exit 2) |
| `STDERR_DIFFERS` | Error output different | Warning only |
| `FAIL` | Significant difference | Investigate |

### Triaging EXIT_MISMATCH

1. Check `original.exit` and `ours.exit` files
2. If original is 2 and ours is 0: Original crashed, ours works (acceptable)
3. If original is 0 and ours is non-zero: Bug in our implementation (fix needed)
4. If both non-zero but different: Review error handling

---

## 7. Delete Namespace Command

The original vesctl does **not** have a `delete namespace` subcommand. When running `vesctl configuration delete namespace`, the original shows the parent `delete` command help with all available subcommands (which does not include `namespace`).

### Available Namespace Operations in Original vesctl

| Operation | Command | Original | Ours |
|-----------|---------|----------|------|
| Create | `configuration create namespace` | ✓ | ✓ |
| Get | `configuration get namespace` | ✓ | ✓ |
| List | `configuration list namespace` | ✓ | ✓ |
| Replace | `configuration replace namespace` | ✓ | ✓ |
| Delete | `configuration delete namespace` | ✗ | ✓ |

### Test Impact

- `help-delete-namespace`: Original shows parent `delete` help, ours shows `delete namespace` help
- `delete-first`, `delete-second`: Original fails/shows help, ours performs the delete
- `delete-nonexistent`: Different exit codes due to missing subcommand in original

**Rationale**: Our implementation adds the missing `delete namespace` capability for completeness. This is an enhancement.

---

## 8. Response Format Validation Bug (Original)

The original vesctl has a bug where it rejects valid `--response-format` values for the `get` command.

### Original Behavior (Bug)

```
$ vesctl configuration get namespace test-ns --response-format GET_RSP_FORMAT_READ
Error: Invalid value GET_RSP_FORMAT_READ for response-format
```

### Our Behavior (Correct)

Our implementation accepts all valid response-format values including `GET_RSP_FORMAT_READ`, `GET_RSP_FORMAT_REPLACE_REQUEST`, etc.

### Test Impact

- `get-response-proto`: Original errors with exit code 1, ours succeeds with exit code 0

**Rationale**: We do NOT replicate bugs from the original. Our implementation correctly accepts valid API response format values.

---

## 9. Create Test Race Condition (Test Framework Limitation)

The create tests (`create-from-file`, `create-second-namespace`) run both binaries sequentially against the same API. This creates a race condition:

1. First binary creates the namespace successfully
2. Second binary gets HTTP 409 "Object already exists" error

### Test Configuration

The test framework runs our version first for create tests (`--ours-first` flag). This means:

- **Ours**: Creates namespace successfully (exit 0)
- **Original**: Gets 409 conflict error (exit 1)

### Test Impact

- `create-from-file`, `create-second-namespace`: EXIT_MISMATCH due to race condition
- `create-duplicate-error`: Both get 409 (original created first, then both fail on duplicate)

**Rationale**: Both binaries behave correctly for their respective scenarios. The EXIT_MISMATCH is due to test framework limitations, not implementation differences.

---

## Summary

These differences are documented and accepted:

1. **Resource list**: API evolution (22 deprecated, 151 new)
2. **Version format**: HTML vs YAML (design choice)
3. **Enhancement commands**: configure, login, logout, whoami
3a. **Enhanced command flags**: Additional flags on `request rpc` for usability
4. **TLS bug crashes**: Original v0.2.36+ crashes on API calls
5. **Minor help text**: Wording improvements
6. **Error formatting**: Style differences only
7. **Delete namespace**: Command missing in original (our enhancement)
8. **Response format validation**: Original rejects valid values (our fix)
9. **Create test race condition**: Test framework limitation, not implementation difference
