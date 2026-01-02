# Description Gap Analysis Report

**Generated**: 2026-01-01T22:59:21.359Z
**Spec Version**: 1.0.82

## Summary

- **Domain-level gaps**: 5
  - High severity: 5
  - Medium severity: 0
  - Low severity: 0
- **Operation-level gaps**: 441

## Domain-Level Gaps

### High Severity

#### `authentication`

- Long description is generic/placeholder
- 3-tier descriptions not properly differentiated

#### `data_intelligence`

- Long description is generic/placeholder
- 3-tier descriptions not properly differentiated

#### `telemetry_and_insights`

- Long description is generic/placeholder
- 3-tier descriptions not properly differentiated

#### `threat_campaign`

- Long description is generic/placeholder
- 3-tier descriptions not properly differentiated

#### `vpm_and_node_management`

- Long description is generic/placeholder
- 3-tier descriptions not properly differentiated

## Operation-Level Gaps

Operations missing quality descriptions or metadata.

### `shape` (78 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/shape/dip/namespaces/system/application...` | POST | Summary appears auto-generated |
| `/api/shape/dip/namespaces/system/application...` | DELETE | Description missing or too short |
| `/api/shape/dip/namespaces/system/applications...` | GET | Description missing or too short |
| `/api/shape/dip/namespaces/system/bot/asn...` | POST | Description missing or too short |
| `/api/shape/dip/namespaces/system/bot/urls...` | POST | Description missing or too short |
| `/api/shape/dip/namespaces/system/dashboard/age...` | POST | Description missing or too short |
| `/api/shape/dip/namespaces/system/dashboard/asn...` | POST | Description missing or too short |
| `/api/shape/alerts/namespaces/{namespace}/alert_gen...` | POST | Description missing or too short |
| `/api/shape/alerts/namespaces/{namespace}/alert_gen...` | GET | Description missing or too short |
| `/api/shape/alerts/namespaces/{metadata.namespace}/...` | POST | Description missing or too short |
| ... | ... | *(68 more)* |

### `tenant_and_identity` (44 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/web/namespaces/{metadata.namespace}/allowed_t...` | POST | Summary appears auto-generated |
| `/api/web/namespaces/{metadata.namespace}/allowed_t...` | PUT | Summary appears auto-generated |
| `/api/web/namespaces/{namespace}/allowed_tenants...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/authen...` | POST | Summary appears auto-generated; Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/authen...` | PUT | Summary appears auto-generated; Description missing or too short |
| `/api/config/namespaces/{namespace}/authentications...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/authentications...` | GET | Description missing or too short |
| `/api/web/namespaces/{metadata.namespace}/child_ten...` | PUT | Summary appears auto-generated |
| `/api/web/namespaces/{namespace}/child_tenants...` | GET | Summary appears auto-generated |
| `/api/web/namespaces/{metadata.namespace}/contacts...` | POST | Summary appears auto-generated |
| ... | ... | *(34 more)* |

### `network` (31 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/config/namespaces/{metadata.namespace}/addres...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/address_allocat...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/advert...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/advert...` | PUT | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/advertise_polic...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/bgps/{name}...` | DELETE | Description missing or too short |
| `/api/operate/namespaces/{namespace}/sites/{site}/v...` | GET | Description missing or too short |
| `/api/data/namespaces/{namespace}/dc_cluster_groups...` | POST | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/forwar...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/forwar...` | PUT | Summary appears auto-generated |
| ... | ... | *(21 more)* |

### `statistics` (26 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/config/namespaces/{metadata.namespace}/alert_...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/alert_...` | PUT | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/alert_policys...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/alert_policys/{...` | GET | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/alert_...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/alert_...` | PUT | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/alert_receivers...` | GET | Summary appears auto-generated |
| `/api/alert/namespaces/{namespace}/alert_receivers/...` | POST | Description missing or too short |
| `/api/discovery/namespaces/{namespace}/discovered_s...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/flow_anomalys...` | GET | Summary appears auto-generated |
| ... | ... | *(16 more)* |

### `virtual` (26 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/config/namespaces/{metadata.namespace}/cluste...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/cluste...` | PUT | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/clusters...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/clusters/{name}...` | DELETE | Description missing or too short |
| `/api/config/dns/namespaces/{metadata.namespace}/ge...` | POST | Summary appears auto-generated; Description missing or too short |
| `/api/config/dns/namespaces/{metadata.namespace}/ge...` | PUT | Summary appears auto-generated; Description missing or too short |
| `/api/config/dns/namespaces/{namespace}/geo_locatio...` | GET | Summary appears auto-generated |
| `/api/config/dns/namespaces/{namespace}/geo_locatio...` | GET | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/health...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/health...` | PUT | Summary appears auto-generated |
| ... | ... | *(16 more)* |

### `sites` (22 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/config/namespaces/{namespace}/aws_tgw_site/{n...` | POST | Description missing or too short |
| `/api/config/namespaces/{namespace}/aws_tgw_site/{n...` | POST | Description missing or too short |
| `/api/config/namespaces/{namespace}/aws_tgw_site/{n...` | POST | Description missing or too short |
| `/api/config/namespaces/{namespace}/aws_vpc_site/{n...` | POST | Description missing or too short |
| `/api/config/namespaces/{namespace}/gcp_vpc_site/{n...` | POST | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/k8s_cl...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/k8s_cl...` | PUT | Summary appears auto-generated |
| `/api/data/namespaces/system/site/{name}/status...` | POST | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/sites/...` | PUT | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/sites...` | GET | Summary appears auto-generated |
| ... | ... | *(12 more)* |

### `network_security` (17 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/config/namespaces/{namespace}/fast_acl_rules/...` | GET | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/filter...` | POST | Summary appears auto-generated; Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/filter...` | PUT | Summary appears auto-generated; Description missing or too short |
| `/api/config/namespaces/{namespace}/filter_sets...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/filter_sets/{na...` | GET | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/networ...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/networ...` | PUT | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/network_firewal...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/networ...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/networ...` | PUT | Summary appears auto-generated |
| ... | ... | *(7 more)* |

### `service_mesh` (16 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/config/namespaces/{metadata.namespace}/app_se...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/app_se...` | PUT | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/app_settings...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/app_ty...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/app_ty...` | PUT | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/app_types...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/endpoi...` | POST | Summary appears auto-generated |
| `/api/config/namespaces/{metadata.namespace}/endpoi...` | PUT | Summary appears auto-generated |
| `/api/config/namespaces/{namespace}/endpoints...` | GET | Summary appears auto-generated |
| `/api/config/namespaces/system/nfv_service/{name}/f...` | POST | Description missing or too short |
| ... | ... | *(6 more)* |

### `support` (16 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/web/namespaces/{metadata.namespace}/customer_...` | POST | Summary appears auto-generated |
| `/api/web/namespaces/{namespace}/customer_supports...` | GET | Summary appears auto-generated |
| `/api/operate/namespaces/system/sites/{site}/vpm/de...` | GET | Description missing or too short |
| `/api/operate/namespaces/system/sites/{site}/vpm/de...` | GET | Description missing or too short |
| `/api/operate/namespaces/system/sites/{site}/vpm/de...` | POST | Description missing or too short |
| `/api/operate/namespaces/{namespace}/sites/{site}/v...` | POST | Description missing or too short |
| `/api/operate/namespaces/{namespace}/sites/{site}/v...` | GET | Description missing or too short |
| `/api/operate/namespaces/{namespace}/sites/{site}/v...` | GET | Description missing or too short |
| `/api/operate/namespaces/{namespace}/sites/{site}/v...` | POST | Description missing or too short |
| `/api/operate/namespaces/{namespace}/sites/{site}/v...` | POST | Summary appears auto-generated |
| ... | ... | *(6 more)* |

### `api` (14 operations)

| Path | Method | Issues |
|------|--------|--------|
| `/api/config/namespaces/{metadata.namespace}/api_cr...` | POST | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/api_cr...` | PUT | Description missing or too short |
| `/api/config/namespaces/{namespace}/api_crawlers/{n...` | GET | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/api_de...` | POST | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/api_de...` | PUT | Description missing or too short |
| `/api/config/namespaces/{namespace}/api_definitions...` | GET | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/api_te...` | POST | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/api_te...` | PUT | Description missing or too short |
| `/api/config/namespaces/{namespace}/api_testings/{n...` | GET | Description missing or too short |
| `/api/config/namespaces/{metadata.namespace}/code_b...` | POST | Description missing or too short |
| ... | ... | *(4 more)* |

## Recommendations

### For Upstream Repository (f5xc-api-enriched)

1. **High severity domains** should be prioritized for description improvement
2. Add `x-ves-operation-metadata.purpose` to operations missing it
3. Ensure 3-tier descriptions are properly differentiated:
   - `description_short`: ~60 characters, action-oriented
   - `description_medium`: ~150 characters, adds context
   - `description`: ~500 characters, comprehensive details
4. Replace auto-generated summaries with meaningful descriptions
