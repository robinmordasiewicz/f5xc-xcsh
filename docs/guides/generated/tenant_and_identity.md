# 🪪 Tenant And Identity

Account view configurations and admin alert channels. One-time password resets, provisioning flows, and active connection monitoring.

**Category:** Platform

## CLI Examples

### List Namespaces

List all namespaces

```bash
xcsh tenant_and_identity list namespace
```

**Output:**

```text
NAME           DESCRIPTION
default        Default namespace
shared         Shared namespace
system         System namespace
```

## Use Cases

- Manage user profiles and notification preferences
- Configure session controls and OTP settings
- Handle identity management operations
- Process initial user access requests

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `user_profile` | User profile | Standard | None |
| `session` | Session | Standard | None |
| `otp_policy` | OTP policy | Standard | None |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Users](users.md) | Account tokens, labels, and cloud-init config. |
| [Authentication](authentication.md) | Authentication management and configuration |
| [System](system.md) |  |

---

*Generated from enriched API specs and local xcsh examples.*
