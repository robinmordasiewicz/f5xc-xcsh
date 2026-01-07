# ⚖️ Virtual

Traffic distribution across regions with routing rules. Health checks and failover policies.

**Category:** Networking

## CLI Examples

### List

List all HTTP load balancers

```bash
xcsh virtual list http_loadbalancer
```

**Output:**

```text
NAME           NAMESPACE    DOMAINS              STATUS
example-lb     default      example.com          ACTIVE
api-lb         production   api.example.com      ACTIVE
```

### Get

Get HTTP load balancer details

```bash
xcsh virtual get http_loadbalancer example-lb -ns default -o yaml
```

**Output:**

```text
metadata:
  name: example-lb
  namespace: default
spec:
  domains:
    - example.com
  default_route_pools:
    - pool:
        name: my-origin-pool
        namespace: default
```

### Create

Create HTTP load balancer from file

```bash
xcsh virtual create http_loadbalancer -f lb.yaml
```

### Delete

Delete HTTP load balancer

```bash
xcsh virtual delete http_loadbalancer example-lb -ns default
```

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

## CLI Workflows

### Deploy Basic HTTP Load Balancer

Step-by-step guide to deploy a basic HTTP load balancer

1. Create an origin pool pointing to backend servers

```bash
xcsh virtual create origin_pool -f origin-pool.yaml
```

2. Create a health check (optional)

```bash
xcsh virtual create healthcheck -f healthcheck.yaml
```

3. Create the HTTP load balancer

```bash
xcsh virtual create http_loadbalancer -f lb.yaml
```

4. Verify deployment

```bash
xcsh virtual get http_loadbalancer example-lb -ns default
```

## Related Domains

| Domain | Description |
|--------|-------------|
| [Dns](dns.md) | Authoritative zones and record management. |
| [Service Policy](service_policy.md) |  |
| [Network](network.md) | BGP peering, IPsec tunnels, and segment policies. |

---

*Generated from enriched API specs and local xcsh examples.*
