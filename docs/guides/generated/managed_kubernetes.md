# ⚙️ Managed Kubernetes

Kubernetes role bindings and admission policies. Registry integration for EKS, AKS, and GKE workloads.

**Category:** Infrastructure

## Use Cases

- Manage XCKS (Managed Kubernetes) cluster RBAC and security
- Configure pod security policies and admission controllers
- Manage container registries for enterprise deployments
- Integrate with external Kubernetes clusters (EKS, AKS, GKE)

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `mk8s_cluster` | MK8s cluster | Advanced | None |
| `k8s_cluster_role` | K8s cluster role | Advanced | None |
| `container_registry` | Container registry | Advanced | None |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Container Services](container_services.md) | Containerized workloads and virtual Kubernetes clusters. |
| [Sites](sites.md) | Cloud and edge node deployments. |
| [Service Mesh](service_mesh.md) | Microservice routing and sidecar configuration. |

---

*Generated from enriched API specs and local xcsh examples.*
