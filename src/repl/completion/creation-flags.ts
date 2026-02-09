/**
 * Creation Flags Registry
 *
 * Defines resource-specific flags for create/apply actions.
 * When a user types "create healthcheck <tab>", they should see
 * creation flags (--name, --type, etc.) instead of existing resource names.
 */

import { getConflictsForFlag as getGeneratedConflicts } from "../../types/conflicts_generated.js";

/**
 * Definition for a creation flag
 */
export interface CreationFlagDefinition {
  /** The full flag name (e.g., "--type") */
  name: string;
  /** Description shown in completion menu */
  description: string;
  /** Whether this flag is required for resource creation */
  required: boolean;
  /** Whether this flag expects a value */
  hasValue: boolean;
  /** Type of value expected */
  valueType?: "string" | "integer" | "enum";
  /** Allowed values for enum types */
  enumValues?: string[];
  /** Whether this flag can be specified multiple times (e.g., origin servers) */
  isRepeatable?: boolean;
  /** Maximum number of times the flag can be used (for repeatable flags) */
  maxOccurrences?: number;
  /** Default value from API spec */
  defaultValue?: unknown;
  /** Whether this has a server-applied default (x-f5xc-server-default: true) */
  hasServerDefault?: boolean;
  /** Recommended value for production deployments (from x-f5xc-recommended-value) */
  recommendedValue?: unknown;
  /**
   * Resource type values for which this flag is applicable.
   * If undefined or empty, flag applies to ALL types (common flags).
   * @example ["http"] - flag only applies when --type is "http"
   * @example ["tcp", "udp-icmp"] - flag applies to multiple types
   */
  applicableTypes?: string[];
  /**
   * Conditional visibility based on another flag's value.
   * This flag is only shown when the specified parent flag has one of the allowed values.
   * Enables hierarchical flag systems where child flags appear only when parent
   * flag has specific values (e.g., circuit breaker details only when mode is "custom").
   *
   * @example
   * {
   *   name: "--cb-connection-limit",
   *   conditionalOn: { flagName: "--circuit-breaker", values: ["custom"] }
   * }
   * // This flag is only shown when user has entered "--circuit-breaker custom"
   */
  conditionalOn?: {
    /** Name of parent flag to check (e.g., "--circuit-breaker") */
    flagName: string;
    /** Array of values that enable this flag (OR condition) */
    values: string[];
  };
  /**
   * Display priority for flag ordering in completion suggestions.
   * Lower numbers = higher priority (shown first).
   *
   * Default priorities:
   * - 1-9: Critical flags (--name, --type)
   * - 10: Required flags without explicit priority
   * - 50: Optional flags
   * - 100: Global flags
   *
   * Flags with the same priority are sorted alphabetically.
   *
   * @example
   * priority: 1  // --name (shown first)
   * priority: 2  // --type (shown second)
   * priority: 10 // Other required flags (default)
   *
   * @default 10 for required flags, 50 for optional flags
   */
  priority?: number;
  /**
   * List of flag names that conflict with this flag.
   * Derived from x-f5xc-conflicts-with API extension.
   * When this flag is used, none of the conflicting flags can be used.
   *
   * @example
   * conflictsWith: ["--use-origin-server-name"] // Cannot use with this flag
   */
  conflictsWith?: string[];
}

/**
 * Healthcheck creation flags
 * Based on F5 XC healthcheck resource schema v2.0.31
 *
 * Enhancements in v2.0.31:
 * - Server defaults: expected_status_codes, headers, request_headers_to_remove,
 *   use_http2, use_origin_server_name, jitter_percent
 * - Recommended production values: interval=15, timeout=3, healthy_threshold=3,
 *   unhealthy_threshold=1, jitter_percent=30
 * - New field: headers (custom HTTP headers to add)
 * - New field: expected_status_codes (repeatable array with range support)
 *
 * Breaking Changes:
 * - --expected-status removed, replaced by --expected-status-codes
 *
 * @see https://docs.cloud.f5.com/docs-v2/platform/reference/api-ref/healthcheck
 */
export const HEALTHCHECK_CREATION_FLAGS: CreationFlagDefinition[] = [
  // Required flags
  {
    name: "--name",
    description: "Resource name",
    required: true,
    hasValue: true,
    valueType: "string",
    priority: 1, // Highest priority - always first
  },
  {
    name: "--type",
    description: "Health check type (http, tcp, udp-icmp)",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["http", "tcp", "udp-icmp"],
    defaultValue: "http",
    recommendedValue: "http",
    priority: 2, // Second highest - determines available options
  },
  {
    name: "--interval",
    description: "Interval between checks (1-600 sec)",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 15,
    recommendedValue: 15,
  },
  {
    name: "--timeout",
    description: "Timeout for each check (1-600 sec)",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 3,
    recommendedValue: 3,
  },
  {
    name: "--healthy-threshold",
    description: "Successes before healthy (1-16)",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 3,
    recommendedValue: 3,
  },
  {
    name: "--unhealthy-threshold",
    description: "Failures before unhealthy (1-16)",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 1,
    recommendedValue: 1,
  },
  // Optional flags with server defaults
  {
    name: "--jitter-percent",
    description: "Random jitter as percent of interval (0 or 10-50)",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 30,
    recommendedValue: 30,
    hasServerDefault: true,
  },
  // HTTP-specific (conditionally required when type=http)
  {
    name: "--path",
    description: "HTTP path to check",
    required: false,
    hasValue: true,
    valueType: "string",
    applicableTypes: ["http"],
    priority: 5, // Type-specific flags appear after --type but before other required
  },
  {
    name: "--expected-status-codes",
    description: "Expected HTTP status code or range (e.g., '200', '200-299')",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 16,
    applicableTypes: ["http"],
    priority: 5,
    hasServerDefault: true,
    defaultValue: [],
  },
  {
    name: "--host-header",
    description:
      "Custom Host header value (conflicts with --use-origin-server-name)",
    required: false,
    hasValue: true,
    valueType: "string",
    applicableTypes: ["http"],
    priority: 5,
    conflictsWith: ["--use-origin-server-name"],
  },
  {
    name: "--headers",
    description: "Custom HTTP header to add (format: 'Key:Value')",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 16,
    applicableTypes: ["http"],
    priority: 5,
    hasServerDefault: true,
    defaultValue: {},
  },
  {
    name: "--use-origin-server-name",
    description:
      "Use origin server hostname as Host header (conflicts with --host-header, recommended)",
    required: false,
    hasValue: false,
    applicableTypes: ["http"],
    priority: 5,
    hasServerDefault: true,
    defaultValue: {},
    conflictsWith: ["--host-header"],
  },
  {
    name: "--use-http2",
    description: "Use HTTP/2",
    required: false,
    hasValue: false,
    applicableTypes: ["http"],
    priority: 5, // Type-specific flags appear after --type but before other required
    hasServerDefault: true,
    defaultValue: false,
  },
  {
    name: "--request-headers-to-remove",
    description: "HTTP header to remove from health check request",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 16,
    applicableTypes: ["http"],
    priority: 5, // Type-specific flags appear after --type but before other required
    hasServerDefault: true,
    defaultValue: [],
  },

  // TCP-specific flags
  {
    name: "--expected-response",
    description:
      "Expected response payload (plain text or hex, max 2048 chars)",
    required: false,
    hasValue: true,
    valueType: "string",
    applicableTypes: ["tcp"],
    priority: 5, // Type-specific flags appear after --type but before other required
  },
  {
    name: "--send-payload",
    description:
      "Payload to send in TCP request (plain text or hex, max 2048 chars)",
    required: false,
    hasValue: true,
    valueType: "string",
    applicableTypes: ["tcp"],
    priority: 5, // Type-specific flags appear after --type but before other required
  },
];

/**
 * Origin Pool creation flags
 * Based on F5 XC origin_pool resource schema
 */
export const ORIGIN_POOL_CREATION_FLAGS: CreationFlagDefinition[] = [
  // Required - Name
  {
    name: "--name",
    description: "Origin pool name",
    required: true,
    hasValue: true,
    valueType: "string",
    priority: 1, // Highest priority - always first
  },

  // Origin Server Types (ALL 10 - REPEATABLE) - Priority 15-20
  {
    name: "--public-ip",
    description: "Public IP origin server",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 15,
  },
  {
    name: "--public-name",
    description: "Public DNS name origin",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 15,
  },
  {
    name: "--private-ip",
    description: "Private IP origin (site required)",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 16,
  },
  {
    name: "--private-name",
    description: "Private DNS name origin (site required)",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 16,
  },
  {
    name: "--k8s-service",
    description: "Kubernetes service origin (format: namespace/service)",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 17,
  },
  {
    name: "--consul-service",
    description: "Consul service origin",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 17,
  },
  {
    name: "--cbip-service",
    description: "Cloud-based IP service",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 17,
  },
  {
    name: "--custom-endpoint",
    description: "Custom endpoint object reference",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 18,
  },
  {
    name: "--vn-private-ip",
    description: "Virtual network private IP",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 19,
  },
  {
    name: "--vn-private-name",
    description: "Virtual network private DNS name",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    priority: 19,
  },

  // Site reference (for private origins) - Priority 20
  {
    name: "--site",
    description: "Site reference for private origins",
    required: false,
    hasValue: true,
    valueType: "string",
    priority: 20,
  },

  // Port configuration (mutually exclusive group) - Priority 25-26
  {
    name: "--port",
    description: "Backend port (1-65535)",
    required: false,
    hasValue: true,
    valueType: "integer",
    recommendedValue: 443,
    priority: 25,
  },
  {
    name: "--automatic-port",
    description: "Use automatic port selection",
    required: false,
    hasValue: false,
    priority: 26,
  },
  {
    name: "--lb-port",
    description: "Use load balancer port",
    required: false,
    hasValue: false,
    priority: 26,
  },

  // TLS Configuration - Priority 32
  {
    name: "--no-tls",
    description: "Disable TLS for origin connections",
    required: false,
    hasValue: false,
    priority: 32,
  },
  {
    name: "--use-tls",
    description: "Enable TLS for origin connections",
    required: false,
    hasValue: false,
    priority: 32,
  },

  // Load Balancing Algorithm - Priority 35
  {
    name: "--algorithm",
    description: "Load balancing algorithm",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: [
      "ROUND_ROBIN",
      "LEAST_REQUEST",
      "RANDOM",
      "SOURCE_IP_STICKINESS",
      "COOKIE_STICKINESS",
      "RING_HASH",
      "LB_OVERRIDE",
    ],
    defaultValue: "ROUND_ROBIN",
    hasServerDefault: true,
    recommendedValue: "LB_OVERRIDE",
    priority: 35,
  },

  // Health Checks (repeatable, max 4) - Priority 38
  {
    name: "--health-check",
    description: "Health check reference",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 4,
    priority: 38,
  },

  // Connection Pool - Parent Flag (Priority 30)
  {
    name: "--connection-pool",
    description: "Connection pool reuse mode (HTTP/S only)",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["default", "enable-reuse", "disable-reuse"],
    recommendedValue: "enable-reuse",
    priority: 30,
  },

  // Health Check Port - Parent Flag (Priority 35)
  {
    name: "--health-check-port-source",
    description: "Health check port configuration",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["same-as-endpoint", "custom"],
    priority: 35,
  },

  // Health Check Port - Child Flag (only shown when --health-check-port-source=custom)
  {
    name: "--health-check-port",
    description: "Custom port for health checks (1-65535)",
    required: false,
    hasValue: true,
    valueType: "integer",
    conditionalOn: {
      flagName: "--health-check-port-source",
      values: ["custom"],
    },
    priority: 36,
  },

  // Endpoint Selection (Priority 40)
  {
    name: "--endpoint-selection",
    description: "Endpoint selection policy",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["DISTRIBUTED", "LOCAL_ONLY", "LOCAL_PREFERRED"],
    defaultValue: "DISTRIBUTED",
    hasServerDefault: true,
    recommendedValue: "LOCAL_PREFERRED",
    priority: 40,
  },

  // Advanced Timeouts (Priority 45)
  {
    name: "--connection-timeout",
    description: "Connection timeout in milliseconds (default: 2000)",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 2000,
    priority: 45,
  },
  {
    name: "--http-idle-timeout",
    description: "HTTP idle timeout in milliseconds (default: 300000)",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 300000,
    priority: 45,
  },

  // Circuit Breaker - Parent Flag (Priority 50)
  {
    name: "--circuit-breaker",
    description: "Circuit breaker configuration mode",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["default", "disable", "custom"],
    defaultValue: "default",
    hasServerDefault: true,
    priority: 50,
  },

  // Circuit Breaker - Child Flags (only shown when --circuit-breaker=custom)
  {
    name: "--cb-connection-limit",
    description: "Circuit breaker connection limit (0-32768)",
    required: false,
    hasValue: true,
    valueType: "integer",
    conditionalOn: { flagName: "--circuit-breaker", values: ["custom"] },
    priority: 51,
  },
  {
    name: "--cb-max-requests",
    description: "Circuit breaker max requests (0-32768)",
    required: false,
    hasValue: true,
    valueType: "integer",
    conditionalOn: { flagName: "--circuit-breaker", values: ["custom"] },
    priority: 51,
  },
  {
    name: "--cb-max-pending-requests",
    description: "Circuit breaker max pending requests (0-32768)",
    required: false,
    hasValue: true,
    valueType: "integer",
    conditionalOn: { flagName: "--circuit-breaker", values: ["custom"] },
    priority: 51,
  },
  {
    name: "--cb-priority",
    description: "Circuit breaker priority (DEFAULT, HIGH)",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["DEFAULT", "HIGH"],
    conditionalOn: { flagName: "--circuit-breaker", values: ["custom"] },
    priority: 51,
  },

  // Outlier Detection - Parent Flag (Priority 55)
  {
    name: "--outlier-detection",
    description: "Outlier detection configuration mode",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["disable", "custom"],
    priority: 55,
  },

  // Outlier Detection - Child Flags (only shown when --outlier-detection=custom)
  {
    name: "--od-consecutive-5xx",
    description: "Consecutive 5xx errors before ejection (0-1024)",
    required: false,
    hasValue: true,
    valueType: "integer",
    conditionalOn: { flagName: "--outlier-detection", values: ["custom"] },
    priority: 56,
  },
  {
    name: "--od-consecutive-gateway-failure",
    description: "Consecutive gateway failures before ejection (0-1024)",
    required: false,
    hasValue: true,
    valueType: "integer",
    conditionalOn: { flagName: "--outlier-detection", values: ["custom"] },
    priority: 56,
  },
  {
    name: "--od-max-ejection-percent",
    description: "Maximum ejection percentage (0-100)",
    required: false,
    hasValue: true,
    valueType: "integer",
    conditionalOn: { flagName: "--outlier-detection", values: ["custom"] },
    priority: 56,
  },
  {
    name: "--od-base-ejection-time",
    description: "Base ejection time in milliseconds",
    required: false,
    hasValue: true,
    valueType: "integer",
    conditionalOn: { flagName: "--outlier-detection", values: ["custom"] },
    priority: 56,
  },

  // Panic Threshold - Parent Flag (Priority 60)
  {
    name: "--panic-threshold-mode",
    description: "Panic threshold configuration mode",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["none", "percentage"],
    priority: 60,
  },

  // Panic Threshold - Child Flag (only shown when --panic-threshold-mode=percentage)
  {
    name: "--panic-threshold",
    description: "Panic threshold percentage (0-100)",
    required: false,
    hasValue: true,
    valueType: "integer",
    conditionalOn: {
      flagName: "--panic-threshold-mode",
      values: ["percentage"],
    },
    priority: 61,
  },

  // Subset Load Balancing - Parent Flag (Priority 65)
  {
    name: "--subset-lb",
    description: "Subset load balancing mode",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["disable", "enable"],
    priority: 65,
  },

  // Subset Load Balancing - Child Flags (only shown when --subset-lb=enable)
  {
    name: "--subset-keys",
    description: "Subset key groups (comma-separated)",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 32,
    conditionalOn: { flagName: "--subset-lb", values: ["enable"] },
    priority: 66,
  },
  {
    name: "--subset-default-fallback",
    description:
      "Default subset fallback policy (ANY_ENDPOINT, DEFAULT_SUBSET)",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["ANY_ENDPOINT", "DEFAULT_SUBSET"],
    conditionalOn: { flagName: "--subset-lb", values: ["enable"] },
    priority: 66,
  },

  // HTTP Protocol - Parent Flag (Priority 70)
  {
    name: "--http-protocol",
    description: "HTTP protocol configuration mode",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["auto", "http1", "http2"],
    priority: 70,
  },

  // HTTP Protocol - Child Flags
  {
    name: "--http1-header-transform",
    description: "HTTP/1.1 header transformation type",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: [
      "legacy_header_transformation",
      "proper_case_header_transformation",
      "default_header_transformation",
    ],
    conditionalOn: { flagName: "--http-protocol", values: ["http1"] },
    priority: 71,
  },
  {
    name: "--http2-enabled",
    description: "Enable HTTP/2 (true/false)",
    required: false,
    hasValue: true,
    valueType: "string",
    conditionalOn: { flagName: "--http-protocol", values: ["http2"] },
    priority: 71,
  },

  // Proxy Protocol - Parent Flag (Priority 75)
  {
    name: "--proxy-protocol",
    description: "Proxy protocol mode",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["disable", "v1", "v2"],
    priority: 75,
  },

  // Source IP Persistence - Parent Flag (Priority 80)
  {
    name: "--source-ip-persistence",
    description: "Source IP based persistence mode",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["disable", "enable"],
    priority: 80,
  },
];

/**
 * HTTP Load Balancer creation flags
 * Based on F5 XC http_loadbalancer resource schema
 *
 * Core flags for creating an HTTP/HTTPS load balancer with virtual hosts,
 * origin pools, and advanced traffic management features.
 */
export const HTTP_LOADBALANCER_CREATION_FLAGS: CreationFlagDefinition[] = [
  // Required - Name
  {
    name: "--name",
    description: "HTTP load balancer name",
    required: true,
    hasValue: true,
    valueType: "string",
    priority: 1,
  },

  // Domains (virtual hosts) - Priority 10
  {
    name: "--domain",
    description: "Domain name for virtual host (e.g., example.com)",
    required: false,
    hasValue: true,
    valueType: "string",
    isRepeatable: true,
    maxOccurrences: 64,
    priority: 10,
  },

  // Port Configuration - Priority 15
  {
    name: "--http-port",
    description: "HTTP listening port (default: 80)",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 80,
    hasServerDefault: true,
    priority: 15,
  },
  {
    name: "--https-port",
    description: "HTTPS listening port (default: 443)",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 443,
    hasServerDefault: true,
    recommendedValue: 443,
    priority: 15,
  },

  // TLS Configuration - Priority 20
  {
    name: "--tls-certificate",
    description: "TLS certificate reference for HTTPS",
    required: false,
    hasValue: true,
    valueType: "string",
    priority: 20,
  },
  {
    name: "--http-redirect",
    description: "Redirect HTTP to HTTPS automatically",
    required: false,
    hasValue: false,
    priority: 21,
  },

  // Origin Pool - Priority 25
  {
    name: "--origin-pool",
    description: "Default origin pool for backend traffic",
    required: false,
    hasValue: true,
    valueType: "string",
    priority: 25,
  },

  // Advertise Policy - Priority 30
  {
    name: "--advertise-policy",
    description: "Where to advertise this load balancer",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["INTERNET", "VIRTUAL_SITE", "CUSTOM"],
    recommendedValue: "INTERNET",
    priority: 30,
  },

  // WAF/Security - Priority 40
  {
    name: "--app-firewall",
    description: "Application firewall (WAF) policy reference",
    required: false,
    hasValue: true,
    valueType: "string",
    priority: 40,
  },
  {
    name: "--service-policy",
    description: "Service policy reference for rate limiting",
    required: false,
    hasValue: true,
    valueType: "string",
    priority: 41,
  },

  // Advanced Features - Priority 50+
  {
    name: "--enable-api-discovery",
    description: "Enable automatic API endpoint discovery",
    required: false,
    hasValue: false,
    priority: 50,
  },
  {
    name: "--bot-defense",
    description: "Bot defense policy reference",
    required: false,
    hasValue: true,
    valueType: "string",
    priority: 51,
  },
  {
    name: "--enable-ddos",
    description: "Enable DDoS protection",
    required: false,
    hasValue: false,
    priority: 52,
  },
];

/**
 * Application Firewall (WAF) creation flags
 * Based on F5 XC app_firewall resource schema
 *
 * Core flags for creating a Web Application Firewall policy with
 * detection controls, blocking modes, and attack signatures.
 */
export const APP_FIREWALL_CREATION_FLAGS: CreationFlagDefinition[] = [
  // Required - Name
  {
    name: "--name",
    description: "Application firewall name",
    required: true,
    hasValue: true,
    valueType: "string",
    priority: 1,
  },

  // Blocking Mode - Priority 10
  {
    name: "--blocking-mode",
    description: "WAF enforcement mode",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["MONITORING", "BLOCKING"],
    defaultValue: "MONITORING",
    hasServerDefault: true,
    recommendedValue: "BLOCKING",
    priority: 10,
  },

  // Detection Settings - Priority 15
  {
    name: "--detection-mode",
    description: "Attack detection sensitivity",
    required: false,
    hasValue: true,
    valueType: "enum",
    enumValues: ["LOW", "MEDIUM", "HIGH", "CUSTOM"],
    defaultValue: "MEDIUM",
    hasServerDefault: true,
    recommendedValue: "HIGH",
    priority: 15,
  },

  // Attack Types - Priority 20
  {
    name: "--enable-sql-injection",
    description: "Enable SQL injection detection",
    required: false,
    hasValue: false,
    priority: 20,
  },
  {
    name: "--enable-xss",
    description: "Enable cross-site scripting (XSS) detection",
    required: false,
    hasValue: false,
    priority: 20,
  },
  {
    name: "--enable-command-injection",
    description: "Enable command injection detection",
    required: false,
    hasValue: false,
    priority: 20,
  },

  // Violation Settings - Priority 30
  {
    name: "--allowed-response-codes",
    description: "Allowed HTTP response codes (comma-separated)",
    required: false,
    hasValue: true,
    valueType: "string",
    priority: 30,
  },
  {
    name: "--max-request-size",
    description: "Maximum request size in bytes",
    required: false,
    hasValue: true,
    valueType: "integer",
    defaultValue: 10485760,
    priority: 31,
  },

  // Advanced Features - Priority 40+
  {
    name: "--enable-api-protection",
    description: "Enable API-specific protection",
    required: false,
    hasValue: false,
    priority: 40,
  },
  {
    name: "--enable-bot-protection",
    description: "Enable bot detection integration",
    required: false,
    hasValue: false,
    priority: 41,
  },
  {
    name: "--enable-threat-campaigns",
    description: "Enable threat campaign protection",
    required: false,
    hasValue: false,
    priority: 42,
  },
];

/**
 * Registry mapping resource types to their creation flags
 */
export const CREATION_FLAGS_REGISTRY = new Map<
  string,
  CreationFlagDefinition[]
>([
  ["healthcheck", HEALTHCHECK_CREATION_FLAGS],
  ["origin_pool", ORIGIN_POOL_CREATION_FLAGS],
  ["http_loadbalancer", HTTP_LOADBALANCER_CREATION_FLAGS],
  ["app_firewall", APP_FIREWALL_CREATION_FLAGS],
]);

/**
 * Get creation flags for a resource type
 * @param resourceType - The resource type name (e.g., "healthcheck")
 * @returns Array of creation flag definitions, or empty array if not defined
 */
export function getCreationFlags(
  resourceType: string,
): CreationFlagDefinition[] {
  return CREATION_FLAGS_REGISTRY.get(resourceType) ?? [];
}

/**
 * Check if a resource type has creation flags defined
 * @param resourceType - The resource type name
 * @returns true if creation flags are defined for this resource type
 */
export function hasCreationFlags(resourceType: string): boolean {
  return CREATION_FLAGS_REGISTRY.has(resourceType);
}

/**
 * Get all flag names (including aliases) for a resource type
 * Used for filtering out already-used flags
 */
export function getAllCreationFlagNames(resourceType: string): Set<string> {
  const flags = getCreationFlags(resourceType);
  const names = new Set<string>();

  for (const flag of flags) {
    names.add(flag.name);
  }

  return names;
}

/**
 * Get conflicts for a flag, combining static definitions and spec-generated data.
 *
 * Priority:
 * 1. Static conflicts from flag's `conflictsWith` property (manual overrides)
 * 2. Dynamic conflicts from x-f5xc-conflicts-with in OpenAPI spec
 *
 * @param flagName - The flag name (e.g., "--host-header")
 * @param resourceType - Optional resource type to look up static conflicts
 * @returns Array of conflicting flag names (e.g., ["--use-origin-server-name"])
 */
export function getConflictsForFlag(
  flagName: string,
  resourceType?: string,
): string[] {
  const conflicts = new Set<string>();

  // First, check static conflicts from flag definitions
  if (resourceType) {
    const flags = getCreationFlags(resourceType);
    const flagDef = flags.find((f) => f.name === flagName);
    if (flagDef?.conflictsWith) {
      for (const conflict of flagDef.conflictsWith) {
        conflicts.add(conflict);
      }
    }
  }

  // Then, add dynamic conflicts from generated spec data
  const generatedConflicts = getGeneratedConflicts(flagName);
  for (const conflict of generatedConflicts) {
    conflicts.add(conflict);
  }

  return Array.from(conflicts);
}
