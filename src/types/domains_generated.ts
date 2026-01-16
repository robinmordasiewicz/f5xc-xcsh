/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from .specs/index.json v2.0.23
 * WITH DYNAMIC RESOURCE DISCOVERY (Phase 1 Enhancement)
 * Run: npx tsx scripts/generate-domains.ts
 */

import type {
	DomainInfo,
	ResourceMetadata,
	SubscriptionTier,
	ResourceCategory,
	ResourceCategories,
} from "./domains.js";

// Re-export types for consumers
export type {
	ResourceMetadata,
	SubscriptionTier,
	ResourceCategory,
	ResourceCategories,
};

/**
 * Spec version used for generation
 */
export const SPEC_VERSION = "2.0.23";

/**
 * Generated domain data from upstream API specifications
 */
export const generatedDomains: Map<string, DomainInfo> = new Map([
	[
		"admin_console_and_ui",
		{
			name: "admin_console_and_ui",
			displayName: "Admin Console And Ui",
			description:
				"Dashboard customization through namespace-bounded asset libraries. Storage systems for branding resources, layout templates, and interactive widgets. Catalog organization with system object references tracking modification history and deployment status. Schema enforcement ensuring configuration validity across tenant hierarchies and environment boundaries.",
			descriptionShort: "Static UI components and console assets.",
			descriptionMedium:
				"Namespace-scoped visual elements with versioning. Custom widget deployment and catalog management for portal surfaces.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Platform",
			useCases: [
				"Manage static UI components for admin console",
				"Deploy and retrieve UI assets within namespaces",
				"Configure console interface elements",
				"Manage custom UI component metadata",
			],
			relatedDomains: ["admin", "system"],
			icon: "🖥️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B5CF6'%3E%3Cpath d='M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "ui_component",
					description: "UI component for console customization",
					descriptionShort: "UI component",
					tier: "Standard" as const,
					icon: "🎨",
					category: "Other",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "static_asset",
					description: "Static asset for UI resources",
					descriptionShort: "Static asset",
					tier: "Standard" as const,
					icon: "📁",
					category: "Other",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "static_component",
					description:
						"List the set of static_component in a namespace.",
					descriptionShort:
						"List the set of static_component in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"1 resources discovered but not in primaryResources: static_component",
			],
			resourceCategories: {
				crud: [],
				analytics: ["static_component"],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"ai_services",
		{
			name: "ai_services",
			displayName: "Ai Services",
			description:
				"Query handling through inference routing with production and test modes. Positive and negative quality markers with detailed categorization capture assistant performance. Streaming connections support authenticated access, subscription lifecycles, and feature flags. IP provisioning services allocate infrastructure resources for model workloads across distributed systems.",
			descriptionShort: "AI assistant queries and feedback collection.",
			descriptionMedium:
				"Natural language processing with quality signals and anomaly monitoring. Token authentication for data stream subscriptions.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: true,
			requiresTier: "Advanced",
			category: "AI",
			useCases: [
				"Access AI-powered features",
				"Configure AI assistant policies",
				"Enable flow anomaly detection",
				"Manage AI data collection",
			],
			relatedDomains: [],
			icon: "🤖",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366F1'%3E%3Cpath d='M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "ai_policy",
					description: "AI policy for generative AI traffic control",
					descriptionShort: "AI policy",
					tier: "Advanced" as const,
					icon: "🤖",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
				},
				{
					name: "ai_gateway",
					description: "AI gateway for LLM API management",
					descriptionShort: "AI gateway",
					tier: "Advanced" as const,
					icon: "🚀",
					category: "API Management",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["ai_policy"] },
					relationshipHints: [
						"ai_policy: Policy for AI traffic control",
					],
				},
			],
			allResources: [
				{
					name: "allocateip",
					description:
						"AllocateIP will allocate an IP address for the tenant read from context.",
					descriptionShort:
						"AllocateIP will allocate an IP address for the tenant read f",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "deallocateip",
					description: "",
					descriptionShort: "deallocateip",
					tier: "Standard" as const,
					operations: ["delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "enable_feature",
					description:
						"Enable service by returning service account details.",
					descriptionShort:
						"Enable service by returning service account details.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "eval_query",
					description:
						"Temporarily to be used in place of AIAssistantQuery for evaluating API access/RBAC check.",
					descriptionShort:
						"Temporarily to be used in place of AIAssistantQuery for eval",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "eval_query_feedback",
					description:
						"Temporarily to be used in place of AIAssistantFeedback for evaluating API access/RBAC check.",
					descriptionShort:
						"Temporarily to be used in place of AIAssistantFeedback for e",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "gettoken",
					description: "Subscribe to BFDP pipeline.",
					descriptionShort: "Subscribe to BFDP pipeline.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "query",
					description:
						"Enable service by returning service account details.",
					descriptionShort:
						"Enable service by returning service account details.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "query_feedback",
					description:
						"Enable service by returning service account details.",
					descriptionShort:
						"Enable service by returning service account details.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "refresh_token",
					description:
						"Enable service by returning service account details.",
					descriptionShort:
						"Enable service by returning service account details.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to BFDP pipeline.",
					descriptionShort: "Subscribe to BFDP pipeline.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to BFDP pipeline.",
					descriptionShort: "Unsubscribe to BFDP pipeline.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"11 resources discovered but not in primaryResources: allocateip, deallocateip, enable_feature, eval_query, eval_query_feedback...",
			],
			resourceCategories: {
				crud: [
					"allocateip",
					"deallocateip",
					"enable_feature",
					"eval_query",
					"eval_query_feedback",
					"gettoken",
					"query",
					"query_feedback",
					"refresh_token",
				],
				analytics: [],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"api",
		{
			name: "api",
			displayName: "Api",
			description:
				"Structured classification systems with versioning support for contract evolution. Hierarchical groupings segment resources by operational role or security boundaries. Behavioral verification confirms authentication flows and permission constraints. Token and key safeguards protect sensitive credentials. Traffic inspection through connected load balancers and firewalls enables threat detection at network perimeters.",
			descriptionShort:
				"Interface definitions, schema validation, and grouping.",
			descriptionMedium:
				"Resource cataloging with automatic classification and security profiling. Organizational hierarchies segment access by function or protection policy.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Security",
			useCases: [
				"Discover and catalog APIs",
				"Test API security and behavior",
				"Manage API credentials",
				"Define API groups and testing policies",
			],
			relatedDomains: ["waf", "network_security"],
			cliMetadata: {
				quick_start: {
					command:
						"curl $F5XC_API_URL/api/config/namespaces/default/api_catalogs -H 'Authorization: APIToken $F5XC_API_TOKEN'",
					description: "List all API catalogs in default namespace",
					expected_output: "JSON array of API catalog objects",
				},
				common_workflows: [
					{
						name: "Protect API with Security Policy",
						description:
							"Discover and protect APIs with WAF security policies",
						steps: [
							{
								step: 1,
								command:
									"curl -X POST $F5XC_API_URL/api/config/namespaces/default/api_catalogs -H 'Authorization: APIToken $F5XC_API_TOKEN' -H 'Content-Type: application/json' -d '{...catalog_config...}'",
								description:
									"Create API catalog for API discovery and documentation",
							},
							{
								step: 2,
								command:
									"curl -X POST $F5XC_API_URL/api/config/namespaces/default/api_definitions -H 'Authorization: APIToken $F5XC_API_TOKEN' -H 'Content-Type: application/json' -d '{...api_config...}'",
								description:
									"Create API definition with security enforcement",
							},
						],
						prerequisites: [
							"API endpoints documented",
							"Security policies defined",
							"WAF rules configured",
						],
						expected_outcome:
							"APIs protected, violations logged and blocked",
					},
				],
				troubleshooting: [
					{
						problem: "API traffic blocked by security policy",
						symptoms: [
							"HTTP 403 Forbidden",
							"Requests rejected at edge",
						],
						diagnosis_commands: [
							"curl $F5XC_API_URL/api/config/namespaces/default/api_definitions/{api} -H 'Authorization: APIToken $F5XC_API_TOKEN'",
							"Check security policy enforcement rules",
						],
						solutions: [
							"Review API definition and security policy rules",
							"Adjust rule sensitivity to reduce false positives",
							"Add exception rules for legitimate traffic patterns",
						],
					},
				],
				icon: "🔐",
			},
			icon: "🔐",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EF4444'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "api_definition",
					description:
						"API schema definition for discovery and protection",
					descriptionShort: "API definition",
					tier: "Advanced" as const,
					icon: "📄",
					category: "API Management",
					supportsLogs: false,
					supportsMetrics: false,
					dependencies: { optional: ["api_endpoint"] },
					relationshipHints: [
						"api_endpoint: Endpoints defined by this API",
					],
				},
				{
					name: "api_endpoint",
					description:
						"Individual API endpoint configuration and protection",
					descriptionShort: "API endpoint",
					tier: "Advanced" as const,
					icon: "🔌",
					category: "API Management",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["api_rate_limit"] },
					relationshipHints: [
						"api_rate_limit: Rate limiting for this endpoint",
					],
				},
				{
					name: "api_rate_limit",
					description:
						"API rate limiting configuration for traffic control",
					descriptionShort: "API rate limit",
					tier: "Advanced" as const,
					icon: "⏱️",
					category: "API Management",
					supportsLogs: true,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "api_crawler",
					description: "Create API crawler.",
					descriptionShort: "Create API crawler.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "api_definition",
					description:
						"API schema definition for discovery and protection",
					descriptionShort: "API definition",
					tier: "Advanced" as const,
					icon: "📄",
					category: "API Management",
					supportsLogs: false,
					supportsMetrics: false,
					dependencies: { optional: ["api_endpoint"] },
					relationshipHints: [
						"api_endpoint: Endpoints defined by this API",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "api_definitions_without_shared",
					description:
						"List API definitions suitable for API Inventory management\nGET all API Definitions for specific namespace exclude shared namespace.",
					descriptionShort:
						"List API definitions suitable for API Inventory management\nG",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "api_discovery",
					description:
						"Create API discovery creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create API discovery creates a new object in the storage bac",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "api_endpoint_protection",
					description:
						"Suggest API endpoint protection rule for a given path.",
					descriptionShort:
						"Suggest API endpoint protection rule for a given path.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "api_group",
					description: "List the set of api_group in a namespace.",
					descriptionShort:
						"List the set of api_group in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "api_group_element",
					description:
						"List the set of api_group_element in a namespace.",
					descriptionShort:
						"List the set of api_group_element in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "api_testing",
					description: "Create API testing.",
					descriptionShort: "Create API testing.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "app_api_group",
					description:
						"Create app_api_group creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create app_api_group creates a new object in the storage bac",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "code_base_integration",
					description: "CREATE integration details.",
					descriptionShort: "CREATE integration details.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "data_exposure",
					description:
						"Suggest sensitive data rule for a given path.",
					descriptionShort:
						"Suggest sensitive data rule for a given path.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "discovery",
					description:
						"API to create discovery object for a site or virtual site in system namespace.",
					descriptionShort:
						"API to create discovery object for a site or virtual site in",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "download_certificate",
					description:
						"Download the cerificates files for the Log Collerctor\nIn order to establish connection from the third party application server to the\nLog Colletor the user should download a zip file with the certificates files:\n- client.crt\n- client.key\n- server_ca.crt.",
					descriptionShort:
						"Download the cerificates files for the Log Collerctor\nIn ord",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "loadbalancer",
					description:
						"List Loadbalancers referenced by the API Definition (backrefrences).",
					descriptionShort:
						"List Loadbalancers referenced by the API Definition (backref",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "mark_as_non_api",
					description:
						"Update the API Definition's non-API list with the provided API endpoints.",
					descriptionShort:
						"Update the API Definition's non-API list with the provided A",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "move_to_inventory",
					description:
						"Update the API Definition's include list with the provided API endpoints.",
					descriptionShort:
						"Update the API Definition's include list with the provided A",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "oas_validation",
					description:
						"Suggest Open API specification validation rule for a given path.",
					descriptionShort:
						"Suggest Open API specification validation rule for a given p",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "rate_limit",
					description: "Suggest rate limit rule for a given path.",
					descriptionShort:
						"Suggest rate limit rule for a given path.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "remove_from_inventory",
					description:
						"Update the API Definition's exclude list with the provided API endpoints.",
					descriptionShort:
						"Update the API Definition's exclude list with the provided A",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "unmark_as_non_api",
					description:
						"DELETE the provided API endpoints from the API Definition's non-API list.",
					descriptionShort:
						"DELETE the provided API endpoints from the API Definition's ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "evaluate",
					description:
						"Evaluate API Group Builder against all API endpoints associated with the referenced object and return the resulting API Group.\nFor example, if the referenced object is an HTTP LB then all discovered and imported endpoints are associated with it.",
					descriptionShort:
						"Evaluate API Group Builder against all API endpoints associa",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "stat",
					description:
						"Check if there are any changes happened to the API Groups, and return number of API Endpoints updated for each API Group.",
					descriptionShort:
						"Check if there are any changes happened to the API Groups, a",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"21 resources discovered but not in primaryResources: api_crawler, api_definitions_without_shared, api_discovery, api_endpoint_protection, api_group...",
			],
			resourceCategories: {
				crud: [
					"api_crawler",
					"api_definition",
					"api_definitions_without_shared",
					"api_discovery",
					"api_endpoint_protection",
					"api_group",
					"api_group_element",
					"api_testing",
					"app_api_group",
					"code_base_integration",
					"data_exposure",
					"discovery",
					"download_certificate",
					"loadbalancer",
					"mark_as_non_api",
					"move_to_inventory",
					"oas_validation",
					"rate_limit",
					"remove_from_inventory",
					"unmark_as_non_api",
				],
				analytics: ["evaluate", "stat"],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"authentication",
		{
			name: "authentication",
			displayName: "Authentication",
			description:
				"Identity and access management providing APIs for configuring identity providers, access policies, and user credentials. Supports MFA, identity provider integration, and lifecycle operations for credential management across distributed deployments.",
			descriptionShort:
				"Identity provider and access policy configuration.",
			descriptionMedium:
				"Identity management with provider integration, access policies, and credential lifecycle control.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Platform",
			useCases: [
				"Configure authentication mechanisms",
				"Manage OIDC and OAuth providers",
				"Configure SCIM user provisioning",
				"Manage API credentials and access",
				"Configure account signup policies",
			],
			relatedDomains: ["system", "users"],
			icon: "🔑",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FBBF24'%3E%3Cpath d='M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "authentication_policy",
					description:
						"Authentication policy for user and API access",
					descriptionShort: "Auth policy",
					tier: "Standard" as const,
					icon: "🔐",
					category: "Identity",
					supportsLogs: true,
					supportsMetrics: false,
				},
				{
					name: "token",
					description: "API token for programmatic access",
					descriptionShort: "Token",
					tier: "Standard" as const,
					icon: "🎫",
					category: "Identity",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "api_credential",
					description: "API credential for service authentication",
					descriptionShort: "API credential",
					tier: "Standard" as const,
					icon: "🔑",
					category: "Identity",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "api_credential",
					description: "API credential for service authentication",
					descriptionShort: "API credential",
					tier: "Standard" as const,
					icon: "🔑",
					category: "Identity",
					supportsLogs: false,
					supportsMetrics: false,
					operations: ["create", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "scim_token",
					description: "For SCIM API credential revoke/deletion.",
					descriptionShort:
						"For SCIM API credential revoke/deletion.",
					tier: "Standard" as const,
					operations: ["create", "list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "service_credential",
					description:
						"It is used to revoke multiple service credentials. This API would disable the credentials and mark them for deletion.\nThe actual removal of objects would be done in the background. Only admins are allowed to access this API.",
					descriptionShort:
						"It is used to revoke multiple service credentials. This API ",
					tier: "Standard" as const,
					operations: ["create", "list", "get", "replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"2 resources discovered but not in primaryResources: scim_token, service_credential",
			],
			resourceCategories: {
				crud: ["api_credential", "scim_token", "service_credential"],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"bigip",
		{
			name: "bigip",
			displayName: "Bigip",
			description:
				"On-premises appliance connector enabling iRule lifecycle operations and data group replication. APM policy coordination, virtual server configuration binding, and CNE linkage. Telemetry aggregation and health status monitoring across hybrid infrastructure deployments.",
			descriptionShort: "iRules, data groups, and APM integration.",
			descriptionMedium:
				"Legacy device orchestration with iRule scripts and data group synchronization. Virtual server bindings and metrics collection.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Platform",
			useCases: [
				"Manage BigIP F5 appliances",
				"Configure iRule scripts",
				"Manage data groups",
				"Integrate BigIP CNE",
			],
			relatedDomains: ["marketplace"],
			icon: "🏢",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EF4444'%3E%3Cpath d='M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "bigip_pool",
					description: "BIG-IP pool for load balancing integration",
					descriptionShort: "BIG-IP pool",
					tier: "Advanced" as const,
					icon: "🎯",
					category: "Load Balancing",
					supportsLogs: false,
					supportsMetrics: true,
				},
				{
					name: "bigip_device",
					description: "BIG-IP device registration and management",
					descriptionShort: "BIG-IP device",
					tier: "Advanced" as const,
					icon: "🖥️",
					category: "Infrastructure",
					supportsLogs: true,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "apm",
					description:
						"Creates a new APM as a service with configured parameters.",
					descriptionShort:
						"Creates a new APM as a service with configured parameters.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bigip_irule",
					description: "Desired state for BIG-IP iRule Service.",
					descriptionShort: "Desired state for BIG-IP iRule Service.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bigip_virtual_server",
					description: "",
					descriptionShort: "bigip_virtual_server",
					tier: "Standard" as const,
					operations: ["replace", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "data_group",
					description:
						"Create data group in a given namespace. If one already exists it will give an error.",
					descriptionShort:
						"Create data group in a given namespace. If one already exist",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "get_security_config",
					description:
						"Fetch the corresponding Security Config for the given BIG-IP load balancers.",
					descriptionShort:
						"Fetch the corresponding Security Config for the given BIG-IP",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "irule",
					description:
						"Create iRule in a given namespace. If one already exists it will give an error.",
					descriptionShort:
						"Create iRule in a given namespace. If one already exists it ",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "metric",
					description: "BIG-IP APM metrics.",
					descriptionShort: "BIG-IP APM metrics.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"7 resources discovered but not in primaryResources: apm, bigip_irule, bigip_virtual_server, data_group, get_security_config...",
			],
			resourceCategories: {
				crud: [
					"apm",
					"bigip_irule",
					"bigip_virtual_server",
					"data_group",
					"get_security_config",
					"irule",
				],
				analytics: ["metric"],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"billing_and_usage",
		{
			name: "billing_and_usage",
			displayName: "Billing And Usage",
			description:
				"Subscription lifecycle with plan transitions and billing states. Payment method hierarchies supporting primary and secondary configurations. Invoice generation with PDF downloads and custom listing. Resource quotas per namespace with limit definitions and consumption metrics. Contact types for billing notifications and tenant deletion workflows.",
			descriptionShort:
				"Subscription plans, payment methods, and quotas.",
			descriptionMedium:
				"Plan transitions, invoicing, and resource consumption. Namespace-level quota limits and usage tracking.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Platform",
			useCases: [
				"Manage subscription plans and billing transitions",
				"Configure payment methods and invoices",
				"Track resource quota usage across namespaces",
				"Monitor usage limits and capacity",
			],
			relatedDomains: ["system", "users"],
			icon: "💳",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310B981'%3E%3Cpath d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "subscription",
					description: "Subscription for service entitlements",
					descriptionShort: "Subscription",
					tier: "Standard" as const,
					icon: "💳",
					category: "Other",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "quota",
					description: "Resource quota for usage limits",
					descriptionShort: "Quota",
					tier: "Standard" as const,
					icon: "📊",
					category: "Other",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "usage_report",
					description: "Usage report for consumption tracking",
					descriptionShort: "Usage report",
					tier: "Standard" as const,
					icon: "📈",
					category: "Other",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "current",
					description: "Endpoint to GET current usage plan.",
					descriptionShort: "Endpoint to GET current usage plan.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "current_usage",
					description:
						"List current usage details per tenant and namespace. Some usage have only sense in the system namespace and this selector has no effect on it.",
					descriptionShort:
						"List current usage details per tenant and namespace. Some us",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "custom_list",
					description: "Endpoint to list customer invoices.",
					descriptionShort: "Endpoint to list customer invoices.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "hourly_usage_detail",
					description:
						"List the usage divided by hour. The usage is hourly aggregated, from the start of UTC hour\nto the end of UTC hour. It is used to see the detailed breakdown of the usage received from ListUsageDetails.",
					descriptionShort:
						"List the usage divided by hour. The usage is hourly aggregat",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "invoice_pdf",
					description: "Retrieve pdf for a paid invoice by its name.",
					descriptionShort:
						"Retrieve pdf for a paid invoice by its name.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "limit",
					description: "Custom endpoint to return quota limits.",
					descriptionShort: "Custom endpoint to return quota limits.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "monthly_usage",
					description:
						"List monthly usage details per tenant and namespace. Some usage have only sense in the system namespace and this selector has no effect on it.",
					descriptionShort:
						"List monthly usage details per tenant and namespace. Some us",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "payment_method",
					description:
						"Creates a new payment method with a specific role.",
					descriptionShort:
						"Creates a new payment method with a specific role.",
					tier: "Standard" as const,
					operations: ["create", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "plan_transition",
					description:
						"API to create a plan transition request in db.",
					descriptionShort:
						"API to create a plan transition request in db.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "primary",
					description:
						"Flags a payment method as primary. Nothing changes is the payment method is already primary, if the payment method is secondary then it becomes default and there will be no secondary.",
					descriptionShort:
						"Flags a payment method as primary. Nothing changes is the pa",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "quota",
					description: "Resource quota for usage limits",
					descriptionShort: "Quota",
					tier: "Standard" as const,
					icon: "📊",
					category: "Other",
					supportsLogs: false,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "secondary",
					description:
						"Flags a payment method as secondary. Nothing changes is the payment method is already secondary, if the payment method is primary then it becomes secondary and there will be no primary.",
					descriptionShort:
						"Flags a payment method as secondary. Nothing changes is the ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "swap-primary",
					description:
						"Swaps payment method roles - the payment method used as a parameter will became primary, any other will become secondary. The `name` parameter is ignored.",
					descriptionShort:
						"Swaps payment method roles - the payment method used as a pa",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "usage",
					description:
						"GET allows users to query limits and current usage of resources.",
					descriptionShort:
						"GET allows users to query limits and current usage of resour",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "usage_detail",
					description:
						"List usage details per tenant and namespace. Some usage have only sense in the system namespace and this selector has no effect on it.",
					descriptionShort:
						"List usage details per tenant and namespace. Some usage have",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to XC addon services.",
					descriptionShort: "Subscribe to XC addon services.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to XC addon services.",
					descriptionShort: "Unsubscribe to XC addon services.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"16 resources discovered but not in primaryResources: current, current_usage, custom_list, hourly_usage_detail, invoice_pdf...",
			],
			resourceCategories: {
				crud: [
					"current",
					"current_usage",
					"custom_list",
					"hourly_usage_detail",
					"invoice_pdf",
					"limit",
					"monthly_usage",
					"payment_method",
					"plan_transition",
					"primary",
					"quota",
					"secondary",
					"swap-primary",
					"usage",
					"usage_detail",
				],
				analytics: [],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"blindfold",
		{
			name: "blindfold",
			displayName: "Blindfold",
			description:
				"Public key retrieval and secret policy enforcement for encrypted data handling. Policy rules govern access with configurable matching and transformation actions. VoltShare integration provides decryption services, access counting, and audit log aggregation. Namespace-scoped policies enable fine-grained control over sensitive information with administrative overrides.",
			descriptionShort:
				"Secret encryption, key policies, and audit trails.",
			descriptionMedium:
				"Encryption key management with policy-based access controls. Audit logging and secure data protection.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Security",
			useCases: [
				"Configure secret policies for encryption",
				"Manage sensitive data encryption",
				"Enforce data protection policies",
			],
			relatedDomains: ["client_side_defense", "certificates"],
			icon: "🔏",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366F1'%3E%3Cpath d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "blindfold_secret",
					description: "Encrypted secret using Blindfold encryption",
					descriptionShort: "Blindfold secret",
					tier: "Standard" as const,
					icon: "🔐",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "secret_policy",
					description: "Secret management policy configuration",
					descriptionShort: "Secret policy",
					tier: "Standard" as const,
					icon: "📋",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "policy_document",
					description:
						"Policy document for access control definitions",
					descriptionShort: "Policy document",
					tier: "Standard" as const,
					icon: "📄",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "access_count",
					description:
						"Request to GET number of VoltShare API calls aggregated across multiple dimensions like OPERATION, COUNTRY, RESULT, USER_TENANT.",
					descriptionShort:
						"Request to GET number of VoltShare API calls aggregated acro",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "aggregation",
					description:
						"Request to GET summary/analytics data for the audit logs that matches the criteria in request.",
					descriptionShort:
						"Request to GET summary/analytics data for the audit logs tha",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "audit_log",
					description:
						"Request to GET voltshare audit logs that matches the criteria in request.\nIf no match conditions are specified in the request, then the response contains all\nCRUD operations performed.",
					descriptionShort:
						"Request to GET voltshare audit logs that matches the criteri",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "decrypt_secret",
					description:
						"DecryptSecret API takes blinded encrypted secret and policy and responds with blinded decrypted secret if user is allowed by the policy.",
					descriptionShort:
						"DecryptSecret API takes blinded encrypted secret and policy ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "get_policy_document",
					description:
						"GetPolicyDocument API returns secret policy document for the given policy that contains information about all the rules in the policy and policy_id.\nThis document can be given to F5 Distributed Cloud secret management tool to do secret encryption.",
					descriptionShort:
						"GetPolicyDocument API returns secret policy document for the",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "get_public_key",
					description:
						"GetPublicKey API returns public part of the F5 Distributed Cloud secret management key that needs to be given to F5 Distributed Cloud secret management tool to do secret encryption.",
					descriptionShort:
						"GetPublicKey API returns public part of the F5 Distributed C",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "list_policy",
					description: "Listpolicy CustomAPI.",
					descriptionShort: "Listpolicy CustomAPI.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "process_policy_information",
					description:
						"ProcessPolicyInformation API takes policy and secret name as input and returns a document containing .",
					descriptionShort:
						"ProcessPolicyInformation API takes policy and secret name as",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "recover",
					description: "Recoverpolicy CustomAPI.",
					descriptionShort: "Recoverpolicy CustomAPI.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "scroll",
					description:
						"The response for audit log query contain no more than 500 messages.\nOne can use scroll request to scroll through more than 500 messages or all messages\nin multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					descriptionShort:
						"The response for audit log query contain no more than 500 me",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "secret_management_accesss",
					description:
						"Create secret_management_access creates a new object in storage backend for metadata.namespace.",
					descriptionShort:
						"Create secret_management_access creates a new object in stor",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "secret_policy",
					description: "Secret management policy configuration",
					descriptionShort: "Secret policy",
					tier: "Standard" as const,
					icon: "📋",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "secret_policy_rule",
					description:
						"Create secret_policy_rule creates a new object in storage backend for metadata.namespace.",
					descriptionShort:
						"Create secret_policy_rule creates a new object in storage ba",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "softdelete",
					description: "Deletepolicy CustomAPI.",
					descriptionShort: "Deletepolicy CustomAPI.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "voltshare_admin_policy",
					description:
						"Create voltshare_admin_policy creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create voltshare_admin_policy creates a new object in the st",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"14 resources discovered but not in primaryResources: access_count, aggregation, audit_log, decrypt_secret, get_policy_document...",
			],
			resourceCategories: {
				crud: [
					"access_count",
					"aggregation",
					"audit_log",
					"decrypt_secret",
					"get_policy_document",
					"get_public_key",
					"list_policy",
					"process_policy_information",
					"recover",
					"scroll",
					"secret_management_accesss",
					"secret_policy",
					"secret_policy_rule",
					"softdelete",
					"voltshare_admin_policy",
				],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"bot_and_threat_defense",
		{
			name: "bot_and_threat_defense",
			displayName: "Bot And Threat Defense",
			description:
				"Behavioral fingerprinting identifies automated clients through request patterns, mouse movements, and JavaScript execution. Threat categories classify attacks by type including credential stuffing, scraping, and denial-of-service. Defense instances apply per-namespace policies with configurable sensitivity thresholds and challenge actions. Provisioning handles integration credentials for third-party threat intelligence feeds.",
			descriptionShort:
				"Bot detection, threat categories, and defense instances.",
			descriptionMedium:
				"Threat classification with behavioral analysis and signature matching. Automated blocking for malicious traffic patterns.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Security",
			useCases: [
				"Configure bot defense instances per namespace",
				"Manage TPM threat categories for classification",
				"Provision API keys for automated defense systems",
				"Integrate threat intelligence services",
			],
			relatedDomains: ["bot_defense", "shape", "waf"],
			icon: "🦠",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EF4444'%3E%3Cpath d='M19.5 5.5 18 4l-1.5 1.5L18 7l1.5-1.5zM12 2v3m0 14v3m10-10h-3M5 12H2m15.5 6.5L18 20l1.5-1.5L18 17l-1.5 1.5zm-11 0L6 20l-1.5-1.5L6 17l-1.5 1.5zm0-11L6 4l-1.5 1.5L6 7 4.5 5.5zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "bot_defense_instance",
					description: "Bot defense instance for deployment",
					descriptionShort: "Bot defense instance",
					tier: "Advanced" as const,
					icon: "🤖",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
				},
				{
					name: "threat_category",
					description: "Threat category for classification",
					descriptionShort: "Threat category",
					tier: "Advanced" as const,
					icon: "🎯",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "bot_defense_app_infrastructure",
					description:
						"Creates Bot Defense App Infrastructure in a given namespace.",
					descriptionShort:
						"Creates Bot Defense App Infrastructure in a given namespace.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "preauth",
					description:
						"Pre-flight auth checks before calling the Provision API.",
					descriptionShort:
						"Pre-flight auth checks before calling the Provision API.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "provision",
					description: "Provision CustomAPI.",
					descriptionShort: "Provision CustomAPI.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "shape_bot_defense_instance",
					description:
						"List the set of shape_bot_defense_instance in a namespace.",
					descriptionShort:
						"List the set of shape_bot_defense_instance in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tpm_api_key",
					description:
						"APIKey object when successfully created returns actual APIKey bytes which is used by the users to call in to\nTPM provisioning API.",
					descriptionShort:
						"APIKey object when successfully created returns actual APIKe",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tpm_category",
					description:
						"Create a Category object, which is a grouping of APIKeys used for TPM provisioning.",
					descriptionShort:
						"Create a Category object, which is a grouping of APIKeys use",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tpm_manager",
					description: "Create a TPM Manager object.",
					descriptionShort: "Create a TPM Manager object.",
					tier: "Standard" as const,
					operations: ["create", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"7 resources discovered but not in primaryResources: bot_defense_app_infrastructure, preauth, provision, shape_bot_defense_instance, tpm_api_key...",
			],
			resourceCategories: {
				crud: [
					"bot_defense_app_infrastructure",
					"preauth",
					"provision",
					"shape_bot_defense_instance",
					"tpm_api_key",
					"tpm_category",
					"tpm_manager",
				],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"cdn",
		{
			name: "cdn",
			displayName: "Cdn",
			description:
				"Content delivery networks with edge caching, geographic distribution, and cache management. Supports custom rules, asset purge operations, and performance analytics. Enables worldwide asset distribution, optimization, and delivery monitoring across regions and protocols.",
			descriptionShort: "Content delivery and edge caching networks.",
			descriptionMedium:
				"Global distribution with cache rules and purge operations. Performance monitoring and analytics.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Networking",
			useCases: [
				"Configure CDN load balancing",
				"Manage content delivery network services",
				"Configure caching policies",
				"Manage data delivery and distribution",
			],
			relatedDomains: ["virtual"],
			icon: "🚀",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F97316'%3E%3Cpath d='M12 2.5s4.5 2.04 4.5 10c0 3.22-1.67 5.6-3.25 7.08L12 22l-1.25-2.42C9.17 18.1 7.5 15.72 7.5 12.5c0-7.96 4.5-10 4.5-10zm0 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 14.5c0 1.22.57 2.36 1.44 3.22l1.76-1.76c-.43-.43-.7-1.01-.7-1.66 0-.25.04-.49.1-.72L5.21 12.1c-.13.77-.21 1.58-.21 2.4zm14 0c0-.82-.08-1.63-.21-2.4l-2.39 1.48c.06.23.1.47.1.72 0 .65-.27 1.23-.7 1.66l1.76 1.76c.87-.86 1.44-2 1.44-3.22z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "cdn_loadbalancer",
					description:
						"Content delivery network load balancer for edge caching",
					descriptionShort: "CDN load balancer",
					tier: "Standard" as const,
					icon: "🌍",
					category: "Load Balancing",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["cdn_origin_pool"] },
					relationshipHints: [
						"cdn_origin_pool: Origin servers for CDN content",
					],
				},
				{
					name: "cdn_origin_pool",
					description: "Origin server pool for CDN content sourcing",
					descriptionShort: "CDN origin pool",
					tier: "Standard" as const,
					icon: "🎯",
					category: "Load Balancing",
					supportsLogs: false,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "access_log",
					description: "Retrieve CDN Load-Balancer Access logs.",
					descriptionShort: "Retrieve CDN Load-Balancer Access logs.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "aggregation",
					description:
						"Request to GET summary/analytics data for the CDN access logs that matches the query in request for a given namespace.",
					descriptionShort:
						"Request to GET summary/analytics data for the CDN access log",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cache-purge",
					description: "Initiate Purge for Edge CDN Cache.",
					descriptionShort: "Initiate Purge for Edge CDN Cache.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cdn_cache_rule",
					description: "Shape of the CDN loadbalancer specification.",
					descriptionShort:
						"Shape of the CDN loadbalancer specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cdn_loadbalancer",
					description:
						"Content delivery network load balancer for edge caching",
					descriptionShort: "CDN load balancer",
					tier: "Standard" as const,
					icon: "🌍",
					category: "Load Balancing",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["cdn_origin_pool"] },
					relationshipHints: [
						"cdn_origin_pool: Origin servers for CDN content",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "dos_automitigation_rule",
					description:
						"GET the corresponding DoS Auto-Mitigation Rules for the given CDN load balancer.",
					descriptionShort:
						"GET the corresponding DoS Auto-Mitigation Rules for the give",
					tier: "Standard" as const,
					operations: ["get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "get_security_config",
					description:
						"Fetch the corresponding Security Config for the given CDN load balancers.",
					descriptionShort:
						"Fetch the corresponding Security Config for the given CDN lo",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suggestion",
					description:
						"Suggest blocking SimpleClientSrcRule for a given IP/ASN.",
					descriptionShort:
						"Suggest blocking SimpleClientSrcRule for a given IP/ASN.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "get-service-operation-statu",
					description:
						"GET status of an operation command for a given CDN Loadbalancer.",
					descriptionShort:
						"GET status of an operation command for a given CDN Loadbalan",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "list-service-operations-statu",
					description:
						"List of service operations for a given CDN LB.",
					descriptionShort:
						"List of service operations for a given CDN LB.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "metric",
					description:
						"Initial metrics request for CDN loadbalancers.",
					descriptionShort:
						"Initial metrics request for CDN loadbalancers.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to CDN Loadbalancer.",
					descriptionShort: "Subscribe to CDN Loadbalancer.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to CDN Loadbalancer.",
					descriptionShort: "Unsubscribe to CDN Loadbalancer.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"12 resources discovered but not in primaryResources: access_log, aggregation, cache-purge, cdn_cache_rule, dos_automitigation_rule...",
			],
			resourceCategories: {
				crud: [
					"access_log",
					"aggregation",
					"cache-purge",
					"cdn_cache_rule",
					"cdn_loadbalancer",
					"dos_automitigation_rule",
					"get_security_config",
					"suggestion",
				],
				analytics: [
					"get-service-operation-statu",
					"list-service-operations-statu",
					"metric",
				],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"ce_management",
		{
			name: "ce_management",
			displayName: "Ce Management",
			description:
				"Customer edge node lifecycle through secure enrollment tokens and downloadable deployment images. Network connectivity options span exclusive, common, and administrative pathways with DHCP address pools supporting both IPv4 and IPv6. Bulk grouping consolidates configuration across distributed locations. Compatibility verification runs before software updates, with rollout tracking for version progression across the infrastructure.",
			descriptionShort:
				"Network interfaces, fleets, and site registration.",
			descriptionMedium:
				"Token-based provisioning with image downloads and pre-upgrade validation. Fleet grouping enables bulk operations across distributed locations.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Infrastructure",
			useCases: [
				"Manage Customer Edge site lifecycle",
				"Configure network interfaces and fleet settings",
				"Handle site registration and token workflows",
				"Execute site upgrades with pre-upgrade checks",
			],
			relatedDomains: ["customer_edge", "sites"],
			icon: "🔧",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F59E0B'%3E%3Cpath d='M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "site_config",
					description: "Site configuration for edge node settings",
					descriptionShort: "Site config",
					tier: "Standard" as const,
					icon: "⚙️",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "fleet_config",
					description:
						"Fleet configuration for multi-site management",
					descriptionShort: "Fleet config",
					tier: "Standard" as const,
					icon: "🚀",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "registration_token",
					description: "Registration token for site onboarding",
					descriptionShort: "Registration token",
					tier: "Standard" as const,
					icon: "🎫",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "fleet",
					description:
						"Create fleet will create a fleet object in 'system' namespace of the user.",
					descriptionShort:
						"Create fleet will create a fleet object in 'system' namespac",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "network_interface",
					description:
						"Network interface represents configuration of a network device.\nIt is created by users in system namespace.",
					descriptionShort:
						"Network interface represents configuration of a network devi",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "pre_upgrade_check",
					description: "API to check if site is ready for upgrade.",
					descriptionShort:
						"API to check if site is ready for upgrade.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "setting",
					description: "Receive the module settings.",
					descriptionShort: "Receive the module settings.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "upgradable_sw_version",
					description:
						"API to GET list of sw versions that can be upgraded to.",
					descriptionShort:
						"API to GET list of sw versions that can be upgraded to.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "usb_policy",
					description: "Creates a new USB policy object.",
					descriptionShort: "Creates a new USB policy object.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "upgrade_statu",
					description: "API to GET upgrade status of a site.",
					descriptionShort: "API to GET upgrade status of a site.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"7 resources discovered but not in primaryResources: fleet, network_interface, pre_upgrade_check, setting, upgradable_sw_version...",
			],
			resourceCategories: {
				crud: [
					"fleet",
					"network_interface",
					"pre_upgrade_check",
					"setting",
					"upgradable_sw_version",
					"usb_policy",
				],
				analytics: ["upgrade_statu"],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"certificates",
		{
			name: "certificates",
			displayName: "Certificates",
			description:
				"X.509 certificate chains with intermediate and root CA support. Trusted CA list bundles for client authentication and mTLS validation. CRL distribution points and OCSP stapling configuration. Certificate manifests link credentials to load balancers and gateways. Automatic expiration tracking and renewal notifications.",
			descriptionShort:
				"SSL/TLS chains, trusted CAs, and revocation lists.",
			descriptionMedium:
				"Certificate chains and trusted CA bundles. Revocation list management and manifest configuration for PKI operations.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Security",
			useCases: [
				"Manage SSL/TLS certificates",
				"Configure trusted CAs",
				"Manage certificate revocation lists (CRL)",
				"Configure certificate manifests",
			],
			relatedDomains: ["blindfold", "system"],
			icon: "📜",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2314B8A6'%3E%3Cpath d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "certificate",
					description: "TLS certificate for secure HTTPS connections",
					descriptionShort: "Certificate",
					tier: "Standard" as const,
					icon: "📜",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "ca_certificate",
					description:
						"Certificate authority certificate for trust chain",
					descriptionShort: "CA certificate",
					tier: "Standard" as const,
					icon: "📜",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "certificate_chain",
					description:
						"Certificate chain for complete trust verification",
					descriptionShort: "Certificate chain",
					tier: "Standard" as const,
					icon: "🔗",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "certificate",
					description: "TLS certificate for secure HTTPS connections",
					descriptionShort: "Certificate",
					tier: "Standard" as const,
					icon: "📜",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "certificate_chain",
					description:
						"Certificate chain for complete trust verification",
					descriptionShort: "Certificate chain",
					tier: "Standard" as const,
					icon: "🔗",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "crl",
					description: "API to create CRL object.",
					descriptionShort: "API to create CRL object.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "trusted_ca_list",
					description:
						"Shape of the Root CA Certificate specification.",
					descriptionShort:
						"Shape of the Root CA Certificate specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"2 resources discovered but not in primaryResources: crl, trusted_ca_list",
			],
			resourceCategories: {
				crud: [
					"certificate",
					"certificate_chain",
					"crl",
					"trusted_ca_list",
				],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"cloud_infrastructure",
		{
			name: "cloud_infrastructure",
			displayName: "Cloud Infrastructure",
			description:
				"Hyperscaler integration supporting Amazon Web Services, Microsoft Azure, and Google Cloud Platform environments. Virtual network attachment workflows enable elastic compute provisioning with automatic reattachment capabilities. Edge authentication secrets for provider access. Segment telemetry and cross-region link reapplication for distributed deployments. Autonomous path synchronization across peered networks with real-time topology updates.",
			descriptionShort: "AWS, Azure, GCP connectors and VPC attachments.",
			descriptionMedium:
				"Multi-cloud provider connections with gateway peering and network path configuration. Credential vault integration and subnet enumeration.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Infrastructure",
			useCases: [
				"Connect to cloud providers (AWS, Azure, GCP)",
				"Manage cloud credentials and authentication",
				"Configure cloud connectivity and elastic provisioning",
				"Link and manage cloud regions",
			],
			relatedDomains: ["sites", "customer_edge"],
			icon: "☁️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2306B6D4'%3E%3Cpath d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "aws_vpc_site",
					description:
						"AWS VPC site deployment with edge node provisioning",
					descriptionShort: "AWS VPC site",
					tier: "Standard" as const,
					icon: "☁️",
					category: "Infrastructure",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["cloud_credentials"] },
					relationshipHints: [
						"cloud_credentials: AWS authentication for deployment",
					],
				},
				{
					name: "azure_vnet_site",
					description:
						"Azure VNet site deployment with edge node provisioning",
					descriptionShort: "Azure VNet site",
					tier: "Standard" as const,
					icon: "☁️",
					category: "Infrastructure",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["cloud_credentials"] },
					relationshipHints: [
						"cloud_credentials: Azure authentication for deployment",
					],
				},
				{
					name: "gcp_vpc_site",
					description:
						"Google Cloud VPC site deployment with edge node provisioning",
					descriptionShort: "GCP VPC site",
					tier: "Standard" as const,
					icon: "☁️",
					category: "Infrastructure",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["cloud_credentials"] },
					relationshipHints: [
						"cloud_credentials: GCP authentication for deployment",
					],
				},
				{
					name: "cloud_credentials",
					description:
						"Cloud provider authentication credentials for site deployment",
					descriptionShort: "Cloud credentials",
					tier: "Standard" as const,
					icon: "🔑",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "certified_hardware",
					description:
						"List the set of certified_hardware in a namespace.",
					descriptionShort:
						"List the set of certified_hardware in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cloud_connect",
					description:
						"Request to GET top cloud connect from the AWS Cloudwatch metrics.",
					descriptionShort:
						"Request to GET top cloud connect from the AWS Cloudwatch met",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cloud_connect_reapply_vpc_attachment",
					description:
						"RE-applies VPC attachment in a cloud connect config.",
					descriptionShort:
						"RE-applies VPC attachment in a cloud connect config.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cloud_credentialss",
					description: "API to create cloud_credentials object.",
					descriptionShort: "API to create cloud_credentials object.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cloud_elastic_ip",
					description:
						"Create Cloud Elastic IP creates Cloud Elastic IP object\nObject is attached to a site.",
					descriptionShort:
						"Create Cloud Elastic IP creates Cloud Elastic IP object\nObje",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cloud_link",
					description:
						"Creates a new CloudLink with configured parameters.",
					descriptionShort:
						"Creates a new CloudLink with configured parameters.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cloud_region",
					description: "",
					descriptionShort: "cloud_region",
					tier: "Standard" as const,
					operations: ["replace", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "discover_vpc",
					description:
						"Returns all the vpcs for a specified cloud provider, region and cred.\nFor AWS it returns all the vpcs which are not attached to any transit gateway in that region.",
					descriptionShort:
						"Returns all the vpcs for a specified cloud provider, region ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "edge_credential",
					description:
						"Returns the cloud credential for the matching edge type.",
					descriptionShort:
						"Returns the cloud credential for the matching edge type.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "edge_list",
					description:
						"Returns the online edge sites (Both Customer Edge and Cloud Edge)",
					descriptionShort:
						"Returns the online edge sites (Both Customer Edge and Cloud ",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "force-delete",
					description: "Force DELETE Cloud Elastic IP.",
					descriptionShort: "Force DELETE Cloud Elastic IP.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "reapply_config",
					description: "Reapply CloudLink Config.",
					descriptionShort: "Reapply CloudLink Config.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "metric",
					description:
						"Cloud Connect APIs are used to GET the data for cloud connect.",
					descriptionShort:
						"Cloud Connect APIs are used to GET the data for cloud connec",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "segment_metric",
					description:
						"Cloud Connect APIs are used to GET the segment data for cloud connect.",
					descriptionShort:
						"Cloud Connect APIs are used to GET the segment data for clou",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"14 resources discovered but not in primaryResources: certified_hardware, cloud_connect, cloud_connect_reapply_vpc_attachment, cloud_credentialss, cloud_elastic_ip...",
			],
			resourceCategories: {
				crud: [
					"certified_hardware",
					"cloud_connect",
					"cloud_connect_reapply_vpc_attachment",
					"cloud_credentialss",
					"cloud_elastic_ip",
					"cloud_link",
					"cloud_region",
					"discover_vpc",
					"edge_credential",
					"edge_list",
					"force-delete",
					"reapply_config",
				],
				analytics: ["metric", "segment_metric"],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"container_services",
		{
			name: "container_services",
			displayName: "Container Services",
			description:
				"Namespaced isolation with configurable limits and autoscaling policies. vK8s abstracts operational overhead while providing scheduling, persistent storage, and service mesh integration. Compute profiles specify CPU, memory, and GPU allocations for reproducible environments. Telemetry tracks consumption patterns across geographically distributed infrastructure nodes.",
			descriptionShort:
				"Containerized workloads and virtual Kubernetes clusters.",
			descriptionMedium:
				"Pod orchestration without full cluster complexity. Edge site execution, quota enforcement, and standardized compute profiles for distributed apps.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Infrastructure",
			useCases: [
				"Deploy XCCS (Container Services) namespaces for multi-tenant workloads",
				"Manage container workloads with simplified orchestration",
				"Configure distributed edge container deployments",
				"Run containerized applications without full K8s complexity",
			],
			relatedDomains: ["managed_kubernetes", "sites", "service_mesh"],
			icon: "📦",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B5CF6'%3E%3Cpath d='M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L5 8.09v7.82l7 3.94 7-3.94V8.09l-7-3.94z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "virtual_k8s",
					description:
						"Virtual Kubernetes namespace for container workloads",
					descriptionShort: "Virtual K8s",
					tier: "Advanced" as const,
					icon: "☸️",
					category: "Container",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["workload"] },
					relationshipHints: [
						"workload: Container workloads in this namespace",
					],
				},
				{
					name: "workload",
					description: "Container workload deployment configuration",
					descriptionShort: "Workload",
					tier: "Advanced" as const,
					icon: "📦",
					category: "Container",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["virtual_k8s"] },
					relationshipHints: [
						"virtual_k8s: Namespace for workload deployment",
					],
				},
				{
					name: "pod_security_policy",
					description:
						"Pod security policy for container runtime constraints",
					descriptionShort: "Pod security policy",
					tier: "Advanced" as const,
					icon: "🔒",
					category: "Container",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "usage",
					description: "GET the workload usage.",
					descriptionShort: "GET the workload usage.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "virtual_k8ss",
					description:
						"Create virtual_k8s will create the object in the storage backend for namespace metadata.namespace.",
					descriptionShort:
						"Create virtual_k8s will create the object in the storage bac",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "workload",
					description: "Container workload deployment configuration",
					descriptionShort: "Workload",
					tier: "Advanced" as const,
					icon: "📦",
					category: "Container",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["virtual_k8s"] },
					relationshipHints: [
						"virtual_k8s: Namespace for workload deployment",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "workload_flavor",
					description: "Create a workload_flavor.",
					descriptionShort: "Create a workload_flavor.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"3 resources discovered but not in primaryResources: usage, virtual_k8ss, workload_flavor",
			],
			resourceCategories: {
				crud: ["usage", "virtual_k8ss", "workload", "workload_flavor"],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"data_and_privacy_security",
		{
			name: "data_and_privacy_security",
			displayName: "Data And Privacy Security",
			description:
				"Pattern-based detection for personally identifiable information across request and response payloads. Custom data type definitions enable organization-specific classification beyond built-in PII categories. Regional log and metrics aggregation with Clickhouse, Elasticsearch, and Kafka export options. Geo-configuration policies enforce data residency requirements and jurisdiction-specific privacy regulations.",
			descriptionShort:
				"PII detection, data types, and regional compliance.",
			descriptionMedium:
				"Sensitive data policies with custom classification rules. LMA region configuration and geo-based compliance controls.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Security",
			useCases: [
				"Configure sensitive data detection policies",
				"Define custom data types for PII classification",
				"Manage LMA region configurations",
				"Integrate geo-configurations for compliance",
			],
			relatedDomains: ["blindfold", "client_side_defense"],
			icon: "🔐",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EF4444'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "sensitive_data_policy",
					description: "Sensitive data policy for PII protection",
					descriptionShort: "Sensitive data policy",
					tier: "Advanced" as const,
					icon: "🔐",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: false,
				},
				{
					name: "data_classification",
					description:
						"Data classification for content categorization",
					descriptionShort: "Data classification",
					tier: "Advanced" as const,
					icon: "🏷️",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "data_type",
					description:
						"Create data_type creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create data_type creates a new object in the storage backend",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "geo_config",
					description: "Shape of the geo config specification.",
					descriptionShort: "Shape of the geo config specification.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "lma_region",
					description: "List the set of lma_region in a namespace.",
					descriptionShort:
						"List the set of lma_region in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "sensitive_data_policy",
					description: "Sensitive data policy for PII protection",
					descriptionShort: "Sensitive data policy",
					tier: "Advanced" as const,
					icon: "🔐",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
			],
			validationWarnings: [
				"3 resources discovered but not in primaryResources: data_type, geo_config, lma_region",
			],
			resourceCategories: {
				crud: [
					"data_type",
					"geo_config",
					"lma_region",
					"sensitive_data_policy",
				],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"data_intelligence",
		{
			name: "data_intelligence",
			displayName: "Data Intelligence",
			description:
				"APIs for configuring classification policies and resource management. Supports data classification, insight generation, and integration with security services across deployments.",
			descriptionShort:
				"Classification, insights, and policy management.",
			descriptionMedium:
				"Classification rules, resource policies, and insight generation for data analysis workflows.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Operations",
			useCases: [
				"Analyze security and traffic data",
				"Generate intelligent insights from logs",
				"Configure data analytics policies",
			],
			relatedDomains: ["statistics", "observability"],
			icon: "🧠",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A855F7'%3E%3Cpath d='M15.5 14l-1.34-4H9.84L8.5 14H6.09l4.01-10h3.8l4.01 10H15.5zm-4.5-5.4h2l.9-2.35.8 2.35h1.8l-1.45 1.05.55 1.7-1.4-1.02-1.4 1.02.55-1.7L11 8.6z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "analytics_query",
					description: "Analytics query for data analysis",
					descriptionShort: "Analytics query",
					tier: "Standard" as const,
					icon: "📊",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "data_export",
					description: "Data export configuration for reporting",
					descriptionShort: "Data export",
					tier: "Standard" as const,
					icon: "📤",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "datadictionary",
					description:
						"GET the dataset features from Data dictionary API.",
					descriptionShort:
						"GET the dataset features from Data dictionary API.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dataset",
					description: "API to list datasets by tenant.",
					descriptionShort: "API to list datasets by tenant.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dataSet",
					description:
						"GET the list of data sets eligible for the tenant.",
					descriptionShort:
						"GET the list of data sets eligible for the tenant.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "flowlabel",
					description:
						"ListFlowLabels takes a customer name and returns a list of FlowLabel objects.",
					descriptionShort:
						"ListFlowLabels takes a customer name and returns a list of F",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "init-request",
					description:
						"Request to enable Data Intelligence for the tenant.",
					descriptionShort:
						"Request to enable Data Intelligence for the tenant.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "receiver",
					description: "Creates a new Data Delivery object.",
					descriptionShort: "Creates a new Data Delivery object.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suggest-value",
					description:
						"Returns suggested values for the specified field in the given Create/Replace/Custom request.",
					descriptionShort:
						"Returns suggested values for the specified field in the give",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "test",
					description:
						"API to test receiver destination sink connection.",
					descriptionShort:
						"API to test receiver destination sink connection.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "statu",
					description:
						"Update receiver object status from enable to disable and vice versa.",
					descriptionShort:
						"Update receiver object status from enable to disable and vic",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "summary",
					description:
						"Executive summary page for DI premium customers.",
					descriptionShort:
						"Executive summary page for DI premium customers.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to Data Intelligence.",
					descriptionShort: "Subscribe to Data Intelligence.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to Client-Side Defense.",
					descriptionShort: "Unsubscribe to Client-Side Defense.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"12 resources discovered but not in primaryResources: datadictionary, dataset, dataSet, flowlabel, init-request...",
			],
			resourceCategories: {
				crud: [
					"datadictionary",
					"dataset",
					"dataSet",
					"flowlabel",
					"init-request",
					"receiver",
					"suggest-value",
					"test",
				],
				analytics: ["statu", "summary"],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"ddos",
		{
			name: "ddos",
			displayName: "Ddos",
			description:
				"Network perimeter hardening through deny list configurations, rule group hierarchies, and encrypted tunnel endpoints. Attack signature detection identifies flood patterns while throttling mechanisms block anomalous traffic bursts. Tunnel health checks verify coverage across distributed segments. Priority ordering governs policy application for multi-layered screening approaches.",
			descriptionShort:
				"Volumetric attack mitigation and traffic scrubbing.",
			descriptionMedium:
				"Deny lists, firewall rule groups, and tunnel-based safeguards. Rate limiting and pattern analysis for network perimeter security.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Security",
			useCases: [
				"Configure DDoS protection policies",
				"Monitor and analyze DDoS threats",
				"Configure infrastructure protection",
			],
			relatedDomains: ["network_security", "virtual"],
			icon: "🛑",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23DC2626'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "ddos_protection",
					description:
						"DDoS protection configuration for traffic scrubbing",
					descriptionShort: "DDoS protection",
					tier: "Advanced" as const,
					icon: "🛡️",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["ddos_mitigation_rule"] },
					relationshipHints: [
						"ddos_mitigation_rule: Custom mitigation rules",
					],
				},
				{
					name: "ddos_mitigation_rule",
					description: "DDoS mitigation rule for attack response",
					descriptionShort: "DDoS mitigation rule",
					tier: "Advanced" as const,
					icon: "📋",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "access",
					description:
						"RPC to GET customer access and availability info.",
					descriptionShort:
						"RPC to GET customer access and availability info.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "alert",
					description: "RPC to GET details of an alert.",
					descriptionShort: "RPC to GET details of an alert.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "annotation",
					description: "Returns annotations of a single mitigation.",
					descriptionShort:
						"Returns annotations of a single mitigation.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "attachment",
					description:
						"Returns any attachments associated with an event. This could be Pcap files or any other document.\nObsolete - use `GetEvent` to list out attachments.",
					descriptionShort:
						"Returns any attachments associated with an event. This could",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "detail",
					description: "",
					descriptionShort: "detail",
					tier: "Standard" as const,
					operations: ["replace", "delete", "list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "event",
					description:
						"Returns details of an event. This allows customers to review any activity related to a DDoS attack.",
					descriptionShort:
						"Returns details of an event. This allows customers to review",
					tier: "Standard" as const,
					operations: ["list", "replace", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "infraprotect_asn",
					description: "Creates a DDoS transit ASN.",
					descriptionShort: "Creates a DDoS transit ASN.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "infraprotect_asn_prefix",
					description: "Creates a DDoS transit Prefix.",
					descriptionShort: "Creates a DDoS transit Prefix.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "infraprotect_deny_list_rule",
					description: "Creates a DDoS transit Deny List Rule.",
					descriptionShort: "Creates a DDoS transit Deny List Rule.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "infraprotect_firewall_rule",
					description: "Creates a DDoS transit Firewall Rule.",
					descriptionShort: "Creates a DDoS transit Firewall Rule.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "infraprotect_firewall_rule_group",
					description: "Amends a DDoS transit Firewall Rule Group.",
					descriptionShort:
						"Amends a DDoS transit Firewall Rule Group.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "infraprotect_firewall_ruleset",
					description: "",
					descriptionShort: "infraprotect_firewall_ruleset",
					tier: "Standard" as const,
					operations: ["replace", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "infraprotect_information",
					description: "GET organisation information.",
					descriptionShort: "GET organisation information.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "infraprotect_internet_prefix_advertisement",
					description: "Creates a DDoS transit Internet Prefix.",
					descriptionShort: "Creates a DDoS transit Internet Prefix.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "infraprotect_tunnel",
					description: "Creates a DDoS transit tunnel.",
					descriptionShort: "Creates a DDoS transit tunnel.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ip",
					description:
						"Returns list of IPs involved in a mitigation (and allows for searching through it)",
					descriptionShort:
						"Returns list of IPs involved in a mitigation (and allows for",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "mitigation",
					description: "Returns details of a single mitigation.",
					descriptionShort: "Returns details of a single mitigation.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "mitigation_annotation",
					description:
						"Return mitigation annotations that occur while an event is active.",
					descriptionShort:
						"Return mitigation annotations that occur while an event is a",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "network",
					description:
						"Returns a list available reports to be downloaded. Reports summarise an event or a mitigation in a single PDF document.",
					descriptionShort:
						"Returns a list available reports to be downloaded. Reports s",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "report",
					description:
						"Returns details of a report, most importantly the PDF document itself.",
					descriptionShort:
						"Returns details of a report, most importantly the PDF docume",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suggest-value",
					description:
						"SuggestValues returns suggested values for the specified field in the given Create/Replace/Custom request.",
					descriptionShort:
						"SuggestValues returns suggested values for the specified fie",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "to_event",
					description: "",
					descriptionShort: "to_event",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "transit_usage",
					description: "API to GET transit usage data.",
					descriptionShort: "API to GET transit usage data.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "update-asn-prefix-irr-override",
					description: "Update Infraprotect ASN Prefix IRR Override.",
					descriptionShort:
						"Update Infraprotect ASN Prefix IRR Override.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bgp_peer_statu",
					description:
						"API to GET routed DDoS BGP peer status information.",
					descriptionShort:
						"API to GET routed DDoS BGP peer status information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "events_summary",
					description:
						"Return a list of available event (suitable for an alert)",
					descriptionShort:
						"Return a list of available event (suitable for an alert)",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "update-advertisement-statu",
					description:
						"Update Infraprotect Internet prefix advertisement.",
					descriptionShort:
						"Update Infraprotect Internet prefix advertisement.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "update-asn-prefix-review-statu",
					description:
						"Update Infraprotect ASN Prefix Review Status.",
					descriptionShort:
						"Update Infraprotect ASN Prefix Review Status.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "update-asn-review-statu",
					description: "Update Infraprotect ASN Review Status.",
					descriptionShort: "Update Infraprotect ASN Review Status.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "update-tunnel-statu",
					description: "Update Tunnel Status.",
					descriptionShort: "Update Tunnel Status.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"30 resources discovered but not in primaryResources: access, alert, annotation, attachment, detail...",
			],
			resourceCategories: {
				crud: [
					"access",
					"alert",
					"annotation",
					"attachment",
					"detail",
					"event",
					"infraprotect_asn",
					"infraprotect_asn_prefix",
					"infraprotect_deny_list_rule",
					"infraprotect_firewall_rule",
					"infraprotect_firewall_rule_group",
					"infraprotect_firewall_ruleset",
					"infraprotect_information",
					"infraprotect_internet_prefix_advertisement",
					"infraprotect_tunnel",
					"ip",
					"mitigation",
					"mitigation_annotation",
					"network",
					"report",
					"suggest-value",
					"to_event",
					"transit_usage",
					"update-asn-prefix-irr-override",
				],
				analytics: [
					"bgp_peer_statu",
					"events_summary",
					"update-advertisement-statu",
					"update-asn-prefix-review-statu",
					"update-asn-review-statu",
					"update-tunnel-statu",
				],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"dns",
		{
			name: "dns",
			displayName: "Dns",
			description:
				"Name infrastructure with authoritative zones, A/AAAA/CNAME record types, and zone management. Supports zone transfers, security extensions, health-based routing, and delegation. Enables reliable name resolution, geographic load balancing, and name-based traffic steering across distributed environments.",
			descriptionShort: "Authoritative zones and record management.",
			descriptionMedium:
				"Name resolution with zone transfers and health checks. Record types and delegation support.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Networking",
			useCases: [
				"Configure DNS load balancing",
				"Manage DNS zones and domains",
				"Configure DNS compliance policies",
				"Manage resource record sets (RRSets)",
			],
			relatedDomains: ["virtual", "network"],
			cliMetadata: {
				quick_start: {
					command:
						"curl $F5XC_API_URL/api/config/namespaces/default/dns_domains -H 'Authorization: APIToken $F5XC_API_TOKEN'",
					description:
						"List all DNS domains configured in default namespace",
					expected_output: "JSON array of DNS domain objects",
				},
				common_workflows: [
					{
						name: "Create DNS Domain",
						description:
							"Configure DNS domain with load balancer backend",
						steps: [
							{
								step: 1,
								command:
									"Create load balancer endpoint first (virtual domain)",
								description:
									"Ensure target load balancer exists",
							},
							{
								step: 2,
								command:
									"curl -X POST $F5XC_API_URL/api/config/namespaces/default/dns_domains -H 'Authorization: APIToken $F5XC_API_TOKEN' -H 'Content-Type: application/json' -d '{...dns_config...}'",
								description:
									"Create DNS domain pointing to load balancer",
							},
						],
						prerequisites: [
							"DNS domain registered",
							"Load balancer configured",
							"SOA and NS records prepared",
						],
						expected_outcome:
							"DNS domain in Active status, queries resolving to load balancer",
					},
				],
				troubleshooting: [
					{
						problem: "DNS queries not resolving",
						symptoms: [
							"NXDOMAIN responses",
							"Timeout on DNS queries",
						],
						diagnosis_commands: [
							"curl $F5XC_API_URL/api/config/namespaces/default/dns_domains/{domain} -H 'Authorization: APIToken $F5XC_API_TOKEN'",
							"nslookup {domain} @ns-server",
						],
						solutions: [
							"Verify domain delegation to F5 XC nameservers",
							"Check DNS domain configuration and backend load balancer status",
							"Validate zone file and record configuration",
						],
					},
				],
				icon: "🌐",
			},
			icon: "🌐",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563EB'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "dns_zone",
					description:
						"Authoritative DNS zone with record management capabilities",
					descriptionShort: "DNS zone",
					tier: "Standard" as const,
					icon: "🌐",
					category: "DNS",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["dns_load_balancer"] },
					relationshipHints: [
						"dns_load_balancer: Geographic or weighted DNS routing",
					],
				},
				{
					name: "dns_domain",
					description:
						"DNS domain delegation and configuration settings",
					descriptionShort: "DNS domain",
					tier: "Standard" as const,
					icon: "🔗",
					category: "DNS",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "dns_load_balancer",
					description:
						"DNS-based traffic distribution with geographic routing and failover",
					descriptionShort: "DNS load balancer",
					tier: "Standard" as const,
					icon: "⚖️",
					category: "DNS",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["dns_zone"] },
					relationshipHints: [
						"dns_zone: Parent zone for DNS records",
					],
				},
			],
			allResources: [
				{
					name: "clone_from_dns_domain",
					description: "Cloning DNS domain to DNSZone.",
					descriptionShort: "Cloning DNS domain to DNSZone.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dns_compliance_checkss",
					description:
						"Create DNS Compliance Checks Specification in a given namespace. If one already exists it will give an error.",
					descriptionShort:
						"Create DNS Compliance Checks Specification in a given namesp",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dns_domain",
					description:
						"DNS domain delegation and configuration settings",
					descriptionShort: "DNS domain",
					tier: "Standard" as const,
					icon: "🔗",
					category: "DNS",
					supportsLogs: false,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "dns_lb_health_check",
					description:
						"Create DNS Load Balancer Health Check in a given namespace. If one already exist it will give a error.",
					descriptionShort:
						"Create DNS Load Balancer Health Check in a given namespace. ",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dns_lb_pool",
					description:
						"Create DNS Load Balancer Pool in a given namespace. If one already exist it will give a error.",
					descriptionShort:
						"Create DNS Load Balancer Pool in a given namespace. If one a",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dns_load_balancer",
					description:
						"DNS-based traffic distribution with geographic routing and failover",
					descriptionShort: "DNS load balancer",
					tier: "Standard" as const,
					icon: "⚖️",
					category: "DNS",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["dns_zone"] },
					relationshipHints: [
						"dns_zone: Parent zone for DNS records",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "dns_zone",
					description:
						"Authoritative DNS zone with record management capabilities",
					descriptionShort: "DNS zone",
					tier: "Standard" as const,
					icon: "🌐",
					category: "DNS",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["dns_load_balancer"] },
					relationshipHints: [
						"dns_load_balancer: Geographic or weighted DNS routing",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "export",
					description: "Export Zone File.",
					descriptionShort: "Export Zone File.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "import",
					description: "Import F5 Cloud Services DNS Zone.",
					descriptionShort: "Import F5 Cloud Services DNS Zone.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "import_axfr",
					description: "Import DNS Zone via AXFR.",
					descriptionShort: "Import DNS Zone via AXFR.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "import_bind_create",
					description: "Import BIND Files to Create DNS Zones.",
					descriptionShort: "Import BIND Files to Create DNS Zones.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "import_bind_validate",
					description: "Validate BIND Files for Import.",
					descriptionShort: "Validate BIND Files for Import.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "local_zone_file",
					description: "GET local zone file from secondary DNS.",
					descriptionShort: "GET local zone file from secondary DNS.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "remote_zone_file",
					description: "GET remote zone file from primary DNS.",
					descriptionShort: "GET remote zone file from primary DNS.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "request_log",
					description: "Retrieve DNS Zone Request Logs.",
					descriptionShort: "Retrieve DNS Zone Request Logs.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "rrset",
					description: "Create CustomAPI.",
					descriptionShort: "Create CustomAPI.",
					tier: "Standard" as const,
					operations: ["create", "list", "replace", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suggest-value",
					description:
						"SuggestValues returns suggested values for the specified field in the given Create/Replace/Custom request.",
					descriptionShort:
						"SuggestValues returns suggested values for the specified fie",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "verify",
					description:
						"Verify DNS Domain for a given dns_domain object.",
					descriptionShort:
						"Verify DNS Domain for a given dns_domain object.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "health_statu",
					description:
						"GET Health Status of all DNS Load Balancers in a namespace.",
					descriptionShort:
						"GET Health Status of all DNS Load Balancers in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "health_status_change_event",
					description:
						"GET DNS Load Balancer Pool Health Status Changes.",
					descriptionShort:
						"GET DNS Load Balancer Pool Health Status Changes.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "metric",
					description: "Request to GET DNS zone metrics data.",
					descriptionShort: "Request to GET DNS zone metrics data.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "pool_members_health_statu",
					description:
						"GET Health Status of all DNS Load Balancer Pool Members in a namespace.",
					descriptionShort:
						"GET Health Status of all DNS Load Balancer Pool Members in a",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to DNS Management.",
					descriptionShort: "Subscribe to DNS Management.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to DNS Management.",
					descriptionShort: "Unsubscribe to DNS Management.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"21 resources discovered but not in primaryResources: clone_from_dns_domain, dns_compliance_checkss, dns_lb_health_check, dns_lb_pool, export...",
			],
			resourceCategories: {
				crud: [
					"clone_from_dns_domain",
					"dns_compliance_checkss",
					"dns_domain",
					"dns_lb_health_check",
					"dns_lb_pool",
					"dns_load_balancer",
					"dns_zone",
					"export",
					"import",
					"import_axfr",
					"import_bind_create",
					"import_bind_validate",
					"local_zone_file",
					"remote_zone_file",
					"request_log",
					"rrset",
					"suggest-value",
					"verify",
				],
				analytics: [
					"health_statu",
					"health_status_change_event",
					"metric",
					"pool_members_health_statu",
				],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"managed_kubernetes",
		{
			name: "managed_kubernetes",
			displayName: "Managed Kubernetes",
			description:
				"Role-based access controls with cluster-scoped permissions and namespace bindings. Pod security admission levels enforce baseline, restricted, or privileged profiles. Container registry credentials support private image pulls across hybrid deployments. Policy rules define resource verbs, groups, and non-resource URL access patterns.",
			descriptionShort:
				"Cluster RBAC, pod security, and container registries.",
			descriptionMedium:
				"Kubernetes role bindings and admission policies. Registry integration for EKS, AKS, and GKE workloads.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Infrastructure",
			useCases: [
				"Manage XCKS (Managed Kubernetes) cluster RBAC and security",
				"Configure pod security policies and admission controllers",
				"Manage container registries for enterprise deployments",
				"Integrate with external Kubernetes clusters (EKS, AKS, GKE)",
			],
			relatedDomains: ["container_services", "sites", "service_mesh"],
			icon: "⚙️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748B'%3E%3Cpath d='M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "mk8s_cluster",
					description: "Managed Kubernetes cluster configuration",
					descriptionShort: "MK8s cluster",
					tier: "Advanced" as const,
					icon: "☸️",
					category: "Container",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["k8s_cluster_role"] },
					relationshipHints: [
						"k8s_cluster_role: RBAC roles for cluster access",
					],
				},
				{
					name: "k8s_cluster_role",
					description: "Kubernetes cluster RBAC role configuration",
					descriptionShort: "K8s cluster role",
					tier: "Advanced" as const,
					icon: "👤",
					category: "Container",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "container_registry",
					description: "Container image registry for workload images",
					descriptionShort: "Container registry",
					tier: "Advanced" as const,
					icon: "📦",
					category: "Container",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "container_registry",
					description: "Container image registry for workload images",
					descriptionShort: "Container registry",
					tier: "Advanced" as const,
					icon: "📦",
					category: "Container",
					supportsLogs: false,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "k8s_cluster_role",
					description: "Kubernetes cluster RBAC role configuration",
					descriptionShort: "K8s cluster role",
					tier: "Advanced" as const,
					icon: "👤",
					category: "Container",
					supportsLogs: false,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "k8s_cluster_role_binding",
					description:
						"Create k8s_cluster_role_binding will create the object in the storage backend for namespace metadata.namespace.",
					descriptionShort:
						"Create k8s_cluster_role_binding will create the object in th",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "k8s_pod_security_admission",
					description:
						"Create k8s_pod_security_admission will create the object in the storage backend.",
					descriptionShort:
						"Create k8s_pod_security_admission will create the object in ",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "k8s_pod_security_policy",
					description:
						"Create k8s_pod_security_policy will create the object in the storage backend for namespace metadata.namespace.",
					descriptionShort:
						"Create k8s_pod_security_policy will create the object in the",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"3 resources discovered but not in primaryResources: k8s_cluster_role_binding, k8s_pod_security_admission, k8s_pod_security_policy",
			],
			resourceCategories: {
				crud: [
					"container_registry",
					"k8s_cluster_role",
					"k8s_cluster_role_binding",
					"k8s_pod_security_admission",
					"k8s_pod_security_policy",
				],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"marketplace",
		{
			name: "marketplace",
			displayName: "Marketplace",
			description:
				"External connector infrastructure supporting direct, GRE, and encrypted tunnel modes with IKE parameter configuration and dead peer detection intervals. Cloud provider instances for Terraform automation and vendor partnerships. Service catalog entries with per-namespace activation flags, resource quotas, and administrative dashboard tile arrangement for operational workflows.",
			descriptionShort: "Add-on services, connectors, and TPM policies.",
			descriptionMedium:
				"Third-party GRE and IPSec tunnel provisioning with DPD timers. Shared resource allocation across namespaces with tile placement controls.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Platform",
			useCases: [
				"Access third-party integrations and add-ons",
				"Manage marketplace extensions",
				"Configure Terraform and external integrations",
				"Manage TPM policies",
			],
			relatedDomains: ["bigip", "admin"],
			icon: "🏪",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F97316'%3E%3Cpath d='M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1v-2l-1-5zM6 18v-4h6v4H6z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "marketplace_item",
					description: "Marketplace item for service catalog",
					descriptionShort: "Marketplace item",
					tier: "Standard" as const,
					icon: "🛒",
					category: "Other",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "subscription",
					description: "Subscription for service entitlements",
					descriptionShort: "Subscription",
					tier: "Standard" as const,
					icon: "💳",
					category: "Other",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "addon_service",
					description:
						"Retrieves addon service information for the given addon service name.",
					descriptionShort:
						"Retrieves addon service information for the given addon serv",
					tier: "Standard" as const,
					operations: ["get", "list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cminstance",
					description:
						"Create App type will create the configuration in namespace metadata.namespace.",
					descriptionShort:
						"Create App type will create the configuration in namespace m",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "external_connector",
					description:
						"Shape of the external_connector configuration specification.",
					descriptionShort:
						"Shape of the external_connector configuration specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "force-delete",
					description:
						"Force DELETE view object. This can result in staled objects in cloud provider.",
					descriptionShort:
						"Force DELETE view object. This can result in staled objects ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "generate_token",
					description:
						"Generate token that will be used by the third party application.",
					descriptionShort:
						"Generate token that will be used by the third party applicat",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "get_security_config",
					description:
						"Fetch the corresponding Security Config for the given Third Party Application.",
					descriptionShort:
						"Fetch the corresponding Security Config for the given Third ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "navigation_tile",
					description:
						"List the set of navigation_tile in a namespace.",
					descriptionShort:
						"List the set of navigation_tile in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "plan",
					description: "List the set of plan in a namespace.",
					descriptionShort: "List the set of plan in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "run",
					description:
						"Perform terraform actions for a given view. Supported actions are apply and plan.",
					descriptionShort:
						"Perform terraform actions for a given view. Supported action",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "terraform_parameter",
					description:
						"Returned from list of terraform parameter objects for a given view.",
					descriptionShort:
						"Returned from list of terraform parameter objects for a give",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "third_party_application",
					description: "",
					descriptionShort: "third_party_application",
					tier: "Standard" as const,
					operations: ["replace", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "view_internal",
					description: "Returned internal object for a given view.",
					descriptionShort:
						"Returned internal object for a given view.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "activation-statu",
					description:
						"GET current subscription status for an addon service. Response can indicate whether the service was successfully subscribed or in pending state.",
					descriptionShort:
						"GET current subscription status for an addon service. Respon",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "all-activation-statu",
					description:
						"GET current subscription status for all addon services in a feature tier. Response can indicate whether the service was successfully subscribed or in pending state.",
					descriptionShort:
						"GET current subscription status for all addon services in a ",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "statu",
					description:
						"Returned from list of terraform parameter status objects for a given view.",
					descriptionShort:
						"Returned from list of terraform parameter status objects for",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "addon_subscription",
					description:
						"Create a new Addon Subscription with Addon Subscription State.",
					descriptionShort:
						"Create a new Addon Subscription with Addon Subscription Stat",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"16 resources discovered but not in primaryResources: addon_service, cminstance, external_connector, force-delete, generate_token...",
			],
			resourceCategories: {
				crud: [
					"addon_service",
					"cminstance",
					"external_connector",
					"force-delete",
					"generate_token",
					"get_security_config",
					"navigation_tile",
					"plan",
					"run",
					"terraform_parameter",
					"third_party_application",
					"view_internal",
				],
				analytics: [
					"activation-statu",
					"all-activation-statu",
					"statu",
				],
				utilities: [],
				management: ["addon_subscription"],
			},
		},
	],
	[
		"network",
		{
			name: "network",
			displayName: "Network",
			description:
				"Routing table manipulation via peer state machines and path selection algorithms. Secure conduits between locations using IKE handshakes, cipher suites, and key exchanges. Segment attachments bridge hybrid topologies spanning cloud providers and on-premises infrastructure. SRv6 addressing, CIDR block matching, and advertisement controls direct traffic flows across distributed deployments with granular policy enforcement.",
			descriptionShort:
				"BGP peering, IPsec tunnels, and segment policies.",
			descriptionMedium:
				"Border gateway protocol with ASN management and autonomous system relationships. Site-to-site VPN linking datacenters through encrypted channels.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Networking",
			useCases: [
				"Configure BGP routing and ASN management",
				"Manage IPsec tunnels and IKE phases",
				"Configure network connectors and routes",
				"Manage SRv6 and subnetting",
				"Define segment connections and policies",
				"Configure IP prefix sets",
			],
			relatedDomains: ["virtual", "network_security", "dns"],
			icon: "🔌",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233B82F6'%3E%3Cpath d='M16 9v4.66l-3.5 3.51V19h-1v-1.83L8 13.65V9h8m0-6h-2v4h-4V3H8v4H6v6.5l3.5 3.5v5h5v-5l3.5-3.5V7h-2V3z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "virtual_network",
					description:
						"Virtual network for site connectivity and segmentation",
					descriptionShort: "Virtual network",
					tier: "Standard" as const,
					icon: "🔗",
					category: "Networking",
					supportsLogs: false,
					supportsMetrics: false,
					dependencies: { optional: ["network_connector"] },
					relationshipHints: [
						"network_connector: Connect to external networks",
					],
				},
				{
					name: "network_connector",
					description:
						"Network connector for site-to-site or cloud connectivity",
					descriptionShort: "Network connector",
					tier: "Advanced" as const,
					icon: "🔌",
					category: "Networking",
					supportsLogs: false,
					supportsMetrics: true,
					dependencies: { required: ["virtual_network"] },
					relationshipHints: ["virtual_network: Network to connect"],
				},
				{
					name: "site_mesh_group",
					description:
						"Mesh connectivity configuration between multiple sites",
					descriptionShort: "Site mesh group",
					tier: "Advanced" as const,
					icon: "🕸️",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: true,
					dependencies: { required: ["site"] },
					relationshipHints: [
						"site: Sites to include in mesh connectivity",
					],
				},
			],
			allResources: [
				{
					name: "address_allocator",
					description:
						"Create Address Allocator will create an address allocator object in 'system' namespace of the user.",
					descriptionShort:
						"Create Address Allocator will create an address allocator ob",
					tier: "Standard" as const,
					operations: ["create", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "advertise_policy",
					description:
						"Advertise_policy object controls how and where a service represented by a given virtual_host object is advertised to consumers.",
					descriptionShort:
						"Advertise_policy object controls how and where a service rep",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bgp",
					description:
						"BGP object is the configuration for peering with external BGP servers.\nIt is created by users in system namespace.",
					descriptionShort:
						"BGP object is the configuration for peering with external BG",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bgp_asn_set",
					description:
						"Create bgp_asn_set creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create bgp_asn_set creates a new object in the storage backe",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bgp_peer",
					description: "Show BGP Peer information.",
					descriptionShort: "Show BGP Peer information.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bgp_route",
					description: "Show routes exported / imported via BGP.",
					descriptionShort:
						"Show routes exported / imported via BGP.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bgp_routing_policy",
					description:
						"BGP Routing Policy is a list of rules containing match criteria\nand action to be applied. These rules help contol routes which are\nimported or exported to BGP peers.",
					descriptionShort:
						"BGP Routing Policy is a list of rules containing match crite",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dc_cluster_group",
					description: "Create DC Cluster group in given namespace.",
					descriptionShort:
						"Create DC Cluster group in given namespace.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "forwarding_classs",
					description:
						"Forwarding Class is created by users in system namespace.",
					descriptionShort:
						"Forwarding Class is created by users in system namespace.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ike_phase1_profile",
					description:
						"Shape of the IKE Phase1 profile specification.",
					descriptionShort:
						"Shape of the IKE Phase1 profile specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ike_phase2_profile",
					description:
						"Shape of the IKE Phase2 profile specification.",
					descriptionShort:
						"Shape of the IKE Phase2 profile specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ike1",
					description:
						"Shape of the IKE Phase1 profile specification.",
					descriptionShort:
						"Shape of the IKE Phase1 profile specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ike2",
					description:
						"Shape of the IKE Phase2 profile specification.",
					descriptionShort:
						"Shape of the IKE Phase2 profile specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ip_prefix_set",
					description:
						"Create ip_prefix_set creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create ip_prefix_set creates a new object in the storage bac",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "network_connector",
					description:
						"Network connector for site-to-site or cloud connectivity",
					descriptionShort: "Network connector",
					tier: "Advanced" as const,
					icon: "🔌",
					category: "Networking",
					supportsLogs: false,
					supportsMetrics: true,
					dependencies: { required: ["virtual_network"] },
					relationshipHints: ["virtual_network: Network to connect"],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "public_ip",
					description: "",
					descriptionShort: "public_ip",
					tier: "Standard" as const,
					operations: ["replace", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "route",
					description:
						"Create route object in a given namespace. Route object is list of route rules.\nEach rule has match condition to match incoming requests and actions to take on matching requests.\nVirtual host object has reference to route object.",
					descriptionShort:
						"Create route object in a given namespace. Route object is li",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "simplified_route",
					description:
						"Show user-friendly VER routes matching the request.",
					descriptionShort:
						"Show user-friendly VER routes matching the request.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "srv6_network_slice",
					description:
						"Create srv6_network_slice creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create srv6_network_slice creates a new object in the storag",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "subnet",
					description:
						"Subnet object contains configuration for an interface of a VM/pod.\nIt is created in user or shared namespace.",
					descriptionShort:
						"Subnet object contains configuration for an interface of a V",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "traceroute",
					description: "Run traceroute to a destination.",
					descriptionShort: "Run traceroute to a destination.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tunnel",
					description:
						"Create tunnel in a given namespace. If one already exist it will give a error.",
					descriptionShort:
						"Create tunnel in a given namespace. If one already exist it ",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "virtual_network",
					description:
						"Virtual network for site connectivity and segmentation",
					descriptionShort: "Virtual network",
					tier: "Standard" as const,
					icon: "🔗",
					category: "Networking",
					supportsLogs: false,
					supportsMetrics: false,
					dependencies: { optional: ["network_connector"] },
					relationshipHints: [
						"network_connector: Connect to external networks",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "bgpstatu",
					description:
						"Returned from list of BGP status objects for a given view.",
					descriptionShort:
						"Returned from list of BGP status objects for a given view.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "metric",
					description: "DC Cluster Group metrics.",
					descriptionShort: "DC Cluster Group metrics.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"23 resources discovered but not in primaryResources: address_allocator, advertise_policy, bgp, bgp_asn_set, bgp_peer...",
			],
			resourceCategories: {
				crud: [
					"address_allocator",
					"advertise_policy",
					"bgp",
					"bgp_asn_set",
					"bgp_peer",
					"bgp_route",
					"bgp_routing_policy",
					"dc_cluster_group",
					"forwarding_classs",
					"ike_phase1_profile",
					"ike_phase2_profile",
					"ike1",
					"ike2",
					"ip_prefix_set",
					"network_connector",
					"public_ip",
					"route",
					"simplified_route",
					"srv6_network_slice",
					"subnet",
					"traceroute",
					"tunnel",
					"virtual_network",
				],
				analytics: ["bgpstatu", "metric"],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"network_security",
		{
			name: "network_security",
			displayName: "Network Security",
			description:
				"Perimeter defense through firewall configurations, address translation, and ingress/egress policies. Traffic steering directs packets according to defined criteria including origin, target, and service type. Segment boundaries create workload isolation zones while HTTP intermediaries manage client requests to external destinations. Port mappings employ static and dynamic address pools for flexible translation scenarios across multi-tenant environments.",
			descriptionShort:
				"NAT policies, firewalls, and segment connections.",
			descriptionMedium:
				"Firewall rules with routing decisions based on source, destination, or protocol. Segmentation isolates workloads while outbound proxies govern access.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Security",
			useCases: [
				"Configure network firewall and ACL policies",
				"Manage NAT policies and port forwarding",
				"Configure policy-based routing",
				"Define network segments and policies",
				"Configure forward proxy policies",
			],
			relatedDomains: ["waf", "api", "network"],
			icon: "🔒",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F59E0B'%3E%3Cpath d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "network_policy",
					description:
						"Network security policy for traffic filtering",
					descriptionShort: "Network policy",
					tier: "Standard" as const,
					icon: "🔒",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: false,
				},
				{
					name: "forward_proxy_policy",
					description:
						"Forward proxy policy for outbound traffic control",
					descriptionShort: "Forward proxy policy",
					tier: "Advanced" as const,
					icon: "➡️",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
				},
				{
					name: "network_firewall",
					description:
						"Network firewall for layer 3/4 traffic protection",
					descriptionShort: "Network firewall",
					tier: "Standard" as const,
					icon: "🧱",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "fast_acl",
					description:
						"Create a `fast_acl` object, `fast_acl` object contains rules to protect site from denial of service\nIt has destination{destination IP, destination port) and references to `fast_acl_rule`",
					descriptionShort:
						"Create a `fast_acl` object, `fast_acl` object contains rules",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "fast_acl_rule",
					description:
						"Create a new Fast ACL rule, `fast_acl_rule` has specification to match source IP, source port and action to apply.",
					descriptionShort:
						"Create a new Fast ACL rule, `fast_acl_rule` has specificatio",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "filter_set",
					description: "Create specification.",
					descriptionShort: "Create specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "find",
					description:
						"Retrieve any saved filter sets that are applicable for the given context key(s)",
					descriptionShort:
						"Retrieve any saved filter sets that are applicable for the g",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "forward_proxy_policy",
					description:
						"Forward proxy policy for outbound traffic control",
					descriptionShort: "Forward proxy policy",
					tier: "Advanced" as const,
					icon: "➡️",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "graph",
					description:
						"Request to GET different network segments with given metrics .\nThis will give metric data for all segments including intra segment metrics.",
					descriptionShort:
						"Request to GET different network segments with given metrics",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "hit",
					description:
						"GET the counter for Forward Proxy Policy hits for a given namespace.",
					descriptionShort:
						"GET the counter for Forward Proxy Policy hits for a given na",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "latency",
					description:
						"GET the average latency for Service policy evaluation.",
					descriptionShort:
						"GET the average latency for Service policy evaluation.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "nat_policy",
					description:
						"NAT Policy create specification configures NAT Policy with multiple Rules,.",
					descriptionShort:
						"NAT Policy create specification configures NAT Policy with m",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "network_firewall",
					description:
						"Network firewall for layer 3/4 traffic protection",
					descriptionShort: "Network firewall",
					tier: "Standard" as const,
					icon: "🧱",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "network_policy",
					description:
						"Network security policy for traffic filtering",
					descriptionShort: "Network policy",
					tier: "Standard" as const,
					icon: "🔒",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "network_policy_rule",
					description:
						"Creates a network policy rule with configured parameters in specified namespace.",
					descriptionShort:
						"Creates a network policy rule with configured parameters in ",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "network_policy_set",
					description:
						"List the set of network_policy_set in a namespace.",
					descriptionShort:
						"List the set of network_policy_set in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "network_policy_view",
					description:
						"Shape of the Network policy view specification.",
					descriptionShort:
						"Shape of the Network policy view specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "policy_based_routing",
					description:
						"Shape of the Network Policy based routing create specification.",
					descriptionShort:
						"Shape of the Network Policy based routing create specificati",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "segment",
					description: "Shape of the segment specification.",
					descriptionShort: "Shape of the segment specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "segment_connection",
					description: "",
					descriptionShort: "segment_connection",
					tier: "Standard" as const,
					operations: ["replace", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "service_policy",
					description:
						"Create service_policy creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create service_policy creates a new object in the storage ba",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"15 resources discovered but not in primaryResources: fast_acl, fast_acl_rule, filter_set, find, graph...",
			],
			resourceCategories: {
				crud: [
					"fast_acl",
					"fast_acl_rule",
					"filter_set",
					"find",
					"forward_proxy_policy",
					"graph",
					"hit",
					"latency",
					"nat_policy",
					"network_firewall",
					"network_policy",
					"network_policy_rule",
					"network_policy_set",
					"network_policy_view",
					"policy_based_routing",
					"segment",
					"segment_connection",
					"service_policy",
				],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"nginx_one",
		{
			name: "nginx_one",
			displayName: "Nginx One",
			description:
				"Dataplane server registration with health status tracking and location awareness. Service discovery bindings for dynamic upstream resolution. Cloud service gateway integration for hybrid deployments. WAF policy attachment and instance-level security controls.",
			descriptionShort: "NGINX Plus instances and dataplane servers.",
			descriptionMedium:
				"Instance discovery, WAF integration, and service mesh connectivity. Subscription lifecycle and configuration synchronization.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Platform",
			useCases: [
				"Manage NGINX One platform integrations",
				"Configure NGINX Plus instances",
				"Integrate NGINX configuration management",
			],
			relatedDomains: ["marketplace"],
			icon: "🟢",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2322C55E'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "nginx_config",
					description: "NGINX configuration for proxy settings",
					descriptionShort: "NGINX config",
					tier: "Advanced" as const,
					icon: "⚙️",
					category: "Load Balancing",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["nginx_upstream"] },
					relationshipHints: [
						"nginx_upstream: Backend server configuration",
					],
				},
				{
					name: "nginx_upstream",
					description: "NGINX upstream for backend server pools",
					descriptionShort: "NGINX upstream",
					tier: "Advanced" as const,
					icon: "🎯",
					category: "Load Balancing",
					supportsLogs: false,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "nginx_csg",
					description: "List the set of nginx_csg in a namespace.",
					descriptionShort:
						"List the set of nginx_csg in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "nginx_dataplane_server",
					description:
						"GET NGINX One Servers associated to an NGINX dataplane.",
					descriptionShort:
						"GET NGINX One Servers associated to an NGINX dataplane.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "nginx_instance",
					description:
						"List the set of nginx_instance in a namespace.",
					descriptionShort:
						"List the set of nginx_instance in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "nginx_server",
					description: "List the set of nginx_server in a namespace.",
					descriptionShort:
						"List the set of nginx_server in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "nginx_service_discovery",
					description:
						"API to create NGINX Service Discovery object for a site or virtual site in system namespace.",
					descriptionShort:
						"API to create NGINX Service Discovery object for a site or v",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to NGINX One.",
					descriptionShort: "Subscribe to NGINX One.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to NGINX One.",
					descriptionShort: "Unsubscribe to NGINX One.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"7 resources discovered but not in primaryResources: nginx_csg, nginx_dataplane_server, nginx_instance, nginx_server, nginx_service_discovery...",
			],
			resourceCategories: {
				crud: [
					"nginx_csg",
					"nginx_dataplane_server",
					"nginx_instance",
					"nginx_server",
					"nginx_service_discovery",
				],
				analytics: [],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"object_storage",
		{
			name: "object_storage",
			displayName: "Object Storage",
			description:
				"Blob management for application component delivery across namespaces. Time-limited download links with cryptographic signing protect asset retrieval. Version-controlled packages organized by operating system type support artifact discovery. Query filtering by name, type, and release number enables programmatic access to integrator libraries and protection modules for mobile deployments.",
			descriptionShort:
				"Mobile SDK assets, versioned binaries, and app shield files.",
			descriptionMedium:
				"Versioned library distribution for mobile app integrators. Presigned URLs enable secure downloads with OS-specific builds for iOS and Android.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Platform",
			useCases: [
				"Manage object storage services",
				"Configure stored objects and buckets",
				"Manage storage policies",
			],
			relatedDomains: ["marketplace"],
			icon: "🗄️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2378716C'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-8h4v8zm6 0h-4v-8h4v8zm6 0h-4v-8h4v8zm0-10H4V4h16v6z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "object_store",
					description: "Object store for blob storage management",
					descriptionShort: "Object store",
					tier: "Standard" as const,
					icon: "💾",
					category: "Storage",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["bucket"] },
					relationshipHints: [
						"bucket: Storage buckets in this store",
					],
				},
				{
					name: "bucket",
					description: "Storage bucket for object storage",
					descriptionShort: "Bucket",
					tier: "Standard" as const,
					icon: "📦",
					category: "Storage",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { required: ["object_store"] },
					relationshipHints: ["object_store: Parent object store"],
				},
			],
			allResources: [
				{
					name: "mobile-app-shield",
					description:
						"ListMobileAppShields is an API to list all mobile app shields available for download.",
					descriptionShort:
						"ListMobileAppShields is an API to list all mobile app shield",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "mobile-integrator",
					description:
						"ListMobileIntegrators is an API to list all mobile integrators available for download.",
					descriptionShort:
						"ListMobileIntegrators is an API to list all mobile integrato",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "stored_object",
					description:
						"ListObjects is an API to list objects in object store.",
					descriptionShort:
						"ListObjects is an API to list objects in object store.",
					tier: "Standard" as const,
					operations: ["list", "replace", "delete", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"3 resources discovered but not in primaryResources: mobile-app-shield, mobile-integrator, stored_object",
			],
			resourceCategories: {
				crud: [
					"mobile-app-shield",
					"mobile-integrator",
					"stored_object",
				],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"observability",
		{
			name: "observability",
			displayName: "Observability",
			description:
				"Telemetry systems execute scheduled availability checks from distributed AWS locations worldwide. Response code validation and timing metrics feed into historical trend analysis. DNS resolution accuracy verification ensures name service reliability. Certificate lifecycle tracking generates expiration warnings before outages occur. Regional probe distribution provides geographic coverage insights. Health summaries aggregate results into actionable dashboards with configurable alerting thresholds.",
			descriptionShort:
				"Synthetic health checks and DNS resolution validation.",
			descriptionMedium:
				"HTTP availability probes with latency measurement. Certificate expiration alerts and global status dashboards for infrastructure health.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Operations",
			useCases: [
				"Configure synthetic monitoring",
				"Define monitoring and testing policies",
				"Manage observability dashboards",
			],
			relatedDomains: ["statistics", "support"],
			icon: "📊",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233B82F6'%3E%3Cpath d='M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "log_receiver",
					description: "Log receiver for centralized log collection",
					descriptionShort: "Log receiver",
					tier: "Standard" as const,
					icon: "📝",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "metrics_receiver",
					description:
						"Metrics receiver for centralized metrics collection",
					descriptionShort: "Metrics receiver",
					tier: "Standard" as const,
					icon: "📊",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "alert_policy",
					description: "Alert policy for monitoring and notification",
					descriptionShort: "Alert policy",
					tier: "Standard" as const,
					icon: "🔔",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "access_log",
					description:
						"Request to GET access logs that matches the criteria in request for a given namespace.\nTypically, virtual host is specified as match condition in the request to GET all access logs\nfor a virtual host. By default, the access logs in the response are sorted in the reverse chronological order.",
					descriptionShort:
						"Request to GET access logs that matches the criteria in requ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "aggregation",
					description:
						"GET summary/aggregation data for alerts in the given namespace.\nFor `system` namespace, all alerts for the tenant matching the query specified\nin the request will be considered for aggregation.",
					descriptionShort:
						"GET summary/aggregation data for alerts in the given namespa",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "alert",
					description:
						"GET alerts matching the filter for the given namespace.",
					descriptionShort:
						"GET alerts matching the filter for the given namespace.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "all_ns_alert",
					description:
						"For system namespace, all the alerts for the tenant matching the filter specified in the request\nwill be returned in the response.",
					descriptionShort:
						"For system namespace, all the alerts for the tenant matching",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "audit_log",
					description:
						"Request to GET audit logs that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nCRUD operations performed in the namespace. User with access to the `system` namespace\nmay query for audit logs across all namespaces for a given tenant.",
					descriptionShort:
						"Request to GET audit logs that matches the criteria in reque",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "certificate-report-detail",
					description: "Returns the certificate report detail.",
					descriptionShort: "Returns the certificate report detail.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dns-monitors-health",
					description:
						"Returns list of DNS monitors in namespace with corresponding region health(s)",
					descriptionShort:
						"Returns list of DNS monitors in namespace with corresponding",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "filtered-dns-monitor-list",
					description:
						"List v1_dns_monitor in a namespace based on filter.",
					descriptionShort:
						"List v1_dns_monitor in a namespace based on filter.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "filtered-http-monitor-list",
					description:
						"List v1_http_monitor in a namespace based on filter.",
					descriptionShort:
						"List v1_http_monitor in a namespace based on filter.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "firewall_log",
					description:
						"Request to GET access logs and network logs with policy hits.\nBy default, the firewall logs in the response are sorted in the reverse chronological order.",
					descriptionShort:
						"Request to GET access logs and network logs with policy hits",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "global-history",
					description:
						"Returns a time series of critical monitor counts in namespace.",
					descriptionShort:
						"Returns a time series of critical monitor counts in namespac",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "health",
					description: "Returns 200 Ok if the service is healthy.",
					descriptionShort:
						"Returns 200 Ok if the service is healthy.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "history",
					description:
						"GET the history of alert notifications sent to the end-user between the start_time and end_time that matches the\nfilter specified in the request.",
					descriptionShort:
						"GET the history of alert notifications sent to the end-user ",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "http-monitor-detail",
					description:
						"Returns the monitor latency, trend, and health by region.",
					descriptionShort:
						"Returns the monitor latency, trend, and health by region.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "http-monitors-health",
					description:
						"Returns list of HTTP monitors in namespace with corresponding region health(s)",
					descriptionShort:
						"Returns list of HTTP monitors in namespace with correspondin",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "monitor-event",
					description:
						"Returns the healthy and critical events for the specified monitor.",
					descriptionShort:
						"Returns the healthy and critical events for the specified mo",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "monitor-history",
					description:
						"Returns the healthy and critical statuses for the specified monitor.",
					descriptionShort:
						"Returns the healthy and critical statuses for the specified ",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "platform_event",
					description:
						"Request to GET platform event that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nCRUD operations performed in the namespace. User with access to the `system` namespace\nmay query for platform events across all namespaces for a given tenant.",
					descriptionShort:
						"Request to GET platform event that matches the criteria in r",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "scroll",
					description:
						'Scroll request is used to fetch large number of alert messages in multiple batches with each AlertsHistoryResponse\ncontaining no more than 500 alerts. To scroll through more than 500 or all alert messages, one can use the\nAlertsHistoryScrollRequest. Use the scroll_id returned in the AlertsHistoryResponse to fetch the next batch of alert messages and\none can continue this process till the scroll_id returned in the AlertsHistoryResponse is "" which indicates no more\nalert messages to scroll.',
					descriptionShort:
						"Scroll request is used to fetch large number of alert messag",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suggest-value",
					description:
						"Returns suggested values for the specified field in the given Create/Replace/Custom request.",
					descriptionShort:
						"Returns suggested values for the specified field in the give",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tls-report-detail",
					description:
						"Returns the HTML encoding of the generated TLS report.",
					descriptionShort:
						"Returns the HTML encoding of the generated TLS report.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "v1_dns_monitor",
					description: "Create a new DNS Monitor.",
					descriptionShort: "Create a new DNS Monitor.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "v1_http_monitor",
					description: "Create HTTP Monitor.",
					descriptionShort: "Create HTTP Monitor.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "vk8s_audit_log",
					description:
						"Request to GET Virtual K8s audit logs that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nCRUD operations performed in the namespace. User with access to the `system` namespace\nmay query for audit logs across all namespaces for a given tenant.",
					descriptionShort:
						"Request to GET Virtual K8s audit logs that matches the crite",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "vk8s_event",
					description:
						"Request to GET Virtual K8s events that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nvK8s events in the namespace. User with access to the `system` namespace may query for vK8s across\nall namespaces for a given tenant.",
					descriptionShort:
						"Request to GET Virtual K8s events that matches the criteria ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "certificate-summary",
					description:
						"Returns list of TLS certificate expirations in specified time window for HTTPS monitors running in namespace.",
					descriptionShort:
						"Returns list of TLS certificate expirations in specified tim",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "dns-monitor-summary",
					description:
						"Returns the DNS monitor health status, latency, and trend.",
					descriptionShort:
						"Returns the DNS monitor health status, latency, and trend.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "global-summary",
					description:
						"Returns a healthy and critical count of all monitors in namespace, based on monitor type.",
					descriptionShort:
						"Returns a healthy and critical count of all monitors in name",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "http-monitor-summary",
					description:
						"Returns the HTTP monitor health status, latency, and trend.",
					descriptionShort:
						"Returns the HTTP monitor health status, latency, and trend.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "metric-query",
					description:
						"Returns time series data of monitor metric query by region.",
					descriptionShort:
						"Returns time series data of monitor metric query by region.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "record-type-summary",
					description:
						"Returns record type summary for DNS monitor including record type and count.",
					descriptionShort:
						"Returns record type summary for DNS monitor including record",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "source-summary",
					description:
						"Returns the healthy and critical status count, latency, and coordinates for each source region.",
					descriptionShort:
						"Returns the healthy and critical status count, latency, and ",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "tls-report-summary",
					description:
						"Returns the TLS report summary including grade, score, and protocol names.",
					descriptionShort:
						"Returns the TLS report summary including grade, score, and p",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "tls-summary",
					description:
						"Returns TLS summary of all HTTPS monitors running in namespace.",
					descriptionShort:
						"Returns TLS summary of all HTTPS monitors running in namespa",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description:
						"Subscribe to Observability Synthetic Monitor.",
					descriptionShort:
						"Subscribe to Observability Synthetic Monitor.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description:
						"Unsubscribe to Observability Synthetic Monitor.",
					descriptionShort:
						"Unsubscribe to Observability Synthetic Monitor.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"36 resources discovered but not in primaryResources: access_log, aggregation, alert, all_ns_alert, audit_log...",
			],
			resourceCategories: {
				crud: [
					"access_log",
					"aggregation",
					"alert",
					"all_ns_alert",
					"audit_log",
					"certificate-report-detail",
					"dns-monitors-health",
					"filtered-dns-monitor-list",
					"filtered-http-monitor-list",
					"firewall_log",
					"global-history",
					"health",
					"history",
					"http-monitor-detail",
					"http-monitors-health",
					"monitor-event",
					"monitor-history",
					"platform_event",
					"scroll",
					"suggest-value",
					"tls-report-detail",
					"v1_dns_monitor",
					"v1_http_monitor",
					"vk8s_audit_log",
					"vk8s_event",
				],
				analytics: [
					"certificate-summary",
					"dns-monitor-summary",
					"global-summary",
					"http-monitor-summary",
					"metric-query",
					"record-type-summary",
					"source-summary",
					"tls-report-summary",
					"tls-summary",
				],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"rate_limiting",
		{
			name: "rate_limiting",
			displayName: "Rate Limiting",
			description:
				"Threshold-based request blocking using sliding window calculations. Burst smoothing algorithms maintain sustained throughput without exceeding defined maximums. Per-connection controls apply granular restrictions by protocol type. Automatic block actions trigger when request counts surpass configured limits within specified intervals.",
			descriptionShort: "Request throttling, quotas, and policer rules.",
			descriptionMedium:
				"Time-based quota enforcement with configurable windows in hours, minutes, or seconds. Protocol-specific controls for traffic shaping.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Networking",
			useCases: [
				"Configure rate limiter policies",
				"Manage policer configurations",
				"Control traffic flow and queuing",
			],
			relatedDomains: ["virtual", "network_security"],
			icon: "⏱️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F97316'%3E%3Cpath d='M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "rate_limiter",
					description:
						"Rate limiter for traffic throttling and protection",
					descriptionShort: "Rate limiter",
					tier: "Standard" as const,
					icon: "⏱️",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["rate_limiter_policy"] },
					relationshipHints: [
						"rate_limiter_policy: Detailed rate limiting rules",
					],
				},
				{
					name: "rate_limiter_policy",
					description:
						"Rate limiter policy with detailed throttling rules",
					descriptionShort: "Rate limiter policy",
					tier: "Standard" as const,
					icon: "📋",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
				},
				{
					name: "rate_limit_threshold",
					description:
						"Rate limit threshold configuration for traffic control",
					descriptionShort: "Rate limit threshold",
					tier: "Standard" as const,
					icon: "📊",
					category: "Security",
					supportsLogs: false,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "policer",
					description:
						"Create a new policer with traffic rate limits.",
					descriptionShort:
						"Create a new policer with traffic rate limits.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "protocol_policer",
					description:
						"Create a protocol_policer object, protocol_policer object contains list\nof L4 protocol match condition and corresponding traffic rate limits.",
					descriptionShort:
						"Create a protocol_policer object, protocol_policer object co",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "rate_limiter",
					description:
						"Rate limiter for traffic throttling and protection",
					descriptionShort: "Rate limiter",
					tier: "Standard" as const,
					icon: "⏱️",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["rate_limiter_policy"] },
					relationshipHints: [
						"rate_limiter_policy: Detailed rate limiting rules",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
			],
			validationWarnings: [
				"2 resources discovered but not in primaryResources: policer, protocol_policer",
			],
			resourceCategories: {
				crud: ["policer", "protocol_policer", "rate_limiter"],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"secops_and_incident_response",
		{
			name: "secops_and_incident_response",
			displayName: "Secops And Incident Response",
			description:
				"User threat assessment with configurable risk thresholds and mitigation rules. Detection covers high, medium, and low threat levels with corresponding actions like blocking, rate limiting, or alerting. Mitigation policies link to load balancers for real-time enforcement against identified bad actors.",
			descriptionShort:
				"Threat detection, user risk scoring, and automated blocking.",
			descriptionMedium:
				"Malicious user mitigation with threat level classification. Automated response actions for suspicious behavior patterns.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Security",
			useCases: [
				"Configure automated threat mitigation policies",
				"Define rules for malicious user detection",
				"Manage incident response workflows",
				"Apply blocking or rate limiting to threats",
			],
			relatedDomains: ["bot_defense", "waf", "network_security"],
			icon: "🚨",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23DC2626'%3E%3Cpath d='M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.25 6 2.25v4.78zM11 7h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "mitigation_policy",
					description: "Mitigation policy for incident response",
					descriptionShort: "Mitigation policy",
					tier: "Advanced" as const,
					icon: "🛡️",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: false,
				},
				{
					name: "malicious_user_rule",
					description: "Malicious user rule for threat mitigation",
					descriptionShort: "Malicious user rule",
					tier: "Advanced" as const,
					icon: "🚨",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "malicious_user_mitigation",
					description:
						"Create malicious_user_mitigation creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create malicious_user_mitigation creates a new object in the",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"1 resources discovered but not in primaryResources: malicious_user_mitigation",
			],
			resourceCategories: {
				crud: ["malicious_user_mitigation"],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"service_mesh",
		{
			name: "service_mesh",
			displayName: "Service Mesh",
			description:
				"NFV service lifecycle and software version tracking. Machine learning-driven classification with security risk assessment and PII detection. Override management for application behavior customization. Sidecar proxy orchestration with automatic mTLS certificate rotation and policy enforcement across distributed workloads.",
			descriptionShort: "Microservice routing and sidecar configuration.",
			descriptionMedium:
				"Application type definitions with discovery and learned schema analysis. Traffic pattern inference for intelligent request handling.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Infrastructure",
			useCases: [
				"Configure service mesh connectivity",
				"Manage endpoint discovery and routing",
				"Configure NFV services",
				"Define application settings and types",
			],
			relatedDomains: [
				"managed_kubernetes",
				"container_services",
				"virtual",
			],
			icon: "🕸️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A855F7'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "endpoint",
					description: "Service mesh endpoint for traffic routing",
					descriptionShort: "Endpoint",
					tier: "Advanced" as const,
					icon: "🎯",
					category: "Networking",
					supportsLogs: true,
					supportsMetrics: true,
				},
				{
					name: "origin_pool",
					description:
						"Backend server group for load balancer traffic distribution",
					descriptionShort: "Origin pool",
					tier: "Standard" as const,
					icon: "🎯",
					category: "Load Balancing",
					supportsLogs: false,
					supportsMetrics: true,
					dependencies: { optional: ["healthcheck"] },
					relationshipHints: [
						"healthcheck: Monitor origin server health",
					],
				},
				{
					name: "service_discovery",
					description:
						"Service discovery configuration for dynamic endpoints",
					descriptionShort: "Service discovery",
					tier: "Advanced" as const,
					icon: "🔍",
					category: "Networking",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "app_setting",
					description:
						"Create App setting configuration in namespace metadata.namespace.",
					descriptionShort:
						"Create App setting configuration in namespace metadata.names",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "app_type",
					description:
						"Create App type will create the configuration in namespace metadata.namespace.",
					descriptionShort:
						"Create App type will create the configuration in namespace m",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "endpoint",
					description: "Service mesh endpoint for traffic routing",
					descriptionShort: "Endpoint",
					tier: "Advanced" as const,
					icon: "🎯",
					category: "Networking",
					supportsLogs: true,
					supportsMetrics: true,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "force-delete",
					description: "Force DELETE NFV Service.",
					descriptionShort: "Force DELETE NFV Service.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "nfv_service",
					description:
						"Creates a new NFV service with configured parameters.",
					descriptionShort:
						"Creates a new NFV service with configured parameters.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "sid_counter",
					description: "API to GET SID Counters.",
					descriptionShort: "API to GET SID Counters.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "site_mesh_group",
					description:
						"Create a Site Mesh Group in system namespace of user.",
					descriptionShort:
						"Create a Site Mesh Group in system namespace of user.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "software_os_version",
					description:
						"API to GET OS IMAGE based on the software version.",
					descriptionShort:
						"API to GET OS IMAGE based on the software version.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "virtual_network",
					description: "Create virtual network in given namespace.",
					descriptionShort:
						"Create virtual network in given namespace.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "api_endpoint",
					description:
						"GET all auto discovered API endpoints for App type.",
					descriptionShort:
						"GET all auto discovered API endpoints for App type.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "learnt_schema",
					description:
						"GET Learnt Schema per API endpoint for a given auto discovered API endpoint for Service.",
					descriptionShort:
						"GET Learnt Schema per API endpoint for a given auto discover",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "metric",
					description: "Nfv Service metrics.",
					descriptionShort: "Nfv Service metrics.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "override",
					description:
						"GET all override for API endpoints configured for this App type.",
					descriptionShort:
						"GET all override for API endpoints configured for this App t",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "pdf",
					description:
						"GET PDF of all metrics for a given auto discovered API endpoint for App type.",
					descriptionShort:
						"GET PDF of all metrics for a given auto discovered API endpo",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "pop",
					description:
						"Remove override for dynamic component for API endpoints discovered for this App type.",
					descriptionShort:
						"Remove override for dynamic component for API endpoints disc",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "push",
					description:
						"Add override for dynamic component for API endpoints discovered for this App type.",
					descriptionShort:
						"Add override for dynamic component for API endpoints discove",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "suspicious_user",
					description: "GET status of suspicious users.",
					descriptionShort: "GET status of suspicious users.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "swagger_spec",
					description:
						"GET the corresponding Swagger spec for the given app type.",
					descriptionShort:
						"GET the corresponding Swagger spec for the given app type.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"17 resources discovered but not in primaryResources: app_setting, app_type, force-delete, nfv_service, sid_counter...",
			],
			resourceCategories: {
				crud: [
					"app_setting",
					"app_type",
					"endpoint",
					"force-delete",
					"nfv_service",
					"sid_counter",
					"site_mesh_group",
					"software_os_version",
					"virtual_network",
				],
				analytics: [
					"api_endpoint",
					"learnt_schema",
					"metric",
					"override",
					"pdf",
					"pop",
					"push",
					"suspicious_user",
					"swagger_spec",
				],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"shape",
		{
			name: "shape",
			displayName: "Shape",
			description:
				"Bot infrastructure policies with deployment tracking and subscription management. SafeAP protection against credential stuffing and account takeover. Mobile application shielding through SDK integration with OS-specific configurations. Real-time threat intelligence updates and automated response actions based on risk scoring and traffic patterns.",
			descriptionShort:
				"Bot defense, fraud prevention, and client integrity.",
			descriptionMedium:
				"Threat recognition with behavioral analysis and device fingerprinting. Mobile SDK integration for application shielding.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Security",
			useCases: [
				"Configure Shape Security policies",
				"Manage bot and threat prevention",
				"Configure SafeAP policies",
				"Enable threat recognition",
			],
			relatedDomains: ["bot_defense", "waf"],
			icon: "🎭",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A855F7'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "shape_app_firewall",
					description:
						"Shape application firewall for advanced protection",
					descriptionShort: "Shape WAF",
					tier: "Advanced" as const,
					icon: "🛡️",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
				},
				{
					name: "shape_recognizer",
					description:
						"Shape recognizer for traffic pattern analysis",
					descriptionShort: "Shape recognizer",
					tier: "Advanced" as const,
					icon: "🔍",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "action",
					description: "GET Malicious Traffic Overview in Actions.",
					descriptionShort:
						"GET Malicious Traffic Overview in Actions.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "affectedUser",
					description:
						"List affected users who have loaded this particular script.",
					descriptionShort:
						"List affected users who have loaded this particular script.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "age",
					description: "GET device age information.",
					descriptionShort: "GET device age information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "alert_gen_policy",
					description: "Create Alert Generation Policy.",
					descriptionShort: "Create Alert Generation Policy.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "alert_template",
					description: "Create Domain to protect.",
					descriptionShort: "Create Domain to protect.",
					tier: "Standard" as const,
					operations: ["create", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "allowed_domain",
					description: "Create allowed domain.",
					descriptionShort: "Create allowed domain.",
					tier: "Standard" as const,
					operations: ["create", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "analysi",
					description: "Mark / unmark field sensitivity by customer.",
					descriptionShort:
						"Mark / unmark field sensitivity by customer.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "apikey",
					description: "GET API key.",
					descriptionShort: "GET API key.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "app",
					description: "GET top latency overview apps.",
					descriptionShort: "GET top latency overview apps.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "app_provision",
					description: "Provision an application for a tenant.",
					descriptionShort: "Provision an application for a tenant.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "application",
					description: "Update an application's information.",
					descriptionShort: "Update an application's information.",
					tier: "Standard" as const,
					operations: ["create", "delete", "list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "asn",
					description: "GET Bot Top ASN Information.",
					descriptionShort: "GET Bot Top ASN Information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "asorg",
					description: "GET top malicious bots by AS Organization.",
					descriptionShort:
						"GET top malicious bots by AS Organization.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "atb",
					description: "ATB Status.",
					descriptionShort: "ATB Status.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "attackintent",
					description: "Top Malicious Bots by Attack Intent.",
					descriptionShort: "Top Malicious Bots by Attack Intent.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "audit",
					description: "GET SAFE block table list.",
					descriptionShort: "GET SAFE block table list.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "automation",
					description: "GET top malicious bots automation types.",
					descriptionShort:
						"GET top malicious bots automation types.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bad-bot-reduction",
					description: "Insight Bad Bot Reduction.",
					descriptionShort: "Insight Bad Bot Reduction.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "behavior",
					description:
						"List all the behaviors for a script depending on start time and end time.",
					descriptionShort:
						"List all the behaviors for a script depending on start time ",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bfp",
					description: "Top Attacked BFP.",
					descriptionShort: "Top Attacked BFP.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bot_allowlist_policy",
					description: "GET all bot allowlist policies and versions.",
					descriptionShort:
						"GET all bot allowlist policies and versions.",
					tier: "Standard" as const,
					operations: ["list", "replace", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bot_detection_rule",
					description: "Deploybotdetectionrules CustomAPI.",
					descriptionShort: "Deploybotdetectionrules CustomAPI.",
					tier: "Standard" as const,
					operations: ["create", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bot_detection_update",
					description: "Getbotdetectionupdates CustomAPI.",
					descriptionShort: "Getbotdetectionupdates CustomAPI.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bot_endpoint_policy",
					description: "GET all bot endpoint policies and versions.",
					descriptionShort:
						"GET all bot endpoint policies and versions.",
					tier: "Standard" as const,
					operations: ["list", "replace", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bot_infrastructure",
					description: "Create Bot Infrastructure.",
					descriptionShort: "Create Bot Infrastructure.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "bot_network_policy",
					description: "GET all bot network policies and versions.",
					descriptionShort:
						"GET all bot network policies and versions.",
					tier: "Standard" as const,
					operations: ["list", "replace", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "browser",
					description: "Malicious Report Transactions Browser.",
					descriptionShort: "Malicious Report Transactions Browser.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "category",
					description: "GET Endpoint Category Breakdown.",
					descriptionShort: "GET Endpoint Category Breakdown.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "channel",
					description:
						"GET channel chart data from shape recognize API.",
					descriptionShort:
						"GET channel chart data from shape recognize API.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "check",
					description: "Check if the tenant has the peer or not.",
					descriptionShort:
						"Check if the tenant has the peer or not.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "clone",
					description: "Clone the BRM Alert Template.",
					descriptionShort: "Clone the BRM Alert Template.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "config",
					description: "GET Connector config.",
					descriptionShort: "GET Connector config.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "conversion",
					description:
						"GET conversion chart data from shape recognize API.",
					descriptionShort:
						"GET conversion chart data from shape recognize API.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "country",
					description: "GET devices country information.",
					descriptionShort: "GET devices country information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "credential-stuffing-attack",
					description: "GET Insight Credential Stuffing Attack.",
					descriptionShort: "GET Insight Credential Stuffing Attack.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dashboard",
					description:
						"GET script overview data for a script depending on start time and end time.",
					descriptionShort:
						"GET script overview data for a script depending on start tim",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "deployment",
					description: "Getbotdetectionrulesdeployments CustomAPI.",
					descriptionShort:
						"Getbotdetectionrulesdeployments CustomAPI.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "deployment_history",
					description: "GET deployment history.",
					descriptionShort: "GET deployment history.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "detail",
					description: "GET SAFE block details.",
					descriptionShort: "GET SAFE block details.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "detected_domain",
					description:
						"GET the detected domains data for the tenant.",
					descriptionShort:
						"GET the detected domains data for the tenant.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "device",
					description: "GET top human device.",
					descriptionShort: "GET top human device.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "domain_detail",
					description: "GET the details of the domain provided.",
					descriptionShort: "GET the details of the domain provided.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "download_release_note",
					description:
						"Downloadbotdetectionupdatesreleasenotes CustomAPI.",
					descriptionShort:
						"Downloadbotdetectionupdatesreleasenotes CustomAPI.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "draft",
					description: "Getbotdetectionrulesdraft CustomAPI.",
					descriptionShort: "Getbotdetectionrulesdraft CustomAPI.",
					tier: "Standard" as const,
					operations: ["list", "create", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "enable",
					description:
						"Enable Application Traffic Insights feature for the tenant.",
					descriptionShort:
						"Enable Application Traffic Insights feature for the tenant.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "endpoint",
					description: "Report Endpoints.",
					descriptionShort: "Report Endpoints.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "endpointlabel",
					description: "GET top Endpoint labels.",
					descriptionShort: "GET top Endpoint labels.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "enjoy",
					description:
						"GET enjoy chart data from shape recognize API.",
					descriptionShort:
						"GET enjoy chart data from shape recognize API.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ep",
					description: "POST Safe Analyst Station ep request.",
					descriptionShort: "POST Safe Analyst Station ep request.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "expanded",
					description: "GET expanded traffic overview.",
					descriptionShort: "GET expanded traffic overview.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "feedback",
					description: "POST Safe block feedback.",
					descriptionShort: "POST Safe block feedback.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "field",
					description: "GET",
					descriptionShort: "GET",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "formField",
					description:
						"List form fields for all the scripts depending on start time and end time with GET method.",
					descriptionShort:
						"List form fields for all the scripts depending on start time",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "friction_aggregation",
					description:
						"GET Friction Aggregation chart data from shape recognize API.",
					descriptionShort:
						"GET Friction Aggregation chart data from shape recognize API",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "friction_histogram",
					description:
						"GET Histogram Aggregation chart data from shape recognize API.",
					descriptionShort:
						"GET Histogram Aggregation chart data from shape recognize AP",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "general_feedback",
					description:
						"Update fraud feedback for a transaction or session.",
					descriptionShort:
						"Update fraud feedback for a transaction or session.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "geolocation",
					description: "GET top human geolocation.",
					descriptionShort: "GET top human geolocation.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "getcurrentfrauddata",
					description:
						"GET Current Fraud data request for a time range.",
					descriptionShort:
						"GET Current Fraud data request for a time range.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "gettopriskyaccount",
					description:
						"GET top risky accounts data request in a time range.",
					descriptionShort:
						"GET top risky accounts data request in a time range.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "gettopriskydevice",
					description:
						"GET top risky devices data request in a time range.",
					descriptionShort:
						"GET top risky devices data request in a time range.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "gettopriskyipaddresse",
					description:
						"GET top risky IP addresses data request in a time range.",
					descriptionShort:
						"GET top risky IP addresses data request in a time range.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "gettopriskyreason",
					description:
						"GET top risky reasons data request for a time range.",
					descriptionShort:
						"GET top risky reasons data request for a time range.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "gettransactiondata",
					description:
						"GET Transaction data request for a time range.",
					descriptionShort:
						"GET Transaction data request for a time range.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "good",
					description: "GET top good bots.",
					descriptionShort: "GET top good bots.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "health",
					description: "Health Check.",
					descriptionShort: "Health Check.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "history",
					description: "Getbotdetectionrulechangehistory CustomAPI.",
					descriptionShort:
						"Getbotdetectionrulechangehistory CustomAPI.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "init",
					description:
						"Enable Client-Side Defense feature for the tenant.",
					descriptionShort:
						"Enable Client-Side Defense feature for the tenant.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ip",
					description: "Malicious Report Transactions IP.",
					descriptionShort: "Malicious Report Transactions IP.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "js_configuration",
					description:
						"GET JS Injection Configuration for this tenant.",
					descriptionShort:
						"GET JS Injection Configuration for this tenant.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "justification",
					description: "",
					descriptionShort: "justification",
					tier: "Standard" as const,
					operations: ["delete", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "lift",
					description:
						"GET lift chart data from shape recognize API.",
					descriptionShort:
						"GET lift chart data from shape recognize API.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "list",
					description: "GET All Protected Endpoints.",
					descriptionShort: "GET All Protected Endpoints.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "mitigated_domain",
					description: "Create Mitigated Domain.",
					descriptionShort: "Create Mitigated Domain.",
					tier: "Standard" as const,
					operations: ["create", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "mobile_base_config",
					description: "Create Mobile SDK Base Configuration.",
					descriptionShort: "Create Mobile SDK Base Configuration.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "mobile_base_config_file",
					description: "GET Mobile Base Configuration File.",
					descriptionShort: "GET Mobile Base Configuration File.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "mobile-sdk",
					description:
						"ListMobileSDKs is an API to list all mobile SDKs available for download.",
					descriptionShort:
						"ListMobileSDKs is an API to list all mobile SDKs available f",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "networkInteraction",
					description:
						"List all the network interactions for a script depending on start time and end time.",
					descriptionShort:
						"List all the network interactions for a script depending on ",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "o",
					description: "Malicious Report Transactions OS.",
					descriptionShort: "Malicious Report Transactions OS.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "overview",
					description: "GET top latency overview.",
					descriptionShort: "GET top latency overview.",
					tier: "Standard" as const,
					operations: ["create", "list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "platform",
					description: "GET top human platform.",
					descriptionShort: "GET top human platform.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "policy",
					description: "Deploy Policies to Bot Infrastructure.",
					descriptionShort: "Deploy Policies to Bot Infrastructure.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "protected_application",
					description:
						"Create applications protected by Bot Defense.",
					descriptionShort:
						"Create applications protected by Bot Defense.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "protected_domain",
					description: "Create Domain to protect.",
					descriptionShort: "Create Domain to protect.",
					tier: "Standard" as const,
					operations: ["create", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "provision",
					description:
						"GET Recognize provision status as add-on service.",
					descriptionShort:
						"GET Recognize provision status as add-on service.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "readStatu",
					description:
						"Allow / block script from reading form fields.",
					descriptionShort:
						"Allow / block script from reading form fields.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "region",
					description:
						"Returns Application Traffic Insights regions information for the tenant.",
					descriptionShort:
						"Returns Application Traffic Insights regions information for",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "rescue",
					description:
						"GET rescue chart data from shape recognize API.",
					descriptionShort:
						"GET rescue chart data from shape recognize API.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "rule",
					description: "Edit exising block rule.",
					descriptionShort: "Edit exising block rule.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "safecubejsdata",
					description:
						"GET Safe CubeJS data request for a given query.",
					descriptionShort:
						"GET Safe CubeJS data request for a given query.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "script",
					description:
						"List all the scripts for the tenant depending on start time and end time.",
					descriptionShort:
						"List all the scripts for the tenant depending on start time ",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "session",
					description: "GET devices session information.",
					descriptionShort: "GET devices session information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "src_tag_injection",
					description:
						"Validate js src tag injection in the target URL.",
					descriptionShort:
						"Validate js src tag injection in the target URL.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suggest-value",
					description:
						"Returns suggested values for the specified field in the given Create/Replace/Custom request.",
					descriptionShort:
						"Returns suggested values for the specified field in the give",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "table",
					description: "GET Safe block table as CSV file.",
					descriptionShort: "GET Safe block table as CSV file.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "template",
					description: "GET iApp template.",
					descriptionShort: "GET iApp template.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "testj",
					description:
						"Validate JS script tag injection in the target URL.",
					descriptionShort:
						"Validate JS script tag injection in the target URL.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "threat-type",
					description:
						"GetThreat Types traffic count for Peergroup Benchmarking.",
					descriptionShort:
						"GetThreat Types traffic count for Peergroup Benchmarking.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "timesery",
					description: "Malicious Report APP Time Series.",
					descriptionShort: "Malicious Report APP Time Series.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "top-good-bot",
					description: "GET Peer Group Top Good Bots.",
					descriptionShort: "GET Peer Group Top Good Bots.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "top-reason-code",
					description: "GET Top Reason Codes.",
					descriptionShort: "GET Top Reason Codes.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "total-automation",
					description: "GET Insight Totol Automation data.",
					descriptionShort: "GET Insight Totol Automation data.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "transaction",
					description: "GET Bot Transactions Information.",
					descriptionShort: "GET Bot Transactions Information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "transaction_detail",
					description:
						"GET a detailed information about the requested transaction.",
					descriptionShort:
						"GET a detailed information about the requested transaction.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "transaction_device_history",
					description:
						"POST Safe Analyst Station specific transaction device history.",
					descriptionShort:
						"POST Safe Analyst Station specific transaction device histor",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "transaction_location",
					description:
						"POST Safe Analyst Station specific transaction locations.",
					descriptionShort:
						"POST Safe Analyst Station specific transaction locations.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "transaction_related_session",
					description:
						"POST Safe Analyst Station specific transaction related sessions.",
					descriptionShort:
						"POST Safe Analyst Station specific transaction related sessi",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "transaction_timeline",
					description:
						"POST Safe Analyst Station specific transaction timeline.",
					descriptionShort:
						"POST Safe Analyst Station specific transaction timeline.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "transactions_csv",
					description: "GET Safe transactions as CSV file.",
					descriptionShort: "GET Safe transactions as CSV file.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "transactions_over_time",
					description:
						"POST Safe Analyst Station Dashboard Transaction Breakdown request.",
					descriptionShort:
						"POST Safe Analyst Station Dashboard Transaction Breakdown re",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ua",
					description: "GET devices user agent information.",
					descriptionShort: "GET devices user agent information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "unaddressed-automation",
					description: "Insight Unaddressed Automations.",
					descriptionShort: "Insight Unaddressed Automations.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "unique",
					description: "GET devices unique access information.",
					descriptionShort: "GET devices unique access information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "update_domain",
					description:
						"Update domain from mitigated domains to allowed domains and vice versa.",
					descriptionShort:
						"Update domain from mitigated domains to allowed domains and ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "url",
					description: "GET Bot Top URL Information.",
					descriptionShort: "GET Bot Top URL Information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "version",
					description: "GET bot endpoint policy versions.",
					descriptionShort: "GET bot endpoint policy versions.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "deployment_statu",
					description: "GET deployment status.",
					descriptionShort: "GET deployment status.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "metric",
					description: "Malicious Traffic Overview Metrics.",
					descriptionShort: "Malicious Traffic Overview Metrics.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "personal-stat",
					description: "Insight Personal Stats.",
					descriptionShort: "Insight Personal Stats.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "state",
					description: "GET customer State if after or before.",
					descriptionShort: "GET customer State if after or before.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "statu",
					description:
						"Returns Application Traffic Insights information for the tenant.",
					descriptionShort:
						"Returns Application Traffic Insights information for the ten",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "summary",
					description: "Getbotdetectionrulessummary CustomAPI.",
					descriptionShort: "Getbotdetectionrulessummary CustomAPI.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "top_location",
					description:
						"GET SAFE Analyst Station Dashboard Transaction Breakdown request.",
					descriptionShort:
						"GET SAFE Analyst Station Dashboard Transaction Breakdown req",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "top_reason_code",
					description: "Top Reason Codes.",
					descriptionShort: "Top Reason Codes.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "top_source",
					description:
						"GET SAFE Analyst Station Dashboard Transaction Breakdown request.",
					descriptionShort:
						"GET SAFE Analyst Station Dashboard Transaction Breakdown req",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to Client-Side Defense.",
					descriptionShort: "Subscribe to Client-Side Defense.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to Client-Side Defense.",
					descriptionShort: "Unsubscribe to Client-Side Defense.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"126 resources discovered but not in primaryResources: action, affectedUser, age, alert_gen_policy, alert_template...",
			],
			resourceCategories: {
				crud: [
					"action",
					"affectedUser",
					"age",
					"alert_gen_policy",
					"alert_template",
					"allowed_domain",
					"analysi",
					"apikey",
					"app",
					"app_provision",
					"application",
					"asn",
					"asorg",
					"atb",
					"attackintent",
					"audit",
					"automation",
					"bad-bot-reduction",
					"behavior",
					"bfp",
					"bot_allowlist_policy",
					"bot_detection_rule",
					"bot_detection_update",
					"bot_endpoint_policy",
					"bot_infrastructure",
					"bot_network_policy",
					"browser",
					"category",
					"channel",
					"check",
					"clone",
					"config",
					"conversion",
					"country",
					"credential-stuffing-attack",
					"dashboard",
					"deployment",
					"deployment_history",
					"detail",
					"detected_domain",
					"device",
					"domain_detail",
					"download_release_note",
					"draft",
					"enable",
					"endpoint",
					"endpointlabel",
					"enjoy",
					"ep",
					"expanded",
					"feedback",
					"field",
					"formField",
					"friction_aggregation",
					"friction_histogram",
					"general_feedback",
					"geolocation",
					"getcurrentfrauddata",
					"gettopriskyaccount",
					"gettopriskydevice",
					"gettopriskyipaddresse",
					"gettopriskyreason",
					"gettransactiondata",
					"good",
					"health",
					"history",
					"init",
					"ip",
					"js_configuration",
					"justification",
					"lift",
					"list",
					"mitigated_domain",
					"mobile_base_config",
					"mobile_base_config_file",
					"mobile-sdk",
					"networkInteraction",
					"o",
					"overview",
					"platform",
					"policy",
					"protected_application",
					"protected_domain",
					"provision",
					"readStatu",
					"region",
					"rescue",
					"rule",
					"safecubejsdata",
					"script",
					"session",
					"src_tag_injection",
					"suggest-value",
					"table",
					"template",
					"testj",
					"threat-type",
					"timesery",
					"top-good-bot",
					"top-reason-code",
					"total-automation",
					"transaction",
					"transaction_detail",
					"transaction_device_history",
					"transaction_location",
					"transaction_related_session",
					"transaction_timeline",
					"transactions_csv",
					"transactions_over_time",
					"ua",
					"unaddressed-automation",
					"unique",
					"update_domain",
					"url",
					"version",
				],
				analytics: [
					"deployment_statu",
					"metric",
					"personal-stat",
					"state",
					"statu",
					"summary",
					"top_location",
					"top_reason_code",
					"top_source",
				],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"sites",
		{
			name: "sites",
			displayName: "Sites",
			description:
				"Multi-cloud node provisioning spanning major public cloud environments including TGW, VNet, and VPC architectures. VPN tunnel configuration handles secure connectivity while IP prefix management controls address allocation. Customer edge deployments support external container orchestration platforms. Geographic distribution with resource sharing enables consistent policy enforcement across deployment points.",
			descriptionShort: "Cloud and edge node deployments.",
			descriptionMedium:
				"AWS, Azure, GCP VPC integration with transit gateways. Label-based selection for policy application across regions.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Infrastructure",
			useCases: [
				"Deploy F5 XC across cloud providers (AWS, Azure, GCP)",
				"Manage XCKS (Managed Kubernetes) site deployments (formerly AppStack)",
				"Deploy Secure Mesh sites for networking-focused edge deployments",
				"Integrate external Kubernetes clusters as Customer Edge",
				"Configure AWS VPC, Azure VNet, and GCP VPC sites",
				"Manage virtual sites and site policies",
			],
			relatedDomains: [
				"cloud_infrastructure",
				"customer_edge",
				"managed_kubernetes",
			],
			cliMetadata: {
				quick_start: {
					command:
						"curl $F5XC_API_URL/api/config/namespaces/default/sites -H 'Authorization: APIToken $F5XC_API_TOKEN'",
					description:
						"List all configured sites in default namespace",
					expected_output:
						"JSON array of site objects with deployment status",
				},
				common_workflows: [
					{
						name: "Deploy AWS Cloud Site",
						description:
							"Deploy F5 XC in AWS for traffic management",
						steps: [
							{
								step: 1,
								command:
									"curl -X POST $F5XC_API_URL/api/config/namespaces/default/cloud_credentials -H 'Authorization: APIToken $F5XC_API_TOKEN' -H 'Content-Type: application/json' -d '{...aws_credentials...}'",
								description:
									"Create cloud credentials for AWS access",
							},
							{
								step: 2,
								command:
									"curl -X POST $F5XC_API_URL/api/config/namespaces/default/sites -H 'Authorization: APIToken $F5XC_API_TOKEN' -H 'Content-Type: application/json' -d '{...site_config...}'",
								description:
									"Create site definition for AWS deployment",
							},
						],
						prerequisites: [
							"AWS account configured",
							"Cloud credentials created",
							"VPC and security groups prepared",
						],
						expected_outcome:
							"Site deployed in AWS, nodes connected and healthy",
					},
				],
				troubleshooting: [
					{
						problem: "Site deployment fails",
						symptoms: [
							"Status: Error",
							"Nodes not coming online",
							"Connectivity issues",
						],
						diagnosis_commands: [
							"curl $F5XC_API_URL/api/config/namespaces/default/sites/{site} -H 'Authorization: APIToken $F5XC_API_TOKEN'",
							"Check site events and node status",
						],
						solutions: [
							"Verify cloud credentials have required permissions",
							"Check VPC and security group configuration",
							"Review site logs for deployment errors",
							"Ensure sufficient cloud resources available",
						],
					},
				],
				icon: "🌍",
			},
			icon: "🌍",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310B981'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "site",
					description:
						"Physical or cloud deployment location for edge services",
					descriptionShort: "Site",
					tier: "Standard" as const,
					icon: "🏢",
					category: "Infrastructure",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["virtual_site"] },
					relationshipHints: [
						"virtual_site: Logical grouping of physical sites",
					],
				},
				{
					name: "virtual_site",
					description:
						"Logical grouping of sites using label selectors",
					descriptionShort: "Virtual site",
					tier: "Standard" as const,
					icon: "🏷️",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "site_mesh_group",
					description:
						"Mesh connectivity configuration between multiple sites",
					descriptionShort: "Site mesh group",
					tier: "Advanced" as const,
					icon: "🕸️",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: true,
					dependencies: { required: ["site"] },
					relationshipHints: [
						"site: Sites to include in mesh connectivity",
					],
				},
			],
			allResources: [
				{
					name: "aggregation",
					description:
						"Request to GET summary/analytics data for the firewall logs that matches the query in request for a given namespace.",
					descriptionShort:
						"Request to GET summary/analytics data for the firewall logs ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "aws_tgw_site",
					description: "Shape of the AWS TGW site specification.",
					descriptionShort:
						"Shape of the AWS TGW site specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "aws_vpc_site",
					description: "Shape of the AWS VPC site specification.",
					descriptionShort:
						"Shape of the AWS VPC site specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "azure_vnet_site",
					description: "Shape of the Azure VNet site specification.",
					descriptionShort:
						"Shape of the Azure VNet site specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "configmap",
					description:
						"API to GET list of configmaps for a given namespace in a site.",
					descriptionShort:
						"API to GET list of configmaps for a given namespace in a sit",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cronjob",
					description:
						"API to GET list of cronjobs for a given namespace in a site.",
					descriptionShort:
						"API to GET list of cronjobs for a given namespace in a site.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "daemonset",
					description:
						"API to GET list of daemon sets for a given namespace in a site.",
					descriptionShort:
						"API to GET list of daemon sets for a given namespace in a si",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dc_cluster_group",
					description: "GET topology of a DC Cluster.",
					descriptionShort: "GET topology of a DC Cluster.",
					tier: "Standard" as const,
					operations: ["create", "list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "deployment",
					description:
						"API to GET list of deployments for a given namespace in a site.",
					descriptionShort:
						"API to GET list of deployments for a given namespace in a si",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "edge",
					description:
						"Request to GET time-series data for an edge returned in the site traffic graph.",
					descriptionShort:
						"Request to GET time-series data for an edge returned in the ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "endpoint",
					description:
						"API to GET list of endpoints for a given namespace in a site.",
					descriptionShort:
						"API to GET list of endpoints for a given namespace in a site",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "firewall_log",
					description:
						"Request to GET access logs and network logs with policy hits.\nBy default, the firewall logs in the response are sorted in the reverse chronological order.",
					descriptionShort:
						"Request to GET access logs and network logs with policy hits",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "gcp_vpc_site",
					description: "Shape of the GCP VPC site specification.",
					descriptionShort:
						"Shape of the GCP VPC site specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "global_network",
					description: "API to GET list of Global Network in a site.",
					descriptionShort:
						"API to GET list of Global Network in a site.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "global-kubeconfig",
					description: "Kubeconfig credential revoke/deletion.",
					descriptionShort: "Kubeconfig credential revoke/deletion.",
					tier: "Standard" as const,
					operations: ["create", "list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "job",
					description:
						"API to GET list of jobs for a given namespace in a site.",
					descriptionShort:
						"API to GET list of jobs for a given namespace in a site.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "k8s_audit_log",
					description:
						"Request to GET Physical K8s audit logs that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nCRUD operations performed in the namespace. User with access to the `system` namespace\nmay query for audit logs across all namespaces in a K8s Cluster.",
					descriptionShort:
						"Request to GET Physical K8s audit logs that matches the crit",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "k8s_cluster",
					description:
						"Create k8s_cluster will create the object in the storage backend for namespace metadata.namespace.",
					descriptionShort:
						"Create k8s_cluster will create the object in the storage bac",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "k8s_event",
					description:
						"Request to GET physical K8s events that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nK8s events in the namespace. User with access to the `system` namespace may query for K8s events across\nall namespaces in a K8s Cluster.",
					descriptionShort:
						"Request to GET physical K8s events that matches the criteria",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "local-kubeconfig",
					description:
						"Down load kube config for local K8s cluster access.",
					descriptionShort:
						"Down load kube config for local K8s cluster access.",
					tier: "Standard" as const,
					operations: ["create", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "log",
					description:
						"Request to GET external connector logs that matches the criteria in request for a given namespace.\nThe logs are per site per external connector is specified as match condition in the request to GET the logs for a external connector.",
					descriptionShort:
						"Request to GET external connector logs that matches the crit",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "namespace",
					description: "API to GET list of namespaces in a site.",
					descriptionShort:
						"API to GET list of namespaces in a site.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "network",
					description: "Gets Networks Associated to Site.",
					descriptionShort: "Gets Networks Associated to Site.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "node",
					description: "API to GET list of nodes in a site.",
					descriptionShort: "API to GET list of nodes in a site.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "persistentvolume",
					description:
						"API to GET list of Persistent Volumes in a site.",
					descriptionShort:
						"API to GET list of Persistent Volumes in a site.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "persistentvolumeclaim",
					description:
						"API to GET list of PVCs for a given namespace in a site.",
					descriptionShort:
						"API to GET list of PVCs for a given namespace in a site.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "platform_event",
					description:
						"Request to GET platform event that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nCRUD operations performed in the namespace. User with access to the `system` namespace\nmay query for platform events across all namespaces for a given tenant.",
					descriptionShort:
						"Request to GET platform event that matches the criteria in r",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "pod",
					description:
						"API to GET list of pods in a site for a given namespace.",
					descriptionShort:
						"API to GET list of pods in a site for a given namespace.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "replicaset",
					description:
						"API to GET list of replica sets for a given namespace in a site.",
					descriptionShort:
						"API to GET list of replica sets for a given namespace in a s",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "route_table",
					description: "Gets Route Tables Associated with a Network.",
					descriptionShort:
						"Gets Route Tables Associated with a Network.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "scroll",
					description:
						"The response for firewall log query contain no more than 500 records.\nScroll request is used scroll through more than 500 records or all records that matched the criteria in the\nfirewall log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					descriptionShort:
						"The response for firewall log query contain no more than 500",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "secret",
					description:
						"API to GET list of secrets for a given namespace in a site.",
					descriptionShort:
						"API to GET list of secrets for a given namespace in a site.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "securemesh_site",
					description: "Shape of the Secure Mesh site specification.",
					descriptionShort:
						"Shape of the Secure Mesh site specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "securemesh_site_v2",
					description: "Shape of the Secure Mesh site specification.",
					descriptionShort:
						"Shape of the Secure Mesh site specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "segment",
					description: "API to GET list of segments in a site.",
					descriptionShort: "API to GET list of segments in a site.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "selectee",
					description:
						"GET the list of objects selected by this Virtual Site based on its selector label expression.",
					descriptionShort:
						"GET the list of objects selected by this Virtual Site based ",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "service",
					description:
						"API to GET list of services for a given namespace in a site.",
					descriptionShort:
						"API to GET list of services for a given namespace in a site.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "set_cloud_site_info",
					description:
						"Configure AWS VPC Site Information like public, private ips, subnet IDs and others.",
					descriptionShort:
						"Configure AWS VPC Site Information like public, private ips,",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "set_tgw_info",
					description:
						"Configure TGW Information like tgw-ID, F5 Distributed Cloud site's VPC-ID.",
					descriptionShort:
						"Configure TGW Information like tgw-ID, F5 Distributed Cloud ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "set_vip_info",
					description: "Configure AWS TGW Site VIP Information.",
					descriptionShort: "Configure AWS TGW Site VIP Information.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "set_vpc_ip_prefixe",
					description: "Configure VPC IP prefix set.",
					descriptionShort: "Configure VPC IP prefix set.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "set_vpc_k8s_hostname",
					description: "Configure VPC K8s node hostname set.",
					descriptionShort: "Configure VPC K8s node hostname set.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "set_vpn_tunnel",
					description: "Configure VPC IP prefix set.",
					descriptionShort: "Configure VPC IP prefix set.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "site",
					description:
						"Physical or cloud deployment location for edge services",
					descriptionShort: "Site",
					tier: "Standard" as const,
					icon: "🏢",
					category: "Infrastructure",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["virtual_site"] },
					relationshipHints: [
						"virtual_site: Logical grouping of physical sites",
					],
					operations: ["replace", "list", "get", "create"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "site_mesh_group",
					description:
						"Mesh connectivity configuration between multiple sites",
					descriptionShort: "Site mesh group",
					tier: "Advanced" as const,
					icon: "🕸️",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: true,
					dependencies: { required: ["site"] },
					relationshipHints: [
						"site: Sites to include in mesh connectivity",
					],
					operations: ["create", "list"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "upgrade_o",
					description: "Upgrade Site OS version.",
					descriptionShort: "Upgrade Site OS version.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "upgrade_sw",
					description: "Upgrade Site SW version.",
					descriptionShort: "Upgrade Site SW version.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "validate_config",
					description: "Validate AWS TGW Config.",
					descriptionShort: "Validate AWS TGW Config.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "virtual_k8ss",
					description:
						"Create virtual_k8s will create the object in the storage backend for namespace metadata.namespace.",
					descriptionShort:
						"Create virtual_k8s will create the object in the storage bac",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "virtual_site",
					description:
						"Logical grouping of sites using label selectors",
					descriptionShort: "Virtual site",
					tier: "Standard" as const,
					icon: "🏷️",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: false,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "vk8s_audit_log",
					description:
						"Request to GET Virtual K8s audit logs that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nCRUD operations performed in the namespace. User with access to the `system` namespace\nmay query for audit logs across all namespaces for a given tenant.",
					descriptionShort:
						"Request to GET Virtual K8s audit logs that matches the crite",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "vk8s_event",
					description:
						"Request to GET Virtual K8s events that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nvK8s events in the namespace. User with access to the `system` namespace may query for vK8s across\nall namespaces for a given tenant.",
					descriptionShort:
						"Request to GET Virtual K8s events that matches the criteria ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "voltstack_site",
					description: "Shape of the App Stack site specification.",
					descriptionShort:
						"Shape of the App Stack site specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "metric",
					description:
						"API to GET pods metrics for a given namespace in a site.",
					descriptionShort:
						"API to GET pods metrics for a given namespace in a site.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "state",
					description:
						"Request changing site state but this request goes through validation as some\ntrainsitions are not allowed.\nIt can be used to decomission site by sending state DECOMISSIONING. Example of\nforbidden state is PROVISIONING and UPGRADING.",
					descriptionShort:
						"Request changing site state but this request goes through va",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "statefulset",
					description:
						"API to GET list of stateful sets for a given namespace in a site.",
					descriptionShort:
						"API to GET list of stateful sets for a given namespace in a ",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "statu",
					description: "Check Site Exist for a site.",
					descriptionShort: "Check Site Exist for a site.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"54 resources discovered but not in primaryResources: aggregation, aws_tgw_site, aws_vpc_site, azure_vnet_site, configmap...",
			],
			resourceCategories: {
				crud: [
					"aggregation",
					"aws_tgw_site",
					"aws_vpc_site",
					"azure_vnet_site",
					"configmap",
					"cronjob",
					"daemonset",
					"dc_cluster_group",
					"deployment",
					"edge",
					"endpoint",
					"firewall_log",
					"gcp_vpc_site",
					"global_network",
					"global-kubeconfig",
					"job",
					"k8s_audit_log",
					"k8s_cluster",
					"k8s_event",
					"local-kubeconfig",
					"log",
					"namespace",
					"network",
					"node",
					"persistentvolume",
					"persistentvolumeclaim",
					"platform_event",
					"pod",
					"replicaset",
					"route_table",
					"scroll",
					"secret",
					"securemesh_site",
					"securemesh_site_v2",
					"segment",
					"selectee",
					"service",
					"set_cloud_site_info",
					"set_tgw_info",
					"set_vip_info",
					"set_vpc_ip_prefixe",
					"set_vpc_k8s_hostname",
					"set_vpn_tunnel",
					"site",
					"site_mesh_group",
					"upgrade_o",
					"upgrade_sw",
					"validate_config",
					"virtual_k8ss",
					"virtual_site",
					"vk8s_audit_log",
					"vk8s_event",
					"voltstack_site",
				],
				analytics: ["metric", "state", "statefulset", "statu"],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"statistics",
		{
			name: "statistics",
			displayName: "Statistics",
			description:
				"Alert policies with custom matchers, label groupings, and notification parameters. Log receivers for centralized collection with confirmation and verification workflows. Flow analytics, historical trend data, and namespace-scoped dashboards. Topology discovery and site-level health indicators for operational visibility.",
			descriptionShort: "Alerts, logs, flow analytics, and reporting.",
			descriptionMedium:
				"Alerting policies with receiver integrations. Log aggregation, topology views, and site health tracking.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Operations",
			useCases: [
				"Access flow statistics and analytics",
				"Manage alerts and alerting policies",
				"View logs and log receivers",
				"Generate reports and graphs",
				"Track topology and service discovery",
				"Monitor status at sites",
			],
			relatedDomains: ["observability", "support"],
			icon: "📈",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310B981'%3E%3Cpath d='M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "dashboard",
					description: "Dashboard for metrics visualization",
					descriptionShort: "Dashboard",
					tier: "Standard" as const,
					icon: "📊",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
					dependencies: { optional: ["saved_query"] },
					relationshipHints: [
						"saved_query: Queries displayed on dashboard",
					],
				},
				{
					name: "saved_query",
					description: "Saved query for metrics and log analysis",
					descriptionShort: "Saved query",
					tier: "Standard" as const,
					icon: "🔍",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "aggregation",
					description:
						"Request to GET summary/analytics data for the firewall logs that matches the query in request for a given namespace.",
					descriptionShort:
						"Request to GET summary/analytics data for the firewall logs ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "alert_policy",
					description: "Creates a new Alert Policy Object.",
					descriptionShort: "Creates a new Alert Policy Object.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "alert_receiver",
					description: "Creates a new Alert Receiver object.",
					descriptionShort: "Creates a new Alert Receiver object.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "all_ns_alert",
					description:
						"For system namespace, all the alerts for the tenant matching the filter specified in the request\nwill be returned in the response.",
					descriptionShort:
						"For system namespace, all the alerts for the tenant matching",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "all_ns_service",
					description:
						"Request to GET monitoring data for a service mesh of a given application.",
					descriptionShort:
						"Request to GET monitoring data for a service mesh of a given",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "by_application",
					description:
						"Request to GET l3l4 Application traffic data.",
					descriptionShort:
						"Request to GET l3l4 Application traffic data.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "by_mitigation",
					description: "Request to GET l3l4 Mitigation Traffic data.",
					descriptionShort:
						"Request to GET l3l4 Mitigation Traffic data.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "by_network",
					description: "Request to GET l3l4 Network Traffic data.",
					descriptionShort:
						"Request to GET l3l4 Network Traffic data.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "by_zone",
					description:
						"Request to GET l3l4 zone destination Traffic data.",
					descriptionShort:
						"Request to GET l3l4 zone destination Traffic data.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "catalog",
					description: "",
					descriptionShort: "catalog",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "confirm",
					description:
						"API to confirm the Alert Receiver - applicable only for email and sms.",
					descriptionShort:
						"API to confirm the Alert Receiver - applicable only for emai",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "create_http_load_balancer",
					description:
						"Create HTTP/HTTPS load balancer using the discovered virtual server as an origin server.",
					descriptionShort:
						"Create HTTP/HTTPS load balancer using the discovered virtual",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "create_tcp_load_balancer",
					description:
						"Create TCP load balancer using the discovered virtual server as an origin server.",
					descriptionShort:
						"Create TCP load balancer using the discovered virtual server",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dc_cluster_group",
					description: "GET topology of a DC Cluster.",
					descriptionShort: "GET topology of a DC Cluster.",
					tier: "Standard" as const,
					operations: ["create", "list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "disable_visibility",
					description:
						"Disable Visibility of the service in all workspaces. This will remove the discovered service\nfrom being visible in other wokspaces like WAAP.",
					descriptionShort:
						"Disable Visibility of the service in all workspaces. This wi",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "discovered_service",
					description:
						"List the discovered services of specific type like virtual-servers, K8s, consul, NGINX server, etc.",
					descriptionShort:
						"List the discovered services of specific type like virtual-s",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "download",
					description: "Download report.",
					descriptionShort: "Download report.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "enable_visibility",
					description:
						"Enable Visibility of the service in all workspaces. This action will make the\ndiscovered service visible within WAAP, App Connect where the user can perform\nthe workspace specific actions.",
					descriptionShort:
						"Enable Visibility of the service in all workspaces. This act",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "event_count",
					description:
						"Request to GET l3l4 Event counts over a period of time.",
					descriptionShort:
						"Request to GET l3l4 Event counts over a period of time.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "firewall_log",
					description:
						"Request to GET access logs and network logs with policy hits.\nBy default, the firewall logs in the response are sorted in the reverse chronological order.",
					descriptionShort:
						"Request to GET access logs and network logs with policy hits",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "flow_anomaly",
					description: "List the set of flow_anomaly in a namespace.",
					descriptionShort:
						"List the set of flow_anomaly in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "generate",
					description: "Generate report now.",
					descriptionShort: "Generate report now.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "global_log_receiver",
					description: "Creates a new Global Log Receiver object.",
					descriptionShort:
						"Creates a new Global Log Receiver object.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "list-reports-history",
					description:
						"List Reports history for the list of report configurations in the given namespace.",
					descriptionShort:
						"List Reports history for the list of report configurations i",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "list-reports-history-bot-defence",
					description:
						"List Reports history bot defence for the list of report configurations in the given namespace.",
					descriptionShort:
						"List Reports history bot defence for the list of report conf",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "list-reports-history-waap",
					description:
						"List Reports history waap for the list of report configurations in the given namespace.",
					descriptionShort:
						"List Reports history waap for the list of report configurati",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "log_receiver",
					description: "Creates a new Log Receiver object.",
					descriptionShort: "Creates a new Log Receiver object.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "match",
					description:
						"GET Alert Policies that match to a set of alert labels for a namespace.",
					descriptionShort:
						"GET Alert Policies that match to a set of alert labels for a",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "matching_flow",
					description: "Show VER flows matching the request.",
					descriptionShort: "Show VER flows matching the request.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "platform_event",
					description:
						"Request to GET platform event that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nCRUD operations performed in the namespace. User with access to the `system` namespace\nmay query for platform events across all namespaces for a given tenant.",
					descriptionShort:
						"Request to GET platform event that matches the criteria in r",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "report",
					description: "GET Report will read the report metadata.",
					descriptionShort:
						"GET Report will read the report metadata.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "report_config",
					description:
						"Report configuration is used to schedule report generation at a later point in time.",
					descriptionShort:
						"Report configuration is used to schedule report generation a",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "route_table",
					description: "Gets Route Tables Associated with a Network.",
					descriptionShort:
						"Gets Route Tables Associated with a Network.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "scroll",
					description:
						"The response for firewall log query contain no more than 500 records.\nScroll request is used scroll through more than 500 records or all records that matched the criteria in the\nfirewall log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					descriptionShort:
						"The response for firewall log query contain no more than 500",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "site_mesh_group",
					description: "GET topology of a site mesh.",
					descriptionShort: "GET topology of a site mesh.",
					tier: "Standard" as const,
					operations: ["create", "list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suggest-value",
					description:
						"SuggestValues returns suggested values for the specified field in the given Create/Replace/Custom request.",
					descriptionShort:
						"SuggestValues returns suggested values for the specified fie",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "test",
					description: "API to send test alert.",
					descriptionShort: "API to send test alert.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "verify",
					description:
						"API to send request to verify Alert Receiver - applicable only for email and sms.",
					descriptionShort:
						"API to send request to verify Alert Receiver - applicable on",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "vk8s_audit_log",
					description:
						"Request to GET Virtual K8s audit logs that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nCRUD operations performed in the namespace. User with access to the `system` namespace\nmay query for audit logs across all namespaces for a given tenant.",
					descriptionShort:
						"Request to GET Virtual K8s audit logs that matches the crite",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "vk8s_event",
					description:
						"Request to GET Virtual K8s events that matches the criteria in request for a given namespace.\nIf no match conditions are specified in the request, then the response contains all\nvK8s events in the namespace. User with access to the `system` namespace may query for vK8s across\nall namespaces for a given tenant.",
					descriptionShort:
						"Request to GET Virtual K8s events that matches the criteria ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "statu",
					description: "GET status for global log receivers.",
					descriptionShort: "GET status for global log receivers.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "subscription-statu",
					description:
						"Check subscription status flow Flow Collection.",
					descriptionShort:
						"Check subscription status flow Flow Collection.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "top_talker",
					description:
						"Request to GET l3l4 Top talkers Traffic data.",
					descriptionShort:
						"Request to GET l3l4 Top talkers Traffic data.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to Flow Collection.",
					descriptionShort: "Subscribe to Flow Collection.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to Flow Collection.",
					descriptionShort: "Unsubscribe to Flow Collection.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"45 resources discovered but not in primaryResources: aggregation, alert_policy, alert_receiver, all_ns_alert, all_ns_service...",
			],
			resourceCategories: {
				crud: [
					"aggregation",
					"alert_policy",
					"alert_receiver",
					"all_ns_alert",
					"all_ns_service",
					"by_application",
					"by_mitigation",
					"by_network",
					"by_zone",
					"catalog",
					"confirm",
					"create_http_load_balancer",
					"create_tcp_load_balancer",
					"dc_cluster_group",
					"disable_visibility",
					"discovered_service",
					"download",
					"enable_visibility",
					"event_count",
					"firewall_log",
					"flow_anomaly",
					"generate",
					"global_log_receiver",
					"list-reports-history",
					"list-reports-history-bot-defence",
					"list-reports-history-waap",
					"log_receiver",
					"match",
					"matching_flow",
					"platform_event",
					"report",
					"report_config",
					"route_table",
					"scroll",
					"site_mesh_group",
					"suggest-value",
					"test",
					"verify",
					"vk8s_audit_log",
					"vk8s_event",
				],
				analytics: ["statu", "subscription-statu", "top_talker"],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"support",
		{
			name: "support",
			displayName: "Support",
			description:
				"Case management workflows including submission, commentary, and closure paths. Urgency adjustments and routing for time-sensitive incidents. Tax exemption verification requests. Site-level tcpdump operations—initiation, enumeration, and termination—for low-level network troubleshooting and protocol analysis.",
			descriptionShort: "Tickets, escalations, and network diagnostics.",
			descriptionMedium:
				"Issue lifecycle with comments, severity changes, and resolution tracking. Packet capture for connection analysis.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Operations",
			useCases: [
				"Submit and manage support tickets",
				"Track customer support requests",
				"Access operational support documentation",
			],
			relatedDomains: ["statistics", "observability"],
			icon: "🎫",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2314B8A6'%3E%3Cpath d='M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-1.99-3.46L4 6h16v2.54z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "support_case",
					description:
						"Support case for issue tracking and resolution",
					descriptionShort: "Support case",
					tier: "Standard" as const,
					icon: "🎫",
					category: "Other",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "alert",
					description: "System alert for operational notifications",
					descriptionShort: "Alert",
					tier: "Standard" as const,
					icon: "🔔",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "audit_log",
					description:
						"Audit log for compliance and security tracking",
					descriptionShort: "Audit log",
					tier: "Standard" as const,
					icon: "📝",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "add",
					description: "Add USB Enablement Rules.",
					descriptionShort: "Add USB Enablement Rules.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "change-password",
					description: "Change host user password.",
					descriptionShort: "Change host user password.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "check-debug-info-collection",
					description:
						"Check if the zip file of debug info from node is available.",
					descriptionShort:
						"Check if the zip file of debug info from node is available.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "close",
					description:
						"Closes selected customer support ticket (if not already closed). You can always attempt to reopen if needed to be.",
					descriptionShort:
						"Closes selected customer support ticket (if not already clos",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "comment",
					description:
						"Adds additional comment to a specified customer support ticket. The comment may include an attachment.",
					descriptionShort:
						"Adds additional comment to a specified customer support tick",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "config",
					description: "GET LTE configuration from the node.",
					descriptionShort: "GET LTE configuration from the node.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "customer_support",
					description:
						"Creates a new customer support ticket in our customer support provider system.",
					descriptionShort:
						"Creates a new customer support ticket in our customer suppor",
					tier: "Standard" as const,
					operations: ["create", "list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "delete",
					description: "DELETE USB Enablement Rules.",
					descriptionShort: "DELETE USB Enablement Rules.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dhcp_lease",
					description: "GET DHCP lease information.",
					descriptionShort: "GET DHCP lease information.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "diagnosi",
					description: "GET VPM network information.",
					descriptionShort: "GET VPM network information.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "disconnect",
					description: "Disconnect the node from LTE network.",
					descriptionShort: "Disconnect the node from LTE network.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "download-debug-info-collection",
					description:
						"Download the zip file of debug info from node if available.",
					descriptionShort:
						"Download the zip file of debug info from node if available.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "escalate",
					description:
						"Escalates a selected ticket. Only certain customers (depending on their contract) are allowed to escalate tickets.",
					descriptionShort:
						"Escalates a selected ticket. Only certain customers (dependi",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "exec",
					description: "Run supported exec command on node.",
					descriptionShort: "Run supported exec command on node.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "exec-log",
					description: "Retrieve exec history on node.",
					descriptionShort: "Retrieve exec history on node.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "exec-user",
					description:
						"Run supported exec command on node with lower privilege.",
					descriptionShort:
						"Run supported exec command on node with lower privilege.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "fetchdump",
					description:
						"Fetch the captured pcap data from an earlier Tcpdump request.",
					descriptionShort:
						"Fetch the captured pcap data from an earlier Tcpdump request",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "health",
					description: "GET VPM health information.",
					descriptionShort: "GET VPM health information.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "host-ping",
					description: "Ping intiated from host kernel.",
					descriptionShort: "Ping intiated from host kernel.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "info",
					description: "GET LTE runtime information.",
					descriptionShort: "GET LTE runtime information.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "jira_projects_issue_type",
					description:
						"Returns the available projects and issue types that are available from the Jira ticket tracking system.",
					descriptionShort:
						"Returns the available projects and issue types that are avai",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "list",
					description: "List connected USB devices.",
					descriptionShort: "List connected USB devices.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "list_tcpdump",
					description: "List tcpdump capture status on a ver node.",
					descriptionShort:
						"List tcpdump capture status on a ver node.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "list-service",
					description:
						"GET List of services managed by F5 Distributed Cloud.",
					descriptionShort:
						"GET List of services managed by F5 Distributed Cloud.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "log",
					description:
						"GET logs for given service from the specific node.",
					descriptionShort:
						"GET logs for given service from the specific node.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ping",
					description: "Run ping to a destination.",
					descriptionShort: "Run ping to a destination.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "priority",
					description:
						"Changes priority of a selected ticket. Not possible if ticket's already closed.",
					descriptionShort:
						"Changes priority of a selected ticket. Not possible if ticke",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "reboot",
					description: "Reboot specific node in site.",
					descriptionShort: "Reboot specific node in site.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "reopen",
					description:
						"Reopens a selected closed customer support ticket.",
					descriptionShort:
						"Reopens a selected closed customer support ticket.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "resync_crl",
					description:
						"Resync CRL by downloading from the server again.",
					descriptionShort:
						"Resync CRL by downloading from the server again.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "rule",
					description: "List USB Enablement Rules.",
					descriptionShort: "List USB Enablement Rules.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "soft-restart",
					description:
						"Soft restart reloads VER instance on the node.",
					descriptionShort:
						"Soft restart reloads VER instance on the node.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "start-debug-info-collection",
					description:
						"Start collecting a zip file of debug info from node.",
					descriptionShort:
						"Start collecting a zip file of debug info from node.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tax_exempt_request",
					description:
						"Raises a tax exemption verification request. This will ultimately create a support ticket and assign it to our billing department.\nIf verified and approved then the customer will not be levied sale taxes.",
					descriptionShort:
						"Raises a tax exemption verification request. This will ultim",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tcpdump",
					description: "Run tcpdump on an interface in a ver node.",
					descriptionShort:
						"Run tcpdump on an interface in a ver node.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "statu",
					description: "GET Status of F5XC components.",
					descriptionShort: "GET Status of F5XC components.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "stop_tcpdump",
					description:
						"Stop tcpdump running on an interface in a ver node.",
					descriptionShort:
						"Stop tcpdump running on an interface in a ver node.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "support_ticket",
					description:
						"Return list of support tickets for a given child tenant\nNote: Direct API access is restricted. Client needs to use the /managed_tenant/<mt_identifier>/ prefix in the URL to\nGET the support ticket list for child tenant.",
					descriptionShort:
						"Return list of support tickets for a given child tenant\nNote",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "ticket_tracking_system",
					description: "Create Ticket Tracking System.",
					descriptionShort: "Create Ticket Tracking System.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "validate_ticket_tracking_system",
					description:
						"Validate input for the ticket tracking system like the credentials + organization.",
					descriptionShort:
						"Validate input for the ticket tracking system like the crede",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"40 resources discovered but not in primaryResources: add, change-password, check-debug-info-collection, close, comment...",
			],
			resourceCategories: {
				crud: [
					"add",
					"change-password",
					"check-debug-info-collection",
					"close",
					"comment",
					"config",
					"customer_support",
					"delete",
					"dhcp_lease",
					"diagnosi",
					"disconnect",
					"download-debug-info-collection",
					"escalate",
					"exec",
					"exec-log",
					"exec-user",
					"fetchdump",
					"health",
					"host-ping",
					"info",
					"jira_projects_issue_type",
					"list",
					"list_tcpdump",
					"list-service",
					"log",
					"ping",
					"priority",
					"reboot",
					"reopen",
					"resync_crl",
					"rule",
					"soft-restart",
					"start-debug-info-collection",
					"tax_exempt_request",
					"tcpdump",
				],
				analytics: ["statu", "stop_tcpdump"],
				utilities: [],
				management: [
					"support_ticket",
					"ticket_tracking_system",
					"validate_ticket_tracking_system",
				],
			},
		},
	],
	[
		"telemetry_and_insights",
		{
			name: "telemetry_and_insights",
			displayName: "Telemetry And Insights",
			description:
				"APIs for configuring collection endpoints, metrics storage, and insight generation. Supports log aggregation, performance monitoring, and alerting integration across deployments.",
			descriptionShort:
				"Metrics collection, analysis, and visualization.",
			descriptionMedium:
				"Collection endpoints, metrics storage, and insight generation for observability workflows.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Operations",
			useCases: [
				"Collect and analyze telemetry data",
				"Generate actionable insights from metrics",
				"Configure telemetry collection policies",
			],
			relatedDomains: ["observability", "statistics"],
			icon: "📉",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F59E0B'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "telemetry_receiver",
					description: "Telemetry receiver for data collection",
					descriptionShort: "Telemetry receiver",
					tier: "Standard" as const,
					icon: "📡",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "insight_query",
					description: "Insight query for analytics",
					descriptionShort: "Insight query",
					tier: "Standard" as const,
					icon: "🔍",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "all_ns_service",
					description:
						"Request to GET monitoring data for a service mesh of a given application.",
					descriptionShort:
						"Request to GET monitoring data for a service mesh of a given",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "app_type",
					description:
						"Request to GET list of application types for a given namespace.\nFor system namespace, all the application types for the tenant\nwill be returned in the response.",
					descriptionShort:
						"Request to GET list of application types for a given namespa",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "connectivity",
					description:
						"Request to GET Connectivity data between the sites.",
					descriptionShort:
						"Request to GET Connectivity data between the sites.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "create_http_load_balancer",
					description:
						"Create HTTP/HTTPS load balancer using the discovered virtual server as an origin server.",
					descriptionShort:
						"Create HTTP/HTTPS load balancer using the discovered virtual",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "create_tcp_load_balancer",
					description:
						"Create TCP load balancer using the discovered virtual server as an origin server.",
					descriptionShort:
						"Create TCP load balancer using the discovered virtual server",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "disable_visibility",
					description:
						"Disable Visibility of the service in all workspaces. This will remove the discovered service\nfrom being visible in other wokspaces like WAAP.",
					descriptionShort:
						"Disable Visibility of the service in all workspaces. This wi",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "discovered_service",
					description:
						"List the discovered services of specific type like virtual-servers, K8s, consul, NGINX server, etc.",
					descriptionShort:
						"List the discovered services of specific type like virtual-s",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "edge",
					description:
						"Request to GET Connectivity data for an edge.\nThis query is used to GET time-series data for a given edge.",
					descriptionShort:
						"Request to GET Connectivity data for an edge.\nThis query is ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "enable_visibility",
					description:
						"Enable Visibility of the service in all workspaces. This action will make the\ndiscovered service visible within WAAP, App Connect where the user can perform\nthe workspace specific actions.",
					descriptionShort:
						"Enable Visibility of the service in all workspaces. This act",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "flow_collection",
					description:
						"Request to GET flow collection from the flow records.",
					descriptionShort:
						"Request to GET flow collection from the flow records.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "instance",
					description:
						"Request to GET time-series data for a service instance.",
					descriptionShort:
						"Request to GET time-series data for a service instance.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "lb_cache_content",
					description:
						"Request to GET time-series cacheable data for HTTP-LBs.",
					descriptionShort:
						"Request to GET time-series cacheable data for HTTP-LBs.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "node",
					description:
						"Request to GET Connectivity data for a site.\nThis query is used to GET time-series data for a given site.",
					descriptionShort:
						"Request to GET Connectivity data for a site.\nThis query is u",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "service",
					description:
						"Request to GET monitoring data for a service mesh of a given application.",
					descriptionShort:
						"Request to GET monitoring data for a service mesh of a given",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suggest-value",
					description:
						"SuggestValues returns suggested values for the specified field in the given Create/Replace/Custom request.",
					descriptionShort:
						"SuggestValues returns suggested values for the specified fie",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "health_statu",
					description: "GET Discovered Service Health status.",
					descriptionShort: "GET Discovered Service Health status.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "status_at_site",
					description: "GET status of an object in a given site.",
					descriptionShort:
						"GET status of an object in a given site.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "subscription-statu",
					description:
						"Check subscription status flow Flow Collection.",
					descriptionShort:
						"Check subscription status flow Flow Collection.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "top_flow_anomaly",
					description: "Request to GET flow anomaly records.",
					descriptionShort: "Request to GET flow anomaly records.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "top_talker",
					description:
						"Request to GET top talkers from the flow records.",
					descriptionShort:
						"Request to GET top talkers from the flow records.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to Flow Collection.",
					descriptionShort: "Subscribe to Flow Collection.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to Flow Collection.",
					descriptionShort: "Unsubscribe to Flow Collection.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"22 resources discovered but not in primaryResources: all_ns_service, app_type, connectivity, create_http_load_balancer, create_tcp_load_balancer...",
			],
			resourceCategories: {
				crud: [
					"all_ns_service",
					"app_type",
					"connectivity",
					"create_http_load_balancer",
					"create_tcp_load_balancer",
					"disable_visibility",
					"discovered_service",
					"edge",
					"enable_visibility",
					"flow_collection",
					"instance",
					"lb_cache_content",
					"node",
					"service",
					"suggest-value",
				],
				analytics: [
					"health_statu",
					"status_at_site",
					"subscription-statu",
					"top_flow_anomaly",
					"top_talker",
				],
				utilities: [],
				management: ["subscribe", "unsubscribe"],
			},
		},
	],
	[
		"tenant_and_identity",
		{
			name: "tenant_and_identity",
			displayName: "Tenant And Identity",
			description:
				"Profile images and display customizations for personalized dashboard experiences. Federated authentication toggles controlling SSO behavior across organizational boundaries. Session lifecycle tracking with real-time visibility into active connections and timeout policies. Support ticket workflows including attachment handling and closure procedures for managed client escalations. Initial access provisioning sequences for new user onboarding.",
			descriptionShort: "User profiles, sessions, and OTP settings.",
			descriptionMedium:
				"Account view configurations and admin alert channels. One-time password resets, provisioning flows, and active connection monitoring.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Platform",
			useCases: [
				"Manage user profiles and notification preferences",
				"Configure session controls and OTP settings",
				"Handle identity management operations",
				"Process initial user access requests",
			],
			relatedDomains: ["users", "authentication", "system"],
			icon: "🪪",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2306B6D4'%3E%3Cpath d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 3.5c1.38 0 2.5 1.12 2.5 2.5S12.38 12.5 11 12.5 8.5 11.38 8.5 10s1.12-2.5 2.5-2.5zm5 10.5H6v-1.25c0-1.66 3.33-2.5 5-2.5s5 .84 5 2.5V18zm2-4h-4v-2h4v2zm0-4h-4V8h4v2z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "user_profile",
					description: "User profile with personal settings",
					descriptionShort: "User profile",
					tier: "Standard" as const,
					icon: "👤",
					category: "Identity",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "session",
					description: "User session for authentication state",
					descriptionShort: "Session",
					tier: "Standard" as const,
					icon: "🔑",
					category: "Identity",
					supportsLogs: true,
					supportsMetrics: false,
				},
				{
					name: "otp_policy",
					description: "OTP policy for multi-factor authentication",
					descriptionShort: "OTP policy",
					tier: "Standard" as const,
					icon: "🔐",
					category: "Identity",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "accept_to",
					description:
						"Accept TOS updates version of accepted terms of service.",
					descriptionShort:
						"Accept TOS updates version of accepted terms of service.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "access",
					description:
						"GET current access details for the support tenant.",
					descriptionShort:
						"GET current access details for the support tenant.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "active_alert_policy",
					description:
						"GetActiveAlertPolicies returns the list of active alert policies for the namespace.",
					descriptionShort:
						"GetActiveAlertPolicies returns the list of active alert poli",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "active_network_policy",
					description:
						"GetActiveNetworkPolicies resturn the list of active network policies for the namespace.",
					descriptionShort:
						"GetActiveNetworkPolicies resturn the list of active network ",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "active_service_policy",
					description:
						"GetActiveServicePolicies resturn the list of active service policies for the namespace.",
					descriptionShort:
						"GetActiveServicePolicies resturn the list of active service ",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "admin_notification",
					description:
						"GET admin ntfn preferences gets current admin notification preferences for user.\nIt combines information from two sources:\n- explicitly set admin notification preferences in user settings object\n- default values from uam config (for those notifications which not explicitly set)",
					descriptionShort:
						"GET admin ntfn preferences gets current admin notification p",
					tier: "Standard" as const,
					operations: ["list", "replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "admin_reset",
					description:
						"Reset password by admin resets password for a user specified in request payload.\nThis request is meant to be executed by the tenant's admin.",
					descriptionShort:
						"Reset password by admin resets password for a user specified",
					tier: "Standard" as const,
					operations: ["create", "replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "all_application_inventory",
					description:
						"AllApplicationInventory returns inventory of configured application related objects for all namespaces.",
					descriptionShort:
						"AllApplicationInventory returns inventory of configured appl",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "all_application_inventory_waf_filter",
					description:
						"AllApplicationInventoryWaf returns inventory of configured application related objects for all namespaces with WAF Filters.",
					descriptionShort:
						"AllApplicationInventoryWaf returns inventory of configured a",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "allowed_tenant",
					description:
						"Creates a allowed_tenant config instance. Name of the object is name of the tenant that is allowed to manage.",
					descriptionShort:
						"Creates a allowed_tenant config instance. Name of the object",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "analyze_for_deletion",
					description:
						"AnalyzeForDeletion checks the references of the object to make sure it is deletable.",
					descriptionShort:
						"AnalyzeForDeletion checks the references of the object to ma",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "application_inventory",
					description:
						"ApplicationInventory returns inventory of configured application related objects for the tenant.\nInventory of namespaced objects (HTTP LBs, TCP LBs, etc) in a particular namespace is returned.",
					descriptionShort:
						"ApplicationInventory returns inventory of configured applica",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "authentication",
					description: "Create authentication.",
					descriptionShort: "Create authentication.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cascade_delete",
					description:
						"CascadeDelete will DELETE the namespace and all configuration objects like virtual_hosts etc.\nUnder it. Use this only if the entire namespace and its contents are to be wiped out.",
					descriptionShort:
						"CascadeDelete will DELETE the namespace and all configuratio",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "child_tenant",
					description:
						"GET list of child tenants user has access to based on assigned membership.\nThis is an optimized list generated based on the requesting user's current group assignments\nthat will allow access to child tenant.",
					descriptionShort:
						"GET list of child tenants user has access to based on assign",
					tier: "Standard" as const,
					operations: ["list", "create", "replace", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "child_tenant_manager",
					description:
						"Creates a child_tenant_manager config instance. Name of the object is the name of the child tenant manager to be created.",
					descriptionShort:
						"Creates a child_tenant_manager config instance. Name of the ",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "city",
					description:
						"Returns a list of known cities of a country/state.",
					descriptionShort:
						"Returns a list of known cities of a country/state.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "close",
					description:
						"Closes selected customer support ticket (if not already closed). You can always attempt to reopen if needed to be.",
					descriptionShort:
						"Closes selected customer support ticket (if not already clos",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "combined_notification",
					description:
						"GET combined ntfn preferences gets user-ntfn-preferences and admin-ntfn-preferences and returns combined result.",
					descriptionShort:
						"GET combined ntfn preferences gets user-ntfn-preferences and",
					tier: "Standard" as const,
					operations: ["list", "replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "comment",
					description:
						"Adds additional comment to a specified customer support ticket. The comment may include an attachment.",
					descriptionShort:
						"Adds additional comment to a specified customer support tick",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "contact",
					description:
						"Creates a new customer's contact detail record with us, including address and phone number.",
					descriptionShort:
						"Creates a new customer's contact detail record with us, incl",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "country",
					description:
						"Returns a list of supported countries along with with additional information such as address validation rules.",
					descriptionShort:
						"Returns a list of supported countries along with with additi",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "customer_support",
					description:
						"Return list of all support tickets for a child tenant.",
					descriptionShort:
						"Return list of all support tickets for a child tenant.",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "deactivate",
					description: "",
					descriptionShort: "deactivate",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "delete",
					description:
						"DELETE deletes OIDC provider by name. This would also disable SCIM integration for the tenant, if at all, it was enabled.\nReturns OIDC provider object that gets deleted. Query will look into current tenants `system` namespace for OIDC provider by name.",
					descriptionShort:
						"DELETE deletes OIDC provider by name. This would also disabl",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "disable",
					description: "",
					descriptionShort: "disable",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "enable",
					description: "",
					descriptionShort: "enable",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "escalate",
					description:
						"Escalates a selected ticket. Only certain customers (depending on their contract) are allowed to escalate tickets.",
					descriptionShort:
						"Escalates a selected ticket. Only certain customers (dependi",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "evaluate-api-access",
					description:
						"EvaluateAPIAccess can evaluate multiple lists of API URL, method under a namespace for a given user of a tenant.",
					descriptionShort:
						"EvaluateAPIAccess can evaluate multiple lists of API URL, me",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "evaluate-batch-api-access",
					description:
						"EvaluateBatchAPIAccess can evaluate multiple lists of API URL, method under a batch of namespaces for a given user of a tenant.",
					descriptionShort:
						"EvaluateBatchAPIAccess can evaluate multiple lists of API UR",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "fast_acls_for_internet_vip",
					description:
						"GetFastACLsForInternetVIPs Returns the list of Active FastACLs for Internet VIPs.",
					descriptionShort:
						"GetFastACLsForInternetVIPs Returns the list of Active FastAC",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "favicon",
					description: "Receive current tenant favicon.",
					descriptionShort: "Receive current tenant favicon.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "Group",
					description: "List groups based on the given filter.",
					descriptionShort: "List groups based on the given filter.",
					tier: "Standard" as const,
					operations: [
						"list",
						"create",
						"replace",
						"delete",
						"update",
					],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "group_add",
					description: "",
					descriptionShort: "group_add",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "group_remove",
					description: "",
					descriptionShort: "group_remove",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "image",
					description: "Receive current tenant profile image.",
					descriptionShort: "Receive current tenant profile image.",
					tier: "Standard" as const,
					operations: ["list", "replace", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "inactive",
					description:
						"Returns list of users for which no login events was found for last 90 days of time.\nIt consider all users within current tenant.",
					descriptionShort:
						"Returns list of users for which no login events was found fo",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "last_login",
					description:
						"GetLastLoginMap returns last login timestamp for each user within a tenant.",
					descriptionShort:
						"GetLastLoginMap returns last login timestamp for each user w",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "login",
					description:
						"GetLoginEvents returns login events for specified in config period of time. It consider all users within current tenant.\nLogin events are extracted directly from IDM.",
					descriptionShort:
						"GetLoginEvents returns login events for specified in config ",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "login_in_time",
					description:
						"GetLoginEventsInTimeFrame returns login events for specified period of time. It consider all users specified by context tenant.",
					descriptionShort:
						"GetLoginEventsInTimeFrame returns login events for specified",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "logo",
					description: "Receive current tenant logo.",
					descriptionShort: "Receive current tenant logo.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "lookup",
					description: "Checks if a cname is available.",
					descriptionShort: "Checks if a cname is available.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "lookup-user-role",
					description:
						"LookupUserRoles returns roles for the the given user, namespace.",
					descriptionShort:
						"LookupUserRoles returns roles for the the given user, namesp",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "managed_tenant",
					description:
						"GET list of managed tenants that user have access to based on assingned membership.\nThis is an optimized list generated based on the requesting user's current group assignments\nthat will allow access to managed tenant.",
					descriptionShort:
						"GET list of managed tenants that user have access to based o",
					tier: "Standard" as const,
					operations: ["list", "create", "replace", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "managed_tenants_by_user",
					description:
						"GET list of managed tenants that user have access to based on assigned membership.\nThis is an optimized list generated based on the requesting user's current group assignments\nthat will allow access to managed tenant.",
					descriptionShort:
						"GET list of managed tenants that user have access to based o",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "managed_tenants_list",
					description:
						"GET full list of managed tenants access details.\nThis response will contain full list of managed tenant based on the configuration\nand is not filtered by requesting user's group membership that enable access.",
					descriptionShort:
						"GET full list of managed tenants access details.\nThis respon",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "mapper",
					description:
						"GET OIDC mappers gets OIDC mappers from underlying IDM provider.",
					descriptionShort:
						"GET OIDC mappers gets OIDC mappers from underlying IDM provi",
					tier: "Standard" as const,
					operations: ["get", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "migrate",
					description:
						"Migrate ACTIVE child tenants from existing CTM(s) to a specified new CTM.",
					descriptionShort:
						"Migrate ACTIVE child tenants from existing CTM(s) to a speci",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "namespace",
					description: "List the set of namespace in a namespace.",
					descriptionShort:
						"List the set of namespace in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "create", "replace", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "namespace_role",
					description:
						"List the set of namespace_role in a namespace.",
					descriptionShort:
						"List the set of namespace_role in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "networking_inventory",
					description:
						"NetworkingInventory returns inventory of configured networking related objects for the tenant.\nInventory of system-wide objects (global networks, sites, site mesh groups, etc) is returned.",
					descriptionShort:
						"NetworkingInventory returns inventory of configured networki",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "notification",
					description:
						"GET ntfn preferences gets current notification preferences for user.\nIt combines information from two sources:\n- explicitly set notification preferences in user settings object\n- default values from uam config (for those notifications which not explicitly set)",
					descriptionShort:
						"GET ntfn preferences gets current notification preferences f",
					tier: "Standard" as const,
					operations: ["list", "replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "oidc_provider",
					description:
						"GET implements OIDC provider query by name.\nReturns OIDC provider object. Query will look into current tenants `system` namespace for OIDC provider by name.",
					descriptionShort:
						"GET implements OIDC provider query by name.\nReturns OIDC pro",
					tier: "Standard" as const,
					operations: ["get", "list", "create", "replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "priority",
					description:
						"Changes priority of a selected ticket. Not possible if ticket's already closed.",
					descriptionShort:
						"Changes priority of a selected ticket. Not possible if ticke",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "rbac_policy",
					description: "List the set of rbac_policy in a namespace.",
					descriptionShort:
						"List the set of rbac_policy in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "remove_namespace_role",
					description: "",
					descriptionShort: "remove_namespace_role",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "reopen",
					description:
						"Reopens a selected closed customer support ticket.",
					descriptionShort:
						"Reopens a selected closed customer support ticket.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "request_initial_access",
					description: "",
					descriptionShort: "request_initial_access",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "request-delete",
					description:
						"Request to mark Tenant for deletion queue, after approve it will completely removed from the system.",
					descriptionShort:
						"Request to mark Tenant for deletion queue, after approve it ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "reset",
					description:
						"Reset password resets password for user who is making this request.",
					descriptionShort:
						"Reset password resets password for user who is making this r",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ResourceType",
					description: "Listresourcetypes CustomPublicAPI.",
					descriptionShort: "Listresourcetypes CustomPublicAPI.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "role",
					description:
						"List the Role objects with all API groups which the role can access to.",
					descriptionShort:
						"List the Role objects with all API groups which the role can",
					tier: "Standard" as const,
					operations: ["list", "create", "get", "replace", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "role_user",
					description:
						"AssignRole allows customers to assign a namespace/role pair to multiple users.",
					descriptionShort:
						"AssignRole allows customers to assign a namespace/role pair ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "Schema",
					description: "Listschemas CustomPublicAPI.",
					descriptionShort: "Listschemas CustomPublicAPI.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "scim",
					description: "",
					descriptionShort: "scim",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "send_password_email",
					description:
						"SendPasswordEmail allows admin user to trigger send password email for a user to update user's password.\nDeprecated: use ResetPasswordByAdmin RPC instead.",
					descriptionShort:
						"SendPasswordEmail allows admin user to trigger send password",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "ServiceProviderConfig",
					description: "Listserviceproviderconfig CustomPublicAPI.",
					descriptionShort:
						"Listserviceproviderconfig CustomPublicAPI.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "session",
					description: "User session for authentication state",
					descriptionShort: "Session",
					tier: "Standard" as const,
					icon: "🔑",
					category: "Identity",
					supportsLogs: true,
					supportsMetrics: false,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "setting",
					description:
						"GetIDMSettings returns IDM settings for tenant. IDM settings contains info like password policy,\nbrute-force detection policy, etc...",
					descriptionShort:
						"GetIDMSettings returns IDM settings for tenant. IDM settings",
					tier: "Standard" as const,
					operations: ["list", "replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suggest-value",
					description:
						"Returns suggested values for the specified field in the given Create/Replace/Custom request.",
					descriptionShort:
						"Returns suggested values for the specified field in the give",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "support-info",
					description: "Receive support information for tenant.",
					descriptionShort: "Receive support information for tenant.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "sync",
					description:
						"In case when user created initially from identity provider we need to sync the user data.",
					descriptionShort:
						"In case when user created initially from identity provider w",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tenant_configuration",
					description:
						"Shape of the tenant configuration specification.",
					descriptionShort:
						"Shape of the tenant configuration specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tenant_profile",
					description:
						"Creates a tenant_profile config instance. Name of the object is the name of the tenant profile to be created.",
					descriptionShort:
						"Creates a tenant_profile config instance. Name of the object",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tenant-escalation-doc",
					description: "Receive current tenant escalation document.",
					descriptionShort:
						"Receive current tenant escalation document.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "to",
					description: "GET TOS provides TOS version with text.",
					descriptionShort: "GET TOS provides TOS version with text.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "unset",
					description: "",
					descriptionShort: "unset",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "update_allow_advertise_on_public",
					description:
						"UpdateAllowAdvertiseOnPublic can update a config to allow advertise on public.",
					descriptionShort:
						"UpdateAllowAdvertiseOnPublic can update a config to allow ad",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "User",
					description: "GET all users.",
					descriptionShort: "GET all users.",
					tier: "Standard" as const,
					operations: [
						"list",
						"create",
						"replace",
						"delete",
						"update",
					],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "user_group",
					description: "List fetches all the groups for the tenant.",
					descriptionShort:
						"List fetches all the groups for the tenant.",
					tier: "Standard" as const,
					operations: ["list", "create", "get", "replace", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "user_identification",
					description:
						"Create user_identification creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create user_identification creates a new object in the stora",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "user_role",
					description:
						"List enumerates users and their namespace roles for this tenant.",
					descriptionShort:
						"List enumerates users and their namespace roles for this ten",
					tier: "Standard" as const,
					operations: ["list", "create", "replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "user_token",
					description:
						"GET one time token to connect Web App Scanning Service.",
					descriptionShort:
						"GET one time token to connect Web App Scanning Service.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "validate_rule",
					description:
						"ValidateRules returns whether the value is valid or not for the specified validator rules.",
					descriptionShort:
						"ValidateRules returns whether the value is valid or not for ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "view_preference",
					description:
						"GET view preference gets view preference for specific user.",
					descriptionShort:
						"GET view preference gets view preference for specific user.",
					tier: "Standard" as const,
					operations: ["list", "replace"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "whoami",
					description:
						"GET fetches user information based on the username header from the request context\nthis API is also called as WhoAmI.",
					descriptionShort:
						"GET fetches user information based on the username header fr",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "all_ns_stat",
					description:
						"GET API endpoints stats for all Namespaces. This API is specific to system namespace.",
					descriptionShort:
						"GET API endpoints stats for all Namespaces. This API is spec",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "stat",
					description:
						"GET API endpoints stats for the given Namespace.",
					descriptionShort:
						"GET API endpoints stats for the given Namespace.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "state",
					description:
						"Returns a list of known states of a country. List will be empty if country has no states.",
					descriptionShort:
						"Returns a list of known states of a country. List will be em",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "summary",
					description: "This API returns tenant summary.",
					descriptionShort: "This API returns tenant summary.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "assign",
					description:
						"Assign domain owner tries to assign domain owner to user in the request. It checks that requester is domain owner as well.\nIt implies such steps:\n1) mark user as domain owner\n2) if user is SSO\n- mark user as F5 Distributed Cloud managed\n- send update password email\n3) set admin roles in system, shared, * namespaces\nNOTE: previous roles (which was explicitly assigned to this user) will be deleted.",
					descriptionShort:
						"Assign domain owner tries to assign domain owner to user in ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "assign_namespace_role",
					description: "",
					descriptionShort: "assign_namespace_role",
					tier: "Standard" as const,
					operations: ["replace"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description:
						"Subscribe Delegated Access addon service feature. A support request will be created and feature will be enabled upon approval.",
					descriptionShort:
						"Subscribe Delegated Access addon service feature. A support ",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unassign",
					description:
						"Unassign domain owner tries to remove domain owner privilege from user in the request.\nIt checks that requester is domain owner.\nIt implies such steps:\n1) remove domain owner boolean flag\n2) if tenant has SSO enabled:\n- mark user as SSO\n- DELETE password credential\n- DELETE OTP credential (if exists)\nNOTE: previously granted roles (including admin roles) will be retained.",
					descriptionShort:
						"Unassign domain owner tries to remove domain owner privilege",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description:
						"Unsubscribe Delegated Access addon service feature. A support request will be created and request will be processed upon approval.",
					descriptionShort:
						"Unsubscribe Delegated Access addon service feature. A suppor",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"94 resources discovered but not in primaryResources: accept_to, access, active_alert_policy, active_network_policy, active_service_policy...",
			],
			resourceCategories: {
				crud: [
					"accept_to",
					"access",
					"active_alert_policy",
					"active_network_policy",
					"active_service_policy",
					"admin_notification",
					"admin_reset",
					"all_application_inventory",
					"all_application_inventory_waf_filter",
					"allowed_tenant",
					"analyze_for_deletion",
					"application_inventory",
					"authentication",
					"cascade_delete",
					"child_tenant",
					"child_tenant_manager",
					"city",
					"close",
					"combined_notification",
					"comment",
					"contact",
					"country",
					"customer_support",
					"deactivate",
					"delete",
					"disable",
					"enable",
					"escalate",
					"evaluate-api-access",
					"evaluate-batch-api-access",
					"fast_acls_for_internet_vip",
					"favicon",
					"Group",
					"group_add",
					"group_remove",
					"image",
					"inactive",
					"last_login",
					"login",
					"login_in_time",
					"logo",
					"lookup",
					"lookup-user-role",
					"managed_tenant",
					"managed_tenants_by_user",
					"managed_tenants_list",
					"mapper",
					"migrate",
					"namespace",
					"namespace_role",
					"networking_inventory",
					"notification",
					"oidc_provider",
					"priority",
					"rbac_policy",
					"remove_namespace_role",
					"reopen",
					"request_initial_access",
					"request-delete",
					"reset",
					"ResourceType",
					"role",
					"role_user",
					"Schema",
					"scim",
					"send_password_email",
					"ServiceProviderConfig",
					"session",
					"setting",
					"suggest-value",
					"support-info",
					"sync",
					"tenant_configuration",
					"tenant_profile",
					"tenant-escalation-doc",
					"to",
					"unset",
					"update_allow_advertise_on_public",
					"User",
					"user_group",
					"user_identification",
					"user_role",
					"user_token",
					"validate_rule",
					"view_preference",
					"whoami",
				],
				analytics: ["all_ns_stat", "stat", "state", "summary"],
				utilities: [],
				management: [
					"assign",
					"assign_namespace_role",
					"subscribe",
					"unassign",
					"unsubscribe",
				],
			},
		},
	],
	[
		"threat_campaign",
		{
			name: "threat_campaign",
			displayName: "Threat Campaign",
			description:
				"APIs for configuring detection policies and attack tracking. Supports campaign analysis, risk assessment, and automated mitigation rule generation across security domains.",
			descriptionShort:
				"Attack detection, tracking, and mitigation rules.",
			descriptionMedium:
				"Detection policies, attack tracking, and automated mitigation rule generation for security operations.",
			aliases: [],
			complexity: "moderate" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Security",
			useCases: [
				"Track and analyze threat campaigns",
				"Monitor active threats and attack patterns",
				"Configure threat intelligence integration",
			],
			relatedDomains: ["bot_defense", "ddos"],
			icon: "⚠️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FBBF24'%3E%3Cpath d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "threat_campaign_policy",
					description:
						"Threat campaign detection and mitigation policy",
					descriptionShort: "Threat campaign policy",
					tier: "Advanced" as const,
					icon: "🎯",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "threat_campaign",
					description: "GET Threat Campaign by ID.",
					descriptionShort: "GET Threat Campaign by ID.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"1 resources discovered but not in primaryResources: threat_campaign",
			],
			resourceCategories: {
				crud: ["threat_campaign"],
				analytics: [],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"users",
		{
			name: "users",
			displayName: "Users",
			description:
				"Token lifecycle governs automated site onboarding through cloud-init integration with configurable validity periods. Explicit category keys establish permitted classification hierarchies enforced across deployments. Inferred attributes attach automatically based on object characteristics and placement context. Namespace-scoped operations handle credential generation, revocation, and state transitions for streamlined provisioning workflows.",
			descriptionShort: "Account tokens, labels, and cloud-init config.",
			descriptionMedium:
				"Site enrollment credentials with automatic expiration. Taxonomy keys define allowed categorization while auto-derived tags apply dynamically.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Platform",
			useCases: [
				"Manage user accounts and tokens",
				"Configure user identification",
				"Manage user settings and preferences",
				"Configure implicit and known labels",
			],
			relatedDomains: ["system", "admin"],
			icon: "👥",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366F1'%3E%3Cpath d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "user",
					description: "User account for platform access",
					descriptionShort: "User",
					tier: "Standard" as const,
					icon: "👤",
					category: "Identity",
					supportsLogs: false,
					supportsMetrics: false,
					dependencies: { optional: ["user_role"] },
					relationshipHints: [
						"user_role: Role assignment for user permissions",
					],
				},
				{
					name: "user_role",
					description: "User role for permission management",
					descriptionShort: "User role",
					tier: "Standard" as const,
					icon: "👔",
					category: "Identity",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "namespace_role",
					description:
						"Namespace-scoped role for fine-grained permissions",
					descriptionShort: "Namespace role",
					tier: "Standard" as const,
					icon: "📁",
					category: "Identity",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "create",
					description:
						"Create creates a new label in shared namespace. Any other namespace requested will return error.",
					descriptionShort:
						"Create creates a new label in shared namespace. Any other na",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "delete",
					description:
						"DELETE will DELETE a given label label key = label value from current tenants shared namespace.",
					descriptionShort:
						"DELETE will DELETE a given label label key = label value fro",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "get-cloud-init-config",
					description:
						"Returns cloud-init counfig for kvm provider with JWT token.",
					descriptionShort:
						"Returns cloud-init counfig for kvm provider with JWT token.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "implicit_label",
					description:
						"GET is generic label query. Two types of queries are supported\n* Return label with exact matching entry label key = label value.\n* Return list of labels that have prefix of label key = label value.\nReturns list of labels. Query will look into current tenants shared namespace and VES-I/O shared.",
					descriptionShort:
						"GET is generic label query. Two types of queries are support",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "known_label",
					description:
						"GET is generic label query. Two types of queries are supported\nReturn label with exact matching entry label key = label value.\nReturn list of labels that have prefix of label key = label value.\nReturns list of labels. Query will look into current tenants shared namespace and VES-I/O shared.",
					descriptionShort:
						"GET is generic label query. Two types of queries are support",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "known_label_key",
					description:
						"GET is generic label key query. Two types of queries are supported\nReturn label with exact matching entry label key.\nReturn list of labels that have prefix of label key .\nReturns list of label keys. Query will look into current tenants shared namespace and VES-I/O shared.",
					descriptionShort:
						"GET is generic label key query. Two types of queries are sup",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "token",
					description:
						"Creates new token. Token object is used to manage site admission. User must generate token before provisioning and pass this\ntoken to site during it's registration.",
					descriptionShort:
						"Creates new token. Token object is used to manage site admis",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "state",
					description:
						"TokenState changes token status, it can be used to disable token.",
					descriptionShort:
						"TokenState changes token status, it can be used to disable t",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"8 resources discovered but not in primaryResources: create, delete, get-cloud-init-config, implicit_label, known_label...",
			],
			resourceCategories: {
				crud: [
					"create",
					"delete",
					"get-cloud-init-config",
					"implicit_label",
					"known_label",
					"known_label_key",
					"token",
				],
				analytics: ["state"],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"virtual",
		{
			name: "virtual",
			displayName: "Virtual",
			description:
				"Load balancing for HTTP, TCP, and UDP traffic with configurable routing rules and origin pool management. Supports health checks, session persistence, and automatic failover. Enables geographic distribution, rate limiting, and service policy enforcement across load balancers and routes.",
			descriptionShort:
				"HTTP, TCP, UDP load balancing with origin pools.",
			descriptionMedium:
				"Traffic distribution across regions with routing rules. Health checks and failover policies.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Networking",
			useCases: [
				"Configure HTTP/TCP/UDP load balancers",
				"Manage origin pools and services",
				"Configure virtual hosts and routing",
				"Define rate limiter and service policies",
				"Manage geo-location-based routing",
				"Configure proxy and forwarding policies",
				"Manage malware protection and threat campaigns",
				"Configure health checks and endpoint monitoring",
			],
			relatedDomains: ["dns", "service_policy", "network"],
			cliMetadata: {
				quick_start: {
					command:
						"curl $F5XC_API_URL/api/config/namespaces/default/http_loadbalancers -H 'Authorization: APIToken $F5XC_API_TOKEN'",
					description:
						"List all HTTP load balancers in default namespace",
					expected_output:
						"JSON array of load balancer objects with status",
				},
				common_workflows: [
					{
						name: "Create HTTP Load Balancer",
						description:
							"Deploy basic HTTP load balancer with origin pool backend",
						steps: [
							{
								step: 1,
								command:
									"curl -X POST $F5XC_API_URL/api/config/namespaces/default/origin_pools -H 'Authorization: APIToken $F5XC_API_TOKEN' -H 'Content-Type: application/json' -d '{...pool_config...}'",
								description:
									"Create backend origin pool with target endpoints",
							},
							{
								step: 2,
								command:
									"curl -X POST $F5XC_API_URL/api/config/namespaces/default/http_loadbalancers -H 'Authorization: APIToken $F5XC_API_TOKEN' -H 'Content-Type: application/json' -d '{...lb_config...}'",
								description:
									"Create HTTP load balancer pointing to origin pool",
							},
						],
						prerequisites: [
							"Active namespace",
							"Origin pool targets reachable",
							"DNS domain configured",
						],
						expected_outcome:
							"Load balancer in Active status, traffic routed to origins",
					},
				],
				troubleshooting: [
					{
						problem:
							"Load balancer shows Configuration Error status",
						symptoms: [
							"Status: Configuration Error",
							"No traffic routing",
							"Requests timeout",
						],
						diagnosis_commands: [
							"curl $F5XC_API_URL/api/config/namespaces/default/http_loadbalancers/{name} -H 'Authorization: APIToken $F5XC_API_TOKEN'",
							"Check origin_pool status and endpoint connectivity",
						],
						solutions: [
							"Verify origin pool targets are reachable from edge",
							"Check DNS configuration and domain propagation",
							"Validate certificate configuration if using HTTPS",
							"Review security policies not blocking traffic",
						],
					},
				],
				icon: "⚖️",
			},
			icon: "⚖️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234F46E5'%3E%3Cpath d='M12 3c-1.27 0-2.4.8-2.82 2H3v2h1.95L2 14c-.47 2 1 4 4 4s4.47-2 4-4L7.05 7H9.1c.42 1.2 1.55 2 2.9 2s2.4-.8 2.82-2h2.13L14 14c-.47 2 1 4 4 4s4.47-2 4-4l-2.95-7H21V5h-6.18c-.42-1.2-1.55-2-2.82-2zm-6 12.5c-.73 0-1.45-.3-1.97-.82L6 10l1.97 4.68c-.52.52-1.24.82-1.97.82zm12 0c-.73 0-1.45-.3-1.97-.82L18 10l1.97 4.68c-.52.52-1.24.82-1.97.82z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "http_loadbalancer",
					description:
						"Layer 7 HTTP/HTTPS load balancer for application traffic distribution",
					descriptionShort: "HTTP load balancer",
					tier: "Standard" as const,
					icon: "🌐",
					category: "Load Balancing",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: {
						required: ["origin_pool"],
						optional: [
							"healthcheck",
							"app_firewall",
							"certificate",
							"rate_limiter",
							"service_policy",
							"bot_defense_policy",
						],
					},
					relationshipHints: [
						"origin_pool: Backend servers for traffic distribution",
						"app_firewall: WAF protection (requires WAAP subscription)",
						"healthcheck: Monitor backend availability",
						"certificate: TLS termination for HTTPS",
						"rate_limiter: Protect against traffic spikes",
					],
				},
				{
					name: "tcp_loadbalancer",
					description:
						"Layer 4 TCP/UDP load balancer for non-HTTP protocol traffic",
					descriptionShort: "TCP load balancer",
					tier: "Standard" as const,
					icon: "🔌",
					category: "Load Balancing",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: {
						required: ["origin_pool"],
						optional: ["healthcheck"],
					},
					relationshipHints: [
						"origin_pool: Backend servers for TCP/UDP traffic",
						"healthcheck: Monitor origin server health",
					],
				},
				{
					name: "origin_pool",
					description:
						"Backend server group for load balancer traffic distribution",
					descriptionShort: "Origin pool",
					tier: "Standard" as const,
					icon: "🎯",
					category: "Load Balancing",
					supportsLogs: false,
					supportsMetrics: true,
					dependencies: { optional: ["healthcheck"] },
					relationshipHints: [
						"healthcheck: Monitor origin server health",
					],
				},
				{
					name: "healthcheck",
					description:
						"Health monitoring configuration for origin server availability",
					descriptionShort: "Health check",
					tier: "Standard" as const,
					icon: "💓",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "ca_certificate",
					description:
						"GetProxyServerCACert returns PEM encoded proxy server CA certificate.",
					descriptionShort:
						"GetProxyServerCACert returns PEM encoded proxy server CA cer",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "cluster",
					description:
						"Create cluster will create the object in the storage backend for namespace metadata.namespace.",
					descriptionShort:
						"Create cluster will create the object in the storage backend",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "dos_automitigation_rule",
					description:
						"GET the corresponding DoS Auto-Mitigation Rules for the given HTTP load balancer.",
					descriptionShort:
						"GET the corresponding DoS Auto-Mitigation Rules for the give",
					tier: "Standard" as const,
					operations: ["get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "geo_location_set",
					description: "Creates a Geolocation Set.",
					descriptionShort: "Creates a Geolocation Set.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "get_security_config",
					description:
						"Fetch the corresponding Security Config for the given HTTP load balancers.",
					descriptionShort:
						"Fetch the corresponding Security Config for the given HTTP l",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "get-dns-info",
					description:
						"GetDnsInfo is an API to GET DNS information for a given HTTP load balancer.",
					descriptionShort:
						"GetDnsInfo is an API to GET DNS information for a given HTTP",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "healthcheck",
					description:
						"Health monitoring configuration for origin server availability",
					descriptionShort: "Health check",
					tier: "Standard" as const,
					icon: "💓",
					category: "Monitoring",
					supportsLogs: false,
					supportsMetrics: true,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "http_loadbalancer",
					description:
						"Layer 7 HTTP/HTTPS load balancer for application traffic distribution",
					descriptionShort: "HTTP load balancer",
					tier: "Standard" as const,
					icon: "🌐",
					category: "Load Balancing",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: {
						required: ["origin_pool"],
						optional: [
							"healthcheck",
							"app_firewall",
							"certificate",
							"rate_limiter",
							"service_policy",
							"bot_defense_policy",
						],
					},
					relationshipHints: [
						"origin_pool: Backend servers for traffic distribution",
						"app_firewall: WAF protection (requires WAAP subscription)",
						"healthcheck: Monitor backend availability",
						"certificate: TLS termination for HTTPS",
						"rate_limiter: Protect against traffic spikes",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "l7ddos_rps_threshold",
					description:
						"Sets the L7 DDoS RPS threshold for HTTP load balancer.",
					descriptionShort:
						"Sets the L7 DDoS RPS threshold for HTTP load balancer.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "origin_pool",
					description:
						"Backend server group for load balancer traffic distribution",
					descriptionShort: "Origin pool",
					tier: "Standard" as const,
					icon: "🎯",
					category: "Load Balancing",
					supportsLogs: false,
					supportsMetrics: true,
					dependencies: { optional: ["healthcheck"] },
					relationshipHints: [
						"healthcheck: Monitor origin server health",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "proxy",
					description:
						"Shape of the TCP loadbalancer create specification.",
					descriptionShort:
						"Shape of the TCP loadbalancer create specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "rate_limiter_policy",
					description:
						"Shape of the Rate Limiter Policy Create specification.",
					descriptionShort:
						"Shape of the Rate Limiter Policy Create specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "service_policy",
					description:
						"Create service_policy creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create service_policy creates a new object in the storage ba",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "service_policy_rule",
					description:
						"Create service_policy_rule creates a new object in the storage backend for metadata.namespace.",
					descriptionShort:
						"Create service_policy_rule creates a new object in the stora",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "service_policy_set",
					description:
						"List the set of service_policy_set in a namespace.",
					descriptionShort:
						"List the set of service_policy_set in a namespace.",
					tier: "Standard" as const,
					operations: ["list", "get"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "tcp_loadbalancer",
					description:
						"Layer 4 TCP/UDP load balancer for non-HTTP protocol traffic",
					descriptionShort: "TCP load balancer",
					tier: "Standard" as const,
					icon: "🔌",
					category: "Load Balancing",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: {
						required: ["origin_pool"],
						optional: ["healthcheck"],
					},
					relationshipHints: [
						"origin_pool: Backend servers for TCP/UDP traffic",
						"healthcheck: Monitor origin server health",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "udp_loadbalancer",
					description:
						"Shape of the UDP load balancer create specification.",
					descriptionShort:
						"Shape of the UDP load balancer create specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "virtual_host",
					description: "Creates virtual host in a given namespace.",
					descriptionShort:
						"Creates virtual host in a given namespace.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "api_endpoint",
					description:
						"GET list of all API Endpoints associated with the HTTP loadbalancer in format suitable for API Groups management.\nDeprecated: instead use GetAPIEndpoints in VES.I/o.schema.virtual_host.apiepcustomapi.",
					descriptionShort:
						"GET list of all API Endpoints associated with the HTTP loadb",
					tier: "Standard" as const,
					operations: ["create", "get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "calls_by_response_code",
					description:
						"GET total API calls for the given Virtual Host.",
					descriptionShort:
						"GET total API calls for the given Virtual Host.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "create_ticket",
					description: "Create a ticket for the given vulnerability.",
					descriptionShort:
						"Create a ticket for the given vulnerability.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "get_schema_update",
					description:
						"GET list of schema pairs, current and updated, for each endpoint in the request\nor all pending changes if empty list is provided.\nNOTE: any API endpoint defined in user swagger files should be ignored\nDEPRECATED. USE virtual host custom API GetAPIEndpointsSchemaUpdates.",
					descriptionShort:
						"GET list of schema pairs, current and updated, for each endp",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "learnt_schema",
					description:
						"GET Learnt Schema per API endpoint for a given auto discovered API endpoint for Virtual Host.",
					descriptionShort:
						"GET Learnt Schema per API endpoint for a given auto discover",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "pdf",
					description:
						"GET PDF of all metrics for a given auto discovered API endpoint for Virtual Host.",
					descriptionShort:
						"GET PDF of all metrics for a given auto discovered API endpo",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "sources_openapi_schema",
					description:
						"GET openapi schema per API endpoint for a given source types and Virtual Host.",
					descriptionShort:
						"GET openapi schema per API endpoint for a given source types",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "stat",
					description:
						"GET API endpoints stats for the given Virtual Host.",
					descriptionShort:
						"GET API endpoints stats for the given Virtual Host.",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "swagger_spec",
					description:
						"GET the corresponding Swagger spec for the given HTTP load balancer.",
					descriptionShort:
						"GET the corresponding Swagger spec for the given HTTP load b",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "top_active",
					description:
						"Top APIs by requested activity metric. For example most-active APIs or most-attacked APIs.",
					descriptionShort:
						"Top APIs by requested activity metric. For example most-acti",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "top_sensitive_data",
					description:
						"GET sensitive data summary for the given Virtual Host.\nFor each sensitive data type (e.g. SSN, CC, Email) we count the number of APIEPs having the respective\nsensitive data type and return top k (max 10) types with maximum APIEPs.",
					descriptionShort:
						"GET sensitive data summary for the given Virtual Host.\nFor e",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "unlink_ticket",
					description:
						"Remove the Ticket from vulnerability in XC platform\nExternal ticket systems will continue to have the record.",
					descriptionShort:
						"Remove the Ticket from vulnerability in XC platform\nExternal",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "unmerge_sources_openapi_schema",
					description:
						"Unmerge Source Discovered schema from API Endpoint merged schema.",
					descriptionShort:
						"Unmerge Source Discovered schema from API Endpoint merged sc",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "update_schema",
					description:
						"Update the payload schema for the specified endpoints or all pending changes if empty list is provided.\nNOTE: only API endpoints returned by a call to `GetAPIEndpointsSchemaStates` can be updated.\nDEPRECATED. USE virtual host custom API UpdateAPIEndpointsSchemas.",
					descriptionShort:
						"Update the payload schema for the specified endpoints or all",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "update_state",
					description:
						"Update vulnerabilities for the given Virtual Host.",
					descriptionShort:
						"Update vulnerabilities for the given Virtual Host.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "vulnerability",
					description:
						"GET vulnerabilities for the given Virtual Host.",
					descriptionShort:
						"GET vulnerabilities for the given Virtual Host.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "assign",
					description:
						"Set a reference to the API Definition, with an option to create an empty one if not exists.\nDEPRECATED. Instead use virtual host public custom API - AssignAPIDefinition.",
					descriptionShort:
						"Set a reference to the API Definition, with an option to cre",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "available",
					description:
						"List API definitions suitable for API Inventory management\nAPI Definitions which are associated at most with one app type.\nDEPRECATED: instead use ListAvailableAPIDefinitions in VES.I/o.schema.views.api_definition.publicconfigcustomapi.",
					descriptionShort:
						"List API definitions suitable for API Inventory management\nA",
					tier: "Standard" as const,
					operations: ["get"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "subscribe",
					description: "Subscribe to Malware Protection.",
					descriptionShort: "Subscribe to Malware Protection.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
				{
					name: "unsubscribe",
					description: "Unsubscribe to Malware Protection.",
					descriptionShort: "Unsubscribe to Malware Protection.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "management" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"34 resources discovered but not in primaryResources: ca_certificate, cluster, dos_automitigation_rule, geo_location_set, get_security_config...",
			],
			resourceCategories: {
				crud: [
					"ca_certificate",
					"cluster",
					"dos_automitigation_rule",
					"geo_location_set",
					"get_security_config",
					"get-dns-info",
					"healthcheck",
					"http_loadbalancer",
					"l7ddos_rps_threshold",
					"origin_pool",
					"proxy",
					"rate_limiter_policy",
					"service_policy",
					"service_policy_rule",
					"service_policy_set",
					"tcp_loadbalancer",
					"udp_loadbalancer",
					"virtual_host",
				],
				analytics: [
					"api_endpoint",
					"calls_by_response_code",
					"create_ticket",
					"get_schema_update",
					"learnt_schema",
					"pdf",
					"sources_openapi_schema",
					"stat",
					"swagger_spec",
					"top_active",
					"top_sensitive_data",
					"unlink_ticket",
					"unmerge_sources_openapi_schema",
					"update_schema",
					"update_state",
					"vulnerability",
				],
				utilities: [],
				management: ["assign", "available", "subscribe", "unsubscribe"],
			},
		},
	],
	[
		"vpm_and_node_management",
		{
			name: "vpm_and_node_management",
			displayName: "Vpm And Node Management",
			description:
				"APIs for configuring node policies, fleet management, and lifecycle operations. Supports node registration, configuration deployment, and status monitoring across distributed infrastructure.",
			descriptionShort:
				"Node lifecycle, fleet grouping, and orchestration.",
			descriptionMedium:
				"Lifecycle control, fleet configuration, and deployment policies for distributed node management.",
			aliases: [],
			complexity: "simple" as const,
			isPreview: false,
			requiresTier: "Standard",
			category: "Platform",
			useCases: [
				"Manage Virtual Private Mesh (VPM) configuration",
				"Configure node lifecycle and management",
				"Monitor VPM and node status",
			],
			relatedDomains: ["sites", "system"],
			icon: "🖥️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748B'%3E%3Cpath d='M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "node_config",
					description: "Node configuration for edge device settings",
					descriptionShort: "Node config",
					tier: "Standard" as const,
					icon: "🖥️",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: false,
				},
				{
					name: "vpm_config",
					description:
						"VPM configuration for virtual platform management",
					descriptionShort: "VPM config",
					tier: "Standard" as const,
					icon: "⚙️",
					category: "Infrastructure",
					supportsLogs: false,
					supportsMetrics: false,
				},
			],
			allResources: [
				{
					name: "upgrade_statu",
					description: "Request to GET the upgrade status.",
					descriptionShort: "Request to GET the upgrade status.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"1 resources discovered but not in primaryResources: upgrade_statu",
			],
			resourceCategories: {
				crud: [],
				analytics: ["upgrade_statu"],
				utilities: [],
				management: [],
			},
		},
	],
	[
		"waf",
		{
			name: "waf",
			displayName: "Waf",
			description:
				"Signature-based attack detection with customizable blocking responses. Attack type classification, protocol inspection, and AI-driven risk assessment. Exclusion policies override default blocking for trusted traffic. Staged signature testing validates rules before enforcement. Security event metrics track rule hits and blocked requests across namespaces.",
			descriptionShort:
				"Request inspection, attack signatures, and bot mitigation.",
			descriptionMedium:
				"Application firewall rules with signature-based detection. Exclusion policies, blocking pages, and anomaly prevention.",
			aliases: [],
			complexity: "advanced" as const,
			isPreview: false,
			requiresTier: "Advanced",
			category: "Security",
			useCases: [
				"Configure web application firewall rules",
				"Manage application security policies",
				"Enable enhanced firewall capabilities",
				"Configure protocol inspection",
			],
			relatedDomains: ["api", "network_security", "virtual"],
			icon: "🛡️",
			logoSvg:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310B981'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z'/%3E%3C/svg%3E",
			primaryResources: [
				{
					name: "app_firewall",
					description:
						"Web Application Firewall policy for HTTP traffic protection",
					descriptionShort: "WAF policy",
					tier: "Advanced" as const,
					icon: "🛡️",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["service_policy"] },
					relationshipHints: [
						"service_policy: Fine-grained access control rules",
					],
				},
				{
					name: "service_policy",
					description:
						"Service-level access control and traffic management rules",
					descriptionShort: "Service policy",
					tier: "Advanced" as const,
					icon: "📋",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: false,
				},
				{
					name: "malicious_user_detection",
					description:
						"Automated detection and mitigation of malicious user behavior",
					descriptionShort: "Malicious user detection",
					tier: "Advanced" as const,
					icon: "🚨",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
				},
			],
			allResources: [
				{
					name: "active_staged_signature",
					description: "API to GET active Staged Signatures.",
					descriptionShort: "API to GET active Staged Signatures.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "aggregation",
					description:
						"GET summary/aggregation data for security events in the given namespace.\nFor `system` namespace, all security events for the tenant matching the query specified\nin the request will be considered for aggregation. User may query security events that matches various\nfields such as `vh_name`, `sec_event_type`, `src_site`, `city`, `country`.",
					descriptionShort:
						"GET summary/aggregation data for security events in the give",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "all_ns_event",
					description:
						"GET security events for the given namespace.\nFor `system` namespace, all security events for the tenant matching the query specified\nin the request will be returned in the response. User may query security events that matches various\nfields such as `vh_name`, `sec_event_type`, `src_site`, `city`, `country`.\nThis API is specific to system namespace.",
					descriptionShort:
						"GET security events for the given namespace.\nFor `system` na",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "app_firewall",
					description:
						"Web Application Firewall policy for HTTP traffic protection",
					descriptionShort: "WAF policy",
					tier: "Advanced" as const,
					icon: "🛡️",
					category: "Security",
					supportsLogs: true,
					supportsMetrics: true,
					dependencies: { optional: ["service_policy"] },
					relationshipHints: [
						"service_policy: Fine-grained access control rules",
					],
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: true,
				},
				{
					name: "enhanced_firewall_policy",
					description:
						"Shape of Enhanced Firewall Policy specification.",
					descriptionShort:
						"Shape of Enhanced Firewall Policy specification.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "event",
					description:
						"GET security events for the given namespace.\nFor `system` namespace, all security events for the tenant matching the query specified\nin the request will be returned in the response. User may query security events that matches various\nfields such as `vh_name`, `sec_event_type`, `src_site`, `city`, `country`.",
					descriptionShort:
						"GET security events for the given namespace.\nFor `system` na",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "hit",
					description:
						"GET the counter for Enhanced Firewall Policy hits for a given namespace.",
					descriptionShort:
						"GET the counter for Enhanced Firewall Policy hits for a give",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "incident",
					description:
						"GET security incidents for the given namespace.\nFor `system` namespace, all security incidents for the tenant matching the query specified\nin the request will be returned in the response. User may query security incidents that matches various\nfields such as `vh_name`, `intent`, `city`, `country`.",
					descriptionShort:
						"GET security incidents for the given namespace.\nFor `system`",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "loadbalancer",
					description:
						"GET list of virtual hosts matching label filter.",
					descriptionShort:
						"GET list of virtual hosts matching label filter.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "protocol_inspection",
					description:
						"Create Protocol Inspection Specification in a given namespace. If one already exists it will give an error.",
					descriptionShort:
						"Create Protocol Inspection Specification in a given namespac",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "released_signature",
					description: "API to GET Released Signatures.",
					descriptionShort: "API to GET Released Signatures.",
					tier: "Standard" as const,
					operations: ["list"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "rule_hit",
					description:
						"GET number of rule hits per client for a given namespace.\nThe rule hits counter can be aggregated based on one or more labels listed here.\nNAMESPACE, APP_TYPE, VIRTUAL_HOST, SITE, SERVICE, INSTANCE, WAF_INSTANCE_ID, RULE_ID, RULE_SEVERITY, RULE_TAG.",
					descriptionShort:
						"GET number of rule hits per client for a given namespace.\nTh",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "scroll",
					description:
						'Scroll request is used to fetch large number of security events in multiple batches with each SecurityEventResponse\ncontaining no more than 500 messages. To scroll through more than 500 or all messages, one can use the\nSecurityEventScrollRequest. Use the scroll_id returned in the SecurityEventResponse to fetch the next batch of security events\nand one can continue this process till the scroll_id returned is "" which indicates no more events to scroll.',
					descriptionShort:
						"Scroll request is used to fetch large number of security eve",
					tier: "Standard" as const,
					operations: ["list", "create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "security_event",
					description:
						"GET number of security events per client for a given namespace.\nThe security events counter can be aggregated based on one or more labels listed here.\nNAMESPACE, APP_TYPE, VIRTUAL_HOST, SITE, SERVICE, INSTANCE, WAF_INSTANCE_ID, WAF_MODE.",
					descriptionShort:
						"GET number of security events per client for a given namespa",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "suspicious_user_log",
					description:
						"GET suspicious user logs for the given namespace.\nFor `system` namespace, all suspicious users logs for the tenant matching the query specified\nin the request will be returned in the response. User may query suspicious user logs that matches various\nfields such as `vh_name`, `user`, `site`, `city`, `country`.",
					descriptionShort:
						"GET suspicious user logs for the given namespace.\nFor `syste",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "waf_exclusion_policy",
					description: "Create a WAF exclusion policy.",
					descriptionShort: "Create a WAF exclusion policy.",
					tier: "Standard" as const,
					operations: ["create", "replace", "list", "get", "delete"],
					resourceCategory: "crud" as const,
					isPrimary: false,
				},
				{
					name: "all_ns_metric",
					description: "App Firewall metrics.",
					descriptionShort: "App Firewall metrics.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "metric",
					description: "App Firewall metrics.",
					descriptionShort: "App Firewall metrics.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
				{
					name: "staged_signature",
					description: "API to GET Staged Signatures.",
					descriptionShort: "API to GET Staged Signatures.",
					tier: "Standard" as const,
					operations: ["create"],
					resourceCategory: "analytics" as const,
					isPrimary: false,
				},
			],
			validationWarnings: [
				"18 resources discovered but not in primaryResources: active_staged_signature, aggregation, all_ns_event, enhanced_firewall_policy, event...",
			],
			resourceCategories: {
				crud: [
					"active_staged_signature",
					"aggregation",
					"all_ns_event",
					"app_firewall",
					"enhanced_firewall_policy",
					"event",
					"hit",
					"incident",
					"loadbalancer",
					"protocol_inspection",
					"released_signature",
					"rule_hit",
					"scroll",
					"security_event",
					"suspicious_user_log",
					"waf_exclusion_policy",
				],
				analytics: ["all_ns_metric", "metric", "staged_signature"],
				utilities: [],
				management: [],
			},
		},
	],
]);

/**
 * Total domain count
 */
export const DOMAIN_COUNT = 38;
