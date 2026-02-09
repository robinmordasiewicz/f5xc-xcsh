/**
 * AI Assistant Guide Builder
 * Generates progressive disclosure content for AI-friendly resource specs
 */

import type {
  AIAssistantGuide,
  CommonPattern,
  FieldGuide,
  FieldInfo,
  FieldSpec,
  OneOfGroup,
  QuickStart,
  Troubleshooting,
  ValidationRules,
} from "./types.js";

/**
 * Build complete AI assistant guide for a resource type
 * @param resourceType - Resource type (e.g., "healthcheck", "origin_pool")
 * @param fields - Field specifications from OpenAPI
 * @param oneOfGroups - OneOf groups for mutually exclusive choices
 * @returns Complete AI assistant guide
 */
export function buildAIAssistantGuide(
  resourceType: string,
  fields: FieldSpec[],
  oneOfGroups: OneOfGroup[],
): AIAssistantGuide {
  return {
    purpose: buildPurpose(resourceType),
    quickStart: buildQuickStart(resourceType, fields),
    commonPatterns: buildCommonPatterns(resourceType, fields),
    fieldGuide: buildFieldGuide(fields),
    validationSteps: buildValidationRules(oneOfGroups, fields),
    bestPractices: buildBestPractices(resourceType),
    troubleshooting: buildTroubleshooting(resourceType),
  };
}

/**
 * Build purpose statement for a resource type
 */
function buildPurpose(resourceType: string): string {
  const purposes: Record<string, string> = {
    healthcheck:
      "Health checks monitor the health of origin servers to ensure traffic is only sent to healthy endpoints.",
    origin_pool:
      "Origin pools define groups of backend servers that handle requests, with load balancing and health checking.",
    app_firewall:
      "Web Application Firewalls protect applications from common web attacks and vulnerabilities.",
    http_loadbalancer:
      "HTTP load balancers distribute traffic across origin pools with advanced routing and security features.",
    tcp_loadbalancer:
      "TCP load balancers handle Layer 4 traffic distribution for non-HTTP protocols.",
  };

  return (
    purposes[resourceType] ||
    `${resourceType.replace(/_/g, " ")} resource for F5 Distributed Cloud configuration.`
  );
}

/**
 * Build best practices for a resource type
 */
function buildBestPractices(resourceType: string): string[] {
  const practicesByType: Record<string, string[]> = {
    healthcheck: [
      "Set timeout < interval (recommended: timeout = interval / 5)",
      "Use healthy_threshold >= 2 to avoid flapping",
      "Match health check type to your backend protocol",
      "Test health check endpoints independently before deployment",
    ],
    origin_pool: [
      "Always attach health checks to monitor origin server health",
      "Use LEAST_REQUEST algorithm for better performance distribution",
      "Group similar origins in the same pool (same protocol, similar latency)",
      "Set appropriate connection timeouts based on backend response times",
    ],
    app_firewall: [
      "Start with monitoring mode before enabling blocking",
      "Review and tune signature selection for your application",
      "Use custom rules for application-specific protection",
      "Regularly review and update WAF policies",
    ],
  };

  return (
    practicesByType[resourceType] || [
      `Follow F5 XC documentation for ${resourceType.replace(/_/g, " ")} configuration`,
      "Test configuration changes in non-production environments first",
      "Use meaningful names and labels for resource organization",
    ]
  );
}

/**
 * Build quick start guide with minimum required fields
 * @param resourceType - Resource type
 * @param fields - Field specifications
 * @returns Quick start guide
 */
export function buildQuickStart(
  resourceType: string,
  fields: FieldSpec[],
): QuickStart {
  // Collect required fields
  const requiredFields = fields
    .filter((f) => f.required || f.extensions.requiredFor?.create)
    .map((f) => f.name);

  // Collect recommended defaults
  const recommendedDefaults: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.extensions.recommendedValue !== undefined) {
      recommendedDefaults[field.name] = field.extensions.recommendedValue;
    }
  }

  // Build simple working example
  const exampleObject = buildSimpleExample(resourceType, fields);

  return {
    description: `Quickest path to a working ${resourceType}`,
    minimumRequiredFields: requiredFields,
    recommendedDefaults,
    simpleExample: {
      description: `Basic ${resourceType} with recommended settings`,
      json: JSON.stringify(exampleObject, null, 2),
    },
  };
}

/**
 * Build a simple working example from field specifications
 */
function buildSimpleExample(
  resourceType: string,
  fields: FieldSpec[],
): Record<string, unknown> {
  const example: Record<string, unknown> = {
    metadata: {
      name: `example-${resourceType}`,
      namespace: "default",
    },
    spec: {},
  };

  const spec = example.spec as Record<string, unknown>;

  for (const field of fields) {
    // Skip metadata fields (already handled)
    if (field.name === "metadata") continue;

    // Use recommended value if available
    if (field.extensions.recommendedValue !== undefined) {
      spec[field.name] = field.extensions.recommendedValue;
      continue;
    }

    // Use example value if available
    if (field.extensions.example !== undefined) {
      spec[field.name] = field.extensions.example;
      continue;
    }

    // Only include required fields in simple example
    if (!field.required && !field.extensions.requiredFor?.create) {
      continue;
    }

    // Generate appropriate value based on type
    spec[field.name] = getDefaultValueForType(
      field.constraints.type,
      field.name,
    );
  }

  return example;
}

/**
 * Get a reasonable default value for a given type
 */
function getDefaultValueForType(type: string, fieldName: string): unknown {
  switch (type) {
    case "string":
      return `example-${fieldName}`;
    case "integer":
    case "number":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    default:
      return null;
  }
}

/**
 * Build common patterns for specific use cases
 * @param resourceType - Resource type
 * @param _fields - Field specifications (will be used in Phase 3)
 * @returns Array of common patterns
 */
export function buildCommonPatterns(
  resourceType: string,
  _fields: FieldSpec[],
): CommonPattern[] {
  switch (resourceType) {
    case "healthcheck":
      return [
        {
          name: "simple-http-check",
          description: "Basic HTTP health check for web servers",
          useCase: "Monitor HTTP endpoints with standard settings",
          example: {
            json: JSON.stringify(
              {
                metadata: {
                  name: "http-health",
                  namespace: "default",
                },
                spec: {
                  http_health_check: {
                    path: "/health",
                    use_origin_server_name: {},
                  },
                  interval: 15,
                  timeout: 3,
                  unhealthy_threshold: 1,
                  healthy_threshold: 3,
                },
              },
              null,
              2,
            ),
          },
        },
        {
          name: "tcp-with-payload",
          description: "TCP health check with payload verification",
          useCase: "Monitor databases or custom protocols",
          example: {
            json: JSON.stringify(
              {
                metadata: {
                  name: "tcp-health",
                  namespace: "default",
                },
                spec: {
                  tcp_health_check: {
                    send_payload: "PING",
                    receive_payload: "PONG",
                  },
                  interval: 10,
                  timeout: 5,
                  unhealthy_threshold: 2,
                  healthy_threshold: 2,
                },
              },
              null,
              2,
            ),
          },
        },
        {
          name: "udp-icmp-ping",
          description: "ICMP ping health check",
          useCase: "Basic connectivity verification",
          example: {
            json: JSON.stringify(
              {
                metadata: {
                  name: "ping-health",
                  namespace: "default",
                },
                spec: {
                  udp_icmp_health_check: {},
                  interval: 30,
                  timeout: 10,
                  unhealthy_threshold: 3,
                  healthy_threshold: 1,
                },
              },
              null,
              2,
            ),
          },
        },
      ];
    case "origin_pool":
      return [
        {
          name: "public-ip-pool",
          description: "Pool with public IP addresses",
          useCase: "External origins via internet",
          example: {
            json: JSON.stringify(
              {
                metadata: {
                  name: "public-origins",
                  namespace: "default",
                },
                spec: {
                  origin_servers: [
                    {
                      public_ip: {
                        ip: "203.0.113.10",
                      },
                    },
                    {
                      public_ip: {
                        ip: "203.0.113.11",
                      },
                    },
                  ],
                  port: 80,
                  loadbalancer_algorithm: "ROUND_ROBIN",
                },
              },
              null,
              2,
            ),
          },
        },
        {
          name: "k8s-service-pool",
          description: "Pool with Kubernetes services",
          useCase: "Internal cluster services",
          example: {
            json: JSON.stringify(
              {
                metadata: {
                  name: "k8s-backend",
                  namespace: "default",
                },
                spec: {
                  origin_servers: [
                    {
                      k8s_service: {
                        service_name: "backend.default",
                        site_locator: {
                          site: {
                            namespace: "system",
                            name: "my-vk8s",
                          },
                        },
                      },
                    },
                  ],
                  port: 8080,
                  loadbalancer_algorithm: "LEAST_REQUEST",
                },
              },
              null,
              2,
            ),
          },
        },
      ];
    case "app_firewall":
      return [
        {
          name: "basic-waf",
          description: "Basic WAF with default ruleset",
          useCase: "Standard web application protection",
          example: {
            json: JSON.stringify(
              {
                metadata: {
                  name: "basic-waf",
                  namespace: "default",
                },
                spec: {
                  blocking: {},
                  detection_settings: {
                    signature_selection_setting: {
                      default_attack_type_settings: {},
                    },
                  },
                },
              },
              null,
              2,
            ),
          },
        },
      ];
    default:
      // Generic pattern for unknown resource types
      return [
        {
          name: "basic-config",
          description: `Basic ${resourceType} configuration`,
          useCase: `Standard ${resourceType} setup`,
          example: {
            json: JSON.stringify(
              {
                metadata: {
                  name: `example-${resourceType}`,
                  namespace: "default",
                },
                spec: {},
              },
              null,
              2,
            ),
          },
        },
      ];
  }
}

/**
 * Build field guide organized by importance
 * @param fields - Field specifications
 * @returns Field guide categorized by required/recommended/optional
 */
export function buildFieldGuide(fields: FieldSpec[]): FieldGuide {
  // TODO: Implement in Phase 3
  return {
    required: fields
      .filter((f) => f.required || f.extensions.requiredFor?.create)
      .map((f) => toFieldInfo(f, "Required for resource creation")),
    recommended: fields
      .filter((f) => f.extensions.recommendedValue !== undefined)
      .map((f) =>
        toFieldInfo(f, `Recommended: ${f.extensions.recommendedValue}`),
      ),
    optional: fields
      .filter((f) => !f.required && !f.extensions.recommendedValue)
      .map((f) => toFieldInfo(f, "Optional field")),
  };
}

/**
 * Build validation rules from oneOf groups and field dependencies
 * @param oneOfGroups - OneOf groups from schema
 * @param fields - Field specifications
 * @returns Validation rules
 */
export function buildValidationRules(
  oneOfGroups: OneOfGroup[],
  fields: FieldSpec[],
): ValidationRules {
  // TODO: Implement in Phase 3
  const mutuallyExclusive = oneOfGroups.map((group) => ({
    fields: group.variants,
    reason: `Only one ${group.groupName} type allowed`,
    recommendation: group.recommendedVariant
      ? `Use ${group.recommendedVariant} for most cases`
      : "Choose based on your use case",
  }));

  const dependencies = fields
    .filter(
      (f) =>
        f.extensions.conflictsWith && f.extensions.conflictsWith.length > 0,
    )
    .map((f) => ({
      field: f.name,
      requires: f.extensions.conflictsWith || [],
      reason: "Field conflict detected in schema",
    }));

  return { mutuallyExclusive, dependencies };
}

/**
 * Build troubleshooting section with common issues
 * @param resourceType - Resource type
 * @returns Array of troubleshooting entries
 */
export function buildTroubleshooting(resourceType: string): Troubleshooting[] {
  const common: Troubleshooting[] = [
    {
      issue: "Resource creation fails with validation error",
      solution: "Check required fields and mutually exclusive groups",
      relatedFields: ["metadata.name", "metadata.namespace"],
    },
    {
      issue: "Resource name already exists",
      solution: "Choose a unique name or delete the existing resource first",
      relatedFields: ["metadata.name", "metadata.namespace"],
    },
  ];

  switch (resourceType) {
    case "healthcheck":
      return [
        ...common,
        {
          issue: "Health check fails immediately",
          solution:
            "Verify timeout < interval. Recommended: timeout = interval / 5",
          relatedFields: ["spec.timeout", "spec.interval"],
        },
        {
          issue: "Origins never marked healthy",
          solution: "Check expected status codes and paths match your backend",
          relatedFields: [
            "spec.http_health_check.path",
            "spec.http_health_check.expected_status_codes",
          ],
        },
        {
          issue: "Health check type not working",
          solution:
            "Ensure only one of http_health_check, tcp_health_check, or udp_icmp_health_check is specified",
          relatedFields: [
            "spec.http_health_check",
            "spec.tcp_health_check",
            "spec.udp_icmp_health_check",
          ],
        },
        {
          issue: "TCP health check payload not matching",
          solution:
            "Verify send_payload and receive_payload match your backend protocol",
          relatedFields: [
            "spec.tcp_health_check.send_payload",
            "spec.tcp_health_check.receive_payload",
          ],
        },
      ];
    case "origin_pool":
      return [
        ...common,
        {
          issue: "Origins fail health checks",
          solution:
            "Attach health check resource and verify origin server connectivity",
          relatedFields: ["spec.healthcheck", "spec.origin_servers"],
        },
        {
          issue: "Load balancing not distributing evenly",
          solution:
            "Check loadbalancer_algorithm setting. ROUND_ROBIN for even distribution, LEAST_REQUEST for efficiency",
          relatedFields: ["spec.loadbalancer_algorithm"],
        },
        {
          issue: "Cannot mix origin server types",
          solution:
            "Use only one type: public_ip, k8s_service, or private_ip per pool",
          relatedFields: ["spec.origin_servers"],
        },
        {
          issue: "Port not connecting",
          solution:
            "Verify port matches your backend service. Default is 80 for HTTP, 443 for HTTPS",
          relatedFields: ["spec.port"],
        },
      ];
    case "app_firewall":
      return [
        ...common,
        {
          issue: "WAF blocking legitimate traffic",
          solution:
            "Review detection settings and consider using monitoring mode first",
          relatedFields: ["spec.blocking", "spec.detection_settings"],
        },
        {
          issue: "Signature updates not applying",
          solution: "Check signature_selection_setting configuration",
          relatedFields: [
            "spec.detection_settings.signature_selection_setting",
          ],
        },
      ];
    default:
      return common;
  }
}

/**
 * Convert FieldSpec to FieldInfo with AI hint
 * @param field - Field specification
 * @param aiHint - AI-specific guidance
 * @returns Field info for AI guide
 */
function toFieldInfo(field: FieldSpec, aiHint: string): FieldInfo {
  const constraints: FieldInfo["constraints"] = {};

  if (field.constraints.minimum !== undefined) {
    constraints.min = field.constraints.minimum;
  }
  if (field.constraints.maximum !== undefined) {
    constraints.max = field.constraints.maximum;
  }
  if (field.constraints.enum !== undefined) {
    constraints.enum = field.constraints.enum;
  }
  if (field.constraints.pattern !== undefined) {
    constraints.pattern = field.constraints.pattern;
  }

  return {
    path: field.name, // Will be enhanced with full path in Phase 3
    name: field.name,
    type: field.constraints.type,
    description: field.description,
    aiHint,
    recommendedValue: field.extensions.recommendedValue,
    example: field.extensions.example,
    constraints,
  };
}
