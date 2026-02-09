# 📦 Container Services

Pod orchestration without full cluster complexity. Edge site execution, quota enforcement, and standardized compute profiles for distributed apps.

**Category:** Infrastructure

## Use Cases

- Deploy XCCS (Container Services) namespaces for multi-tenant workloads
- Manage container workloads with simplified orchestration
- Configure distributed edge container deployments
- Run containerized applications without full K8s complexity

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `virtual_k8s` | Virtual K8s | Advanced | None |
| `workload` | Workload | Advanced | virtual_k8s |
| `pod_security_policy` | Pod security policy | Advanced | None |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Managed Kubernetes](managed_kubernetes.md) | Cluster RBAC, pod security, and container registries. |
| [Sites](sites.md) | Cloud and edge node deployments. |
| [Service Mesh](service_mesh.md) | Microservice routing and sidecar configuration. |

---

*Generated from enriched API specs and local xcsh examples.*
