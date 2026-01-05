# 🔌 Network

Border gateway protocol with ASN management and autonomous system relationships. Site-to-site VPN linking datacenters through encrypted channels.

**Category:** Networking

## Use Cases

- Configure BGP routing and ASN management
- Manage IPsec tunnels and IKE phases
- Configure network connectors and routes
- Manage SRv6 and subnetting
- Define segment connections and policies
- Configure IP prefix sets

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `virtual_network` | Virtual network | Standard | None |
| `network_connector` | Network connector | Advanced | virtual_network |
| `site_mesh_group` | Site mesh group | Advanced | site |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Virtual](virtual.md) | HTTP, TCP, UDP load balancers and origin pools. |
| [Network Security](network_security.md) | NAT policies, firewalls, and segment connections. |
| [Dns](dns.md) | Zones, record types, and load balancing. |

---

*Generated from enriched API specs and local xcsh examples.*
