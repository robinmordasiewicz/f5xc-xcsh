# 🔒 Network Security

Firewall rules with routing decisions based on source, destination, or protocol. Segmentation isolates workloads while outbound proxies govern access.

**Category:** Security

## Use Cases

- Configure network firewall and ACL policies
- Manage NAT policies and port forwarding
- Configure policy-based routing
- Define network segments and policies
- Configure forward proxy policies

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `network_policy` | Network policy | Standard | None |
| `forward_proxy_policy` | Forward proxy policy | Advanced | None |
| `network_firewall` | Network firewall | Standard | None |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Waf](waf.md) | Request inspection, attack signatures, and bot mitigation. |
| [Api](api.md) | Interface definitions, schema validation, and grouping. |
| [Network](network.md) | BGP peering, IPsec tunnels, and segment policies. |

---

*Generated from enriched API specs and local xcsh examples.*
