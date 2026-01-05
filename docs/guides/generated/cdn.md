# 🚀 Cdn

Path-based policies with TTL controls and header conditions. Purge operations, access logs, and cache eligibility for multi-region deployments.

**Category:** Networking

## Use Cases

- Configure CDN load balancing
- Manage content delivery network services
- Configure caching policies
- Manage data delivery and distribution

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `cdn_loadbalancer` | CDN load balancer | Standard | cdn_origin_pool |
| `cdn_origin_pool` | CDN origin pool | Standard | None |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Virtual](virtual.md) | HTTP, TCP, UDP load balancers and origin pools. |

---

*Generated from enriched API specs and local xcsh examples.*
