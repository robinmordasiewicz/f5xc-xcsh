/**
 * Known relationship patterns between resource types
 *
 * This registry defines which resource types are known to reference other resource types,
 * enabling faster dependency detection through targeted queries.
 */

import type { RelationshipPattern } from "./types.js";

/**
 * Registry of known resource relationship patterns
 *
 * Patterns are ordered by priority (lower number = higher priority).
 * Higher priority patterns are checked first during dependency detection.
 */
export const RELATIONSHIP_REGISTRY: RelationshipPattern[] = [
  // Core Virtual Resources (Priority 1 - Most Common)
  {
    sourceType: "origin_pool",
    referencedBy: [
      "http_loadbalancer",
      "tcp_loadbalancer",
      "cdn",
      "api",
      "container_services",
      "threat_campaign",
    ],
    searchFields: [
      "spec.pools",
      "spec.default_pool",
      "spec.origin_pools",
      "spec.pool",
      "spec.origin_pool",
    ],
    priority: 1,
  },
  {
    sourceType: "healthcheck",
    referencedBy: [
      "origin_pool",
      "http_loadbalancer",
      "tcp_loadbalancer",
      "dns",
      "sites",
      "service_mesh",
      "container_services",
    ],
    searchFields: [
      "spec.healthcheck",
      "spec.health_check",
      "spec.health_checks",
    ],
    priority: 1,
  },

  // Security Resources (Priority 1 - Critical for Security Operations)
  {
    sourceType: "bot_defense",
    referencedBy: [
      "http_loadbalancer",
      "cdn",
      "waf",
      "api",
      "threat_campaign",
      "network_security",
      "ai_services",
      "bigip",
      "marketplace",
      "shape",
      "statistics",
      "tenant_and_identity",
    ],
    searchFields: [
      "spec.bot_defense",
      "spec.bot_defense_advanced",
      "spec.bot_defense_javascript_injection",
      "spec.bot_defense_policy",
    ],
    priority: 1,
  },
  {
    sourceType: "app_firewall",
    referencedBy: [
      "http_loadbalancer",
      "cdn",
      "waf",
      "api",
      "network_security",
      "marketplace",
      "ai_services",
      "bigip",
      "tenant_and_identity",
    ],
    searchFields: [
      "spec.app_firewall",
      "spec.waf",
      "spec.security_policy",
      "spec.app_firewall_per_route",
    ],
    priority: 1,
  },
  {
    sourceType: "rate_limiter",
    referencedBy: [
      "http_loadbalancer",
      "api",
      "cdn",
      "waf",
      "network_security",
      "billing_and_usage",
      "rate_limiting",
    ],
    searchFields: [
      "spec.inline_rate_limiter",
      "spec.ref_rate_limiter",
      "spec.rate_limiter",
      "spec.custom_rate_limiter",
    ],
    priority: 1,
  },

  // Infrastructure Resources (Priority 1 - Referenced by 20+ domains each)
  {
    sourceType: "certificate",
    referencedBy: [
      "http_loadbalancer",
      "api",
      "cdn",
      "dns",
      "network_security",
      "service_mesh",
      "authentication",
      "bigip",
      "cloud_infrastructure",
      "container_services",
      "managed_kubernetes",
      "ddos",
      "blindfold",
      "bot_and_threat_defense",
      "ce_management",
      "data_and_privacy_security",
      "nginx_one",
    ],
    searchFields: [
      "spec.certificate",
      "spec.certificates",
      "spec.tls",
      "spec.tls_config",
      "spec.tls_cert_params",
      "spec.trusted_ca",
      "spec.certificate_chain",
    ],
    priority: 1,
  },
  {
    sourceType: "service_policy",
    referencedBy: [
      "virtual_site",
      "virtual_network",
      "api",
      "network",
      "network_security",
      "dns",
      "managed_kubernetes",
      "container_services",
      "observability",
      "tenant_and_identity",
      "bigip",
      "billing_and_usage",
      "blindfold",
      "bot_and_threat_defense",
      "marketplace",
      "secops_and_incident_response",
      "statistics",
      "users",
    ],
    searchFields: ["spec.service_policy", "spec.policies", "spec.policy"],
    priority: 1,
  },

  // Network Resources (Priority 2)
  {
    sourceType: "network_policy",
    referencedBy: [
      "network_security",
      "shape",
      "sites",
      "tenant_and_identity",
      "waf",
    ],
    searchFields: [
      "spec.network_policy",
      "spec.network_policy_content",
      "spec.no_network_policy",
    ],
    priority: 2,
  },

  // API Resources (Priority 2)
  {
    sourceType: "api_definition",
    referencedBy: ["http_loadbalancer", "api", "cdn"],
    searchFields: [
      "spec.api_definition",
      "spec.api_definitions",
      "spec.openapi",
      "spec.api_definition_ref",
    ],
    priority: 2,
  },
  {
    sourceType: "route",
    referencedBy: ["http_loadbalancer"],
    searchFields: ["spec.routes", "spec.route", "spec.routing_rules"],
    priority: 2,
  },
];

/**
 * Get related domains that might reference a given resource type
 *
 * @param resourceType - The resource type to find referencing domains for
 * @returns Array of domain names that might reference this resource type
 */
export function getRelatedDomains(resourceType: string): string[] {
  const pattern = RELATIONSHIP_REGISTRY.find(
    (p) => p.sourceType === resourceType,
  );
  return pattern?.referencedBy ?? [];
}

/**
 * Get search fields for a relationship pattern
 *
 * @param resourceType - The resource type to get search fields for
 * @returns Array of field paths to check, or undefined if no pattern exists
 */
export function getSearchFields(resourceType: string): string[] | undefined {
  const pattern = RELATIONSHIP_REGISTRY.find(
    (p) => p.sourceType === resourceType,
  );
  return pattern?.searchFields;
}

/**
 * Check if a resource type has known relationship patterns
 *
 * @param resourceType - The resource type to check
 * @returns True if relationship patterns are known, false otherwise
 */
export function hasKnownRelationships(resourceType: string): boolean {
  return RELATIONSHIP_REGISTRY.some((p) => p.sourceType === resourceType);
}

/**
 * Get all relationship patterns sorted by priority
 *
 * @returns All patterns sorted by priority (ascending)
 */
export function getAllPatternsByPriority(): RelationshipPattern[] {
  return [...RELATIONSHIP_REGISTRY].sort((a, b) => a.priority - b.priority);
}
