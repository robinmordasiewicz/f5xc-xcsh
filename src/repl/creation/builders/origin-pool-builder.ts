/**
 * Origin Pool Resource Builder
 *
 * Converts parsed CLI flags into F5 XC API request body for origin_pool resources.
 */

import {
  ParsedCreationFlags,
  getFlagValue,
  getFlagValues,
  getFlagIntValue,
  isFlagSet,
} from "../flag-parser.js";

/**
 * Origin server type in F5 XC API
 */
interface OriginServer {
  public_ip?: { ip: string };
  public_name?: { dns_name: string };
  private_ip?: {
    ip: string;
    site_locator?: { site: { name: string; namespace: string } };
  };
  private_name?: {
    dns_name: string;
    site_locator?: { site: { name: string; namespace: string } };
  };
  k8s_service?: {
    service_name: string;
    site_locator?: { site: { name: string; namespace: string } };
  };
  consul_service?: {
    service_name: string;
    site_locator?: { site: { name: string; namespace: string } };
  };
  cbip_service?: {
    service_name: string;
    site_locator?: { site: { name: string; namespace: string } };
  };
  custom_endpoint_object?: { endpoint: { name: string; namespace: string } };
  vn_private_ip?: {
    ip: string;
    virtual_network?: { name: string; namespace: string };
  };
  vn_private_name?: {
    dns_name: string;
    virtual_network?: { name: string; namespace: string };
  };
  labels?: Record<string, string>;
}

/**
 * F5 XC Origin Pool API request body structure
 */
export interface OriginPoolRequestBody {
  metadata: {
    name: string;
    namespace: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
  };
  spec: {
    origin_servers: OriginServer[];
    port?: number;
    automatic_port?: Record<string, unknown>;
    lb_port?: Record<string, unknown>;
    loadbalancer_algorithm?:
      | "ROUND_ROBIN"
      | "LEAST_REQUEST"
      | "RANDOM"
      | "SOURCE_IP_STICKINESS"
      | "COOKIE_STICKINESS"
      | "RING_HASH";
    no_tls?: Record<string, unknown>;
    use_tls?: {
      use_host_header_as_sni?: Record<string, unknown>;
      tls_config?: {
        default_security?: Record<string, unknown>;
      };
      skip_server_verification?: Record<string, unknown>;
    };
    healthcheck?: Array<{ name: string; namespace?: string }>;
    endpoint_selection?: string;
    advanced_options?: Record<string, unknown>;
    same_as_endpoint_port?: Record<string, unknown>;
    health_check_port?: number;
    [key: string]: unknown;
  };
}

/**
 * Validation result from builder
 */
export interface BuilderValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Build origin pool API request body from parsed flags
 *
 * @param flags - Parsed creation flags
 * @param namespace - Target namespace
 * @returns Origin pool request body ready for API POST
 */
export function buildOriginPoolRequest(
  flags: ParsedCreationFlags,
  namespace: string,
): OriginPoolRequestBody {
  const name = getFlagValue(flags, "--name");
  const port = getFlagIntValue(flags, "--port");
  const algorithm = getFlagValue(flags, "--algorithm");
  const site = getFlagValue(flags, "--site");

  // Build origin servers from repeatable flags
  const originServers: OriginServer[] = [];

  // Public IP origins
  const publicIps = getFlagValues(flags, "--public-ip");
  for (const ip of publicIps) {
    originServers.push({ public_ip: { ip } });
  }

  // Public name origins
  const publicNames = getFlagValues(flags, "--public-name");
  for (const dnsName of publicNames) {
    originServers.push({ public_name: { dns_name: dnsName } });
  }

  // Private IP origins (require site)
  const privateIps = getFlagValues(flags, "--private-ip");
  for (const ip of privateIps) {
    const origin: OriginServer = {
      private_ip: { ip },
    };
    if (site) {
      (
        origin as {
          private_ip: {
            site_locator: {
              site: { name: string; namespace: string };
            };
          };
        }
      ).private_ip.site_locator = {
        site: { name: site, namespace: "system" },
      };
    }
    originServers.push(origin);
  }

  // Private name origins (require site)
  const privateNames = getFlagValues(flags, "--private-name");
  for (const dnsName of privateNames) {
    const origin: OriginServer = {
      private_name: { dns_name: dnsName },
    };
    if (site) {
      (
        origin as {
          private_name: {
            site_locator: {
              site: { name: string; namespace: string };
            };
          };
        }
      ).private_name.site_locator = {
        site: { name: site, namespace: "system" },
      };
    }
    originServers.push(origin);
  }

  // K8s service origins
  const k8sServices = getFlagValues(flags, "--k8s-service");
  for (const svc of k8sServices) {
    const origin: OriginServer = {
      k8s_service: { service_name: svc },
    };
    if (site) {
      (
        origin as {
          k8s_service: {
            site_locator: {
              site: { name: string; namespace: string };
            };
          };
        }
      ).k8s_service.site_locator = {
        site: { name: site, namespace: "system" },
      };
    }
    originServers.push(origin);
  }

  // Consul service origins
  const consulServices = getFlagValues(flags, "--consul-service");
  for (const svc of consulServices) {
    const origin: OriginServer = {
      consul_service: { service_name: svc },
    };
    if (site) {
      (
        origin as {
          consul_service: {
            site_locator: {
              site: { name: string; namespace: string };
            };
          };
        }
      ).consul_service.site_locator = {
        site: { name: site, namespace: "system" },
      };
    }
    originServers.push(origin);
  }

  // CBIP service origins
  const cbipServices = getFlagValues(flags, "--cbip-service");
  for (const svc of cbipServices) {
    const origin: OriginServer = {
      cbip_service: { service_name: svc },
    };
    if (site) {
      (
        origin as OriginServer & {
          cbip_service: {
            site_locator: {
              site: { name: string; namespace: string };
            };
          };
        }
      ).cbip_service.site_locator = {
        site: { name: site, namespace: "system" },
      };
    }
    originServers.push(origin);
  }

  // Custom endpoint origins
  const customEndpoints = getFlagValues(flags, "--custom-endpoint");
  for (const endpoint of customEndpoints) {
    originServers.push({
      custom_endpoint_object: {
        endpoint: { name: endpoint, namespace: namespace },
      },
    });
  }

  // VN private IP origins
  const vnPrivateIps = getFlagValues(flags, "--vn-private-ip");
  for (const ip of vnPrivateIps) {
    originServers.push({
      vn_private_ip: { ip },
    });
  }

  // VN private name origins
  const vnPrivateNames = getFlagValues(flags, "--vn-private-name");
  for (const dnsName of vnPrivateNames) {
    originServers.push({
      vn_private_name: { dns_name: dnsName },
    });
  }

  // Build base request
  const request: OriginPoolRequestBody = {
    metadata: {
      name: name || "",
      namespace: namespace,
    },
    spec: {
      origin_servers: originServers,
    },
  };

  // === SMART DEFAULTS FOR MINIMAL UX ===
  // Apply smart defaults before processing explicit port/TLS configurations
  // This ensures minimal commands like "--name pool --public-ip 192.0.2.10" work

  // Default to port 80 if no port option specified
  const hasExplicitPort =
    port !== undefined ||
    isFlagSet(flags, "--automatic-port") ||
    isFlagSet(flags, "--lb-port");

  if (!hasExplicitPort) {
    // Default port is 80 (most common HTTP backend)
    request.spec.port = 80;
  }

  // Smart TLS default based on effective port
  const hasExplicitTls =
    isFlagSet(flags, "--no-tls") || isFlagSet(flags, "--use-tls");

  if (!hasExplicitTls) {
    // Determine effective port (explicit or default)
    const effectivePort = port !== undefined ? port : 80;

    if (effectivePort === 443) {
      // Port 443 → enable TLS with host header as SNI
      request.spec.use_tls = {
        use_host_header_as_sni: {},
        tls_config: {
          default_security: {},
        },
        skip_server_verification: {},
      };
    } else {
      // All other ports → no TLS
      request.spec.no_tls = {};
    }
  }

  // Port configuration (mutually exclusive)
  // Explicit port configuration overrides smart default
  if (port !== undefined) {
    request.spec.port = port;
  } else if (isFlagSet(flags, "--automatic-port")) {
    request.spec.automatic_port = {};
    // Remove smart default port since user wants automatic
    delete request.spec.port;
  } else if (isFlagSet(flags, "--lb-port")) {
    request.spec.lb_port = {};
    // Remove smart default port since user wants LB port
    delete request.spec.port;
  }

  // Load balancing algorithm
  if (algorithm) {
    request.spec.loadbalancer_algorithm = algorithm as
      | "ROUND_ROBIN"
      | "LEAST_REQUEST"
      | "RANDOM"
      | "SOURCE_IP_STICKINESS"
      | "COOKIE_STICKINESS"
      | "RING_HASH";
  }

  // TLS configuration (mutually exclusive)
  // Explicit TLS configuration overrides smart default
  if (isFlagSet(flags, "--no-tls")) {
    request.spec.no_tls = {};
    // Remove smart default TLS if it was set
    delete request.spec.use_tls;
  } else if (isFlagSet(flags, "--use-tls")) {
    request.spec.use_tls = {
      use_host_header_as_sni: {},
      tls_config: {
        default_security: {},
      },
      skip_server_verification: {},
    };
    // Remove smart default no_tls if it was set
    delete request.spec.no_tls;
  }

  // Endpoint selection (at spec level, not advanced_options)
  const endpointSelection = getFlagValue(flags, "--endpoint-selection");
  if (endpointSelection) {
    request.spec.endpoint_selection = endpointSelection;
  }

  // Advanced options (lazily initialized)
  let advancedOptions: Record<string, unknown> | undefined;

  // Connection pool reuse (consolidated flag with enum)
  const connectionPool = getFlagValue(flags, "--connection-pool");
  if (connectionPool === "disable-reuse") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.disable_conn_pool_reuse = {};
  } else if (connectionPool === "enable-reuse") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.enable_conn_pool_reuse = {};
  }

  // Health check port (consolidated flag with enum, at spec level not advanced_options)
  const healthCheckPortSource = getFlagValue(
    flags,
    "--health-check-port-source",
  );
  if (healthCheckPortSource === "same-as-endpoint") {
    request.spec.same_as_endpoint_port = {};
  } else if (healthCheckPortSource === "custom") {
    const healthCheckPort = getFlagIntValue(flags, "--health-check-port");
    if (healthCheckPort !== undefined) {
      request.spec.health_check_port = healthCheckPort;
    }
  }

  // Connection timeout
  const connectionTimeout = getFlagIntValue(flags, "--connection-timeout");
  if (connectionTimeout !== undefined) {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.connection_timeout = connectionTimeout;
  }

  // HTTP idle timeout
  const httpIdleTimeout = getFlagIntValue(flags, "--http-idle-timeout");
  if (httpIdleTimeout !== undefined) {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.http_idle_timeout = httpIdleTimeout;
  }

  // Circuit breaker (consolidated flag with enum)
  const circuitBreaker = getFlagValue(flags, "--circuit-breaker");
  if (circuitBreaker === "disable") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.disable_circuit_breaker = {};
  } else if (circuitBreaker === "default") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.default_circuit_breaker = {};
  } else if (circuitBreaker === "custom") {
    // Custom circuit breaker config
    const cbConfig: Record<string, unknown> = {};
    const connectionLimit = getFlagIntValue(flags, "--cb-connection-limit");
    if (connectionLimit !== undefined)
      cbConfig.connection_limit = connectionLimit;

    const maxRequests = getFlagIntValue(flags, "--cb-max-requests");
    if (maxRequests !== undefined) cbConfig.max_requests = maxRequests;

    const maxPendingRequests = getFlagIntValue(
      flags,
      "--cb-max-pending-requests",
    );
    if (maxPendingRequests !== undefined)
      cbConfig.max_pending_requests = maxPendingRequests;

    const cbPriority = getFlagValue(flags, "--cb-priority");
    if (cbPriority) cbConfig.priority = cbPriority;

    if (Object.keys(cbConfig).length > 0) {
      if (!advancedOptions) advancedOptions = {};
      advancedOptions.circuit_breaker = cbConfig;
    }
  }

  // Outlier detection (consolidated flag with enum)
  const outlierDetection = getFlagValue(flags, "--outlier-detection");
  if (outlierDetection === "disable") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.disable_outlier_detection = {};
  } else if (outlierDetection === "custom") {
    // Custom outlier detection config
    const odConfig: Record<string, unknown> = {};
    const consecutive5xx = getFlagIntValue(flags, "--od-consecutive-5xx");
    if (consecutive5xx !== undefined) odConfig.consecutive_5xx = consecutive5xx;

    const consecutiveGatewayFailure = getFlagIntValue(
      flags,
      "--od-consecutive-gateway-failure",
    );
    if (consecutiveGatewayFailure !== undefined)
      odConfig.consecutive_gateway_failure = consecutiveGatewayFailure;

    const maxEjectionPercent = getFlagIntValue(
      flags,
      "--od-max-ejection-percent",
    );
    if (maxEjectionPercent !== undefined)
      odConfig.max_ejection_percent = maxEjectionPercent;

    const baseEjectionTime = getFlagIntValue(flags, "--od-base-ejection-time");
    if (baseEjectionTime !== undefined)
      odConfig.base_ejection_time = baseEjectionTime;

    if (Object.keys(odConfig).length > 0) {
      if (!advancedOptions) advancedOptions = {};
      advancedOptions.outlier_detection = odConfig;
    }
  }

  // Panic threshold (consolidated flag with enum)
  const panicThresholdMode = getFlagValue(flags, "--panic-threshold-mode");
  if (panicThresholdMode === "none") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.no_panic_threshold = {};
  } else if (panicThresholdMode === "percentage") {
    const panicThreshold = getFlagIntValue(flags, "--panic-threshold");
    if (panicThreshold !== undefined) {
      if (!advancedOptions) advancedOptions = {};
      advancedOptions.panic_threshold = panicThreshold;
    }
  }

  // Subset load balancing (consolidated flag with enum)
  const subsetLb = getFlagValue(flags, "--subset-lb");
  if (subsetLb === "disable") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.disable_subsets = {};
  } else if (subsetLb === "enable") {
    const subsetKeys = getFlagValues(flags, "--subset-keys");
    const subsetFallback = getFlagValue(flags, "--subset-default-fallback");

    if (subsetKeys.length > 0 || subsetFallback) {
      if (!advancedOptions) advancedOptions = {};
      const subsetConfig: Record<string, unknown> = {};

      // endpoint_subsets is required and must be array of objects with "keys" array
      if (subsetKeys.length > 0) {
        subsetConfig.endpoint_subsets = subsetKeys.map((key) => ({
          keys: key.split(","),
        }));
      }

      // Fallback policy (oneOf: any_endpoint | default_subset | fail_request)
      if (subsetFallback) {
        subsetConfig.default_subset = {
          default_fallback_policy: subsetFallback,
        };
      }

      advancedOptions.enable_subsets = subsetConfig;
    }
  }

  // HTTP protocol (consolidated flag with enum)
  const httpProtocol = getFlagValue(flags, "--http-protocol");
  if (httpProtocol === "auto") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.auto_http_config = {};
  } else if (httpProtocol === "http1") {
    const http1Transform = getFlagValue(flags, "--http1-header-transform");
    if (http1Transform) {
      if (!advancedOptions) advancedOptions = {};
      advancedOptions.http1_config = {
        header_transformation: http1Transform,
      };
    }
  } else if (httpProtocol === "http2") {
    const http2Enabled = getFlagValue(flags, "--http2-enabled");
    if (http2Enabled) {
      if (!advancedOptions) advancedOptions = {};
      advancedOptions.http2_options = {
        enabled: http2Enabled === "true",
      };
    }
  }

  // Proxy protocol (consolidated flag with enum)
  const proxyProtocol = getFlagValue(flags, "--proxy-protocol");
  if (proxyProtocol === "disable") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.disable_proxy_protocol = {};
  } else if (proxyProtocol === "v1") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.proxy_protocol_v1 = {};
  } else if (proxyProtocol === "v2") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.proxy_protocol_v2 = {};
  }

  // Source IP persistence (consolidated flag with enum)
  const sourceIpPersistence = getFlagValue(flags, "--source-ip-persistence");
  if (sourceIpPersistence === "disable") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.disable_lb_source_ip_persistance = {};
  } else if (sourceIpPersistence === "enable") {
    if (!advancedOptions) advancedOptions = {};
    advancedOptions.enable_lb_source_ip_persistance = {};
  }

  // Add advanced_options to request if any were set
  if (advancedOptions && Object.keys(advancedOptions).length > 0) {
    request.spec.advanced_options = advancedOptions;
  }

  // Health checks
  const healthChecks = getFlagValues(flags, "--health-check");
  if (healthChecks.length > 0) {
    request.spec.healthcheck = healthChecks.map((hc) => ({
      name: hc,
      namespace: namespace,
    }));
  }

  return request;
}

/**
 * Validate origin pool flags before building
 *
 * @param flags - Parsed creation flags
 * @returns Validation result with errors if any
 */
export function validateOriginPoolFlags(
  flags: ParsedCreationFlags,
): BuilderValidationResult {
  const errors: string[] = [];

  // Check required fields
  const name = getFlagValue(flags, "--name");
  if (!name) {
    errors.push("--name is required");
  } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(name) && name.length > 1) {
    errors.push(
      "--name must contain only lowercase alphanumeric characters and hyphens",
    );
  }

  // Check for at least one origin server
  const originFlagNames = [
    "--public-ip",
    "--public-name",
    "--private-ip",
    "--private-name",
    "--k8s-service",
    "--consul-service",
    "--custom-endpoint",
    "--vn-private-ip",
    "--vn-private-name",
    "--cbip-service",
  ];

  let hasOrigin = false;
  for (const flagName of originFlagNames) {
    if (getFlagValues(flags, flagName).length > 0) {
      hasOrigin = true;
      break;
    }
  }

  if (!hasOrigin) {
    errors.push(
      "At least one origin server is required (e.g., --public-ip, --public-name)",
    );
  }

  // Validate port
  // Note: Port is optional - defaults to 80 if not specified (see buildOriginPoolRequest)
  const port = getFlagIntValue(flags, "--port");
  if (port !== undefined && (port < 1 || port > 65535)) {
    errors.push("--port must be between 1 and 65535");
  }

  // Check for mutually exclusive port options
  const portOptions = [
    isFlagSet(flags, "--port") || port !== undefined,
    isFlagSet(flags, "--automatic-port"),
    isFlagSet(flags, "--lb-port"),
  ].filter(Boolean).length;

  if (portOptions > 1) {
    errors.push(
      "--port, --automatic-port, and --lb-port are mutually exclusive",
    );
  }

  // Check for mutually exclusive TLS options
  if (isFlagSet(flags, "--no-tls") && isFlagSet(flags, "--use-tls")) {
    errors.push("--no-tls and --use-tls are mutually exclusive");
  }

  // Validate private origins require site
  const privateIps = getFlagValues(flags, "--private-ip");
  const privateNames = getFlagValues(flags, "--private-name");
  const k8sServices = getFlagValues(flags, "--k8s-service");
  const consulServices = getFlagValues(flags, "--consul-service");

  if (
    (privateIps.length > 0 ||
      privateNames.length > 0 ||
      k8sServices.length > 0 ||
      consulServices.length > 0) &&
    !getFlagValue(flags, "--site")
  ) {
    errors.push(
      "--site is required when using private origins (--private-ip, --private-name, --k8s-service, --consul-service)",
    );
  }

  // Validate health check count
  const healthChecks = getFlagValues(flags, "--health-check");
  if (healthChecks.length > 4) {
    errors.push("Maximum of 4 health checks allowed");
  }

  // Health check port range validation
  const healthCheckPort = getFlagIntValue(flags, "--health-check-port");
  if (
    healthCheckPort !== undefined &&
    (healthCheckPort < 1 || healthCheckPort > 65535)
  ) {
    errors.push("--health-check-port must be between 1 and 65535");
  }

  // Endpoint selection validation
  const endpointSelection = getFlagValue(flags, "--endpoint-selection");
  if (endpointSelection) {
    const validValues = ["DISTRIBUTED", "LOCAL_ONLY", "LOCAL_PREFERRED"];
    if (!validValues.includes(endpointSelection)) {
      errors.push(
        `--endpoint-selection must be one of: ${validValues.join(", ")}`,
      );
    }
  }

  // Circuit breaker validation (consolidated flag)
  const circuitBreaker = getFlagValue(flags, "--circuit-breaker");
  if (
    circuitBreaker &&
    !["default", "disable", "custom"].includes(circuitBreaker)
  ) {
    errors.push("--circuit-breaker must be: default, disable, or custom");
  }

  // Child flag validation (only with custom)
  if (circuitBreaker !== "custom") {
    const childFlags = [
      "--cb-connection-limit",
      "--cb-max-requests",
      "--cb-max-pending-requests",
      "--cb-priority",
    ];
    const usedChildFlags = childFlags.filter(
      (f) =>
        getFlagValue(flags, f) !== undefined ||
        getFlagIntValue(flags, f) !== undefined,
    );
    if (usedChildFlags.length > 0) {
      errors.push(
        `Circuit breaker child flags (${usedChildFlags.join(", ")}) require --circuit-breaker=custom`,
      );
    }
  }

  // Range validation for child flags
  const cbConnectionLimit = getFlagIntValue(flags, "--cb-connection-limit");
  if (
    cbConnectionLimit !== undefined &&
    (cbConnectionLimit < 0 || cbConnectionLimit > 32768)
  ) {
    errors.push("--cb-connection-limit must be between 0 and 32768");
  }

  const cbMaxRequests = getFlagIntValue(flags, "--cb-max-requests");
  if (
    cbMaxRequests !== undefined &&
    (cbMaxRequests < 0 || cbMaxRequests > 32768)
  ) {
    errors.push("--cb-max-requests must be between 0 and 32768");
  }

  const cbMaxPendingRequests = getFlagIntValue(
    flags,
    "--cb-max-pending-requests",
  );
  if (
    cbMaxPendingRequests !== undefined &&
    (cbMaxPendingRequests < 0 || cbMaxPendingRequests > 32768)
  ) {
    errors.push("--cb-max-pending-requests must be between 0 and 32768");
  }

  const cbPriority = getFlagValue(flags, "--cb-priority");
  if (cbPriority && !["DEFAULT", "HIGH"].includes(cbPriority)) {
    errors.push("--cb-priority must be DEFAULT or HIGH");
  }

  // Outlier detection validation (consolidated flag)
  const outlierDetection = getFlagValue(flags, "--outlier-detection");
  if (outlierDetection && !["disable", "custom"].includes(outlierDetection)) {
    errors.push("--outlier-detection must be: disable or custom");
  }

  // Child flag validation (only with custom)
  if (outlierDetection !== "custom") {
    const childFlags = [
      "--od-consecutive-5xx",
      "--od-consecutive-gateway-failure",
      "--od-max-ejection-percent",
      "--od-base-ejection-time",
    ];
    const usedChildFlags = childFlags.filter(
      (f) => getFlagIntValue(flags, f) !== undefined,
    );
    if (usedChildFlags.length > 0) {
      errors.push(
        `Outlier detection child flags (${usedChildFlags.join(", ")}) require --outlier-detection=custom`,
      );
    }
  }

  // Range validation for child flags
  const odConsecutive5xx = getFlagIntValue(flags, "--od-consecutive-5xx");
  if (
    odConsecutive5xx !== undefined &&
    (odConsecutive5xx < 0 || odConsecutive5xx > 1024)
  ) {
    errors.push("--od-consecutive-5xx must be between 0 and 1024");
  }

  const odConsecutiveGatewayFailure = getFlagIntValue(
    flags,
    "--od-consecutive-gateway-failure",
  );
  if (
    odConsecutiveGatewayFailure !== undefined &&
    (odConsecutiveGatewayFailure < 0 || odConsecutiveGatewayFailure > 1024)
  ) {
    errors.push("--od-consecutive-gateway-failure must be between 0 and 1024");
  }

  const odMaxEjectionPercent = getFlagIntValue(
    flags,
    "--od-max-ejection-percent",
  );
  if (
    odMaxEjectionPercent !== undefined &&
    (odMaxEjectionPercent < 0 || odMaxEjectionPercent > 100)
  ) {
    errors.push("--od-max-ejection-percent must be between 0 and 100");
  }

  // Panic threshold validation (consolidated flag)
  const panicThresholdMode = getFlagValue(flags, "--panic-threshold-mode");
  if (
    panicThresholdMode &&
    !["none", "percentage"].includes(panicThresholdMode)
  ) {
    errors.push("--panic-threshold-mode must be: none or percentage");
  }

  // Child flag validation (only with percentage mode)
  if (panicThresholdMode !== "percentage") {
    const panicThresholdValue = getFlagIntValue(flags, "--panic-threshold");
    if (panicThresholdValue !== undefined) {
      errors.push(
        "--panic-threshold requires --panic-threshold-mode=percentage",
      );
    }
  }

  const panicThreshold = getFlagIntValue(flags, "--panic-threshold");
  if (
    panicThreshold !== undefined &&
    (panicThreshold < 0 || panicThreshold > 100)
  ) {
    errors.push("--panic-threshold must be between 0 and 100");
  }

  // Subset load balancing validation (consolidated flag)
  const subsetLb = getFlagValue(flags, "--subset-lb");
  if (subsetLb && !["disable", "enable"].includes(subsetLb)) {
    errors.push("--subset-lb must be: disable or enable");
  }

  // Child flag validation (only with enable)
  const subsetKeys = getFlagValues(flags, "--subset-keys");
  const subsetFallback = getFlagValue(flags, "--subset-default-fallback");

  if (subsetLb !== "enable") {
    if (subsetKeys.length > 0) {
      errors.push("--subset-keys requires --subset-lb=enable");
    }
    if (subsetFallback) {
      errors.push("--subset-default-fallback requires --subset-lb=enable");
    }
  }

  if (subsetKeys.length > 32) {
    errors.push("Maximum of 32 subset key groups allowed");
  }

  if (
    subsetFallback &&
    !["ANY_ENDPOINT", "DEFAULT_SUBSET"].includes(subsetFallback)
  ) {
    errors.push(
      "--subset-default-fallback must be ANY_ENDPOINT or DEFAULT_SUBSET",
    );
  }

  // HTTP protocol validation (consolidated flag)
  const httpProtocol = getFlagValue(flags, "--http-protocol");
  if (httpProtocol && !["auto", "http1", "http2"].includes(httpProtocol)) {
    errors.push("--http-protocol must be: auto, http1, or http2");
  }

  // Child flag validation
  const http1Transform = getFlagValue(flags, "--http1-header-transform");
  const http2Enabled = getFlagValue(flags, "--http2-enabled");

  if (httpProtocol !== "http1" && http1Transform) {
    errors.push("--http1-header-transform requires --http-protocol=http1");
  }

  if (httpProtocol !== "http2" && http2Enabled) {
    errors.push("--http2-enabled requires --http-protocol=http2");
  }

  if (http1Transform) {
    const validTransforms = [
      "legacy_header_transformation",
      "proper_case_header_transformation",
      "default_header_transformation",
    ];
    if (!validTransforms.includes(http1Transform)) {
      errors.push(
        `--http1-header-transform must be one of: ${validTransforms.join(", ")}`,
      );
    }
  }

  if (http2Enabled && !["true", "false"].includes(http2Enabled)) {
    errors.push("--http2-enabled must be true or false");
  }

  // Proxy protocol validation (consolidated flag)
  const proxyProtocol = getFlagValue(flags, "--proxy-protocol");
  if (proxyProtocol && !["disable", "v1", "v2"].includes(proxyProtocol)) {
    errors.push("--proxy-protocol must be: disable, v1, or v2");
  }

  // Source IP persistence validation (consolidated flag)
  const sourceIpPersistence = getFlagValue(flags, "--source-ip-persistence");
  if (
    sourceIpPersistence &&
    !["disable", "enable"].includes(sourceIpPersistence)
  ) {
    errors.push("--source-ip-persistence must be: disable or enable");
  }

  // Connection pool validation (consolidated flag)
  const connectionPool = getFlagValue(flags, "--connection-pool");
  if (
    connectionPool &&
    !["default", "enable-reuse", "disable-reuse"].includes(connectionPool)
  ) {
    errors.push(
      "--connection-pool must be: default, enable-reuse, or disable-reuse",
    );
  }

  // Health check port source validation (consolidated flag)
  const healthCheckPortSource = getFlagValue(
    flags,
    "--health-check-port-source",
  );
  if (
    healthCheckPortSource &&
    !["same-as-endpoint", "custom"].includes(healthCheckPortSource)
  ) {
    errors.push(
      "--health-check-port-source must be: same-as-endpoint or custom",
    );
  }

  // Child flag validation (only with custom)
  if (healthCheckPortSource !== "custom") {
    const healthCheckPortValue = getFlagIntValue(flags, "--health-check-port");
    if (healthCheckPortValue !== undefined) {
      errors.push(
        "--health-check-port requires --health-check-port-source=custom",
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
