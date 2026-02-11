# ⚖️ Virtual

Traffic distribution across regions with routing rules. Health checks and failover policies.

**Category:** Networking

## Use Cases

- Configure HTTP/TCP/UDP load balancers
- Manage origin pools and services
- Configure virtual hosts and routing
- Define rate limiter and service policies
- Manage geo-location-based routing
- Configure proxy and forwarding policies
- Manage malware protection and threat campaigns
- Configure health checks and endpoint monitoring

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `http_loadbalancer` | HTTP load balancer | Standard | origin_pool |
| `tcp_loadbalancer` | TCP load balancer | Standard | origin_pool |
| `origin_pool` | Origin pool | Standard | None |
| `healthcheck` | Health check | Standard | None |
| `app_firewall` | WAF policy | Advanced | None |
| `service_policy` | Service policy | Advanced | None |
| `malicious_user_detection` | Malicious user detection | Advanced | None |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Dns](dns.md) | Authoritative zones and record management. |
| [Network](network.md) | BGP peering, IPsec tunnels, and segment policies. |

---

*Generated from enriched API specs and local xcsh examples.*
