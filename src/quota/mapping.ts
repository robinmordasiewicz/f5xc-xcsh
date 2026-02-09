/**
 * Quota Mapping
 *
 * Maps CLI resource types to API quota names
 */

import type { QuotaMapping } from "./types.js";

/**
 * Mapping of CLI resource types to API quota names
 *
 * This mapping is used to look up the quota name for a given resource type
 * when performing quota pre-checks before create operations.
 *
 * NOTE: Quota names are discovered from the API response at:
 * GET /api/web/namespaces/{namespace}/quota/usage
 *
 * Add new mappings as they are discovered from actual API responses.
 */
const QUOTA_MAPPINGS: QuotaMapping[] = [
  // Load Balancing
  // API returns: "HTTP Load Balancer", "TCP Load Balancer"
  {
    resourceType: "http_loadbalancer",
    quotaName: "HTTP Load Balancer",
    displayName: "HTTP Load Balancers",
  },
  {
    resourceType: "tcp_loadbalancer",
    quotaName: "TCP Load Balancer",
    displayName: "TCP Load Balancers",
  },

  // Origin & Health
  // API returns: "origin_pool" (snake_case), "Healthcheck" (title case)
  {
    resourceType: "origin_pool",
    quotaName: "origin_pool",
    displayName: "Origin Pools",
  },
  {
    resourceType: "healthcheck",
    quotaName: "Healthcheck",
    displayName: "Health Checks",
  },

  // Sites
  // API returns: "AWS VPC Site", "Azure VNET Site", "GCP VPC Site"
  {
    resourceType: "aws_vpc_site",
    quotaName: "AWS VPC Site",
    displayName: "AWS VPC Sites",
  },
  {
    resourceType: "azure_vnet_site",
    quotaName: "Azure VNET Site",
    displayName: "Azure VNET Sites",
  },
  {
    resourceType: "gcp_vpc_site",
    quotaName: "GCP VPC Site",
    displayName: "GCP VPC Sites",
  },

  // Networking
  // API returns: "Virtual Network", "Network Connector"
  {
    resourceType: "virtual_network",
    quotaName: "Virtual Network",
    displayName: "Virtual Networks",
  },
  {
    resourceType: "network_connector",
    quotaName: "Network Connector",
    displayName: "Network Connectors",
  },

  // Security
  // API returns: "Application Firewall", "Service Policy", "Rate Limiter"
  {
    resourceType: "app_firewall",
    quotaName: "Application Firewall",
    displayName: "Application Firewalls",
  },
  {
    resourceType: "service_policy",
    quotaName: "Service Policy",
    displayName: "Service Policies",
  },
  {
    resourceType: "rate_limiter",
    quotaName: "Rate Limiter",
    displayName: "Rate Limiters",
  },

  // DNS
  // API returns: "DNS Zone", "DNS Domain"
  {
    resourceType: "dns_zone",
    quotaName: "DNS Zone",
    displayName: "DNS Zones",
  },
  {
    resourceType: "dns_domain",
    quotaName: "DNS Domain",
    displayName: "DNS Domains",
  },

  // API Security
  // API returns: "API Definition"
  {
    resourceType: "api_definition",
    quotaName: "API Definition",
    displayName: "API Definitions",
  },

  // Namespaces
  // API returns: "Namespace"
  {
    resourceType: "namespace",
    quotaName: "Namespace",
    displayName: "Namespaces",
  },
];

/**
 * Lookup table for fast access by resource type
 */
const MAPPING_BY_RESOURCE_TYPE: Map<string, QuotaMapping> = new Map(
  QUOTA_MAPPINGS.map((m) => [m.resourceType, m]),
);

/**
 * Lookup table for fast access by quota name
 */
const MAPPING_BY_QUOTA_NAME: Map<string, QuotaMapping> = new Map(
  QUOTA_MAPPINGS.map((m) => [m.quotaName, m]),
);

/**
 * Get quota mapping for a CLI resource type
 *
 * @param resourceType - CLI resource type (e.g., "healthcheck")
 * @returns Quota mapping or undefined if not found
 */
export function getQuotaMapping(
  resourceType: string,
): QuotaMapping | undefined {
  return MAPPING_BY_RESOURCE_TYPE.get(resourceType);
}

/**
 * Get quota mapping by API quota name
 *
 * @param quotaName - API quota name (e.g., "health_checks")
 * @returns Quota mapping or undefined if not found
 */
export function getQuotaMappingByName(
  quotaName: string,
): QuotaMapping | undefined {
  return MAPPING_BY_QUOTA_NAME.get(quotaName);
}

/**
 * Get all known quota mappings
 *
 * @returns Array of all quota mappings
 */
export function getAllQuotaMappings(): readonly QuotaMapping[] {
  return QUOTA_MAPPINGS;
}

/**
 * Check if a resource type has a known quota mapping
 *
 * @param resourceType - CLI resource type
 * @returns true if mapping exists
 */
export function hasQuotaMapping(resourceType: string): boolean {
  return MAPPING_BY_RESOURCE_TYPE.has(resourceType);
}
