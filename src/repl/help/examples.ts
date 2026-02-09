export interface UsageExample {
  title: string;
  command: string;
}

/**
 * Curated usage examples for resources.
 * Key format: "domain:resourceType"
 */
const EXAMPLES_REGISTRY = new Map<string, UsageExample[]>([
  [
    "virtual:healthcheck",
    [
      {
        title: "Minimal health check (uses HTTP defaults)",
        command: "xcsh virtual create healthcheck --name simple-check",
      },
      {
        title: "Basic HTTP health check",
        command:
          "xcsh virtual create healthcheck --name web-health --type http --path /health",
      },
      {
        title: "HTTP with status code validation",
        command:
          "xcsh virtual create healthcheck --name api-health --type http --path /api/status --expected-status-codes 200-299",
      },
      {
        title: "HTTP/2 health check",
        command:
          "xcsh virtual create healthcheck --name http2-check --type http --path /health --use-http2",
      },
      {
        title: "TCP health check",
        command:
          "xcsh virtual create healthcheck --name tcp-check --type tcp --send-payload PING --expected-response PONG",
      },
      {
        title: "TCP connect-only check",
        command:
          "xcsh virtual create healthcheck --name tcp-connect --type tcp --interval 10 --timeout 3",
      },
      {
        title: "UDP-ICMP health check (ICMP ping)",
        command:
          "xcsh virtual create healthcheck --name icmp-check --type udp-icmp --interval 10 --timeout 3",
      },
    ],
  ],

  [
    "virtual:origin_pool",
    [
      {
        title: "Minimal pool (smart defaults)",
        command:
          "xcsh virtual create origin_pool --name simple-pool --public-ip 192.0.2.10",
      },
      {
        title: "Multiple origins for load balancing",
        command:
          "xcsh virtual create origin_pool --name multi-pool --public-ip 192.0.2.10 --public-ip 192.0.2.11 --public-ip 192.0.2.12 --port 8080",
      },
      {
        title: "HTTPS with health checks",
        command:
          "xcsh virtual create origin_pool --name api-pool --public-name api.example.com --port 443 --use-tls --health-check api-health",
      },
      {
        title: "Private origins with site",
        command:
          "xcsh virtual create origin_pool --name internal-pool --private-ip 10.0.1.10 --private-ip 10.0.1.11 --site my-site --port 8080",
      },
      {
        title: "Kubernetes service",
        command:
          "xcsh virtual create origin_pool --name k8s-pool --k8s-service app-service.default --site k8s-cluster --port 80",
      },
      {
        title: "Mixed origin types",
        command:
          "xcsh virtual create origin_pool --name hybrid-pool --public-ip 192.0.2.10 --private-ip 10.0.1.20 --site datacenter --port 8080",
      },
      {
        title: "High availability configuration",
        command:
          "xcsh virtual create origin_pool --name ha-pool --public-name app1.example.com --public-name app2.example.com --port 443 --use-tls --algorithm LEAST_REQUEST --health-check health-443",
      },
      {
        title: "Advanced resilience features",
        command:
          "xcsh virtual create origin_pool --name resilient-pool --public-ip 192.0.2.10 --port 8080 --circuit-breaker default --panic-threshold-mode percentage --panic-threshold 50 --endpoint-selection LOCAL_PREFERRED",
      },
      {
        title: "Connection pool optimization",
        command:
          "xcsh virtual create origin_pool --name optimized-pool --public-name api.example.com --port 443 --use-tls --connection-pool enable-reuse --connection-timeout 5000",
      },
      {
        title: "Virtual network origins",
        command:
          "xcsh virtual create origin_pool --name vn-pool --vn-private-ip 172.16.0.10 --vn-private-ip 172.16.0.11 --port 8080 --algorithm RING_HASH",
      },
      {
        title: "Complete production setup",
        command:
          "xcsh virtual create origin_pool --name prod-pool --public-name prod1.example.com --public-name prod2.example.com --port 443 --use-tls --algorithm ROUND_ROBIN --health-check prod-health --circuit-breaker default --source-ip-persistence enable --endpoint-selection DISTRIBUTED",
      },
    ],
  ],
]);

export function getUsageExamples(
  domain: string,
  resourceType: string,
): UsageExample[] {
  const key = `${domain}:${resourceType}`;
  return EXAMPLES_REGISTRY.get(key) || [];
}
