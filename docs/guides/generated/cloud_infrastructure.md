# ☁️ Cloud Infrastructure

Multi-cloud provider connections with gateway peering and network path configuration. Credential vault integration and subnet enumeration.

**Category:** Infrastructure

## Use Cases

- Connect to cloud providers (AWS, Azure, GCP)
- Manage cloud credentials and authentication
- Configure cloud connectivity and elastic provisioning
- Link and manage cloud regions

## Resource Reference

| Resource | Description | Tier | Dependencies |
|----------|-------------|------|-------------|
| `aws_vpc_site` | AWS VPC site | Standard | cloud_credentials |
| `azure_vnet_site` | Azure VNet site | Standard | cloud_credentials |
| `gcp_vpc_site` | GCP VPC site | Standard | cloud_credentials |
| `cloud_credentials` | Cloud credentials | Standard | None |

## Related Domains

| Domain | Description |
|--------|-------------|
| [Sites](sites.md) | Cloud and edge node deployments. |

---

*Generated from enriched API specs and local xcsh examples.*
