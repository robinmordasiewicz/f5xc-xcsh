# 🚀 Cdn

Global distribution with cache rules and purge operations. Performance monitoring and analytics.

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
| [Virtual](virtual.md) | HTTP, TCP, UDP load balancing with origin pools. |

---

*Generated from enriched API specs and local xcsh examples.*
