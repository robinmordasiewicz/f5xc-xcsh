# 🌐 Dns

Authoritative zone hosting with BIND and AXFR imports. Health checks, failover policies, and request logging.

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
| [Virtual](virtual.md) | HTTP, TCP, UDP load balancers and origin pools. |
| [Network](network.md) | BGP peering, IPsec tunnels, and segment policies. |

---

*Generated from enriched API specs and local xcsh examples.*
