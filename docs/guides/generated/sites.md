# 🌍 Sites

AWS, Azure, GCP VPC integration with transit gateways. Label-based selection for policy application across regions.

**Category:** Infrastructure

## CLI Examples

### List Aws

List all AWS VPC sites

```bash
xcsh sites list aws_vpc_site
```

### Get Aws

Get AWS VPC site details

```bash
xcsh sites get aws_vpc_site my-aws-site -o yaml
```

### List Azure

List all Azure VNet sites

```bash
xcsh sites list azure_vnet_site
```

## Use Cases

- Deploy F5 XC across cloud providers (AWS, Azure, GCP)
- Manage XCKS (Managed Kubernetes) site deployments (formerly AppStack)
- Deploy Secure Mesh sites for networking-focused edge deployments
- Integrate external Kubernetes clusters as Customer Edge
- Configure AWS VPC, Azure VNet, and GCP VPC sites
- Manage virtual sites and site policies

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `site` | Site | Standard | None |
| `virtual_site` | Virtual site | Standard | None |
| `site_mesh_group` | Site mesh group | Advanced | site |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Cloud Infrastructure](cloud_infrastructure.md) | AWS, Azure, GCP connectors and VPC attachments. |
| [Managed Kubernetes](managed_kubernetes.md) | Cluster RBAC, pod security, and container registries. |

---

*Generated from enriched API specs and local xcsh examples.*
