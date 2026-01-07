# 🌐 Dns

Name resolution with zone transfers and health checks. Record types and delegation support.

**Category:** Networking

## Use Cases

- Configure DNS load balancing
- Manage DNS zones and domains
- Configure DNS compliance policies
- Manage resource record sets (RRSets)

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `dns_zone` | DNS zone | Standard | None |
| `dns_domain` | DNS domain | Standard | None |
| `dns_load_balancer` | DNS load balancer | Standard | dns_zone |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Virtual](virtual.md) | HTTP, TCP, UDP load balancing with origin pools. |
| [Network](network.md) | BGP peering, IPsec tunnels, and segment policies. |

---

*Generated from enriched API specs and local xcsh examples.*
