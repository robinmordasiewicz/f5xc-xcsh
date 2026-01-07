# ⏱️ Rate Limiting

Time-based quota enforcement with configurable windows in hours, minutes, or seconds. Protocol-specific controls for traffic shaping.

**Category:** Networking

## Use Cases

- Configure rate limiter policies
- Manage policer configurations
- Control traffic flow and queuing

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `rate_limiter` | Rate limiter | Standard | None |
| `rate_limiter_policy` | Rate limiter policy | Standard | None |
| `rate_limit_threshold` | Rate limit threshold | Standard | None |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Virtual](virtual.md) | HTTP, TCP, UDP load balancing with origin pools. |
| [Network Security](network_security.md) | NAT policies, firewalls, and segment connections. |

---

*Generated from enriched API specs and local xcsh examples.*
