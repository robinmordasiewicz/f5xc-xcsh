/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from .specs/domains/*.json OpenAPI specifications
 * Spec version: 1.0.82
 * Run: npx tsx scripts/generate-operations.ts
 */

/**
 * Operation information extracted from OpenAPI specs
 */
export interface OperationInfo {
	/** CLI action: create, list, get, delete, replace, update */
	action: string;
	/** Resource type (singular): http_loadbalancer, api_crawler */
	resourceType: string;
	/** OpenAPI operationId */
	operationId: string;
	/** Short summary from OpenAPI */
	summary: string;
	/** Full description from OpenAPI */
	description: string;
	/** Purpose from x-ves-operation-metadata (if available) */
	purpose?: string;
	/** API path pattern */
	path: string;
}

/**
 * Domain operations container
 */
export interface DomainOperationsInfo {
	/** Domain name (e.g., "api", "dns") */
	domain: string;
	/** Human-readable display name */
	displayName: string;
	/** Full domain description from OpenAPI */
	description: string;
	/** Short description (~60 chars) */
	descriptionShort: string;
	/** Resource types available in this domain */
	resourceTypes: string[];
	/** All operations in this domain */
	operations: OperationInfo[];
}

/**
 * Spec version used for generation
 */
export const OPERATIONS_SPEC_VERSION = "1.0.82";

/**
 * Generated operations data from upstream OpenAPI specifications
 */
export const generatedOperations: Map<string, DomainOperationsInfo> = new Map([
	[
		"admin_console_and_ui",
		{
			domain: "admin_console_and_ui",
			displayName: "Admin Console And Ui",
			description:
				"Create administrative dashboard building blocks with tailored setup data and view bindings. Organize presentational materials by namespace and fetch them by name or list all available items. Define display parameters, track system object relationships, and maintain consistent portal appearance through centralized resource management workflows.",
			descriptionShort:
				"Create administrative dashboard building blocks with tail...",
			resourceTypes: ["static_component"],
			operations: [
				{
					action: "list",
					resourceType: "static_component",
					operationId: "ves.io.schema.ui.static_component.API.List",
					summary: "List UI Static Component.",
					description:
						"List the set of static_component in a namespace.",
					purpose: "List all static-components",
					path: "/api/web/namespaces/{namespace}/static_components",
				},
				{
					action: "get",
					resourceType: "static_component",
					operationId: "ves.io.schema.ui.static_component.API.Get",
					summary: "GET UI static component.",
					description: "GET UI static component.",
					purpose: "Retrieve specific static-component",
					path: "/api/web/namespaces/{namespace}/static_components/{name}",
				},
			],
		},
	],
	[
		"api",
		{
			domain: "api",
			displayName: "Api",
			description:
				"Catalog services automatically to maintain an inventory of operations and their characteristics. Organize related resources by function or ownership through logical groupings. Establish verification procedures that confirm authentication requirements and expected response structures. Link definitions with load balancers for traffic routing decisions. Flag non-standard paths for exclusion from automated scanning. Monitor resource status and metadata throughout deployment zones.",
			descriptionShort:
				"Catalog services automatically to maintain an inventory o...",
			resourceTypes: [
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
				"evaluate",
				"loadbalancer",
				"mark_as_non_api",
				"move_to_inventory",
				"oas_validation",
				"rate_limit",
				"remove_from_inventory",
				"stat",
				"unmark_as_non_api",
			],
			operations: [
				{
					action: "create",
					resourceType: "api_crawler",
					operationId: "ves.io.schema.api_sec.api_crawler.API.Create",
					summary: "Create API Crawler.",
					description: "Create API crawler.",
					purpose: "Create new api-crawler",
					path: "/api/config/namespaces/{metadata.namespace}/api_crawlers",
				},
				{
					action: "replace",
					resourceType: "api_crawler",
					operationId:
						"ves.io.schema.api_sec.api_crawler.API.Replace",
					summary: "Replace API crawler.",
					description: "Replace API crawler.",
					purpose: "Replace existing api-crawler",
					path: "/api/config/namespaces/{metadata.namespace}/api_crawlers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "api_crawler",
					operationId: "ves.io.schema.api_sec.api_crawler.API.List",
					summary: "List API Crawler.",
					description: "List the set of api_crawler in a namespace.",
					purpose: "List all api-crawlers",
					path: "/api/config/namespaces/{namespace}/api_crawlers",
				},
				{
					action: "get",
					resourceType: "api_crawler",
					operationId: "ves.io.schema.api_sec.api_crawler.API.Get",
					summary: "GET API crawler.",
					description: "Get API crawler.",
					purpose: "Retrieve specific api-crawler",
					path: "/api/config/namespaces/{namespace}/api_crawlers/{name}",
				},
				{
					action: "delete",
					resourceType: "api_crawler",
					operationId: "ves.io.schema.api_sec.api_crawler.API.Delete",
					summary: "DELETE API Crawler.",
					description: "DELETE the specified api_crawler.",
					purpose: "Delete api-crawler",
					path: "/api/config/namespaces/{namespace}/api_crawlers/{name}",
				},
				{
					action: "create",
					resourceType: "api_definition",
					operationId:
						"ves.io.schema.views.api_definition.API.Create",
					summary: "Create API Definition.",
					description: "Create API Definition.",
					purpose: "Create new api-definition",
					path: "/api/config/namespaces/{metadata.namespace}/api_definitions",
				},
				{
					action: "replace",
					resourceType: "api_definition",
					operationId:
						"ves.io.schema.views.api_definition.API.Replace",
					summary: "Replace API Definition.",
					description: "Replace API Definition.",
					purpose: "Replace existing api-definition",
					path: "/api/config/namespaces/{metadata.namespace}/api_definitions/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "api_definition",
					operationId: "ves.io.schema.views.api_definition.API.List",
					summary: "List API Definition.",
					description:
						"List the set of api_definition in a namespace.",
					purpose: "List all api-definitions",
					path: "/api/config/namespaces/{namespace}/api_definitions",
				},
				{
					action: "get",
					resourceType: "api_definition",
					operationId: "ves.io.schema.views.api_definition.API.Get",
					summary: "GET API Definition.",
					description: "GET API Definition.",
					purpose: "Retrieve specific api-definition",
					path: "/api/config/namespaces/{namespace}/api_definitions/{name}",
				},
				{
					action: "delete",
					resourceType: "api_definition",
					operationId:
						"ves.io.schema.views.api_definition.API.Delete",
					summary: "DELETE API Definition.",
					description: "DELETE the specified api_definition.",
					purpose: "Delete api-definition",
					path: "/api/config/namespaces/{namespace}/api_definitions/{name}",
				},
				{
					action: "get",
					resourceType: "loadbalancer",
					operationId:
						"ves.io.schema.views.api_definition.PublicConfigCustomAPI.GetReferencingLoadbalancers",
					summary: "GET Referencing Loadbalancers.",
					description:
						"List Loadbalancers referenced by the API Definition (backrefrences).",
					purpose: "Retrieve specific loadbalancer",
					path: "/api/config/namespaces/{namespace}/api_definitions/{name}/loadbalancers",
				},
				{
					action: "create",
					resourceType: "mark_as_non_api",
					operationId:
						"ves.io.schema.views.api_definition.PublicConfigCustomAPI.MarkAsNonAPI",
					summary: "Mark As Non-API.",
					description:
						"Update the API Definition's non-API list with the provided API endpoints.",
					purpose: "Create new mark-as-non-api",
					path: "/api/config/namespaces/{namespace}/api_definitions/{name}/mark_as_non_api",
				},
				{
					action: "create",
					resourceType: "move_to_inventory",
					operationId:
						"ves.io.schema.views.api_definition.PublicConfigCustomAPI.MoveToAPInventory",
					summary: "Move To API Inventory.",
					description:
						"Update the API Definition's include list with the provided API endpoints.",
					purpose: "Create new move-to-inventory",
					path: "/api/config/namespaces/{namespace}/api_definitions/{name}/move_to_inventory",
				},
				{
					action: "create",
					resourceType: "remove_from_inventory",
					operationId:
						"ves.io.schema.views.api_definition.PublicConfigCustomAPI.RemoveFromAPInventory",
					summary: "Remove From API Inventory.",
					description:
						"Update the API Definition's exclude list with the provided API endpoints.",
					purpose: "Create new remove-from-inventory",
					path: "/api/config/namespaces/{namespace}/api_definitions/{name}/remove_from_inventory",
				},
				{
					action: "create",
					resourceType: "unmark_as_non_api",
					operationId:
						"ves.io.schema.views.api_definition.PublicConfigCustomAPI.UnmarkAsNonAPI",
					summary: "Unmark As Non-API.",
					description:
						"DELETE the provided API endpoints from the API Definition's non-API list.",
					purpose: "Create new unmark-as-non-api",
					path: "/api/config/namespaces/{namespace}/api_definitions/{name}/unmark_as_non_api",
				},
				{
					action: "list",
					resourceType: "api_definitions_without_shared",
					operationId:
						"ves.io.schema.views.api_definition.PublicConfigCustomAPI.ListAvailableAPIDefinitions",
					summary: "List Available API Definitions.",
					description:
						"List API definitions suitable for API Inventory management GET all API Definitions for specific namespace exclude shared namespace.",
					purpose: "List all api-definitions-without-shareds",
					path: "/api/config/namespaces/{namespace}/api_definitions_without_shared",
				},
				{
					action: "create",
					resourceType: "api_discovery",
					operationId:
						"ves.io.schema.api_sec.api_discovery.API.Create",
					summary: "Create API Discovery.",
					description:
						"Create API discovery creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new api-discovery",
					path: "/api/config/namespaces/{metadata.namespace}/api_discoverys",
				},
				{
					action: "replace",
					resourceType: "api_discovery",
					operationId:
						"ves.io.schema.api_sec.api_discovery.API.Replace",
					summary: "Replace API Discovery.",
					description:
						"Replace api_discovery replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing api-discovery",
					path: "/api/config/namespaces/{metadata.namespace}/api_discoverys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "api_discovery",
					operationId: "ves.io.schema.api_sec.api_discovery.API.List",
					summary: "List API Discovery.",
					description:
						"List the set of api_discovery in a namespace.",
					purpose: "List all api-discoverys",
					path: "/api/config/namespaces/{namespace}/api_discoverys",
				},
				{
					action: "get",
					resourceType: "api_discovery",
					operationId: "ves.io.schema.api_sec.api_discovery.API.Get",
					summary: "GET API Discovery.",
					description:
						"GET api_discovery reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific api-discovery",
					path: "/api/config/namespaces/{namespace}/api_discoverys/{name}",
				},
				{
					action: "delete",
					resourceType: "api_discovery",
					operationId:
						"ves.io.schema.api_sec.api_discovery.API.Delete",
					summary: "DELETE API Discovery.",
					description: "DELETE the specified api_discovery.",
					purpose: "Delete api-discovery",
					path: "/api/config/namespaces/{namespace}/api_discoverys/{name}",
				},
				{
					action: "list",
					resourceType: "api_group",
					operationId: "ves.io.schema.api_group.API.List",
					summary: "List API Group.",
					description: "List the set of api_group in a namespace.",
					purpose: "List all api-groups",
					path: "/api/web/namespaces/{namespace}/api_groups",
				},
				{
					action: "get",
					resourceType: "api_group",
					operationId: "ves.io.schema.api_group.API.Get",
					summary: "GET API Group.",
					description:
						"GET api_group reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific api-group",
					path: "/api/web/namespaces/{namespace}/api_groups/{name}",
				},
				{
					action: "list",
					resourceType: "api_group_element",
					operationId: "ves.io.schema.api_group_element.API.List",
					summary: "List API Group Element.",
					description:
						"List the set of api_group_element in a namespace.",
					purpose: "List all api-group-elements",
					path: "/api/web/namespaces/{namespace}/api_group_elements",
				},
				{
					action: "get",
					resourceType: "api_group_element",
					operationId: "ves.io.schema.api_group_element.API.Get",
					summary: "GET API Group Element.",
					description:
						"GET api_group_element reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific api-group-element",
					path: "/api/web/namespaces/{namespace}/api_group_elements/{name}",
				},
				{
					action: "create",
					resourceType: "api_testing",
					operationId: "ves.io.schema.api_sec.api_testing.API.Create",
					summary: "Create API Testing.",
					description: "Create API testing.",
					purpose: "Create new api-testing",
					path: "/api/config/namespaces/{metadata.namespace}/api_testings",
				},
				{
					action: "replace",
					resourceType: "api_testing",
					operationId:
						"ves.io.schema.api_sec.api_testing.API.Replace",
					summary: "Replace API testing.",
					description: "Replace API testing.",
					purpose: "Replace existing api-testing",
					path: "/api/config/namespaces/{metadata.namespace}/api_testings/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "api_testing",
					operationId: "ves.io.schema.api_sec.api_testing.API.List",
					summary: "List API Testing.",
					description: "List the set of api_testing in a namespace.",
					purpose: "List all api-testings",
					path: "/api/config/namespaces/{namespace}/api_testings",
				},
				{
					action: "get",
					resourceType: "api_testing",
					operationId: "ves.io.schema.api_sec.api_testing.API.Get",
					summary: "GET API testing.",
					description: "Get API testing.",
					purpose: "Retrieve specific api-testing",
					path: "/api/config/namespaces/{namespace}/api_testings/{name}",
				},
				{
					action: "delete",
					resourceType: "api_testing",
					operationId: "ves.io.schema.api_sec.api_testing.API.Delete",
					summary: "DELETE API Testing.",
					description: "DELETE the specified api_testing.",
					purpose: "Delete api-testing",
					path: "/api/config/namespaces/{namespace}/api_testings/{name}",
				},
				{
					action: "create",
					resourceType: "app_api_group",
					operationId: "ves.io.schema.views.app_api_group.API.Create",
					summary: "Create API Group.",
					description:
						"Create app_api_group creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new app-api-group",
					path: "/api/config/namespaces/{metadata.namespace}/app_api_groups",
				},
				{
					action: "replace",
					resourceType: "app_api_group",
					operationId:
						"ves.io.schema.views.app_api_group.API.Replace",
					summary: "Replace API Group.",
					description:
						"Replace app_api_group replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing app-api-group",
					path: "/api/config/namespaces/{metadata.namespace}/app_api_groups/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "app_api_group",
					operationId: "ves.io.schema.views.app_api_group.API.List",
					summary: "List App API Group.",
					description:
						"List the set of app_api_group in a namespace.",
					purpose: "List all app-api-groups",
					path: "/api/config/namespaces/{namespace}/app_api_groups",
				},
				{
					action: "create",
					resourceType: "evaluate",
					operationId:
						"ves.io.schema.views.app_api_group.CustomAPI.EvaluateApiGroup",
					summary: "Evaluate API Group.",
					description:
						"Evaluate API Group Builder against all API endpoints associated with the referenced object and return the resulting API Group. For example, if the referenced object is an HTTP LB then all discovered and imported endpoints are associated with it.",
					purpose: "Create new evaluate",
					path: "/api/ml/data/namespaces/{namespace}/app_api_groups/evaluate",
				},
				{
					action: "create",
					resourceType: "stat",
					operationId:
						"ves.io.schema.views.app_api_group.CustomAPI.GetApiGroupsStats",
					summary: "Evaluate API Group.",
					description:
						"Check if there are any changes happened to the API Groups, and return number of API Endpoints updated for each API Group.",
					purpose: "Create new stat",
					path: "/api/ml/data/namespaces/{namespace}/app_api_groups/stats",
				},
				{
					action: "get",
					resourceType: "app_api_group",
					operationId: "ves.io.schema.views.app_api_group.API.Get",
					summary: "GET API Group.",
					description:
						"GET app_api_group reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific app-api-group",
					path: "/api/config/namespaces/{namespace}/app_api_groups/{name}",
				},
				{
					action: "delete",
					resourceType: "app_api_group",
					operationId: "ves.io.schema.views.app_api_group.API.Delete",
					summary: "DELETE App API Group.",
					description: "DELETE the specified app_api_group.",
					purpose: "Delete app-api-group",
					path: "/api/config/namespaces/{namespace}/app_api_groups/{name}",
				},
				{
					action: "create",
					resourceType: "api_endpoint_protection",
					operationId:
						"ves.io.schema.api_sec.rule_suggestion.RuleSuggestionAPI.GetSuggestedAPIEndpointProtectionRule",
					summary: "Suggest API endpoint protection rule.",
					description:
						"Suggest API endpoint protection rule for a given path.",
					purpose: "Create new api-endpoint-protection",
					path: "/api/config/namespaces/{namespace}/api_sec/rule_suggestion/api_endpoint_protection",
				},
				{
					action: "create",
					resourceType: "data_exposure",
					operationId:
						"ves.io.schema.api_sec.rule_suggestion.RuleSuggestionAPI.GetSuggestedSensitiveDataRule",
					summary: "Suggest sensitive data rule.",
					description:
						"Suggest sensitive data rule for a given path.",
					purpose: "Create new data-exposure",
					path: "/api/config/namespaces/{namespace}/api_sec/rule_suggestion/data_exposure",
				},
				{
					action: "create",
					resourceType: "oas_validation",
					operationId:
						"ves.io.schema.api_sec.rule_suggestion.RuleSuggestionAPI.GetSuggestedOasValidationRule",
					summary: "Suggest Open API specification validation rule.",
					description:
						"Suggest Open API specification validation rule for a given path.",
					purpose: "Create new oas-validation",
					path: "/api/config/namespaces/{namespace}/api_sec/rule_suggestion/oas_validation",
				},
				{
					action: "create",
					resourceType: "rate_limit",
					operationId:
						"ves.io.schema.api_sec.rule_suggestion.RuleSuggestionAPI.GetSuggestedRateLimitRule",
					summary: "Suggest rate limit rule.",
					description: "Suggest rate limit rule for a given path.",
					purpose: "Create new rate-limit",
					path: "/api/config/namespaces/{namespace}/api_sec/rule_suggestion/rate_limit",
				},
				{
					action: "create",
					resourceType: "code_base_integration",
					operationId:
						"ves.io.schema.api_sec.code_base_integration.API.Create",
					summary: "CREATE Code Base Integration.",
					description: "CREATE integration details.",
					purpose: "Create new code-base-integration",
					path: "/api/config/namespaces/{metadata.namespace}/code_base_integrations",
				},
				{
					action: "replace",
					resourceType: "code_base_integration",
					operationId:
						"ves.io.schema.api_sec.code_base_integration.API.Replace",
					summary: "Replace Code Base Integration.",
					description: "Replace integration details.",
					purpose: "Replace existing code-base-integration",
					path: "/api/config/namespaces/{metadata.namespace}/code_base_integrations/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "code_base_integration",
					operationId:
						"ves.io.schema.api_sec.code_base_integration.API.List",
					summary: "List Code Base Integration.",
					description:
						"List the set of code_base_integration in a namespace.",
					purpose: "List all code-base-integrations",
					path: "/api/config/namespaces/{namespace}/code_base_integrations",
				},
				{
					action: "get",
					resourceType: "code_base_integration",
					operationId:
						"ves.io.schema.api_sec.code_base_integration.API.Get",
					summary: "GET Code Base Integration.",
					description: "GET code base integration details.",
					purpose: "Retrieve specific code-base-integration",
					path: "/api/config/namespaces/{namespace}/code_base_integrations/{name}",
				},
				{
					action: "delete",
					resourceType: "code_base_integration",
					operationId:
						"ves.io.schema.api_sec.code_base_integration.API.Delete",
					summary: "DELETE Code Base Integration.",
					description: "DELETE the specified code_base_integration.",
					purpose: "Delete code-base-integration",
					path: "/api/config/namespaces/{namespace}/code_base_integrations/{name}",
				},
				{
					action: "create",
					resourceType: "discovery",
					operationId: "ves.io.schema.discovery.API.Create",
					summary: "Create Discovery.",
					description:
						"API to create discovery object for a site or virtual site in system namespace.",
					purpose: "Create new discovery",
					path: "/api/config/namespaces/{metadata.namespace}/discoverys",
				},
				{
					action: "replace",
					resourceType: "discovery",
					operationId: "ves.io.schema.discovery.API.Replace",
					summary: "Replace Discovery.",
					description:
						"API to replace discovery object for a site or virtual site in system namespace.",
					purpose: "Replace existing discovery",
					path: "/api/config/namespaces/{metadata.namespace}/discoverys/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "download_certificate",
					operationId:
						"ves.io.schema.discovery.CustomAPI.DownloadCertificates",
					summary: "Download Certificates.",
					description:
						"Download the cerificates files for the Log Collerctor In order to establish connection from the third party application server to the Log Colletor the user should download a zip file with the certificates files: - client.crt - client.key - server_ca.crt.",
					purpose: "Create new download-certificate",
					path: "/api/config/namespaces/{namespace}/discovery/{name}/download_certificates",
				},
				{
					action: "list",
					resourceType: "discovery",
					operationId: "ves.io.schema.discovery.API.List",
					summary: "List Discovery.",
					description: "List the set of discovery in a namespace.",
					purpose: "List all discoverys",
					path: "/api/config/namespaces/{namespace}/discoverys",
				},
				{
					action: "get",
					resourceType: "discovery",
					operationId: "ves.io.schema.discovery.API.Get",
					summary: "GET Discovery.",
					description:
						"API to GET discovery object for a site or virtual site in system namespace.",
					purpose: "Retrieve specific discovery",
					path: "/api/config/namespaces/{namespace}/discoverys/{name}",
				},
				{
					action: "delete",
					resourceType: "discovery",
					operationId: "ves.io.schema.discovery.API.Delete",
					summary: "DELETE Discovery.",
					description: "DELETE the specified discovery.",
					purpose: "Delete discovery",
					path: "/api/config/namespaces/{namespace}/discoverys/{name}",
				},
			],
		},
	],
	[
		"authentication",
		{
			domain: "authentication",
			displayName: "Authentication",
			description:
				"F5 Distributed Cloud Authentication API specifications",
			descriptionShort:
				"F5 Distributed Cloud Authentication API specifications",
			resourceTypes: [
				"api_credential",
				"scim_token",
				"service_credential",
			],
			operations: [
				{
					action: "create",
					resourceType: "api_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.BulkRevoke",
					summary: "Bulk Revoke API credentials.",
					description:
						"It is used to revoke multiple API credentials. This API would disable the credentials and mark them for deletion. The actual removal of objects would be done in the background. Depending upon if user is admin or not, following behaviour is supported:- * for admins : user has the access to DELETE their own as well as credentials created by others * for non-admins: user can only DELETE their own credentials.",
					purpose: "Create new api-credential",
					path: "/api/web/namespaces/system/bulk_revoke/api_credentials",
				},
				{
					action: "create",
					resourceType: "service_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.BulkRevokeServiceCredentials",
					summary: "Bulk Revoke service credential.",
					description:
						"It is used to revoke multiple service credentials. This API would disable the credentials and mark them for deletion. The actual removal of objects would be done in the background. Only admins are allowed to access this API.",
					purpose: "Create new service-credential",
					path: "/api/web/namespaces/system/bulk_revoke/service_credentials",
				},
				{
					action: "create",
					resourceType: "api_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.Activate",
					summary: "Activate API credential.",
					description: "For API credential activation/deactivation.",
					purpose: "Create new api-credential",
					path: "/api/web/namespaces/{namespace}/activate/api_credentials",
				},
				{
					action: "create",
					resourceType: "service_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.ActivateServiceCredentials",
					summary: "Activate API service credential.",
					description:
						"For Service credential activation/deactivation.",
					purpose: "Create new service-credential",
					path: "/api/web/namespaces/{namespace}/activate/service_credentials",
				},
				{
					action: "list",
					resourceType: "api_credential",
					operationId: "ves.io.schema.api_credential.CustomAPI.List",
					summary: "List API Credentials.",
					description:
						"Returns list of API credential of all types created by the user. Query will look into tenants system namespace.",
					purpose: "List all api-credentials",
					path: "/api/web/namespaces/{namespace}/api_credentials",
				},
				{
					action: "create",
					resourceType: "api_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.Create",
					summary: "Create API Credentials.",
					description:
						"User can request 3 types of credential for themselves. API_TOKEN, API_CERTIFICATE and KUBE_CONFIG. An API_TOKEN is an easy to use secret that can be send part of HTTP request header Authorization: APIToken <value> in the create request expiry can be set additionally. F5XC also supports renew and revoke of API_TOKENs. An API_CERTIFICATE is a password protected P12 certificate bundle document and can be used as client certificate. When sending create request, user can request with an expiry and password. F5XC Identity Authority (IA) mints new certificate with required credentials and is shared in the response as API Certificate. A virtual K8s kubeconfig can be generate with type KUBE_CONFIG. Create request can specify cluster, namespace and expiry with embedded user access with client certificate. Request can specify name, expiry and type of credential required. Since this credential inherits the creator's RBAC service will determine the user from request context.",
					purpose: "Create new api-credential",
					path: "/api/web/namespaces/{namespace}/api_credentials",
				},
				{
					action: "get",
					resourceType: "api_credential",
					operationId: "ves.io.schema.api_credential.CustomAPI.Get",
					summary: "GET API Credentials.",
					description:
						"GET implements API credential query by name. Returns API credential object. Query will look into tenants system namespace for API credential by name.",
					purpose: "Retrieve specific api-credential",
					path: "/api/web/namespaces/{namespace}/api_credentials/{name}",
				},
				{
					action: "create",
					resourceType: "api_credential",
					operationId: "ves.io.schema.api_credential.CustomAPI.Renew",
					summary: "Renew API credential.",
					description:
						"Renew user's my credential expiry. Renewal is only supported for the credential type API_TOKEN.",
					purpose: "Create new api-credential",
					path: "/api/web/namespaces/{namespace}/renew/api_credentials",
				},
				{
					action: "create",
					resourceType: "service_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.RenewServiceCredentials",
					summary: "Renew API service credential.",
					description:
						"Renew service credential's expiry. Renewal is only supported for the credential type SERVICE_API_TOKEN.",
					purpose: "Create new service-credential",
					path: "/api/web/namespaces/{namespace}/renew/service_credentials",
				},
				{
					action: "create",
					resourceType: "api_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.Revoke",
					summary: "Revoke API credential.",
					description: "For API credential revoke/deletion.",
					purpose: "Create new api-credential",
					path: "/api/web/namespaces/{namespace}/revoke/api_credentials",
				},
				{
					action: "create",
					resourceType: "scim_token",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.RevokeScimToken",
					summary: "Revoke SCIM API credential.",
					description: "For SCIM API credential revoke/deletion.",
					purpose: "Create new scim-token",
					path: "/api/web/namespaces/{namespace}/revoke/scim_token",
				},
				{
					action: "create",
					resourceType: "service_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.RevokeServiceCredentials",
					summary: "Revoke Service credential.",
					description: "For Service credential revoke/deletion.",
					purpose: "Create new service-credential",
					path: "/api/web/namespaces/{namespace}/revoke/service_credentials",
				},
				{
					action: "list",
					resourceType: "scim_token",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.GetScimToken",
					summary: "GET Scim Token.",
					description:
						"GetScimToken implements querying of scim token. SCIM API token value will be visible only on create API response. This detail RPC will show the current token's expiry. Returns API credential object.",
					purpose: "List all scim-tokens",
					path: "/api/web/namespaces/{namespace}/scim_token",
				},
				{
					action: "create",
					resourceType: "scim_token",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.RecreateScimToken",
					summary: "Create/RE-create SCIM API token.",
					description:
						"Request to create/RE-create new SCIM API credential. Note: Only one valid (non-expired) SCIM token could exist for a tenant, and only if SCIM is enabled for the tenant. If a valid SCIM token is already minted, we would revoke the current one and generate a new one.",
					purpose: "Create new scim-token",
					path: "/api/web/namespaces/{namespace}/scim_token",
				},
				{
					action: "list",
					resourceType: "service_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.ListServiceCredentials",
					summary: "List service credentials.",
					description:
						"Request to list service credentials created by user.",
					purpose: "List all service-credentials",
					path: "/api/web/namespaces/{namespace}/service_credentials",
				},
				{
					action: "create",
					resourceType: "service_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.CreateServiceCredentials",
					summary: "Create service credentials.",
					description:
						"Request to create new service credentials. User can specify name, expiry and list of namespce and allowed role of the service user.",
					purpose: "Create new service-credential",
					path: "/api/web/namespaces/{namespace}/service_credentials",
				},
				{
					action: "get",
					resourceType: "service_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.GetServiceCredentials",
					summary: "GET Service Credential.",
					description:
						"GET implements service credential query by name. Returns service credential object. Query will look into tenants system namespace for service credential by name.",
					purpose: "Retrieve specific service-credential",
					path: "/api/web/namespaces/{namespace}/service_credentials/{name}",
				},
				{
					action: "replace",
					resourceType: "service_credential",
					operationId:
						"ves.io.schema.api_credential.CustomAPI.ReplaceServiceCredentials",
					summary: "Replace service credentials.",
					description:
						"Request to replace user_groups and roles in service credentials. Note - for updating expiry use RenewServiceCredentials and to active/inactive service credential use ActivateServiceCredentials API.",
					purpose: "Replace existing service-credential",
					path: "/api/web/namespaces/{namespace}/service_credentials/{name}",
				},
			],
		},
	],
	[
		"bigip",
		{
			domain: "bigip",
			displayName: "Bigip",
			description:
				"Define custom rule-based policies governing routing decisions and request handling. Build organized collections for network ranges, string patterns, and key-value entries. Map cloud services to physical appliances through connector setups. Link identity workflows using access modules. Track performance metrics and coordinate synchronization between components.",
			descriptionShort:
				"Define custom rule-based policies governing routing decis...",
			resourceTypes: [
				"apm",
				"bigip_irule",
				"bigip_virtual_server",
				"data_group",
				"get_security_config",
				"irule",
				"metric",
			],
			operations: [
				{
					action: "create",
					resourceType: "apm",
					operationId: "ves.io.schema.bigip.apm.API.Create",
					summary: "Create APM Service.",
					description:
						"Creates a new APM as a service with configured parameters.",
					purpose: "Create new apm",
					path: "/api/config/namespaces/{metadata.namespace}/apms",
				},
				{
					action: "replace",
					resourceType: "apm",
					operationId: "ves.io.schema.bigip.apm.API.Replace",
					summary: "Replace APM Service.",
					description:
						"Replaces configured APM Service with new set of parameters.",
					purpose: "Replace existing apm",
					path: "/api/config/namespaces/{metadata.namespace}/apms/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "apm",
					operationId: "ves.io.schema.bigip.apm.API.List",
					summary: "List BIG-IP APM as a Service.",
					description: "List the set of apm in a namespace.",
					purpose: "List all apms",
					path: "/api/config/namespaces/{namespace}/apms",
				},
				{
					action: "get",
					resourceType: "apm",
					operationId: "ves.io.schema.bigip.apm.API.Get",
					summary: "GET APM Service.",
					description: "Gets APM Service parameters.",
					purpose: "Retrieve specific apm",
					path: "/api/config/namespaces/{namespace}/apms/{name}",
				},
				{
					action: "delete",
					resourceType: "apm",
					operationId: "ves.io.schema.bigip.apm.API.Delete",
					summary: "DELETE BIG-IP APM as a Service.",
					description: "DELETE the specified apm.",
					purpose: "Delete apm",
					path: "/api/config/namespaces/{namespace}/apms/{name}",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.bigip.apm.CustomDataAPI.Metrics",
					summary: "Metrics",
					description: "BIG-IP APM metrics.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/{namespace}/bigip/apm/metrics",
				},
				{
					action: "create",
					resourceType: "bigip_irule",
					operationId: "ves.io.schema.bigip_irule.API.Create",
					summary: "Specification.",
					description: "Desired state for BIG-IP iRule Service.",
					purpose: "Create new bigip-irule",
					path: "/api/bigipconnector/namespaces/{metadata.namespace}/bigip_irules",
				},
				{
					action: "replace",
					resourceType: "bigip_irule",
					operationId: "ves.io.schema.bigip_irule.API.Replace",
					summary: "Specification.",
					description: "Desired state for BIG-IP iRule Service.",
					purpose: "Replace existing bigip-irule",
					path: "/api/bigipconnector/namespaces/{metadata.namespace}/bigip_irules/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "bigip_irule",
					operationId: "ves.io.schema.bigip_irule.API.List",
					summary: "List BIG-IP iRule as a Service.",
					description: "List the set of bigip_irule in a namespace.",
					purpose: "List all bigip-irules",
					path: "/api/bigipconnector/namespaces/{namespace}/bigip_irules",
				},
				{
					action: "get",
					resourceType: "bigip_irule",
					operationId: "ves.io.schema.bigip_irule.API.Get",
					summary: "Specification.",
					description: "Desired state for BIG-IP iRule Service.",
					purpose: "Retrieve specific bigip-irule",
					path: "/api/bigipconnector/namespaces/{namespace}/bigip_irules/{name}",
				},
				{
					action: "delete",
					resourceType: "bigip_irule",
					operationId: "ves.io.schema.bigip_irule.API.Delete",
					summary: "DELETE BIG-IP iRule as a Service.",
					description: "DELETE the specified bigip_irule.",
					purpose: "Delete bigip-irule",
					path: "/api/bigipconnector/namespaces/{namespace}/bigip_irules/{name}",
				},
				{
					action: "replace",
					resourceType: "bigip_virtual_server",
					operationId:
						"ves.io.schema.views.bigip_virtual_server.API.Replace",
					summary: "Replace BIG-IP virtual server.",
					description:
						"Shape of the BIG-IP virtual server specification.",
					purpose: "Replace existing bigip-virtual-server",
					path: "/api/config/namespaces/{metadata.namespace}/bigip_virtual_servers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "bigip_virtual_server",
					operationId:
						"ves.io.schema.views.bigip_virtual_server.API.List",
					summary: "List BIG-IP virtual server.",
					description:
						"List the set of bigip_virtual_server in a namespace.",
					purpose: "List all bigip-virtual-servers",
					path: "/api/config/namespaces/{namespace}/bigip_virtual_servers",
				},
				{
					action: "create",
					resourceType: "get_security_config",
					operationId:
						"ves.io.schema.views.bigip_virtual_server.CustomAPI.GetSecurityConfig",
					summary: "GET Security Config for BIG-IP Load Balancer.",
					description:
						"Fetch the corresponding Security Config for the given BIG-IP load balancers.",
					purpose: "Create new get-security-config",
					path: "/api/config/namespaces/{namespace}/bigip_virtual_servers/get_security_config",
				},
				{
					action: "get",
					resourceType: "bigip_virtual_server",
					operationId:
						"ves.io.schema.views.bigip_virtual_server.API.Get",
					summary: "GET BIG-IP virtual server.",
					description:
						"Shape of the BIG-IP virtual server specification.",
					purpose: "Retrieve specific bigip-virtual-server",
					path: "/api/config/namespaces/{namespace}/bigip_virtual_servers/{name}",
				},
				{
					action: "create",
					resourceType: "irule",
					operationId: "ves.io.schema.bigcne.irule.API.Create",
					summary: "Create iRule.",
					description:
						"Create iRule in a given namespace. If one already exists it will give an error.",
					purpose: "Create new irule",
					path: "/api/config/namespaces/{metadata.namespace}/irules",
				},
				{
					action: "replace",
					resourceType: "irule",
					operationId: "ves.io.schema.bigcne.irule.API.Replace",
					summary: "Replace iRule.",
					description: "Replace iRule in a given namespace.",
					purpose: "Replace existing irule",
					path: "/api/config/namespaces/{metadata.namespace}/irules/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "irule",
					operationId: "ves.io.schema.bigcne.irule.API.List",
					summary: "List Configure iRule.",
					description: "List the set of irule in a namespace.",
					purpose: "List all irules",
					path: "/api/config/namespaces/{namespace}/irules",
				},
				{
					action: "get",
					resourceType: "irule",
					operationId: "ves.io.schema.bigcne.irule.API.Get",
					summary: "GET iRule",
					description: "GET iRule details.",
					purpose: "Retrieve specific irule",
					path: "/api/config/namespaces/{namespace}/irules/{name}",
				},
				{
					action: "delete",
					resourceType: "irule",
					operationId: "ves.io.schema.bigcne.irule.API.Delete",
					summary: "DELETE Configure iRule.",
					description: "DELETE the specified irule.",
					purpose: "Delete irule",
					path: "/api/config/namespaces/{namespace}/irules/{name}",
				},
				{
					action: "create",
					resourceType: "data_group",
					operationId: "ves.io.schema.bigcne.data_group.API.Create",
					summary: "Create Data group.",
					description:
						"Create data group in a given namespace. If one already exists it will give an error.",
					purpose: "Create new data-group",
					path: "/api/config/namespaces/{metadata.namespace}/data_groups",
				},
				{
					action: "replace",
					resourceType: "data_group",
					operationId: "ves.io.schema.bigcne.data_group.API.Replace",
					summary: "Replace Data Group.",
					description: "Replace Data Group in a given namespace.",
					purpose: "Replace existing data-group",
					path: "/api/config/namespaces/{metadata.namespace}/data_groups/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "data_group",
					operationId: "ves.io.schema.bigcne.data_group.API.List",
					summary: "List Data Group.",
					description: "List the set of data_group in a namespace.",
					purpose: "List all data-groups",
					path: "/api/config/namespaces/{namespace}/data_groups",
				},
				{
					action: "get",
					resourceType: "data_group",
					operationId: "ves.io.schema.bigcne.data_group.API.Get",
					summary: "GET Data Group.",
					description: "GET Data Group details.",
					purpose: "Retrieve specific data-group",
					path: "/api/config/namespaces/{namespace}/data_groups/{name}",
				},
				{
					action: "delete",
					resourceType: "data_group",
					operationId: "ves.io.schema.bigcne.data_group.API.Delete",
					summary: "DELETE Data Group.",
					description: "DELETE the specified data_group.",
					purpose: "Delete data-group",
					path: "/api/config/namespaces/{namespace}/data_groups/{name}",
				},
			],
		},
	],
	[
		"billing_and_usage",
		{
			domain: "billing_and_usage",
			displayName: "Billing And Usage",
			description:
				"Set up payment methods with primary and secondary designations for redundancy. Initiate plan transitions between subscription tiers with state tracking. Download invoice PDFs and query custom invoice lists by date range or status. Define quota limits per namespace and monitor current usage against allocated capacity. Swap payment method roles without service interruption.",
			descriptionShort:
				"Set up payment methods with primary and secondary designa...",
			resourceTypes: [
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
				"subscribe",
				"swap-primary",
				"unsubscribe",
				"usage",
				"usage_detail",
			],
			operations: [
				{
					action: "list",
					resourceType: "invoice_pdf",
					operationId:
						"ves.io.schema.usage.invoice.CustomAPI.DownloadInvoicePdf",
					summary: "GetInvoicePdf.",
					description: "Retrieve pdf for a paid invoice by its name.",
					purpose: "List all invoice-pdfs",
					path: "/api/web/namespaces/{namespace}/usage/invoice_pdf",
				},
				{
					action: "list",
					resourceType: "custom_list",
					operationId:
						"ves.io.schema.usage.invoice.CustomAPI.ListInvoices",
					summary: "List invoices.",
					description: "Endpoint to list customer invoices.",
					purpose: "List all custom-lists",
					path: "/api/web/namespaces/{namespace}/usage/invoices/custom_list",
				},
				{
					action: "create",
					resourceType: "primary",
					operationId:
						"ves.io.schema.billing.payment_method.CustomAPI.MakePaymentMethodPrimary",
					summary: "Make credit card primary.",
					description:
						"Flags a payment method as primary. Nothing changes is the payment method is already primary, if the payment method is secondary then it becomes default and there will be no secondary.",
					purpose: "Create new primary",
					path: "/api/web/namespaces/{namespace}/billing/payment_method/{name}/primary",
				},
				{
					action: "create",
					resourceType: "secondary",
					operationId:
						"ves.io.schema.billing.payment_method.CustomAPI.MakePaymentMethodSecondary",
					summary: "Make payment method secondary.",
					description:
						"Flags a payment method as secondary. Nothing changes is the payment method is already secondary, if the payment method is primary then it becomes secondary and there will be no primary.",
					purpose: "Create new secondary",
					path: "/api/web/namespaces/{namespace}/billing/payment_method/{name}/secondary",
				},
				{
					action: "create",
					resourceType: "swap-primary",
					operationId:
						"ves.io.schema.billing.payment_method.CustomAPI.SwapPaymentMethodRole",
					summary: "Make payment method secondary.",
					description:
						"Swaps payment method roles - the payment method used as a parameter will became primary, any other will become secondary. The `name` parameter is ignored.",
					purpose: "Create new swap-primary",
					path: "/api/web/namespaces/{namespace}/billing/payment_method/{name}/swap-primary",
				},
				{
					action: "create",
					resourceType: "payment_method",
					operationId:
						"ves.io.schema.billing.payment_method.CustomAPI.Create",
					summary: "Create payment method specification.",
					description:
						"Creates a new payment method with a specific role.",
					purpose: "Create new payment-method",
					path: "/api/web/namespaces/{namespace}/billing/payment_methods",
				},
				{
					action: "delete",
					resourceType: "payment_method",
					operationId:
						"ves.io.schema.billing.payment_method.CustomAPI.Delete",
					summary: "DELETE the specified payment method.",
					description: "Remove the specified payment_method.",
					purpose: "Delete payment-method",
					path: "/api/web/namespaces/{namespace}/billing/payment_methods/{name}",
				},
				{
					action: "list",
					resourceType: "plan_transition",
					operationId:
						"ves.io.schema.billing.plan_transition.CustomAPI.GetPlanTransition",
					summary: "GetPlanTransition.",
					description:
						"API to GET plan transition details by a plan transition request uid returned from InitiatePlanTransition. For now this one returns only current State.",
					purpose: "List all plan-transitions",
					path: "/no_auth/namespaces/system/billing/plan_transition",
				},
				{
					action: "create",
					resourceType: "plan_transition",
					operationId:
						"ves.io.schema.billing.plan_transition.CustomAPI.InitiatePlanTransition",
					summary: "InitiatePlanTransition.",
					description:
						"API to create a plan transition request in db.",
					purpose: "Create new plan-transition",
					path: "/api/web/namespaces/{namespace}/billing/plan_transition",
				},
				{
					action: "create",
					resourceType: "quota",
					operationId: "ves.io.schema.quota.API.Create",
					summary: "Create Quota.",
					description:
						"Create quota creates a given object from storage backend for metadata.namespace.",
					purpose: "Create new quota",
					path: "/api/web/namespaces/{metadata.namespace}/quotas",
				},
				{
					action: "replace",
					resourceType: "quota",
					operationId: "ves.io.schema.quota.API.Replace",
					summary: "Replace Quota.",
					description:
						"Replace quota updates a given object from storage backend for metadata.namespace.",
					purpose: "Replace existing quota",
					path: "/api/web/namespaces/{metadata.namespace}/quotas/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "limit",
					operationId:
						"ves.io.schema.quota.CustomAPI.CustomGetQuotaLimits",
					summary: "Custom GET Quota Limits.",
					description: "Custom endpoint to return quota limits.",
					purpose: "List all limits",
					path: "/api/web/namespaces/{namespace}/quota/limits",
				},
				{
					action: "list",
					resourceType: "usage",
					operationId: "ves.io.schema.quota.CustomAPI.GetQuotaUsage",
					summary: "GET Quota Usage.",
					description:
						"GET allows users to query limits and current usage of resources.",
					purpose: "List all usages",
					path: "/api/web/namespaces/{namespace}/quota/usage",
				},
				{
					action: "list",
					resourceType: "quota",
					operationId: "ves.io.schema.quota.API.List",
					summary: "List Quota.",
					description: "List the set of quota in a namespace.",
					purpose: "List all quotas",
					path: "/api/web/namespaces/{namespace}/quotas",
				},
				{
					action: "get",
					resourceType: "quota",
					operationId: "ves.io.schema.quota.API.Get",
					summary: "GET Quota",
					description:
						"GET quota reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific quota",
					path: "/api/web/namespaces/{namespace}/quotas/{name}",
				},
				{
					action: "delete",
					resourceType: "quota",
					operationId: "ves.io.schema.quota.API.Delete",
					summary: "DELETE Quota.",
					description: "DELETE the specified quota.",
					purpose: "Delete quota",
					path: "/api/web/namespaces/{namespace}/quotas/{name}",
				},
				{
					action: "list",
					resourceType: "custom_list",
					operationId:
						"ves.io.schema.usage.subscription.CustomAPI.ListSubscriptions",
					summary: "List Subscriptions.",
					description: "Endpoint to list subscriptions.",
					purpose: "List all custom-lists",
					path: "/api/web/namespaces/{namespace}/subscriptions/custom_list",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to XC addon services.",
					description: "Subscribe to XC addon services.",
					purpose: "Create new subscribe",
					path: "/api/web/namespaces/system/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to XC addon services.",
					description: "Unsubscribe to XC addon services.",
					purpose: "Create new unsubscribe",
					path: "/api/web/namespaces/system/addon/unsubscribe",
				},
				{
					action: "create",
					resourceType: "current_usage",
					operationId:
						"ves.io.schema.usage.CustomCalculatedUsageAPI.ListCurrentUsage",
					summary: "List current usage details.",
					description:
						"List current usage details per tenant and namespace. Some usage have only sense in the system namespace and this selector has no effect on it.",
					purpose: "Create new current-usage",
					path: "/api/web/namespaces/{namespace}/current_usage",
				},
				{
					action: "create",
					resourceType: "hourly_usage_detail",
					operationId:
						"ves.io.schema.usage.CustomAggregatedUsageAPI.ListHourlyUsageDetails",
					summary: "List hourly usage details.",
					description:
						"List the usage divided by hour. The usage is hourly aggregated, from the start of UTC hour to the end of UTC hour. It is used to see the detailed breakdown of the usage received from ListUsageDetails.",
					purpose: "Create new hourly-usage-detail",
					path: "/api/web/namespaces/{namespace}/hourly_usage_details",
				},
				{
					action: "create",
					resourceType: "monthly_usage",
					operationId:
						"ves.io.schema.usage.CustomCalculatedUsageAPI.ListMonthlyUsage",
					summary: "List monthly usage details.",
					description:
						"List monthly usage details per tenant and namespace. Some usage have only sense in the system namespace and this selector has no effect on it.",
					purpose: "Create new monthly-usage",
					path: "/api/web/namespaces/{namespace}/monthly_usage",
				},
				{
					action: "create",
					resourceType: "usage_detail",
					operationId:
						"ves.io.schema.usage.CustomAggregatedUsageAPI.ListUsageDetails",
					summary: "List usage details.",
					description:
						"List usage details per tenant and namespace. Some usage have only sense in the system namespace and this selector has no effect on it.",
					purpose: "Create new usage-detail",
					path: "/api/web/namespaces/{namespace}/usage_details",
				},
				{
					action: "list",
					resourceType: "current",
					operationId:
						"ves.io.schema.usage.plan.CustomAPI.GetCurrentPlan",
					summary: "GET current usage plan.",
					description: "Endpoint to GET current usage plan.",
					purpose: "List all currents",
					path: "/api/web/namespaces/system/usage_plans/current",
				},
				{
					action: "list",
					resourceType: "custom_list",
					operationId:
						"ves.io.schema.usage.plan.CustomAPI.ListUsagePlans",
					summary: "List Usage Plans.",
					description: "Endpoint to GET usage plans.",
					purpose: "List all custom-lists",
					path: "/api/web/namespaces/system/usage_plans/custom_list",
				},
			],
		},
	],
	[
		"blindfold",
		{
			domain: "blindfold",
			displayName: "Blindfold",
			description:
				"Define policy rules with label matching and combining algorithms. Set up transformers and matchers to control data safeguarding. Track access patterns through timestamped records with scroll queries and date groupings. Retrieve public keys for cryptographic operations and process policy information for decryption workflows.",
			descriptionShort:
				"Define policy rules with label matching and combining alg...",
			resourceTypes: [
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
			operations: [
				{
					action: "list",
					resourceType: "get_public_key",
					operationId:
						"ves.io.schema.secret_management.CustomAPI.GetPublicKey",
					summary: "Public Key.",
					description:
						"GetPublicKey API returns public part of the F5 Distributed Cloud secret management key that needs to be given to F5 Distributed Cloud secret management tool to do secret encryption.",
					purpose: "List all get-public-keys",
					path: "/api/secret_management/get_public_key",
				},
				{
					action: "get",
					resourceType: "get_policy_document",
					operationId:
						"ves.io.schema.secret_management.CustomAPI.GetPolicyDocument",
					summary: "Policy Document.",
					description:
						"GetPolicyDocument API returns secret policy document for the given policy that contains information about all the rules in the policy and policy_id. This document can be given to F5 Distributed Cloud secret management tool to do secret encryption.",
					purpose: "Retrieve specific get-policy-document",
					path: "/api/secret_management/namespaces/{namespace}/secret_policys/{name}/get_policy_document",
				},
				{
					action: "create",
					resourceType: "decrypt_secret",
					operationId:
						"ves.io.schema.voltshare.CustomAPI.DecryptSecret",
					summary: "DecryptSecret.",
					description:
						"DecryptSecret API takes blinded encrypted secret and policy and responds with blinded decrypted secret if user is allowed by the policy.",
					purpose: "Create new decrypt-secret",
					path: "/api/secret_management/namespaces/system/voltshare/decrypt_secret",
				},
				{
					action: "create",
					resourceType: "process_policy_information",
					operationId:
						"ves.io.schema.voltshare.CustomAPI.ProcessPolicyInformation",
					summary: "ProcessPolicyInformation.",
					description:
						"ProcessPolicyInformation API takes policy and secret name as input and returns a document containing .",
					purpose: "Create new process-policy-information",
					path: "/api/secret_management/namespaces/system/voltshare/process_policy_information",
				},
				{
					action: "create",
					resourceType: "access_count",
					operationId:
						"ves.io.schema.voltshare.MonitoringAPI.VoltShareAccessCountQuery",
					summary: "VoltShare Access Count Query.",
					description:
						"Request to GET number of VoltShare API calls aggregated across multiple dimensions like OPERATION, COUNTRY, RESULT, USER_TENANT.",
					purpose: "Create new access-count",
					path: "/api/secret_management/namespaces/{namespace}/voltshare/access_count",
				},
				{
					action: "create",
					resourceType: "audit_log",
					operationId:
						"ves.io.schema.voltshare.MonitoringAPI.AuditLogQuery",
					summary: "Audit Log Query.",
					description:
						"Request to GET voltshare audit logs that matches the criteria in request. If no match conditions are specified in the request, then the response contains all CRUD operations performed.",
					purpose: "Create new audit-log",
					path: "/api/secret_management/namespaces/{namespace}/voltshare/audit_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.voltshare.MonitoringAPI.AuditLogAggregationQuery",
					summary: "Audit Log Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the audit logs that matches the criteria in request.",
					purpose: "Create new aggregation",
					path: "/api/secret_management/namespaces/{namespace}/voltshare/audit_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.voltshare.MonitoringAPI.AuditLogScrollQuery",
					summary: "Audit Log Scroll Query.",
					description:
						"The response for audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/secret_management/namespaces/{namespace}/voltshare/audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0109_public_ves_io_schema_voltshare_ves_swagger_ves.io.schema.voltshare.MonitoringAPI.AuditLogScrollQuery",
					summary: "Audit Log Scroll Query.",
					description:
						"The response for audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/secret_management/namespaces/{namespace}/voltshare/audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "secret_management_accesss",
					operationId:
						"ves.io.schema.secret_management_access.API.Create",
					summary: "Create Secret Management Access.",
					description:
						"Create secret_management_access creates a new object in storage backend for metadata.namespace.",
					purpose: "Create new secret-management-access",
					path: "/api/config/namespaces/{metadata.namespace}/secret_management_accesss",
				},
				{
					action: "replace",
					resourceType: "secret_management_accesss",
					operationId:
						"ves.io.schema.secret_management_access.API.Replace",
					summary: "Replace Secret Management Access.",
					description:
						"Replace secret_management_access replaces an existing object in storage backend for metadata.namespace.",
					purpose: "Replace existing secret-management-access",
					path: "/api/config/namespaces/{metadata.namespace}/secret_management_accesss/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "secret_management_accesss",
					operationId:
						"ves.io.schema.secret_management_access.API.List",
					summary: "List Secret Management Access.",
					description:
						"List the set of secret_management_access in a namespace.",
					purpose: "List all secret-management-accesss",
					path: "/api/config/namespaces/{namespace}/secret_management_accesss",
				},
				{
					action: "get",
					resourceType: "secret_management_accesss",
					operationId:
						"ves.io.schema.secret_management_access.API.Get",
					summary: "GET Secret Management Access.",
					description:
						"GET secret_management_access reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific secret-management-access",
					path: "/api/config/namespaces/{namespace}/secret_management_accesss/{name}",
				},
				{
					action: "delete",
					resourceType: "secret_management_accesss",
					operationId:
						"ves.io.schema.secret_management_access.API.Delete",
					summary: "DELETE Secret Management Access.",
					description:
						"DELETE the specified secret_management_access.",
					purpose: "Delete secret-management-access",
					path: "/api/config/namespaces/{namespace}/secret_management_accesss/{name}",
				},
				{
					action: "create",
					resourceType: "secret_policy",
					operationId: "ves.io.schema.secret_policy.API.Create",
					summary: "Create Secret Policy.",
					description:
						"Create secret_policy creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new secret-policy",
					path: "/api/secret_management/namespaces/{metadata.namespace}/secret_policys",
				},
				{
					action: "replace",
					resourceType: "secret_policy",
					operationId: "ves.io.schema.secret_policy.API.Replace",
					summary: "Replace Secret Policy.",
					description:
						"Replace secret_policy replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing secret-policy",
					path: "/api/secret_management/namespaces/{metadata.namespace}/secret_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "list_policy",
					operationId:
						"ves.io.schema.secret_policy.CustomAPI.ListPolicy",
					summary: "List secret policy.",
					description: "Listpolicy CustomAPI.",
					purpose: "List all list-policys",
					path: "/api/secret_management/namespaces/{namespace}/secret_policy/list_policy/{policy_state}",
				},
				{
					action: "create",
					resourceType: "recover",
					operationId:
						"ves.io.schema.secret_policy.CustomAPI.RecoverPolicy",
					summary: "Recover secret policy with given policy name.",
					description: "Recoverpolicy CustomAPI.",
					purpose: "Create new recover",
					path: "/api/secret_management/namespaces/{namespace}/secret_policy/{name}/recover",
				},
				{
					action: "create",
					resourceType: "softdelete",
					operationId:
						"ves.io.schema.secret_policy.CustomAPI.DeletePolicy",
					summary: "DELETE secret policy with given policy name.",
					description: "Deletepolicy CustomAPI.",
					purpose: "Create new softdelete",
					path: "/api/secret_management/namespaces/{namespace}/secret_policy/{name}/softdelete",
				},
				{
					action: "list",
					resourceType: "secret_policy",
					operationId: "ves.io.schema.secret_policy.API.List",
					summary: "List Secret Policy.",
					description:
						"List the set of secret_policy in a namespace.",
					purpose: "List all secret-policys",
					path: "/api/secret_management/namespaces/{namespace}/secret_policys",
				},
				{
					action: "get",
					resourceType: "secret_policy",
					operationId: "ves.io.schema.secret_policy.API.Get",
					summary: "GET Secret Policy.",
					description:
						"GET secret_policy reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific secret-policy",
					path: "/api/secret_management/namespaces/{namespace}/secret_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "secret_policy",
					operationId: "ves.io.schema.secret_policy.API.Delete",
					summary: "DELETE Secret Policy.",
					description: "DELETE the specified secret_policy.",
					purpose: "Delete secret-policy",
					path: "/api/secret_management/namespaces/{namespace}/secret_policys/{name}",
				},
				{
					action: "create",
					resourceType: "secret_policy_rule",
					operationId: "ves.io.schema.secret_policy_rule.API.Create",
					summary: "Create Secret Policy Rule.",
					description:
						"Create secret_policy_rule creates a new object in storage backend for metadata.namespace.",
					purpose: "Create new secret-policy-rule",
					path: "/api/secret_management/namespaces/{metadata.namespace}/secret_policy_rules",
				},
				{
					action: "replace",
					resourceType: "secret_policy_rule",
					operationId: "ves.io.schema.secret_policy_rule.API.Replace",
					summary: "Replace Secret Policy Rule.",
					description:
						"Replace secret_policy_rule creates a new object in storage backend for metadata.namespace.",
					purpose: "Replace existing secret-policy-rule",
					path: "/api/secret_management/namespaces/{metadata.namespace}/secret_policy_rules/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "secret_policy_rule",
					operationId: "ves.io.schema.secret_policy_rule.API.List",
					summary: "List Secret Policy Rule.",
					description:
						"List the set of secret_policy_rule in a namespace.",
					purpose: "List all secret-policy-rules",
					path: "/api/secret_management/namespaces/{namespace}/secret_policy_rules",
				},
				{
					action: "get",
					resourceType: "secret_policy_rule",
					operationId: "ves.io.schema.secret_policy_rule.API.Get",
					summary: "GET Secret Policy Rule.",
					description:
						"GET secret_policy_rule reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific secret-policy-rule",
					path: "/api/secret_management/namespaces/{namespace}/secret_policy_rules/{name}",
				},
				{
					action: "delete",
					resourceType: "secret_policy_rule",
					operationId: "ves.io.schema.secret_policy_rule.API.Delete",
					summary: "DELETE Secret Policy Rule.",
					description: "DELETE the specified secret_policy_rule.",
					purpose: "Delete secret-policy-rule",
					path: "/api/secret_management/namespaces/{namespace}/secret_policy_rules/{name}",
				},
				{
					action: "create",
					resourceType: "voltshare_admin_policy",
					operationId:
						"ves.io.schema.voltshare_admin_policy.API.Create",
					summary: "Create VoltShare Admin Policy.",
					description:
						"Create voltshare_admin_policy creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new voltshare-admin-policy",
					path: "/api/secret_management/namespaces/{metadata.namespace}/voltshare_admin_policys",
				},
				{
					action: "replace",
					resourceType: "voltshare_admin_policy",
					operationId:
						"ves.io.schema.voltshare_admin_policy.API.Replace",
					summary: "Replace VoltShare Admin Policy.",
					description:
						"Replace voltshare_admin_policy replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing voltshare-admin-policy",
					path: "/api/secret_management/namespaces/{metadata.namespace}/voltshare_admin_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "voltshare_admin_policy",
					operationId:
						"ves.io.schema.voltshare_admin_policy.API.List",
					summary: "List VoltShare Admin Policy.",
					description:
						"List the set of voltshare_admin_policy in a namespace.",
					purpose: "List all voltshare-admin-policys",
					path: "/api/secret_management/namespaces/{namespace}/voltshare_admin_policys",
				},
				{
					action: "get",
					resourceType: "voltshare_admin_policy",
					operationId: "ves.io.schema.voltshare_admin_policy.API.Get",
					summary: "GET VoltShare Admin Policy.",
					description:
						"GET voltshare_admin_policy reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific voltshare-admin-policy",
					path: "/api/secret_management/namespaces/{namespace}/voltshare_admin_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "voltshare_admin_policy",
					operationId:
						"ves.io.schema.voltshare_admin_policy.API.Delete",
					summary: "DELETE VoltShare Admin Policy.",
					description: "DELETE the specified voltshare_admin_policy.",
					purpose: "Delete voltshare-admin-policy",
					path: "/api/secret_management/namespaces/{namespace}/voltshare_admin_policys/{name}",
				},
			],
		},
	],
	[
		"bot_and_threat_defense",
		{
			domain: "bot_and_threat_defense",
			displayName: "Bot And Threat Defense",
			description:
				"Deploy namespace-scoped protection using behavioral analysis and machine learning. Provision dedicated keys for system automation and real-time intelligence feeds. Coordinate detection across protected applications through centralized managers. Configure pre-authentication checks to identify suspicious patterns before they reach backends. Enable adaptive blocking decisions based on risk scoring and historical activity profiles.",
			descriptionShort:
				"Deploy namespace-scoped protection using behavioral analy...",
			resourceTypes: [
				"bot_defense_app_infrastructure",
				"preauth",
				"provision",
				"shape_bot_defense_instance",
				"tpm_api_key",
				"tpm_category",
				"tpm_manager",
			],
			operations: [
				{
					action: "create",
					resourceType: "bot_defense_app_infrastructure",
					operationId:
						"ves.io.schema.views.bot_defense_app_infrastructure.API.Create",
					summary: "Create Bot Defense App Infrastructure.",
					description:
						"Creates Bot Defense App Infrastructure in a given namespace.",
					purpose: "Create new bot-defense-app-infrastructure",
					path: "/api/config/namespaces/{metadata.namespace}/bot_defense_app_infrastructures",
				},
				{
					action: "replace",
					resourceType: "bot_defense_app_infrastructure",
					operationId:
						"ves.io.schema.views.bot_defense_app_infrastructure.API.Replace",
					summary: "Replace Bot Defense App Infrastructure.",
					description:
						"Replace a given Bot Defense App Infrastructure in a given namespace.",
					purpose: "Replace existing bot-defense-app-infrastructure",
					path: "/api/config/namespaces/{metadata.namespace}/bot_defense_app_infrastructures/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "bot_defense_app_infrastructure",
					operationId:
						"ves.io.schema.views.bot_defense_app_infrastructure.API.List",
					summary: "List Bot Defense App Infrastructure.",
					description:
						"List the set of bot_defense_app_infrastructure in a namespace.",
					purpose: "List all bot-defense-app-infrastructures",
					path: "/api/config/namespaces/{namespace}/bot_defense_app_infrastructures",
				},
				{
					action: "get",
					resourceType: "bot_defense_app_infrastructure",
					operationId:
						"ves.io.schema.views.bot_defense_app_infrastructure.API.Get",
					summary: "Bot Defense App Infrastructure.",
					description:
						"GET Bot Defense App Infrastructure from a given namespace.",
					purpose: "Retrieve specific bot-defense-app-infrastructure",
					path: "/api/config/namespaces/{namespace}/bot_defense_app_infrastructures/{name}",
				},
				{
					action: "delete",
					resourceType: "bot_defense_app_infrastructure",
					operationId:
						"ves.io.schema.views.bot_defense_app_infrastructure.API.Delete",
					summary: "DELETE Bot Defense App Infrastructure.",
					description:
						"DELETE the specified bot_defense_app_infrastructure.",
					purpose: "Delete bot-defense-app-infrastructure",
					path: "/api/config/namespaces/{namespace}/bot_defense_app_infrastructures/{name}",
				},
				{
					action: "list",
					resourceType: "shape_bot_defense_instance",
					operationId:
						"ves.io.schema.shape_bot_defense_instance.API.List",
					summary: "List Shape Bot Defense Instance.",
					description:
						"List the set of shape_bot_defense_instance in a namespace.",
					purpose: "List all shape-bot-defense-instances",
					path: "/api/config/namespaces/{namespace}/shape_bot_defense_instances",
				},
				{
					action: "get",
					resourceType: "shape_bot_defense_instance",
					operationId:
						"ves.io.schema.shape_bot_defense_instance.API.Get",
					summary: "GET Virtual Host.",
					description: "GET virtual host from a given namespace.",
					purpose: "Retrieve specific shape-bot-defense-instance",
					path: "/api/config/namespaces/{namespace}/shape_bot_defense_instances/{name}",
				},
				{
					action: "create",
					resourceType: "tpm_api_key",
					operationId: "ves.io.schema.tpm_api_key.API.Create",
					summary: "Create TPM API Key.",
					description:
						"APIKey object when successfully created returns actual APIKey bytes which is used by the users to call in to TPM provisioning API.",
					purpose: "Create new tpm-api-key",
					path: "/api/tpm/namespaces/{metadata.namespace}/tpm_api_keys",
				},
				{
					action: "replace",
					resourceType: "tpm_api_key",
					operationId: "ves.io.schema.tpm_api_key.API.Replace",
					summary: "Replace TPM API Key.",
					description:
						"Replace a APIKey object's revocation or enable/disable status. A revoked APIKey is not considered disabled. Certificates minted using disabled APIKeys are rejected during system bring-up/verification stage, whereas certificates minted using revoked APIKeys are only rejected if they were minted after revocation date.",
					purpose: "Replace existing tpm-api-key",
					path: "/api/tpm/namespaces/{metadata.namespace}/tpm_api_keys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "tpm_api_key",
					operationId: "ves.io.schema.tpm_api_key.API.List",
					summary: "List TPM API Key.",
					description: "List the set of tpm_api_key in a namespace.",
					purpose: "List all tpm-api-keys",
					path: "/api/tpm/namespaces/{namespace}/tpm_api_keys",
				},
				{
					action: "get",
					resourceType: "tpm_api_key",
					operationId: "ves.io.schema.tpm_api_key.API.Get",
					summary: "GET TPM API Key.",
					description: "Retrieve an APIKey object.",
					purpose: "Retrieve specific tpm-api-key",
					path: "/api/tpm/namespaces/{namespace}/tpm_api_keys/{name}",
				},
				{
					action: "create",
					resourceType: "tpm_category",
					operationId: "ves.io.schema.tpm_category.API.Create",
					summary: "Create TPM Category.",
					description:
						"Create a Category object, which is a grouping of APIKeys used for TPM provisioning.",
					purpose: "Create new tpm-category",
					path: "/api/tpm/namespaces/{metadata.namespace}/tpm_categorys",
				},
				{
					action: "replace",
					resourceType: "tpm_category",
					operationId: "ves.io.schema.tpm_category.API.Replace",
					summary: "Replace TPM Category.",
					description:
						"Replace a Category object's Allow list of TPM EK Certificates.",
					purpose: "Replace existing tpm-category",
					path: "/api/tpm/namespaces/{metadata.namespace}/tpm_categorys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "tpm_category",
					operationId: "ves.io.schema.tpm_category.API.List",
					summary: "List TPM Category.",
					description: "List the set of tpm_category in a namespace.",
					purpose: "List all tpm-categorys",
					path: "/api/tpm/namespaces/{namespace}/tpm_categorys",
				},
				{
					action: "get",
					resourceType: "tpm_category",
					operationId: "ves.io.schema.tpm_category.API.Get",
					summary: "GET TPM Category.",
					description: "Retrieve an APIKey object.",
					purpose: "Retrieve specific tpm-category",
					path: "/api/tpm/namespaces/{namespace}/tpm_categorys/{name}",
				},
				{
					action: "create",
					resourceType: "tpm_manager",
					operationId: "ves.io.schema.tpm_manager.API.Create",
					summary: "Create TPM Manager.",
					description: "Create a TPM Manager object.",
					purpose: "Create new tpm-manager",
					path: "/api/tpm/namespaces/{metadata.namespace}/tpm_managers",
				},
				{
					action: "list",
					resourceType: "tpm_manager",
					operationId: "ves.io.schema.tpm_manager.API.List",
					summary: "List TPM Manager.",
					description: "List the set of tpm_manager in a namespace.",
					purpose: "List all tpm-managers",
					path: "/api/tpm/namespaces/{namespace}/tpm_managers",
				},
				{
					action: "get",
					resourceType: "tpm_manager",
					operationId: "ves.io.schema.tpm_manager.API.Get",
					summary: "GET TPM Manager.",
					description: "Retrieve a TPM Manager object.",
					purpose: "Retrieve specific tpm-manager",
					path: "/api/tpm/namespaces/{namespace}/tpm_managers/{name}",
				},
				{
					action: "create",
					resourceType: "preauth",
					operationId:
						"ves.io.schema.tpm_provision.CustomAPI.Preauth",
					summary: "Preauth",
					description:
						"Pre-flight auth checks before calling the Provision API.",
					purpose: "Create new preauth",
					path: "/api/tpm/tpm/preauth",
				},
				{
					action: "create",
					resourceType: "provision",
					operationId:
						"ves.io.schema.tpm_provision.CustomAPI.Provision",
					summary: "Provision",
					description: "Provision CustomAPI.",
					purpose: "Create new provision",
					path: "/api/tpm/tpm/provision",
				},
			],
		},
	],
	[
		"cdn",
		{
			domain: "cdn",
			displayName: "Cdn",
			description:
				"Set up cache eligibility based on headers, cookies, and query parameters. Create expression-based rules with custom TTL settings and path matchers. Deploy load balancers that handle content distribution across origin pools. Monitor access logs and metrics, aggregate performance data, and execute cache purge operations when content updates require immediate invalidation.",
			descriptionShort:
				"Set up cache eligibility based on headers, cookies, and q...",
			resourceTypes: [
				"access_log",
				"aggregation",
				"cache-purge",
				"cdn_cache_rule",
				"cdn_loadbalancer",
				"dos_automitigation_rule",
				"get-service-operation-statu",
				"get_security_config",
				"list-service-operations-statu",
				"metric",
				"subscribe",
				"suggestion",
				"unsubscribe",
			],
			operations: [
				{
					action: "create",
					resourceType: "suggestion",
					operationId:
						"ves.io.schema.app_security.AppSecurityClientRuleAPI.GetSuggestedBlockClientRuleForCDN",
					summary: "Suggest block client rule.",
					description:
						"Suggest blocking SimpleClientSrcRule for a given IP/ASN.",
					purpose: "Create new suggestion",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers/{name}/block_client/suggestion",
				},
				{
					action: "create",
					resourceType: "suggestion",
					operationId:
						"ves.io.schema.app_security.AppSecurityClientRuleAPI.GetSuggestedDDoSMitigationRuleForCDN",
					summary: "Suggest CDN DDoS Mitigation rule.",
					description:
						"Suggest DDoSMitigatonRule to mitigate a given IP/ASN/Region/TLS.",
					purpose: "Create new suggestion",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers/{name}/ddos_mitigation/suggestion",
				},
				{
					action: "create",
					resourceType: "suggestion",
					operationId:
						"ves.io.schema.app_security.AppSecurityClientRuleAPI.GetSuggestedTrustClientRuleForCDN",
					summary: "Suggest trust client rule.",
					description:
						"Suggest SimpleClientSrcRule to trust a given IP/ASN.",
					purpose: "Create new suggestion",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers/{name}/trust_client/suggestion",
				},
				{
					action: "create",
					resourceType: "suggestion",
					operationId:
						"ves.io.schema.app_security.AppSecurityWafExclusionAPI.GetSuggestedWAFExclusionRuleForCDN",
					summary: "Suggest WAF Exclusion Rule.",
					description:
						"Suggest service policy rule to set up WAF exclusion for a given WAF security event.",
					purpose: "Create new suggestion",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers/{name}/waf_exclusion/suggestion",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomAPI.Subscribe",
					summary: "Subscribe to CDN Loadbalancer.",
					description: "Subscribe to CDN Loadbalancer.",
					purpose: "Create new subscribe",
					path: "/api/cdn/namespaces/system/lilac-cdn/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to CDN Loadbalancer.",
					description: "Unsubscribe to CDN Loadbalancer.",
					purpose: "Create new unsubscribe",
					path: "/api/cdn/namespaces/system/lilac-cdn/addon/unsubscribe",
				},
				{
					action: "create",
					resourceType: "cdn_loadbalancer",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.API.Create",
					summary: "Create CDN Loadbalancer.",
					description: "Shape of the CDN loadbalancer specification.",
					purpose: "Create new cdn-loadbalancer",
					path: "/api/config/namespaces/{metadata.namespace}/cdn_loadbalancers",
				},
				{
					action: "replace",
					resourceType: "cdn_loadbalancer",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.API.Replace",
					summary: "Replace CDN Loadbalancer.",
					description: "Shape of the CDN loadbalancer specification.",
					purpose: "Replace existing cdn-loadbalancer",
					path: "/api/config/namespaces/{metadata.namespace}/cdn_loadbalancers/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "access_log",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomAPI.CDNAccessLogs",
					summary: "GET CDN Access Logs.",
					description: "Retrieve CDN Load-Balancer Access logs.",
					purpose: "Create new access-log",
					path: "/api/cdn/namespaces/{namespace}/cdn_loadbalancer/access_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomAPI.CDNAccessLogAggregationQuery",
					summary: "CDN Access Log Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the CDN access logs that matches the query in request for a given namespace.",
					purpose: "Create new aggregation",
					path: "/api/cdn/namespaces/{namespace}/cdn_loadbalancer/access_logs/aggregation",
				},
				{
					action: "create",
					resourceType: "get-service-operation-statu",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomAPI.GetServiceOperation",
					summary: "GET Service Operation Status.",
					description:
						"GET status of an operation command for a given CDN Loadbalancer.",
					purpose: "Create new get-service-operation-statu",
					path: "/api/cdn/namespaces/{namespace}/cdn_loadbalancer/get-service-operation-status",
				},
				{
					action: "create",
					resourceType: "list-service-operations-statu",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomAPI.ListServiceOperations",
					summary: "List of CDN Operation Commands.",
					description:
						"List of service operations for a given CDN LB.",
					purpose: "Create new list-service-operations-statu",
					path: "/api/cdn/namespaces/{namespace}/cdn_loadbalancer/list-service-operations-status",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomAPI.CDNMetrics",
					summary: "GET CDN Metrics.",
					description:
						"Initial metrics request for CDN loadbalancers.",
					purpose: "Create new metric",
					path: "/api/cdn/namespaces/{namespace}/cdn_loadbalancer/metrics",
				},
				{
					action: "create",
					resourceType: "cache-purge",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomAPI.CDNCachePurge",
					summary: "Purge CDN Cache.",
					description: "Initiate Purge for Edge CDN Cache.",
					purpose: "Create new cache-purge",
					path: "/api/cdn/namespaces/{namespace}/cdn_loadbalancer/{name}/cache-purge",
				},
				{
					action: "list",
					resourceType: "cdn_loadbalancer",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.API.List",
					summary: "List CDN Loadbalancer.",
					description:
						"List the set of cdn_loadbalancer in a namespace.",
					purpose: "List all cdn-loadbalancers",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers",
				},
				{
					action: "create",
					resourceType: "get_security_config",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomCDNWAAPAPI.GetCDNSecurityConfig",
					summary: "GET Security Config for CDN Load Balancer.",
					description:
						"Fetch the corresponding Security Config for the given CDN load balancers.",
					purpose: "Create new get-security-config",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers/get_security_config",
				},
				{
					action: "get",
					resourceType: "cdn_loadbalancer",
					operationId: "ves.io.schema.views.cdn_loadbalancer.API.Get",
					summary: "GET CDN Loadbalancer.",
					description: "Shape of the CDN loadbalancer specification.",
					purpose: "Retrieve specific cdn-loadbalancer",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers/{name}",
				},
				{
					action: "delete",
					resourceType: "cdn_loadbalancer",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.API.Delete",
					summary: "DELETE CDN Loadbalancer.",
					description: "DELETE the specified cdn_loadbalancer.",
					purpose: "Delete cdn-loadbalancer",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers/{name}",
				},
				{
					action: "get",
					resourceType: "dos_automitigation_rule",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomCDNWAAPAPI.GetCDNDoSAutoMitigationRules",
					summary:
						"GET DoS Auto-Mitigation Rules for CDN Load Balancer.",
					description:
						"GET the corresponding DoS Auto-Mitigation Rules for the given CDN load balancer.",
					purpose: "Retrieve specific dos-automitigation-rule",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers/{name}/dos_automitigation_rules",
				},
				{
					action: "delete",
					resourceType: "dos_automitigation_rule",
					operationId:
						"ves.io.schema.views.cdn_loadbalancer.CustomCDNWAAPAPI.DeleteCDNDoSAutoMitigationRule",
					summary:
						"DELETE DoS Auto-Mitigation Rule for CDN Load Balancer.",
					description:
						"DELETE the corresponding DoS Auto-Mitigation Rule for the given CDN load balancer.",
					purpose: "Delete dos-automitigation-rule",
					path: "/api/config/namespaces/{namespace}/cdn_loadbalancers/{name}/dos_automitigation_rules/{dos_automitigation_rule_name}",
				},
				{
					action: "create",
					resourceType: "cdn_cache_rule",
					operationId: "ves.io.schema.cdn_cache_rule.API.Create",
					summary: "Create CDN cache rule.",
					description: "Shape of the CDN loadbalancer specification.",
					purpose: "Create new cdn-cache-rule",
					path: "/api/config/namespaces/{metadata.namespace}/cdn_cache_rules",
				},
				{
					action: "replace",
					resourceType: "cdn_cache_rule",
					operationId: "ves.io.schema.cdn_cache_rule.API.Replace",
					summary: "Replace CDN cache rule.",
					description: "Shape of the CDN loadbalancer specification.",
					purpose: "Replace existing cdn-cache-rule",
					path: "/api/config/namespaces/{metadata.namespace}/cdn_cache_rules/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "cdn_cache_rule",
					operationId: "ves.io.schema.cdn_cache_rule.API.List",
					summary: "List CDN cache rule.",
					description:
						"List the set of cdn_cache_rule in a namespace.",
					purpose: "List all cdn-cache-rules",
					path: "/api/config/namespaces/{namespace}/cdn_cache_rules",
				},
				{
					action: "get",
					resourceType: "cdn_cache_rule",
					operationId: "ves.io.schema.cdn_cache_rule.API.Get",
					summary: "GET CDN cache rule.",
					description: "Shape of the CDN loadbalancer specification.",
					purpose: "Retrieve specific cdn-cache-rule",
					path: "/api/config/namespaces/{namespace}/cdn_cache_rules/{name}",
				},
				{
					action: "delete",
					resourceType: "cdn_cache_rule",
					operationId: "ves.io.schema.cdn_cache_rule.API.Delete",
					summary: "DELETE CDN cache rule.",
					description: "DELETE the specified cdn_cache_rule.",
					purpose: "Delete cdn-cache-rule",
					path: "/api/config/namespaces/{namespace}/cdn_cache_rules/{name}",
				},
				{
					action: "create",
					resourceType: "get-service-operation-statu",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CDNCustomAPI.GetServiceOperationHTTPLBCacheEnabled",
					summary:
						"GET Service Operation Status for HTTPLB when Caching Enabled.",
					description:
						"GET status of an operation command for a given HTTP LB when caching enabled.",
					purpose: "Create new get-service-operation-statu",
					path: "/api/cdn/namespaces/{namespace}/http_loadbalancer/get-service-operation-status",
				},
				{
					action: "create",
					resourceType: "list-service-operations-statu",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CDNCustomAPI.ListServiceOperationsHTTPLBCacheEnabled",
					summary:
						"List of HTTPLB Operation Commands when Caching Enabled.",
					description:
						"List of service operations for a given HTTP LB when Caching Enabled.",
					purpose: "Create new list-service-operations-statu",
					path: "/api/cdn/namespaces/{namespace}/http_loadbalancer/list-service-operations-status",
				},
				{
					action: "create",
					resourceType: "cache-purge",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CDNCustomAPI.CDNCachePurgeHTTPLBCacheEnabled",
					summary: "Purge the LB Cache.",
					description: "Initiate Purge on the LB Cache.",
					purpose: "Create new cache-purge",
					path: "/api/cdn/namespaces/{namespace}/http_loadbalancer/{name}/cache-purge",
				},
			],
		},
	],
	[
		"ce_management",
		{
			domain: "ce_management",
			displayName: "Ce Management",
			description:
				"Define network connectivity parameters including address allocation ranges, dual-stack protocol support, and isolated administrative ports for out-of-band access. Group physical locations under common policy templates for streamlined oversight. Onboard new deployments through secure credential workflows with expiration policies. Execute controlled software transitions featuring pre-flight validation, rollback capabilities, and progress tracking to maintain service continuity.",
			descriptionShort:
				"Define network connectivity parameters including address ...",
			resourceTypes: [
				"approve",
				"fleet",
				"get-image-download-url",
				"get-registrations-by-token",
				"listregistrationsbystate",
				"network_interface",
				"pre_upgrade_check",
				"registerBootstrap",
				"registration",
				"registrations_by_site",
				"requestConfig",
				"setting",
				"suggest-value",
				"upgradable_sw_version",
				"upgrade_statu",
				"usb_policy",
			],
			operations: [
				{
					action: "create",
					resourceType: "fleet",
					operationId: "ves.io.schema.fleet.API.Create",
					summary: "Create Fleet.",
					description:
						"Create fleet will create a fleet object in 'system' namespace of the user.",
					purpose: "Create new fleet",
					path: "/api/config/namespaces/{metadata.namespace}/fleets",
				},
				{
					action: "replace",
					resourceType: "fleet",
					operationId: "ves.io.schema.fleet.API.Replace",
					summary: "Replace Fleet.",
					description:
						"Replace fleet will replace the contents of given fleet object.",
					purpose: "Replace existing fleet",
					path: "/api/config/namespaces/{metadata.namespace}/fleets/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "fleet",
					operationId: "ves.io.schema.fleet.API.List",
					summary: "List Fleet.",
					description: "List the set of fleet in a namespace.",
					purpose: "List all fleets",
					path: "/api/config/namespaces/{namespace}/fleets",
				},
				{
					action: "get",
					resourceType: "fleet",
					operationId: "ves.io.schema.fleet.API.Get",
					summary: "GET Fleet",
					description:
						"GET fleet will GET fleet object from system namespace.",
					purpose: "Retrieve specific fleet",
					path: "/api/config/namespaces/{namespace}/fleets/{name}",
				},
				{
					action: "delete",
					resourceType: "fleet",
					operationId: "ves.io.schema.fleet.API.Delete",
					summary: "DELETE Fleet.",
					description: "DELETE the specified fleet.",
					purpose: "Delete fleet",
					path: "/api/config/namespaces/{namespace}/fleets/{name}",
				},
				{
					action: "list",
					resourceType: "setting",
					operationId:
						"ves.io.schema.module_management.ModuleManagementAPI.GetModuleManagementSettings",
					summary: "Module Management Settings.",
					description: "Receive the module settings.",
					purpose: "List all settings",
					path: "/api/config/namespaces/{namespace}/module_management/settings",
				},
				{
					action: "create",
					resourceType: "network_interface",
					operationId: "ves.io.schema.network_interface.API.Create",
					summary: "Create Network Interface.",
					description:
						"Network interface represents configuration of a network device. It is created by users in system namespace.",
					purpose: "Create new network-interface",
					path: "/api/config/namespaces/{metadata.namespace}/network_interfaces",
				},
				{
					action: "replace",
					resourceType: "network_interface",
					operationId: "ves.io.schema.network_interface.API.Replace",
					summary: "Replace Network Interface.",
					description:
						"Network interface represents configuration of a network device. Replace network interface will replace the contents of given network interface object.",
					purpose: "Replace existing network-interface",
					path: "/api/config/namespaces/{metadata.namespace}/network_interfaces/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "network_interface",
					operationId: "ves.io.schema.network_interface.API.List",
					summary: "List Network Interface.",
					description:
						"List the set of network_interface in a namespace.",
					purpose: "List all network-interfaces",
					path: "/api/config/namespaces/{namespace}/network_interfaces",
				},
				{
					action: "get",
					resourceType: "network_interface",
					operationId: "ves.io.schema.network_interface.API.Get",
					summary: "GET Network Interface.",
					description: "GET network interface from system namespace.",
					purpose: "Retrieve specific network-interface",
					path: "/api/config/namespaces/{namespace}/network_interfaces/{name}",
				},
				{
					action: "delete",
					resourceType: "network_interface",
					operationId: "ves.io.schema.network_interface.API.Delete",
					summary: "DELETE Network Interface.",
					description: "DELETE the specified network_interface.",
					purpose: "Delete network-interface",
					path: "/api/config/namespaces/{namespace}/network_interfaces/{name}",
				},
				{
					action: "create",
					resourceType: "get-image-download-url",
					operationId:
						"ves.io.schema.registration.CustomAPI.GetImageDownloadUrl",
					summary: "GET Image Download URL.",
					description:
						"Returns image download URL for each provider.",
					purpose: "Create new get-image-download-url",
					path: "/api/register/namespaces/system/get-image-download-url",
				},
				{
					action: "create",
					resourceType: "get-registrations-by-token",
					operationId:
						"ves.io.schema.registration.CustomAPI.GetRegistrationsBySiteToken",
					summary: "GET Registration UID by Site Token.",
					description:
						"Returns list of registration uids that are using particular site token.",
					purpose: "Create new get-registrations-by-token",
					path: "/api/register/namespaces/system/get-registrations-by-token",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.registration.CustomAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"Returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/register/namespaces/system/suggest-values",
				},
				{
					action: "create",
					resourceType: "registration",
					operationId: "ves.io.schema.registration.API.Create",
					summary: "Create Registration.",
					description:
						"VPM creates registration using this message, never used by users.",
					purpose: "Create new registration",
					path: "/api/register/namespaces/{metadata.namespace}/registrations",
				},
				{
					action: "replace",
					resourceType: "registration",
					operationId: "ves.io.schema.registration.API.Replace",
					summary: "Replace Registration.",
					description: "NO fields are allowed to be replaced.",
					purpose: "Replace existing registration",
					path: "/api/register/namespaces/{metadata.namespace}/registrations/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "listregistrationsbystate",
					operationId:
						"ves.io.schema.registration.CustomAPI.ListRegistrationsByState",
					summary: "List Registrations By State.",
					description:
						"API endpoint for returning Registrations by status, e.g APPROVED, NEW, or RETIRED.",
					purpose: "Create new listregistrationsbystate",
					path: "/api/register/namespaces/{namespace}/listregistrationsbystate",
				},
				{
					action: "create",
					resourceType: "approve",
					operationId:
						"ves.io.schema.registration.CustomAPI.RegistrationApprove",
					summary: "Registration Approve.",
					description:
						"RegistrationApprove approved pending registration and it can also decommission by changing state to RETIRED.",
					purpose: "Create new approve",
					path: "/api/register/namespaces/{namespace}/registration/{name}/approve",
				},
				{
					action: "list",
					resourceType: "registration",
					operationId: "ves.io.schema.registration.CustomAPI.List",
					summary: "List Registration.",
					description: "List the set of registration in a namespace.",
					purpose: "List all registrations",
					path: "/api/register/namespaces/{namespace}/registrations",
				},
				{
					action: "get",
					resourceType: "registration",
					operationId: "ves.io.schema.registration.CustomAPI.Get",
					summary: "GET Registration.",
					description: "GET registration specification.",
					purpose: "Retrieve specific registration",
					path: "/api/register/namespaces/{namespace}/registrations/{name}",
				},
				{
					action: "delete",
					resourceType: "registration",
					operationId: "ves.io.schema.registration.CustomAPI.Delete",
					summary: "DELETE Registration.",
					description: "DELETE the specified registration.",
					purpose: "Delete registration",
					path: "/api/register/namespaces/{namespace}/registrations/{name}",
				},
				{
					action: "list",
					resourceType: "registrations_by_site",
					operationId:
						"ves.io.schema.registration.CustomAPI.ListRegistrationsBySite",
					summary: "List registrations by site.",
					description: "List all registration in site.",
					purpose: "List all registrations-by-sites",
					path: "/api/register/namespaces/{namespace}/registrations_by_site/{site_name}",
				},
				{
					action: "create",
					resourceType: "registerBootstrap",
					operationId:
						"ves.io.schema.registration.CustomAPI.RegistrationCreate",
					summary: "Registration Create.",
					description:
						"Registration request to create registration is sent by the node on first boot. User never creates registration on her own.",
					purpose: "Create new registerBootstrap",
					path: "/api/register/registerBootstrap",
				},
				{
					action: "create",
					resourceType: "requestConfig",
					operationId:
						"ves.io.schema.registration.CustomAPI.RegistrationConfig",
					summary: "Registration Config.",
					description:
						"API endpoint for returning configuration for admitted registrations. It will fail with known error for non-ADMITTED registration.",
					purpose: "Create new requestConfig",
					path: "/api/register/requestConfig",
				},
				{
					action: "create",
					resourceType: "usb_policy",
					operationId: "ves.io.schema.usb_policy.API.Create",
					summary: "Create USB policy.",
					description: "Creates a new USB policy object.",
					purpose: "Create new usb-policy",
					path: "/api/config/namespaces/{metadata.namespace}/usb_policys",
				},
				{
					action: "replace",
					resourceType: "usb_policy",
					operationId: "ves.io.schema.usb_policy.API.Replace",
					summary: "Replace USB policy.",
					description:
						"Replaces the content of an USB policy object.",
					purpose: "Replace existing usb-policy",
					path: "/api/config/namespaces/{metadata.namespace}/usb_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "usb_policy",
					operationId: "ves.io.schema.usb_policy.API.List",
					summary: "List USB policy.",
					description: "List the set of usb_policy in a namespace.",
					purpose: "List all usb-policys",
					path: "/api/config/namespaces/{namespace}/usb_policys",
				},
				{
					action: "get",
					resourceType: "usb_policy",
					operationId: "ves.io.schema.usb_policy.API.Get",
					summary: "GET USB policy.",
					description: "GET the USB policy object.",
					purpose: "Retrieve specific usb-policy",
					path: "/api/config/namespaces/{namespace}/usb_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "usb_policy",
					operationId: "ves.io.schema.usb_policy.API.Delete",
					summary: "DELETE USB policy.",
					description: "DELETE the specified usb_policy.",
					purpose: "Delete usb-policy",
					path: "/api/config/namespaces/{namespace}/usb_policys/{name}",
				},
				{
					action: "get",
					resourceType: "pre_upgrade_check",
					operationId:
						"ves.io.schema.upgrade_status.UpgradeStatusCustomApi.PreUpgradeCheck",
					summary: "Pre upgrade check.",
					description: "API to check if site is ready for upgrade.",
					purpose: "Retrieve specific pre-upgrade-check",
					path: "/api/maurice/namespaces/{namespace}/sites/{name}/pre_upgrade_check",
				},
				{
					action: "get",
					resourceType: "upgrade_statu",
					operationId:
						"ves.io.schema.upgrade_status.UpgradeStatusCustomApi.GetUpgradeStatus",
					summary: "GET Upgrade Status.",
					description: "API to GET upgrade status of a site.",
					purpose: "Retrieve specific upgrade-statu",
					path: "/api/maurice/namespaces/{namespace}/sites/{name}/upgrade_status",
				},
				{
					action: "list",
					resourceType: "upgradable_sw_version",
					operationId:
						"ves.io.schema.upgrade_status.UpgradeStatusCustomApi.GetUpgradableSWVersions",
					summary: "GET Upgradable SW Versions.",
					description:
						"API to GET list of sw versions that can be upgraded to.",
					purpose: "List all upgradable-sw-versions",
					path: "/api/maurice/upgradable_sw_versions",
				},
			],
		},
	],
	[
		"certificates",
		{
			domain: "certificates",
			displayName: "Certificates",
			description:
				"Create PKI artifacts organizing cryptographic identity materials by namespace for multi-tenant isolation. Deploy keypair bundles with issuer hierarchies for TLS termination. Establish verification anchor collections governing which external parties can authenticate. Maintain deny-lists blocking compromised identities from initiating sessions. Organize resources within independent security boundaries supporting granular access control.",
			descriptionShort:
				"Create PKI artifacts organizing cryptographic identity ma...",
			resourceTypes: [
				"certificate",
				"certificate_chain",
				"crl",
				"trusted_ca_list",
			],
			operations: [
				{
					action: "create",
					resourceType: "crl",
					operationId: "ves.io.schema.crl.API.Create",
					summary: "Create CRL.",
					description: "API to create CRL object.",
					purpose: "Create new crl",
					path: "/api/config/namespaces/{metadata.namespace}/crls",
				},
				{
					action: "replace",
					resourceType: "crl",
					operationId: "ves.io.schema.crl.API.Replace",
					summary: "Replace CRL.",
					description: "API to replace CRL object.",
					purpose: "Replace existing crl",
					path: "/api/config/namespaces/{metadata.namespace}/crls/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "crl",
					operationId: "ves.io.schema.crl.API.List",
					summary: "List CRL",
					description: "List the set of CRL in a namespace.",
					purpose: "List all crls",
					path: "/api/config/namespaces/{namespace}/crls",
				},
				{
					action: "get",
					resourceType: "crl",
					operationId: "ves.io.schema.crl.API.Get",
					summary: "GET CRL",
					description: "API to GET CRL.",
					purpose: "Retrieve specific crl",
					path: "/api/config/namespaces/{namespace}/crls/{name}",
				},
				{
					action: "delete",
					resourceType: "crl",
					operationId: "ves.io.schema.crl.API.Delete",
					summary: "DELETE CRL.",
					description: "DELETE the specified CRL.",
					purpose: "Delete crl",
					path: "/api/config/namespaces/{namespace}/crls/{name}",
				},
				{
					action: "create",
					resourceType: "certificate",
					operationId: "ves.io.schema.certificate.API.Create",
					summary: "Create Certificate.",
					description: "Shape of the Certificate specification.",
					purpose: "Create new certificate",
					path: "/api/config/namespaces/{metadata.namespace}/certificates",
				},
				{
					action: "replace",
					resourceType: "certificate",
					operationId: "ves.io.schema.certificate.API.Replace",
					summary: "Replace Certificate.",
					description: "Shape of the Certificate specification.",
					purpose: "Replace existing certificate",
					path: "/api/config/namespaces/{metadata.namespace}/certificates/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "certificate",
					operationId: "ves.io.schema.certificate.API.List",
					summary: "List Certificate.",
					description: "List the set of certificate in a namespace.",
					purpose: "List all certificates",
					path: "/api/config/namespaces/{namespace}/certificates",
				},
				{
					action: "get",
					resourceType: "certificate",
					operationId: "ves.io.schema.certificate.API.Get",
					summary: "GET Certificate.",
					description: "Shape of the Certificate specification.",
					purpose: "Retrieve specific certificate",
					path: "/api/config/namespaces/{namespace}/certificates/{name}",
				},
				{
					action: "delete",
					resourceType: "certificate",
					operationId: "ves.io.schema.certificate.API.Delete",
					summary: "DELETE Certificate.",
					description: "DELETE the specified certificate.",
					purpose: "Delete certificate",
					path: "/api/config/namespaces/{namespace}/certificates/{name}",
				},
				{
					action: "create",
					resourceType: "certificate_chain",
					operationId: "ves.io.schema.certificate_chain.API.Create",
					summary: "Create Certificate Chain.",
					description:
						"Shape of the Certificate Chain specification.",
					purpose: "Create new certificate-chain",
					path: "/api/config/namespaces/{metadata.namespace}/certificate_chains",
				},
				{
					action: "replace",
					resourceType: "certificate_chain",
					operationId: "ves.io.schema.certificate_chain.API.Replace",
					summary: "Replace Certificate Chain.",
					description:
						"Shape of the Certificate Chain specification.",
					purpose: "Replace existing certificate-chain",
					path: "/api/config/namespaces/{metadata.namespace}/certificate_chains/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "certificate_chain",
					operationId: "ves.io.schema.certificate_chain.API.List",
					summary: "List Certificate Chain.",
					description:
						"List the set of certificate_chain in a namespace.",
					purpose: "List all certificate-chains",
					path: "/api/config/namespaces/{namespace}/certificate_chains",
				},
				{
					action: "get",
					resourceType: "certificate_chain",
					operationId: "ves.io.schema.certificate_chain.API.Get",
					summary: "GET Certificate Chain.",
					description:
						"Shape of the Certificate Chain specification.",
					purpose: "Retrieve specific certificate-chain",
					path: "/api/config/namespaces/{namespace}/certificate_chains/{name}",
				},
				{
					action: "delete",
					resourceType: "certificate_chain",
					operationId: "ves.io.schema.certificate_chain.API.Delete",
					summary: "DELETE Certificate Chain.",
					description: "DELETE the specified certificate_chain.",
					purpose: "Delete certificate-chain",
					path: "/api/config/namespaces/{namespace}/certificate_chains/{name}",
				},
				{
					action: "create",
					resourceType: "trusted_ca_list",
					operationId: "ves.io.schema.trusted_ca_list.API.Create",
					summary: "Create Root CA Certificate.",
					description:
						"Shape of the Root CA Certificate specification.",
					purpose: "Create new trusted-ca-list",
					path: "/api/config/namespaces/{metadata.namespace}/trusted_ca_lists",
				},
				{
					action: "replace",
					resourceType: "trusted_ca_list",
					operationId: "ves.io.schema.trusted_ca_list.API.Replace",
					summary: "Replace Root CA Certificate.",
					description:
						"Shape of the Root CA Certificate specification.",
					purpose: "Replace existing trusted-ca-list",
					path: "/api/config/namespaces/{metadata.namespace}/trusted_ca_lists/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "trusted_ca_list",
					operationId: "ves.io.schema.trusted_ca_list.API.List",
					summary: "List Root CA Certificate.",
					description:
						"List the set of trusted_ca_list in a namespace.",
					purpose: "List all trusted-ca-lists",
					path: "/api/config/namespaces/{namespace}/trusted_ca_lists",
				},
				{
					action: "get",
					resourceType: "trusted_ca_list",
					operationId: "ves.io.schema.trusted_ca_list.API.Get",
					summary: "GET Root CA Certificate.",
					description:
						"Shape of the Root CA Certificate specification.",
					purpose: "Retrieve specific trusted-ca-list",
					path: "/api/config/namespaces/{namespace}/trusted_ca_lists/{name}",
				},
				{
					action: "delete",
					resourceType: "trusted_ca_list",
					operationId: "ves.io.schema.trusted_ca_list.API.Delete",
					summary: "DELETE Root CA Certificate.",
					description: "DELETE the specified trusted_ca_list.",
					purpose: "Delete trusted-ca-list",
					path: "/api/config/namespaces/{namespace}/trusted_ca_lists/{name}",
				},
			],
		},
	],
	[
		"cloud_infrastructure",
		{
			domain: "cloud_infrastructure",
			displayName: "Cloud Infrastructure",
			description:
				"Establish connections to AWS, Azure, and GCP environments with secure authentication and network discovery. Define gateway links, edge site peering, and elastic provisioning workflows. Monitor segment performance and connection health across geographic regions. Create automated VPC attachment policies with intelligent path selection between customer locations and cloud workloads.",
			descriptionShort:
				"Establish connections to AWS, Azure, and GCP environments...",
			resourceTypes: [
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
				"metric",
				"reapply_config",
				"segment_metric",
			],
			operations: [
				{
					action: "list",
					resourceType: "certified_hardware",
					operationId: "ves.io.schema.certified_hardware.API.List",
					summary: "List Certified Hardware.",
					description:
						"List the set of certified_hardware in a namespace.",
					purpose: "List all certified-hardwares",
					path: "/api/config/namespaces/{namespace}/certified_hardwares",
				},
				{
					action: "get",
					resourceType: "certified_hardware",
					operationId: "ves.io.schema.certified_hardware.API.Get",
					summary: "GET Certified Hardware.",
					description: "GET Certified Hardware object.",
					purpose: "Retrieve specific certified-hardware",
					path: "/api/config/namespaces/{namespace}/certified_hardwares/{name}",
				},
				{
					action: "create",
					resourceType: "cloud_connect_reapply_vpc_attachment",
					operationId:
						"ves.io.schema.cloud_connect.CloudDataCustomAPI.ReApplyVPCAttachment",
					summary: "ReApplyVPCAttachment.",
					description:
						"RE-applies VPC attachment in a cloud connect config.",
					purpose: "Create new cloud-connect-reapply-vpc-attachment",
					path: "/api/sync-cloud-data/namespaces/system/cloud_connect_reapply_vpc_attachment",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.cloud_connect.CustomAPI.ListMetrics",
					summary: "All Cloud Connect Metrics.",
					description:
						"Cloud Connect APIs are used to GET the data for cloud connect.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/system/cloud_connects/metrics",
				},
				{
					action: "create",
					resourceType: "segment_metric",
					operationId:
						"ves.io.schema.cloud_connect.CustomAPI.ListSegmentMetrics",
					summary: "All Cloud Connect Segment Metrics.",
					description:
						"Cloud Connect APIs are used to GET the segment data for cloud connect.",
					purpose: "Create new segment-metric",
					path: "/api/data/namespaces/system/cloud_connects/segment_metrics",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.cloud_connect.CustomAPI.GetMetrics",
					summary: "Cloud Connect Metrics.",
					description:
						"Cloud Connect Metrics queries metrics for a specified cloud connect.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/system/cloud_connects/{name}/metrics",
				},
				{
					action: "create",
					resourceType: "discover_vpc",
					operationId:
						"ves.io.schema.cloud_connect.CloudDataCustomAPI.DiscoverVPC",
					summary: "Cloud Connect VPC Discovery.",
					description:
						"Returns all the vpcs for a specified cloud provider, region and cred. For AWS it returns all the vpcs which are not attached to any transit gateway in that region.",
					purpose: "Create new discover-vpc",
					path: "/api/sync-cloud-data/namespaces/system/discover_vpc",
				},
				{
					action: "create",
					resourceType: "edge_credential",
					operationId:
						"ves.io.schema.cloud_connect.ConfigCustomAPI.EdgeCredentials",
					summary: "Cloud Credential.",
					description:
						"Returns the cloud credential for the matching edge type.",
					purpose: "Create new edge-credential",
					path: "/api/config/namespaces/system/edge_credentials",
				},
				{
					action: "list",
					resourceType: "edge_list",
					operationId:
						"ves.io.schema.cloud_connect.ConfigCustomAPI.EdgeList",
					summary: "Edge List",
					description:
						"Returns the online edge sites (Both Customer Edge and Cloud Edge)",
					purpose: "List all edge-lists",
					path: "/api/config/namespaces/system/edge_list",
				},
				{
					action: "create",
					resourceType: "cloud_connect",
					operationId:
						"ves.io.schema.cloud_connect.CustomAPI.TopCloudConnect",
					summary: "Top Cloud Connnect.",
					description:
						"Request to GET top cloud connect from the AWS Cloudwatch metrics.",
					purpose: "Create new cloud-connect",
					path: "/api/data/namespaces/system/top/cloud_connects",
				},
				{
					action: "create",
					resourceType: "cloud_connect",
					operationId: "ves.io.schema.cloud_connect.API.Create",
					summary: "Create Cloud Connect.",
					description: "Shape of the Cloud Connect specification.",
					purpose: "Create new cloud-connect",
					path: "/api/config/namespaces/{metadata.namespace}/cloud_connects",
				},
				{
					action: "replace",
					resourceType: "cloud_connect",
					operationId: "ves.io.schema.cloud_connect.API.Replace",
					summary: "Replace Cloud Connect.",
					description: "Shape of the Cloud Connect specification.",
					purpose: "Replace existing cloud-connect",
					path: "/api/config/namespaces/{metadata.namespace}/cloud_connects/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "cloud_connect",
					operationId: "ves.io.schema.cloud_connect.API.List",
					summary: "List Cloud Connect.",
					description:
						"List the set of cloud_connect in a namespace.",
					purpose: "List all cloud-connects",
					path: "/api/config/namespaces/{namespace}/cloud_connects",
				},
				{
					action: "get",
					resourceType: "cloud_connect",
					operationId: "ves.io.schema.cloud_connect.API.Get",
					summary: "GET Cloud Connect.",
					description: "Shape of the Cloud Connect specification.",
					purpose: "Retrieve specific cloud-connect",
					path: "/api/config/namespaces/{namespace}/cloud_connects/{name}",
				},
				{
					action: "delete",
					resourceType: "cloud_connect",
					operationId: "ves.io.schema.cloud_connect.API.Delete",
					summary: "DELETE Cloud Connect.",
					description: "DELETE the specified cloud_connect.",
					purpose: "Delete cloud-connect",
					path: "/api/config/namespaces/{namespace}/cloud_connects/{name}",
				},
				{
					action: "create",
					resourceType: "cloud_credentialss",
					operationId: "ves.io.schema.cloud_credentials.API.Create",
					summary: "Create Cloud Credentials.",
					description: "API to create cloud_credentials object.",
					purpose: "Create new cloud-credentials",
					path: "/api/config/namespaces/{metadata.namespace}/cloud_credentialss",
				},
				{
					action: "replace",
					resourceType: "cloud_credentialss",
					operationId: "ves.io.schema.cloud_credentials.API.Replace",
					summary: "Replace Cloud Credentials.",
					description: "API to replace cloud_credentials object.",
					purpose: "Replace existing cloud-credentials",
					path: "/api/config/namespaces/{metadata.namespace}/cloud_credentialss/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "cloud_credentialss",
					operationId: "ves.io.schema.cloud_credentials.API.List",
					summary: "List Cloud Credentials.",
					description:
						"List the set of cloud_credentials in a namespace.",
					purpose: "List all cloud-credentialss",
					path: "/api/config/namespaces/{namespace}/cloud_credentialss",
				},
				{
					action: "get",
					resourceType: "cloud_credentialss",
					operationId: "ves.io.schema.cloud_credentials.API.Get",
					summary: "GET Cloud Credentials.",
					description: "API to GET cloud_credentials object.",
					purpose: "Retrieve specific cloud-credentials",
					path: "/api/config/namespaces/{namespace}/cloud_credentialss/{name}",
				},
				{
					action: "delete",
					resourceType: "cloud_credentialss",
					operationId: "ves.io.schema.cloud_credentials.API.Delete",
					summary: "DELETE Cloud Credentials.",
					description: "DELETE the specified cloud_credentials.",
					purpose: "Delete cloud-credentials",
					path: "/api/config/namespaces/{namespace}/cloud_credentialss/{name}",
				},
				{
					action: "create",
					resourceType: "force-delete",
					operationId:
						"ves.io.schema.cloud_elastic_ip.CustomAPI.ForceDeleteCloudElasticIP",
					summary: "Force DELETE Cloud Elastic IP.",
					description: "Force DELETE Cloud Elastic IP.",
					purpose: "Create new force-delete",
					path: "/api/config/namespaces/system/cloud_elastic_ip/{name}/force-delete",
				},
				{
					action: "create",
					resourceType: "cloud_elastic_ip",
					operationId: "ves.io.schema.cloud_elastic_ip.API.Create",
					summary: "Create Cloud Elastic IP.",
					description:
						"Create Cloud Elastic IP creates Cloud Elastic IP object Object is attached to a site.",
					purpose: "Create new cloud-elastic-ip",
					path: "/api/config/namespaces/{metadata.namespace}/cloud_elastic_ips",
				},
				{
					action: "replace",
					resourceType: "cloud_elastic_ip",
					operationId: "ves.io.schema.cloud_elastic_ip.API.Replace",
					summary: "Replace Cloud Elastic IP.",
					description:
						"Replace cloud elastic IP will replace cloud elastic IP object with new object.",
					purpose: "Replace existing cloud-elastic-ip",
					path: "/api/config/namespaces/{metadata.namespace}/cloud_elastic_ips/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "cloud_elastic_ip",
					operationId: "ves.io.schema.cloud_elastic_ip.API.List",
					summary: "List Cloud Elastic IP.",
					description:
						"List the set of cloud_elastic_ip in a namespace.",
					purpose: "List all cloud-elastic-ips",
					path: "/api/config/namespaces/{namespace}/cloud_elastic_ips",
				},
				{
					action: "get",
					resourceType: "cloud_elastic_ip",
					operationId: "ves.io.schema.cloud_elastic_ip.API.Get",
					summary: "GET Cloud Elastic IP.",
					description:
						"GET cloud elastic IP will GET the object from the storage backend for namespace metadata.namespace.",
					purpose: "Retrieve specific cloud-elastic-ip",
					path: "/api/config/namespaces/{namespace}/cloud_elastic_ips/{name}",
				},
				{
					action: "delete",
					resourceType: "cloud_elastic_ip",
					operationId: "ves.io.schema.cloud_elastic_ip.API.Delete",
					summary: "DELETE Cloud Elastic IP.",
					description: "DELETE the specified cloud_elastic_ip.",
					purpose: "Delete cloud-elastic-ip",
					path: "/api/config/namespaces/{namespace}/cloud_elastic_ips/{name}",
				},
				{
					action: "replace",
					resourceType: "cloud_region",
					operationId: "ves.io.schema.cloud_region.API.Replace",
					summary: "Replace Cloud Region.",
					description: "Shape of the cloud RE specification.",
					purpose: "Replace existing cloud-region",
					path: "/api/config/namespaces/{metadata.namespace}/cloud_regions/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "cloud_region",
					operationId: "ves.io.schema.cloud_region.API.List",
					summary: "List Cloud Region.",
					description: "List the set of cloud_region in a namespace.",
					purpose: "List all cloud-regions",
					path: "/api/config/namespaces/{namespace}/cloud_regions",
				},
				{
					action: "get",
					resourceType: "cloud_region",
					operationId: "ves.io.schema.cloud_region.API.Get",
					summary: "GET Cloud Region.",
					description: "Shape of the cloud RE specification.",
					purpose: "Retrieve specific cloud-region",
					path: "/api/config/namespaces/{namespace}/cloud_regions/{name}",
				},
				{
					action: "create",
					resourceType: "reapply_config",
					operationId:
						"ves.io.schema.cloud_link.CustomDataAPI.ReapplyConfig",
					summary: "CloudLink",
					description: "Reapply CloudLink Config.",
					purpose: "Create new reapply-config",
					path: "/api/config/namespaces/system/cloud_links/{name}/reapply_config",
				},
				{
					action: "create",
					resourceType: "cloud_link",
					operationId: "ves.io.schema.cloud_link.API.Create",
					summary: "Create CloudLink.",
					description:
						"Creates a new CloudLink with configured parameters.",
					purpose: "Create new cloud-link",
					path: "/api/config/namespaces/{metadata.namespace}/cloud_links",
				},
				{
					action: "replace",
					resourceType: "cloud_link",
					operationId: "ves.io.schema.cloud_link.API.Replace",
					summary: "Replace CloudLink.",
					description:
						"Replaces configured CloudLink with new set of parameters.",
					purpose: "Replace existing cloud-link",
					path: "/api/config/namespaces/{metadata.namespace}/cloud_links/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "cloud_link",
					operationId: "ves.io.schema.cloud_link.API.List",
					summary: "List CloudLink.",
					description: "List the set of cloud_link in a namespace.",
					purpose: "List all cloud-links",
					path: "/api/config/namespaces/{namespace}/cloud_links",
				},
				{
					action: "get",
					resourceType: "cloud_link",
					operationId: "ves.io.schema.cloud_link.API.Get",
					summary: "GET CloudLink.",
					description: "Gets CloudLink parameters.",
					purpose: "Retrieve specific cloud-link",
					path: "/api/config/namespaces/{namespace}/cloud_links/{name}",
				},
				{
					action: "delete",
					resourceType: "cloud_link",
					operationId: "ves.io.schema.cloud_link.API.Delete",
					summary: "DELETE CloudLink.",
					description: "DELETE the specified cloud_link.",
					purpose: "Delete cloud-link",
					path: "/api/config/namespaces/{namespace}/cloud_links/{name}",
				},
			],
		},
	],
	[
		"container_services",
		{
			domain: "container_services",
			displayName: "Container Services",
			description:
				"Create definitions for applications running on distributed infrastructure. Establish standardized templates controlling resource consumption and disk limits. Set up partitioned execution contexts supporting namespace separation and multi-tenant isolation. Track persistent volume claims and usage metrics. Connect with mesh networking for traffic routing.",
			descriptionShort:
				"Create definitions for applications running on distribute...",
			resourceTypes: [
				"usage",
				"virtual_k8ss",
				"workload",
				"workload_flavor",
			],
			operations: [
				{
					action: "create",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.Create",
					summary: "Create Virtual Kubernetes.",
					description:
						"Create virtual_k8s will create the object in the storage backend for namespace metadata.namespace.",
					purpose: "Create new virtual-k8s",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_k8ss",
				},
				{
					action: "replace",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.Replace",
					summary: "Replace Virtual Kubernetes.",
					description:
						"Replacing an endpoint object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing virtual-k8s",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_k8ss/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.List",
					summary: "List Virtual Kubernetes.",
					description: "List the set of virtual_k8s in a namespace.",
					purpose: "List all virtual-k8ss",
					path: "/api/config/namespaces/{namespace}/virtual_k8ss",
				},
				{
					action: "get",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.Get",
					summary: "GET Virtual Kubernetes.",
					description:
						"GET virtual_k8s will GET the object from the storage backend for namesapce metadata.namespace.",
					purpose: "Retrieve specific virtual-k8s",
					path: "/api/config/namespaces/{namespace}/virtual_k8ss/{name}",
				},
				{
					action: "delete",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.Delete",
					summary: "DELETE Virtual Kubernetes.",
					description: "DELETE the specified virtual_k8s.",
					purpose: "Delete virtual-k8s",
					path: "/api/config/namespaces/{namespace}/virtual_k8ss/{name}",
				},
				{
					action: "create",
					resourceType: "workload",
					operationId: "ves.io.schema.views.workload.API.Create",
					summary: "Create Workload.",
					description: "Shape of Workload.",
					purpose: "Create new workload",
					path: "/api/config/namespaces/{metadata.namespace}/workloads",
				},
				{
					action: "replace",
					resourceType: "workload",
					operationId: "ves.io.schema.views.workload.API.Replace",
					summary: "Replace Workload.",
					description: "Shape of Workload.",
					purpose: "Replace existing workload",
					path: "/api/config/namespaces/{metadata.namespace}/workloads/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "workload",
					operationId: "ves.io.schema.views.workload.API.List",
					summary: "List Workload.",
					description: "List the set of workload in a namespace.",
					purpose: "List all workloads",
					path: "/api/config/namespaces/{namespace}/workloads",
				},
				{
					action: "create",
					resourceType: "usage",
					operationId:
						"ves.io.schema.views.workload.CustomDataAPI.Usage",
					summary: "Usage Metrics.",
					description: "GET the workload usage.",
					purpose: "Create new usage",
					path: "/api/data/namespaces/{namespace}/workloads/usage",
				},
				{
					action: "get",
					resourceType: "workload",
					operationId: "ves.io.schema.views.workload.API.Get",
					summary: "GET Workload.",
					description: "Shape of Workload.",
					purpose: "Retrieve specific workload",
					path: "/api/config/namespaces/{namespace}/workloads/{name}",
				},
				{
					action: "delete",
					resourceType: "workload",
					operationId: "ves.io.schema.views.workload.API.Delete",
					summary: "DELETE Workload.",
					description: "DELETE the specified workload.",
					purpose: "Delete workload",
					path: "/api/config/namespaces/{namespace}/workloads/{name}",
				},
				{
					action: "create",
					resourceType: "workload_flavor",
					operationId: "ves.io.schema.workload_flavor.API.Create",
					summary: "Create Workload Flavor.",
					description: "Create a workload_flavor.",
					purpose: "Create new workload-flavor",
					path: "/api/config/namespaces/{metadata.namespace}/workload_flavors",
				},
				{
					action: "replace",
					resourceType: "workload_flavor",
					operationId: "ves.io.schema.workload_flavor.API.Replace",
					summary: "Replace Flavor.",
					description: "Replace a K8s workload_flavor.",
					purpose: "Replace existing workload-flavor",
					path: "/api/config/namespaces/{metadata.namespace}/workload_flavors/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "workload_flavor",
					operationId: "ves.io.schema.workload_flavor.API.List",
					summary: "List Workload Flavor.",
					description:
						"List the set of workload_flavor in a namespace.",
					purpose: "List all workload-flavors",
					path: "/api/config/namespaces/{namespace}/workload_flavors",
				},
				{
					action: "get",
					resourceType: "workload_flavor",
					operationId: "ves.io.schema.workload_flavor.API.Get",
					summary: "GET Workload Flavor.",
					description: "GET Workload Flavor.",
					purpose: "Retrieve specific workload-flavor",
					path: "/api/config/namespaces/{namespace}/workload_flavors/{name}",
				},
				{
					action: "delete",
					resourceType: "workload_flavor",
					operationId: "ves.io.schema.workload_flavor.API.Delete",
					summary: "DELETE Workload Flavor.",
					description: "DELETE the specified workload_flavor.",
					purpose: "Delete workload-flavor",
					path: "/api/config/namespaces/{namespace}/workload_flavors/{name}",
				},
			],
		},
	],
	[
		"data_and_privacy_security",
		{
			domain: "data_and_privacy_security",
			displayName: "Data And Privacy Security",
			description:
				"Set up sensitive data policies that identify and protect personally identifiable information across traffic flows. Create custom data type definitions matching organizational privacy standards and industry regulations. Configure LMA region parameters including Clickhouse, Elastic, and Kafka integrations. Deploy geo-configurations enforcing data residency rules and regional compliance mandates. Monitor detection status through condition tracking and secret management with blindfold encryption.",
			descriptionShort:
				"Set up sensitive data policies that identify and protect ...",
			resourceTypes: [
				"data_type",
				"geo_config",
				"lma_region",
				"sensitive_data_policy",
			],
			operations: [
				{
					action: "create",
					resourceType: "data_type",
					operationId: "ves.io.schema.data_type.API.Create",
					summary: "Create Data Type.",
					description:
						"Create data_type creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new data-type",
					path: "/api/config/namespaces/{metadata.namespace}/data_types",
				},
				{
					action: "replace",
					resourceType: "data_type",
					operationId: "ves.io.schema.data_type.API.Replace",
					summary: "Replace Data Type.",
					description:
						"Replace data_type replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing data-type",
					path: "/api/config/namespaces/{metadata.namespace}/data_types/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "data_type",
					operationId: "ves.io.schema.data_type.API.List",
					summary: "List Data Type.",
					description: "List the set of data_type in a namespace.",
					purpose: "List all data-types",
					path: "/api/config/namespaces/{namespace}/data_types",
				},
				{
					action: "get",
					resourceType: "data_type",
					operationId: "ves.io.schema.data_type.API.Get",
					summary: "GET Data Type.",
					description:
						"GET data_type reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific data-type",
					path: "/api/config/namespaces/{namespace}/data_types/{name}",
				},
				{
					action: "delete",
					resourceType: "data_type",
					operationId: "ves.io.schema.data_type.API.Delete",
					summary: "DELETE Data Type.",
					description: "DELETE the specified data_type.",
					purpose: "Delete data-type",
					path: "/api/config/namespaces/{namespace}/data_types/{name}",
				},
				{
					action: "get",
					resourceType: "geo_config",
					operationId:
						"ves.io.schema.data_privacy.geo_config.API.Get",
					summary: "GET Geo Config.",
					description: "Shape of the geo config specification.",
					purpose: "Retrieve specific geo-config",
					path: "/api/config/namespaces/{namespace}/geo_configs/{name}",
				},
				{
					action: "list",
					resourceType: "lma_region",
					operationId:
						"ves.io.schema.data_privacy.lma_region.API.List",
					summary: "List LMA Region.",
					description: "List the set of lma_region in a namespace.",
					purpose: "List all lma-regions",
					path: "/api/config/namespaces/{namespace}/lma_regions",
				},
				{
					action: "get",
					resourceType: "lma_region",
					operationId:
						"ves.io.schema.data_privacy.lma_region.API.Get",
					summary: "GET LMA Region.",
					description: "Shape of the lma region specification.",
					purpose: "Retrieve specific lma-region",
					path: "/api/config/namespaces/{namespace}/lma_regions/{name}",
				},
				{
					action: "create",
					resourceType: "sensitive_data_policy",
					operationId:
						"ves.io.schema.sensitive_data_policy.API.Create",
					summary: "Create Sensitive Data Discovery.",
					description:
						"Create sensitive_data_policy creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new sensitive-data-policy",
					path: "/api/config/namespaces/{metadata.namespace}/sensitive_data_policys",
				},
				{
					action: "replace",
					resourceType: "sensitive_data_policy",
					operationId:
						"ves.io.schema.sensitive_data_policy.API.Replace",
					summary: "Replace Sensitive Data Discovery.",
					description:
						"Replace sensitive_data_policy replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing sensitive-data-policy",
					path: "/api/config/namespaces/{metadata.namespace}/sensitive_data_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "sensitive_data_policy",
					operationId: "ves.io.schema.sensitive_data_policy.API.List",
					summary: "List Sensitive Data Discovery.",
					description:
						"List the set of sensitive_data_policy in a namespace.",
					purpose: "List all sensitive-data-policys",
					path: "/api/config/namespaces/{namespace}/sensitive_data_policys",
				},
				{
					action: "get",
					resourceType: "sensitive_data_policy",
					operationId: "ves.io.schema.sensitive_data_policy.API.Get",
					summary: "GET Sensitive Data Discovery.",
					description:
						"GET sensitive_data_policy reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific sensitive-data-policy",
					path: "/api/config/namespaces/{namespace}/sensitive_data_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "sensitive_data_policy",
					operationId:
						"ves.io.schema.sensitive_data_policy.API.Delete",
					summary: "DELETE Sensitive Data Discovery.",
					description: "DELETE the specified sensitive_data_policy.",
					purpose: "Delete sensitive-data-policy",
					path: "/api/config/namespaces/{namespace}/sensitive_data_policys/{name}",
				},
			],
		},
	],
	[
		"data_intelligence",
		{
			domain: "data_intelligence",
			displayName: "Data Intelligence",
			description:
				"F5 Distributed Cloud Data Intelligence API specifications",
			descriptionShort:
				"F5 Distributed Cloud Data Intelligence API specifications",
			resourceTypes: [
				"dataSet",
				"datadictionary",
				"dataset",
				"flowlabel",
				"init-request",
				"receiver",
				"statu",
				"subscribe",
				"suggest-value",
				"summary",
				"test",
				"unsubscribe",
			],
			operations: [
				{
					action: "create",
					resourceType: "receiver",
					operationId:
						"ves.io.schema.shape.data_delivery.receiver.API.Create",
					summary: "Create Data Delivery.",
					description: "Creates a new Data Delivery object.",
					purpose: "Create new receiver",
					path: "/api/data-intelligence/namespaces/{metadata.namespace}/receivers",
				},
				{
					action: "replace",
					resourceType: "receiver",
					operationId:
						"ves.io.schema.shape.data_delivery.receiver.API.Replace",
					summary: "Replace Data Delivery.",
					description:
						"Replaces the content of an Data Delivery object.",
					purpose: "Replace existing receiver",
					path: "/api/data-intelligence/namespaces/{metadata.namespace}/receivers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "receiver",
					operationId:
						"ves.io.schema.shape.data_delivery.receiver.API.List",
					summary: "List Data Delivery.",
					description: "List the set of receiver in a namespace.",
					purpose: "List all receivers",
					path: "/api/data-intelligence/namespaces/{namespace}/receivers",
				},
				{
					action: "get",
					resourceType: "receiver",
					operationId:
						"ves.io.schema.shape.data_delivery.receiver.API.Get",
					summary: "GET Data Delivery.",
					description: "GET the Data Delivery object.",
					purpose: "Retrieve specific receiver",
					path: "/api/data-intelligence/namespaces/{namespace}/receivers/{name}",
				},
				{
					action: "delete",
					resourceType: "receiver",
					operationId:
						"ves.io.schema.shape.data_delivery.receiver.API.Delete",
					summary: "DELETE Data Delivery.",
					description: "DELETE the specified receiver.",
					purpose: "Delete receiver",
					path: "/api/data-intelligence/namespaces/{namespace}/receivers/{name}",
				},
				{
					action: "list",
					resourceType: "dataSet",
					operationId:
						"ves.io.schema.shape.data_delivery.CustomAPI.GetDataSets",
					summary: "GET Data Sets.",
					description:
						"GET the list of data sets eligible for the tenant.",
					purpose: "List all dataSets",
					path: "/api/data-intelligence/namespaces/system/dataSets",
				},
				{
					action: "list",
					resourceType: "datadictionary",
					operationId:
						"ves.io.schema.shape.data_delivery.CustomAPI.GetDataDictionary",
					summary: "GET Data Dictionary.",
					description:
						"GET the dataset features from Data dictionary API.",
					purpose: "List all datadictionarys",
					path: "/api/data-intelligence/namespaces/system/datadictionary/{dataset}",
				},
				{
					action: "create",
					resourceType: "init-request",
					operationId:
						"ves.io.schema.shape.data_delivery.CustomAPI.Init",
					summary: "Enable Data Intelligence.",
					description:
						"Request to enable Data Intelligence for the tenant.",
					purpose: "Create new init-request",
					path: "/api/data-intelligence/namespaces/system/init-request",
				},
				{
					action: "list",
					resourceType: "dataset",
					operationId:
						"ves.io.schema.shape.data_delivery.CustomAPI.ListDataSets",
					summary: "List DataSets.",
					description: "API to list datasets by tenant.",
					purpose: "List all datasets",
					path: "/api/data-intelligence/namespaces/{namespace}/data-dictionary/datasets",
				},
				{
					action: "list",
					resourceType: "flowlabel",
					operationId:
						"ves.io.schema.shape.data_delivery.CustomAPI.ListFlowLabels",
					summary: "List FlowLabels.",
					description:
						"ListFlowLabels takes a customer name and returns a list of FlowLabel objects.",
					purpose: "List all flowlabels",
					path: "/api/data-intelligence/namespaces/{namespace}/di/flowlabels",
				},
				{
					action: "create",
					resourceType: "summary",
					operationId:
						"ves.io.schema.shape.data_delivery.CustomAPI.LoadExecutiveSummary",
					summary: "Load Executive Summary.",
					description:
						"Executive summary page for DI premium customers.",
					purpose: "Create new summary",
					path: "/api/data-intelligence/namespaces/{namespace}/di/summary",
				},
				{
					action: "create",
					resourceType: "statu",
					operationId:
						"ves.io.schema.shape.data_delivery.CustomAPI.UpdateReceiverStatus",
					summary: "Update Status of Receiver.",
					description:
						"Update receiver object status from enable to disable and vice versa.",
					purpose: "Create new statu",
					path: "/api/data-intelligence/namespaces/{namespace}/receivers/{id}/status",
				},
				{
					action: "create",
					resourceType: "test",
					operationId:
						"ves.io.schema.shape.data_delivery.CustomAPI.TestReceiver",
					summary: "Test Receiver.",
					description:
						"API to test receiver destination sink connection.",
					purpose: "Create new test",
					path: "/api/data-intelligence/namespaces/{namespace}/receivers/{id}/test",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.shape.data_delivery.CustomAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"Returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/data-intelligence/namespaces/{namespace}/suggest-values",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.shape.data_delivery.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to Data Intelligence.",
					description: "Subscribe to Data Intelligence.",
					purpose: "Create new subscribe",
					path: "/api/data-intelligence/namespaces/system/data-intelligence/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.shape.data_delivery.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Client-Side Defense.",
					description: "Unsubscribe to Client-Side Defense.",
					purpose: "Create new unsubscribe",
					path: "/api/data-intelligence/namespaces/system/data-intelligence/addon/unsubscribe",
				},
			],
		},
	],
	[
		"ddos",
		{
			domain: "ddos",
			displayName: "Ddos",
			description:
				"Deploy definitions that block IP addresses and network segments from accessing protected resources. Organize by threat type or source classification. Manage secure channels routing suspicious packets for analysis before reaching origin servers. Update status for real-time visibility into active defenses. Add items during attacks and monitor health metrics.",
			descriptionShort:
				"Deploy definitions that block IP addresses and network se...",
			resourceTypes: [
				"access",
				"alert",
				"annotation",
				"attachment",
				"bgp_peer_statu",
				"detail",
				"event",
				"events_summary",
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
				"update-advertisement-statu",
				"update-asn-prefix-irr-override",
				"update-asn-prefix-review-statu",
				"update-asn-review-statu",
				"update-tunnel-statu",
			],
			operations: [
				{
					action: "list",
					resourceType: "access",
					operationId:
						"ves.io.schema.infraprotect.CustomGeneralAPI.CustomerAccess",
					summary: "Customer access.",
					description:
						"RPC to GET customer access and availability info.",
					purpose: "List all access",
					path: "/api/infraprotect/namespaces/system/infraprotect/access",
				},
				{
					action: "list",
					resourceType: "alert",
					operationId:
						"ves.io.schema.infraprotect.CustomAlertAPI.GetAlert",
					summary: "DDoS Alert.",
					description: "RPC to GET details of an alert.",
					purpose: "List all alerts",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/alert/{alert_id}",
				},
				{
					action: "replace",
					resourceType: "to_event",
					operationId:
						"ves.io.schema.infraprotect.CustomAlertAPI.AddAlertToEvent",
					summary: "Link Alert to Event.",
					description:
						"Allows customers to link alerts with events. This helps with tracking of any mitigation activity and event investigation.",
					purpose: "Replace existing to-event",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/alert/{alert_id}/to_event",
				},
				{
					action: "create",
					resourceType: "alert",
					operationId:
						"ves.io.schema.infraprotect.CustomAlertAPI.ListAlerts",
					summary: "DDoS Alerts.",
					description:
						"RPC to GET a list of Alerts. Alerts are raised when an attack is detected by L3/L4 provider. Alerts help to start investigate and mitigate any malicious or suspicious activate.",
					purpose: "Create new alert",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/alerts",
				},
				{
					action: "create",
					resourceType: "bgp_peer_statu",
					operationId:
						"ves.io.schema.infraprotect.CustomDataAPI.BGPPeerStatus",
					summary: "BGP Peer Status.",
					description:
						"API to GET routed DDoS BGP peer status information.",
					purpose: "Create new bgp-peer-statu",
					path: "/api/data/namespaces/{namespace}/infraprotect/bgp_peer_status",
				},
				{
					action: "list",
					resourceType: "event",
					operationId:
						"ves.io.schema.infraprotect.CustomEventAPI.GetEvent",
					summary: "Event details.",
					description:
						"Returns details of an event. This allows customers to review any activity related to a DDoS attack.",
					purpose: "List all events",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/event/{event_id}",
				},
				{
					action: "replace",
					resourceType: "event",
					operationId:
						"ves.io.schema.infraprotect.CustomEventAPI.EditEvent",
					summary: "Edit event.",
					description:
						"Allows editing of an event, setting its end date and upload any relevant pieces of information.",
					purpose: "Replace existing event",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/event/{event_id}",
				},
				{
					action: "list",
					resourceType: "alert",
					operationId:
						"ves.io.schema.infraprotect.CustomEventAPI.ListEventAlerts",
					summary: "Event alerts.",
					description:
						"Returns a list of alerts triggers while an event is active.",
					purpose: "List all alerts",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/event/{event_id}/alerts",
				},
				{
					action: "list",
					resourceType: "attachment",
					operationId:
						"ves.io.schema.infraprotect.CustomEventAPI.ListEventAttachments",
					summary: "Event attachments.",
					description:
						"Returns any attachments associated with an event. This could be Pcap files or any other document. Obsolete - use `GetEvent` to list out attachments.",
					purpose: "List all attachments",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/event/{event_id}/attachments",
				},
				{
					action: "replace",
					resourceType: "detail",
					operationId:
						"ves.io.schema.infraprotect.CustomEventDetailsAPI.EditEventDetail",
					summary: "Edit event detail.",
					description:
						"Allows editing of an event detail, setting its title, description and date.",
					purpose: "Replace existing detail",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/event/{event_id}/detail/{event_detail_id}",
				},
				{
					action: "delete",
					resourceType: "detail",
					operationId:
						"ves.io.schema.infraprotect.CustomEventDetailsAPI.DeleteEventDetail",
					summary: "DELETE event detail.",
					description:
						"DELETE a single event detail, including all dependant objects (e.g. Attachments)",
					purpose: "Delete detail",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/event/{event_id}/detail/{event_detail_id}",
				},
				{
					action: "list",
					resourceType: "detail",
					operationId:
						"ves.io.schema.infraprotect.CustomEventDetailsAPI.ListEventDetails",
					summary: "List of event details.",
					description:
						"Returns a list of event details. The list contains event details entered by customer and the SOC team members, mitigation annotations and any attachments.",
					purpose: "List all details",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/event/{event_id}/details",
				},
				{
					action: "create",
					resourceType: "detail",
					operationId:
						"ves.io.schema.infraprotect.CustomEventDetailsAPI.AddEventDetail",
					summary: "Add Event Detail.",
					description: "Adds a single event detail to an event.",
					purpose: "Create new detail",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/event/{event_id}/details",
				},
				{
					action: "list",
					resourceType: "mitigation_annotation",
					operationId:
						"ves.io.schema.infraprotect.CustomEventAPI.ListEventMitigations",
					summary: "Event mitigation annotation.",
					description:
						"Return mitigation annotations that occur while an event is active.",
					purpose: "List all mitigation-annotations",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/event/{event_id}/mitigation_annotations",
				},
				{
					action: "create",
					resourceType: "event",
					operationId:
						"ves.io.schema.infraprotect.CustomEventAPI.ListEvents",
					summary: "List of events.",
					description:
						"Returns a list of events. Events are created when a high priority mitigation is started. Events then serve as a one stop shop to review activities to mitigate a DDoS attack.",
					purpose: "Create new event",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/events",
				},
				{
					action: "list",
					resourceType: "events_summary",
					operationId:
						"ves.io.schema.infraprotect.CustomEventAPI.ListEventsSummary",
					summary: "Simple events view.",
					description:
						"Return a list of available event (suitable for an alert)",
					purpose: "List all events-summarys",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/events_summary",
				},
				{
					action: "list",
					resourceType: "mitigation",
					operationId:
						"ves.io.schema.infraprotect.CustomMitigationAPI.GetMitigation",
					summary: "Mitigation details.",
					description: "Returns details of a single mitigation.",
					purpose: "List all mitigations",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/mitigation/{mitigation_id}",
				},
				{
					action: "list",
					resourceType: "annotation",
					operationId:
						"ves.io.schema.infraprotect.CustomMitigationAPI.ListMitigationAnnotations",
					summary: "Mitigation annotations.",
					description: "Returns annotations of a single mitigation.",
					purpose: "List all annotations",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/mitigation/{mitigation_id}/annotations",
				},
				{
					action: "list",
					resourceType: "ip",
					operationId:
						"ves.io.schema.infraprotect.CustomMitigationAPI.ListMitigationIPs",
					summary: "Mitigation IPs.",
					description:
						"Returns list of IPs involved in a mitigation (and allows for searching through it)",
					purpose: "List all ips",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/mitigation/{mitigation_id}/ips",
				},
				{
					action: "create",
					resourceType: "mitigation",
					operationId:
						"ves.io.schema.infraprotect.CustomMitigationAPI.ListMitigations",
					summary: "List of mitigations.",
					description: "Returns a list of mitigations.",
					purpose: "Create new mitigation",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/mitigations",
				},
				{
					action: "list",
					resourceType: "network",
					operationId:
						"ves.io.schema.infraprotect.CustomNetworkAPI.ListNetworks",
					summary: "List networks.",
					description:
						"Returns a list available reports to be downloaded. Reports summarise an event or a mitigation in a single PDF document.",
					purpose: "List all networks",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/networks",
				},
				{
					action: "list",
					resourceType: "report",
					operationId:
						"ves.io.schema.infraprotect.CustomReportAPI.GetReport",
					summary: "Report details.",
					description:
						"Returns details of a report, most importantly the PDF document itself.",
					purpose: "List all reports",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/report/{report_id}",
				},
				{
					action: "create",
					resourceType: "report",
					operationId:
						"ves.io.schema.infraprotect.CustomReportAPI.ListReports",
					summary: "List reports.",
					description:
						"Returns a list of available reports to be downloaded. Reports summarise an event or a mitigation in a single PDF document.",
					purpose: "Create new report",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect/reports",
				},
				{
					action: "create",
					resourceType: "transit_usage",
					operationId:
						"ves.io.schema.infraprotect.CustomDataAPI.TransitUsage",
					summary: "Transit Usage.",
					description: "API to GET transit usage data.",
					purpose: "Create new transit-usage",
					path: "/api/data/namespaces/{namespace}/infraprotect/transit_usage",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.infraprotect.CustomGeneralAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"SuggestValues returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/infraprotect/namespaces/{namespace}/suggest-values",
				},
				{
					action: "create",
					resourceType: "infraprotect_asn",
					operationId: "ves.io.schema.infraprotect_asn.API.Create",
					summary: "Create DDoS transit ASN.",
					description: "Creates a DDoS transit ASN.",
					purpose: "Create new infraprotect-asn",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_asns",
				},
				{
					action: "replace",
					resourceType: "infraprotect_asn",
					operationId: "ves.io.schema.infraprotect_asn.API.Replace",
					summary: "Replace DDoS transit ASN.",
					description: "Amends a DDoS transit ASN.",
					purpose: "Replace existing infraprotect-asn",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_asns/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "infraprotect_asn",
					operationId: "ves.io.schema.infraprotect_asn.API.List",
					summary: "List Infraprotect ASN.",
					description:
						"List the set of infraprotect_asn in a namespace.",
					purpose: "List all infraprotect-asns",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_asns",
				},
				{
					action: "create",
					resourceType: "update-asn-review-statu",
					operationId:
						"ves.io.schema.infraprotect_asn.CustomAPI.UpdateASNReviewStatus",
					summary: "Update ASN Review Status.",
					description: "Update Infraprotect ASN Review Status.",
					purpose: "Create new update-asn-review-statu",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_asns/update-asn-review-status",
				},
				{
					action: "get",
					resourceType: "infraprotect_asn",
					operationId: "ves.io.schema.infraprotect_asn.API.Get",
					summary: "GET Infraprotect ASN.",
					description: "GET DDoS transit ASN.",
					purpose: "Retrieve specific infraprotect-asn",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_asns/{name}",
				},
				{
					action: "delete",
					resourceType: "infraprotect_asn",
					operationId: "ves.io.schema.infraprotect_asn.API.Delete",
					summary: "DELETE Infraprotect ASN.",
					description: "DELETE the specified infraprotect_asn.",
					purpose: "Delete infraprotect-asn",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_asns/{name}",
				},
				{
					action: "create",
					resourceType: "infraprotect_asn_prefix",
					operationId:
						"ves.io.schema.infraprotect_asn_prefix.API.Create",
					summary: "Create DDoS transit Prefix.",
					description: "Creates a DDoS transit Prefix.",
					purpose: "Create new infraprotect-asn-prefix",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_asn_prefixs",
				},
				{
					action: "replace",
					resourceType: "infraprotect_asn_prefix",
					operationId:
						"ves.io.schema.infraprotect_asn_prefix.API.Replace",
					summary: "Replace DDoS transit Prefix.",
					description: "Amends a DDoS transit Prefix.",
					purpose: "Replace existing infraprotect-asn-prefix",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_asn_prefixs/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "update-asn-prefix-irr-override",
					operationId:
						"ves.io.schema.infraprotect_asn_prefix.CustomAPI.UpdateASNPrefixIRROverride",
					summary: "Update ASN Prefix IRR Override.",
					description: "Update Infraprotect ASN Prefix IRR Override.",
					purpose: "Create new update-asn-prefix-irr-override",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_asn_prefixes/update-asn-prefix-irr-override",
				},
				{
					action: "create",
					resourceType: "update-asn-prefix-review-statu",
					operationId:
						"ves.io.schema.infraprotect_asn_prefix.CustomAPI.UpdateASNPrefixReviewStatus",
					summary: "Update ASN Prefix Review Status.",
					description:
						"Update Infraprotect ASN Prefix Review Status.",
					purpose: "Create new update-asn-prefix-review-statu",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_asn_prefixes/update-asn-prefix-review-status",
				},
				{
					action: "list",
					resourceType: "infraprotect_asn_prefix",
					operationId:
						"ves.io.schema.infraprotect_asn_prefix.API.List",
					summary: "List Infraprotect ASN Prefix.",
					description:
						"List the set of infraprotect_asn_prefix in a namespace.",
					purpose: "List all infraprotect-asn-prefixs",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_asn_prefixs",
				},
				{
					action: "get",
					resourceType: "infraprotect_asn_prefix",
					operationId:
						"ves.io.schema.infraprotect_asn_prefix.API.Get",
					summary: "GET Infraprotect ASN Prefix.",
					description: "GET DDoS transit Prefix.",
					purpose: "Retrieve specific infraprotect-asn-prefix",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_asn_prefixs/{name}",
				},
				{
					action: "delete",
					resourceType: "infraprotect_asn_prefix",
					operationId:
						"ves.io.schema.infraprotect_asn_prefix.API.Delete",
					summary: "DELETE Infraprotect ASN Prefix.",
					description:
						"DELETE the specified infraprotect_asn_prefix.",
					purpose: "Delete infraprotect-asn-prefix",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_asn_prefixs/{name}",
				},
				{
					action: "create",
					resourceType: "infraprotect_deny_list_rule",
					operationId:
						"ves.io.schema.infraprotect_deny_list_rule.API.Create",
					summary: "Create DDoS transit Deny List Rule.",
					description: "Creates a DDoS transit Deny List Rule.",
					purpose: "Create new infraprotect-deny-list-rule",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_deny_list_rules",
				},
				{
					action: "replace",
					resourceType: "infraprotect_deny_list_rule",
					operationId:
						"ves.io.schema.infraprotect_deny_list_rule.API.Replace",
					summary: "Replace DDoS transit Deny List Rule.",
					description: "Amends a DDoS transit Deny List Rule.",
					purpose: "Replace existing infraprotect-deny-list-rule",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_deny_list_rules/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "infraprotect_deny_list_rule",
					operationId:
						"ves.io.schema.infraprotect_deny_list_rule.API.List",
					summary: "List Infraprotect Deny List Rule.",
					description:
						"List the set of infraprotect_deny_list_rule in a namespace.",
					purpose: "List all infraprotect-deny-list-rules",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_deny_list_rules",
				},
				{
					action: "get",
					resourceType: "infraprotect_deny_list_rule",
					operationId:
						"ves.io.schema.infraprotect_deny_list_rule.API.Get",
					summary: "GET Infraprotect Deny List Rule.",
					description: "GET DDoS transit Deny List Rule.",
					purpose: "Retrieve specific infraprotect-deny-list-rule",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_deny_list_rules/{name}",
				},
				{
					action: "delete",
					resourceType: "infraprotect_deny_list_rule",
					operationId:
						"ves.io.schema.infraprotect_deny_list_rule.API.Delete",
					summary: "DELETE Infraprotect Deny List Rule.",
					description:
						"DELETE the specified infraprotect_deny_list_rule.",
					purpose: "Delete infraprotect-deny-list-rule",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_deny_list_rules/{name}",
				},
				{
					action: "create",
					resourceType: "infraprotect_firewall_rule",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule.API.Create",
					summary: "Create DDoS transit Firewall Rule.",
					description: "Creates a DDoS transit Firewall Rule.",
					purpose: "Create new infraprotect-firewall-rule",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_firewall_rules",
				},
				{
					action: "replace",
					resourceType: "infraprotect_firewall_rule",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule.API.Replace",
					summary: "Replace DDoS transit Firewall Rule.",
					description: "Amends a DDoS transit Firewall Rule.",
					purpose: "Replace existing infraprotect-firewall-rule",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_firewall_rules/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "infraprotect_firewall_rule",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule.API.List",
					summary: "List Infraprotect Firewall Rule.",
					description:
						"List the set of infraprotect_firewall_rule in a namespace.",
					purpose: "List all infraprotect-firewall-rules",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_firewall_rules",
				},
				{
					action: "get",
					resourceType: "infraprotect_firewall_rule",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule.API.Get",
					summary: "GET Infraprotect Firewall Rule.",
					description: "GET DDoS transit Firewall Rule.",
					purpose: "Retrieve specific infraprotect-firewall-rule",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_firewall_rules/{name}",
				},
				{
					action: "delete",
					resourceType: "infraprotect_firewall_rule",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule.API.Delete",
					summary: "DELETE Infraprotect Firewall Rule.",
					description:
						"DELETE the specified infraprotect_firewall_rule.",
					purpose: "Delete infraprotect-firewall-rule",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_firewall_rules/{name}",
				},
				{
					action: "create",
					resourceType: "infraprotect_firewall_rule_group",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule_group.API.Create",
					summary: "Replace DDoS transit Firewall Rule Group.",
					description: "Amends a DDoS transit Firewall Rule Group.",
					purpose: "Create new infraprotect-firewall-rule-group",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_firewall_rule_groups",
				},
				{
					action: "replace",
					resourceType: "infraprotect_firewall_rule_group",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule_group.API.Replace",
					summary: "Replace DDoS transit Firewall Rule Group.",
					description: "Amends a DDoS transit Firewall Rule Group.",
					purpose:
						"Replace existing infraprotect-firewall-rule-group",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_firewall_rule_groups/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "infraprotect_firewall_rule_group",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule_group.API.List",
					summary: "List Infraprotect Firewall Rule Group.",
					description:
						"List the set of infraprotect_firewall_rule_group in a namespace.",
					purpose: "List all infraprotect-firewall-rule-groups",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_firewall_rule_groups",
				},
				{
					action: "get",
					resourceType: "infraprotect_firewall_rule_group",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule_group.API.Get",
					summary: "GET Infraprotect Firewall Rule Group.",
					description: "GET DDoS transit Firewall Rule Group.",
					purpose:
						"Retrieve specific infraprotect-firewall-rule-group",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_firewall_rule_groups/{name}",
				},
				{
					action: "delete",
					resourceType: "infraprotect_firewall_rule_group",
					operationId:
						"ves.io.schema.infraprotect_firewall_rule_group.API.Delete",
					summary: "DELETE Infraprotect Firewall Rule Group.",
					description:
						"DELETE the specified infraprotect_firewall_rule_group.",
					purpose: "Delete infraprotect-firewall-rule-group",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_firewall_rule_groups/{name}",
				},
				{
					action: "replace",
					resourceType: "infraprotect_firewall_ruleset",
					operationId:
						"ves.io.schema.infraprotect_firewall_ruleset.API.Replace",
					summary: "Replace DDoS transit Firewall Ruleset.",
					description: "Amends a DDoS transit Firewall Ruleset.",
					purpose: "Replace existing infraprotect-firewall-ruleset",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_firewall_rulesets/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "infraprotect_firewall_ruleset",
					operationId:
						"ves.io.schema.infraprotect_firewall_ruleset.API.List",
					summary: "List Infraprotect Firewall Ruleset.",
					description:
						"List the set of infraprotect_firewall_ruleset in a namespace.",
					purpose: "List all infraprotect-firewall-rulesets",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_firewall_rulesets",
				},
				{
					action: "get",
					resourceType: "infraprotect_firewall_ruleset",
					operationId:
						"ves.io.schema.infraprotect_firewall_ruleset.API.Get",
					summary: "GET Infraprotect Firewall Ruleset.",
					description: "GET DDoS transit Firewall Ruleset.",
					purpose: "Retrieve specific infraprotect-firewall-ruleset",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_firewall_rulesets/{name}",
				},
				{
					action: "get",
					resourceType: "infraprotect_information",
					operationId:
						"ves.io.schema.infraprotect_information.API.Get",
					summary: "GET Infraprotect Information.",
					description: "GET organisation information.",
					purpose: "Retrieve specific infraprotect-information",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_informations/{name}",
				},
				{
					action: "create",
					resourceType: "infraprotect_internet_prefix_advertisement",
					operationId:
						"ves.io.schema.infraprotect_internet_prefix_advertisement.API.Create",
					summary: "Create DDoS transit Internet Prefix.",
					description: "Creates a DDoS transit Internet Prefix.",
					purpose:
						"Create new infraprotect-internet-prefix-advertisement",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_internet_prefix_advertisements",
				},
				{
					action: "replace",
					resourceType: "infraprotect_internet_prefix_advertisement",
					operationId:
						"ves.io.schema.infraprotect_internet_prefix_advertisement.API.Replace",
					summary: "Replace DDoS transit Internet Prefix.",
					description: "Amends a DDoS transit Internet Prefix.",
					purpose:
						"Replace existing infraprotect-internet-prefix-advertisement",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_internet_prefix_advertisements/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "infraprotect_internet_prefix_advertisement",
					operationId:
						"ves.io.schema.infraprotect_internet_prefix_advertisement.API.List",
					summary: "List Infraprotect Internet Prefix Advertisement.",
					description:
						"List the set of infraprotect_internet_prefix_advertisement in a namespace.",
					purpose:
						"List all infraprotect-internet-prefix-advertisements",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_internet_prefix_advertisements",
				},
				{
					action: "create",
					resourceType: "update-advertisement-statu",
					operationId:
						"ves.io.schema.infraprotect_internet_prefix_advertisement.CustomAPI.UpdateInternetPrefixAdvertisementStatus",
					summary:
						"Update Infraprotect Internet prefix advertisement.",
					description:
						"Update Infraprotect Internet prefix advertisement.",
					purpose: "Create new update-advertisement-statu",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_internet_prefix_advertisements/update-advertisement-status",
				},
				{
					action: "get",
					resourceType: "infraprotect_internet_prefix_advertisement",
					operationId:
						"ves.io.schema.infraprotect_internet_prefix_advertisement.API.Get",
					summary: "GET Infraprotect Internet Prefix.",
					description: "GET DDoS transit Internet Prefix.",
					purpose:
						"Retrieve specific infraprotect-internet-prefix-advertisement",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_internet_prefix_advertisements/{name}",
				},
				{
					action: "delete",
					resourceType: "infraprotect_internet_prefix_advertisement",
					operationId:
						"ves.io.schema.infraprotect_internet_prefix_advertisement.API.Delete",
					summary:
						"DELETE Infraprotect Internet Prefix Advertisement.",
					description:
						"DELETE the specified infraprotect_internet_prefix_advertisement.",
					purpose:
						"Delete infraprotect-internet-prefix-advertisement",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_internet_prefix_advertisements/{name}",
				},
				{
					action: "create",
					resourceType: "infraprotect_tunnel",
					operationId: "ves.io.schema.infraprotect_tunnel.API.Create",
					summary: "Create DDoS Transit Tunnel.",
					description: "Creates a DDoS transit tunnel.",
					purpose: "Create new infraprotect-tunnel",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_tunnels",
				},
				{
					action: "replace",
					resourceType: "infraprotect_tunnel",
					operationId:
						"ves.io.schema.infraprotect_tunnel.API.Replace",
					summary: "Replace DDoS Transit Tunnel.",
					description: "Amends a DDoS transit tunnel.",
					purpose: "Replace existing infraprotect-tunnel",
					path: "/api/infraprotect/namespaces/{metadata.namespace}/infraprotect_tunnels/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "infraprotect_tunnel",
					operationId: "ves.io.schema.infraprotect_tunnel.API.List",
					summary: "List Tunnel.",
					description:
						"List the set of infraprotect_tunnel in a namespace.",
					purpose: "List all infraprotect-tunnels",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_tunnels",
				},
				{
					action: "create",
					resourceType: "update-tunnel-statu",
					operationId:
						"ves.io.schema.infraprotect_tunnel.CustomAPI.UpdateTunnelStatus",
					summary: "Update Tunnel Status.",
					description: "Update Tunnel Status.",
					purpose: "Create new update-tunnel-statu",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_tunnels/update-tunnel-status",
				},
				{
					action: "get",
					resourceType: "infraprotect_tunnel",
					operationId: "ves.io.schema.infraprotect_tunnel.API.Get",
					summary: "GET Tunnel.",
					description: "GET DDoS transit tunnel.",
					purpose: "Retrieve specific infraprotect-tunnel",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_tunnels/{name}",
				},
				{
					action: "delete",
					resourceType: "infraprotect_tunnel",
					operationId: "ves.io.schema.infraprotect_tunnel.API.Delete",
					summary: "DELETE Tunnel.",
					description: "DELETE the specified infraprotect_tunnel.",
					purpose: "Delete infraprotect-tunnel",
					path: "/api/infraprotect/namespaces/{namespace}/infraprotect_tunnels/{name}",
				},
			],
		},
	],
	[
		"dns",
		{
			domain: "dns",
			displayName: "Dns",
			description:
				"Set up primary and secondary zones with support for A, AAAA, CNAME, CAA, CERT, and AFSDB record types. Define health checks to monitor target availability and enable automatic failover between record destinations. Clone existing domains, import zone configurations from external servers, or export zone files for backup. Track query metrics and request logs to analyze resolution patterns across namespaces.",
			descriptionShort:
				"Set up primary and secondary zones with support for A, AA...",
			resourceTypes: [
				"clone_from_dns_domain",
				"dns_compliance_checkss",
				"dns_domain",
				"dns_lb_health_check",
				"dns_lb_pool",
				"dns_load_balancer",
				"dns_zone",
				"export",
				"health_statu",
				"health_status_change_event",
				"import",
				"import_axfr",
				"import_bind_create",
				"import_bind_validate",
				"local_zone_file",
				"metric",
				"pool_members_health_statu",
				"remote_zone_file",
				"request_log",
				"rrset",
				"subscribe",
				"suggest-value",
				"unsubscribe",
				"verify",
			],
			operations: [
				{
					action: "create",
					resourceType: "dns_compliance_checkss",
					operationId:
						"ves.io.schema.dns_compliance_checks.API.Create",
					summary: "Create DNS Compliance Checks.",
					description:
						"Create DNS Compliance Checks Specification in a given namespace. If one already exists it will give an error.",
					purpose: "Create new dns-compliance-checks",
					path: "/api/config/namespaces/{metadata.namespace}/dns_compliance_checkss",
				},
				{
					action: "replace",
					resourceType: "dns_compliance_checkss",
					operationId:
						"ves.io.schema.dns_compliance_checks.API.Replace",
					summary: "Replace DNS Compliance Checks.",
					description:
						"Replace DNS Compliance Checks specification in a given namespace.",
					purpose: "Replace existing dns-compliance-checks",
					path: "/api/config/namespaces/{metadata.namespace}/dns_compliance_checkss/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "dns_compliance_checkss",
					operationId: "ves.io.schema.dns_compliance_checks.API.List",
					summary: "List Configure DNS Compliance Checks.",
					description:
						"List the set of dns_compliance_checks in a namespace.",
					purpose: "List all dns-compliance-checkss",
					path: "/api/config/namespaces/{namespace}/dns_compliance_checkss",
				},
				{
					action: "get",
					resourceType: "dns_compliance_checkss",
					operationId: "ves.io.schema.dns_compliance_checks.API.Get",
					summary: "GET DNS Compliance Checks.",
					description: "GET DNS Compliance Checks details.",
					purpose: "Retrieve specific dns-compliance-checks",
					path: "/api/config/namespaces/{namespace}/dns_compliance_checkss/{name}",
				},
				{
					action: "delete",
					resourceType: "dns_compliance_checkss",
					operationId:
						"ves.io.schema.dns_compliance_checks.API.Delete",
					summary: "DELETE Configure DNS Compliance Checks.",
					description: "DELETE the specified dns_compliance_checks.",
					purpose: "Delete dns-compliance-checks",
					path: "/api/config/namespaces/{namespace}/dns_compliance_checkss/{name}",
				},
				{
					action: "create",
					resourceType: "dns_domain",
					operationId: "ves.io.schema.dns_domain.API.Create",
					summary: "Create DNS Domain.",
					description:
						"Create DNS Domain in a given namespace. If one already exist it will give a error.",
					purpose: "Create new dns-domain",
					path: "/api/config/namespaces/{metadata.namespace}/dns_domains",
				},
				{
					action: "replace",
					resourceType: "dns_domain",
					operationId: "ves.io.schema.dns_domain.API.Replace",
					summary: "Replace DNS Domain.",
					description: "Replace DNS Domain in a given namespace.",
					purpose: "Replace existing dns-domain",
					path: "/api/config/namespaces/{metadata.namespace}/dns_domains/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "verify",
					operationId:
						"ves.io.schema.dns_domain.CustomAPI.VerifyDnsDomain",
					summary: "Verify DNS Domain.",
					description:
						"Verify DNS Domain for a given dns_domain object.",
					purpose: "Create new verify",
					path: "/api/config/namespaces/{namespace}/dns_domain/{name}/verify",
				},
				{
					action: "list",
					resourceType: "dns_domain",
					operationId: "ves.io.schema.dns_domain.API.List",
					summary: "List DNS Domain.",
					description: "List the set of dns_domain in a namespace.",
					purpose: "List all dns-domains",
					path: "/api/config/namespaces/{namespace}/dns_domains",
				},
				{
					action: "get",
					resourceType: "dns_domain",
					operationId: "ves.io.schema.dns_domain.API.Get",
					summary: "GET DNS Domain.",
					description: "GET network policy set in a given namespace.",
					purpose: "Retrieve specific dns-domain",
					path: "/api/config/namespaces/{namespace}/dns_domains/{name}",
				},
				{
					action: "delete",
					resourceType: "dns_domain",
					operationId: "ves.io.schema.dns_domain.API.Delete",
					summary: "DELETE DNS Domain.",
					description: "DELETE the specified dns_domain.",
					purpose: "Delete dns-domain",
					path: "/api/config/namespaces/{namespace}/dns_domains/{name}",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.dns_load_balancer.CustomAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"SuggestValues returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/config/dns/namespaces/system/suggest-values",
				},
				{
					action: "create",
					resourceType: "dns_load_balancer",
					operationId: "ves.io.schema.dns_load_balancer.API.Create",
					summary: "Create DNS Load Balancer.",
					description:
						"Create DNS Load Balancer in a given namespace. If one already exist it will give a error.",
					purpose: "Create new dns-load-balancer",
					path: "/api/config/dns/namespaces/{metadata.namespace}/dns_load_balancers",
				},
				{
					action: "replace",
					resourceType: "dns_load_balancer",
					operationId: "ves.io.schema.dns_load_balancer.API.Replace",
					summary: "Replace DNS Load Balancer.",
					description:
						"Replace DNS Load Balancer in a given namespace.",
					purpose: "Replace existing dns-load-balancer",
					path: "/api/config/dns/namespaces/{metadata.namespace}/dns_load_balancers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "dns_load_balancer",
					operationId: "ves.io.schema.dns_load_balancer.API.List",
					summary: "List DNS Load Balancer.",
					description:
						"List the set of dns_load_balancer in a namespace.",
					purpose: "List all dns-load-balancers",
					path: "/api/config/dns/namespaces/{namespace}/dns_load_balancers",
				},
				{
					action: "list",
					resourceType: "health_statu",
					operationId:
						"ves.io.schema.dns_load_balancer.CustomDataAPI.DNSLBHealthStatusList",
					summary: "DNS Load Balancer Health Status List.",
					description:
						"GET Health Status of all DNS Load Balancers in a namespace.",
					purpose: "List all health-status",
					path: "/api/data/namespaces/{namespace}/dns_load_balancers/health_status",
				},
				{
					action: "list",
					resourceType: "pool_members_health_statu",
					operationId:
						"ves.io.schema.dns_load_balancer.CustomDataAPI.DNSLBPoolMemberHealthStatusList",
					summary:
						"DNS Load Balancer Pool Members Health Status List.",
					description:
						"GET Health Status of all DNS Load Balancer Pool Members in a namespace.",
					purpose: "List all pool-members-health-status",
					path: "/api/data/namespaces/{namespace}/dns_load_balancers/pool_members_health_status",
				},
				{
					action: "list",
					resourceType: "health_statu",
					operationId:
						"ves.io.schema.dns_load_balancer.CustomDataAPI.DNSLBPoolHealthStatus",
					summary: "DNS Load Balancer Pool Health Status.",
					description: "GET DNS Load Balancer Pool Health Status.",
					purpose: "List all health-status",
					path: "/api/data/namespaces/{namespace}/dns_load_balancers/{dns_lb_name}/dns_lb_pools/{dns_lb_pool_name}/health_status",
				},
				{
					action: "list",
					resourceType: "health_status_change_event",
					operationId:
						"ves.io.schema.dns_load_balancer.CustomDataAPI.DNSLBPoolMemberHealthStatusChangeEvents",
					summary:
						"DNS Load Balancer Pool Member Health Status Change Events.",
					description:
						"GET DNS Load Balancer Pool Health Status Changes.",
					purpose: "List all health-status-change-events",
					path: "/api/data/namespaces/{namespace}/dns_load_balancers/{dns_lb_name}/dns_lb_pools/{dns_lb_pool_name}/pool_members/{pool_member_address}/health_status_change_events",
				},
				{
					action: "get",
					resourceType: "dns_load_balancer",
					operationId: "ves.io.schema.dns_load_balancer.API.Get",
					summary: "GET DNS Load Balancer.",
					description: "GET DNS Load Balancer details.",
					purpose: "Retrieve specific dns-load-balancer",
					path: "/api/config/dns/namespaces/{namespace}/dns_load_balancers/{name}",
				},
				{
					action: "delete",
					resourceType: "dns_load_balancer",
					operationId: "ves.io.schema.dns_load_balancer.API.Delete",
					summary: "DELETE DNS Load Balancer.",
					description: "DELETE the specified dns_load_balancer.",
					purpose: "Delete dns-load-balancer",
					path: "/api/config/dns/namespaces/{namespace}/dns_load_balancers/{name}",
				},
				{
					action: "get",
					resourceType: "health_statu",
					operationId:
						"ves.io.schema.dns_load_balancer.CustomDataAPI.DNSLBHealthStatus",
					summary: "DNS Load Balancer Health Status.",
					description: "GET DNS Load Balancer Health status.",
					purpose: "Retrieve specific health-statu",
					path: "/api/data/namespaces/{namespace}/dns_load_balancers/{name}/health_status",
				},
				{
					action: "create",
					resourceType: "dns_lb_health_check",
					operationId: "ves.io.schema.dns_lb_health_check.API.Create",
					summary: "Create DNS Load Balancer Health Check.",
					description:
						"Create DNS Load Balancer Health Check in a given namespace. If one already exist it will give a error.",
					purpose: "Create new dns-lb-health-check",
					path: "/api/config/dns/namespaces/{metadata.namespace}/dns_lb_health_checks",
				},
				{
					action: "replace",
					resourceType: "dns_lb_health_check",
					operationId:
						"ves.io.schema.dns_lb_health_check.API.Replace",
					summary: "Replace DNS Load Balancer Health Check.",
					description:
						"Replace DNS Load Balancer Health Check in a given namespace.",
					purpose: "Replace existing dns-lb-health-check",
					path: "/api/config/dns/namespaces/{metadata.namespace}/dns_lb_health_checks/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "dns_lb_health_check",
					operationId: "ves.io.schema.dns_lb_health_check.API.List",
					summary: "List DNS Load Balancer Health Check.",
					description:
						"List the set of dns_lb_health_check in a namespace.",
					purpose: "List all dns-lb-health-checks",
					path: "/api/config/dns/namespaces/{namespace}/dns_lb_health_checks",
				},
				{
					action: "get",
					resourceType: "dns_lb_health_check",
					operationId: "ves.io.schema.dns_lb_health_check.API.Get",
					summary: "GET DNS Load Balancer Health Check.",
					description: "GET DNS Load Balancer Health Check details.",
					purpose: "Retrieve specific dns-lb-health-check",
					path: "/api/config/dns/namespaces/{namespace}/dns_lb_health_checks/{name}",
				},
				{
					action: "delete",
					resourceType: "dns_lb_health_check",
					operationId: "ves.io.schema.dns_lb_health_check.API.Delete",
					summary: "DELETE DNS Load Balancer Health Check.",
					description: "DELETE the specified dns_lb_health_check.",
					purpose: "Delete dns-lb-health-check",
					path: "/api/config/dns/namespaces/{namespace}/dns_lb_health_checks/{name}",
				},
				{
					action: "create",
					resourceType: "dns_lb_pool",
					operationId: "ves.io.schema.dns_lb_pool.API.Create",
					summary: "Create DNS Load Balancer Pool.",
					description:
						"Create DNS Load Balancer Pool in a given namespace. If one already exist it will give a error.",
					purpose: "Create new dns-lb-pool",
					path: "/api/config/dns/namespaces/{metadata.namespace}/dns_lb_pools",
				},
				{
					action: "replace",
					resourceType: "dns_lb_pool",
					operationId: "ves.io.schema.dns_lb_pool.API.Replace",
					summary: "Replace DNS Load Balancer Pool.",
					description:
						"Replace DNS Load Balancer Pool in a given namespace.",
					purpose: "Replace existing dns-lb-pool",
					path: "/api/config/dns/namespaces/{metadata.namespace}/dns_lb_pools/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "dns_lb_pool",
					operationId: "ves.io.schema.dns_lb_pool.API.List",
					summary: "List DNS Load Balancer Pool.",
					description: "List the set of dns_lb_pool in a namespace.",
					purpose: "List all dns-lb-pools",
					path: "/api/config/dns/namespaces/{namespace}/dns_lb_pools",
				},
				{
					action: "get",
					resourceType: "dns_lb_pool",
					operationId: "ves.io.schema.dns_lb_pool.API.Get",
					summary: "GET DNS Load Balancer Pool.",
					description: "GET DNS Load Balancer Pool details.",
					purpose: "Retrieve specific dns-lb-pool",
					path: "/api/config/dns/namespaces/{namespace}/dns_lb_pools/{name}",
				},
				{
					action: "delete",
					resourceType: "dns_lb_pool",
					operationId: "ves.io.schema.dns_lb_pool.API.Delete",
					summary: "DELETE DNS Load Balancer Pool.",
					description: "DELETE the specified dns_lb_pool.",
					purpose: "Delete dns-lb-pool",
					path: "/api/config/dns/namespaces/{namespace}/dns_lb_pools/{name}",
				},
				{
					action: "create",
					resourceType: "clone_from_dns_domain",
					operationId:
						"ves.io.schema.dns_zone.CustomAPI.CloneFromDNSDomain",
					summary: "Clone from DNSDomain.",
					description: "Cloning DNS domain to DNSZone.",
					purpose: "Create new clone-from-dns-domain",
					path: "/api/config/dns/namespaces/system/dns_zone/clone_from_dns_domain",
				},
				{
					action: "create",
					resourceType: "import",
					operationId:
						"ves.io.schema.dns_zone.CustomAPI.ImportF5CSZone",
					summary: "Import F5 Cloud Services DNS Zone.",
					description: "Import F5 Cloud Services DNS Zone.",
					purpose: "Create new import",
					path: "/api/config/dns/namespaces/system/dns_zone/import",
				},
				{
					action: "create",
					resourceType: "import_axfr",
					operationId: "ves.io.schema.dns_zone.CustomAPI.ImportAXFR",
					summary: "Import DNS Zone.",
					description: "Import DNS Zone via AXFR.",
					purpose: "Create new import-axfr",
					path: "/api/config/dns/namespaces/system/dns_zone/import_axfr",
				},
				{
					action: "create",
					resourceType: "import_bind_create",
					operationId:
						"ves.io.schema.dns_zone.CustomAPI.ImportBINDCreate",
					summary: "Import BIND Files.",
					description: "Import BIND Files to Create DNS Zones.",
					purpose: "Create new import-bind-create",
					path: "/api/config/dns/namespaces/system/dns_zone/import_bind_create",
				},
				{
					action: "create",
					resourceType: "import_bind_validate",
					operationId:
						"ves.io.schema.dns_zone.CustomAPI.ImportBINDValidate",
					summary: "Validate BIND Files.",
					description: "Validate BIND Files for Import.",
					purpose: "Create new import-bind-validate",
					path: "/api/config/dns/namespaces/system/dns_zone/import_bind_validate",
				},
				{
					action: "create",
					resourceType: "dns_zone",
					operationId: "ves.io.schema.dns_zone.API.Create",
					summary: "Create DNS Zone.",
					description:
						"Create DNS Zone in a given namespace. If one already exist it will give a error.",
					purpose: "Create new dns-zone",
					path: "/api/config/dns/namespaces/{metadata.namespace}/dns_zones",
				},
				{
					action: "replace",
					resourceType: "dns_zone",
					operationId: "ves.io.schema.dns_zone.API.Replace",
					summary: "Replace DNS Zone.",
					description: "Replace DNS Zone in a given namespace.",
					purpose: "Replace existing dns-zone",
					path: "/api/config/dns/namespaces/{metadata.namespace}/dns_zones/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "local_zone_file",
					operationId:
						"ves.io.schema.dns_zone.CustomAPI.GetLocalZoneFile",
					summary: "GET Local Zone File.",
					description: "GET local zone file from secondary DNS.",
					purpose: "List all local-zone-files",
					path: "/api/config/dns/namespaces/{namespace}/dns_zone/{dns_zone_name}/local_zone_file",
				},
				{
					action: "list",
					resourceType: "remote_zone_file",
					operationId:
						"ves.io.schema.dns_zone.CustomAPI.GetRemoteZoneFile",
					summary: "GET Remote Zone File.",
					description: "GET remote zone file from primary DNS.",
					purpose: "List all remote-zone-files",
					path: "/api/config/dns/namespaces/{namespace}/dns_zone/{dns_zone_name}/remote_zone_file",
				},
				{
					action: "list",
					resourceType: "export",
					operationId:
						"ves.io.schema.dns_zone.CustomAPI.ExportZoneFile",
					summary: "Export Zone File.",
					description: "Export Zone File.",
					purpose: "List all exports",
					path: "/api/config/dns/namespaces/{namespace}/dns_zone/{dns_zone_name}/zone_file/export",
				},
				{
					action: "list",
					resourceType: "dns_zone",
					operationId: "ves.io.schema.dns_zone.API.List",
					summary: "List DNS Zone.",
					description: "List the set of dns_zone in a namespace.",
					purpose: "List all dns-zones",
					path: "/api/config/dns/namespaces/{namespace}/dns_zones",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.dns_zone.CustomDataAPI.DnsZoneMetrics",
					summary: "DNS Zone Metrics.",
					description: "Request to GET DNS zone metrics data.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/{namespace}/dns_zones/metrics",
				},
				{
					action: "create",
					resourceType: "request_log",
					operationId:
						"ves.io.schema.dns_zone.CustomDataAPI.DnsZoneRequestLogs",
					summary: "GET DNS Zone Request Logs.",
					description: "Retrieve DNS Zone Request Logs.",
					purpose: "Create new request-log",
					path: "/api/data/namespaces/{namespace}/dns_zones/request_logs",
				},
				{
					action: "get",
					resourceType: "dns_zone",
					operationId: "ves.io.schema.dns_zone.API.Get",
					summary: "GET DNS Zone.",
					description: "GET DNS Zone details.",
					purpose: "Retrieve specific dns-zone",
					path: "/api/config/dns/namespaces/{namespace}/dns_zones/{name}",
				},
				{
					action: "delete",
					resourceType: "dns_zone",
					operationId: "ves.io.schema.dns_zone.API.Delete",
					summary: "DELETE DNS Zone.",
					description: "DELETE the specified dns_zone.",
					purpose: "Delete dns-zone",
					path: "/api/config/dns/namespaces/{namespace}/dns_zones/{name}",
				},
				{
					action: "create",
					resourceType: "rrset",
					operationId:
						"ves.io.schema.dns_zone.rrset.CustomAPI.Create",
					summary: "Create",
					description: "Create CustomAPI.",
					purpose: "Create new rrset",
					path: "/api/config/dns/namespaces/system/dns_zones/{dns_zone_name}/rrsets/{group_name}",
				},
				{
					action: "list",
					resourceType: "rrset",
					operationId: "ves.io.schema.dns_zone.rrset.CustomAPI.Get",
					summary: "GET",
					description: "Get CustomAPI.",
					purpose: "List all rrsets",
					path: "/api/config/dns/namespaces/system/dns_zones/{dns_zone_name}/rrsets/{group_name}/{record_name}/{type}",
				},
				{
					action: "replace",
					resourceType: "rrset",
					operationId:
						"ves.io.schema.dns_zone.rrset.CustomAPI.Replace",
					summary: "Replace",
					description: "Replace CustomAPI.",
					purpose: "Replace existing rrset",
					path: "/api/config/dns/namespaces/system/dns_zones/{dns_zone_name}/rrsets/{group_name}/{record_name}/{type}",
				},
				{
					action: "delete",
					resourceType: "rrset",
					operationId:
						"ves.io.schema.dns_zone.rrset.CustomAPI.Delete",
					summary: "DELETE",
					description: "Delete CustomAPI.",
					purpose: "Delete rrset",
					path: "/api/config/dns/namespaces/system/dns_zones/{dns_zone_name}/rrsets/{group_name}/{record_name}/{type}",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.dns_zone.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to DNS Management.",
					description: "Subscribe to DNS Management.",
					purpose: "Create new subscribe",
					path: "/api/config/dns/namespaces/system/dns_management/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.dns_zone.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to DNS Management.",
					description: "Unsubscribe to DNS Management.",
					purpose: "Create new unsubscribe",
					path: "/api/config/dns/namespaces/system/dns_management/addon/unsubscribe",
				},
			],
		},
	],
	[
		"generative_ai",
		{
			domain: "generative_ai",
			displayName: "Generative Ai",
			description:
				"Set up query evaluation and response handling for intelligent assistant workflows. Manage rating collection with positive and negative outcome tracking. Subscribe to data streams for traffic pattern detection and behavioral analysis. Allocate and deallocate IP resources for ML infrastructure. Control feature enablement and token management for telemetry collection paths.",
			descriptionShort:
				"Set up query evaluation and response handling for intelli...",
			resourceTypes: [
				"allocateip",
				"deallocateip",
				"enable_feature",
				"eval_query",
				"eval_query_feedback",
				"gettoken",
				"query",
				"query_feedback",
				"refresh_token",
				"subscribe",
				"unsubscribe",
			],
			operations: [
				{
					action: "create",
					resourceType: "eval_query",
					operationId:
						"ves.io.schema.ai_assistant.SahayaAPI.EvalAIAssistantQuery",
					summary: "Eval AI Assistant Query.",
					description:
						"Temporarily to be used in place of AIAssistantQuery for evaluating API access/RBAC check.",
					purpose: "Create new eval-query",
					path: "/api/gen-ai/namespaces/{namespace}/eval_query",
				},
				{
					action: "create",
					resourceType: "eval_query_feedback",
					operationId:
						"ves.io.schema.ai_assistant.SahayaAPI.EvalAIAssistantFeedback",
					summary: "Eval Feedback of AI Assistant Query.",
					description:
						"Temporarily to be used in place of AIAssistantFeedback for evaluating API access/RBAC check.",
					purpose: "Create new eval-query-feedback",
					path: "/api/gen-ai/namespaces/{namespace}/eval_query_feedback",
				},
				{
					action: "create",
					resourceType: "query",
					operationId:
						"ves.io.schema.ai_assistant.SahayaAPI.AIAssistantQuery",
					summary: "AI Assistant Query.",
					description:
						"Enable service by returning service account details.",
					purpose: "Create new query",
					path: "/api/gen-ai/namespaces/{namespace}/query",
				},
				{
					action: "create",
					resourceType: "query_feedback",
					operationId:
						"ves.io.schema.ai_assistant.SahayaAPI.AIAssistantFeedback",
					summary: "Feedback of AI Assistant Query.",
					description:
						"Enable service by returning service account details.",
					purpose: "Create new query-feedback",
					path: "/api/gen-ai/namespaces/{namespace}/query_feedback",
				},
				{
					action: "create",
					resourceType: "enable_feature",
					operationId:
						"ves.io.schema.ai_data.bfdp.CustomAPI.EnableFeature",
					summary: "Enable feature.",
					description:
						"Enable service by returning service account details.",
					purpose: "Create new enable-feature",
					path: "/api/ai_data/bfdp/namespaces/system/bfdp/enable_feature",
				},
				{
					action: "create",
					resourceType: "refresh_token",
					operationId:
						"ves.io.schema.ai_data.bfdp.CustomAPI.RefreshToken",
					summary: "Refresh Token.",
					description:
						"Enable service by returning service account details.",
					purpose: "Create new refresh-token",
					path: "/api/ai_data/bfdp/namespaces/system/bfdp/refresh_token",
				},
				{
					action: "create",
					resourceType: "gettoken",
					operationId:
						"ves.io.schema.ai_data.bfdp.subscription.CustomAPI.GetToken",
					summary: "Subscribe to BFDP pipeline.",
					description: "Subscribe to BFDP pipeline.",
					purpose: "Create new gettoken",
					path: "/api/ai_data/bfdp/namespaces/system/bfdp/gettoken",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.ai_data.bfdp.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to BFDP pipeline.",
					description: "Subscribe to BFDP pipeline.",
					purpose: "Create new subscribe",
					path: "/api/ai_data/bfdp/namespaces/system/bfdp/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.ai_data.bfdp.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to BFDP pipeline.",
					description: "Unsubscribe to BFDP pipeline.",
					purpose: "Create new unsubscribe",
					path: "/api/ai_data/bfdp/namespaces/system/bfdp/unsubscribe",
				},
				{
					action: "create",
					resourceType: "allocateip",
					operationId: "ves.io.schema.gia.CustomAPI.AllocateIP",
					summary: "Allocate IP through Global IP Allocator.",
					description:
						"AllocateIP will allocate an IP address for the tenant read from context.",
					purpose: "Create new allocateip",
					path: "/api/gia/gia/allocateip",
				},
				{
					action: "delete",
					resourceType: "deallocateip",
					operationId: "ves.io.schema.gia.CustomAPI.DeallocateIP",
					summary: "Deallocate IP through Global IP Allocator.",
					description:
						"DeallocateIP will de-allocate the specified IP address for tenant.",
					purpose: "Delete deallocateip",
					path: "/api/gia/gia/deallocateip",
				},
			],
		},
	],
	[
		"managed_kubernetes",
		{
			domain: "managed_kubernetes",
			displayName: "Managed Kubernetes",
			description:
				"Create granular access controls for namespace resources and non-resource URLs. Map permissions to users, groups, or service accounts through binding configurations. Deploy security admission enforcement using baseline, restricted, or privileged profiles. Register private image sources with credential management for secure pulls. Integrate with external managed solutions including EKS, AKS, and GKE infrastructure.",
			descriptionShort:
				"Create granular access controls for namespace resources a...",
			resourceTypes: [
				"container_registry",
				"k8s_cluster_role",
				"k8s_cluster_role_binding",
				"k8s_pod_security_admission",
				"k8s_pod_security_policy",
			],
			operations: [
				{
					action: "create",
					resourceType: "container_registry",
					operationId: "ves.io.schema.container_registry.API.Create",
					summary: "Create Container Registry.",
					description: "Shape of Container Registry.",
					purpose: "Create new container-registry",
					path: "/api/config/namespaces/{metadata.namespace}/container_registrys",
				},
				{
					action: "replace",
					resourceType: "container_registry",
					operationId: "ves.io.schema.container_registry.API.Replace",
					summary: "Replace Container Registry.",
					description: "Shape of Container Registry.",
					purpose: "Replace existing container-registry",
					path: "/api/config/namespaces/{metadata.namespace}/container_registrys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "container_registry",
					operationId: "ves.io.schema.container_registry.API.List",
					summary: "List Container Registry.",
					description:
						"List the set of container_registry in a namespace.",
					purpose: "List all container-registrys",
					path: "/api/config/namespaces/{namespace}/container_registrys",
				},
				{
					action: "get",
					resourceType: "container_registry",
					operationId: "ves.io.schema.container_registry.API.Get",
					summary: "GET Container Registry.",
					description: "Shape of Container Registry.",
					purpose: "Retrieve specific container-registry",
					path: "/api/config/namespaces/{namespace}/container_registrys/{name}",
				},
				{
					action: "delete",
					resourceType: "container_registry",
					operationId: "ves.io.schema.container_registry.API.Delete",
					summary: "DELETE Container Registry.",
					description: "DELETE the specified container_registry.",
					purpose: "Delete container-registry",
					path: "/api/config/namespaces/{namespace}/container_registrys/{name}",
				},
				{
					action: "create",
					resourceType: "k8s_cluster_role",
					operationId: "ves.io.schema.k8s_cluster_role.API.Create",
					summary: "Create Configuration Specification.",
					description:
						"Create k8s_cluster_role will create the object in the storage backend for namespace metadata.namespace.",
					purpose: "Create new k8s-cluster-role",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_cluster_roles",
				},
				{
					action: "replace",
					resourceType: "k8s_cluster_role",
					operationId: "ves.io.schema.k8s_cluster_role.API.Replace",
					summary: "Replace Configuration Specification.",
					description:
						"Replacing an k8s_cluster_role object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing k8s-cluster-role",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_cluster_roles/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "k8s_cluster_role",
					operationId: "ves.io.schema.k8s_cluster_role.API.List",
					summary: "List K8s Cluster Role.",
					description:
						"List the set of k8s_cluster_role in a namespace.",
					purpose: "List all k8s-cluster-roles",
					path: "/api/config/namespaces/{namespace}/k8s_cluster_roles",
				},
				{
					action: "get",
					resourceType: "k8s_cluster_role",
					operationId: "ves.io.schema.k8s_cluster_role.API.Get",
					summary: "GET Configuration Specification.",
					description:
						"GET k8s_cluster_role will GET the object from the storage backend for namespace metadata.namespace.",
					purpose: "Retrieve specific k8s-cluster-role",
					path: "/api/config/namespaces/{namespace}/k8s_cluster_roles/{name}",
				},
				{
					action: "delete",
					resourceType: "k8s_cluster_role",
					operationId: "ves.io.schema.k8s_cluster_role.API.Delete",
					summary: "DELETE K8s Cluster Role.",
					description: "DELETE the specified k8s_cluster_role.",
					purpose: "Delete k8s-cluster-role",
					path: "/api/config/namespaces/{namespace}/k8s_cluster_roles/{name}",
				},
				{
					action: "create",
					resourceType: "k8s_cluster_role_binding",
					operationId:
						"ves.io.schema.k8s_cluster_role_binding.API.Create",
					summary: "Create Configuration Specification.",
					description:
						"Create k8s_cluster_role_binding will create the object in the storage backend for namespace metadata.namespace.",
					purpose: "Create new k8s-cluster-role-binding",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_cluster_role_bindings",
				},
				{
					action: "replace",
					resourceType: "k8s_cluster_role_binding",
					operationId:
						"ves.io.schema.k8s_cluster_role_binding.API.Replace",
					summary: "Replace Configuration Specification.",
					description:
						"Replacing an k8s_cluster_role_binding object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing k8s-cluster-role-binding",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_cluster_role_bindings/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "k8s_cluster_role_binding",
					operationId:
						"ves.io.schema.k8s_cluster_role_binding.API.List",
					summary: "List K8s Cluster Role Binding.",
					description:
						"List the set of k8s_cluster_role_binding in a namespace.",
					purpose: "List all k8s-cluster-role-bindings",
					path: "/api/config/namespaces/{namespace}/k8s_cluster_role_bindings",
				},
				{
					action: "get",
					resourceType: "k8s_cluster_role_binding",
					operationId:
						"ves.io.schema.k8s_cluster_role_binding.API.Get",
					summary: "GET Configuration Specification.",
					description:
						"GET k8s_cluster_role_binding will GET the object from the storage backend for namespace metadata.namespace.",
					purpose: "Retrieve specific k8s-cluster-role-binding",
					path: "/api/config/namespaces/{namespace}/k8s_cluster_role_bindings/{name}",
				},
				{
					action: "delete",
					resourceType: "k8s_cluster_role_binding",
					operationId:
						"ves.io.schema.k8s_cluster_role_binding.API.Delete",
					summary: "DELETE K8s Cluster Role Binding.",
					description:
						"DELETE the specified k8s_cluster_role_binding.",
					purpose: "Delete k8s-cluster-role-binding",
					path: "/api/config/namespaces/{namespace}/k8s_cluster_role_bindings/{name}",
				},
				{
					action: "create",
					resourceType: "k8s_pod_security_admission",
					operationId:
						"ves.io.schema.k8s_pod_security_admission.API.Create",
					summary: "Create Configuration Specification.",
					description:
						"Create k8s_pod_security_admission will create the object in the storage backend.",
					purpose: "Create new k8s-pod-security-admission",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_pod_security_admissions",
				},
				{
					action: "replace",
					resourceType: "k8s_pod_security_admission",
					operationId:
						"ves.io.schema.k8s_pod_security_admission.API.Replace",
					summary: "Replace Configuration Specification.",
					description:
						"Replacing an k8s_pod_security_admission object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing k8s-pod-security-admission",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_pod_security_admissions/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "k8s_pod_security_admission",
					operationId:
						"ves.io.schema.k8s_pod_security_admission.API.List",
					summary: "List K8s Pod Security Admission.",
					description:
						"List the set of k8s_pod_security_admission in a namespace.",
					purpose: "List all k8s-pod-security-admissions",
					path: "/api/config/namespaces/{namespace}/k8s_pod_security_admissions",
				},
				{
					action: "get",
					resourceType: "k8s_pod_security_admission",
					operationId:
						"ves.io.schema.k8s_pod_security_admission.API.Get",
					summary: "GET Configuration Specification.",
					description:
						"GET k8s_pod_security_admission will GET the object from the storage backend.",
					purpose: "Retrieve specific k8s-pod-security-admission",
					path: "/api/config/namespaces/{namespace}/k8s_pod_security_admissions/{name}",
				},
				{
					action: "delete",
					resourceType: "k8s_pod_security_admission",
					operationId:
						"ves.io.schema.k8s_pod_security_admission.API.Delete",
					summary: "DELETE K8s Pod Security Admission.",
					description:
						"DELETE the specified k8s_pod_security_admission.",
					purpose: "Delete k8s-pod-security-admission",
					path: "/api/config/namespaces/{namespace}/k8s_pod_security_admissions/{name}",
				},
				{
					action: "create",
					resourceType: "k8s_pod_security_policy",
					operationId:
						"ves.io.schema.k8s_pod_security_policy.API.Create",
					summary: "Create Configuration Specification.",
					description:
						"Create k8s_pod_security_policy will create the object in the storage backend for namespace metadata.namespace.",
					purpose: "Create new k8s-pod-security-policy",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_pod_security_policys",
				},
				{
					action: "replace",
					resourceType: "k8s_pod_security_policy",
					operationId:
						"ves.io.schema.k8s_pod_security_policy.API.Replace",
					summary: "Replace Configuration Specification.",
					description:
						"Replacing an k8s_pod_security_policy object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing k8s-pod-security-policy",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_pod_security_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "k8s_pod_security_policy",
					operationId:
						"ves.io.schema.k8s_pod_security_policy.API.List",
					summary: "List K8s Pod Security Policy.",
					description:
						"List the set of k8s_pod_security_policy in a namespace.",
					purpose: "List all k8s-pod-security-policys",
					path: "/api/config/namespaces/{namespace}/k8s_pod_security_policys",
				},
				{
					action: "get",
					resourceType: "k8s_pod_security_policy",
					operationId:
						"ves.io.schema.k8s_pod_security_policy.API.Get",
					summary: "GET Configuration Specification.",
					description:
						"GET k8s_pod_security_policy will GET the object from the storage backend for namespace metadata.namespace.",
					purpose: "Retrieve specific k8s-pod-security-policy",
					path: "/api/config/namespaces/{namespace}/k8s_pod_security_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "k8s_pod_security_policy",
					operationId:
						"ves.io.schema.k8s_pod_security_policy.API.Delete",
					summary: "DELETE K8s Pod Security Policy.",
					description:
						"DELETE the specified k8s_pod_security_policy.",
					purpose: "Delete k8s-pod-security-policy",
					path: "/api/config/namespaces/{namespace}/k8s_pod_security_policys/{name}",
				},
			],
		},
	],
	[
		"marketplace",
		{
			domain: "marketplace",
			displayName: "Marketplace",
			description:
				"Set up secure tunnel connections using IKEv1/IKEv2 parameters, GRE encapsulation with source and destination addressing, or dedicated link types. Manage DPD keep-alive timers and tunnel termination points for reliable connectivity. Activate purchasable services with namespace-scoped status tracking. Create custom portal widgets for interface integration and configure Cloud Manager instances for Terraform and infrastructure automation workflows.",
			descriptionShort:
				"Set up secure tunnel connections using IKEv1/IKEv2 parame...",
			resourceTypes: [
				"activation-statu",
				"addon_service",
				"addon_subscription",
				"all-activation-statu",
				"cminstance",
				"external_connector",
				"force-delete",
				"generate_token",
				"get_security_config",
				"navigation_tile",
				"plan",
				"register",
				"registration_detail",
				"run",
				"send_email",
				"signup",
				"statu",
				"terraform_parameter",
				"third_party_application",
				"view_internal",
			],
			operations: [
				{
					action: "get",
					resourceType: "addon_service",
					operationId:
						"ves.io.schema.pbac.addon_service.CustomAPI.GetAddonServiceDetails",
					summary: "GET Addon Service Details.",
					description:
						"Retrieves addon service information for the given addon service name.",
					purpose: "Retrieve specific addon-service",
					path: "/api/web/custom/namespaces/shared/addon_services/{name}",
				},
				{
					action: "list",
					resourceType: "activation-statu",
					operationId:
						"ves.io.schema.pbac.addon_service.CustomAPI.GetActivationStatus",
					summary: "Addon Service Activation Status.",
					description:
						"GET current subscription status for an addon service. Response can indicate whether the service was successfully subscribed or in pending state.",
					purpose: "List all activation-status",
					path: "/api/web/namespaces/system/addon_services/{addon_service}/activation-status",
				},
				{
					action: "list",
					resourceType: "all-activation-statu",
					operationId:
						"ves.io.schema.pbac.addon_service.CustomAPI.GetAllServiceTiersActivationStatus",
					summary: "All Addon Service Activation Status.",
					description:
						"GET current subscription status for all addon services in a feature tier. Response can indicate whether the service was successfully subscribed or in pending state.",
					purpose: "List all all-activation-status",
					path: "/api/web/namespaces/system/addon_services/{addon_service}/all-activation-status",
				},
				{
					action: "list",
					resourceType: "addon_service",
					operationId: "ves.io.schema.pbac.addon_service.API.List",
					summary: "List Addon Service.",
					description:
						"List the set of addon_service in a namespace.",
					purpose: "List all addon-services",
					path: "/api/web/namespaces/{namespace}/addon_services",
				},
				{
					action: "get",
					resourceType: "addon_service",
					operationId: "ves.io.schema.pbac.addon_service.API.Get",
					summary: "GET Addon Service.",
					description:
						"GET addon_service reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific addon-service",
					path: "/api/web/namespaces/{namespace}/addon_services/{name}",
				},
				{
					action: "create",
					resourceType: "addon_subscription",
					operationId:
						"ves.io.schema.pbac.addon_subscription.API.Create",
					summary: "Create Addon Subscription.",
					description:
						"Create a new Addon Subscription with Addon Subscription State.",
					purpose: "Create new addon-subscription",
					path: "/api/web/namespaces/{metadata.namespace}/addon_subscriptions",
				},
				{
					action: "replace",
					resourceType: "addon_subscription",
					operationId:
						"ves.io.schema.pbac.addon_subscription.API.Replace",
					summary: "Replace Addon Subscription.",
					description:
						"Replace a given Addon Subscription with with Addon Subscription State.",
					purpose: "Replace existing addon-subscription",
					path: "/api/web/namespaces/{metadata.namespace}/addon_subscriptions/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "addon_subscription",
					operationId:
						"ves.io.schema.pbac.addon_subscription.API.List",
					summary: "List Addon Subscrption.",
					description:
						"List the set of addon_subscription in a namespace.",
					purpose: "List all addon-subscriptions",
					path: "/api/web/namespaces/{namespace}/addon_subscriptions",
				},
				{
					action: "get",
					resourceType: "addon_subscription",
					operationId:
						"ves.io.schema.pbac.addon_subscription.API.Get",
					summary: "GET Addon Subsciption.",
					description:
						"GET Addon Subsciption reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific addon-subscription",
					path: "/api/web/namespaces/{namespace}/addon_subscriptions/{name}",
				},
				{
					action: "delete",
					resourceType: "addon_subscription",
					operationId:
						"ves.io.schema.pbac.addon_subscription.API.Delete",
					summary: "DELETE Addon Subscrption.",
					description: "DELETE the specified addon_subscription.",
					purpose: "Delete addon-subscription",
					path: "/api/web/namespaces/{namespace}/addon_subscriptions/{name}",
				},
				{
					action: "create",
					resourceType: "cminstance",
					operationId: "ves.io.schema.cminstance.API.Create",
					summary: "Create Central Manager Insatnce.",
					description:
						"Create App type will create the configuration in namespace metadata.namespace.",
					purpose: "Create new cminstance",
					path: "/api/config/namespaces/{metadata.namespace}/cminstances",
				},
				{
					action: "replace",
					resourceType: "cminstance",
					operationId: "ves.io.schema.cminstance.API.Replace",
					summary: "Replace Central Manager Instance.",
					description:
						"Update the configuration by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing cminstance",
					path: "/api/config/namespaces/{metadata.namespace}/cminstances/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "cminstance",
					operationId: "ves.io.schema.cminstance.API.List",
					summary: "List Central Manager Instance.",
					description: "List the set of cminstance in a namespace.",
					purpose: "List all cminstances",
					path: "/api/config/namespaces/{namespace}/cminstances",
				},
				{
					action: "get",
					resourceType: "cminstance",
					operationId: "ves.io.schema.cminstance.API.Get",
					summary: "GET Central Manager Instance.",
					description:
						"GET CMInstance will read the configuration from namespace metadata.namespace.",
					purpose: "Retrieve specific cminstance",
					path: "/api/config/namespaces/{namespace}/cminstances/{name}",
				},
				{
					action: "delete",
					resourceType: "cminstance",
					operationId: "ves.io.schema.cminstance.API.Delete",
					summary: "DELETE Central Manager Instance.",
					description: "DELETE the specified cminstance.",
					purpose: "Delete cminstance",
					path: "/api/config/namespaces/{namespace}/cminstances/{name}",
				},
				{
					action: "create",
					resourceType: "external_connector",
					operationId:
						"ves.io.schema.views.external_connector.API.Create",
					summary: "Create external_connector configuration.",
					description:
						"Shape of the external_connector configuration specification.",
					purpose: "Create new external-connector",
					path: "/api/config/namespaces/{metadata.namespace}/external_connectors",
				},
				{
					action: "replace",
					resourceType: "external_connector",
					operationId:
						"ves.io.schema.views.external_connector.API.Replace",
					summary: "Replace external_connector configuration.",
					description:
						"Shape of the external_connector configuration specification.",
					purpose: "Replace existing external-connector",
					path: "/api/config/namespaces/{metadata.namespace}/external_connectors/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "external_connector",
					operationId:
						"ves.io.schema.views.external_connector.API.List",
					summary: "List External Connector Configuration.",
					description:
						"List the set of external_connector in a namespace.",
					purpose: "List all external-connectors",
					path: "/api/config/namespaces/{namespace}/external_connectors",
				},
				{
					action: "get",
					resourceType: "external_connector",
					operationId:
						"ves.io.schema.views.external_connector.API.Get",
					summary: "GET external_connector configuration.",
					description:
						"Shape of the external_connector configuration specification.",
					purpose: "Retrieve specific external-connector",
					path: "/api/config/namespaces/{namespace}/external_connectors/{name}",
				},
				{
					action: "delete",
					resourceType: "external_connector",
					operationId:
						"ves.io.schema.views.external_connector.API.Delete",
					summary: "DELETE External Connector Configuration.",
					description: "DELETE the specified external_connector.",
					purpose: "Delete external-connector",
					path: "/api/config/namespaces/{namespace}/external_connectors/{name}",
				},
				{
					action: "list",
					resourceType: "navigation_tile",
					operationId: "ves.io.schema.pbac.navigation_tile.API.List",
					summary: "List Navigation Tile.",
					description:
						"List the set of navigation_tile in a namespace.",
					purpose: "List all navigation-tiles",
					path: "/api/web/namespaces/{namespace}/navigation_tiles",
				},
				{
					action: "get",
					resourceType: "navigation_tile",
					operationId: "ves.io.schema.pbac.navigation_tile.API.Get",
					summary: "GET Navigation Tile.",
					description:
						"GET navigation_tile reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific navigation-tile",
					path: "/api/web/namespaces/{namespace}/navigation_tiles/{name}",
				},
				{
					action: "create",
					resourceType: "register",
					operationId:
						"ves.io.schema.marketplace.aws_account.OnboardCustomAPI.RegisterNewAWSAccount",
					summary: "Register New AWS Account.",
					description:
						"Use this API to register F5XC AWS marketplace product for F5XC service.",
					purpose: "Create new register",
					path: "/no_auth/namespaces/system/aws/f5xc-saas/register",
				},
				{
					action: "create",
					resourceType: "signup",
					operationId:
						"ves.io.schema.marketplace.aws_account.OnboardCustomAPI.SignupAWSAccount",
					summary: "Signup AWS Account.",
					description:
						"Use this API to signup AWS account for F5XC service.",
					purpose: "Create new signup",
					path: "/no_auth/namespaces/system/aws/f5xc-saas/signup",
				},
				{
					action: "list",
					resourceType: "plan",
					operationId: "ves.io.schema.pbac.plan.API.List",
					summary: "List Plan",
					description: "List the set of plan in a namespace.",
					purpose: "List all plans",
					path: "/api/web/namespaces/{namespace}/plans",
				},
				{
					action: "get",
					resourceType: "plan",
					operationId: "ves.io.schema.pbac.plan.API.Get",
					summary: "GET Plan",
					description:
						"GET plan reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific plan",
					path: "/api/web/namespaces/{namespace}/plans/{name}",
				},
				{
					action: "replace",
					resourceType: "third_party_application",
					operationId:
						"ves.io.schema.views.third_party_application.API.Replace",
					summary: "Replace Third Party Applicationr.",
					description:
						"Shape of the Third Party Application specification.",
					purpose: "Replace existing third-party-application",
					path: "/api/config/namespaces/{metadata.namespace}/third_party_applications/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "get_security_config",
					operationId:
						"ves.io.schema.views.third_party_application.CustomAPI.GetSecurityConfig",
					summary: "GET Security Config for Third Party Application.",
					description:
						"Fetch the corresponding Security Config for the given Third Party Application.",
					purpose: "Create new get-security-config",
					path: "/api/config/namespaces/{namespace}/third_party_application/get_security_config",
				},
				{
					action: "list",
					resourceType: "third_party_application",
					operationId:
						"ves.io.schema.views.third_party_application.API.List",
					summary: "List Third Party Application.",
					description:
						"List the set of third_party_application in a namespace.",
					purpose: "List all third-party-applications",
					path: "/api/config/namespaces/{namespace}/third_party_applications",
				},
				{
					action: "get",
					resourceType: "third_party_application",
					operationId:
						"ves.io.schema.views.third_party_application.API.Get",
					summary: "GET Third Party Application.",
					description:
						"Shape of the Third Party Application specification.",
					purpose: "Retrieve specific third-party-application",
					path: "/api/config/namespaces/{namespace}/third_party_applications/{name}",
				},
				{
					action: "get",
					resourceType: "generate_token",
					operationId:
						"ves.io.schema.views.third_party_application.CustomAPI.GenerateToken",
					summary: "Generate Token.",
					description:
						"Generate token that will be used by the third party application.",
					purpose: "Retrieve specific generate-token",
					path: "/api/config/namespaces/{namespace}/third_party_applications/{name}/generate_token",
				},
				{
					action: "list",
					resourceType: "view_internal",
					operationId:
						"ves.io.schema.views.view_internal.CustomAPI.Get",
					summary: "GET Internal object for view.",
					description: "Returned internal object for a given view.",
					purpose: "List all view-internals",
					path: "/api/config/namespaces/{namespace}/view_internal/{view_kind}/{view_name}",
				},
				{
					action: "create",
					resourceType: "force-delete",
					operationId:
						"ves.io.schema.views.terraform_parameters.CustomActionAPI.ForceDelete",
					summary: "Force DELETE view.",
					description:
						"Force DELETE view object. This can result in staled objects in cloud provider.",
					purpose: "Create new force-delete",
					path: "/api/terraform/namespaces/{namespace}/terraform/{view_kind}/{view_name}/force-delete",
				},
				{
					action: "create",
					resourceType: "run",
					operationId:
						"ves.io.schema.views.terraform_parameters.CustomActionAPI.Run",
					summary: "Run Terraform Action for view.",
					description:
						"Perform terraform actions for a given view. Supported actions are apply and plan.",
					purpose: "Create new run",
					path: "/api/terraform/namespaces/{namespace}/terraform/{view_kind}/{view_name}/run",
				},
				{
					action: "list",
					resourceType: "terraform_parameter",
					operationId:
						"ves.io.schema.views.terraform_parameters.CustomAPI.Get",
					summary: "GET Terraform Parameters for view.",
					description:
						"Returned from list of terraform parameter objects for a given view.",
					purpose: "List all terraform-parameters",
					path: "/api/config/namespaces/{namespace}/terraform_parameters/{view_kind}/{view_name}",
				},
				{
					action: "list",
					resourceType: "statu",
					operationId:
						"ves.io.schema.views.terraform_parameters.CustomAPI.GetStatus",
					summary: "GET Status of Terraform for view.",
					description:
						"Returned from list of terraform parameter status objects for a given view.",
					purpose: "List all status",
					path: "/api/config/namespaces/{namespace}/terraform_parameters/{view_kind}/{view_name}/status",
				},
				{
					action: "create",
					resourceType: "signup",
					operationId:
						"ves.io.schema.marketplace.xc_saas.CustomAPI.SignupXCSaaS",
					summary: "Signup XC SaaS.",
					description:
						"Use this API to signup registered Azure Service Bus (ASB) provisioning message for F5XC service.",
					purpose: "Create new signup",
					path: "/no_auth/namespaces/system/f5xc-saas/signup",
				},
				{
					action: "list",
					resourceType: "registration_detail",
					operationId:
						"ves.io.schema.marketplace.xc_saas.CustomAPI.GetRegistrationDetails",
					summary: "GET Registration Details.",
					description:
						"Use this API to to GET registration details (currently limited to email address and domain) associated with a specific asb_message object.",
					purpose: "List all registration-details",
					path: "/no_auth/namespaces/system/f5xc-saas/signup/registration_details",
				},
				{
					action: "create",
					resourceType: "send_email",
					operationId:
						"ves.io.schema.marketplace.xc_saas.CustomAPI.SendSignupEmail",
					summary: "Send Signup Email.",
					description:
						"Use this API to send a tenant provisioning signup email when the signup URL link in the previously sent email has expired or is no longer accessible.",
					purpose: "Create new send-email",
					path: "/no_auth/namespaces/system/f5xc-saas/signup/send_email",
				},
			],
		},
	],
	[
		"network",
		{
			domain: "network",
			displayName: "Network",
			description:
				"Deploy secure site connectivity using IPsec tunnels with customizable IKE phase settings, encryption algorithms, and DH groups. Configure BGP routing with peer state monitoring, ASN management, and traffic policies. Set up SRv6 segments, IP prefix sets, and subnet definitions. Manage DC cluster groups for data center integration and define routes for traffic steering across distributed infrastructure.",
			descriptionShort:
				"Deploy secure site connectivity using IPsec tunnels with ...",
			resourceTypes: [
				"address_allocator",
				"advertise_policy",
				"bgp",
				"bgp_asn_set",
				"bgp_peer",
				"bgp_route",
				"bgp_routing_policy",
				"bgpstatu",
				"dc_cluster_group",
				"forwarding_classs",
				"ike1",
				"ike2",
				"ike_phase1_profile",
				"ike_phase2_profile",
				"ip_prefix_set",
				"metric",
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
			operations: [
				{
					action: "create",
					resourceType: "address_allocator",
					operationId: "ves.io.schema.address_allocator.API.Create",
					summary: "Create Address Allocator.",
					description:
						"Create Address Allocator will create an address allocator object in 'system' namespace of the user.",
					purpose: "Create new address-allocator",
					path: "/api/config/namespaces/{metadata.namespace}/address_allocators",
				},
				{
					action: "list",
					resourceType: "address_allocator",
					operationId: "ves.io.schema.address_allocator.API.List",
					summary: "List Address Allocator.",
					description:
						"List the set of address_allocator in a namespace.",
					purpose: "List all address-allocators",
					path: "/api/config/namespaces/{namespace}/address_allocators",
				},
				{
					action: "get",
					resourceType: "address_allocator",
					operationId: "ves.io.schema.address_allocator.API.Get",
					summary: "GET Address Allocator.",
					description:
						"GET Address Allocator will GET address allocator object from system namespace.",
					purpose: "Retrieve specific address-allocator",
					path: "/api/config/namespaces/{namespace}/address_allocators/{name}",
				},
				{
					action: "delete",
					resourceType: "address_allocator",
					operationId: "ves.io.schema.address_allocator.API.Delete",
					summary: "DELETE Address Allocator.",
					description: "DELETE the specified address_allocator.",
					purpose: "Delete address-allocator",
					path: "/api/config/namespaces/{namespace}/address_allocators/{name}",
				},
				{
					action: "create",
					resourceType: "advertise_policy",
					operationId: "ves.io.schema.advertise_policy.API.Create",
					summary: "Create Advertise Policy.",
					description:
						"Advertise_policy object controls how and where a service represented by a given virtual_host object is advertised to consumers.",
					purpose: "Create new advertise-policy",
					path: "/api/config/namespaces/{metadata.namespace}/advertise_policys",
				},
				{
					action: "replace",
					resourceType: "advertise_policy",
					operationId: "ves.io.schema.advertise_policy.API.Replace",
					summary: "Replace Advertise Policy.",
					description:
						"Advertise_policy object controls how and where a service represented by a given virtual_host object is advertised to consumers.",
					purpose: "Replace existing advertise-policy",
					path: "/api/config/namespaces/{metadata.namespace}/advertise_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "advertise_policy",
					operationId: "ves.io.schema.advertise_policy.API.List",
					summary: "List Advertise Policy.",
					description:
						"List the set of advertise_policy in a namespace.",
					purpose: "List all advertise-policys",
					path: "/api/config/namespaces/{namespace}/advertise_policys",
				},
				{
					action: "get",
					resourceType: "advertise_policy",
					operationId: "ves.io.schema.advertise_policy.API.Get",
					summary: "GET Advertise Policy.",
					description:
						"GET advertise_policy read a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific advertise-policy",
					path: "/api/config/namespaces/{namespace}/advertise_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "advertise_policy",
					operationId: "ves.io.schema.advertise_policy.API.Delete",
					summary: "DELETE Advertise Policy.",
					description: "DELETE the specified advertise_policy.",
					purpose: "Delete advertise-policy",
					path: "/api/config/namespaces/{namespace}/advertise_policys/{name}",
				},
				{
					action: "create",
					resourceType: "bgp",
					operationId: "ves.io.schema.bgp.API.Create",
					summary: "Create BGP.",
					description:
						"BGP object is the configuration for peering with external BGP servers. It is created by users in system namespace.",
					purpose: "Create new bgp",
					path: "/api/config/namespaces/{metadata.namespace}/bgps",
				},
				{
					action: "replace",
					resourceType: "bgp",
					operationId: "ves.io.schema.bgp.API.Replace",
					summary: "Replace BGP.",
					description:
						"BGP object is the configuration for peering with external BGP servers. Replace BGP will replace the contents of given BGP object.",
					purpose: "Replace existing bgp",
					path: "/api/config/namespaces/{metadata.namespace}/bgps/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "bgp",
					operationId: "ves.io.schema.bgp.API.List",
					summary: "List BGP",
					description: "List the set of BGP in a namespace.",
					purpose: "List all bgps",
					path: "/api/config/namespaces/{namespace}/bgps",
				},
				{
					action: "get",
					resourceType: "bgp",
					operationId: "ves.io.schema.bgp.API.Get",
					summary: "GET BGP",
					description:
						"BGP object is the configuration for peering with external BGP servers. GET BGP reads from system namespace.",
					purpose: "Retrieve specific bgp",
					path: "/api/config/namespaces/{namespace}/bgps/{name}",
				},
				{
					action: "delete",
					resourceType: "bgp",
					operationId: "ves.io.schema.bgp.API.Delete",
					summary: "DELETE BGP.",
					description: "DELETE the specified BGP.",
					purpose: "Delete bgp",
					path: "/api/config/namespaces/{namespace}/bgps/{name}",
				},
				{
					action: "list",
					resourceType: "bgpstatu",
					operationId: "ves.io.schema.bgp.CustomAPI.GetBgpStatus",
					summary: "GET BGP Status for view.",
					description:
						"Returned from list of BGP status objects for a given view.",
					purpose: "List all bgpstatus",
					path: "/api/config/namespaces/{namespace}/bgpstatus/{view_name}",
				},
				{
					action: "create",
					resourceType: "bgp_asn_set",
					operationId: "ves.io.schema.bgp_asn_set.API.Create",
					summary: "Create BGP ASN Set.",
					description:
						"Create bgp_asn_set creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new bgp-asn-set",
					path: "/api/config/namespaces/{metadata.namespace}/bgp_asn_sets",
				},
				{
					action: "replace",
					resourceType: "bgp_asn_set",
					operationId: "ves.io.schema.bgp_asn_set.API.Replace",
					summary: "Replace BGP ASN Set.",
					description:
						"Replace bgp_asn_set replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing bgp-asn-set",
					path: "/api/config/namespaces/{metadata.namespace}/bgp_asn_sets/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "bgp_asn_set",
					operationId: "ves.io.schema.bgp_asn_set.API.List",
					summary: "List BGP ASN Set.",
					description: "List the set of bgp_asn_set in a namespace.",
					purpose: "List all bgp-asn-sets",
					path: "/api/config/namespaces/{namespace}/bgp_asn_sets",
				},
				{
					action: "get",
					resourceType: "bgp_asn_set",
					operationId: "ves.io.schema.bgp_asn_set.API.Get",
					summary: "GET BGP ASN Set.",
					description:
						"GET bgp_asn_set reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific bgp-asn-set",
					path: "/api/config/namespaces/{namespace}/bgp_asn_sets/{name}",
				},
				{
					action: "delete",
					resourceType: "bgp_asn_set",
					operationId: "ves.io.schema.bgp_asn_set.API.Delete",
					summary: "DELETE BGP ASN Set.",
					description: "DELETE the specified bgp_asn_set.",
					purpose: "Delete bgp-asn-set",
					path: "/api/config/namespaces/{namespace}/bgp_asn_sets/{name}",
				},
				{
					action: "list",
					resourceType: "bgp_peer",
					operationId:
						"ves.io.schema.operate.bgp.CustomPublicAPI.ShowBGPPeers",
					summary: "Show BGP Peer Info.",
					description: "Show BGP Peer information.",
					purpose: "List all bgp-peers",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/bgp_peers",
				},
				{
					action: "list",
					resourceType: "bgp_route",
					operationId:
						"ves.io.schema.operate.bgp.CustomPublicAPI.ShowBGPRoutes",
					summary: "Show BGP Routes.",
					description: "Show routes exported / imported via BGP.",
					purpose: "List all bgp-routes",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/bgp_routes",
				},
				{
					action: "create",
					resourceType: "bgp_routing_policy",
					operationId: "ves.io.schema.bgp_routing_policy.API.Create",
					summary: "Create BGP Routing Policy.",
					description:
						"BGP Routing Policy is a list of rules containing match criteria and action to be applied. These rules help contol routes which are imported or exported to BGP peers.",
					purpose: "Create new bgp-routing-policy",
					path: "/api/config/namespaces/{metadata.namespace}/bgp_routing_policys",
				},
				{
					action: "replace",
					resourceType: "bgp_routing_policy",
					operationId: "ves.io.schema.bgp_routing_policy.API.Replace",
					summary: "Replace BGP Routing Policy.",
					description:
						"BGP Routing Policy is a list of rules containing match criteria and action to be applied. These rules help contol routes which are imported or exported to BGP peers.",
					purpose: "Replace existing bgp-routing-policy",
					path: "/api/config/namespaces/{metadata.namespace}/bgp_routing_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "bgp_routing_policy",
					operationId: "ves.io.schema.bgp_routing_policy.API.List",
					summary: "List BGP Routing Policy.",
					description:
						"List the set of bgp_routing_policy in a namespace.",
					purpose: "List all bgp-routing-policys",
					path: "/api/config/namespaces/{namespace}/bgp_routing_policys",
				},
				{
					action: "get",
					resourceType: "bgp_routing_policy",
					operationId: "ves.io.schema.bgp_routing_policy.API.Get",
					summary: "GET BGP Routing Policy.",
					description:
						"BGP Routing Policy is a list of rules containing match criteria and action to be applied. These rules help contol routes which are imported or exported to BGP peers.",
					purpose: "Retrieve specific bgp-routing-policy",
					path: "/api/config/namespaces/{namespace}/bgp_routing_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "bgp_routing_policy",
					operationId: "ves.io.schema.bgp_routing_policy.API.Delete",
					summary: "DELETE BGP Routing Policy.",
					description: "DELETE the specified bgp_routing_policy.",
					purpose: "Delete bgp-routing-policy",
					path: "/api/config/namespaces/{namespace}/bgp_routing_policys/{name}",
				},
				{
					action: "create",
					resourceType: "dc_cluster_group",
					operationId: "ves.io.schema.dc_cluster_group.API.Create",
					summary: "Create DC Cluster Group.",
					description: "Create DC Cluster group in given namespace.",
					purpose: "Create new dc-cluster-group",
					path: "/api/config/namespaces/{metadata.namespace}/dc_cluster_groups",
				},
				{
					action: "replace",
					resourceType: "dc_cluster_group",
					operationId: "ves.io.schema.dc_cluster_group.API.Replace",
					summary: "Replace DC Cluster Group.",
					description:
						"Replace given DC Cluster Group in given namespace.",
					purpose: "Replace existing dc-cluster-group",
					path: "/api/config/namespaces/{metadata.namespace}/dc_cluster_groups/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "dc_cluster_group",
					operationId: "ves.io.schema.dc_cluster_group.API.List",
					summary: "List DC Cluster Group.",
					description:
						"List the set of dc_cluster_group in a namespace.",
					purpose: "List all dc-cluster-groups",
					path: "/api/config/namespaces/{namespace}/dc_cluster_groups",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.dc_cluster_group.CustomDataAPI.Metrics",
					summary: "Metrics",
					description: "DC Cluster Group metrics.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/{namespace}/dc_cluster_groups/metrics",
				},
				{
					action: "get",
					resourceType: "dc_cluster_group",
					operationId: "ves.io.schema.dc_cluster_group.API.Get",
					summary: "GET DC Cluster Group.",
					description: "Gets DC Cluster Group in given namespace.",
					purpose: "Retrieve specific dc-cluster-group",
					path: "/api/config/namespaces/{namespace}/dc_cluster_groups/{name}",
				},
				{
					action: "delete",
					resourceType: "dc_cluster_group",
					operationId: "ves.io.schema.dc_cluster_group.API.Delete",
					summary: "DELETE DC Cluster Group.",
					description: "DELETE the specified dc_cluster_group.",
					purpose: "Delete dc-cluster-group",
					path: "/api/config/namespaces/{namespace}/dc_cluster_groups/{name}",
				},
				{
					action: "create",
					resourceType: "forwarding_classs",
					operationId: "ves.io.schema.forwarding_class.API.Create",
					summary: "Create Forwarding Class.",
					description:
						"Forwarding Class is created by users in system namespace.",
					purpose: "Create new forwarding-class",
					path: "/api/config/namespaces/{metadata.namespace}/forwarding_classs",
				},
				{
					action: "replace",
					resourceType: "forwarding_classs",
					operationId: "ves.io.schema.forwarding_class.API.Replace",
					summary: "Replace Forwarding Class.",
					description:
						"Replace Forwarding Class will replace the contains of given object.",
					purpose: "Replace existing forwarding-class",
					path: "/api/config/namespaces/{metadata.namespace}/forwarding_classs/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "forwarding_classs",
					operationId: "ves.io.schema.forwarding_class.API.List",
					summary: "List Forwarding Class.",
					description:
						"List the set of forwarding_class in a namespace.",
					purpose: "List all forwarding-classs",
					path: "/api/config/namespaces/{namespace}/forwarding_classs",
				},
				{
					action: "get",
					resourceType: "forwarding_classs",
					operationId: "ves.io.schema.forwarding_class.API.Get",
					summary: "GET Forwarding Class.",
					description: "GET Forwarding Class in system namespace.",
					purpose: "Retrieve specific forwarding-class",
					path: "/api/config/namespaces/{namespace}/forwarding_classs/{name}",
				},
				{
					action: "delete",
					resourceType: "forwarding_classs",
					operationId: "ves.io.schema.forwarding_class.API.Delete",
					summary: "DELETE Forwarding Class.",
					description: "DELETE the specified forwarding_class.",
					purpose: "Delete forwarding-class",
					path: "/api/config/namespaces/{namespace}/forwarding_classs/{name}",
				},
				{
					action: "create",
					resourceType: "ike1",
					operationId: "ves.io.schema.ike1.API.Create",
					summary: "Create IKE Phase1 Profile.",
					description:
						"Shape of the IKE Phase1 profile specification.",
					purpose: "Create new ike1",
					path: "/api/config/namespaces/{metadata.namespace}/ike1s",
				},
				{
					action: "replace",
					resourceType: "ike1",
					operationId: "ves.io.schema.ike1.API.Replace",
					summary: "Replace IKE Phase1 Profile configuration.",
					description:
						"Shape of the IKE Phase1 profile configuration specification.",
					purpose: "Replace existing ike1",
					path: "/api/config/namespaces/{metadata.namespace}/ike1s/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "ike1",
					operationId: "ves.io.schema.ike1.API.List",
					summary: "List IKE Phase 1 Profile.",
					description: "List the set of ike1 in a namespace.",
					purpose: "List all ike1s",
					path: "/api/config/namespaces/{namespace}/ike1s",
				},
				{
					action: "get",
					resourceType: "ike1",
					operationId: "ves.io.schema.ike1.API.Get",
					summary: "GET IKE Phase1 profile configuration.",
					description:
						"Shape of the IKE Phase1 Profile configuration specification.",
					purpose: "Retrieve specific ike1",
					path: "/api/config/namespaces/{namespace}/ike1s/{name}",
				},
				{
					action: "delete",
					resourceType: "ike1",
					operationId: "ves.io.schema.ike1.API.Delete",
					summary: "DELETE IKE Phase 1 Profile.",
					description: "DELETE the specified ike1.",
					purpose: "Delete ike1",
					path: "/api/config/namespaces/{namespace}/ike1s/{name}",
				},
				{
					action: "create",
					resourceType: "ike_phase1_profile",
					operationId:
						"ves.io.schema.views.ike_phase1_profile.API.Create",
					summary: "Create IKE Phase1 Profile.",
					description:
						"Shape of the IKE Phase1 profile specification.",
					purpose: "Create new ike-phase1-profile",
					path: "/api/config/namespaces/{metadata.namespace}/ike_phase1_profiles",
				},
				{
					action: "replace",
					resourceType: "ike_phase1_profile",
					operationId:
						"ves.io.schema.views.ike_phase1_profile.API.Replace",
					summary: "Replace IKE Phase1 Profile configuration.",
					description:
						"Shape of the IKE Phase1 profile configuration specification.",
					purpose: "Replace existing ike-phase1-profile",
					path: "/api/config/namespaces/{metadata.namespace}/ike_phase1_profiles/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "ike_phase1_profile",
					operationId:
						"ves.io.schema.views.ike_phase1_profile.API.List",
					summary: "List IKE Phase 1 Profile.",
					description:
						"List the set of ike_phase1_profile in a namespace.",
					purpose: "List all ike-phase1-profiles",
					path: "/api/config/namespaces/{namespace}/ike_phase1_profiles",
				},
				{
					action: "get",
					resourceType: "ike_phase1_profile",
					operationId:
						"ves.io.schema.views.ike_phase1_profile.API.Get",
					summary: "GET IKE Phase1 profile configuration.",
					description:
						"Shape of the IKE Phase1 Profile configuration specification.",
					purpose: "Retrieve specific ike-phase1-profile",
					path: "/api/config/namespaces/{namespace}/ike_phase1_profiles/{name}",
				},
				{
					action: "delete",
					resourceType: "ike_phase1_profile",
					operationId:
						"ves.io.schema.views.ike_phase1_profile.API.Delete",
					summary: "DELETE IKE Phase 1 Profile.",
					description: "DELETE the specified ike_phase1_profile.",
					purpose: "Delete ike-phase1-profile",
					path: "/api/config/namespaces/{namespace}/ike_phase1_profiles/{name}",
				},
				{
					action: "create",
					resourceType: "ike2",
					operationId: "ves.io.schema.ike2.API.Create",
					summary: "Create IKE Phase2 Profile.",
					description:
						"Shape of the IKE Phase2 profile specification.",
					purpose: "Create new ike2",
					path: "/api/config/namespaces/{metadata.namespace}/ike2s",
				},
				{
					action: "replace",
					resourceType: "ike2",
					operationId: "ves.io.schema.ike2.API.Replace",
					summary: "Replace IKE Phase2 Profile configuration.",
					description:
						"Shape of the IKE Phase2 profile configuration specification.",
					purpose: "Replace existing ike2",
					path: "/api/config/namespaces/{metadata.namespace}/ike2s/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "ike2",
					operationId: "ves.io.schema.ike2.API.List",
					summary: "List IKE Phase 2 Profile.",
					description: "List the set of ike2 in a namespace.",
					purpose: "List all ike2s",
					path: "/api/config/namespaces/{namespace}/ike2s",
				},
				{
					action: "get",
					resourceType: "ike2",
					operationId: "ves.io.schema.ike2.API.Get",
					summary: "GET IKE Phase2 profile configuration.",
					description:
						"Shape of the IKE Phase2 Profile configuration specification.",
					purpose: "Retrieve specific ike2",
					path: "/api/config/namespaces/{namespace}/ike2s/{name}",
				},
				{
					action: "delete",
					resourceType: "ike2",
					operationId: "ves.io.schema.ike2.API.Delete",
					summary: "DELETE IKE Phase 2 Profile.",
					description: "DELETE the specified ike2.",
					purpose: "Delete ike2",
					path: "/api/config/namespaces/{namespace}/ike2s/{name}",
				},
				{
					action: "create",
					resourceType: "ike_phase2_profile",
					operationId:
						"ves.io.schema.views.ike_phase2_profile.API.Create",
					summary: "Create IKE Phase2 Profile.",
					description:
						"Shape of the IKE Phase2 profile specification.",
					purpose: "Create new ike-phase2-profile",
					path: "/api/config/namespaces/{metadata.namespace}/ike_phase2_profiles",
				},
				{
					action: "replace",
					resourceType: "ike_phase2_profile",
					operationId:
						"ves.io.schema.views.ike_phase2_profile.API.Replace",
					summary: "Replace IKE Phase2 Profile configuration.",
					description:
						"Shape of the IKE Phase2 profile configuration specification.",
					purpose: "Replace existing ike-phase2-profile",
					path: "/api/config/namespaces/{metadata.namespace}/ike_phase2_profiles/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "ike_phase2_profile",
					operationId:
						"ves.io.schema.views.ike_phase2_profile.API.List",
					summary: "List IKE Phase 2 Profile.",
					description:
						"List the set of ike_phase2_profile in a namespace.",
					purpose: "List all ike-phase2-profiles",
					path: "/api/config/namespaces/{namespace}/ike_phase2_profiles",
				},
				{
					action: "get",
					resourceType: "ike_phase2_profile",
					operationId:
						"ves.io.schema.views.ike_phase2_profile.API.Get",
					summary: "GET IKE Phase2 profile configuration.",
					description:
						"Shape of the IKE Phase2 Profile configuration specification.",
					purpose: "Retrieve specific ike-phase2-profile",
					path: "/api/config/namespaces/{namespace}/ike_phase2_profiles/{name}",
				},
				{
					action: "delete",
					resourceType: "ike_phase2_profile",
					operationId:
						"ves.io.schema.views.ike_phase2_profile.API.Delete",
					summary: "DELETE IKE Phase 2 Profile.",
					description: "DELETE the specified ike_phase2_profile.",
					purpose: "Delete ike-phase2-profile",
					path: "/api/config/namespaces/{namespace}/ike_phase2_profiles/{name}",
				},
				{
					action: "create",
					resourceType: "ip_prefix_set",
					operationId: "ves.io.schema.ip_prefix_set.API.Create",
					summary: "Create IP Prefix Set.",
					description:
						"Create ip_prefix_set creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new ip-prefix-set",
					path: "/api/config/namespaces/{metadata.namespace}/ip_prefix_sets",
				},
				{
					action: "replace",
					resourceType: "ip_prefix_set",
					operationId: "ves.io.schema.ip_prefix_set.API.Replace",
					summary: "Replace IP Prefix Set.",
					description:
						"Replace ip_prefix_set replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing ip-prefix-set",
					path: "/api/config/namespaces/{metadata.namespace}/ip_prefix_sets/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "ip_prefix_set",
					operationId: "ves.io.schema.ip_prefix_set.API.List",
					summary: "List IP Prefix Set.",
					description:
						"List the set of ip_prefix_set in a namespace.",
					purpose: "List all ip-prefix-sets",
					path: "/api/config/namespaces/{namespace}/ip_prefix_sets",
				},
				{
					action: "get",
					resourceType: "ip_prefix_set",
					operationId: "ves.io.schema.ip_prefix_set.API.Get",
					summary: "GET IP Prefix Set.",
					description:
						"GET ip_prefix_set reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific ip-prefix-set",
					path: "/api/config/namespaces/{namespace}/ip_prefix_sets/{name}",
				},
				{
					action: "delete",
					resourceType: "ip_prefix_set",
					operationId: "ves.io.schema.ip_prefix_set.API.Delete",
					summary: "DELETE IP Prefix Set.",
					description: "DELETE the specified ip_prefix_set.",
					purpose: "Delete ip-prefix-set",
					path: "/api/config/namespaces/{namespace}/ip_prefix_sets/{name}",
				},
				{
					action: "create",
					resourceType: "network_connector",
					operationId: "ves.io.schema.network_connector.API.Create",
					summary: "Create Network Connector.",
					description:
						"Network Connector is created by users in system namespace.",
					purpose: "Create new network-connector",
					path: "/api/config/namespaces/{metadata.namespace}/network_connectors",
				},
				{
					action: "replace",
					resourceType: "network_connector",
					operationId: "ves.io.schema.network_connector.API.Replace",
					summary: "Replace Network Connector.",
					description:
						"Replace Network Connector will replace the contains of given object.",
					purpose: "Replace existing network-connector",
					path: "/api/config/namespaces/{metadata.namespace}/network_connectors/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "network_connector",
					operationId: "ves.io.schema.network_connector.API.List",
					summary: "List Network Connector.",
					description:
						"List the set of network_connector in a namespace.",
					purpose: "List all network-connectors",
					path: "/api/config/namespaces/{namespace}/network_connectors",
				},
				{
					action: "get",
					resourceType: "network_connector",
					operationId: "ves.io.schema.network_connector.API.Get",
					summary: "GET Network Connector.",
					description: "GET Network Connector in system namespace.",
					purpose: "Retrieve specific network-connector",
					path: "/api/config/namespaces/{namespace}/network_connectors/{name}",
				},
				{
					action: "delete",
					resourceType: "network_connector",
					operationId: "ves.io.schema.network_connector.API.Delete",
					summary: "DELETE Network Connector.",
					description: "DELETE the specified network_connector.",
					purpose: "Delete network-connector",
					path: "/api/config/namespaces/{namespace}/network_connectors/{name}",
				},
				{
					action: "replace",
					resourceType: "public_ip",
					operationId: "ves.io.schema.public_ip.API.Replace",
					summary: "Replace Public IP.",
					description:
						"Replacing an public_ip object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing public-ip",
					path: "/api/config/namespaces/{metadata.namespace}/public_ips/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "public_ip",
					operationId: "ves.io.schema.public_ip.API.List",
					summary: "List Public IP.",
					description: "List the set of public_ip in a namespace.",
					purpose: "List all public-ips",
					path: "/api/config/namespaces/{namespace}/public_ips",
				},
				{
					action: "get",
					resourceType: "public_ip",
					operationId: "ves.io.schema.public_ip.API.Get",
					summary: "GET Public IP.",
					description:
						"GET public_ip will GET the object from the storage backend for namespace metadata.namespace.",
					purpose: "Retrieve specific public-ip",
					path: "/api/config/namespaces/{namespace}/public_ips/{name}",
				},
				{
					action: "create",
					resourceType: "route",
					operationId: "ves.io.schema.route.API.Create",
					summary: "Create Route.",
					description:
						"Create route object in a given namespace. Route object is list of route rules. Each rule has match condition to match incoming requests and actions to take on matching requests. Virtual host object has reference to route object.",
					purpose: "Create new route",
					path: "/api/config/namespaces/{metadata.namespace}/routes",
				},
				{
					action: "replace",
					resourceType: "route",
					operationId: "ves.io.schema.route.API.Replace",
					summary: "Replace Route.",
					description:
						"Replace route object in a given namespace. Route object is list of route rules. Each rule has match condition to match incoming requests and actions to take on matching requests. Virtual host object has reference to route object.",
					purpose: "Replace existing route",
					path: "/api/config/namespaces/{metadata.namespace}/routes/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "route",
					operationId: "ves.io.schema.route.API.List",
					summary: "List Route.",
					description: "List the set of route in a namespace.",
					purpose: "List all routes",
					path: "/api/config/namespaces/{namespace}/routes",
				},
				{
					action: "get",
					resourceType: "route",
					operationId: "ves.io.schema.route.API.Get",
					summary: "GET Route",
					description:
						"GET route object in a given namespace. Route object is list of route rules. Each rule has match condition to match incoming requests and actions to take on matching requests. Virtual host object has reference to route object.",
					purpose: "Retrieve specific route",
					path: "/api/config/namespaces/{namespace}/routes/{name}",
				},
				{
					action: "delete",
					resourceType: "route",
					operationId: "ves.io.schema.route.API.Delete",
					summary: "DELETE Route.",
					description: "DELETE the specified route.",
					purpose: "Delete route",
					path: "/api/config/namespaces/{namespace}/routes/{name}",
				},
				{
					action: "create",
					resourceType: "route",
					operationId:
						"ves.io.schema.operate.route.CustomPublicAPI.ShowRoutes",
					summary: "Show Routes.",
					description: "Show VER routes matching the request.",
					purpose: "Create new route",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/routes",
				},
				{
					action: "create",
					resourceType: "simplified_route",
					operationId:
						"ves.io.schema.operate.route.CustomPublicAPI.ShowSimplifiedRoutes",
					summary: "Show Simplified Routes.",
					description:
						"Show user-friendly VER routes matching the request.",
					purpose: "Create new simplified-route",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/simplified_routes",
				},
				{
					action: "create",
					resourceType: "srv6_network_slice",
					operationId: "ves.io.schema.srv6_network_slice.API.Create",
					summary: "Create SRv6 Network Slice.",
					description:
						"Create srv6_network_slice creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new srv6-network-slice",
					path: "/api/config/namespaces/{metadata.namespace}/srv6_network_slices",
				},
				{
					action: "replace",
					resourceType: "srv6_network_slice",
					operationId: "ves.io.schema.srv6_network_slice.API.Replace",
					summary: "Replace SRv6 Network Slice.",
					description:
						"Replace srv6_network_slice replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing srv6-network-slice",
					path: "/api/config/namespaces/{metadata.namespace}/srv6_network_slices/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "srv6_network_slice",
					operationId: "ves.io.schema.srv6_network_slice.API.List",
					summary: "List SRv6 Network Slice.",
					description:
						"List the set of srv6_network_slice in a namespace.",
					purpose: "List all srv6-network-slices",
					path: "/api/config/namespaces/{namespace}/srv6_network_slices",
				},
				{
					action: "get",
					resourceType: "srv6_network_slice",
					operationId: "ves.io.schema.srv6_network_slice.API.Get",
					summary: "GET SRv6 Network Slice.",
					description:
						"GET srv6_network_slice reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific srv6-network-slice",
					path: "/api/config/namespaces/{namespace}/srv6_network_slices/{name}",
				},
				{
					action: "delete",
					resourceType: "srv6_network_slice",
					operationId: "ves.io.schema.srv6_network_slice.API.Delete",
					summary: "DELETE SRv6 Network Slice.",
					description: "DELETE the specified srv6_network_slice.",
					purpose: "Delete srv6-network-slice",
					path: "/api/config/namespaces/{namespace}/srv6_network_slices/{name}",
				},
				{
					action: "create",
					resourceType: "subnet",
					operationId: "ves.io.schema.subnet.API.Create",
					summary: "Create Subnet.",
					description:
						"Subnet object contains configuration for an interface of a VM/pod. It is created in user or shared namespace.",
					purpose: "Create new subnet",
					path: "/api/config/namespaces/{metadata.namespace}/subnets",
				},
				{
					action: "replace",
					resourceType: "subnet",
					operationId: "ves.io.schema.subnet.API.Replace",
					summary: "Replace Subnet.",
					description: "Shape of subnet specification.",
					purpose: "Replace existing subnet",
					path: "/api/config/namespaces/{metadata.namespace}/subnets/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "subnet",
					operationId: "ves.io.schema.subnet.API.List",
					summary: "List Subnet.",
					description: "List the set of subnet in a namespace.",
					purpose: "List all subnets",
					path: "/api/config/namespaces/{namespace}/subnets",
				},
				{
					action: "get",
					resourceType: "subnet",
					operationId: "ves.io.schema.subnet.API.Get",
					summary: "GET Subnet.",
					description: "Shape of subnet specification.",
					purpose: "Retrieve specific subnet",
					path: "/api/config/namespaces/{namespace}/subnets/{name}",
				},
				{
					action: "delete",
					resourceType: "subnet",
					operationId: "ves.io.schema.subnet.API.Delete",
					summary: "DELETE Subnet.",
					description: "DELETE the specified subnet.",
					purpose: "Delete subnet",
					path: "/api/config/namespaces/{namespace}/subnets/{name}",
				},
				{
					action: "create",
					resourceType: "traceroute",
					operationId:
						"ves.io.schema.operate.traceroute.CustomPublicAPI.Traceroute",
					summary: "Traceroute.",
					description: "Run traceroute to a destination.",
					purpose: "Create new traceroute",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/traceroute",
				},
				{
					action: "create",
					resourceType: "tunnel",
					operationId: "ves.io.schema.tunnel.API.Create",
					summary: "Create Tunnel.",
					description:
						"Create tunnel in a given namespace. If one already exist it will give a error.",
					purpose: "Create new tunnel",
					path: "/api/config/namespaces/{metadata.namespace}/tunnels",
				},
				{
					action: "replace",
					resourceType: "tunnel",
					operationId: "ves.io.schema.tunnel.API.Replace",
					summary: "Replace Tunnel.",
					description: "Replace tunnel in a given namespace.",
					purpose: "Replace existing tunnel",
					path: "/api/config/namespaces/{metadata.namespace}/tunnels/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "tunnel",
					operationId: "ves.io.schema.tunnel.API.List",
					summary: "List Tunnel.",
					description: "List the set of tunnel in a namespace.",
					purpose: "List all tunnels",
					path: "/api/config/namespaces/{namespace}/tunnels",
				},
				{
					action: "get",
					resourceType: "tunnel",
					operationId: "ves.io.schema.tunnel.API.Get",
					summary: "GET Tunnel.",
					description: "GET Tunnel in a given namespace.",
					purpose: "Retrieve specific tunnel",
					path: "/api/config/namespaces/{namespace}/tunnels/{name}",
				},
				{
					action: "delete",
					resourceType: "tunnel",
					operationId: "ves.io.schema.tunnel.API.Delete",
					summary: "DELETE Tunnel.",
					description: "DELETE the specified tunnel.",
					purpose: "Delete tunnel",
					path: "/api/config/namespaces/{namespace}/tunnels/{name}",
				},
				{
					action: "create",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.Create",
					summary: "Create Virtual Network.",
					description: "Create virtual network in given namespace.",
					purpose: "Create new virtual-network",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_networks",
				},
				{
					action: "replace",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.Replace",
					summary: "Replace Virtual Network.",
					description:
						"Replace given virtual network in given namespace.",
					purpose: "Replace existing virtual-network",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_networks/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.List",
					summary: "List Virtual Network.",
					description:
						"List the set of virtual_network in a namespace.",
					purpose: "List all virtual-networks",
					path: "/api/config/namespaces/{namespace}/virtual_networks",
				},
				{
					action: "get",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.Get",
					summary: "GET Virtual Network.",
					description: "Gets virtual network in given namespace.",
					purpose: "Retrieve specific virtual-network",
					path: "/api/config/namespaces/{namespace}/virtual_networks/{name}",
				},
				{
					action: "delete",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.Delete",
					summary: "DELETE Virtual Network.",
					description: "DELETE the specified virtual_network.",
					purpose: "Delete virtual-network",
					path: "/api/config/namespaces/{namespace}/virtual_networks/{name}",
				},
			],
		},
	],
	[
		"network_security",
		{
			domain: "network_security",
			displayName: "Network Security",
			description:
				"Manage firewall configurations with match criteria and action rules. Create NAT policies using dynamic pools and port configurations for address translation. Define segment connections to isolate traffic between network zones. Configure policy-based routing to direct packets based on source, destination, or protocol attributes. Set up forward proxy policies and access control lists to govern outbound connections.",
			descriptionShort:
				"Manage firewall configurations with match criteria and ac...",
			resourceTypes: [
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
			operations: [
				{
					action: "create",
					resourceType: "forward_proxy_policy",
					operationId:
						"ves.io.schema.views.forward_proxy_policy.API.Create",
					summary: "Create Forward Proxy Policy.",
					description:
						"Shape of the Forward Proxy Policy specification.",
					purpose: "Create new forward-proxy-policy",
					path: "/api/config/namespaces/{metadata.namespace}/forward_proxy_policys",
				},
				{
					action: "replace",
					resourceType: "forward_proxy_policy",
					operationId:
						"ves.io.schema.views.forward_proxy_policy.API.Replace",
					summary: "Replace Forward Proxy Policy.",
					description:
						"Shape of the Forward Proxy Policy replace specification.",
					purpose: "Replace existing forward-proxy-policy",
					path: "/api/config/namespaces/{metadata.namespace}/forward_proxy_policys/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "hit",
					operationId:
						"ves.io.schema.views.forward_proxy_policy.CustomDataAPI.ForwardProxyPolicyHits",
					summary: "Forward Proxy Policy Hits.",
					description:
						"GET the counter for Forward Proxy Policy hits for a given namespace.",
					purpose: "Create new hit",
					path: "/api/data/namespaces/{namespace}/forward_proxy_policy/hits",
				},
				{
					action: "list",
					resourceType: "forward_proxy_policy",
					operationId:
						"ves.io.schema.views.forward_proxy_policy.API.List",
					summary: "List Configure Forward Proxy Policy.",
					description:
						"List the set of forward_proxy_policy in a namespace.",
					purpose: "List all forward-proxy-policys",
					path: "/api/config/namespaces/{namespace}/forward_proxy_policys",
				},
				{
					action: "get",
					resourceType: "forward_proxy_policy",
					operationId:
						"ves.io.schema.views.forward_proxy_policy.API.Get",
					summary: "GET Forward Proxy Policy.",
					description:
						"Shape of the Forward Proxy Policy specification.",
					purpose: "Retrieve specific forward-proxy-policy",
					path: "/api/config/namespaces/{namespace}/forward_proxy_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "forward_proxy_policy",
					operationId:
						"ves.io.schema.views.forward_proxy_policy.API.Delete",
					summary: "DELETE Configure Forward Proxy Policy.",
					description: "DELETE the specified forward_proxy_policy.",
					purpose: "Delete forward-proxy-policy",
					path: "/api/config/namespaces/{namespace}/forward_proxy_policys/{name}",
				},
				{
					action: "create",
					resourceType: "network_policy_view",
					operationId:
						"ves.io.schema.views.network_policy_view.API.Create",
					summary: "Create Network policy View.",
					description:
						"Shape of the Network policy view specification.",
					purpose: "Create new network-policy-view",
					path: "/api/config/namespaces/{metadata.namespace}/network_policy_views",
				},
				{
					action: "replace",
					resourceType: "network_policy_view",
					operationId:
						"ves.io.schema.views.network_policy_view.API.Replace",
					summary: "Replace Network policy View.",
					description:
						"Shape of the Network policy view replace specification.",
					purpose: "Replace existing network-policy-view",
					path: "/api/config/namespaces/{metadata.namespace}/network_policy_views/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "hit",
					operationId:
						"ves.io.schema.views.network_policy_view.CustomDataAPI.NetworkPolicyHits",
					summary: "Network Policy Hits.",
					description:
						"GET the counter for Network Policy hits for a given namespace.",
					purpose: "Create new hit",
					path: "/api/data/namespaces/{namespace}/network_policy_view/hits",
				},
				{
					action: "list",
					resourceType: "network_policy_view",
					operationId:
						"ves.io.schema.views.network_policy_view.API.List",
					summary: "List Configure Network policy View.",
					description:
						"List the set of network_policy_view in a namespace.",
					purpose: "List all network-policy-views",
					path: "/api/config/namespaces/{namespace}/network_policy_views",
				},
				{
					action: "get",
					resourceType: "network_policy_view",
					operationId:
						"ves.io.schema.views.network_policy_view.API.Get",
					summary: "GET Network policy View.",
					description:
						"Shape of the Network policy view specification.",
					purpose: "Retrieve specific network-policy-view",
					path: "/api/config/namespaces/{namespace}/network_policy_views/{name}",
				},
				{
					action: "delete",
					resourceType: "network_policy_view",
					operationId:
						"ves.io.schema.views.network_policy_view.API.Delete",
					summary: "DELETE Configure Network policy View.",
					description: "DELETE the specified network_policy_view.",
					purpose: "Delete network-policy-view",
					path: "/api/config/namespaces/{namespace}/network_policy_views/{name}",
				},
				{
					action: "create",
					resourceType: "fast_acl",
					operationId: "ves.io.schema.fast_acl.API.Create",
					summary: "Create Fast ACL.",
					description:
						"Create a `fast_acl` object, `fast_acl` object contains rules to protect site from denial of service It has destination{destination IP, destination port) and references to `fast_acl_rule`",
					purpose: "Create new fast-acl",
					path: "/api/config/namespaces/{metadata.namespace}/fast_acls",
				},
				{
					action: "replace",
					resourceType: "fast_acl",
					operationId: "ves.io.schema.fast_acl.API.Replace",
					summary: "Replace Fast ACL.",
					description:
						"Replace a `fast_acl` object, `fast_acl` object contains rules to protect site from denial of service It has destination{destination IP, destination port) and references to `fast_acl_rule`",
					purpose: "Replace existing fast-acl",
					path: "/api/config/namespaces/{metadata.namespace}/fast_acls/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "hit",
					operationId:
						"ves.io.schema.fast_acl.CustomDataAPI.FastACLHits",
					summary: "Fast ACL Hits.",
					description:
						"GET the counter for Fast ACL hits for a given namespace.",
					purpose: "Create new hit",
					path: "/api/data/namespaces/{namespace}/fast_acl/hits",
				},
				{
					action: "list",
					resourceType: "fast_acl",
					operationId: "ves.io.schema.fast_acl.API.List",
					summary: "List Fast ACL.",
					description: "List the set of fast_acl in a namespace.",
					purpose: "List all fast-acls",
					path: "/api/config/namespaces/{namespace}/fast_acls",
				},
				{
					action: "get",
					resourceType: "fast_acl",
					operationId: "ves.io.schema.fast_acl.API.Get",
					summary: "GET Fast ACL.",
					description: "GET value of `fast_acl` for object.",
					purpose: "Retrieve specific fast-acl",
					path: "/api/config/namespaces/{namespace}/fast_acls/{name}",
				},
				{
					action: "delete",
					resourceType: "fast_acl",
					operationId: "ves.io.schema.fast_acl.API.Delete",
					summary: "DELETE Fast ACL.",
					description: "DELETE the specified fast_acl.",
					purpose: "Delete fast-acl",
					path: "/api/config/namespaces/{namespace}/fast_acls/{name}",
				},
				{
					action: "create",
					resourceType: "fast_acl_rule",
					operationId: "ves.io.schema.fast_acl_rule.API.Create",
					summary: "Create Fast ACL Rule.",
					description:
						"Create a new Fast ACL rule, `fast_acl_rule` has specification to match source IP, source port and action to apply.",
					purpose: "Create new fast-acl-rule",
					path: "/api/config/namespaces/{metadata.namespace}/fast_acl_rules",
				},
				{
					action: "replace",
					resourceType: "fast_acl_rule",
					operationId: "ves.io.schema.fast_acl_rule.API.Replace",
					summary: "Replace Fast ACL Rule.",
					description:
						"Replace a given Fast ACL rule, `fast_acl_rule` has specification to match source IP, source port, protocol and action to apply.",
					purpose: "Replace existing fast-acl-rule",
					path: "/api/config/namespaces/{metadata.namespace}/fast_acl_rules/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "fast_acl_rule",
					operationId: "ves.io.schema.fast_acl_rule.API.List",
					summary: "List Fast ACL Rule.",
					description:
						"List the set of fast_acl_rule in a namespace.",
					purpose: "List all fast-acl-rules",
					path: "/api/config/namespaces/{namespace}/fast_acl_rules",
				},
				{
					action: "get",
					resourceType: "fast_acl_rule",
					operationId: "ves.io.schema.fast_acl_rule.API.Get",
					summary: "GET Fast ACL Rule.",
					description: "GET a Fast ACL rule.",
					purpose: "Retrieve specific fast-acl-rule",
					path: "/api/config/namespaces/{namespace}/fast_acl_rules/{name}",
				},
				{
					action: "delete",
					resourceType: "fast_acl_rule",
					operationId: "ves.io.schema.fast_acl_rule.API.Delete",
					summary: "DELETE Fast ACL Rule.",
					description: "DELETE the specified fast_acl_rule.",
					purpose: "Delete fast-acl-rule",
					path: "/api/config/namespaces/{namespace}/fast_acl_rules/{name}",
				},
				{
					action: "create",
					resourceType: "filter_set",
					operationId: "ves.io.schema.filter_set.API.Create",
					summary: "Create Specification.",
					description: "Create specification.",
					purpose: "Create new filter-set",
					path: "/api/config/namespaces/{metadata.namespace}/filter_sets",
				},
				{
					action: "replace",
					resourceType: "filter_set",
					operationId: "ves.io.schema.filter_set.API.Replace",
					summary: "Replace Specification.",
					description: "Replace specification.",
					purpose: "Replace existing filter-set",
					path: "/api/config/namespaces/{metadata.namespace}/filter_sets/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "filter_set",
					operationId: "ves.io.schema.filter_set.API.List",
					summary: "List Filter Set.",
					description: "List the set of filter_set in a namespace.",
					purpose: "List all filter-sets",
					path: "/api/config/namespaces/{namespace}/filter_sets",
				},
				{
					action: "create",
					resourceType: "find",
					operationId:
						"ves.io.schema.filter_set.CustomAPI.FindFilterSets",
					summary: "Find Filter Sets for 1 or More Context Keys.",
					description:
						"Retrieve any saved filter sets that are applicable for the given context key(s)",
					purpose: "Create new find",
					path: "/api/config/namespaces/{namespace}/filter_sets/find",
				},
				{
					action: "get",
					resourceType: "filter_set",
					operationId: "ves.io.schema.filter_set.API.Get",
					summary: "GET Specification.",
					description: "GET specification.",
					purpose: "Retrieve specific filter-set",
					path: "/api/config/namespaces/{namespace}/filter_sets/{name}",
				},
				{
					action: "delete",
					resourceType: "filter_set",
					operationId: "ves.io.schema.filter_set.API.Delete",
					summary: "DELETE Filter Set.",
					description: "DELETE the specified filter_set.",
					purpose: "Delete filter-set",
					path: "/api/config/namespaces/{namespace}/filter_sets/{name}",
				},
				{
					action: "create",
					resourceType: "nat_policy",
					operationId: "ves.io.schema.nat_policy.API.Create",
					summary: "Create NAT Policy.",
					description:
						"NAT Policy create specification configures NAT Policy with multiple Rules,.",
					purpose: "Create new nat-policy",
					path: "/api/config/namespaces/{metadata.namespace}/nat_policys",
				},
				{
					action: "replace",
					resourceType: "nat_policy",
					operationId: "ves.io.schema.nat_policy.API.Replace",
					summary: "Replace NAT Policy.",
					description:
						"NAT Policy replaces specification condigures NAT Policy with multiple Rules, corresponding Match Criteria to apply on the packet content and Action to be applied ifthe MatchCriteria matches.",
					purpose: "Replace existing nat-policy",
					path: "/api/config/namespaces/{metadata.namespace}/nat_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "nat_policy",
					operationId: "ves.io.schema.nat_policy.API.List",
					summary: "List NAT Policy.",
					description: "List the set of nat_policy in a namespace.",
					purpose: "List all nat-policys",
					path: "/api/config/namespaces/{namespace}/nat_policys",
				},
				{
					action: "get",
					resourceType: "nat_policy",
					operationId: "ves.io.schema.nat_policy.API.Get",
					summary: "GET NAT Policy.",
					description:
						"NAT Policy GET specification fetches the configuration from store which contains the rules, Match Criteria, Action applied on the NAT policy along with Virtual subnet pool and NAT Pool.",
					purpose: "Retrieve specific nat-policy",
					path: "/api/config/namespaces/{namespace}/nat_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "nat_policy",
					operationId: "ves.io.schema.nat_policy.API.Delete",
					summary: "DELETE NAT Policy.",
					description: "DELETE the specified nat_policy.",
					purpose: "Delete nat-policy",
					path: "/api/config/namespaces/{namespace}/nat_policys/{name}",
				},
				{
					action: "create",
					resourceType: "network_firewall",
					operationId: "ves.io.schema.network_firewall.API.Create",
					summary: "Create Network Firewall.",
					description:
						"Network firewall is created by users in system namespace.",
					purpose: "Create new network-firewall",
					path: "/api/config/namespaces/{metadata.namespace}/network_firewalls",
				},
				{
					action: "replace",
					resourceType: "network_firewall",
					operationId: "ves.io.schema.network_firewall.API.Replace",
					summary: "Replace Network Firewall.",
					description:
						"Replace network firewall will replace the contains of given object.",
					purpose: "Replace existing network-firewall",
					path: "/api/config/namespaces/{metadata.namespace}/network_firewalls/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "network_firewall",
					operationId: "ves.io.schema.network_firewall.API.List",
					summary: "List Network Firewall.",
					description:
						"List the set of network_firewall in a namespace.",
					purpose: "List all network-firewalls",
					path: "/api/config/namespaces/{namespace}/network_firewalls",
				},
				{
					action: "get",
					resourceType: "network_firewall",
					operationId: "ves.io.schema.network_firewall.API.Get",
					summary: "GET Network Firewall.",
					description: "GET network firewall in system namespace.",
					purpose: "Retrieve specific network-firewall",
					path: "/api/config/namespaces/{namespace}/network_firewalls/{name}",
				},
				{
					action: "delete",
					resourceType: "network_firewall",
					operationId: "ves.io.schema.network_firewall.API.Delete",
					summary: "DELETE Network Firewall.",
					description: "DELETE the specified network_firewall.",
					purpose: "Delete network-firewall",
					path: "/api/config/namespaces/{namespace}/network_firewalls/{name}",
				},
				{
					action: "create",
					resourceType: "network_policy",
					operationId: "ves.io.schema.network_policy.API.Create",
					summary: "Create Network Policy.",
					description:
						"Creates a new network policy with configured parameters in specified namespace.",
					purpose: "Create new network-policy",
					path: "/api/config/namespaces/{metadata.namespace}/network_policys",
				},
				{
					action: "replace",
					resourceType: "network_policy",
					operationId: "ves.io.schema.network_policy.API.Replace",
					summary: "Replace Network Policy.",
					description:
						"Replaces configured Network Policy with new set of parameters in specified namespace.",
					purpose: "Replace existing network-policy",
					path: "/api/config/namespaces/{metadata.namespace}/network_policys/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "hit",
					operationId:
						"ves.io.schema.network_policy.CustomDataAPI.NetworkPolicyHits",
					summary: "Network Policy Hits.",
					description:
						"GET the counter for Network Policy hits for a given namespace.",
					purpose: "Create new hit",
					path: "/api/data/namespaces/{namespace}/network_policy/hits",
				},
				{
					action: "list",
					resourceType: "network_policy",
					operationId: "ves.io.schema.network_policy.API.List",
					summary: "List Network Policy.",
					description:
						"List the set of network_policy in a namespace.",
					purpose: "List all network-policys",
					path: "/api/config/namespaces/{namespace}/network_policys",
				},
				{
					action: "get",
					resourceType: "network_policy",
					operationId: "ves.io.schema.network_policy.API.Get",
					summary: "GET Network Policy.",
					description:
						"Gets Network Policy parameters in specified namespace.",
					purpose: "Retrieve specific network-policy",
					path: "/api/config/namespaces/{namespace}/network_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "network_policy",
					operationId: "ves.io.schema.network_policy.API.Delete",
					summary: "DELETE Network Policy.",
					description: "DELETE the specified network_policy.",
					purpose: "Delete network-policy",
					path: "/api/config/namespaces/{namespace}/network_policys/{name}",
				},
				{
					action: "create",
					resourceType: "network_policy_rule",
					operationId: "ves.io.schema.network_policy_rule.API.Create",
					summary: "Create Network Policy Rule.",
					description:
						"Creates a network policy rule with configured parameters in specified namespace.",
					purpose: "Create new network-policy-rule",
					path: "/api/config/namespaces/{metadata.namespace}/network_policy_rules",
				},
				{
					action: "replace",
					resourceType: "network_policy_rule",
					operationId:
						"ves.io.schema.network_policy_rule.API.Replace",
					summary: "Replace Network Policy Rule.",
					description:
						"Replaces a network policy rule with configured parameters in specified namespace.",
					purpose: "Replace existing network-policy-rule",
					path: "/api/config/namespaces/{metadata.namespace}/network_policy_rules/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "network_policy_rule",
					operationId: "ves.io.schema.network_policy_rule.API.List",
					summary: "List Network Policy Rule.",
					description:
						"List the set of network_policy_rule in a namespace.",
					purpose: "List all network-policy-rules",
					path: "/api/config/namespaces/{namespace}/network_policy_rules",
				},
				{
					action: "get",
					resourceType: "network_policy_rule",
					operationId: "ves.io.schema.network_policy_rule.API.Get",
					summary: "GET Network Policy Rule.",
					description:
						"GET a network policy rule in specified namespace.",
					purpose: "Retrieve specific network-policy-rule",
					path: "/api/config/namespaces/{namespace}/network_policy_rules/{name}",
				},
				{
					action: "delete",
					resourceType: "network_policy_rule",
					operationId: "ves.io.schema.network_policy_rule.API.Delete",
					summary: "DELETE Network Policy Rule.",
					description: "DELETE the specified network_policy_rule.",
					purpose: "Delete network-policy-rule",
					path: "/api/config/namespaces/{namespace}/network_policy_rules/{name}",
				},
				{
					action: "list",
					resourceType: "network_policy_set",
					operationId: "ves.io.schema.network_policy_set.API.List",
					summary: "List Network Policy Set.",
					description:
						"List the set of network_policy_set in a namespace.",
					purpose: "List all network-policy-sets",
					path: "/api/config/namespaces/{namespace}/network_policy_sets",
				},
				{
					action: "get",
					resourceType: "network_policy_set",
					operationId: "ves.io.schema.network_policy_set.API.Get",
					summary: "GET Network Policy Set.",
					description: "GET network policy set in a given namespace.",
					purpose: "Retrieve specific network-policy-set",
					path: "/api/config/namespaces/{namespace}/network_policy_sets/{name}",
				},
				{
					action: "create",
					resourceType: "policy_based_routing",
					operationId:
						"ves.io.schema.views.policy_based_routing.API.Create",
					summary: "Create Policy based Routing.",
					description:
						"Shape of the Network Policy based routing create specification.",
					purpose: "Create new policy-based-routing",
					path: "/api/config/namespaces/{metadata.namespace}/policy_based_routings",
				},
				{
					action: "replace",
					resourceType: "policy_based_routing",
					operationId:
						"ves.io.schema.views.policy_based_routing.API.Replace",
					summary: "Replace Policy based Routing.",
					description:
						"Shape of the Network Policy based routing replace specification.",
					purpose: "Replace existing policy-based-routing",
					path: "/api/config/namespaces/{metadata.namespace}/policy_based_routings/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "policy_based_routing",
					operationId:
						"ves.io.schema.views.policy_based_routing.API.List",
					summary: "List Policy based Routing.",
					description:
						"List the set of policy_based_routing in a namespace.",
					purpose: "List all policy-based-routings",
					path: "/api/config/namespaces/{namespace}/policy_based_routings",
				},
				{
					action: "get",
					resourceType: "policy_based_routing",
					operationId:
						"ves.io.schema.views.policy_based_routing.API.Get",
					summary: "GET Policy based Routing.",
					description:
						"Shape of the Network Policy based routing GET specification.",
					purpose: "Retrieve specific policy-based-routing",
					path: "/api/config/namespaces/{namespace}/policy_based_routings/{name}",
				},
				{
					action: "delete",
					resourceType: "policy_based_routing",
					operationId:
						"ves.io.schema.views.policy_based_routing.API.Delete",
					summary: "DELETE Policy based Routing.",
					description: "DELETE the specified policy_based_routing.",
					purpose: "Delete policy-based-routing",
					path: "/api/config/namespaces/{namespace}/policy_based_routings/{name}",
				},
				{
					action: "create",
					resourceType: "segment",
					operationId: "ves.io.schema.segment.API.Create",
					summary: "Create segment.",
					description: "Shape of the segment specification.",
					purpose: "Create new segment",
					path: "/api/config/namespaces/{metadata.namespace}/segments",
				},
				{
					action: "replace",
					resourceType: "segment",
					operationId: "ves.io.schema.segment.API.Replace",
					summary: "Replace segment.",
					description: "Shape of the segment specification.",
					purpose: "Replace existing segment",
					path: "/api/config/namespaces/{metadata.namespace}/segments/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "segment",
					operationId: "ves.io.schema.segment.API.List",
					summary: "List Segment.",
					description: "List the set of segment in a namespace.",
					purpose: "List all segments",
					path: "/api/config/namespaces/{namespace}/segments",
				},
				{
					action: "create",
					resourceType: "graph",
					operationId:
						"ves.io.schema.segment.CustomDataAPI.SegmentsGraph",
					summary: "Segment",
					description:
						"Request to GET different network segments with given metrics . This will give metric data for all segments including intra segment metrics.",
					purpose: "Create new graph",
					path: "/api/data/namespaces/{namespace}/segments/graph",
				},
				{
					action: "get",
					resourceType: "segment",
					operationId: "ves.io.schema.segment.API.Get",
					summary: "GET segment.",
					description: "Shape of the segment specification.",
					purpose: "Retrieve specific segment",
					path: "/api/config/namespaces/{namespace}/segments/{name}",
				},
				{
					action: "delete",
					resourceType: "segment",
					operationId: "ves.io.schema.segment.API.Delete",
					summary: "DELETE Segment.",
					description: "DELETE the specified segment.",
					purpose: "Delete segment",
					path: "/api/config/namespaces/{namespace}/segments/{name}",
				},
				{
					action: "replace",
					resourceType: "segment_connection",
					operationId: "ves.io.schema.segment_connection.API.Replace",
					summary: "Replace segment connector.",
					description:
						"Shape of the segment connector specification.",
					purpose: "Replace existing segment-connection",
					path: "/api/config/namespaces/{metadata.namespace}/segment_connections/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "segment_connection",
					operationId: "ves.io.schema.segment_connection.API.List",
					summary: "List Segment Connector.",
					description:
						"List the set of segment_connection in a namespace.",
					purpose: "List all segment-connections",
					path: "/api/config/namespaces/{namespace}/segment_connections",
				},
				{
					action: "get",
					resourceType: "segment_connection",
					operationId: "ves.io.schema.segment_connection.API.Get",
					summary: "GET segment connector.",
					description:
						"Shape of the segment connector specification.",
					purpose: "Retrieve specific segment-connection",
					path: "/api/config/namespaces/{namespace}/segment_connections/{name}",
				},
				{
					action: "create",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.Create",
					summary: "Create Service Policy.",
					description:
						"Create service_policy creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new service-policy",
					path: "/api/config/namespaces/{metadata.namespace}/service_policys",
				},
				{
					action: "replace",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.Replace",
					summary: "Replace Service Policy.",
					description:
						"Replace service_policy replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing service-policy",
					path: "/api/config/namespaces/{metadata.namespace}/service_policys/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "hit",
					operationId:
						"ves.io.schema.service_policy.CustomDataAPI.ServicePolicyHits",
					summary: "Service Policy Hits.",
					description:
						"GET the counter for Service Policy hits for a given namespace.",
					purpose: "Create new hit",
					path: "/api/data/namespaces/{namespace}/service_policy/hits",
				},
				{
					action: "create",
					resourceType: "latency",
					operationId:
						"ves.io.schema.service_policy.CustomDataAPI.ServicePolicyHitsLatency",
					summary: "Service Policy Latency.",
					description:
						"GET the average latency for Service policy evaluation.",
					purpose: "Create new latency",
					path: "/api/data/namespaces/{namespace}/service_policy/latency",
				},
				{
					action: "list",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.List",
					summary: "List Service Policy.",
					description:
						"List the set of service_policy in a namespace.",
					purpose: "List all service-policys",
					path: "/api/config/namespaces/{namespace}/service_policys",
				},
				{
					action: "get",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.Get",
					summary: "GET Service Policy.",
					description:
						"GET service_policy reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific service-policy",
					path: "/api/config/namespaces/{namespace}/service_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.Delete",
					summary: "DELETE Service Policy.",
					description: "DELETE the specified service_policy.",
					purpose: "Delete service-policy",
					path: "/api/config/namespaces/{namespace}/service_policys/{name}",
				},
			],
		},
	],
	[
		"nginx_one",
		{
			domain: "nginx_one",
			displayName: "Nginx One",
			description:
				"Set up load balancing configurations with backend server definitions and routing logic. Create monitoring schedules for availability tracking across distributed nodes. Build request handling pipelines with rate controls and authentication layers. Track instance performance metrics and traffic patterns. Coordinate failover mechanisms using weighted distribution and priority-based selection.",
			descriptionShort:
				"Set up load balancing configurations with backend server ...",
			resourceTypes: [
				"nginx_csg",
				"nginx_dataplane_server",
				"nginx_instance",
				"nginx_server",
				"nginx_service_discovery",
				"subscribe",
				"unsubscribe",
			],
			operations: [
				{
					action: "list",
					resourceType: "nginx_csg",
					operationId: "ves.io.schema.nginx.one.nginx_csg.API.List",
					summary: "List NGINX One CSG Object configuration.",
					description: "List the set of nginx_csg in a namespace.",
					purpose: "List all nginx-csgs",
					path: "/api/config/namespaces/{namespace}/nginx_csgs",
				},
				{
					action: "get",
					resourceType: "nginx_csg",
					operationId: "ves.io.schema.nginx.one.nginx_csg.API.Get",
					summary: "GET Request.",
					description: "GET NGINX csg configuration.",
					purpose: "Retrieve specific nginx-csg",
					path: "/api/config/namespaces/{namespace}/nginx_csgs/{name}",
				},
				{
					action: "list",
					resourceType: "nginx_instance",
					operationId:
						"ves.io.schema.nginx.one.nginx_instance.API.List",
					summary: "List NGINX One Instance Object configuration.",
					description:
						"List the set of nginx_instance in a namespace.",
					purpose: "List all nginx-instances",
					path: "/api/config/namespaces/{namespace}/nginx_instances",
				},
				{
					action: "get",
					resourceType: "nginx_instance",
					operationId:
						"ves.io.schema.nginx.one.nginx_instance.API.Get",
					summary: "GET Request.",
					description: "GET NGINX instance configuration.",
					purpose: "Retrieve specific nginx-instance",
					path: "/api/config/namespaces/{namespace}/nginx_instances/{name}",
				},
				{
					action: "create",
					resourceType: "nginx_dataplane_server",
					operationId:
						"ves.io.schema.nginx.one.nginx_server.CustomAPI.GetDataplaneServers",
					summary: "GET NGINX One Dataplane Servers.",
					description:
						"GET NGINX One Servers associated to an NGINX dataplane.",
					purpose: "Create new nginx-dataplane-server",
					path: "/api/config/namespaces/{namespace}/nginx_dataplane_servers",
				},
				{
					action: "list",
					resourceType: "nginx_server",
					operationId:
						"ves.io.schema.nginx.one.nginx_server.API.List",
					summary: "List NGINX One Server APIs.",
					description: "List the set of nginx_server in a namespace.",
					purpose: "List all nginx-servers",
					path: "/api/config/namespaces/{namespace}/nginx_servers",
				},
				{
					action: "get",
					resourceType: "nginx_server",
					operationId: "ves.io.schema.nginx.one.nginx_server.API.Get",
					summary: "GET Request.",
					description: "GET NGINX server block configuration.",
					purpose: "Retrieve specific nginx-server",
					path: "/api/config/namespaces/{namespace}/nginx_servers/{name}",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.nginx.one.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to NGINX One.",
					description: "Subscribe to NGINX One.",
					purpose: "Create new subscribe",
					path: "/api/nginx/one/namespaces/system/n1/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.nginx.one.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to NGINX One.",
					description: "Unsubscribe to NGINX One.",
					purpose: "Create new unsubscribe",
					path: "/api/nginx/one/namespaces/system/n1/unsubscribe",
				},
				{
					action: "create",
					resourceType: "nginx_service_discovery",
					operationId:
						"ves.io.schema.nginx.one.nginx_service_discovery.API.Create",
					summary: "Create NGINX Service Discovery.",
					description:
						"API to create NGINX Service Discovery object for a site or virtual site in system namespace.",
					purpose: "Create new nginx-service-discovery",
					path: "/api/config/namespaces/{metadata.namespace}/nginx_service_discoverys",
				},
				{
					action: "replace",
					resourceType: "nginx_service_discovery",
					operationId:
						"ves.io.schema.nginx.one.nginx_service_discovery.API.Replace",
					summary: "Replace NGINX Service Discovery.",
					description:
						"API to replace NGINX Service Discovery object for a site or virtual site in system namespace.",
					purpose: "Replace existing nginx-service-discovery",
					path: "/api/config/namespaces/{metadata.namespace}/nginx_service_discoverys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "nginx_service_discovery",
					operationId:
						"ves.io.schema.nginx.one.nginx_service_discovery.API.List",
					summary: "List NGINX Service Discovery.",
					description:
						"List the set of nginx_service_discovery in a namespace.",
					purpose: "List all nginx-service-discoverys",
					path: "/api/config/namespaces/{namespace}/nginx_service_discoverys",
				},
				{
					action: "get",
					resourceType: "nginx_service_discovery",
					operationId:
						"ves.io.schema.nginx.one.nginx_service_discovery.API.Get",
					summary: "GET NGINX Service Discovery.",
					description:
						"API to GET NGINX Service Discovery object for a site or virtual site in system namespace.",
					purpose: "Retrieve specific nginx-service-discovery",
					path: "/api/config/namespaces/{namespace}/nginx_service_discoverys/{name}",
				},
				{
					action: "delete",
					resourceType: "nginx_service_discovery",
					operationId:
						"ves.io.schema.nginx.one.nginx_service_discovery.API.Delete",
					summary: "DELETE NGINX Service Discovery.",
					description:
						"DELETE the specified nginx_service_discovery.",
					purpose: "Delete nginx-service-discovery",
					path: "/api/config/namespaces/{namespace}/nginx_service_discoverys/{name}",
				},
			],
		},
	],
	[
		"object_storage",
		{
			domain: "object_storage",
			displayName: "Object Storage",
			description:
				"Deploy binary artifacts and configuration bundles with automatic version tracking and lifecycle policies. Organize content by category including protection signatures, SDK packages, and third-party connector files. Enable time-limited download links for secure distribution without credential exposure. Track revision history for audit trails and support rollback to previous artifact versions when needed.",
			descriptionShort:
				"Deploy binary artifacts and configuration bundles with au...",
			resourceTypes: [
				"mobile-app-shield",
				"mobile-integrator",
				"stored_object",
			],
			operations: [
				{
					action: "list",
					resourceType: "mobile-app-shield",
					operationId:
						"ves.io.schema.stored_object.MobileAppShieldCustomAPI.ListMobileAppShields",
					summary: "GET List Of Mobile App Shields.",
					description:
						"ListMobileAppShields is an API to list all mobile app shields available for download.",
					purpose: "List all mobile-app-shields",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/mobile-app-shield",
				},
				{
					action: "get",
					resourceType: "mobile-app-shield",
					operationId:
						"ves.io.schema.stored_object.MobileAppShieldCustomAPI.GetMobileAppShield",
					summary: "GET Mobile App Shield.",
					description:
						"GetMobileAppShield is an API to download particular version of mobile app shield.",
					purpose: "Retrieve specific mobile-app-shield",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/mobile-app-shield/{name}/{version}",
				},
				{
					action: "list",
					resourceType: "mobile-integrator",
					operationId:
						"ves.io.schema.stored_object.MobileIntegratorCustomAPI.ListMobileIntegrators",
					summary: "GET List Of Mobile Integrators.",
					description:
						"ListMobileIntegrators is an API to list all mobile integrators available for download.",
					purpose: "List all mobile-integrators",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/mobile-integrator",
				},
				{
					action: "get",
					resourceType: "mobile-integrator",
					operationId:
						"ves.io.schema.stored_object.MobileIntegratorCustomAPI.GetMobileIntegrator",
					summary: "GET Mobile Integrator.",
					description:
						"GetMobileIntegrator is an API to download particular version of Integrator.",
					purpose: "Retrieve specific mobile-integrator",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/mobile-integrator/{name}/{version}",
				},
				{
					action: "list",
					resourceType: "stored_object",
					operationId:
						"ves.io.schema.stored_object.CustomAPI.ListObjects",
					summary: "GET List Of Stored Objects.",
					description:
						"ListObjects is an API to list objects in object store.",
					purpose: "List all stored-objects",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/{object_type}",
				},
				{
					action: "replace",
					resourceType: "stored_object",
					operationId:
						"ves.io.schema.stored_object.CustomAPI.CreateObject",
					summary: "Create Stored Object.",
					description:
						"CreateObject is an API to upload an object to generic object store. Objects are immutable, a new version is created when the content is updated.",
					purpose: "Replace existing stored-object",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/{object_type}/{name}",
				},
				{
					action: "delete",
					resourceType: "stored_object",
					operationId:
						"ves.io.schema.stored_object.CustomAPI.DeleteObject",
					summary: "DELETE Stored Object(s)",
					description:
						"DeleteObjects is an API to DELETE object(s) in object store.",
					purpose: "Delete stored-object",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/{object_type}/{name}",
				},
				{
					action: "get",
					resourceType: "stored_object",
					operationId:
						"ves.io.schema.stored_object.CustomAPI.GetObject",
					summary: "GET Stored Object.",
					description:
						"GetObject is an API to download an object from object store.",
					purpose: "Retrieve specific stored-object",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/{object_type}/{name}/{version}",
				},
				{
					action: "delete",
					resourceType: "stored_object",
					operationId:
						"docs_cloud_f5_com_0222_public_ves_io_schema_stored_object_ves_swagger_ves.io.schema.stored_object.CustomAPI.DeleteObject",
					summary: "DELETE Stored Object(s)",
					description:
						"DeleteObjects is an API to DELETE object(s) in object store.",
					purpose: "Delete stored-object",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/{object_type}/{name}/{version}",
				},
			],
		},
	],
	[
		"observability",
		{
			domain: "observability",
			displayName: "Observability",
			description:
				"Set up synthetic monitoring for DNS resolution and HTTP services across AWS regions. Generate health reports with historical trends and summary dashboards. Monitor certificate validity, track response times, and aggregate results by namespace for capacity planning.",
			descriptionShort:
				"Set up synthetic monitoring for DNS resolution and HTTP s...",
			resourceTypes: [
				"access_log",
				"aggregation",
				"alert",
				"all_ns_alert",
				"audit_log",
				"certificate-report-detail",
				"certificate-summary",
				"dns-monitor-summary",
				"dns-monitors-health",
				"filtered-dns-monitor-list",
				"filtered-http-monitor-list",
				"firewall_log",
				"global-history",
				"global-summary",
				"health",
				"history",
				"http-monitor-detail",
				"http-monitor-summary",
				"http-monitors-health",
				"metric-query",
				"monitor-event",
				"monitor-history",
				"platform_event",
				"record-type-summary",
				"scroll",
				"source-summary",
				"subscribe",
				"suggest-value",
				"tls-report-detail",
				"tls-report-summary",
				"tls-summary",
				"unsubscribe",
				"v1_dns_monitor",
				"v1_http_monitor",
				"vk8s_audit_log",
				"vk8s_event",
			],
			operations: [
				{
					action: "list",
					resourceType: "all_ns_alert",
					operationId:
						"ves.io.schema.alert.CustomAPI.AlertsAllNamespaces",
					summary: "GET Alerts.",
					description:
						"For system namespace, all the alerts for the tenant matching the filter specified in the request will be returned in the response.",
					purpose: "List all all-ns-alerts",
					path: "/api/data/namespaces/system/all_ns_alerts",
				},
				{
					action: "list",
					resourceType: "alert",
					operationId: "ves.io.schema.alert.CustomAPI.Alerts",
					summary: "GET Alerts.",
					description:
						"GET alerts matching the filter for the given namespace.",
					purpose: "List all alerts",
					path: "/api/data/namespaces/{namespace}/alerts",
				},
				{
					action: "list",
					resourceType: "history",
					operationId: "ves.io.schema.alert.CustomAPI.AlertsHistory",
					summary: "GET Alerts History.",
					description:
						"GET the history of alert notifications sent to the end-user between the start_time and end_time that matches the filter specified in the request.",
					purpose: "List all historys",
					path: "/api/data/namespaces/{namespace}/alerts/history",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.alert.CustomAPI.AlertsHistoryAggregation",
					summary: "Alerts History Aggregation.",
					description:
						"GET summary/aggregation data for alerts in the given namespace. For `system` namespace, all alerts for the tenant matching the query specified in the request will be considered for aggregation.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/alerts/history/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.alert.CustomAPI.AlertsHistoryScroll",
					summary: "Alerts History Scroll.",
					description:
						'Scroll request is used to fetch large number of alert messages in multiple batches with each AlertsHistoryResponse containing no more than 500 alerts. To scroll through more than 500 or all alert messages, one can use the AlertsHistoryScrollRequest. Use the scroll_id returned in the AlertsHistoryResponse to fetch the next batch of alert messages and one can continue this process till the scroll_id returned in the AlertsHistoryResponse is "" which indicates no more alert messages to scroll.',
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/alerts/history/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0014_public_ves_io_schema_alert_ves_swagger_ves.io.schema.alert.CustomAPI.AlertsHistoryScroll",
					summary: "Alerts History Scroll.",
					description:
						'Scroll request is used to fetch large number of alert messages in multiple batches with each AlertsHistoryResponse containing no more than 500 alerts. To scroll through more than 500 or all alert messages, one can use the AlertsHistoryScrollRequest. Use the scroll_id returned in the AlertsHistoryResponse to fetch the next batch of alert messages and one can continue this process till the scroll_id returned in the AlertsHistoryResponse is "" which indicates no more alert messages to scroll.',
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/alerts/history/scroll",
				},
				{
					action: "create",
					resourceType: "v1_dns_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_dns_monitor.API.Create",
					summary: "Create DNS Monitor.",
					description: "Create a new DNS Monitor.",
					purpose: "Create new v1-dns-monitor",
					path: "/api/observability/synthetic_monitor/namespaces/{metadata.namespace}/v1_dns_monitors",
				},
				{
					action: "replace",
					resourceType: "v1_dns_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_dns_monitor.API.Replace",
					summary: "Replace DNS Monitor.",
					description: "Replace the contents of a DNS Monitor.",
					purpose: "Replace existing v1-dns-monitor",
					path: "/api/observability/synthetic_monitor/namespaces/{metadata.namespace}/v1_dns_monitors/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "filtered-dns-monitor-list",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_dns_monitor.CustomAPI.GetFilteredDNSMonitorList",
					summary: "GET Filtered DNS Monitor List.",
					description:
						"List v1_dns_monitor in a namespace based on filter.",
					purpose: "List all filtered-dns-monitor-lists",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/filtered-dns-monitor-list",
				},
				{
					action: "list",
					resourceType: "v1_dns_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_dns_monitor.API.List",
					summary: "List DNS Monitor.",
					description:
						"List the set of v1_dns_monitor in a namespace.",
					purpose: "List all v1-dns-monitors",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/v1_dns_monitors",
				},
				{
					action: "get",
					resourceType: "v1_dns_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_dns_monitor.API.Get",
					summary: "GET DNS Monitor.",
					description: "GET a DNS Monitor.",
					purpose: "Retrieve specific v1-dns-monitor",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/v1_dns_monitors/{name}",
				},
				{
					action: "delete",
					resourceType: "v1_dns_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_dns_monitor.API.Delete",
					summary: "DELETE DNS Monitor.",
					description: "DELETE the specified v1_dns_monitor.",
					purpose: "Delete v1-dns-monitor",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/v1_dns_monitors/{name}",
				},
				{
					action: "create",
					resourceType: "v1_http_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_http_monitor.API.Create",
					summary: "Create HTTP Monitor.",
					description: "Create HTTP Monitor.",
					purpose: "Create new v1-http-monitor",
					path: "/api/observability/synthetic_monitor/namespaces/{metadata.namespace}/v1_http_monitors",
				},
				{
					action: "replace",
					resourceType: "v1_http_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_http_monitor.API.Replace",
					summary: "Update HTTP Monitor.",
					description: "Update HTTP Monitor.",
					purpose: "Replace existing v1-http-monitor",
					path: "/api/observability/synthetic_monitor/namespaces/{metadata.namespace}/v1_http_monitors/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "filtered-http-monitor-list",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_http_monitor.CustomAPI.GetFilteredHTTPMonitorList",
					summary: "GET Filtered HTTP Monitor List.",
					description:
						"List v1_http_monitor in a namespace based on filter.",
					purpose: "List all filtered-http-monitor-lists",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/filtered-http-monitor-list",
				},
				{
					action: "list",
					resourceType: "v1_http_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_http_monitor.API.List",
					summary: "List HTTP Monitor.",
					description:
						"List the set of v1_http_monitor in a namespace.",
					purpose: "List all v1-http-monitors",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/v1_http_monitors",
				},
				{
					action: "get",
					resourceType: "v1_http_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_http_monitor.API.Get",
					summary: "GET HTTP Monitor.",
					description: "GET HTTP Monitor.",
					purpose: "Retrieve specific v1-http-monitor",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/v1_http_monitors/{name}",
				},
				{
					action: "delete",
					resourceType: "v1_http_monitor",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.v1_http_monitor.API.Delete",
					summary: "DELETE HTTP Monitor.",
					description: "DELETE the specified v1_http_monitor.",
					purpose: "Delete v1-http-monitor",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/v1_http_monitors/{name}",
				},
				{
					action: "create",
					resourceType: "access_log",
					operationId: "ves.io.schema.log.CustomAPI.AccessLogQueryV2",
					summary: "Access Log Query V2.",
					description:
						"Request to GET access logs that matches the criteria in request for a given namespace. Typically, virtual host is specified as match condition in the request to GET all access logs for a virtual host. By default, the access logs in the response are sorted in the reverse chronological order.",
					purpose: "Create new access-log",
					path: "/api/data/namespaces/{namespace}/access_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.AccessLogAggregationQuery",
					summary: "Access Log Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the access logs that matches the query in request for a given namespace. Typically, virtual host is specified as match condition in the request to GET the aggregaation data for a virtual host.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/access_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.AccessLogScrollQuery",
					summary: "Access Log Scroll Query.",
					description:
						"The response for access log query contain no more than 500 records. Scroll request is used scroll through more than 500 records or all records that matched the criteria in the access log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/access_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.AccessLogScrollQuery",
					summary: "Access Log Scroll Query.",
					description:
						"The response for access log query contain no more than 500 records. Scroll request is used scroll through more than 500 records or all records that matched the criteria in the access log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/access_logs/scroll",
				},
				{
					action: "create",
					resourceType: "audit_log",
					operationId: "ves.io.schema.log.CustomAPI.AuditLogQueryV2",
					summary: "Audit Log Query V2.",
					description:
						"Request to GET audit logs that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all CRUD operations performed in the namespace. User with access to the `system` namespace may query for audit logs across all namespaces for a given tenant.",
					purpose: "Create new audit-log",
					path: "/api/data/namespaces/{namespace}/audit_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.AuditLogAggregationQuery",
					summary: "Audit Log Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the audit logs that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for audit logs across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/audit_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.AuditLogScrollQuery",
					summary: "Audit Log Scroll Query.",
					description:
						"The response for audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.AuditLogScrollQuery",
					summary: "Audit Log Scroll Query.",
					description:
						"The response for audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "firewall_log",
					operationId: "ves.io.schema.log.CustomAPI.FirewallLogQuery",
					summary: "Firewall Logs Query.",
					description:
						"Request to GET access logs and network logs with policy hits. By default, the firewall logs in the response are sorted in the reverse chronological order.",
					purpose: "Create new firewall-log",
					path: "/api/data/namespaces/{namespace}/firewall_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.FirewallLogAggregationQuery",
					summary: "Firewall Logs Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the firewall logs that matches the query in request for a given namespace.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/firewall_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.FirewallLogScrollQuery",
					summary: "Firewall Logs Scroll Query.",
					description:
						"The response for firewall log query contain no more than 500 records. Scroll request is used scroll through more than 500 records or all records that matched the criteria in the firewall log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/firewall_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.FirewallLogScrollQuery",
					summary: "Firewall Logs Scroll Query.",
					description:
						"The response for firewall log query contain no more than 500 records. Scroll request is used scroll through more than 500 records or all records that matched the criteria in the firewall log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/firewall_logs/scroll",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.K8SAuditLogScrollQuery",
					summary: "K8s Audit Log Scroll Query.",
					description:
						"The response for K8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/k8s_audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.K8SAuditLogScrollQuery",
					summary: "K8s Audit Log Scroll Query.",
					description:
						"The response for K8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/k8s_audit_logs/scroll",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.K8SEventsScrollQuery",
					summary: "K8s Events Scroll Query.",
					description:
						"The response for K8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/k8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.K8SEventsScrollQuery",
					summary: "K8s Events Scroll Query.",
					description:
						"The response for K8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/k8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "platform_event",
					operationId:
						"ves.io.schema.log.CustomAPI.PlatformEventQuery",
					summary: "Platform event Query.",
					description:
						"Request to GET platform event that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all CRUD operations performed in the namespace. User with access to the `system` namespace may query for platform events across all namespaces for a given tenant.",
					purpose: "Create new platform-event",
					path: "/api/data/namespaces/{namespace}/platform_events",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.PlatformEventAggregationQuery",
					summary: "Platform event Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the audit logs that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for platform event across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/platform_events/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.PlatformEventScrollQuery",
					summary: "Platform event Scroll Query.",
					description:
						"The response for platform event query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/platform_events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.PlatformEventScrollQuery",
					summary: "Platform event Scroll Query.",
					description:
						"The response for platform event query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/platform_events/scroll",
				},
				{
					action: "create",
					resourceType: "vk8s_audit_log",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SAuditLogQuery",
					summary: "VK8s Audit Log Query.",
					description:
						"Request to GET Virtual K8s audit logs that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all CRUD operations performed in the namespace. User with access to the `system` namespace may query for audit logs across all namespaces for a given tenant.",
					purpose: "Create new vk8s-audit-log",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SAuditLogAggregationQuery",
					summary: "VK8s Audit Log Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the vK8s audit logs that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for audit logs across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SAuditLogScrollQuery",
					summary: "VK8s Audit Log Scroll Query.",
					description:
						"The response for vK8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.VK8SAuditLogScrollQuery",
					summary: "VK8s Audit Log Scroll Query.",
					description:
						"The response for vK8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "vk8s_event",
					operationId: "ves.io.schema.log.CustomAPI.VK8SEventsQuery",
					summary: "VK8s Events Query.",
					description:
						"Request to GET Virtual K8s events that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all vK8s events in the namespace. User with access to the `system` namespace may query for vK8s across all namespaces for a given tenant.",
					purpose: "Create new vk8s-event",
					path: "/api/data/namespaces/{namespace}/vk8s_events",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SEventsAggregationQuery",
					summary: "VK8s Events Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the vK8s events that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for vK8s events across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/vk8s_events/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SEventsScrollQuery",
					summary: "VK8s Events Scroll Query.",
					description:
						"The response for vK8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/vk8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.VK8SEventsScrollQuery",
					summary: "VK8s Events Scroll Query.",
					description:
						"The response for vK8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/vk8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.observability.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to Observability service.",
					description:
						"Subscribe to Observability Synthetic Monitor.",
					purpose: "Create new subscribe",
					path: "/api/observability/connector/namespaces/system/observability/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.observability.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Observability Synthetic Monitor.",
					description:
						"Unsubscribe to Observability Synthetic Monitor.",
					purpose: "Create new unsubscribe",
					path: "/api/observability/connector/namespaces/system/observability/unsubscribe",
				},
				{
					action: "list",
					resourceType: "certificate-report-detail",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetCertificateReportDetail",
					summary: "GET Certificate Report Detail.",
					description: "Returns the certificate report detail.",
					purpose: "List all certificate-report-details",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/certificate-report-detail",
				},
				{
					action: "list",
					resourceType: "certificate-summary",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetCertSummary",
					summary: "GET Certificate Summary.",
					description:
						"Returns list of TLS certificate expirations in specified time window for HTTPS monitors running in namespace.",
					purpose: "List all certificate-summarys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/certificate-summary",
				},
				{
					action: "list",
					resourceType: "dns-monitor-summary",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetDNSMonitorSummary",
					summary: "GET DNS Monitor Summary.",
					description:
						"Returns the DNS monitor health status, latency, and trend.",
					purpose: "List all dns-monitor-summarys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/dns-monitor-summary",
				},
				{
					action: "create",
					resourceType: "dns-monitors-health",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetDNSMonitorHealth",
					summary: "GET DNS Monitor Health.",
					description:
						"Returns list of DNS monitors in namespace with corresponding region health(s)",
					purpose: "Create new dns-monitors-health",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/dns-monitors-health",
				},
				{
					action: "list",
					resourceType: "global-history",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetGlobalHistory",
					summary: "GET Global History.",
					description:
						"Returns a time series of critical monitor counts in namespace.",
					purpose: "List all global-historys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/global-history",
				},
				{
					action: "list",
					resourceType: "global-summary",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetGlobalSummary",
					summary: "GET Global Summary.",
					description:
						"Returns a healthy and critical count of all monitors in namespace, based on monitor type.",
					purpose: "List all global-summarys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/global-summary",
				},
				{
					action: "list",
					resourceType: "health",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetHealth",
					summary: "GET Synthetic Monitoring Health Check.",
					description: "Returns 200 Ok if the service is healthy.",
					purpose: "List all healths",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/health",
				},
				{
					action: "list",
					resourceType: "http-monitor-detail",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetHTTPMonitorDetail",
					summary: "GET HTTP Monitor Detail.",
					description:
						"Returns the monitor latency, trend, and health by region.",
					purpose: "List all http-monitor-details",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/http-monitor-detail",
				},
				{
					action: "list",
					resourceType: "http-monitor-summary",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetHTTPMonitorSummary",
					summary: "GET HTTP Monitor Summary.",
					description:
						"Returns the HTTP monitor health status, latency, and trend.",
					purpose: "List all http-monitor-summarys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/http-monitor-summary",
				},
				{
					action: "create",
					resourceType: "http-monitors-health",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetHTTPMonitorHealth",
					summary: "GET HTTP Monitor Health.",
					description:
						"Returns list of HTTP monitors in namespace with corresponding region health(s)",
					purpose: "Create new http-monitors-health",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/http-monitors-health",
				},
				{
					action: "create",
					resourceType: "metric-query",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetMetricQueryData",
					summary: "GET Metric Query Data.",
					description:
						"Returns time series data of monitor metric query by region.",
					purpose: "Create new metric-query",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/metric-query",
				},
				{
					action: "list",
					resourceType: "monitor-event",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetMonitorEvents",
					summary: "GET Monitor Events.",
					description:
						"Returns the healthy and critical events for the specified monitor.",
					purpose: "List all monitor-events",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/monitor-events",
				},
				{
					action: "list",
					resourceType: "monitor-history",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetMonitorHistory",
					summary: "GET Monitor History.",
					description:
						"Returns the healthy and critical statuses for the specified monitor.",
					purpose: "List all monitor-historys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/monitor-history",
				},
				{
					action: "list",
					resourceType: "record-type-summary",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetRecordTypeSummary",
					summary: "GET Record Type Summary.",
					description:
						"Returns record type summary for DNS monitor including record type and count.",
					purpose: "List all record-type-summarys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/record-type-summary",
				},
				{
					action: "list",
					resourceType: "source-summary",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetSourceSummary",
					summary: "GET Source Summary.",
					description:
						"Returns the healthy and critical status count, latency, and coordinates for each source region.",
					purpose: "List all source-summarys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/source-summary",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"Returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/suggest-values",
				},
				{
					action: "list",
					resourceType: "tls-report-detail",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetTLSReportDetail",
					summary: "GET TLS Report Detail.",
					description:
						"Returns the HTML encoding of the generated TLS report.",
					purpose: "List all tls-report-details",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/tls-report-detail",
				},
				{
					action: "list",
					resourceType: "tls-report-summary",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetTLSReportSummary",
					summary: "GET TLS Report Summary.",
					description:
						"Returns the TLS report summary including grade, score, and protocol names.",
					purpose: "List all tls-report-summarys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/tls-report-summary",
				},
				{
					action: "list",
					resourceType: "tls-summary",
					operationId:
						"ves.io.schema.observability.synthetic_monitor.CustomAPI.GetTLSSummary",
					summary: "GET TLS Summary.",
					description:
						"Returns TLS summary of all HTTPS monitors running in namespace.",
					purpose: "List all tls-summarys",
					path: "/api/observability/synthetic_monitor/namespaces/{namespace}/tls-summary",
				},
			],
		},
	],
	[
		"rate_limiting",
		{
			domain: "rate_limiting",
			displayName: "Rate Limiting",
			description:
				"Create rate limiter policies with configurable time periods using seconds, minutes, or hours granularity. Deploy policers and protocol policers to enforce bandwidth constraints across namespaces. Define limit values, burst allowances, and blocking behaviors when thresholds trigger. Integrate with load balancers and security policies for layered traffic management and abuse prevention.",
			descriptionShort:
				"Create rate limiter policies with configurable time perio...",
			resourceTypes: ["policer", "protocol_policer", "rate_limiter"],
			operations: [
				{
					action: "create",
					resourceType: "policer",
					operationId: "ves.io.schema.policer.API.Create",
					summary: "Create Policer.",
					description:
						"Create a new policer with traffic rate limits.",
					purpose: "Create new policer",
					path: "/api/config/namespaces/{metadata.namespace}/policers",
				},
				{
					action: "replace",
					resourceType: "policer",
					operationId: "ves.io.schema.policer.API.Replace",
					summary: "Replace Policer.",
					description:
						"Replace a given policer with changed traffic rate limits.",
					purpose: "Replace existing policer",
					path: "/api/config/namespaces/{metadata.namespace}/policers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "policer",
					operationId: "ves.io.schema.policer.API.List",
					summary: "List Policer.",
					description: "List the set of policer in a namespace.",
					purpose: "List all policers",
					path: "/api/config/namespaces/{namespace}/policers",
				},
				{
					action: "get",
					resourceType: "policer",
					operationId: "ves.io.schema.policer.API.Get",
					summary: "GET Policer.",
					description: "GET specification of policer object.",
					purpose: "Retrieve specific policer",
					path: "/api/config/namespaces/{namespace}/policers/{name}",
				},
				{
					action: "delete",
					resourceType: "policer",
					operationId: "ves.io.schema.policer.API.Delete",
					summary: "DELETE Policer.",
					description: "DELETE the specified policer.",
					purpose: "Delete policer",
					path: "/api/config/namespaces/{namespace}/policers/{name}",
				},
				{
					action: "create",
					resourceType: "protocol_policer",
					operationId: "ves.io.schema.protocol_policer.API.Create",
					summary: "Create Protocol Policer.",
					description:
						"Create a protocol_policer object, protocol_policer object contains list of L4 protocol match condition and corresponding traffic rate limits.",
					purpose: "Create new protocol-policer",
					path: "/api/config/namespaces/{metadata.namespace}/protocol_policers",
				},
				{
					action: "replace",
					resourceType: "protocol_policer",
					operationId: "ves.io.schema.protocol_policer.API.Replace",
					summary: "Replace Protocol Policer.",
					description:
						"Replace a protocol_policer object with new L4 protocol match condition and corresponding traffic rate limits.",
					purpose: "Replace existing protocol-policer",
					path: "/api/config/namespaces/{metadata.namespace}/protocol_policers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "protocol_policer",
					operationId: "ves.io.schema.protocol_policer.API.List",
					summary: "List Protocol Policer.",
					description:
						"List the set of protocol_policer in a namespace.",
					purpose: "List all protocol-policers",
					path: "/api/config/namespaces/{namespace}/protocol_policers",
				},
				{
					action: "get",
					resourceType: "protocol_policer",
					operationId: "ves.io.schema.protocol_policer.API.Get",
					summary: "GET Protocol Policer.",
					description:
						"GET specification of a protocol_policer object with L4 protocol match condition and corresponding traffic rate limits.",
					purpose: "Retrieve specific protocol-policer",
					path: "/api/config/namespaces/{namespace}/protocol_policers/{name}",
				},
				{
					action: "delete",
					resourceType: "protocol_policer",
					operationId: "ves.io.schema.protocol_policer.API.Delete",
					summary: "DELETE Protocol Policer.",
					description: "DELETE the specified protocol_policer.",
					purpose: "Delete protocol-policer",
					path: "/api/config/namespaces/{namespace}/protocol_policers/{name}",
				},
				{
					action: "create",
					resourceType: "rate_limiter",
					operationId: "ves.io.schema.rate_limiter.API.Create",
					summary: "Create Rate Limiter.",
					description:
						"Create rate_limiter creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new rate-limiter",
					path: "/api/config/namespaces/{metadata.namespace}/rate_limiters",
				},
				{
					action: "replace",
					resourceType: "rate_limiter",
					operationId: "ves.io.schema.rate_limiter.API.Replace",
					summary: "Replace Rate Limiter.",
					description:
						"Replace rate_limiter replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing rate-limiter",
					path: "/api/config/namespaces/{metadata.namespace}/rate_limiters/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "rate_limiter",
					operationId: "ves.io.schema.rate_limiter.API.List",
					summary: "List Rate Limiter.",
					description: "List the set of rate_limiter in a namespace.",
					purpose: "List all rate-limiters",
					path: "/api/config/namespaces/{namespace}/rate_limiters",
				},
				{
					action: "get",
					resourceType: "rate_limiter",
					operationId: "ves.io.schema.rate_limiter.API.Get",
					summary: "GET Rate Limiter.",
					description:
						"GET rate_limiter reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific rate-limiter",
					path: "/api/config/namespaces/{namespace}/rate_limiters/{name}",
				},
				{
					action: "delete",
					resourceType: "rate_limiter",
					operationId: "ves.io.schema.rate_limiter.API.Delete",
					summary: "DELETE Rate Limiter.",
					description: "DELETE the specified rate_limiter.",
					purpose: "Delete rate-limiter",
					path: "/api/config/namespaces/{namespace}/rate_limiters/{name}",
				},
			],
		},
	],
	[
		"secops_and_incident_response",
		{
			domain: "secops_and_incident_response",
			displayName: "Secops And Incident Response",
			description:
				"Manage incident response workflows that detect and mitigate malicious users automatically. Create rules matching threat levels to actions like blocking, rate limiting, or alerting. Set up mitigation policies per namespace to isolate security responses. Define thresholds for user behavior analysis and configure graduated responses based on severity. Integrate with bot defense and WAF systems for coordinated protection across application layers.",
			descriptionShort:
				"Manage incident response workflows that detect and mitiga...",
			resourceTypes: ["malicious_user_mitigation"],
			operations: [
				{
					action: "create",
					resourceType: "malicious_user_mitigation",
					operationId:
						"ves.io.schema.malicious_user_mitigation.API.Create",
					summary: "Create Malicious User Mitigation.",
					description:
						"Create malicious_user_mitigation creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new malicious-user-mitigation",
					path: "/api/config/namespaces/{metadata.namespace}/malicious_user_mitigations",
				},
				{
					action: "replace",
					resourceType: "malicious_user_mitigation",
					operationId:
						"ves.io.schema.malicious_user_mitigation.API.Replace",
					summary: "Replace Malicious User Mitigation.",
					description:
						"Replace malicious_user_mitigation replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing malicious-user-mitigation",
					path: "/api/config/namespaces/{metadata.namespace}/malicious_user_mitigations/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "malicious_user_mitigation",
					operationId:
						"ves.io.schema.malicious_user_mitigation.API.List",
					summary: "List Malicious User Mitigation.",
					description:
						"List the set of malicious_user_mitigation in a namespace.",
					purpose: "List all malicious-user-mitigations",
					path: "/api/config/namespaces/{namespace}/malicious_user_mitigations",
				},
				{
					action: "get",
					resourceType: "malicious_user_mitigation",
					operationId:
						"ves.io.schema.malicious_user_mitigation.API.Get",
					summary: "GET Malicious User Mitigation.",
					description:
						"GET malicious_user_mitigation reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific malicious-user-mitigation",
					path: "/api/config/namespaces/{namespace}/malicious_user_mitigations/{name}",
				},
				{
					action: "delete",
					resourceType: "malicious_user_mitigation",
					operationId:
						"ves.io.schema.malicious_user_mitigation.API.Delete",
					summary: "DELETE Malicious User Mitigation.",
					description:
						"DELETE the specified malicious_user_mitigation.",
					purpose: "Delete malicious-user-mitigation",
					path: "/api/config/namespaces/{namespace}/malicious_user_mitigations/{name}",
				},
			],
		},
	],
	[
		"service_mesh",
		{
			domain: "service_mesh",
			displayName: "Service Mesh",
			description:
				"Create classifications to organize services and support automatic identification of interconnected components. Set up analysis pipelines to understand patterns and build intelligent routing rules. Define network function virtualization for regional architectures. Configure authentication settings including location, state, and type recognition.",
			descriptionShort:
				"Create classifications to organize services and support a...",
			resourceTypes: [
				"api_endpoint",
				"app_setting",
				"app_type",
				"endpoint",
				"force-delete",
				"learnt_schema",
				"metric",
				"nfv_service",
				"override",
				"pdf",
				"pop",
				"push",
				"sid_counter",
				"site_mesh_group",
				"software_os_version",
				"suspicious_user",
				"swagger_spec",
				"virtual_network",
			],
			operations: [
				{
					action: "create",
					resourceType: "app_setting",
					operationId: "ves.io.schema.app_setting.API.Create",
					summary: "Create App Setting.",
					description:
						"Create App setting configuration in namespace metadata.namespace.",
					purpose: "Create new app-setting",
					path: "/api/config/namespaces/{metadata.namespace}/app_settings",
				},
				{
					action: "replace",
					resourceType: "app_setting",
					operationId: "ves.io.schema.app_setting.API.Replace",
					summary: "Replace App Setting.",
					description:
						"Replacing an App setting will update the configuration by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing app-setting",
					path: "/api/config/namespaces/{metadata.namespace}/app_settings/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "app_setting",
					operationId: "ves.io.schema.app_setting.API.List",
					summary: "List App Setting.",
					description: "List the set of app_setting in a namespace.",
					purpose: "List all app-settings",
					path: "/api/config/namespaces/{namespace}/app_settings",
				},
				{
					action: "get",
					resourceType: "app_setting",
					operationId: "ves.io.schema.app_setting.API.Get",
					summary: "GET App Setting.",
					description:
						"GET App setting will retrieve the configuration from namespace metadata.namespace.",
					purpose: "Retrieve specific app-setting",
					path: "/api/config/namespaces/{namespace}/app_settings/{name}",
				},
				{
					action: "delete",
					resourceType: "app_setting",
					operationId: "ves.io.schema.app_setting.API.Delete",
					summary: "DELETE App Setting.",
					description: "DELETE the specified app_setting.",
					purpose: "Delete app-setting",
					path: "/api/config/namespaces/{namespace}/app_settings/{name}",
				},
				{
					action: "get",
					resourceType: "suspicious_user",
					operationId:
						"ves.io.schema.app_setting.CustomAPI.SuspiciousUserStatus",
					summary: "GET Status of Suspicious users.",
					description: "GET status of suspicious users.",
					purpose: "Retrieve specific suspicious-user",
					path: "/api/ml/data/namespaces/{namespace}/app_settings/{name}/suspicious_users",
				},
				{
					action: "create",
					resourceType: "app_type",
					operationId: "ves.io.schema.app_type.API.Create",
					summary: "Create App Type.",
					description:
						"Create App type will create the configuration in namespace metadata.namespace.",
					purpose: "Create new app-type",
					path: "/api/config/namespaces/{metadata.namespace}/app_types",
				},
				{
					action: "replace",
					resourceType: "app_type",
					operationId: "ves.io.schema.app_type.API.Replace",
					summary: "Replace App Type.",
					description:
						"Update the configuration by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing app-type",
					path: "/api/config/namespaces/{metadata.namespace}/app_types/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "app_type",
					operationId: "ves.io.schema.app_type.API.List",
					summary: "List App Type.",
					description: "List the set of app_type in a namespace.",
					purpose: "List all app-types",
					path: "/api/config/namespaces/{namespace}/app_types",
				},
				{
					action: "create",
					resourceType: "learnt_schema",
					operationId:
						"ves.io.schema.app_type.CustomAPI.GetAPIEndpointLearntSchema",
					summary: "GET Learnt Schema per API endpoint.",
					description:
						"GET Learnt Schema per API endpoint for a given auto discovered API endpoint for Service.",
					purpose: "Create new learnt-schema",
					path: "/api/ml/data/namespaces/{namespace}/app_types/{app_type_name}/api_endpoint/learnt_schema",
				},
				{
					action: "list",
					resourceType: "pdf",
					operationId:
						"ves.io.schema.app_type.CustomAPI.APIEndpointPDF",
					summary: "GET PDF",
					description:
						"GET PDF of all metrics for a given auto discovered API endpoint for App type.",
					purpose: "List all pdfs",
					path: "/api/ml/data/namespaces/{namespace}/app_types/{app_type_name}/api_endpoint/pdf",
				},
				{
					action: "list",
					resourceType: "api_endpoint",
					operationId:
						"ves.io.schema.app_type.CustomAPI.APIEndpoints",
					summary: "GET API endpoints.",
					description:
						"GET all auto discovered API endpoints for App type.",
					purpose: "List all api-endpoints",
					path: "/api/ml/data/namespaces/{namespace}/app_types/{app_type_name}/api_endpoints",
				},
				{
					action: "list",
					resourceType: "swagger_spec",
					operationId:
						"ves.io.schema.app_type.CustomAPI.GetSwaggerSpec",
					summary: "GET Swagger Spec for App Type.",
					description:
						"GET the corresponding Swagger spec for the given app type.",
					purpose: "List all swagger-specs",
					path: "/api/ml/data/namespaces/{namespace}/app_types/{app_type_name}/api_endpoints/swagger_spec",
				},
				{
					action: "create",
					resourceType: "pop",
					operationId: "ves.io.schema.app_type.CustomAPI.OverridePop",
					summary: "Remove Override.",
					description:
						"Remove override for dynamic component for API endpoints discovered for this App type.",
					purpose: "Create new pop",
					path: "/api/ml/data/namespaces/{namespace}/app_types/{app_type_name}/override/pop",
				},
				{
					action: "create",
					resourceType: "push",
					operationId:
						"ves.io.schema.app_type.CustomAPI.OverridePush",
					summary: "Add Override.",
					description:
						"Add override for dynamic component for API endpoints discovered for this App type.",
					purpose: "Create new push",
					path: "/api/ml/data/namespaces/{namespace}/app_types/{app_type_name}/override/push",
				},
				{
					action: "list",
					resourceType: "override",
					operationId: "ves.io.schema.app_type.CustomAPI.Overrides",
					summary: "GET Override.",
					description:
						"GET all override for API endpoints configured for this App type.",
					purpose: "List all overrides",
					path: "/api/ml/data/namespaces/{namespace}/app_types/{app_type_name}/overrides",
				},
				{
					action: "create",
					resourceType: "pdf",
					operationId:
						"ves.io.schema.app_type.CustomAPI.GetServiceAPIEndpointPDF",
					summary: "GET Service API Endpoint PDF.",
					description:
						"GET PDF of all metrics for a given auto discovered API endpoint for Service.",
					purpose: "Create new pdf",
					path: "/api/ml/data/namespaces/{namespace}/app_types/{app_type_name}/services/{service_name}/api_endpoint/pdf",
				},
				{
					action: "create",
					resourceType: "api_endpoint",
					operationId:
						"ves.io.schema.app_type.CustomAPI.GetServiceAPIEndpoints",
					summary: "GET Service API Endpoints.",
					description:
						"GET all autodiscovered API endpoints for Service.",
					purpose: "Create new api-endpoint",
					path: "/api/ml/data/namespaces/{namespace}/app_types/{app_type_name}/services/{service_name}/api_endpoints",
				},
				{
					action: "get",
					resourceType: "app_type",
					operationId: "ves.io.schema.app_type.API.Get",
					summary: "GET App Type.",
					description:
						"GET App type will read the configuration from namespace metadata.namespace.",
					purpose: "Retrieve specific app-type",
					path: "/api/config/namespaces/{namespace}/app_types/{name}",
				},
				{
					action: "delete",
					resourceType: "app_type",
					operationId: "ves.io.schema.app_type.API.Delete",
					summary: "DELETE App Type.",
					description: "DELETE the specified app_type.",
					purpose: "Delete app-type",
					path: "/api/config/namespaces/{namespace}/app_types/{name}",
				},
				{
					action: "create",
					resourceType: "endpoint",
					operationId: "ves.io.schema.endpoint.API.Create",
					summary: "Create Endpoint.",
					description:
						"Create endpoint will create the object in the storage backend for namespace metadata.namespace.",
					purpose: "Create new endpoint",
					path: "/api/config/namespaces/{metadata.namespace}/endpoints",
				},
				{
					action: "replace",
					resourceType: "endpoint",
					operationId: "ves.io.schema.endpoint.API.Replace",
					summary: "Replace Endpoint.",
					description:
						"Replacing an endpoint object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing endpoint",
					path: "/api/config/namespaces/{metadata.namespace}/endpoints/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "endpoint",
					operationId: "ves.io.schema.endpoint.API.List",
					summary: "List Endpoint.",
					description: "List the set of endpoint in a namespace.",
					purpose: "List all endpoints",
					path: "/api/config/namespaces/{namespace}/endpoints",
				},
				{
					action: "get",
					resourceType: "endpoint",
					operationId: "ves.io.schema.endpoint.API.Get",
					summary: "GET Endpoint.",
					description:
						"GET endpoint will GET the object from the storage backend for namespace metadata.namespace.",
					purpose: "Retrieve specific endpoint",
					path: "/api/config/namespaces/{namespace}/endpoints/{name}",
				},
				{
					action: "delete",
					resourceType: "endpoint",
					operationId: "ves.io.schema.endpoint.API.Delete",
					summary: "DELETE Endpoint.",
					description: "DELETE the specified endpoint.",
					purpose: "Delete endpoint",
					path: "/api/config/namespaces/{namespace}/endpoints/{name}",
				},
				{
					action: "create",
					resourceType: "force-delete",
					operationId:
						"ves.io.schema.nfv_service.CustomAPI.ForceDeleteNFVService",
					summary: "Force DELETE NFV Service.",
					description: "Force DELETE NFV Service.",
					purpose: "Create new force-delete",
					path: "/api/config/namespaces/system/nfv_service/{name}/force-delete",
				},
				{
					action: "create",
					resourceType: "nfv_service",
					operationId: "ves.io.schema.nfv_service.API.Create",
					summary: "Create NFV Service.",
					description:
						"Creates a new NFV service with configured parameters.",
					purpose: "Create new nfv-service",
					path: "/api/config/namespaces/{metadata.namespace}/nfv_services",
				},
				{
					action: "replace",
					resourceType: "nfv_service",
					operationId: "ves.io.schema.nfv_service.API.Replace",
					summary: "Replace NFV Service.",
					description:
						"Replaces configured NFV Service with new set of parameters.",
					purpose: "Replace existing nfv-service",
					path: "/api/config/namespaces/{metadata.namespace}/nfv_services/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "nfv_service",
					operationId: "ves.io.schema.nfv_service.API.List",
					summary: "List NFV Service.",
					description: "List the set of nfv_service in a namespace.",
					purpose: "List all nfv-services",
					path: "/api/config/namespaces/{namespace}/nfv_services",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.nfv_service.CustomDataAPI.Metrics",
					summary: "Metrics",
					description: "Nfv Service metrics.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/{namespace}/nfv_services/metrics",
				},
				{
					action: "get",
					resourceType: "nfv_service",
					operationId: "ves.io.schema.nfv_service.API.Get",
					summary: "GET NFV Service.",
					description: "Gets NFV Service parameters.",
					purpose: "Retrieve specific nfv-service",
					path: "/api/config/namespaces/{namespace}/nfv_services/{name}",
				},
				{
					action: "delete",
					resourceType: "nfv_service",
					operationId: "ves.io.schema.nfv_service.API.Delete",
					summary: "DELETE NFV Service.",
					description: "DELETE the specified nfv_service.",
					purpose: "Delete nfv-service",
					path: "/api/config/namespaces/{namespace}/nfv_services/{name}",
				},
				{
					action: "create",
					resourceType: "site_mesh_group",
					operationId: "ves.io.schema.site_mesh_group.API.Create",
					summary: "Create Site Mesh Group.",
					description:
						"Create a Site Mesh Group in system namespace of user.",
					purpose: "Create new site-mesh-group",
					path: "/api/config/namespaces/{metadata.namespace}/site_mesh_groups",
				},
				{
					action: "replace",
					resourceType: "site_mesh_group",
					operationId: "ves.io.schema.site_mesh_group.API.Replace",
					summary: "Replace Site Mesh Group.",
					description:
						"Replace contents of a Site Mesh Group object.",
					purpose: "Replace existing site-mesh-group",
					path: "/api/config/namespaces/{metadata.namespace}/site_mesh_groups/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "site_mesh_group",
					operationId: "ves.io.schema.site_mesh_group.API.List",
					summary: "List Site Mesh Group.",
					description:
						"List the set of site_mesh_group in a namespace.",
					purpose: "List all site-mesh-groups",
					path: "/api/config/namespaces/{namespace}/site_mesh_groups",
				},
				{
					action: "get",
					resourceType: "site_mesh_group",
					operationId: "ves.io.schema.site_mesh_group.API.Get",
					summary: "GET Site Mesh Group.",
					description:
						"Gets Site Mesh Group object from system namespace.",
					purpose: "Retrieve specific site-mesh-group",
					path: "/api/config/namespaces/{namespace}/site_mesh_groups/{name}",
				},
				{
					action: "delete",
					resourceType: "site_mesh_group",
					operationId: "ves.io.schema.site_mesh_group.API.Delete",
					summary: "DELETE Site Mesh Group.",
					description: "DELETE the specified site_mesh_group.",
					purpose: "Delete site-mesh-group",
					path: "/api/config/namespaces/{namespace}/site_mesh_groups/{name}",
				},
				{
					action: "create",
					resourceType: "software_os_version",
					operationId:
						"ves.io.schema.virtual_appliance.SoftwareVersionOsImageCustomApi.GetImage",
					summary: "GET OS based on SW_VERSION.",
					description:
						"API to GET OS IMAGE based on the software version.",
					purpose: "Create new software-os-version",
					path: "/api/maurice/software_os_version",
				},
				{
					action: "create",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.Create",
					summary: "Create Virtual Network.",
					description: "Create virtual network in given namespace.",
					purpose: "Create new virtual-network",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_networks",
				},
				{
					action: "replace",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.Replace",
					summary: "Replace Virtual Network.",
					description:
						"Replace given virtual network in given namespace.",
					purpose: "Replace existing virtual-network",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_networks/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "sid_counter",
					operationId:
						"ves.io.schema.virtual_network.CustomDataAPI.SIDCounters",
					summary: "SID Counters.",
					description: "API to GET SID Counters.",
					purpose: "Create new sid-counter",
					path: "/api/data/namespaces/{namespace}/virtual_network/sid_counters",
				},
				{
					action: "list",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.List",
					summary: "List Virtual Network.",
					description:
						"List the set of virtual_network in a namespace.",
					purpose: "List all virtual-networks",
					path: "/api/config/namespaces/{namespace}/virtual_networks",
				},
				{
					action: "get",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.Get",
					summary: "GET Virtual Network.",
					description: "Gets virtual network in given namespace.",
					purpose: "Retrieve specific virtual-network",
					path: "/api/config/namespaces/{namespace}/virtual_networks/{name}",
				},
				{
					action: "delete",
					resourceType: "virtual_network",
					operationId: "ves.io.schema.virtual_network.API.Delete",
					summary: "DELETE Virtual Network.",
					description: "DELETE the specified virtual_network.",
					purpose: "Delete virtual-network",
					path: "/api/config/namespaces/{namespace}/virtual_networks/{name}",
				},
			],
		},
	],
	[
		"shape",
		{
			domain: "shape",
			displayName: "Shape",
			description:
				"Set up bot defense infrastructure across namespaces with deployment tracking and status monitoring. Integrate mobile SDK attributes for app shielding and device recognition. Subscribe to threat intelligence services for real-time protection updates. Define cluster states and location-based policies for distributed bot mitigation. Track deployment history and manage policy configurations through centralized infrastructure objects.",
			descriptionShort:
				"Set up bot defense infrastructure across namespaces with ...",
			resourceTypes: [
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
				"deployment_statu",
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
				"metric",
				"mitigated_domain",
				"mobile-sdk",
				"mobile_base_config",
				"mobile_base_config_file",
				"networkInteraction",
				"o",
				"overview",
				"personal-stat",
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
				"state",
				"statu",
				"subscribe",
				"suggest-value",
				"summary",
				"table",
				"template",
				"testj",
				"threat-type",
				"timesery",
				"top-good-bot",
				"top-reason-code",
				"top_location",
				"top_reason_code",
				"top_source",
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
				"unsubscribe",
				"update_domain",
				"url",
				"version",
			],
			operations: [
				{
					action: "create",
					resourceType: "app_provision",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.ApplicationProvision",
					summary: "Application Provision.",
					description: "Provision an application for a tenant.",
					purpose: "Create new app-provision",
					path: "/api/shape/dip/namespaces/system/app_provision",
				},
				{
					action: "create",
					resourceType: "application",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.UpdateApplication",
					summary: "Update Application.",
					description: "Update an application's information.",
					purpose: "Create new application",
					path: "/api/shape/dip/namespaces/system/application",
				},
				{
					action: "delete",
					resourceType: "application",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.DeleteApplication",
					summary: "DELETE Application.",
					description: "DELETE an application.",
					purpose: "Delete application",
					path: "/api/shape/dip/namespaces/system/application",
				},
				{
					action: "list",
					resourceType: "application",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetApplications",
					summary: "GetApplications.",
					description: "GET Applications Information.",
					purpose: "List all applications",
					path: "/api/shape/dip/namespaces/system/applications",
				},
				{
					action: "create",
					resourceType: "asn",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetBotAssessmentTopAsn",
					summary: "GET Bot Assessment by Top ASN.",
					description: "GET Bot Top ASN Information.",
					purpose: "Create new asn",
					path: "/api/shape/dip/namespaces/system/bot/asn",
				},
				{
					action: "create",
					resourceType: "transaction",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetBotAssessmentTransactions",
					summary: "GET Bot Assessment for Transactions.",
					description: "GET Bot Transactions Information.",
					purpose: "Create new transaction",
					path: "/api/shape/dip/namespaces/system/bot/transactions",
				},
				{
					action: "create",
					resourceType: "url",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetBotAssessmentTopUrls",
					summary: "GET Bot Assessment by Top URLs.",
					description: "GET Bot Top URL Information.",
					purpose: "Create new url",
					path: "/api/shape/dip/namespaces/system/bot/urls",
				},
				{
					action: "create",
					resourceType: "age",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetDashboardByAge",
					summary: "GET Devices By Age.",
					description: "GET device age information.",
					purpose: "Create new age",
					path: "/api/shape/dip/namespaces/system/dashboard/age",
				},
				{
					action: "create",
					resourceType: "application",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetDashboardByApplications",
					summary: "GET Information By Applications.",
					description: "GET device applications information.",
					purpose: "Create new application",
					path: "/api/shape/dip/namespaces/system/dashboard/applications",
				},
				{
					action: "create",
					resourceType: "asn",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetDashboardByAsn",
					summary: "GET Devices By ASN.",
					description: "GET devices ASN information.",
					purpose: "Create new asn",
					path: "/api/shape/dip/namespaces/system/dashboard/asn",
				},
				{
					action: "create",
					resourceType: "country",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetDashboardByCountry",
					summary: "GET Devices By Country.",
					description: "GET devices country information.",
					purpose: "Create new country",
					path: "/api/shape/dip/namespaces/system/dashboard/country",
				},
				{
					action: "create",
					resourceType: "session",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetDashboardBySession",
					summary: "GET Devices By Session.",
					description: "GET devices session information.",
					purpose: "Create new session",
					path: "/api/shape/dip/namespaces/system/dashboard/session",
				},
				{
					action: "create",
					resourceType: "ua",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetDashboardByUa",
					summary: "GET Devices By User-Agent.",
					description: "GET devices user agent information.",
					purpose: "Create new ua",
					path: "/api/shape/dip/namespaces/system/dashboard/ua",
				},
				{
					action: "create",
					resourceType: "unique",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetDashboardUniqueAccess",
					summary: "GET Devices by Unique Access.",
					description: "GET devices unique access information.",
					purpose: "Create new unique",
					path: "/api/shape/dip/namespaces/system/dashboard/unique",
				},
				{
					action: "create",
					resourceType: "enable",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.Enable",
					summary: "Enable Application Traffic Insights.",
					description:
						"Enable Application Traffic Insights feature for the tenant.",
					purpose: "Create new enable",
					path: "/api/shape/dip/namespaces/system/enable",
				},
				{
					action: "list",
					resourceType: "region",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetRegions",
					summary:
						"GET avaialable Regions for Application Traffic Insights.",
					description:
						"Returns Application Traffic Insights regions information for the tenant.",
					purpose: "List all regions",
					path: "/api/shape/dip/namespaces/system/provision/regions",
				},
				{
					action: "list",
					resourceType: "statu",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.GetStatus",
					summary: "GET Application Traffic Insights Status.",
					description:
						"Returns Application Traffic Insights information for the tenant.",
					purpose: "List all status",
					path: "/api/shape/dip/namespaces/system/status",
				},
				{
					action: "create",
					resourceType: "src_tag_injection",
					operationId:
						"ves.io.schema.shape.device_id.CustomAPI.ValidateSrcTagInjection",
					summary: "Validate JS Injection.",
					description:
						"Validate js src tag injection in the target URL.",
					purpose: "Create new src-tag-injection",
					path: "/api/shape/dip/namespaces/system/validate/src_tag_injection",
				},
				{
					action: "create",
					resourceType: "alert_gen_policy",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_gen_policy.API.Create",
					summary: "Create Alert Generation Policy.",
					description: "Create Alert Generation Policy.",
					purpose: "Create new alert-gen-policy",
					path: "/api/shape/alerts/namespaces/{metadata.namespace}/alert_gen_policys",
				},
				{
					action: "replace",
					resourceType: "alert_gen_policy",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_gen_policy.API.Replace",
					summary: "Replace Alert Generation Policy.",
					description:
						"Replaces the content of an Alert Generation Policy object.",
					purpose: "Replace existing alert-gen-policy",
					path: "/api/shape/alerts/namespaces/{metadata.namespace}/alert_gen_policys/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "statu",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_gen_policy.CustomAPI.ChangeStatus",
					summary: "Clone Alert Template.",
					description: "Clone the BRM Alert Template.",
					purpose: "Create new statu",
					path: "/api/shape/alerts/namespaces/{namespace}/alert_gen_policy/{name}/status",
				},
				{
					action: "list",
					resourceType: "alert_gen_policy",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_gen_policy.API.List",
					summary: "List BRM Alert Generation Policy.",
					description:
						"List the set of alert_gen_policy in a namespace.",
					purpose: "List all alert-gen-policys",
					path: "/api/shape/alerts/namespaces/{namespace}/alert_gen_policys",
				},
				{
					action: "get",
					resourceType: "alert_gen_policy",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_gen_policy.API.Get",
					summary: "GET Alert Generation Policy.",
					description: "GET Alert Generation Policy.",
					purpose: "Retrieve specific alert-gen-policy",
					path: "/api/shape/alerts/namespaces/{namespace}/alert_gen_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "alert_gen_policy",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_gen_policy.API.Delete",
					summary: "DELETE BRM Alert Generation Policy.",
					description: "DELETE the specified alert_gen_policy.",
					purpose: "Delete alert-gen-policy",
					path: "/api/shape/alerts/namespaces/{namespace}/alert_gen_policys/{name}",
				},
				{
					action: "create",
					resourceType: "alert_template",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_template.API.Create",
					summary: "Create Domain to protect.",
					description: "Create Domain to protect.",
					purpose: "Create new alert-template",
					path: "/api/shape/alerts/namespaces/{metadata.namespace}/alert_templates",
				},
				{
					action: "list",
					resourceType: "alert_template",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_template.API.List",
					summary: "List BRM Alerts Alert Template.",
					description:
						"List the set of alert_template in a namespace.",
					purpose: "List all alert-templates",
					path: "/api/shape/alerts/namespaces/{namespace}/alert_templates",
				},
				{
					action: "get",
					resourceType: "alert_template",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_template.API.Get",
					summary: "GET Protected Domain.",
					description: "GET Domain to protect.",
					purpose: "Retrieve specific alert-template",
					path: "/api/shape/alerts/namespaces/{namespace}/alert_templates/{name}",
				},
				{
					action: "delete",
					resourceType: "alert_template",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_template.API.Delete",
					summary: "DELETE BRM Alerts Alert Template.",
					description: "DELETE the specified alert_template.",
					purpose: "Delete alert-template",
					path: "/api/shape/alerts/namespaces/{namespace}/alert_templates/{name}",
				},
				{
					action: "create",
					resourceType: "clone",
					operationId:
						"ves.io.schema.shape.brmalerts.alert_template.CustomAPI.Clone",
					summary: "Clone Alert Template.",
					description: "Clone the BRM Alert Template.",
					purpose: "Create new clone",
					path: "/api/shape/alerts/namespaces/{namespace}/alert_templates/{name}/clone",
				},
				{
					action: "create",
					resourceType: "bot_detection_rule",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.CustomAPI.DeployBotDetectionRules",
					summary: "Deploy Bot Detection Rules.",
					description: "Deploybotdetectionrules CustomAPI.",
					purpose: "Create new bot-detection-rule",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_detection_rules",
				},
				{
					action: "list",
					resourceType: "deployment",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.CustomAPI.GetBotDetectionRulesDeployments",
					summary: "GET list of bot detection rule deployments.",
					description: "Getbotdetectionrulesdeployments CustomAPI.",
					purpose: "List all deployments",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_detection_rules/deployments",
				},
				{
					action: "list",
					resourceType: "deployment",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.CustomAPI.GetBotDetectionRulesDeploymentDetails",
					summary: "GET details of a bot detection rule deployment.",
					description:
						"Getbotdetectionrulesdeploymentdetails CustomAPI.",
					purpose: "List all deployments",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_detection_rules/deployments/{deployment_id}",
				},
				{
					action: "list",
					resourceType: "draft",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.CustomAPI.GetBotDetectionRulesDraft",
					summary:
						"GET bot detection rules which are in draft state.",
					description: "Getbotdetectionrulesdraft CustomAPI.",
					purpose: "List all drafts",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_detection_rules/draft",
				},
				{
					action: "create",
					resourceType: "draft",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.CustomAPI.SaveDraft",
					summary: "Save draft.",
					description: "Savedraft CustomAPI.",
					purpose: "Create new draft",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_detection_rules/draft",
				},
				{
					action: "delete",
					resourceType: "draft",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.CustomAPI.DiscardDraft",
					summary: "Discard draft.",
					description: "Discarddraft CustomAPI.",
					purpose: "Delete draft",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_detection_rules/draft",
				},
				{
					action: "list",
					resourceType: "summary",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.CustomAPI.GetBotDetectionRulesSummary",
					summary: "GET summary of bot detection rules.",
					description: "Getbotdetectionrulessummary CustomAPI.",
					purpose: "List all summarys",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_detection_rules/summary",
				},
				{
					action: "list",
					resourceType: "bot_detection_rule",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.API.List",
					summary: "List Bot Detection Rule.",
					description:
						"List the set of bot_detection_rule in a namespace.",
					purpose: "List all bot-detection-rules",
					path: "/api/shape/bot/namespaces/{namespace}/bot_detection_rules",
				},
				{
					action: "list",
					resourceType: "history",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.CustomAPI.GetBotDetectionRuleChangeHistory",
					summary: "GET the change history for a bot detection rule.",
					description: "Getbotdetectionrulechangehistory CustomAPI.",
					purpose: "Retrieve specific history",
					path: "/api/shape/bot/namespaces/{namespace}/bot_detection_rules/{id}/history",
				},
				{
					action: "get",
					resourceType: "bot_detection_rule",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_rule.API.Get",
					summary: "GET Bot Detection Rule.",
					description: "GET Bot Detection Rule.",
					purpose: "Retrieve specific bot-detection-rule",
					path: "/api/shape/bot/namespaces/{namespace}/bot_detection_rules/{name}",
				},
				{
					action: "list",
					resourceType: "bot_detection_update",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_update.CustomAPI.GetBotDetectionUpdates",
					summary: "GET bot detection updates.",
					description: "Getbotdetectionupdates CustomAPI.",
					purpose: "List all bot-detection-updates",
					path: "/api/shape/bot/namespaces/{namespace}/bot_detection_updates",
				},
				{
					action: "list",
					resourceType: "download_release_note",
					operationId:
						"ves.io.schema.shape.bot_defense.threat_intelligence.bot_detection_update.CustomAPI.DownloadBotDetectionUpdatesReleaseNotes",
					summary: "Download BotDetection Updates Release Notes.",
					description:
						"Downloadbotdetectionupdatesreleasenotes CustomAPI.",
					purpose: "List all download-release-notes",
					path: "/api/shape/bot/namespaces/{namespace}/bot_detection_updates/download_release_notes",
				},
				{
					action: "list",
					resourceType: "bot_endpoint_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_endpoint_policy.CustomAPI.GetEndpointPoliciesAndVersionsList",
					summary: "List All Bot Endpoint Policies And Versions.",
					description: "GET all bot endpoint policies and versions.",
					purpose: "List all bot-endpoint-policies",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_endpoint_policies",
				},
				{
					action: "replace",
					resourceType: "bot_endpoint_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_endpoint_policy.CustomAPI.CustomReplace",
					summary: "Custom Replace Bot Endpoint Policy.",
					description: "Customreplace CustomAPI.",
					purpose: "Replace existing bot-endpoint-policy",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_endpoint_policys/{name}",
				},
				{
					action: "replace",
					resourceType: "bot_endpoint_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_endpoint_policy.API.Replace",
					summary: "Replace Bot Endpoint Policy.",
					description: "Replace Bot Endpoint Policy.",
					purpose: "Replace existing bot-endpoint-policy",
					path: "/api/shape/bot/namespaces/{metadata.namespace}/bot_endpoint_policys/{metadata.name}",
				},
				{
					action: "get",
					resourceType: "version",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_endpoint_policy.CustomAPI.GetEndpointPolicyVersions",
					summary: "Bot Endpoint Policy Versions.",
					description: "GET bot endpoint policy versions.",
					purpose: "Retrieve specific version",
					path: "/api/shape/bot/namespaces/{namespace}/bot_endpoint_policy/{name}/versions",
				},
				{
					action: "list",
					resourceType: "bot_endpoint_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_endpoint_policy.API.List",
					summary: "List Bot Endpoint Policy.",
					description:
						"List the set of bot_endpoint_policy in a namespace.",
					purpose: "List all bot-endpoint-policys",
					path: "/api/shape/bot/namespaces/{namespace}/bot_endpoint_policys",
				},
				{
					action: "get",
					resourceType: "bot_endpoint_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_endpoint_policy.API.Get",
					summary: "GET Bot Endpoint Policy.",
					description: "GET Bot Endpoint Policy.",
					purpose: "Retrieve specific bot-endpoint-policy",
					path: "/api/shape/bot/namespaces/{namespace}/bot_endpoint_policys/{name}",
				},
				{
					action: "get",
					resourceType: "version",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_endpoint_policy.CustomAPI.GetContent",
					summary: "GET Content.",
					description:
						"GET the content of the specific policy version.",
					purpose: "Retrieve specific version",
					path: "/api/shape/bot/namespaces/{namespace}/bot_endpoint_policys/{name}/versions/{number}",
				},
				{
					action: "create",
					resourceType: "bot_infrastructure",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_infrastructure.API.Create",
					summary: "Create Bot Infrastructure.",
					description: "Create Bot Infrastructure.",
					purpose: "Create new bot-infrastructure",
					path: "/api/shape/bot/namespaces/{metadata.namespace}/bot_infrastructures",
				},
				{
					action: "replace",
					resourceType: "bot_infrastructure",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_infrastructure.API.Replace",
					summary: "Replace Bot Infrastructure.",
					description: "Replace Bot Infrastructure.",
					purpose: "Replace existing bot-infrastructure",
					path: "/api/shape/bot/namespaces/{metadata.namespace}/bot_infrastructures/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "bot_infrastructure",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_infrastructure.API.List",
					summary: "List Bot Infrastructure.",
					description:
						"List the set of bot_infrastructure in a namespace.",
					purpose: "List all bot-infrastructures",
					path: "/api/shape/bot/namespaces/{namespace}/bot_infrastructures",
				},
				{
					action: "get",
					resourceType: "bot_infrastructure",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_infrastructure.API.Get",
					summary: "GET Bot Infrastructure.",
					description: "GET Bot Infrastructure.",
					purpose: "Retrieve specific bot-infrastructure",
					path: "/api/shape/bot/namespaces/{namespace}/bot_infrastructures/{name}",
				},
				{
					action: "get",
					resourceType: "deployment_history",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_infrastructure.CustomAPI.DeploymentHistory",
					summary: "Deployment History.",
					description: "GET deployment history.",
					purpose: "Retrieve specific deployment-history",
					path: "/api/shape/bot/namespaces/{namespace}/bot_infrastructures/{name}/deployment_history",
				},
				{
					action: "get",
					resourceType: "deployment_statu",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_infrastructure.CustomAPI.DeploymentStatusOverview",
					summary: "Deployment Status.",
					description: "GET deployment status.",
					purpose: "Retrieve specific deployment-statu",
					path: "/api/shape/bot/namespaces/{namespace}/bot_infrastructures/{name}/deployment_status",
				},
				{
					action: "create",
					resourceType: "policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_infrastructure.CustomAPI.DeployPoliciesToBotInfra",
					summary: "Deploy Policies to Bot Infra.",
					description: "Deploy Policies to Bot Infrastructure.",
					purpose: "Create new policie",
					path: "/api/shape/bot/namespaces/{namespace}/bot_infrastructures/{name}/policies",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_infrastructure.CustomAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"Returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/shape/bot/namespaces/{namespace}/suggest-values",
				},
				{
					action: "list",
					resourceType: "bot_allowlist_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_allowlist_policy.CustomAPI.GetAllowlistPoliciesAndVersionsList",
					summary: "List All Bot Allowlist Policies And Versions.",
					description: "GET all bot allowlist policies and versions.",
					purpose: "List all bot-allowlist-policies",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_allowlist_policies",
				},
				{
					action: "replace",
					resourceType: "bot_allowlist_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_allowlist_policy.CustomAPI.CustomReplace",
					summary: "Custom Replace Bot allowlist Policy.",
					description: "Customreplace CustomAPI.",
					purpose: "Replace existing bot-allowlist-policy",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_allowlist_policys/{name}",
				},
				{
					action: "replace",
					resourceType: "bot_allowlist_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_allowlist_policy.API.Replace",
					summary: "Replace Bot allowlist Policy.",
					description: "Replace Bot allowlist Policy.",
					purpose: "Replace existing bot-allowlist-policy",
					path: "/api/shape/bot/namespaces/{metadata.namespace}/bot_allowlist_policys/{metadata.name}",
				},
				{
					action: "get",
					resourceType: "version",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_allowlist_policy.CustomAPI.GetAllowlistPolicyVersions",
					summary: "Bot Allowlist Policy Versions.",
					description: "GET bot allowlist policy versions.",
					purpose: "Retrieve specific version",
					path: "/api/shape/bot/namespaces/{namespace}/bot_allowlist_policy/{name}/versions",
				},
				{
					action: "list",
					resourceType: "bot_allowlist_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_allowlist_policy.API.List",
					summary: "List Bot allowlist Policy.",
					description:
						"List the set of bot_allowlist_policy in a namespace.",
					purpose: "List all bot-allowlist-policys",
					path: "/api/shape/bot/namespaces/{namespace}/bot_allowlist_policys",
				},
				{
					action: "get",
					resourceType: "bot_allowlist_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_allowlist_policy.API.Get",
					summary: "GET Bot allowlist Policy.",
					description: "GET Bot allowlist Policy.",
					purpose: "Retrieve specific bot-allowlist-policy",
					path: "/api/shape/bot/namespaces/{namespace}/bot_allowlist_policys/{name}",
				},
				{
					action: "get",
					resourceType: "version",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_allowlist_policy.CustomAPI.GetContent",
					summary: "GET Content.",
					description:
						"GET the content of the specific policy version.",
					purpose: "Retrieve specific version",
					path: "/api/shape/bot/namespaces/{namespace}/bot_allowlist_policys/{name}/versions/{number}",
				},
				{
					action: "list",
					resourceType: "bot_network_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_network_policy.CustomAPI.GetNetworkPoliciesAndVersionsList",
					summary: "List All Bot Network Policies And Versions.",
					description: "GET all bot network policies and versions.",
					purpose: "List all bot-network-policies",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_network_policies",
				},
				{
					action: "replace",
					resourceType: "bot_network_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_network_policy.CustomAPI.CustomReplace",
					summary: "Custom Replace Bot network Policy.",
					description: "Customreplace CustomAPI.",
					purpose: "Replace existing bot-network-policy",
					path: "/api/shape/bot/custom/namespaces/{namespace}/bot_network_policys/{name}",
				},
				{
					action: "replace",
					resourceType: "bot_network_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_network_policy.API.Replace",
					summary: "Replace Bot network Policy.",
					description: "Replace Bot network Policy.",
					purpose: "Replace existing bot-network-policy",
					path: "/api/shape/bot/namespaces/{metadata.namespace}/bot_network_policys/{metadata.name}",
				},
				{
					action: "get",
					resourceType: "version",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_network_policy.CustomAPI.GetNetworkPolicyVersions",
					summary: "Bot Network Policy Versions.",
					description: "GET bot network policy versions.",
					purpose: "Retrieve specific version",
					path: "/api/shape/bot/namespaces/{namespace}/bot_network_policy/{name}/versions",
				},
				{
					action: "list",
					resourceType: "bot_network_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_network_policy.API.List",
					summary: "List Bot network Policy.",
					description:
						"List the set of bot_network_policy in a namespace.",
					purpose: "List all bot-network-policys",
					path: "/api/shape/bot/namespaces/{namespace}/bot_network_policys",
				},
				{
					action: "get",
					resourceType: "bot_network_policy",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_network_policy.API.Get",
					summary: "GET Bot network Policy.",
					description: "GET Bot network Policy.",
					purpose: "Retrieve specific bot-network-policy",
					path: "/api/shape/bot/namespaces/{namespace}/bot_network_policys/{name}",
				},
				{
					action: "get",
					resourceType: "version",
					operationId:
						"ves.io.schema.shape.bot_defense.bot_network_policy.CustomAPI.GetContent",
					summary: "GET Content.",
					description:
						"GET the content of the specific policy version.",
					purpose: "Retrieve specific version",
					path: "/api/shape/bot/namespaces/{namespace}/bot_network_policys/{name}/versions/{number}",
				},
				{
					action: "create",
					resourceType: "init",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.Init",
					summary: "Enable Client-Side Defense.",
					description:
						"Enable Client-Side Defense feature for the tenant.",
					purpose: "Create new init",
					path: "/api/shape/csd/namespaces/system/init",
				},
				{
					action: "list",
					resourceType: "detected_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.GetDetectedDomains",
					summary: "GET Detected Domains.",
					description:
						"GET the detected domains data for the tenant.",
					purpose: "List all detected-domains",
					path: "/api/shape/csd/namespaces/{namespace}/detected_domains",
				},
				{
					action: "list",
					resourceType: "domain_detail",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.GetDomainDetails",
					summary: "GET Domain Details.",
					description: "GET the details of the domain provided.",
					purpose: "List all domain-details",
					path: "/api/shape/csd/namespaces/{namespace}/domain_details",
				},
				{
					action: "list",
					resourceType: "formField",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.ListFormFieldsGet",
					summary: "List All Form Fields with GET method.",
					description:
						"List form fields for all the scripts depending on start time and end time with GET method.",
					purpose: "List all formFields",
					path: "/api/shape/csd/namespaces/{namespace}/formFields",
				},
				{
					action: "create",
					resourceType: "formField",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.ListFormFields",
					summary: "List All Form Fields.",
					description:
						"List form fields for all the scripts depending on start time and end time.",
					purpose: "Create new formField",
					path: "/api/shape/csd/namespaces/{namespace}/formFields",
				},
				{
					action: "create",
					resourceType: "analysi",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.UpdateFieldAnalysis",
					summary: "Update FormField Analysis.",
					description: "Mark / unmark field sensitivity by customer.",
					purpose: "Create new analysi",
					path: "/api/shape/csd/namespaces/{namespace}/formFields/analysis",
				},
				{
					action: "list",
					resourceType: "formField",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.GetFormField",
					summary: "GET Form Field.",
					description:
						"GET form field for the name of the form field.",
					purpose: "Retrieve specific formField",
					path: "/api/shape/csd/namespaces/{namespace}/formFields/{id}",
				},
				{
					action: "list",
					resourceType: "js_configuration",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.GetJsInjectionConfiguration",
					summary: "GET JS Injection Configuration.",
					description:
						"GET JS Injection Configuration for this tenant.",
					purpose: "List all js-configurations",
					path: "/api/shape/csd/namespaces/{namespace}/js_configuration",
				},
				{
					action: "delete",
					resourceType: "justification",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.DeleteScriptJustification",
					summary: "DELETE Script Justification.",
					description: "DELETE the specified script justification.",
					purpose: "Delete justification",
					path: "/api/shape/csd/namespaces/{namespace}/script/justification/{justification_id}",
				},
				{
					action: "list",
					resourceType: "script",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.ListScriptsLegacy",
					summary: "List Scripts.",
					description:
						"List all the scripts for the tenant depending on start time and end time.",
					purpose: "List all scripts",
					path: "/api/shape/csd/namespaces/{namespace}/scripts",
				},
				{
					action: "create",
					resourceType: "script",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.ListScripts",
					summary: "List Scripts.",
					description:
						"List all the scripts for the tenant depending on start time and end time.",
					purpose: "Create new script",
					path: "/api/shape/csd/namespaces/{namespace}/scripts",
				},
				{
					action: "list",
					resourceType: "behavior",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.ListBehaviorsByScript",
					summary: "List Behaviors By Script.",
					description:
						"List all the behaviors for a script depending on start time and end time.",
					purpose: "Retrieve specific behavior",
					path: "/api/shape/csd/namespaces/{namespace}/scripts/{id}/behaviors",
				},
				{
					action: "list",
					resourceType: "dashboard",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.GetScriptOverview",
					summary: "GET Script Overview.",
					description:
						"GET script overview data for a script depending on start time and end time.",
					purpose: "Retrieve specific dashboard",
					path: "/api/shape/csd/namespaces/{namespace}/scripts/{id}/dashboard",
				},
				{
					action: "list",
					resourceType: "formField",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.ListFormFieldsByScript",
					summary: "List Form Fields By Script.",
					description:
						"List all the form fields for a script depending on start time and end time.",
					purpose: "Retrieve specific formField",
					path: "/api/shape/csd/namespaces/{namespace}/scripts/{id}/formFields",
				},
				{
					action: "list",
					resourceType: "networkInteraction",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.ListNetworkInteractionsByScript",
					summary: "List Network Interactions By Script.",
					description:
						"List all the network interactions for a script depending on start time and end time.",
					purpose: "Retrieve specific networkInteraction",
					path: "/api/shape/csd/namespaces/{namespace}/scripts/{id}/networkInteractions",
				},
				{
					action: "create",
					resourceType: "readStatu",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.UpdateScriptReadStatus",
					summary: "Update Script FormFields ReadStatus.",
					description:
						"Allow / block script from reading form fields.",
					purpose: "Create new readStatu",
					path: "/api/shape/csd/namespaces/{namespace}/scripts/{id}/readStatus",
				},
				{
					action: "create",
					resourceType: "affectedUser",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.ListAffectedUsers",
					summary: "List Affected Users.",
					description:
						"List affected users who have loaded this particular script.",
					purpose: "Create new affectedUser",
					path: "/api/shape/csd/namespaces/{namespace}/scripts/{script_id}/affectedUsers",
				},
				{
					action: "create",
					resourceType: "justification",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.UpdateScriptJustification",
					summary: "Update Script Justification.",
					description: "Update justification for script found.",
					purpose: "Create new justification",
					path: "/api/shape/csd/namespaces/{namespace}/scripts/{script_id}/justification",
				},
				{
					action: "list",
					resourceType: "statu",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.GetStatus",
					summary: "GET Status.",
					description:
						"GET Client-Side Defense status for the tenant.",
					purpose: "List all status",
					path: "/api/shape/csd/namespaces/{namespace}/status",
				},
				{
					action: "list",
					resourceType: "summary",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.GetSummary",
					summary: "GET Summary.",
					description: "GET summay details for a given customer.",
					purpose: "List all summarys",
					path: "/api/shape/csd/namespaces/{namespace}/summary",
				},
				{
					action: "create",
					resourceType: "testj",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.TestJS",
					summary: "Test JS",
					description:
						"Validate JS script tag injection in the target URL.",
					purpose: "Create new testj",
					path: "/api/shape/csd/namespaces/{namespace}/testjs",
				},
				{
					action: "create",
					resourceType: "update_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.CustomAPI.UpdateDomains",
					summary: "Update Domains.",
					description:
						"Update domain from mitigated domains to allowed domains and vice versa.",
					purpose: "Create new update-domain",
					path: "/api/shape/csd/namespaces/{namespace}/update_domains",
				},
				{
					action: "create",
					resourceType: "allowed_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.allowed_domain.API.Create",
					summary: "Create Allowed Domain.",
					description: "Create allowed domain.",
					purpose: "Create new allowed-domain",
					path: "/api/shape/csd/namespaces/{metadata.namespace}/allowed_domains",
				},
				{
					action: "list",
					resourceType: "allowed_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.allowed_domain.API.List",
					summary: "List Client-Side Defense Allowed Domain.",
					description:
						"List the set of allowed_domain in a namespace.",
					purpose: "List all allowed-domains",
					path: "/api/shape/csd/namespaces/{namespace}/allowed_domains",
				},
				{
					action: "get",
					resourceType: "allowed_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.allowed_domain.API.Get",
					summary: "GET Allowed Domain.",
					description: "GET allowed domain.",
					purpose: "Retrieve specific allowed-domain",
					path: "/api/shape/csd/namespaces/{namespace}/allowed_domains/{name}",
				},
				{
					action: "delete",
					resourceType: "allowed_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.allowed_domain.API.Delete",
					summary: "DELETE Client-Side Defense Allowed Domain.",
					description: "DELETE the specified allowed_domain.",
					purpose: "Delete allowed-domain",
					path: "/api/shape/csd/namespaces/{namespace}/allowed_domains/{name}",
				},
				{
					action: "create",
					resourceType: "protected_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.protected_domain.API.Create",
					summary: "Create Domain to protect.",
					description: "Create Domain to protect.",
					purpose: "Create new protected-domain",
					path: "/api/shape/csd/namespaces/{metadata.namespace}/protected_domains",
				},
				{
					action: "list",
					resourceType: "protected_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.protected_domain.API.List",
					summary: "List Client-Side Defense Domain to Protect.",
					description:
						"List the set of protected_domain in a namespace.",
					purpose: "List all protected-domains",
					path: "/api/shape/csd/namespaces/{namespace}/protected_domains",
				},
				{
					action: "get",
					resourceType: "protected_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.protected_domain.API.Get",
					summary: "GET Protected Domain.",
					description: "GET Domain to protect.",
					purpose: "Retrieve specific protected-domain",
					path: "/api/shape/csd/namespaces/{namespace}/protected_domains/{name}",
				},
				{
					action: "delete",
					resourceType: "protected_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.protected_domain.API.Delete",
					summary: "DELETE Client-Side Defense Domain to Protect.",
					description: "DELETE the specified protected_domain.",
					purpose: "Delete protected-domain",
					path: "/api/shape/csd/namespaces/{namespace}/protected_domains/{name}",
				},
				{
					action: "create",
					resourceType: "mitigated_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.mitigated_domain.API.Create",
					summary: "Create Mitigated Domain.",
					description: "Create Mitigated Domain.",
					purpose: "Create new mitigated-domain",
					path: "/api/shape/csd/namespaces/{metadata.namespace}/mitigated_domains",
				},
				{
					action: "list",
					resourceType: "mitigated_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.mitigated_domain.API.List",
					summary: "List Client-Side Defense Mitigated Domain.",
					description:
						"List the set of mitigated_domain in a namespace.",
					purpose: "List all mitigated-domains",
					path: "/api/shape/csd/namespaces/{namespace}/mitigated_domains",
				},
				{
					action: "get",
					resourceType: "mitigated_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.mitigated_domain.API.Get",
					summary: "GET Mitigated Domain.",
					description: "GET Mitigated Domain.",
					purpose: "Retrieve specific mitigated-domain",
					path: "/api/shape/csd/namespaces/{namespace}/mitigated_domains/{name}",
				},
				{
					action: "delete",
					resourceType: "mitigated_domain",
					operationId:
						"ves.io.schema.shape.client_side_defense.mitigated_domain.API.Delete",
					summary: "DELETE Client-Side Defense Mitigated Domain.",
					description: "DELETE the specified mitigated_domain.",
					purpose: "Delete mitigated-domain",
					path: "/api/shape/csd/namespaces/{namespace}/mitigated_domains/{name}",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.shape.client_side_defense.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to Client-Side Defense.",
					description: "Subscribe to Client-Side Defense.",
					purpose: "Create new subscribe",
					path: "/api/shape/csd/namespaces/system/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.shape.client_side_defense.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Client-Side Defense.",
					description: "Unsubscribe to Client-Side Defense.",
					purpose: "Create new unsubscribe",
					path: "/api/shape/csd/namespaces/system/unsubscribe",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.shape.mobile_app_shield.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to Mobile App Shield.",
					description: "Subscribe to Mobile App Shield.",
					purpose: "Create new subscribe",
					path: "/api/mobile/app-shield/namespaces/system/mobile-app-shield/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.shape.mobile_app_shield.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Mobile App Shield.",
					description: "Unsubscribe to Mobile App Shield.",
					purpose: "Create new unsubscribe",
					path: "/api/mobile/app-shield/namespaces/system/mobile-app-shield/addon/unsubscribe",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.shape.mobile_integrator.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to Mobile Integrator.",
					description: "Subscribe to Mobile Integrator.",
					purpose: "Create new subscribe",
					path: "/api/mobile/integrator/namespaces/system/mobile-integrator/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.shape.mobile_integrator.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Mobile Integrator.",
					description: "Unsubscribe to Mobile Integrator.",
					purpose: "Create new unsubscribe",
					path: "/api/mobile/integrator/namespaces/system/mobile-integrator/addon/unsubscribe",
				},
				{
					action: "list",
					resourceType: "mobile-sdk",
					operationId:
						"ves.io.schema.shape.bot_defense.mobile_sdk.CustomAPI.ListMobileSDKs",
					summary: "GET List Of Mobile SDKs.",
					description:
						"ListMobileSDKs is an API to list all mobile SDKs available for download.",
					purpose: "List all mobile-sdks",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/mobile-sdk",
				},
				{
					action: "get",
					resourceType: "mobile-sdk",
					operationId:
						"ves.io.schema.shape.bot_defense.mobile_sdk.CustomAPI.GetMobileSDK",
					summary: "GET Mobile SDK.",
					description:
						"GetMobileSDK is an API to download particular version of SDK.",
					purpose: "Retrieve specific mobile-sdk",
					path: "/api/object_store/namespaces/{namespace}/stored_objects/mobile-sdk/{name}/{version}",
				},
				{
					action: "create",
					resourceType: "mobile_base_config",
					operationId:
						"ves.io.schema.shape.bot_defense.mobile_base_config.API.Create",
					summary: "Create Mobile SDK Base Configuration.",
					description: "Create Mobile SDK Base Configuration.",
					purpose: "Create new mobile-base-config",
					path: "/api/mobile/security/namespaces/{metadata.namespace}/mobile_base_configs",
				},
				{
					action: "replace",
					resourceType: "mobile_base_config",
					operationId:
						"ves.io.schema.shape.bot_defense.mobile_base_config.API.Replace",
					summary: "Replace Mobile SDK Base Configuration.",
					description: "Replace Mobile SDK Base Configuration.",
					purpose: "Replace existing mobile-base-config",
					path: "/api/mobile/security/namespaces/{metadata.namespace}/mobile_base_configs/{metadata.name}",
				},
				{
					action: "get",
					resourceType: "mobile_base_config_file",
					operationId:
						"ves.io.schema.shape.bot_defense.mobile_base_config.CustomAPI.GetMobileBaseConfigurationFile",
					summary: "GET Mobile Base Configuration File.",
					description: "GET Mobile Base Configuration File.",
					purpose: "Retrieve specific mobile-base-config-file",
					path: "/api/mobile/security/namespaces/{namespace}/mobile_base_config_file/{name}",
				},
				{
					action: "list",
					resourceType: "mobile_base_config",
					operationId:
						"ves.io.schema.shape.bot_defense.mobile_base_config.API.List",
					summary: "List Mobile SDK Base Configuration.",
					description:
						"List the set of mobile_base_config in a namespace.",
					purpose: "List all mobile-base-configs",
					path: "/api/mobile/security/namespaces/{namespace}/mobile_base_configs",
				},
				{
					action: "get",
					resourceType: "mobile_base_config",
					operationId:
						"ves.io.schema.shape.bot_defense.mobile_base_config.API.Get",
					summary: "GET Mobile SDK Base Configuration.",
					description: "GET Mobile SDK Base Configuration.",
					purpose: "Retrieve specific mobile-base-config",
					path: "/api/mobile/security/namespaces/{namespace}/mobile_base_configs/{name}",
				},
				{
					action: "delete",
					resourceType: "mobile_base_config",
					operationId:
						"ves.io.schema.shape.bot_defense.mobile_base_config.API.Delete",
					summary: "DELETE Mobile SDK Base Configuration.",
					description: "DELETE the specified mobile_base_config.",
					purpose: "Delete mobile-base-config",
					path: "/api/mobile/security/namespaces/{namespace}/mobile_base_configs/{name}",
				},
				{
					action: "list",
					resourceType: "apikey",
					operationId:
						"ves.io.schema.shape.bot_defense.protected_application.CustomAPI.ApiKey",
					summary: "API Key",
					description: "GET API key.",
					purpose: "List all apikeys",
					path: "/api/shape/bot/namespaces/system/apikey",
				},
				{
					action: "list",
					resourceType: "region",
					operationId:
						"ves.io.schema.shape.bot_defense.protected_application.CustomAPI.RegionsList",
					summary: "Regions",
					description: "GET protected apps regions list.",
					purpose: "List all regions",
					path: "/api/shape/bot/namespaces/system/regions",
				},
				{
					action: "create",
					resourceType: "protected_application",
					operationId:
						"ves.io.schema.shape.bot_defense.protected_application.API.Create",
					summary: "Create Protected Application.",
					description:
						"Create applications protected by Bot Defense.",
					purpose: "Create new protected-application",
					path: "/api/shape/bot/namespaces/{metadata.namespace}/protected_applications",
				},
				{
					action: "replace",
					resourceType: "protected_application",
					operationId:
						"ves.io.schema.shape.bot_defense.protected_application.API.Replace",
					summary: "Replace Protected Application.",
					description:
						"Replace applications protected by Bot Defense.",
					purpose: "Replace existing protected-application",
					path: "/api/shape/bot/namespaces/{metadata.namespace}/protected_applications/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "protected_application",
					operationId:
						"ves.io.schema.shape.bot_defense.protected_application.API.List",
					summary: "List Protected Application.",
					description:
						"List the set of protected_application in a namespace.",
					purpose: "List all protected-applications",
					path: "/api/shape/bot/namespaces/{namespace}/protected_applications",
				},
				{
					action: "get",
					resourceType: "protected_application",
					operationId:
						"ves.io.schema.shape.bot_defense.protected_application.API.Get",
					summary: "GET Protected Application.",
					description: "GET applications protected by Bot Defense.",
					purpose: "Retrieve specific protected-application",
					path: "/api/shape/bot/namespaces/{namespace}/protected_applications/{name}",
				},
				{
					action: "delete",
					resourceType: "protected_application",
					operationId:
						"ves.io.schema.shape.bot_defense.protected_application.API.Delete",
					summary: "DELETE Protected Application.",
					description: "DELETE the specified protected_application.",
					purpose: "Delete protected-application",
					path: "/api/shape/bot/namespaces/{namespace}/protected_applications/{name}",
				},
				{
					action: "get",
					resourceType: "config",
					operationId:
						"ves.io.schema.shape.bot_defense.protected_application.CustomAPI.ConnectorConfig",
					summary: "Connector Configuration.",
					description: "GET Connector config.",
					purpose: "Retrieve specific config",
					path: "/api/shape/bot/namespaces/{namespace}/protected_applications/{name}/config",
				},
				{
					action: "get",
					resourceType: "template",
					operationId:
						"ves.io.schema.shape.bot_defense.protected_application.CustomAPI.TemplateConnector",
					summary: "Template Connector.",
					description: "GET iApp template.",
					purpose: "Retrieve specific template",
					path: "/api/shape/bot/namespaces/{namespace}/protected_applications/{name}/template",
				},
				{
					action: "create",
					resourceType: "check",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.PeerStatusCheck",
					summary: "Check Peer Status.",
					description: "Check if the tenant has the peer or not.",
					purpose: "Create new check",
					path: "/api/shape/bot/namespaces/system/reporting/peers/check",
				},
				{
					action: "list",
					resourceType: "atb",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.ATBStatus",
					summary: "ATB Status.",
					description: "ATB Status.",
					purpose: "List all atbs",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/atb",
				},
				{
					action: "create",
					resourceType: "atb",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.ATB",
					summary: "ATB",
					description: "Enable/disable ATB.",
					purpose: "Create new atb",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/atb",
				},
				{
					action: "list",
					resourceType: "summary",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.ConsumptionSummary",
					summary: "Consumption Summary.",
					description: "GET Consumption summary.",
					purpose: "List all summarys",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/consumption/summary",
				},
				{
					action: "create",
					resourceType: "category",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.EndpointCategories",
					summary: "Endpoint Categories.",
					description: "GET Endpoint Category Breakdown.",
					purpose: "Create new categorie",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/endpoint/categories",
				},
				{
					action: "create",
					resourceType: "category",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.EndpointCategoriesLabel",
					summary: "Endpoint Categories Label.",
					description: "GET Endpoint Category Breakdown.",
					purpose: "Create new categorie",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/endpoint/categories/{category}",
				},
				{
					action: "create",
					resourceType: "list",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.EndpointList",
					summary: "All Protected Endpoints.",
					description: "GET All Protected Endpoints.",
					purpose: "Create new list",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/endpoint/list",
				},
				{
					action: "create",
					resourceType: "summary",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.EndpointSummary",
					summary: "Endpoint Summary.",
					description: "GET Endpoint Summary.",
					purpose: "Create new summary",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/endpoint/summary",
				},
				{
					action: "create",
					resourceType: "endpoint",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.ReportEndpoints",
					summary: "Report Endpoints.",
					description: "Report Endpoints.",
					purpose: "Create new endpoint",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/endpoints",
				},
				{
					action: "create",
					resourceType: "credential-stuffing-attack",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.CredentialStuffingAttack",
					summary: "Insight Event: Credential Stuffing Attack.",
					description: "GET Insight Credential Stuffing Attack.",
					purpose: "Create new credential-stuffing-attack",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/insight/credential-stuffing-attack",
				},
				{
					action: "create",
					resourceType: "bad-bot-reduction",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.InsightBadBotReduction",
					summary: "Insight Bad Bot Reduction.",
					description: "Insight Bad Bot Reduction.",
					purpose: "Create new bad-bot-reduction",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/insight/event/bad-bot-reduction",
				},
				{
					action: "create",
					resourceType: "unaddressed-automation",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.InsightUnaddressedAutomations",
					summary: "Insight Unaddressed Automations.",
					description: "Insight Unaddressed Automations.",
					purpose: "Create new unaddressed-automation",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/insight/event/unaddressed-automations",
				},
				{
					action: "create",
					resourceType: "personal-stat",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.InsightPersonalStats",
					summary: "Insight Personal Stats.",
					description: "Insight Personal Stats.",
					purpose: "Create new personal-stat",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/insight/personal-stats",
				},
				{
					action: "create",
					resourceType: "total-automation",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TotalAutomation",
					summary: "Insight Event: Total Automation.",
					description: "GET Insight Totol Automation data.",
					purpose: "Create new total-automation",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/insight/total-automation",
				},
				{
					action: "create",
					resourceType: "endpoint",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportEndpoints",
					summary: "Malicious Report Endpoints.",
					description: "Malicious Report Endpoints.",
					purpose: "Create new endpoint",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/malicious/endpoints",
				},
				{
					action: "create",
					resourceType: "asn",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsASN",
					summary: "Malicious Report Transactions ASN.",
					description: "Malicious Report Transactions ASN.",
					purpose: "Create new asn",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/malicious/transactions/asn",
				},
				{
					action: "create",
					resourceType: "browser",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsBrowser",
					summary: "Malicious Report Transactions Browser.",
					description: "Malicious Report Transactions Browser.",
					purpose: "Create new browser",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/malicious/transactions/browser",
				},
				{
					action: "create",
					resourceType: "ip",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsIP",
					summary: "Malicious Report Transactions IP.",
					description: "Malicious Report Transactions IP.",
					purpose: "Create new ip",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/malicious/transactions/ip",
				},
				{
					action: "create",
					resourceType: "o",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsOS",
					summary: "Malicious Report Transactions OS.",
					description: "Malicious Report Transactions OS.",
					purpose: "Create new o",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/malicious/transactions/os",
				},
				{
					action: "create",
					resourceType: "ua",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsUA",
					summary: "Malicious Report Transactions UA.",
					description: "Malicious Report Transactions UA.",
					purpose: "Create new ua",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/malicious/transactions/ua",
				},
				{
					action: "create",
					resourceType: "endpoint",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopAttackedEndpoints",
					summary: "Top Attacked Endpoints.",
					description: "GET top attacked application endpoints.",
					purpose: "Create new endpoint",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/endpoints",
				},
				{
					action: "create",
					resourceType: "overview",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopLatencyOverview",
					summary: "Top Latency Overview.",
					description: "GET top latency overview.",
					purpose: "Create new overview",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/latency/overview",
				},
				{
					action: "create",
					resourceType: "app",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopLatencyOverviewApps",
					summary: "Top Latency Overview Apps.",
					description: "GET top latency overview apps.",
					purpose: "Create new app",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/latency/overview/apps",
				},
				{
					action: "create",
					resourceType: "asorg",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByASOrg",
					summary: "Top Malicious Bots by ASOrg.",
					description: "GET top malicious bots by AS Organization.",
					purpose: "Create new asorg",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/malicious/asorg",
				},
				{
					action: "create",
					resourceType: "automation",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopAutomationTypes",
					summary: "Top Malicious Bot Automation Types.",
					description: "GET top malicious bots automation types.",
					purpose: "Create new automation",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/malicious/automation",
				},
				{
					action: "create",
					resourceType: "ip",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByIP",
					summary: "Top Malicious Bots by IP address.",
					description: "GET Top Malicious Bots by source IP address.",
					purpose: "Create new ip",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/malicious/ip",
				},
				{
					action: "create",
					resourceType: "ua",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByUA",
					summary: "Top Malicious Bots by User Agent String.",
					description: "GET top malicious bots by user agent string.",
					purpose: "Create new ua",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/malicious/ua",
				},
				{
					action: "create",
					resourceType: "app",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopTransactionsByApp",
					summary: "Top Transactions by Application.",
					description: "GET Top Transactions by Application.",
					purpose: "Create new app",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/transactions/app",
				},
				{
					action: "create",
					resourceType: "category",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopCategories",
					summary: "Top Categories.",
					description: "GET top flow label categories.",
					purpose: "Create new categorie",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/transactions/categories",
				},
				{
					action: "create",
					resourceType: "endpointlabel",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopEndpointLabels",
					summary: "Top Endpoint Labels.",
					description: "GET top Endpoint labels.",
					purpose: "Create new endpointlabel",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/transactions/endpointlabels",
				},
				{
					action: "create",
					resourceType: "good",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopGoodBots",
					summary: "Top Good Bots.",
					description: "GET top good bots.",
					purpose: "Create new good",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/good",
				},
				{
					action: "create",
					resourceType: "browser",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopHumanBrowser",
					summary: "Top Human Browser.",
					description: "GET top human browser.",
					purpose: "Create new browser",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/human/dimension/browser",
				},
				{
					action: "create",
					resourceType: "device",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopHumanDevice",
					summary: "Top Human Device.",
					description: "GET top human device.",
					purpose: "Create new device",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/human/dimension/device",
				},
				{
					action: "create",
					resourceType: "geolocation",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopHumanGeolocation",
					summary: "Top Human Geolocation.",
					description: "GET top human geolocation.",
					purpose: "Create new geolocation",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/human/dimension/geolocation",
				},
				{
					action: "create",
					resourceType: "platform",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopHumanPlatform",
					summary: "Top Human Platform.",
					description: "GET top human platform.",
					purpose: "Create new platform",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/human/dimension/platform",
				},
				{
					action: "create",
					resourceType: "app",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByApp",
					summary: "Top Malicious Bots by Application.",
					description: "GET Top Malicious Bots by Application.",
					purpose: "Create new app",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/app",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportAPPTimeSeries",
					summary: "Malicious Report APP Time Series.",
					description: "Malicious Report APP Time Series.",
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/apps/timeseries",
				},
				{
					action: "create",
					resourceType: "asorg",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByASOrgV2",
					summary: "Top Malicious Bots by ASOrg v2.",
					description:
						"GET top malicious bots by AS Organization v2.",
					purpose: "Create new asorg",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/asorg",
				},
				{
					action: "create",
					resourceType: "asorg",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsAttackIntentByASOrg",
					summary: "Top ASN of Attack Intent.",
					description:
						"GET Top Malicious Bot Event by ASN of Attack Intent Type.",
					purpose: "Create new asorg",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/asorg/{attack_type}",
				},
				{
					action: "create",
					resourceType: "attackintent",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotByAttackIntent",
					summary: "Top Malicious Bots by Attack Intent.",
					description: "Top Malicious Bots by Attack Intent.",
					purpose: "Create new attackintent",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/attackintent",
				},
				{
					action: "create",
					resourceType: "automation",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopAutomationTypesV2",
					summary: "Top Malicious Bot Automation Types v2.",
					description: "GET top malicious bots automation types v2.",
					purpose: "Create new automation",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/automation",
				},
				{
					action: "create",
					resourceType: "bfp",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopAttackedBFP",
					summary: "Top Attacked BFP.",
					description: "Top Attacked BFP.",
					purpose: "Create new bfp",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/bfp",
				},
				{
					action: "create",
					resourceType: "endpoint",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopAttackedEndpointsV2",
					summary: "Top Attacked Endpoints v2.",
					description: "GET top attacked application endpoints v2.",
					purpose: "Create new endpoint",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/endpoints",
				},
				{
					action: "create",
					resourceType: "ip",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByIPV2",
					summary: "Top Malicious Bots by IP address v2.",
					description:
						"GET Top Malicious Bots by source IP address v2.",
					purpose: "Create new ip",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/ip",
				},
				{
					action: "create",
					resourceType: "ip",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsAttackIntentByIP",
					summary: "Top Souce IP of Attack Intent.",
					description:
						"GET Top Malicious Bot Event by Source IP of Attack Intent Type.",
					purpose: "Create new ip",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/ip/{attack_type}",
				},
				{
					action: "create",
					resourceType: "ua",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByUAV2",
					summary: "Top Malicious Bots by User Agent String v2.",
					description:
						"GET top malicious bots by user agent string v2.",
					purpose: "Create new ua",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/ua",
				},
				{
					action: "create",
					resourceType: "ua",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsAttackIntentByUA",
					summary: "Top User Agent of Attack Intent.",
					description:
						"GET Top Malicious Bot Event by UA of Attack Intent Type.",
					purpose: "Create new ua",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/top/type/malicious/dimension/ua/{attack_type}",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.AttackIntentTimeSeries",
					summary: "Attack Intent Time Series For All Traffic.",
					description: "Attack Intent Time Series For All Traffic.",
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/traffic/dimension/attackintent/timeseries",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.CategoriesTimeSeries",
					summary: "Categories Time Series For All Traffic.",
					description:
						"Categories Time Series For All Traffic GET TimeSeries data list for all traffic breaking down by endpoint category.",
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/traffic/dimension/categories/timeseries",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousAttackIntentTimeSeries",
					summary: "Malicious Bot Attack Intent Time Series.",
					description: "Malicious Bot Attack Intent Time Series.",
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/traffic/malicious/dimension/attackintent/timeseries",
				},
				{
					action: "create",
					resourceType: "action",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousTrafficOverviewActions",
					summary: "Malicious Traffic Overview in actions.",
					description: "GET Malicious Traffic Overview in Actions.",
					purpose: "Create new action",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/traffic/malicious/overview/actions",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousTrafficOverviewMetrics",
					summary: "Malicious Traffic Overview Metrics.",
					description: "Malicious Traffic Overview Metrics.",
					purpose: "Create new metric",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/traffic/malicious/overview/metrics",
				},
				{
					action: "create",
					resourceType: "action",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousTrafficTimeseriesActions",
					summary:
						"Malicious Traffic Overview Timeseries in Actions.",
					description:
						"GET Malicious Traffic Overview Timeseries in Actions.",
					purpose: "Create new action",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/traffic/malicious/overview/timeseries/actions",
				},
				{
					action: "create",
					resourceType: "overview",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverview",
					summary: "Traffic Overview.",
					description: "GET traffic overview.",
					purpose: "Create new overview",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/traffic/overview",
				},
				{
					action: "create",
					resourceType: "expanded",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewExpanded",
					summary: "Expanded Traffic Overview.",
					description: "GET expanded traffic overview.",
					purpose: "Create new expanded",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/traffic/overview/expanded",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewTimeseries",
					summary: "Traffic Overview Timeseries.",
					description: "GET Traffic Overview Timeseries.",
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/traffic/overview/timeseries",
				},
				{
					action: "list",
					resourceType: "summary",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TransactionUsageSummary",
					summary: "Usage Summary.",
					description: "GET transactions usage summary.",
					purpose: "List all summarys",
					path: "/api/shape/bot/namespaces/{namespace}/reporting/usage/summary",
				},
				{
					action: "create",
					resourceType: "field",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.ForensicFields",
					summary: "Forensic Fields.",
					description: "GET",
					purpose: "Create new field",
					path: "/api/shape/bot/namespaces/{namespace}/v1/reporting/forensic/fields",
				},
				{
					action: "create",
					resourceType: "action",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.AutomatedTrafficActions",
					summary: "Automated Traffic Overview in actions.",
					description: "GET All Automated Traffic Actions.",
					purpose: "Create new action",
					path: "/api/shape/bot/namespaces/{namespace}/v1/reporting/traffic/automated/overview/actions",
				},
				{
					action: "create",
					resourceType: "summary",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.EndpointSummaryV2",
					summary: "Endpoint Summary V2.",
					description:
						"GET Endpoint Summary V2 with Unevaluated Transactions.",
					purpose: "Create new summary",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/endpoint/summary",
				},
				{
					action: "create",
					resourceType: "endpoint",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportEndpointsV2",
					summary: "Malicious Report Endpoints V2.",
					description:
						"Malicious Report Endpoints V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new endpoint",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/malicious/endpoints",
				},
				{
					action: "create",
					resourceType: "asn",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsASNV2",
					summary: "Malicious Report Transactions ASN V2.",
					description:
						"Malicious Report Transactions ASN V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new asn",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/malicious/transactions/asn",
				},
				{
					action: "create",
					resourceType: "browser",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsBrowserV2",
					summary: "Malicious Report Transactions Browser V2.",
					description:
						"Malicious Report Transactions Browser V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new browser",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/malicious/transactions/browser",
				},
				{
					action: "create",
					resourceType: "ip",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsIPV2",
					summary: "Malicious Report Transactions IP V2.",
					description:
						"Malicious Report Transactions IP V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new ip",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/malicious/transactions/ip",
				},
				{
					action: "create",
					resourceType: "o",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsOSV2",
					summary: "Malicious Report Transactions OS V2.",
					description:
						"Malicious Report Transactions OS V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new o",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/malicious/transactions/os",
				},
				{
					action: "create",
					resourceType: "ua",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportTransactionsUAV2",
					summary: "Malicious Report Transactions UA V2.",
					description:
						"Malicious Report Transactions UA V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new ua",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/malicious/transactions/ua",
				},
				{
					action: "create",
					resourceType: "good",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopGoodBotsV2",
					summary: "Top Good Bots V2.",
					description: "GET top good bots V2.",
					purpose: "Create new good",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/good",
				},
				{
					action: "create",
					resourceType: "browser",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopHumanBrowserV2",
					summary: "Top Human Browser V2.",
					description:
						"GET top human browser v2 with sub-categories.",
					purpose: "Create new browser",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/human/dimension/browser",
				},
				{
					action: "create",
					resourceType: "device",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopHumanDeviceV2",
					summary: "Top Human Device V2.",
					description: "GET top human device v2 with sub-categories.",
					purpose: "Create new device",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/human/dimension/device",
				},
				{
					action: "create",
					resourceType: "geolocation",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopHumanGeolocationV2",
					summary: "Top Human Geolocation V2.",
					description:
						"GET top human geolocation v2 with sub-categories.",
					purpose: "Create new geolocation",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/human/dimension/geolocation",
				},
				{
					action: "create",
					resourceType: "platform",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopHumanPlatformV2",
					summary: "Top Human Platform V2.",
					description:
						"GET top human platform v2 with sub-categories.",
					purpose: "Create new platform",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/human/dimension/platform",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousReportAPPTimeSeriesV2",
					summary: "Malicious Report APP Time Series V2.",
					description:
						"Malicious Report APP Time Series V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/malicious/dimension/apps/timeseries",
				},
				{
					action: "create",
					resourceType: "asorg",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsAttackIntentByASOrgV2",
					summary: "Top ASN of Attack Intent V2.",
					description:
						"GET Top Malicious Bot Event by ASN of Attack Intent Type V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new asorg",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/malicious/dimension/asorg/{attack_type}",
				},
				{
					action: "create",
					resourceType: "attackintent",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotByAttackIntentV2",
					summary: "Top Malicious Bots by Attack Intent V2.",
					description:
						"Top Malicious Bots by Attack Intent V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new attackintent",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/malicious/dimension/attackintent",
				},
				{
					action: "create",
					resourceType: "endpoint",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopAttackedEndpointsV3",
					summary: "Top Attacked Endpoints v3.",
					description: "GET top attacked application endpoints v3.",
					purpose: "Create new endpoint",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/malicious/dimension/endpoints",
				},
				{
					action: "create",
					resourceType: "ip",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsAttackIntentByIPV2",
					summary: "Top Souce IP of Attack Intent V2.",
					description:
						"GET Top Malicious Bot Event by Source IP of Attack Intent Type V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new ip",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/malicious/dimension/ip/{attack_type}",
				},
				{
					action: "create",
					resourceType: "ua",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsAttackIntentByUAV2",
					summary: "Top User Agent of Attack Intent V2.",
					description:
						"GET Top Malicious Bot Event by UA of Attack Intent Type V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new ua",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/top/type/malicious/dimension/ua/{attack_type}",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousAttackIntentTimeSeriesV2",
					summary: "Malicious Bot Attack Intent Time Series V2.",
					description:
						"Malicious Bot Attack Intent Time Series V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/traffic/malicious/dimension/attackintent/timeseries",
				},
				{
					action: "create",
					resourceType: "action",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousTrafficOverviewActionsV2",
					summary: "Malicious Traffic Overview in actions V2.",
					description: "GET Malicious Traffic Overview in Actions.",
					purpose: "Create new action",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/traffic/malicious/overview/actions",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousTrafficOverviewMetricsV2",
					summary: "Malicious Traffic Overview Metrics V2.",
					description:
						"Malicious Traffic Overview Metrics V2, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new metric",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/traffic/malicious/overview/metrics",
				},
				{
					action: "create",
					resourceType: "action",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.MaliciousTrafficTimeseriesActionsV2",
					summary:
						"Malicious Traffic Overview Timeseries in Actions V2.",
					description:
						"GET Malicious Traffic Overview Timeseries in Actions GET the malicious traffic action details like Blocked, Challenged, Flagged, Redirected, Transformed, Undefined, etc. Over a chosen period. It can cater to the need to support dynamic malicious traffic action types, unlike supporting fixed action types in v1.",
					purpose: "Create new action",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/traffic/malicious/overview/timeseries/actions",
				},
				{
					action: "create",
					resourceType: "overview",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewV2",
					summary: "Traffic Overview V2.",
					description: "GET traffic overview v2.",
					purpose: "Create new overview",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/traffic/overview",
				},
				{
					action: "create",
					resourceType: "expanded",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewExpandedV2",
					summary: "Expanded Traffic Overview V2.",
					description: "GET expanded traffic overview v2.",
					purpose: "Create new expanded",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/traffic/overview/expanded",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewTimeseriesV2",
					summary: "Traffic Overview Timeseries V2.",
					description: "GET Traffic Overview Timeseries V2.",
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/v2/reporting/traffic/overview/timeseries",
				},
				{
					action: "create",
					resourceType: "good",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopGoodBotsV3",
					summary: "Top Good Bots V3.",
					description:
						"GET top good bots V3, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new good",
					path: "/api/shape/bot/namespaces/{namespace}/v3/reporting/top/type/good",
				},
				{
					action: "create",
					resourceType: "asorg",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByASOrgV3",
					summary: "Top Malicious Bots by ASOrg v3.",
					description:
						"GET top malicious bots by AS Organization v3, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new asorg",
					path: "/api/shape/bot/namespaces/{namespace}/v3/reporting/top/type/malicious/dimension/asorg",
				},
				{
					action: "create",
					resourceType: "automation",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopAutomationTypesV3",
					summary: "Top Malicious Bot Automation Types v3.",
					description:
						"GET top malicious bots automation types v3, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new automation",
					path: "/api/shape/bot/namespaces/{namespace}/v3/reporting/top/type/malicious/dimension/automation",
				},
				{
					action: "create",
					resourceType: "ip",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByIPV3",
					summary: "Top Malicious Bots by IP address v3.",
					description:
						"GET Top Malicious Bots by source IP address v3, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new ip",
					path: "/api/shape/bot/namespaces/{namespace}/v3/reporting/top/type/malicious/dimension/ip",
				},
				{
					action: "create",
					resourceType: "ua",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByUAV3",
					summary: "Top Malicious Bots by User Agent String v3.",
					description:
						"GET top malicious bots by user agent string v3.",
					purpose: "Create new ua",
					path: "/api/shape/bot/namespaces/{namespace}/v3/reporting/top/type/malicious/dimension/ua",
				},
				{
					action: "create",
					resourceType: "overview",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewV3",
					summary: "Traffic Overview V3.",
					description:
						"GET traffic overview v3, v3response uses a dynamic structure and has traffic types of human, good bot, bad bot, trusted, untrusted and interstitual, also removed the percentage.",
					purpose: "Create new overview",
					path: "/api/shape/bot/namespaces/{namespace}/v3/reporting/traffic/overview",
				},
				{
					action: "create",
					resourceType: "expanded",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewExpandedV3",
					summary: "Expanded Traffic Overview V3.",
					description: "GET expanded traffic overview v3.",
					purpose: "Create new expanded",
					path: "/api/shape/bot/namespaces/{namespace}/v3/reporting/traffic/overview/expanded",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewTimeseriesV3",
					summary: "Traffic Overview Timeseries V3.",
					description:
						'GET the traffic count details based on types like "Humans, Automated, Allow listed, etc. Over a chosen period. It can cater to the need to support dynamic traffic types, unlike supporting fixed types in v1 or v2.',
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/v3/reporting/traffic/overview/timeseries",
				},
				{
					action: "create",
					resourceType: "endpoint",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopAttackedEndpointsV4",
					summary: "Top Attacked Endpoints v4.",
					description: "GET top attacked application endpoints v4.",
					purpose: "Create new endpoint",
					path: "/api/shape/bot/namespaces/{namespace}/v4/reporting/top/type/malicious/dimension/endpoints",
				},
				{
					action: "create",
					resourceType: "ua",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopMaliciousBotsByUAV4",
					summary: "Top Malicious Bots by User Agent String v4.",
					description:
						"GET top malicious bots by user agent string v4, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new ua",
					path: "/api/shape/bot/namespaces/{namespace}/v4/reporting/top/type/malicious/dimension/ua",
				},
				{
					action: "create",
					resourceType: "expanded",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewExpandedV4",
					summary: "Expanded Traffic Overview in Traffic Analyzer.",
					description:
						"GET expanded Traffic overview in Traffic Analyzer. This version adds support for traffic types, and its subtypes, action taken. In addition, it will show additional traffic types for advanced customers.",
					purpose: "Create new expanded",
					path: "/api/shape/bot/namespaces/{namespace}/v4/reporting/traffic/overview/expanded",
				},
				{
					action: "create",
					resourceType: "timesery",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewTimeseriesV4",
					summary: "Traffic Overview Timeseries V4.",
					description:
						"GET the traffic count details based on types like Humans, Automated, Allow listed, etc. Over a chosen period.",
					purpose: "Create new timeserie",
					path: "/api/shape/bot/namespaces/{namespace}/v4/reporting/traffic/overview/timeseries",
				},
				{
					action: "create",
					resourceType: "endpoint",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TopAttackedEndpointsV5",
					summary: "Top Attacked Endpoints v5.",
					description:
						"GET top attacked application endpoints v5, with the new definition of malicious bot for sub categories feature.",
					purpose: "Create new endpoint",
					path: "/api/shape/bot/namespaces/{namespace}/v5/reporting/top/type/malicious/dimension/endpoints",
				},
				{
					action: "create",
					resourceType: "expanded",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.TrafficOverviewExpandedV5",
					summary: "Expanded Traffic Overview V5.",
					description:
						"GET expanded traffic overview v5 with global filters supported.",
					purpose: "Create new expanded",
					path: "/api/shape/bot/namespaces/{namespace}/v5/reporting/traffic/overview/expanded",
				},
				{
					action: "create",
					resourceType: "threat-type",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.PeersThreatTypes",
					summary: "Peergroup By Threat Types.",
					description:
						"GetThreat Types traffic count for Peergroup Benchmarking.",
					purpose: "Create new threat-type",
					path: "/api/shape/bot/reporting/peers/threat-types",
				},
				{
					action: "create",
					resourceType: "top-good-bot",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.PeersTopGoodBots",
					summary: "Peer Group Top Good Bots.",
					description: "GET Peer Group Top Good Bots.",
					purpose: "Create new top-good-bot",
					path: "/api/shape/bot/reporting/peers/top-good-bots",
				},
				{
					action: "create",
					resourceType: "top-reason-code",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.PeersTopReasonCodes",
					summary: "Peergroup Top Reason Codes.",
					description: "GET Top Reason Codes.",
					purpose: "Create new top-reason-code",
					path: "/api/shape/bot/reporting/peers/top-reason-codes",
				},
				{
					action: "create",
					resourceType: "overview",
					operationId:
						"ves.io.schema.shape.bot_defense.reporting.CustomAPI.PeersTrafficOverview",
					summary: "Peer Group Traffic Overview.",
					description: "GET traffic overview.",
					purpose: "Create new overview",
					path: "/api/shape/bot/reporting/peers/traffic/overview",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.shape.bot_defense.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to Shape Bot Defense.",
					description: "Subscribe to Shape Bot Defense.",
					purpose: "Create new subscribe",
					path: "/api/shape/bot/namespaces/system/bot-defense/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.shape.bot_defense.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Shape Bot Defense.",
					description: "Unsubscribe to Shape Bot Defense.",
					purpose: "Create new unsubscribe",
					path: "/api/shape/bot/namespaces/system/bot-defense/addon/unsubscribe",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"docs_cloud_f5_com_0213_public_ves_io_schema_shape_bot_defense_subscription_ves_swagger_ves.io.schema.shape.bot_defense.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to Shape Bot Defense.",
					description: "Subscribe to Shape Bot Defense.",
					purpose: "Create new subscribe",
					path: "/api/shape/bot/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"docs_cloud_f5_com_0213_public_ves_io_schema_shape_bot_defense_subscription_ves_swagger_ves.io.schema.shape.bot_defense.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Shape Bot Defense.",
					description: "Unsubscribe to Shape Bot Defense.",
					purpose: "Create new unsubscribe",
					path: "/api/shape/bot/unsubscribe",
				},
				{
					action: "create",
					resourceType: "channel",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.Channel",
					summary: "Channel Dashboard.",
					description:
						"GET channel chart data from shape recognize API.",
					purpose: "Create new channel",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/dashboard/channel",
				},
				{
					action: "create",
					resourceType: "conversion",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.Conversion",
					summary: "Conversion Dashboard.",
					description:
						"GET conversion chart data from shape recognize API.",
					purpose: "Create new conversion",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/dashboard/conversion",
				},
				{
					action: "create",
					resourceType: "enjoy",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.Enjoy",
					summary: "Enjoy Dashboard.",
					description:
						"GET enjoy chart data from shape recognize API.",
					purpose: "Create new enjoy",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/dashboard/enjoy",
				},
				{
					action: "create",
					resourceType: "friction_aggregation",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.FrictionAggregation",
					summary: "Friction Aggregation Dashboard.",
					description:
						"GET Friction Aggregation chart data from shape recognize API.",
					purpose: "Create new friction-aggregation",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/dashboard/friction_aggregation",
				},
				{
					action: "create",
					resourceType: "friction_histogram",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.FrictionHistogram",
					summary: "Friction Histogram Dashboard.",
					description:
						"GET Histogram Aggregation chart data from shape recognize API.",
					purpose: "Create new friction-histogram",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/dashboard/friction_histogram",
				},
				{
					action: "list",
					resourceType: "health",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.Health",
					summary: "Health Check.",
					description: "Health Check.",
					purpose: "List all healths",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/dashboard/health",
				},
				{
					action: "create",
					resourceType: "lift",
					operationId: "ves.io.schema.shape.recognize.CustomAPI.Lift",
					summary: "Lift Dashboard.",
					description:
						"GET lift chart data from shape recognize API.",
					purpose: "Create new lift",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/dashboard/lift",
				},
				{
					action: "create",
					resourceType: "rescue",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.Rescue",
					summary: "Rescue Dashboard.",
					description:
						"GET rescue chart data from shape recognize API.",
					purpose: "Create new rescue",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/dashboard/rescue",
				},
				{
					action: "create",
					resourceType: "top_reason_code",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.TopReasonCodes",
					summary: "Top Reason Codes.",
					description: "Top Reason Codes.",
					purpose: "Create new top-reason-code",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/dashboard/top_reason_code",
				},
				{
					action: "list",
					resourceType: "provision",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.GetStatusAddon",
					summary: "GET Recognize Provision Status Addon.",
					description:
						"GET Recognize provision status as add-on service.",
					purpose: "List all provisions",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/provision",
				},
				{
					action: "list",
					resourceType: "state",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.State",
					summary: "State",
					description: "GET customer State if after or before.",
					purpose: "List all states",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/state",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.Subscribe",
					summary: "Subscribe to Shape Recognize.",
					description:
						"Subscribe to Shape Recognize as add-on service.",
					purpose: "Create new subscribe",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Shape Recognize.",
					description:
						"Unsubscribe to Shape Recognize as add-on service.",
					purpose: "Create new unsubscribe",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/unsubscribe",
				},
				{
					action: "create",
					resourceType: "src_tag_injection",
					operationId:
						"ves.io.schema.shape.recognize.CustomAPI.ValidateSrcTagInjectionAddon",
					summary: "ValidateSrcTagInjection Addon.",
					description:
						"Validate src tag injection in the target URL.",
					purpose: "Create new src-tag-injection",
					path: "/api/shape/recognize/namespaces/system/recognize/addon/validate/src_tag_injection",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.shape.safeap.CustomAPI.Subscribe",
					summary: "Subscribe to Safe AP.",
					description: "Subscribe to Safe AP as add-on service.",
					purpose: "Create new subscribe",
					path: "/api/shape/safeap/namespaces/system/safeap/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.shape.safeap.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Safe AP.",
					description: "Unsubscribe to Safe AP as add-on service.",
					purpose: "Create new unsubscribe",
					path: "/api/shape/safeap/namespaces/system/safeap/addon/unsubscribe",
				},
				{
					action: "create",
					resourceType: "getcurrentfrauddata",
					operationId:
						"ves.io.schema.shape.safeap.CustomAPI.GetCurrentFraudData",
					summary: "GetCurrentFraudData.",
					description:
						"GET Current Fraud data request for a time range.",
					purpose: "Create new getcurrentfrauddata",
					path: "/api/shape/safeap/namespaces/system/safeap/dashboard/getcurrentfrauddata",
				},
				{
					action: "create",
					resourceType: "gettopriskyaccount",
					operationId:
						"ves.io.schema.shape.safeap.CustomAPI.GetTopRiskyAccounts",
					summary: "GetTopRiskyAccounts.",
					description:
						"GET top risky accounts data request in a time range.",
					purpose: "Create new gettopriskyaccount",
					path: "/api/shape/safeap/namespaces/system/safeap/dashboard/gettopriskyaccounts",
				},
				{
					action: "create",
					resourceType: "gettopriskydevice",
					operationId:
						"ves.io.schema.shape.safeap.CustomAPI.GetTopRiskyDevices",
					summary: "GetTopRiskyDevices.",
					description:
						"GET top risky devices data request in a time range.",
					purpose: "Create new gettopriskydevice",
					path: "/api/shape/safeap/namespaces/system/safeap/dashboard/gettopriskydevices",
				},
				{
					action: "create",
					resourceType: "gettopriskyipaddresse",
					operationId:
						"ves.io.schema.shape.safeap.CustomAPI.GetTopRiskyIpAddresses",
					summary: "GetTopRiskyIpAddresses.",
					description:
						"GET top risky IP addresses data request in a time range.",
					purpose: "Create new gettopriskyipaddresse",
					path: "/api/shape/safeap/namespaces/system/safeap/dashboard/gettopriskyipaddresses",
				},
				{
					action: "create",
					resourceType: "gettopriskyreason",
					operationId:
						"ves.io.schema.shape.safeap.CustomAPI.GetTopRiskyReasons",
					summary: "GetTopRiskyReasons.",
					description:
						"GET top risky reasons data request for a time range.",
					purpose: "Create new gettopriskyreason",
					path: "/api/shape/safeap/namespaces/system/safeap/dashboard/gettopriskyreasons",
				},
				{
					action: "create",
					resourceType: "gettransactiondata",
					operationId:
						"ves.io.schema.shape.safeap.CustomAPI.GetTransactionData",
					summary: "GetTransactionData.",
					description:
						"GET Transaction data request for a time range.",
					purpose: "Create new gettransactiondata",
					path: "/api/shape/safeap/namespaces/system/safeap/dashboard/gettransactiondata",
				},
				{
					action: "list",
					resourceType: "health",
					operationId: "ves.io.schema.shape.safeap.CustomAPI.Health",
					summary: "Health Check.",
					description: "Health Check.",
					purpose: "List all healths",
					path: "/api/shape/safeap/namespaces/system/safeap/dashboard/health",
				},
				{
					action: "create",
					resourceType: "safecubejsdata",
					operationId:
						"ves.io.schema.shape.safeap.CustomAPI.GetSafeCubeJSData",
					summary: "GetSafeCubeJSData.",
					description:
						"GET Safe CubeJS data request for a given query.",
					purpose: "Create new safecubejsdata",
					path: "/api/shape/safeap/namespaces/system/safeap/dashboard/safecubejsdata",
				},
				{
					action: "list",
					resourceType: "audit",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeBlockAudit",
					summary: "GET SAFE Block table list.",
					description: "GET SAFE block table list.",
					purpose: "List all audits",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/block/audit",
				},
				{
					action: "list",
					resourceType: "audit",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeBlockAuditCsv",
					summary: "GET SAFE Analyst Block Audit as a CSV file.",
					description: "GET Safe block audit as CSV file.",
					purpose: "List all audits",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/block/csv/audit",
				},
				{
					action: "list",
					resourceType: "table",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeBlockTableCsv",
					summary: "GET SAFE Analyst Block Table as a CSV file.",
					description: "GET Safe block table as CSV file.",
					purpose: "List all tables",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/block/csv/table",
				},
				{
					action: "list",
					resourceType: "detail",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeBlockDetails",
					summary: "GET SAFE Block Details.",
					description: "GET SAFE block details.",
					purpose: "List all details",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/block/details",
				},
				{
					action: "create",
					resourceType: "feedback",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeBlockFeedback",
					summary: "PostSafeBlockFeedback.",
					description: "POST Safe block feedback.",
					purpose: "Create new feedback",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/block/feedback",
				},
				{
					action: "create",
					resourceType: "rule",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeBlockRule",
					summary: "PostSafeBlockRule.",
					description: "Edit exising block rule.",
					purpose: "Create new rule",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/block/rule",
				},
				{
					action: "list",
					resourceType: "table",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeBlockTable",
					summary: "GET SAFE Block table list.",
					description: "GET SAFE block table list.",
					purpose: "List all tables",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/block/table",
				},
				{
					action: "create",
					resourceType: "ep",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeEp",
					summary: "PostSafeEp.",
					description: "POST Safe Analyst Station ep request.",
					purpose: "Create new ep",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/ep",
				},
				{
					action: "create",
					resourceType: "feedback",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostFeedback",
					summary: "Update Fraud Feedback.",
					description:
						"Update fraud feedback for a transaction or session.",
					purpose: "Create new feedback",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/feedback",
				},
				{
					action: "create",
					resourceType: "general_feedback",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostGeneralFeedback",
					summary: "Update Fraud Feedback.",
					description:
						"Update fraud feedback for a transaction or session.",
					purpose: "Create new general-feedback",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/general_feedback",
				},
				{
					action: "list",
					resourceType: "health",
					operationId: "ves.io.schema.shape.safe.CustomAPI.GetHealth",
					summary: "GetHealthRequest.",
					description: "Returns 200 Ok if the service is health.",
					purpose: "List all healths",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/health",
				},
				{
					action: "create",
					resourceType: "provision",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeProvision",
					summary: "PostSafeProvision.",
					description: "POST Safe Analyst Station provision.",
					purpose: "Create new provision",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/provision",
				},
				{
					action: "list",
					resourceType: "overview",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeOverview",
					summary: "GET SAFE Overview.",
					description:
						"GET SAFE Analyst Station Dashboard Transaction Breakdown request.",
					purpose: "List all overviews",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/stats/overview",
				},
				{
					action: "create",
					resourceType: "overview",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeOverview",
					summary: "PostSafeOverview.",
					description:
						"POST Safe Analyst Station Dashboard Transaction Breakdown request.",
					purpose: "Create new overview",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/stats/overview",
				},
				{
					action: "list",
					resourceType: "top_location",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeTopLocations",
					summary: "GET SAFE Top Locations.",
					description:
						"GET SAFE Analyst Station Dashboard Transaction Breakdown request.",
					purpose: "List all top-locations",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/stats/top_locations",
				},
				{
					action: "create",
					resourceType: "top_location",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTopLocations",
					summary: "POST SAFE Top Locations.",
					description:
						"POST SAFE Analyst Station Dashboard Transaction Breakdown request.",
					purpose: "Create new top-location",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/stats/top_locations",
				},
				{
					action: "list",
					resourceType: "top_source",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeTopSources",
					summary: "GET SAFE Top Sources.",
					description:
						"GET SAFE Analyst Station Dashboard Transaction Breakdown request.",
					purpose: "List all top-sources",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/stats/top_sources",
				},
				{
					action: "create",
					resourceType: "top_source",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTopSources",
					summary: "POST SAFE Top Sources.",
					description:
						"POST SAFE Analyst Station Dashboard Transaction Breakdown request.",
					purpose: "Create new top-source",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/stats/top_sources",
				},
				{
					action: "create",
					resourceType: "transactions_over_time",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTransactionsOverTime",
					summary: "PostSafeTransactionsOverTime.",
					description:
						"POST Safe Analyst Station Dashboard Transaction Breakdown request.",
					purpose: "Create new transactions-over-time",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/stats/transactions_over_time",
				},
				{
					action: "list",
					resourceType: "summary",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeSummary",
					summary: "GET SAFE Analyst Summary.",
					description: "GET SAFE transaction summary for analysts.",
					purpose: "List all summarys",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/summary",
				},
				{
					action: "list",
					resourceType: "transaction_detail",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.GetSafeTransactionDetails",
					summary: "GET SAFE Anayst Transaction Details.",
					description:
						"GET a detailed information about the requested transaction.",
					purpose: "List all transaction-details",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/transaction_details",
				},
				{
					action: "create",
					resourceType: "transaction_detail",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTransactionDetails",
					summary: "PostSafeTransactionDetails.",
					description:
						"POST Safe Analyst Station specific transaction details.",
					purpose: "Create new transaction-detail",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/transaction_details",
				},
				{
					action: "create",
					resourceType: "transaction_device_history",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTransactionDeviceHistory",
					summary: "PostSafeTransactionDeviceHistory.",
					description:
						"POST Safe Analyst Station specific transaction device history.",
					purpose: "Create new transaction-device-history",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/transaction_device_history",
				},
				{
					action: "create",
					resourceType: "transaction_location",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTransactionLocations",
					summary: "PostSafeTransactionLocations.",
					description:
						"POST Safe Analyst Station specific transaction locations.",
					purpose: "Create new transaction-location",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/transaction_locations",
				},
				{
					action: "create",
					resourceType: "transaction_related_session",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTransactionRelatedSessions",
					summary: "PostSafeTransactionRelatedSessions.",
					description:
						"POST Safe Analyst Station specific transaction related sessions.",
					purpose: "Create new transaction-related-session",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/transaction_related_sessions",
				},
				{
					action: "create",
					resourceType: "transaction_timeline",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTransactionTimeline",
					summary: "PostSafeTransactionTimeline.",
					description:
						"POST Safe Analyst Station specific transaction timeline.",
					purpose: "Create new transaction-timeline",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/transaction_timeline",
				},
				{
					action: "create",
					resourceType: "transaction",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTransactions",
					summary: "List SAFE Analyst Transactions.",
					description: "List SAFE transactions for analysts.",
					purpose: "Create new transaction",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/transactions",
				},
				{
					action: "create",
					resourceType: "transactions_csv",
					operationId:
						"ves.io.schema.shape.safe.CustomAPI.PostSafeTransactionsCsv",
					summary: "GET SAFE Analyst Transactions as a CSV file.",
					description: "GET Safe transactions as CSV file.",
					purpose: "Create new transactions-csv",
					path: "/api/shape/safe/namespaces/{namespace}/safe/sas/transactions_csv",
				},
			],
		},
	],
	[
		"sites",
		{
			domain: "sites",
			displayName: "Sites",
			description:
				"Deploy edge nodes across AWS, Azure, and GCP with automated provisioning. Configure VPC peering, transit gateway attachments, and VPN tunnel settings. Define virtual groupings with label selectors for policy targeting. Manage Kubernetes cluster integrations and secure mesh deployments. Monitor node health, validate configurations, and set IP prefix allocations.",
			descriptionShort:
				"Deploy edge nodes across AWS, Azure, and GCP with automat...",
			resourceTypes: [
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
				"global-kubeconfig",
				"global_network",
				"job",
				"k8s_audit_log",
				"k8s_cluster",
				"k8s_event",
				"local-kubeconfig",
				"log",
				"metric",
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
				"state",
				"statefulset",
				"statu",
				"upgrade_o",
				"upgrade_sw",
				"validate_config",
				"virtual_k8ss",
				"virtual_site",
				"vk8s_audit_log",
				"vk8s_event",
				"voltstack_site",
			],
			operations: [
				{
					action: "create",
					resourceType: "aws_tgw_site",
					operationId: "ves.io.schema.views.aws_tgw_site.API.Create",
					summary: "Create AWS TGW site.",
					description: "Shape of the AWS TGW site specification.",
					purpose: "Create new aws-tgw-site",
					path: "/api/config/namespaces/{metadata.namespace}/aws_tgw_sites",
				},
				{
					action: "replace",
					resourceType: "aws_tgw_site",
					operationId: "ves.io.schema.views.aws_tgw_site.API.Replace",
					summary: "Replace AWS TGW site.",
					description:
						"Shape of the AWS TGW site replace specification.",
					purpose: "Replace existing aws-tgw-site",
					path: "/api/config/namespaces/{metadata.namespace}/aws_tgw_sites/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "set_tgw_info",
					operationId:
						"ves.io.schema.views.aws_tgw_site.CustomAPI.SetTGWInfo",
					summary: "Configure TGW Information.",
					description:
						"Configure TGW Information like tgw-ID, F5 Distributed Cloud site's VPC-ID.",
					purpose: "Create new set-tgw-info",
					path: "/api/config/namespaces/{namespace}/aws_tgw_site/{name}/set_tgw_info",
				},
				{
					action: "create",
					resourceType: "set_vip_info",
					operationId:
						"ves.io.schema.views.aws_tgw_site.CustomAPI.SetVIPInfo",
					summary: "Configure AWS TGW Site VIP Information.",
					description: "Configure AWS TGW Site VIP Information.",
					purpose: "Create new set-vip-info",
					path: "/api/config/namespaces/{namespace}/aws_tgw_site/{name}/set_vip_info",
				},
				{
					action: "create",
					resourceType: "set_vpc_ip_prefixe",
					operationId:
						"ves.io.schema.views.aws_tgw_site.CustomAPI.SetVPCIpPrefixes",
					summary: "Configure VPC IP prefixes.",
					description: "Configure VPC IP prefix set.",
					purpose: "Create new set-vpc-ip-prefixe",
					path: "/api/config/namespaces/{namespace}/aws_tgw_site/{name}/set_vpc_ip_prefixes",
				},
				{
					action: "create",
					resourceType: "set_vpn_tunnel",
					operationId:
						"ves.io.schema.views.aws_tgw_site.CustomAPI.SetVPNTunnels",
					summary: "Configure VPN Tunnels.",
					description: "Configure VPC IP prefix set.",
					purpose: "Create new set-vpn-tunnel",
					path: "/api/config/namespaces/{namespace}/aws_tgw_site/{name}/set_vpn_tunnels",
				},
				{
					action: "create",
					resourceType: "validate_config",
					operationId:
						"ves.io.schema.views.aws_tgw_site.CustomAPI.ValidateConfig",
					summary: "Validate AWS TGW Config.",
					description: "Validate AWS TGW Config.",
					purpose: "Create new validate-config",
					path: "/api/config/namespaces/{namespace}/aws_tgw_site/{name}/validate_config",
				},
				{
					action: "list",
					resourceType: "aws_tgw_site",
					operationId: "ves.io.schema.views.aws_tgw_site.API.List",
					summary: "List Configure AWS TGW Site.",
					description: "List the set of aws_tgw_site in a namespace.",
					purpose: "List all aws-tgw-sites",
					path: "/api/config/namespaces/{namespace}/aws_tgw_sites",
				},
				{
					action: "get",
					resourceType: "aws_tgw_site",
					operationId: "ves.io.schema.views.aws_tgw_site.API.Get",
					summary: "GET AWS TGW site.",
					description: "Shape of the AWS TGW site specification.",
					purpose: "Retrieve specific aws-tgw-site",
					path: "/api/config/namespaces/{namespace}/aws_tgw_sites/{name}",
				},
				{
					action: "delete",
					resourceType: "aws_tgw_site",
					operationId: "ves.io.schema.views.aws_tgw_site.API.Delete",
					summary: "DELETE Configure AWS TGW Site.",
					description: "DELETE the specified aws_tgw_site.",
					purpose: "Delete aws-tgw-site",
					path: "/api/config/namespaces/{namespace}/aws_tgw_sites/{name}",
				},
				{
					action: "create",
					resourceType: "aws_vpc_site",
					operationId: "ves.io.schema.views.aws_vpc_site.API.Create",
					summary: "Create AWS VPC site.",
					description: "Shape of the AWS VPC site specification.",
					purpose: "Create new aws-vpc-site",
					path: "/api/config/namespaces/{metadata.namespace}/aws_vpc_sites",
				},
				{
					action: "replace",
					resourceType: "aws_vpc_site",
					operationId: "ves.io.schema.views.aws_vpc_site.API.Replace",
					summary: "Replace AWS VPC site.",
					description:
						"Shape of the AWS VPC site replace specification.",
					purpose: "Replace existing aws-vpc-site",
					path: "/api/config/namespaces/{metadata.namespace}/aws_vpc_sites/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "set_cloud_site_info",
					operationId:
						"ves.io.schema.views.aws_vpc_site.CustomAPI.SetCloudSiteInfo",
					summary: "Configure AWS VPC Site Information.",
					description:
						"Configure AWS VPC Site Information like public, private ips, subnet IDs and others.",
					purpose: "Create new set-cloud-site-info",
					path: "/api/config/namespaces/{namespace}/aws_vpc_site/{name}/set_cloud_site_info",
				},
				{
					action: "create",
					resourceType: "set_vip_info",
					operationId:
						"ves.io.schema.views.aws_vpc_site.CustomAPI.SetVIPInfo",
					summary: "Configure AWS VPC Site VIP Information.",
					description: "Configure AWS VPC Site VIP Information.",
					purpose: "Create new set-vip-info",
					path: "/api/config/namespaces/{namespace}/aws_vpc_site/{name}/set_vip_info",
				},
				{
					action: "create",
					resourceType: "set_vpc_k8s_hostname",
					operationId:
						"ves.io.schema.views.aws_vpc_site.CustomAPI.SetVPCK8SHostnames",
					summary: "Configure VPC K8s hostnames.",
					description: "Configure VPC K8s node hostname set.",
					purpose: "Create new set-vpc-k8s-hostname",
					path: "/api/config/namespaces/{namespace}/aws_vpc_site/{name}/storage/set_vpc_k8s_hostnames",
				},
				{
					action: "create",
					resourceType: "validate_config",
					operationId:
						"ves.io.schema.views.aws_vpc_site.CustomAPI.ValidateConfig",
					summary: "Validate AWS VPC Site Config.",
					description: "Validate AWS VPC Site Config.",
					purpose: "Create new validate-config",
					path: "/api/config/namespaces/{namespace}/aws_vpc_site/{name}/validate_config",
				},
				{
					action: "list",
					resourceType: "aws_vpc_site",
					operationId: "ves.io.schema.views.aws_vpc_site.API.List",
					summary: "List Configure AWS VPC Site.",
					description: "List the set of aws_vpc_site in a namespace.",
					purpose: "List all aws-vpc-sites",
					path: "/api/config/namespaces/{namespace}/aws_vpc_sites",
				},
				{
					action: "get",
					resourceType: "aws_vpc_site",
					operationId: "ves.io.schema.views.aws_vpc_site.API.Get",
					summary: "GET AWS VPC site.",
					description: "Shape of the AWS VPC site specification.",
					purpose: "Retrieve specific aws-vpc-site",
					path: "/api/config/namespaces/{namespace}/aws_vpc_sites/{name}",
				},
				{
					action: "delete",
					resourceType: "aws_vpc_site",
					operationId: "ves.io.schema.views.aws_vpc_site.API.Delete",
					summary: "DELETE Configure AWS VPC Site.",
					description: "DELETE the specified aws_vpc_site.",
					purpose: "Delete aws-vpc-site",
					path: "/api/config/namespaces/{namespace}/aws_vpc_sites/{name}",
				},
				{
					action: "create",
					resourceType: "voltstack_site",
					operationId:
						"ves.io.schema.views.voltstack_site.API.Create",
					summary: "Create App Stack site.",
					description: "Shape of the App Stack site specification.",
					purpose: "Create new voltstack-site",
					path: "/api/config/namespaces/{metadata.namespace}/voltstack_sites",
				},
				{
					action: "replace",
					resourceType: "voltstack_site",
					operationId:
						"ves.io.schema.views.voltstack_site.API.Replace",
					summary: "Replace App Stack site.",
					description:
						"Shape of the App Stack site replace specification.",
					purpose: "Replace existing voltstack-site",
					path: "/api/config/namespaces/{metadata.namespace}/voltstack_sites/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "voltstack_site",
					operationId: "ves.io.schema.views.voltstack_site.API.List",
					summary: "List Configure App Stack Site.",
					description:
						"List the set of customer_edge_site in a namespace.",
					purpose: "List all voltstack-sites",
					path: "/api/config/namespaces/{namespace}/voltstack_sites",
				},
				{
					action: "get",
					resourceType: "voltstack_site",
					operationId: "ves.io.schema.views.voltstack_site.API.Get",
					summary: "GET App Stack site.",
					description: "Shape of the App Stack site specification.",
					purpose: "Retrieve specific voltstack-site",
					path: "/api/config/namespaces/{namespace}/voltstack_sites/{name}",
				},
				{
					action: "delete",
					resourceType: "voltstack_site",
					operationId:
						"ves.io.schema.views.voltstack_site.API.Delete",
					summary: "DELETE Configure App Stack Site.",
					description: "DELETE the specified customer_edge_site.",
					purpose: "Delete voltstack-site",
					path: "/api/config/namespaces/{namespace}/voltstack_sites/{name}",
				},
				{
					action: "create",
					resourceType: "azure_vnet_site",
					operationId:
						"ves.io.schema.views.azure_vnet_site.API.Create",
					summary: "Create Azure VNet site.",
					description: "Shape of the Azure VNet site specification.",
					purpose: "Create new azure-vnet-site",
					path: "/api/config/namespaces/{metadata.namespace}/azure_vnet_sites",
				},
				{
					action: "replace",
					resourceType: "azure_vnet_site",
					operationId:
						"ves.io.schema.views.azure_vnet_site.API.Replace",
					summary: "Replace Azure VNet site.",
					description:
						"Shape of the Azure VNet site replace specification.",
					purpose: "Replace existing azure-vnet-site",
					path: "/api/config/namespaces/{metadata.namespace}/azure_vnet_sites/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "set_cloud_site_info",
					operationId:
						"ves.io.schema.views.azure_vnet_site.CustomAPI.SetCloudSiteInfo",
					summary: "Configure Azure VNet Site Information.",
					description:
						"Configure Azure VNet Site Information like public, private ips, subnet IDs and others.",
					purpose: "Create new set-cloud-site-info",
					path: "/api/config/namespaces/{namespace}/azure_vnet_site/{name}/set_cloud_site_info",
				},
				{
					action: "create",
					resourceType: "set_vip_info",
					operationId:
						"ves.io.schema.views.azure_vnet_site.CustomAPI.SetVIPInfo",
					summary: "Configure Azure VNet Site VIP Information.",
					description: "Configure Azure VNet Site VIP Information.",
					purpose: "Create new set-vip-info",
					path: "/api/config/namespaces/{namespace}/azure_vnet_site/{name}/set_vip_info",
				},
				{
					action: "create",
					resourceType: "validate_config",
					operationId:
						"ves.io.schema.views.azure_vnet_site.CustomAPI.ValidateConfig",
					summary: "Validate Azure VNet Site Config.",
					description: "Validate Azure VNet Site Config.",
					purpose: "Create new validate-config",
					path: "/api/config/namespaces/{namespace}/azure_vnet_site/{name}/validate_config",
				},
				{
					action: "list",
					resourceType: "azure_vnet_site",
					operationId: "ves.io.schema.views.azure_vnet_site.API.List",
					summary: "List Configure Azure VNet Site.",
					description:
						"List the set of azure_vnet_site in a namespace.",
					purpose: "List all azure-vnet-sites",
					path: "/api/config/namespaces/{namespace}/azure_vnet_sites",
				},
				{
					action: "get",
					resourceType: "azure_vnet_site",
					operationId: "ves.io.schema.views.azure_vnet_site.API.Get",
					summary: "GET Azure VNet site.",
					description: "Shape of the Azure VNet site specification.",
					purpose: "Retrieve specific azure-vnet-site",
					path: "/api/config/namespaces/{namespace}/azure_vnet_sites/{name}",
				},
				{
					action: "delete",
					resourceType: "azure_vnet_site",
					operationId:
						"ves.io.schema.views.azure_vnet_site.API.Delete",
					summary: "DELETE Configure Azure VNet Site.",
					description: "DELETE the specified azure_vnet_site.",
					purpose: "Delete azure-vnet-site",
					path: "/api/config/namespaces/{namespace}/azure_vnet_sites/{name}",
				},
				{
					action: "create",
					resourceType: "gcp_vpc_site",
					operationId: "ves.io.schema.views.gcp_vpc_site.API.Create",
					summary: "Create GCP VPC site.",
					description: "Shape of the GCP VPC site specification.",
					purpose: "Create new gcp-vpc-site",
					path: "/api/config/namespaces/{metadata.namespace}/gcp_vpc_sites",
				},
				{
					action: "replace",
					resourceType: "gcp_vpc_site",
					operationId: "ves.io.schema.views.gcp_vpc_site.API.Replace",
					summary: "Replace GCP VPC site.",
					description:
						"Shape of the GCP VPC site replace specification.",
					purpose: "Replace existing gcp-vpc-site",
					path: "/api/config/namespaces/{metadata.namespace}/gcp_vpc_sites/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "set_cloud_site_info",
					operationId:
						"ves.io.schema.views.gcp_vpc_site.CustomAPI.SetCloudSiteInfo",
					summary: "Configure GCP VPC Site Information.",
					description:
						"Configure GCP VPC Site Information like public, private ips, subnet IDs and others.",
					purpose: "Create new set-cloud-site-info",
					path: "/api/config/namespaces/{namespace}/gcp_vpc_site/{name}/set_cloud_site_info",
				},
				{
					action: "create",
					resourceType: "validate_config",
					operationId:
						"ves.io.schema.views.gcp_vpc_site.CustomAPI.ValidateConfig",
					summary: "Validate GCP VPC Site Config.",
					description: "Validate GCP VPC Site Config.",
					purpose: "Create new validate-config",
					path: "/api/config/namespaces/{namespace}/gcp_vpc_site/{name}/validate_config",
				},
				{
					action: "list",
					resourceType: "gcp_vpc_site",
					operationId: "ves.io.schema.views.gcp_vpc_site.API.List",
					summary: "List Configure GCP VPC Site.",
					description: "List the set of gcp_vpc_site in a namespace.",
					purpose: "List all gcp-vpc-sites",
					path: "/api/config/namespaces/{namespace}/gcp_vpc_sites",
				},
				{
					action: "get",
					resourceType: "gcp_vpc_site",
					operationId: "ves.io.schema.views.gcp_vpc_site.API.Get",
					summary: "GET GCP VPC site.",
					description: "Shape of the GCP VPC site specification.",
					purpose: "Retrieve specific gcp-vpc-site",
					path: "/api/config/namespaces/{namespace}/gcp_vpc_sites/{name}",
				},
				{
					action: "delete",
					resourceType: "gcp_vpc_site",
					operationId: "ves.io.schema.views.gcp_vpc_site.API.Delete",
					summary: "DELETE Configure GCP VPC Site.",
					description: "DELETE the specified gcp_vpc_site.",
					purpose: "Delete gcp-vpc-site",
					path: "/api/config/namespaces/{namespace}/gcp_vpc_sites/{name}",
				},
				{
					action: "create",
					resourceType: "securemesh_site",
					operationId:
						"ves.io.schema.views.securemesh_site.API.Create",
					summary: "Create Secure Mesh site.",
					description: "Shape of the Secure Mesh site specification.",
					purpose: "Create new securemesh-site",
					path: "/api/config/namespaces/{metadata.namespace}/securemesh_sites",
				},
				{
					action: "replace",
					resourceType: "securemesh_site",
					operationId:
						"ves.io.schema.views.securemesh_site.API.Replace",
					summary: "Replace Secure Mesh site.",
					description: "Shape of the Secure Mesh site specification.",
					purpose: "Replace existing securemesh-site",
					path: "/api/config/namespaces/{metadata.namespace}/securemesh_sites/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "securemesh_site",
					operationId: "ves.io.schema.views.securemesh_site.API.List",
					summary: "List Configure Secure Mesh Site.",
					description:
						"List the set of securemesh_site in a namespace.",
					purpose: "List all securemesh-sites",
					path: "/api/config/namespaces/{namespace}/securemesh_sites",
				},
				{
					action: "get",
					resourceType: "securemesh_site",
					operationId: "ves.io.schema.views.securemesh_site.API.Get",
					summary: "GET Secure Mesh site.",
					description: "Shape of the Secure Mesh site specification.",
					purpose: "Retrieve specific securemesh-site",
					path: "/api/config/namespaces/{namespace}/securemesh_sites/{name}",
				},
				{
					action: "delete",
					resourceType: "securemesh_site",
					operationId:
						"ves.io.schema.views.securemesh_site.API.Delete",
					summary: "DELETE Configure Secure Mesh Site.",
					description: "DELETE the specified securemesh_site.",
					purpose: "Delete securemesh-site",
					path: "/api/config/namespaces/{namespace}/securemesh_sites/{name}",
				},
				{
					action: "create",
					resourceType: "securemesh_site_v2",
					operationId:
						"ves.io.schema.views.securemesh_site_v2.API.Create",
					summary: "Create Secure Mesh site.",
					description: "Shape of the Secure Mesh site specification.",
					purpose: "Create new securemesh-site-v2",
					path: "/api/config/namespaces/{metadata.namespace}/securemesh_site_v2s",
				},
				{
					action: "replace",
					resourceType: "securemesh_site_v2",
					operationId:
						"ves.io.schema.views.securemesh_site_v2.API.Replace",
					summary: "Replace Secure Mesh site.",
					description: "Shape of the Secure Mesh site specification.",
					purpose: "Replace existing securemesh-site-v2",
					path: "/api/config/namespaces/{metadata.namespace}/securemesh_site_v2s/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "securemesh_site_v2",
					operationId:
						"ves.io.schema.views.securemesh_site_v2.API.List",
					summary: "List Configure Secure Mesh Site.",
					description:
						"List the set of securemesh_site_v2 in a namespace.",
					purpose: "List all securemesh-site-v2s",
					path: "/api/config/namespaces/{namespace}/securemesh_site_v2s",
				},
				{
					action: "get",
					resourceType: "securemesh_site_v2",
					operationId:
						"ves.io.schema.views.securemesh_site_v2.API.Get",
					summary: "GET Secure Mesh site.",
					description: "Shape of the Secure Mesh site specification.",
					purpose: "Retrieve specific securemesh-site-v2",
					path: "/api/config/namespaces/{namespace}/securemesh_site_v2s/{name}",
				},
				{
					action: "delete",
					resourceType: "securemesh_site_v2",
					operationId:
						"ves.io.schema.views.securemesh_site_v2.API.Delete",
					summary: "DELETE Configure Secure Mesh Site.",
					description: "DELETE the specified securemesh_site_v2.",
					purpose: "Delete securemesh-site-v2",
					path: "/api/config/namespaces/{namespace}/securemesh_site_v2s/{name}",
				},
				{
					action: "create",
					resourceType: "k8s_cluster",
					operationId: "ves.io.schema.k8s_cluster.API.Create",
					summary: "Create Configuration Specification.",
					description:
						"Create k8s_cluster will create the object in the storage backend for namespace metadata.namespace.",
					purpose: "Create new k8s-cluster",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_clusters",
				},
				{
					action: "replace",
					resourceType: "k8s_cluster",
					operationId: "ves.io.schema.k8s_cluster.API.Replace",
					summary: "Replace Configuration Specification.",
					description:
						"Replacing an k8s_cluster object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing k8s-cluster",
					path: "/api/config/namespaces/{metadata.namespace}/k8s_clusters/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "k8s_cluster",
					operationId: "ves.io.schema.k8s_cluster.API.List",
					summary: "List K8s Cluster.",
					description: "List the set of k8s_cluster in a namespace.",
					purpose: "List all k8s-clusters",
					path: "/api/config/namespaces/{namespace}/k8s_clusters",
				},
				{
					action: "get",
					resourceType: "k8s_cluster",
					operationId: "ves.io.schema.k8s_cluster.API.Get",
					summary: "GET Configuration Specification.",
					description:
						"GET k8s_cluster will GET the object from the storage backend for namespace metadata.namespace.",
					purpose: "Retrieve specific k8s-cluster",
					path: "/api/config/namespaces/{namespace}/k8s_clusters/{name}",
				},
				{
					action: "delete",
					resourceType: "k8s_cluster",
					operationId: "ves.io.schema.k8s_cluster.API.Delete",
					summary: "DELETE K8s Cluster.",
					description: "DELETE the specified k8s_cluster.",
					purpose: "Delete k8s-cluster",
					path: "/api/config/namespaces/{namespace}/k8s_clusters/{name}",
				},
				{
					action: "create",
					resourceType: "firewall_log",
					operationId: "ves.io.schema.log.CustomAPI.FirewallLogQuery",
					summary: "Firewall Logs Query.",
					description:
						"Request to GET access logs and network logs with policy hits. By default, the firewall logs in the response are sorted in the reverse chronological order.",
					purpose: "Create new firewall-log",
					path: "/api/data/namespaces/{namespace}/firewall_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.FirewallLogAggregationQuery",
					summary: "Firewall Logs Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the firewall logs that matches the query in request for a given namespace.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/firewall_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.FirewallLogScrollQuery",
					summary: "Firewall Logs Scroll Query.",
					description:
						"The response for firewall log query contain no more than 500 records. Scroll request is used scroll through more than 500 records or all records that matched the criteria in the firewall log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/firewall_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.FirewallLogScrollQuery",
					summary: "Firewall Logs Scroll Query.",
					description:
						"The response for firewall log query contain no more than 500 records. Scroll request is used scroll through more than 500 records or all records that matched the criteria in the firewall log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/firewall_logs/scroll",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.K8SAuditLogScrollQuery",
					summary: "K8s Audit Log Scroll Query.",
					description:
						"The response for K8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/k8s_audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.K8SAuditLogScrollQuery",
					summary: "K8s Audit Log Scroll Query.",
					description:
						"The response for K8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/k8s_audit_logs/scroll",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.K8SEventsScrollQuery",
					summary: "K8s Events Scroll Query.",
					description:
						"The response for K8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/k8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.K8SEventsScrollQuery",
					summary: "K8s Events Scroll Query.",
					description:
						"The response for K8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/k8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "platform_event",
					operationId:
						"ves.io.schema.log.CustomAPI.PlatformEventQuery",
					summary: "Platform event Query.",
					description:
						"Request to GET platform event that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all CRUD operations performed in the namespace. User with access to the `system` namespace may query for platform events across all namespaces for a given tenant.",
					purpose: "Create new platform-event",
					path: "/api/data/namespaces/{namespace}/platform_events",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.PlatformEventAggregationQuery",
					summary: "Platform event Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the audit logs that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for platform event across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/platform_events/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.PlatformEventScrollQuery",
					summary: "Platform event Scroll Query.",
					description:
						"The response for platform event query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/platform_events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.PlatformEventScrollQuery",
					summary: "Platform event Scroll Query.",
					description:
						"The response for platform event query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/platform_events/scroll",
				},
				{
					action: "create",
					resourceType: "log",
					operationId:
						"ves.io.schema.log.CustomAPI.ExternalConnectorLogQuery",
					summary: "External connector log query.",
					description:
						"Request to GET external connector logs that matches the criteria in request for a given namespace. The logs are per site per external connector is specified as match condition in the request to GET the logs for a external connector.",
					purpose: "Create new log",
					path: "/api/data/namespaces/{namespace}/site/{site}/external_connector/{external_connector}/logs",
				},
				{
					action: "create",
					resourceType: "k8s_audit_log",
					operationId: "ves.io.schema.log.CustomAPI.K8SAuditLogQuery",
					summary: "K8s Audit Log Query.",
					description:
						"Request to GET Physical K8s audit logs that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all CRUD operations performed in the namespace. User with access to the `system` namespace may query for audit logs across all namespaces in a K8s Cluster.",
					purpose: "Create new k8s-audit-log",
					path: "/api/data/namespaces/{namespace}/site/{site}/k8s_audit_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.K8SAuditLogAggregationQuery",
					summary: "K8s Audit Log Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the K8s audit logs that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for audit logs across all namespaces in a K8s Cluster.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/site/{site}/k8s_audit_logs/aggregation",
				},
				{
					action: "create",
					resourceType: "k8s_event",
					operationId: "ves.io.schema.log.CustomAPI.K8SEventsQuery",
					summary: "K8s Events Query.",
					description:
						"Request to GET physical K8s events that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all K8s events in the namespace. User with access to the `system` namespace may query for K8s events across all namespaces in a K8s Cluster.",
					purpose: "Create new k8s-event",
					path: "/api/data/namespaces/{namespace}/site/{site}/k8s_events",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.K8SEventsAggregationQuery",
					summary: "K8s Events Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the K8s events that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for K8s events across all namespaces in a K8s Cluster.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/site/{site}/k8s_events/aggregation",
				},
				{
					action: "create",
					resourceType: "vk8s_audit_log",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SAuditLogQuery",
					summary: "VK8s Audit Log Query.",
					description:
						"Request to GET Virtual K8s audit logs that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all CRUD operations performed in the namespace. User with access to the `system` namespace may query for audit logs across all namespaces for a given tenant.",
					purpose: "Create new vk8s-audit-log",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SAuditLogAggregationQuery",
					summary: "VK8s Audit Log Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the vK8s audit logs that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for audit logs across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SAuditLogScrollQuery",
					summary: "VK8s Audit Log Scroll Query.",
					description:
						"The response for vK8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.VK8SAuditLogScrollQuery",
					summary: "VK8s Audit Log Scroll Query.",
					description:
						"The response for vK8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "vk8s_event",
					operationId: "ves.io.schema.log.CustomAPI.VK8SEventsQuery",
					summary: "VK8s Events Query.",
					description:
						"Request to GET Virtual K8s events that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all vK8s events in the namespace. User with access to the `system` namespace may query for vK8s across all namespaces for a given tenant.",
					purpose: "Create new vk8s-event",
					path: "/api/data/namespaces/{namespace}/vk8s_events",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SEventsAggregationQuery",
					summary: "VK8s Events Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the vK8s events that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for vK8s events across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/vk8s_events/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SEventsScrollQuery",
					summary: "VK8s Events Scroll Query.",
					description:
						"The response for vK8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/vk8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.VK8SEventsScrollQuery",
					summary: "VK8s Events Scroll Query.",
					description:
						"The response for vK8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/vk8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "global-kubeconfig",
					operationId:
						"ves.io.schema.site.UamKubeConfigAPI.RevokeGlobalKubeConfig",
					summary: "Revoke Global Kubeconfig.",
					description: "Kubeconfig credential revoke/deletion.",
					purpose: "Create new global-kubeconfig",
					path: "/api/web/namespaces/system/revoke/global-kubeconfigs",
				},
				{
					action: "create",
					resourceType: "statu",
					operationId:
						"ves.io.schema.site.CustomSiteStatusAPI.CheckSiteExist",
					summary: "Check Site Exist.",
					description: "Check Site Exist for a site.",
					purpose: "Create new statu",
					path: "/api/data/namespaces/system/site/{name}/status",
				},
				{
					action: "list",
					resourceType: "configmap",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.ConfigMapList",
					summary: "ConfigMap List.",
					description:
						"API to GET list of configmaps for a given namespace in a site.",
					purpose: "List all configmaps",
					path: "/api/data/namespaces/system/site/{site}/api/v1/configmaps",
				},
				{
					action: "list",
					resourceType: "endpoint",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.EndpointsList",
					summary: "Endpoints List.",
					description:
						"API to GET list of endpoints for a given namespace in a site.",
					purpose: "List all endpoints",
					path: "/api/data/namespaces/system/site/{site}/api/v1/endpoints",
				},
				{
					action: "list",
					resourceType: "namespace",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.NamespaceList",
					summary: "Namespace List.",
					description: "API to GET list of namespaces in a site.",
					purpose: "List all namespaces",
					path: "/api/data/namespaces/system/site/{site}/api/v1/namespaces",
				},
				{
					action: "list",
					resourceType: "configmap",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.ConfigMapList",
					summary: "ConfigMap List.",
					description:
						"API to GET list of configmaps for a given namespace in a site.",
					purpose: "List all configmaps",
					path: "/api/data/namespaces/system/site/{site}/api/v1/namespaces/{namespace}/configmaps",
				},
				{
					action: "list",
					resourceType: "endpoint",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.EndpointsList",
					summary: "Endpoints List.",
					description:
						"API to GET list of endpoints for a given namespace in a site.",
					purpose: "List all endpoints",
					path: "/api/data/namespaces/system/site/{site}/api/v1/namespaces/{namespace}/endpoints",
				},
				{
					action: "list",
					resourceType: "persistentvolumeclaim",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.PersistentVolumeClaimList",
					summary: "PersistentVolumeClaim List.",
					description:
						"API to GET list of PVCs for a given namespace in a site.",
					purpose: "List all persistentvolumeclaims",
					path: "/api/data/namespaces/system/site/{site}/api/v1/namespaces/{namespace}/persistentvolumeclaims",
				},
				{
					action: "list",
					resourceType: "pod",
					operationId: "ves.io.schema.site.CustomDataK8SAPI.PodList",
					summary: "Pod List",
					description:
						"API to GET list of pods in a site for a given namespace.",
					purpose: "List all pods",
					path: "/api/data/namespaces/system/site/{site}/api/v1/namespaces/{namespace}/pods",
				},
				{
					action: "list",
					resourceType: "secret",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.SecretList",
					summary: "Secret List.",
					description:
						"API to GET list of secrets for a given namespace in a site.",
					purpose: "List all secrets",
					path: "/api/data/namespaces/system/site/{site}/api/v1/namespaces/{namespace}/secrets",
				},
				{
					action: "list",
					resourceType: "service",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.ServiceList",
					summary: "Service List.",
					description:
						"API to GET list of services for a given namespace in a site.",
					purpose: "List all services",
					path: "/api/data/namespaces/system/site/{site}/api/v1/namespaces/{namespace}/services",
				},
				{
					action: "list",
					resourceType: "node",
					operationId: "ves.io.schema.site.CustomDataK8SAPI.NodeList",
					summary: "Namespace List.",
					description: "API to GET list of nodes in a site.",
					purpose: "List all nodes",
					path: "/api/data/namespaces/system/site/{site}/api/v1/nodes",
				},
				{
					action: "list",
					resourceType: "persistentvolumeclaim",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.PersistentVolumeClaimList",
					summary: "PersistentVolumeClaim List.",
					description:
						"API to GET list of PVCs for a given namespace in a site.",
					purpose: "List all persistentvolumeclaims",
					path: "/api/data/namespaces/system/site/{site}/api/v1/persistentvolumeclaims",
				},
				{
					action: "list",
					resourceType: "persistentvolume",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.PersistentVolumeList",
					summary: "PersistentVolume List.",
					description:
						"API to GET list of Persistent Volumes in a site.",
					purpose: "List all persistentvolumes",
					path: "/api/data/namespaces/system/site/{site}/api/v1/persistentvolumes",
				},
				{
					action: "list",
					resourceType: "pod",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.PodList",
					summary: "Pod List",
					description:
						"API to GET list of pods in a site for a given namespace.",
					purpose: "List all pods",
					path: "/api/data/namespaces/system/site/{site}/api/v1/pods",
				},
				{
					action: "list",
					resourceType: "secret",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.SecretList",
					summary: "Secret List.",
					description:
						"API to GET list of secrets for a given namespace in a site.",
					purpose: "List all secrets",
					path: "/api/data/namespaces/system/site/{site}/api/v1/secrets",
				},
				{
					action: "list",
					resourceType: "service",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.ServiceList",
					summary: "Service List.",
					description:
						"API to GET list of services for a given namespace in a site.",
					purpose: "List all services",
					path: "/api/data/namespaces/system/site/{site}/api/v1/services",
				},
				{
					action: "list",
					resourceType: "daemonset",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.DaemonSetList",
					summary: "DaemonSet List.",
					description:
						"API to GET list of daemon sets for a given namespace in a site.",
					purpose: "List all daemonsets",
					path: "/api/data/namespaces/system/site/{site}/apis/apps/v1/daemonsets",
				},
				{
					action: "list",
					resourceType: "deployment",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.DeploymentList",
					summary: "Deployment List.",
					description:
						"API to GET list of deployments for a given namespace in a site.",
					purpose: "List all deployments",
					path: "/api/data/namespaces/system/site/{site}/apis/apps/v1/deployments",
				},
				{
					action: "list",
					resourceType: "daemonset",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.DaemonSetList",
					summary: "DaemonSet List.",
					description:
						"API to GET list of daemon sets for a given namespace in a site.",
					purpose: "List all daemonsets",
					path: "/api/data/namespaces/system/site/{site}/apis/apps/v1/namespaces/{namespace}/daemonsets",
				},
				{
					action: "list",
					resourceType: "deployment",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.DeploymentList",
					summary: "Deployment List.",
					description:
						"API to GET list of deployments for a given namespace in a site.",
					purpose: "List all deployments",
					path: "/api/data/namespaces/system/site/{site}/apis/apps/v1/namespaces/{namespace}/deployments",
				},
				{
					action: "list",
					resourceType: "replicaset",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.ReplicaSetList",
					summary: "ReplicaSet List.",
					description:
						"API to GET list of replica sets for a given namespace in a site.",
					purpose: "List all replicasets",
					path: "/api/data/namespaces/system/site/{site}/apis/apps/v1/namespaces/{namespace}/replicasets",
				},
				{
					action: "list",
					resourceType: "statefulset",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.StatefulSetList",
					summary: "StatefulSet List.",
					description:
						"API to GET list of stateful sets for a given namespace in a site.",
					purpose: "List all statefulsets",
					path: "/api/data/namespaces/system/site/{site}/apis/apps/v1/namespaces/{namespace}/statefulsets",
				},
				{
					action: "list",
					resourceType: "replicaset",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.ReplicaSetList",
					summary: "ReplicaSet List.",
					description:
						"API to GET list of replica sets for a given namespace in a site.",
					purpose: "List all replicasets",
					path: "/api/data/namespaces/system/site/{site}/apis/apps/v1/replicasets",
				},
				{
					action: "list",
					resourceType: "statefulset",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.StatefulSetList",
					summary: "StatefulSet List.",
					description:
						"API to GET list of stateful sets for a given namespace in a site.",
					purpose: "List all statefulsets",
					path: "/api/data/namespaces/system/site/{site}/apis/apps/v1/statefulsets",
				},
				{
					action: "list",
					resourceType: "job",
					operationId: "ves.io.schema.site.CustomDataK8SAPI.JobList",
					summary: "Job List",
					description:
						"API to GET list of jobs for a given namespace in a site.",
					purpose: "List all jobs",
					path: "/api/data/namespaces/system/site/{site}/apis/batch/v1/jobs",
				},
				{
					action: "list",
					resourceType: "job",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.JobList",
					summary: "Job List",
					description:
						"API to GET list of jobs for a given namespace in a site.",
					purpose: "List all jobs",
					path: "/api/data/namespaces/system/site/{site}/apis/batch/v1/namespaces/{namespace}/jobs",
				},
				{
					action: "list",
					resourceType: "cronjob",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.CronJobList",
					summary: "CronJob List.",
					description:
						"API to GET list of cronjobs for a given namespace in a site.",
					purpose: "List all cronjobs",
					path: "/api/data/namespaces/system/site/{site}/apis/batch/v1beta1/cronjobs",
				},
				{
					action: "list",
					resourceType: "cronjob",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.CronJobList",
					summary: "CronJob List.",
					description:
						"API to GET list of cronjobs for a given namespace in a site.",
					purpose: "List all cronjobs",
					path: "/api/data/namespaces/system/site/{site}/apis/batch/v1beta1/namespaces/{namespace}/cronjobs",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.PodsMetrics",
					summary: "Pods Metrics.",
					description:
						"API to GET pods metrics for a given namespace in a site.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/system/site/{site}/namespaces/{namespace}/pods/metrics",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.site.CustomDataK8SAPI.VirtualMachineInstancesMetrics",
					summary: "VirtualMachineInstances Metrics.",
					description:
						"API to GET virtual machine instances metrics for a given namespace in a site.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/system/site/{site}/namespaces/{namespace}/virtualmachineinstances/metrics",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.PodsMetrics",
					summary: "Pods Metrics.",
					description:
						"API to GET pods metrics for a given namespace in a site.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/system/site/{site}/pods/metrics",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"docs_cloud_f5_com_0218_public_ves_io_schema_site_ves_swagger_ves.io.schema.site.CustomDataK8SAPI.VirtualMachineInstancesMetrics",
					summary: "VirtualMachineInstances Metrics.",
					description:
						"API to GET virtual machine instances metrics for a given namespace in a site.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/system/site/{site}/virtualmachineinstances/metrics",
				},
				{
					action: "list",
					resourceType: "global-kubeconfig",
					operationId:
						"ves.io.schema.site.UamKubeConfigAPI.ListGlobalKubeConfig",
					summary: "List Global Kube Configs.",
					description:
						"Returns list of all global active kubeconfig minted for this site.",
					purpose: "List all global-kubeconfigs",
					path: "/api/web/namespaces/system/sites/{site}/global-kubeconfigs",
				},
				{
					action: "create",
					resourceType: "global-kubeconfig",
					operationId:
						"ves.io.schema.site.UamKubeConfigAPI.CreateGlobalKubeConfig",
					summary: "Create Global Kube Config.",
					description:
						"Download kube config for global K8s cluster access.",
					purpose: "Create new global-kubeconfig",
					path: "/api/web/namespaces/system/sites/{site}/global-kubeconfigs",
				},
				{
					action: "replace",
					resourceType: "site",
					operationId: "ves.io.schema.site.API.Replace",
					summary: "Replace Site.",
					description:
						"Replace Site will replace address, coordinates of site.",
					purpose: "Replace existing site",
					path: "/api/config/namespaces/{metadata.namespace}/sites/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "state",
					operationId: "ves.io.schema.site.CustomStateAPI.SetState",
					summary: "Set site state.",
					description:
						"Request changing site state but this request goes through validation as some trainsitions are not allowed. It can be used to decomission site by sending state DECOMISSIONING. Example of forbidden state is PROVISIONING and UPGRADING.",
					purpose: "Create new state",
					path: "/api/register/namespaces/{namespace}/site/{name}/state",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.site.CustomSiteStatusAPI.SiteStatusMetrics",
					summary: "Site Status Metrics.",
					description: "GET status metrics for a site.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/{namespace}/site/{site}/status/metrics",
				},
				{
					action: "list",
					resourceType: "site",
					operationId: "ves.io.schema.site.API.List",
					summary: "List Site",
					description: "List the set of site in a namespace.",
					purpose: "List all sites",
					path: "/api/config/namespaces/{namespace}/sites",
				},
				{
					action: "get",
					resourceType: "site",
					operationId: "ves.io.schema.site.API.Get",
					summary: "GET Site",
					description: "GET of site.",
					purpose: "Retrieve specific site",
					path: "/api/config/namespaces/{namespace}/sites/{name}",
				},
				{
					action: "create",
					resourceType: "local-kubeconfig",
					operationId:
						"ves.io.schema.site.ConfigKubeConfigAPI.CreateLocalKubeConfig",
					summary: "Create K8s Cluster Local Kube Config.",
					description:
						"Down load kube config for local K8s cluster access.",
					purpose: "Create new local-kubeconfig",
					path: "/api/config/namespaces/{namespace}/sites/{name}/local-kubeconfig",
				},
				{
					action: "get",
					resourceType: "local-kubeconfig",
					operationId:
						"ves.io.schema.site.ConfigKubeConfigAPI.ListLocalKubeConfig",
					summary: "List Local Kube Configs.",
					description:
						"Returns list of all local active kubeconfig minted for this site.",
					purpose: "Retrieve specific local-kubeconfig",
					path: "/api/config/namespaces/{namespace}/sites/{name}/local-kubeconfigs",
				},
				{
					action: "create",
					resourceType: "upgrade_o",
					operationId: "ves.io.schema.site.UpgradeAPI.UpgradeOS",
					summary: "Upgrade OS.",
					description: "Upgrade Site OS version.",
					purpose: "Create new upgrade-o",
					path: "/api/config/namespaces/{namespace}/sites/{name}/upgrade_os",
				},
				{
					action: "create",
					resourceType: "upgrade_sw",
					operationId: "ves.io.schema.site.UpgradeAPI.UpgradeSW",
					summary: "Upgrade SW.",
					description: "Upgrade Site SW version.",
					purpose: "Create new upgrade-sw",
					path: "/api/config/namespaces/{namespace}/sites/{name}/upgrade_sw",
				},
				{
					action: "list",
					resourceType: "global_network",
					operationId:
						"ves.io.schema.site.CustomVirtualNetworkListAPI.GlobalNetworkList",
					summary: "Global Network List.",
					description: "API to GET list of Global Network in a site.",
					purpose: "List all global-networks",
					path: "/api/config/namespaces/{namespace}/sites/{site}/global_networks",
				},
				{
					action: "list",
					resourceType: "segment",
					operationId:
						"ves.io.schema.site.CustomVirtualNetworkListAPI.SegmentList",
					summary: "Segment List.",
					description: "API to GET list of segments in a site.",
					purpose: "List all segments",
					path: "/api/config/namespaces/{namespace}/sites/{site}/segments",
				},
				{
					action: "create",
					resourceType: "site",
					operationId: "ves.io.schema.graph.site.CustomAPI.Query",
					summary: "Site Graph Query.",
					description:
						"Request to GET inter-site traffic graph for an application.",
					purpose: "Create new site",
					path: "/api/data/namespaces/{namespace}/graph/site",
				},
				{
					action: "create",
					resourceType: "edge",
					operationId: "ves.io.schema.graph.site.CustomAPI.EdgeQuery",
					summary: "Site Edge Query.",
					description:
						"Request to GET time-series data for an edge returned in the site traffic graph.",
					purpose: "Create new edge",
					path: "/api/data/namespaces/{namespace}/graph/site/edge",
				},
				{
					action: "create",
					resourceType: "node",
					operationId: "ves.io.schema.graph.site.CustomAPI.NodeQuery",
					summary: "Site Node Query.",
					description:
						"Request to GET time-series data for a site returned in the site traffic graph.",
					purpose: "Create new node",
					path: "/api/data/namespaces/{namespace}/graph/site/node",
				},
				{
					action: "create",
					resourceType: "dc_cluster_group",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.DCClusterTopology",
					summary: "DC Cluster Topology.",
					description: "GET topology of a DC Cluster.",
					purpose: "Create new dc-cluster-group",
					path: "/api/data/namespaces/system/topology/dc_cluster_group/{dc_cluster_group}",
				},
				{
					action: "list",
					resourceType: "dc_cluster_group",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.DCClusterGroupsSummary",
					summary: "DC Cluster Groups Summary.",
					description: "GET summary of all DC Cluster groups.",
					purpose: "List all dc-cluster-groups",
					path: "/api/data/namespaces/system/topology/dc_cluster_groups",
				},
				{
					action: "list",
					resourceType: "route_table",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.GetNetworkRouteTables",
					summary: "GET Network Route Tables.",
					description: "Gets Route Tables Associated with a Network.",
					purpose: "Retrieve specific route-table",
					path: "/api/data/namespaces/system/topology/network/{id}/route_tables",
				},
				{
					action: "get",
					resourceType: "route_table",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.GetRouteTable",
					summary: "GET Route Table.",
					description: "GET Route Table.",
					purpose: "Retrieve specific route-table",
					path: "/api/data/namespaces/system/topology/route_table/{name}",
				},
				{
					action: "get",
					resourceType: "network",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.GetSiteNetworks",
					summary: "GET Site Networks.",
					description: "Gets Networks Associated to Site.",
					purpose: "Retrieve specific network",
					path: "/api/data/namespaces/system/topology/site/{name}/networks",
				},
				{
					action: "create",
					resourceType: "site",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.SiteTopology",
					summary: "Site Topology.",
					description:
						"GET topology of a site and the resources associated/connected to the site such as other Customer sites, Regional Sites, VPCs (Virtual Private Cloud) networks, etc., and the associated metrics.",
					purpose: "Create new site",
					path: "/api/data/namespaces/system/topology/site/{site}",
				},
				{
					action: "create",
					resourceType: "site_mesh_group",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.SiteMeshTopology",
					summary: "Site Mesh Topology.",
					description: "GET topology of a site mesh.",
					purpose: "Create new site-mesh-group",
					path: "/api/data/namespaces/system/topology/site_mesh_group/{site_mesh_group}",
				},
				{
					action: "list",
					resourceType: "site_mesh_group",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.SiteMeshGroupsSummary",
					summary: "Site Mesh Groups Summary.",
					description: "GET summary of all site mesh groups.",
					purpose: "List all site-mesh-groups",
					path: "/api/data/namespaces/system/topology/site_mesh_groups",
				},
				{
					action: "list",
					resourceType: "route_table",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.GetTGWRouteTables",
					summary: "GET TGW Route Tables.",
					description: "Gets Route Tables Associated with a TGW.",
					purpose: "Retrieve specific route-table",
					path: "/api/data/namespaces/system/topology/tgw/{id}/route_tables",
				},
				{
					action: "create",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.Create",
					summary: "Create Virtual Kubernetes.",
					description:
						"Create virtual_k8s will create the object in the storage backend for namespace metadata.namespace.",
					purpose: "Create new virtual-k8s",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_k8ss",
				},
				{
					action: "replace",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.Replace",
					summary: "Replace Virtual Kubernetes.",
					description:
						"Replacing an endpoint object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing virtual-k8s",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_k8ss/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.virtual_k8s.CustomDataAPI.PVCMetrics",
					summary: "PVC Metrics.",
					description: "API to GET PVC capacity/usage.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/{namespace}/virtual_k8s/pvc/metrics",
				},
				{
					action: "list",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.List",
					summary: "List Virtual Kubernetes.",
					description: "List the set of virtual_k8s in a namespace.",
					purpose: "List all virtual-k8ss",
					path: "/api/config/namespaces/{namespace}/virtual_k8ss",
				},
				{
					action: "get",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.Get",
					summary: "GET Virtual Kubernetes.",
					description:
						"GET virtual_k8s will GET the object from the storage backend for namesapce metadata.namespace.",
					purpose: "Retrieve specific virtual-k8s",
					path: "/api/config/namespaces/{namespace}/virtual_k8ss/{name}",
				},
				{
					action: "delete",
					resourceType: "virtual_k8ss",
					operationId: "ves.io.schema.virtual_k8s.API.Delete",
					summary: "DELETE Virtual Kubernetes.",
					description: "DELETE the specified virtual_k8s.",
					purpose: "Delete virtual-k8s",
					path: "/api/config/namespaces/{namespace}/virtual_k8ss/{name}",
				},
				{
					action: "create",
					resourceType: "virtual_site",
					operationId: "ves.io.schema.virtual_site.API.Create",
					summary: "Create Virtual Site.",
					description:
						"Create a virtual site object in given namespace.",
					purpose: "Create new virtual-site",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_sites",
				},
				{
					action: "replace",
					resourceType: "virtual_site",
					operationId: "ves.io.schema.virtual_site.API.Replace",
					summary: "Replace Virtual Site.",
					description:
						"Replace a given virtual site object in a given namespace.",
					purpose: "Replace existing virtual-site",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_sites/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "virtual_site",
					operationId: "ves.io.schema.virtual_site.API.List",
					summary: "List Virtual Site.",
					description: "List the set of virtual_site in a namespace.",
					purpose: "List all virtual-sites",
					path: "/api/config/namespaces/{namespace}/virtual_sites",
				},
				{
					action: "get",
					resourceType: "virtual_site",
					operationId: "ves.io.schema.virtual_site.API.Get",
					summary: "GET Virtual Site.",
					description:
						"GET a virtual site object in given namespace.",
					purpose: "Retrieve specific virtual-site",
					path: "/api/config/namespaces/{namespace}/virtual_sites/{name}",
				},
				{
					action: "delete",
					resourceType: "virtual_site",
					operationId: "ves.io.schema.virtual_site.API.Delete",
					summary: "DELETE Virtual Site.",
					description: "DELETE the specified virtual_site.",
					purpose: "Delete virtual-site",
					path: "/api/config/namespaces/{namespace}/virtual_sites/{name}",
				},
				{
					action: "get",
					resourceType: "selectee",
					operationId:
						"ves.io.schema.virtual_site.CustomAPI.GetSelectees",
					summary: "GET Selectees.",
					description:
						"GET the list of objects selected by this Virtual Site based on its selector label expression.",
					purpose: "Retrieve specific selectee",
					path: "/api/config/namespaces/{namespace}/virtual_sites/{name}/selectees",
				},
			],
		},
	],
	[
		"statistics",
		{
			domain: "statistics",
			displayName: "Statistics",
			description:
				"Set up alert policies with custom matchers, label filters, and group-by rules for targeted notifications. Define routing channels via email, webhook, or integration receivers with confirmation and verification workflows. Access flow analytics, historical alert data, and namespace-scoped metrics. Build capacity planning graphs and operational summaries. Observe deployment health and service discovery mapping across distributed environments.",
			descriptionShort:
				"Set up alert policies with custom matchers, label filters...",
			resourceTypes: [
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
				"statu",
				"subscribe",
				"subscription-statu",
				"suggest-value",
				"test",
				"top_talker",
				"unsubscribe",
				"verify",
				"vk8s_audit_log",
				"vk8s_event",
			],
			operations: [
				{
					action: "create",
					resourceType: "alert_policy",
					operationId: "ves.io.schema.alert_policy.API.Create",
					summary: "Create Alert Policy.",
					description: "Creates a new Alert Policy Object.",
					purpose: "Create new alert-policy",
					path: "/api/config/namespaces/{metadata.namespace}/alert_policys",
				},
				{
					action: "replace",
					resourceType: "alert_policy",
					operationId: "ves.io.schema.alert_policy.API.Replace",
					summary: "Replace Alert Policy.",
					description:
						"Replaces the content of the Alert Policy Object.",
					purpose: "Replace existing alert-policy",
					path: "/api/config/namespaces/{metadata.namespace}/alert_policys/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "match",
					operationId:
						"ves.io.schema.alert_policy.CustomAPI.GetAlertPolicyMatch",
					summary: "GET Alert Policy Match.",
					description:
						"GET Alert Policies that match to a set of alert labels for a namespace.",
					purpose: "Create new match",
					path: "/api/alert/namespaces/{namespace}/alert_policy/match",
				},
				{
					action: "list",
					resourceType: "alert_policy",
					operationId: "ves.io.schema.alert_policy.API.List",
					summary: "List Alert Policy.",
					description: "List the set of alert_policy in a namespace.",
					purpose: "List all alert-policys",
					path: "/api/config/namespaces/{namespace}/alert_policys",
				},
				{
					action: "get",
					resourceType: "alert_policy",
					operationId: "ves.io.schema.alert_policy.API.Get",
					summary: "GET Alert Policy.",
					description: "GET the Alert Policy Object.",
					purpose: "Retrieve specific alert-policy",
					path: "/api/config/namespaces/{namespace}/alert_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "alert_policy",
					operationId: "ves.io.schema.alert_policy.API.Delete",
					summary: "DELETE Alert Policy.",
					description: "DELETE the specified alert_policy.",
					purpose: "Delete alert-policy",
					path: "/api/config/namespaces/{namespace}/alert_policys/{name}",
				},
				{
					action: "create",
					resourceType: "alert_receiver",
					operationId: "ves.io.schema.alert_receiver.API.Create",
					summary: "Create Alert Receiver.",
					description: "Creates a new Alert Receiver object.",
					purpose: "Create new alert-receiver",
					path: "/api/config/namespaces/{metadata.namespace}/alert_receivers",
				},
				{
					action: "replace",
					resourceType: "alert_receiver",
					operationId: "ves.io.schema.alert_receiver.API.Replace",
					summary: "Replace Alert Receiver.",
					description:
						"Replaces the content of an Alert Receiver object.",
					purpose: "Replace existing alert-receiver",
					path: "/api/config/namespaces/{metadata.namespace}/alert_receivers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "alert_receiver",
					operationId: "ves.io.schema.alert_receiver.API.List",
					summary: "List Alert Receiver.",
					description:
						"List the set of alert_receiver in a namespace.",
					purpose: "List all alert-receivers",
					path: "/api/config/namespaces/{namespace}/alert_receivers",
				},
				{
					action: "get",
					resourceType: "alert_receiver",
					operationId: "ves.io.schema.alert_receiver.API.Get",
					summary: "GET Alert Receiver.",
					description: "GET the Alert Receiver object.",
					purpose: "Retrieve specific alert-receiver",
					path: "/api/config/namespaces/{namespace}/alert_receivers/{name}",
				},
				{
					action: "delete",
					resourceType: "alert_receiver",
					operationId: "ves.io.schema.alert_receiver.API.Delete",
					summary: "DELETE Alert Receiver.",
					description: "DELETE the specified alert_receiver.",
					purpose: "Delete alert-receiver",
					path: "/api/config/namespaces/{namespace}/alert_receivers/{name}",
				},
				{
					action: "create",
					resourceType: "confirm",
					operationId:
						"ves.io.schema.alert_receiver.CustomAPI.ConfirmAlertReceiver",
					summary: "Confirm Alert Receiver.",
					description:
						"API to confirm the Alert Receiver - applicable only for email and sms.",
					purpose: "Create new confirm",
					path: "/api/alert/namespaces/{namespace}/alert_receivers/{name}/confirm",
				},
				{
					action: "create",
					resourceType: "test",
					operationId:
						"ves.io.schema.alert_receiver.CustomAPI.TestAlertReceiver",
					summary: "Test Alert Receiver.",
					description: "API to send test alert.",
					purpose: "Create new test",
					path: "/api/alert/namespaces/{namespace}/alert_receivers/{name}/test",
				},
				{
					action: "create",
					resourceType: "verify",
					operationId:
						"ves.io.schema.alert_receiver.CustomAPI.VerifyAlertReceiver",
					summary: "Verify Alert Receiver.",
					description:
						"API to send request to verify Alert Receiver - applicable only for email and sms.",
					purpose: "Create new verify",
					path: "/api/alert/namespaces/{namespace}/alert_receivers/{name}/verify",
				},
				{
					action: "list",
					resourceType: "all_ns_alert",
					operationId:
						"ves.io.schema.alert.CustomAPI.AlertsAllNamespaces",
					summary: "GET Alerts.",
					description:
						"For system namespace, all the alerts for the tenant matching the filter specified in the request will be returned in the response.",
					purpose: "List all all-ns-alerts",
					path: "/api/data/namespaces/system/all_ns_alerts",
				},
				{
					action: "replace",
					resourceType: "catalog",
					operationId: "ves.io.schema.pbac.catalog.CustomAPI.List",
					summary: "List",
					description:
						"Retrieves service catalog tailor for the currently logged-in user.",
					purpose: "Replace existing catalog",
					path: "/api/web/namespaces/system/catalogs",
				},
				{
					action: "list",
					resourceType: "discovered_service",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.ListDiscoveredServices",
					summary: "List discovered services of specific type.",
					description:
						"List the discovered services of specific type like virtual-servers, K8s, consul, NGINX server, etc.",
					purpose: "List all discovered-services",
					path: "/api/discovery/custom/namespaces/{namespace}/discovered_services",
				},
				{
					action: "list",
					resourceType: "discovered_service",
					operationId: "ves.io.schema.discovered_service.API.List",
					summary: "List Discovered Services.",
					description:
						"List the set of discovered_service in a namespace.",
					purpose: "List all discovered-services",
					path: "/api/discovery/namespaces/{namespace}/discovered_services",
				},
				{
					action: "get",
					resourceType: "discovered_service",
					operationId: "ves.io.schema.discovered_service.API.Get",
					summary: "GET Discovered Service Object.",
					description: "GET Discovered Service Object.",
					purpose: "Retrieve specific discovered-service",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}",
				},
				{
					action: "create",
					resourceType: "create_http_load_balancer",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.CreateHTTPLoadBalancer",
					summary: "Create HTTP/HTTPS load balancer.",
					description:
						"Create HTTP/HTTPS load balancer using the discovered virtual server as an origin server.",
					purpose: "Create new create-http-load-balancer",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}/create_http_load_balancer",
				},
				{
					action: "create",
					resourceType: "create_tcp_load_balancer",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.CreateTCPLoadBalancer",
					summary: "Create TCP load balancer.",
					description:
						"Create TCP load balancer using the discovered virtual server as an origin server.",
					purpose: "Create new create-tcp-load-balancer",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}/create_tcp_load_balancer",
				},
				{
					action: "create",
					resourceType: "disable_visibility",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.DisableVisibility",
					summary: "Disable visibility in all workspaces.",
					description:
						"Disable Visibility of the service in all workspaces. This will remove the discovered service from being visible in other wokspaces like WAAP.",
					purpose: "Create new disable-visibility",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}/disable_visibility",
				},
				{
					action: "create",
					resourceType: "enable_visibility",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.EnableVisibility",
					summary: "Enable visibility in all workspaces.",
					description:
						"Enable Visibility of the service in all workspaces. This action will make the discovered service visible within WAAP, App Connect where the user can perform the workspace specific actions.",
					purpose: "Create new enable-visibility",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}/enable_visibility",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"SuggestValues returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/discovery/namespaces/{namespace}/suggest-values",
				},
				{
					action: "list",
					resourceType: "flow_anomaly",
					operationId: "ves.io.schema.flow_anomaly.API.List",
					summary: "List Flow Anomaly.",
					description: "List the set of flow_anomaly in a namespace.",
					purpose: "List all flow-anomalys",
					path: "/api/config/namespaces/{namespace}/flow_anomalys",
				},
				{
					action: "get",
					resourceType: "flow_anomaly",
					operationId: "ves.io.schema.flow_anomaly.API.Get",
					summary: "GET Flow Anomaly.",
					description: "Shape of the flow anomaly specification.",
					purpose: "Retrieve specific flow-anomaly",
					path: "/api/config/namespaces/{namespace}/flow_anomalys/{name}",
				},
				{
					action: "create",
					resourceType: "matching_flow",
					operationId:
						"ves.io.schema.operate.flow.CustomPublicAPI.ShowMatchingFlows",
					summary: "Show Matching Flows.",
					description: "Show VER flows matching the request.",
					purpose: "Create new matching-flow",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/matching_flows",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.flow.CustomFlowConnectionAPI.Subscribe",
					summary: "Subscribe to Flow Collection.",
					description: "Subscribe to Flow Collection.",
					purpose: "Create new subscribe",
					path: "/api/config/namespaces/system/flow-collection/addon/subscribe",
				},
				{
					action: "list",
					resourceType: "subscription-statu",
					operationId:
						"ves.io.schema.flow.CustomFlowConnectionAPI.GetSubscriptionStatus",
					summary: "Check subscription status for Flow Collection.",
					description:
						"Check subscription status flow Flow Collection.",
					purpose: "List all subscription-status",
					path: "/api/config/namespaces/system/flow-collection/addon/subscription-status",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.flow.CustomFlowConnectionAPI.Unsubscribe",
					summary: "Unsubscribe to Flow Collection.",
					description: "Unsubscribe to Flow Collection.",
					purpose: "Create new unsubscribe",
					path: "/api/config/namespaces/system/flow-collection/addon/unsubscribe",
				},
				{
					action: "create",
					resourceType: "global_log_receiver",
					operationId: "ves.io.schema.global_log_receiver.API.Create",
					summary: "Create Global Log Receiver.",
					description: "Creates a new Global Log Receiver object.",
					purpose: "Create new global-log-receiver",
					path: "/api/config/namespaces/{metadata.namespace}/global_log_receivers",
				},
				{
					action: "replace",
					resourceType: "global_log_receiver",
					operationId:
						"ves.io.schema.global_log_receiver.API.Replace",
					summary: "Replace Global Log Receiver.",
					description:
						"Replaces the content of an Global Log Receiver object.",
					purpose: "Replace existing global-log-receiver",
					path: "/api/config/namespaces/{metadata.namespace}/global_log_receivers/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "statu",
					operationId:
						"ves.io.schema.global_log_receiver.CustomDataAPI.GlobalLogReceiverStatus",
					summary: "Global Log Receiver Status.",
					description: "GET status for global log receivers.",
					purpose: "Create new statu",
					path: "/api/data/namespaces/{namespace}/global_log_receiver/status",
				},
				{
					action: "list",
					resourceType: "global_log_receiver",
					operationId: "ves.io.schema.global_log_receiver.API.List",
					summary: "List Global Log Receiver.",
					description:
						"List the set of global_log_receiver in a namespace.",
					purpose: "List all global-log-receivers",
					path: "/api/config/namespaces/{namespace}/global_log_receivers",
				},
				{
					action: "get",
					resourceType: "global_log_receiver",
					operationId: "ves.io.schema.global_log_receiver.API.Get",
					summary: "GET Global Log Receiver.",
					description: "GET the Global Log Receiver object.",
					purpose: "Retrieve specific global-log-receiver",
					path: "/api/config/namespaces/{namespace}/global_log_receivers/{name}",
				},
				{
					action: "delete",
					resourceType: "global_log_receiver",
					operationId: "ves.io.schema.global_log_receiver.API.Delete",
					summary: "DELETE Global Log Receiver.",
					description: "DELETE the specified global_log_receiver.",
					purpose: "Delete global-log-receiver",
					path: "/api/config/namespaces/{namespace}/global_log_receivers/{name}",
				},
				{
					action: "create",
					resourceType: "test",
					operationId:
						"ves.io.schema.global_log_receiver.CustomAPI.TestGlobalLogReceiver",
					summary: "Test Global Log Receiver.",
					description: "API to send test log.",
					purpose: "Create new test",
					path: "/api/log_receiver/namespaces/{namespace}/global_log_receivers/{name}/test",
				},
				{
					action: "create",
					resourceType: "log_receiver",
					operationId: "ves.io.schema.log_receiver.API.Create",
					summary: "Create Log Receiver.",
					description: "Creates a new Log Receiver object.",
					purpose: "Create new log-receiver",
					path: "/api/config/namespaces/{metadata.namespace}/log_receivers",
				},
				{
					action: "replace",
					resourceType: "log_receiver",
					operationId: "ves.io.schema.log_receiver.API.Replace",
					summary: "Replace Log Receiver.",
					description:
						"Replaces the content of an Log Receiver object.",
					purpose: "Replace existing log-receiver",
					path: "/api/config/namespaces/{metadata.namespace}/log_receivers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "log_receiver",
					operationId: "ves.io.schema.log_receiver.API.List",
					summary: "List Log Receiver.",
					description: "List the set of log_receiver in a namespace.",
					purpose: "List all log-receivers",
					path: "/api/config/namespaces/{namespace}/log_receivers",
				},
				{
					action: "get",
					resourceType: "log_receiver",
					operationId: "ves.io.schema.log_receiver.API.Get",
					summary: "GET Log Receiver.",
					description: "GET the Log Receiver object.",
					purpose: "Retrieve specific log-receiver",
					path: "/api/config/namespaces/{namespace}/log_receivers/{name}",
				},
				{
					action: "delete",
					resourceType: "log_receiver",
					operationId: "ves.io.schema.log_receiver.API.Delete",
					summary: "DELETE Log Receiver.",
					description: "DELETE the specified log_receiver.",
					purpose: "Delete log-receiver",
					path: "/api/config/namespaces/{namespace}/log_receivers/{name}",
				},
				{
					action: "create",
					resourceType: "test",
					operationId:
						"ves.io.schema.log_receiver.CustomAPI.TestLogReceiver",
					summary: "Test Log Receiver.",
					description: "API to send test log.",
					purpose: "Create new test",
					path: "/api/config/namespaces/{namespace}/log_receivers/{name}/test",
				},
				{
					action: "create",
					resourceType: "firewall_log",
					operationId: "ves.io.schema.log.CustomAPI.FirewallLogQuery",
					summary: "Firewall Logs Query.",
					description:
						"Request to GET access logs and network logs with policy hits. By default, the firewall logs in the response are sorted in the reverse chronological order.",
					purpose: "Create new firewall-log",
					path: "/api/data/namespaces/{namespace}/firewall_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.FirewallLogAggregationQuery",
					summary: "Firewall Logs Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the firewall logs that matches the query in request for a given namespace.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/firewall_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.FirewallLogScrollQuery",
					summary: "Firewall Logs Scroll Query.",
					description:
						"The response for firewall log query contain no more than 500 records. Scroll request is used scroll through more than 500 records or all records that matched the criteria in the firewall log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/firewall_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.FirewallLogScrollQuery",
					summary: "Firewall Logs Scroll Query.",
					description:
						"The response for firewall log query contain no more than 500 records. Scroll request is used scroll through more than 500 records or all records that matched the criteria in the firewall log query in multiple batches. EOF is indicated by empty scroll_id in the response.",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/firewall_logs/scroll",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.K8SAuditLogScrollQuery",
					summary: "K8s Audit Log Scroll Query.",
					description:
						"The response for K8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/k8s_audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.K8SAuditLogScrollQuery",
					summary: "K8s Audit Log Scroll Query.",
					description:
						"The response for K8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/k8s_audit_logs/scroll",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.K8SEventsScrollQuery",
					summary: "K8s Events Scroll Query.",
					description:
						"The response for K8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/k8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.K8SEventsScrollQuery",
					summary: "K8s Events Scroll Query.",
					description:
						"The response for K8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/k8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "platform_event",
					operationId:
						"ves.io.schema.log.CustomAPI.PlatformEventQuery",
					summary: "Platform event Query.",
					description:
						"Request to GET platform event that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all CRUD operations performed in the namespace. User with access to the `system` namespace may query for platform events across all namespaces for a given tenant.",
					purpose: "Create new platform-event",
					path: "/api/data/namespaces/{namespace}/platform_events",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.PlatformEventAggregationQuery",
					summary: "Platform event Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the audit logs that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for platform event across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/platform_events/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.PlatformEventScrollQuery",
					summary: "Platform event Scroll Query.",
					description:
						"The response for platform event query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/platform_events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.PlatformEventScrollQuery",
					summary: "Platform event Scroll Query.",
					description:
						"The response for platform event query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/platform_events/scroll",
				},
				{
					action: "create",
					resourceType: "vk8s_audit_log",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SAuditLogQuery",
					summary: "VK8s Audit Log Query.",
					description:
						"Request to GET Virtual K8s audit logs that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all CRUD operations performed in the namespace. User with access to the `system` namespace may query for audit logs across all namespaces for a given tenant.",
					purpose: "Create new vk8s-audit-log",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SAuditLogAggregationQuery",
					summary: "VK8s Audit Log Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the vK8s audit logs that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for audit logs across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SAuditLogScrollQuery",
					summary: "VK8s Audit Log Scroll Query.",
					description:
						"The response for vK8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.VK8SAuditLogScrollQuery",
					summary: "VK8s Audit Log Scroll Query.",
					description:
						"The response for vK8s audit log query contain no more than 500 messages. One can use scroll request to scroll through more than 500 messages or all messages in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/vk8s_audit_logs/scroll",
				},
				{
					action: "create",
					resourceType: "vk8s_event",
					operationId: "ves.io.schema.log.CustomAPI.VK8SEventsQuery",
					summary: "VK8s Events Query.",
					description:
						"Request to GET Virtual K8s events that matches the criteria in request for a given namespace. If no match conditions are specified in the request, then the response contains all vK8s events in the namespace. User with access to the `system` namespace may query for vK8s across all namespaces for a given tenant.",
					purpose: "Create new vk8s-event",
					path: "/api/data/namespaces/{namespace}/vk8s_events",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SEventsAggregationQuery",
					summary: "VK8s Events Aggregation Query.",
					description:
						"Request to GET summary/analytics data for the vK8s events that matches the criteria in request for a given namespace. User with access to the `system` namespace may query aggregated data for vK8s events across all namespaces for a given tenant.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/vk8s_events/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.log.CustomAPI.VK8SEventsScrollQuery",
					summary: "VK8s Events Scroll Query.",
					description:
						"The response for vK8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/vk8s_events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0151_public_ves_io_schema_log_ves_swagger_ves.io.schema.log.CustomAPI.VK8SEventsScrollQuery",
					summary: "VK8s Events Scroll Query.",
					description:
						"The response for vK8s events query contain no more than 500 events. One can use scroll request to scroll through more than 500 events or all events in multiple batches. Empty scroll_id in the response indicates no more messages to fetch (EOF).",
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/vk8s_events/scroll",
				},
				{
					action: "get",
					resourceType: "report",
					operationId: "ves.io.schema.report.API.Get",
					summary: "GET Report.",
					description: "GET Report will read the report metadata.",
					purpose: "Retrieve specific report",
					path: "/api/report/namespaces/{namespace}/reports/{name}",
				},
				{
					action: "get",
					resourceType: "download",
					operationId:
						"ves.io.schema.report.CustomAPI.DownloadReport",
					summary: "Download Report.",
					description: "Download report.",
					purpose: "Retrieve specific download",
					path: "/api/report/namespaces/{namespace}/reports/{name}/download",
				},
				{
					action: "create",
					resourceType: "report_config",
					operationId: "ves.io.schema.report_config.API.Create",
					summary: "Create Report Configuration.",
					description:
						"Report configuration is used to schedule report generation at a later point in time.",
					purpose: "Create new report-config",
					path: "/api/report/namespaces/{metadata.namespace}/report_configs",
				},
				{
					action: "replace",
					resourceType: "report_config",
					operationId: "ves.io.schema.report_config.API.Replace",
					summary: "Replace Report Configuration.",
					description:
						"Update the configuration by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing report-config",
					path: "/api/report/namespaces/{metadata.namespace}/report_configs/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "report_config",
					operationId: "ves.io.schema.report_config.API.List",
					summary: "List Report Configuration.",
					description:
						"List the set of report_config in a namespace.",
					purpose: "List all report-configs",
					path: "/api/report/namespaces/{namespace}/report_configs",
				},
				{
					action: "create",
					resourceType: "list-reports-history",
					operationId:
						"ves.io.schema.report_config.CustomAPI.ListReportsHistory",
					summary: "List Reports History.",
					description:
						"List Reports history for the list of report configurations in the given namespace.",
					purpose: "Create new list-reports-history",
					path: "/api/report/namespaces/{namespace}/report_configs/list-reports-history",
				},
				{
					action: "create",
					resourceType: "list-reports-history-bot-defence",
					operationId:
						"ves.io.schema.report_config.CustomAPI.ListReportsHistoryBotDefence",
					summary: "List Reports History Bot Defence.",
					description:
						"List Reports history bot defence for the list of report configurations in the given namespace.",
					purpose: "Create new list-reports-history-bot-defence",
					path: "/api/report/namespaces/{namespace}/report_configs/list-reports-history-bot-defence",
				},
				{
					action: "create",
					resourceType: "list-reports-history-waap",
					operationId:
						"ves.io.schema.report_config.CustomAPI.ListReportsHistoryWaap",
					summary: "List Reports History Waap.",
					description:
						"List Reports history waap for the list of report configurations in the given namespace.",
					purpose: "Create new list-reports-history-waap",
					path: "/api/report/namespaces/{namespace}/report_configs/list-reports-history-waap",
				},
				{
					action: "get",
					resourceType: "report_config",
					operationId: "ves.io.schema.report_config.API.Get",
					summary: "GET Report Configuration.",
					description:
						"GET Report Configuration will read the configuration.",
					purpose: "Retrieve specific report-config",
					path: "/api/report/namespaces/{namespace}/report_configs/{name}",
				},
				{
					action: "delete",
					resourceType: "report_config",
					operationId: "ves.io.schema.report_config.API.Delete",
					summary: "DELETE Report Configuration.",
					description: "DELETE the specified report_config.",
					purpose: "Delete report-config",
					path: "/api/report/namespaces/{namespace}/report_configs/{name}",
				},
				{
					action: "create",
					resourceType: "generate",
					operationId:
						"ves.io.schema.report_config.CustomAPI.GenerateReport",
					summary: "Generate Report Now.",
					description: "Generate report now.",
					purpose: "Create new generate",
					path: "/api/report/namespaces/{namespace}/report_configs/{name}/generate",
				},
				{
					action: "create",
					resourceType: "all_ns_service",
					operationId:
						"ves.io.schema.graph.service.CustomAPI.QueryAllNamespaces",
					summary: "Service Graph Query All Namespaces.",
					description:
						"Request to GET monitoring data for a service mesh of a given application.",
					purpose: "Create new all-ns-service",
					path: "/api/data/namespaces/system/graph/all_ns_service",
				},
				{
					action: "create",
					resourceType: "dc_cluster_group",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.DCClusterTopology",
					summary: "DC Cluster Topology.",
					description: "GET topology of a DC Cluster.",
					purpose: "Create new dc-cluster-group",
					path: "/api/data/namespaces/system/topology/dc_cluster_group/{dc_cluster_group}",
				},
				{
					action: "list",
					resourceType: "dc_cluster_group",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.DCClusterGroupsSummary",
					summary: "DC Cluster Groups Summary.",
					description: "GET summary of all DC Cluster groups.",
					purpose: "List all dc-cluster-groups",
					path: "/api/data/namespaces/system/topology/dc_cluster_groups",
				},
				{
					action: "list",
					resourceType: "route_table",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.GetNetworkRouteTables",
					summary: "GET Network Route Tables.",
					description: "Gets Route Tables Associated with a Network.",
					purpose: "Retrieve specific route-table",
					path: "/api/data/namespaces/system/topology/network/{id}/route_tables",
				},
				{
					action: "get",
					resourceType: "route_table",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.GetRouteTable",
					summary: "GET Route Table.",
					description: "GET Route Table.",
					purpose: "Retrieve specific route-table",
					path: "/api/data/namespaces/system/topology/route_table/{name}",
				},
				{
					action: "create",
					resourceType: "site_mesh_group",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.SiteMeshTopology",
					summary: "Site Mesh Topology.",
					description: "GET topology of a site mesh.",
					purpose: "Create new site-mesh-group",
					path: "/api/data/namespaces/system/topology/site_mesh_group/{site_mesh_group}",
				},
				{
					action: "list",
					resourceType: "site_mesh_group",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.SiteMeshGroupsSummary",
					summary: "Site Mesh Groups Summary.",
					description: "GET summary of all site mesh groups.",
					purpose: "List all site-mesh-groups",
					path: "/api/data/namespaces/system/topology/site_mesh_groups",
				},
				{
					action: "list",
					resourceType: "route_table",
					operationId:
						"ves.io.schema.topology.CustomDataAPI.GetTGWRouteTables",
					summary: "GET TGW Route Tables.",
					description: "Gets Route Tables Associated with a TGW.",
					purpose: "Retrieve specific route-table",
					path: "/api/data/namespaces/system/topology/tgw/{id}/route_tables",
				},
				{
					action: "create",
					resourceType: "by_application",
					operationId:
						"ves.io.schema.graph.l3l4.CustomAPI.ByApplication",
					summary: "L3l4 Application traffic Query.",
					description:
						"Request to GET l3l4 Application traffic data.",
					purpose: "Create new by-application",
					path: "/api/infraprotect/namespaces/{namespace}/graph/l3l4/by_application/{network_id}",
				},
				{
					action: "create",
					resourceType: "by_mitigation",
					operationId:
						"ves.io.schema.graph.l3l4.CustomAPI.ByMitigation",
					summary: "L3l4 Mitigation Traffic Query.",
					description: "Request to GET l3l4 Mitigation Traffic data.",
					purpose: "Create new by-mitigation",
					path: "/api/infraprotect/namespaces/{namespace}/graph/l3l4/by_mitigation/{mitigation_id}",
				},
				{
					action: "create",
					resourceType: "by_network",
					operationId: "ves.io.schema.graph.l3l4.CustomAPI.ByNetwork",
					summary: "L3l4 Network Traffic Query.",
					description: "Request to GET l3l4 Network Traffic data.",
					purpose: "Create new by-network",
					path: "/api/infraprotect/namespaces/{namespace}/graph/l3l4/by_network/{network_id}",
				},
				{
					action: "create",
					resourceType: "by_zone",
					operationId: "ves.io.schema.graph.l3l4.CustomAPI.ByZone",
					summary: "L3l4 Zone Traffic Query.",
					description:
						"Request to GET l3l4 zone destination Traffic data.",
					purpose: "Create new by-zone",
					path: "/api/infraprotect/namespaces/{namespace}/graph/l3l4/by_zone/{network_id}",
				},
				{
					action: "create",
					resourceType: "event_count",
					operationId:
						"ves.io.schema.graph.l3l4.CustomAPI.EventCount",
					summary: "L3l4 Event count.",
					description:
						"Request to GET l3l4 Event counts over a period of time.",
					purpose: "Create new event-count",
					path: "/api/infraprotect/namespaces/{namespace}/graph/l3l4/event_count/{network_id}",
				},
				{
					action: "create",
					resourceType: "top_talker",
					operationId:
						"ves.io.schema.graph.l3l4.CustomAPI.TopTalkers",
					summary: "L3l4 Top talkers Query.",
					description:
						"Request to GET l3l4 Top talkers Traffic data.",
					purpose: "Create new top-talker",
					path: "/api/infraprotect/namespaces/{namespace}/graph/l3l4/top_talkers/{network_id}",
				},
			],
		},
	],
	[
		"support",
		{
			domain: "support",
			displayName: "Support",
			description:
				"Open new cases and assign severity ratings based on business impact. Append notes throughout resolution workflows. Mark items as closed or reinstate them if symptoms recur. Execute diagnostic packet captures on deployed sites for network troubleshooting. Handle tax exemption verification through certificate submission.",
			descriptionShort:
				"Open new cases and assign severity ratings based on busin...",
			resourceTypes: [
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
				"list-service",
				"list_tcpdump",
				"log",
				"ping",
				"priority",
				"reboot",
				"reopen",
				"resync_crl",
				"rule",
				"soft-restart",
				"start-debug-info-collection",
				"statu",
				"stop_tcpdump",
				"support_ticket",
				"tax_exempt_request",
				"tcpdump",
				"ticket_tracking_system",
				"validate_ticket_tracking_system",
			],
			operations: [
				{
					action: "create",
					resourceType: "resync_crl",
					operationId:
						"ves.io.schema.operate.crl.CustomPublicAPI.ResyncCRL",
					summary: "Resync CRL.",
					description:
						"Resync CRL by downloading from the server again.",
					purpose: "Create new resync-crl",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/resync_crl",
				},
				{
					action: "create",
					resourceType: "support_ticket",
					operationId:
						"ves.io.schema.customer_support.CustomAPI.ListCTSupportTickets",
					summary:
						"List of support tickets created for a child tenant.",
					description:
						"Return list of support tickets for a given child tenant Note: Direct API access is restricted. Client needs to use the /managed_tenant/<mt_identifier>/ prefix in the URL to GET the support ticket list for child tenant.",
					purpose: "Create new support-ticket",
					path: "/api/web/namespaces/system/child_tenant/support_tickets",
				},
				{
					action: "create",
					resourceType: "tax_exempt_request",
					operationId:
						"ves.io.schema.customer_support.CustomAPI.RaiseTaxExemptVerificationSupportTicket",
					summary: "Tax exemption verification request.",
					description:
						"Raises a tax exemption verification request. This will ultimately create a support ticket and assign it to our billing department. If verified and approved then the customer will not be levied sale taxes.",
					purpose: "Create new tax-exempt-request",
					path: "/api/web/namespaces/system/customer_support/tax_exempt_request",
				},
				{
					action: "create",
					resourceType: "customer_support",
					operationId: "ves.io.schema.customer_support.API.Create",
					summary: "Create Customer Support.",
					description:
						"Creates a new customer support ticket in our customer support provider system.",
					purpose: "Create new customer-support",
					path: "/api/web/namespaces/{metadata.namespace}/customer_supports",
				},
				{
					action: "list",
					resourceType: "customer_support",
					operationId:
						"ves.io.schema.customer_support.CustomAPI.AdminList",
					summary: "List all tenant tickets.",
					description:
						"Similar to the List rpc but returns all tenant tickets regardless of their author.",
					purpose: "List all customer-supports",
					path: "/api/web/namespaces/{namespace}/admin/customer_supports",
				},
				{
					action: "create",
					resourceType: "close",
					operationId:
						"ves.io.schema.customer_support.CustomAPI.Close",
					summary: "Close a customer support ticket.",
					description:
						"Closes selected customer support ticket (if not already closed). You can always attempt to reopen if needed to be.",
					purpose: "Create new close",
					path: "/api/web/namespaces/{namespace}/customer_support/{name}/close",
				},
				{
					action: "create",
					resourceType: "comment",
					operationId:
						"ves.io.schema.customer_support.CustomAPI.Comment",
					summary: "Add comment to a customer support ticket.",
					description:
						"Adds additional comment to a specified customer support ticket. The comment may include an attachment.",
					purpose: "Create new comment",
					path: "/api/web/namespaces/{namespace}/customer_support/{name}/comment",
				},
				{
					action: "create",
					resourceType: "escalate",
					operationId:
						"ves.io.schema.customer_support.CustomAPI.Escalate",
					summary: "Escalate a ticket.",
					description:
						"Escalates a selected ticket. Only certain customers (depending on their contract) are allowed to escalate tickets.",
					purpose: "Create new escalate",
					path: "/api/web/namespaces/{namespace}/customer_support/{name}/escalate",
				},
				{
					action: "create",
					resourceType: "priority",
					operationId:
						"ves.io.schema.customer_support.CustomAPI.Priority",
					summary: "Change priority of a ticket.",
					description:
						"Changes priority of a selected ticket. Not possible if ticket's already closed.",
					purpose: "Create new priority",
					path: "/api/web/namespaces/{namespace}/customer_support/{name}/priority",
				},
				{
					action: "create",
					resourceType: "reopen",
					operationId:
						"ves.io.schema.customer_support.CustomAPI.Reopen",
					summary: "Reopen a closed customer support ticket.",
					description:
						"Reopens a selected closed customer support ticket.",
					purpose: "Create new reopen",
					path: "/api/web/namespaces/{namespace}/customer_support/{name}/reopen",
				},
				{
					action: "list",
					resourceType: "customer_support",
					operationId: "ves.io.schema.customer_support.API.List",
					summary: "List Customer Support.",
					description:
						"List the set of customer_support in a namespace.",
					purpose: "List all customer-supports",
					path: "/api/web/namespaces/{namespace}/customer_supports",
				},
				{
					action: "get",
					resourceType: "customer_support",
					operationId: "ves.io.schema.customer_support.API.Get",
					summary: "GET Customer Support.",
					description:
						"Support ticket representation we display to customers. There's much more information associated with a ticker but this maybe sensitive/irrelevant.",
					purpose: "Retrieve specific customer-support",
					path: "/api/web/namespaces/{namespace}/customer_supports/{name}",
				},
				{
					action: "list",
					resourceType: "check-debug-info-collection",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.CheckDebugInfoCollection",
					summary: "Check Debug Info Collection.",
					description:
						"Check if the zip file of debug info from node is available.",
					purpose: "List all check-debug-info-collections",
					path: "/api/operate/namespaces/system/sites/{site}/vpm/debug/global/check-debug-info-collection",
				},
				{
					action: "list",
					resourceType: "diagnosi",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.DiagnosisPublic",
					summary: "Diagnosis",
					description: "GET VPM network information.",
					purpose: "List all diagnosis",
					path: "/api/operate/namespaces/system/sites/{site}/vpm/debug/global/diagnosis",
				},
				{
					action: "list",
					resourceType: "download-debug-info-collection",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.DownloadDebugInfoCollection",
					summary: "Download Debug Info Collection.",
					description:
						"Download the zip file of debug info from node if available.",
					purpose: "List all download-debug-info-collections",
					path: "/api/operate/namespaces/system/sites/{site}/vpm/debug/global/download-debug-info-collection",
				},
				{
					action: "list",
					resourceType: "health",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.HealthPublic",
					summary: "Health",
					description: "GET VPM health information.",
					purpose: "List all healths",
					path: "/api/operate/namespaces/system/sites/{site}/vpm/debug/global/health",
				},
				{
					action: "create",
					resourceType: "change-password",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.ChangePasswordPublic",
					summary: "ChangePassword.",
					description: "Change host user password.",
					purpose: "Create new change-password",
					path: "/api/operate/namespaces/system/sites/{site}/vpm/debug/{node}/change-password",
				},
				{
					action: "list",
					resourceType: "start-debug-info-collection",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.StartDebugInfoCollection",
					summary: "Start Debug Info Collection.",
					description:
						"Start collecting a zip file of debug info from node.",
					purpose: "List all start-debug-info-collections",
					path: "/api/operate/namespaces/system/sites/{site}/vpm/debug/{node}/start-debug-info-collection",
				},
				{
					action: "list",
					resourceType: "list-service",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.ListVolterraServices",
					summary: "List F5XC services.",
					description:
						"GET List of services managed by F5 Distributed Cloud.",
					purpose: "List all list-services",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/debug/global/list-service",
				},
				{
					action: "list",
					resourceType: "statu",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.Status",
					summary: "Status",
					description: "GET Status of F5XC components.",
					purpose: "List all status",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/debug/global/{vesnamespace}/status",
				},
				{
					action: "create",
					resourceType: "exec",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.Exec",
					summary: "Exec",
					description: "Run supported exec command on node.",
					purpose: "Create new exec",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/debug/{node}/exec",
				},
				{
					action: "list",
					resourceType: "exec-log",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.ExecLog",
					summary: "Exec Log",
					description: "Retrieve exec history on node.",
					purpose: "List all exec-logs",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/debug/{node}/exec-log",
				},
				{
					action: "create",
					resourceType: "exec-user",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.ExecUser",
					summary: "ExecUser",
					description:
						"Run supported exec command on node with lower privilege.",
					purpose: "Create new exec-user",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/debug/{node}/exec-user",
				},
				{
					action: "create",
					resourceType: "host-ping",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.HostPing",
					summary: "Host Ping",
					description: "Ping intiated from host kernel.",
					purpose: "Create new host-ping",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/debug/{node}/host-ping",
				},
				{
					action: "create",
					resourceType: "reboot",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.Reboot",
					summary: "Reboot node.",
					description: "Reboot specific node in site.",
					purpose: "Create new reboot",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/debug/{node}/reboot",
				},
				{
					action: "list",
					resourceType: "log",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.Log",
					summary: "Log",
					description:
						"GET logs for given service from the specific node.",
					purpose: "List all logs",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/debug/{node}/{service}/log",
				},
				{
					action: "create",
					resourceType: "soft-restart",
					operationId:
						"ves.io.schema.operate.debug.CustomPublicAPI.SoftRestart",
					summary: "Soft restart.",
					description:
						"Soft restart reloads VER instance on the node.",
					purpose: "Create new soft-restart",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/debug/{node}/{service}/soft-restart",
				},
				{
					action: "list",
					resourceType: "dhcp_lease",
					operationId:
						"ves.io.schema.operate.dhcp.CustomPublicAPI.ShowDhcpLeases",
					summary: "Show DHCP Leases.",
					description: "GET DHCP lease information.",
					purpose: "List all dhcp-leases",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/dhcp_leases",
				},
				{
					action: "list",
					resourceType: "config",
					operationId:
						"ves.io.schema.operate.lte.CustomPublicAPI.GetConfig",
					summary: "GET LTE configuration.",
					description: "GET LTE configuration from the node.",
					purpose: "List all configs",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/lte/{node}/config",
				},
				{
					action: "create",
					resourceType: "config",
					operationId:
						"ves.io.schema.operate.lte.CustomPublicAPI.UpdateConfig",
					summary: "Update LTE configuration.",
					description: "Update LTE configuration on the node.",
					purpose: "Create new config",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/lte/{node}/config",
				},
				{
					action: "create",
					resourceType: "disconnect",
					operationId:
						"ves.io.schema.operate.lte.CustomPublicAPI.Disconnect",
					summary: "Disconnect.",
					description: "Disconnect the node from LTE network.",
					purpose: "Create new disconnect",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/lte/{node}/disconnect",
				},
				{
					action: "list",
					resourceType: "info",
					operationId:
						"ves.io.schema.operate.lte.CustomPublicAPI.ShowInfo",
					summary: "Show LTE info.",
					description: "GET LTE runtime information.",
					purpose: "List all infos",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/lte/{node}/info",
				},
				{
					action: "create",
					resourceType: "ping",
					operationId:
						"ves.io.schema.operate.ping.CustomPublicAPI.Ping",
					summary: "Ping",
					description: "Run ping to a destination.",
					purpose: "Create new ping",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/ping",
				},
				{
					action: "create",
					resourceType: "fetchdump",
					operationId:
						"ves.io.schema.operate.tcpdump.CustomPublicAPI.FetchDump",
					summary: "FetchDump",
					description:
						"Fetch the captured pcap data from an earlier Tcpdump request.",
					purpose: "Create new fetchdump",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/fetchdump",
				},
				{
					action: "create",
					resourceType: "list_tcpdump",
					operationId:
						"ves.io.schema.operate.tcpdump.CustomPublicAPI.ListTcpdump",
					summary: "List Tcpdump.",
					description: "List tcpdump capture status on a ver node.",
					purpose: "Create new list-tcpdump",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/list_tcpdump",
				},
				{
					action: "create",
					resourceType: "stop_tcpdump",
					operationId:
						"ves.io.schema.operate.tcpdump.CustomPublicAPI.StopTcpdump",
					summary: "Stop Tcpdump.",
					description:
						"Stop tcpdump running on an interface in a ver node.",
					purpose: "Create new stop-tcpdump",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/stop_tcpdump",
				},
				{
					action: "create",
					resourceType: "tcpdump",
					operationId:
						"ves.io.schema.operate.tcpdump.CustomPublicAPI.Tcpdump",
					summary: "Tcpdump",
					description: "Run tcpdump on an interface in a ver node.",
					purpose: "Create new tcpdump",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/ver/tcpdump",
				},
				{
					action: "create",
					resourceType: "jira_projects_issue_type",
					operationId:
						"ves.io.schema.ticket_management.ticket_tracking_system.CustomAPI.JiraProjectsIssueTypes",
					summary: "JIRA Projects & Issue Types.",
					description:
						"Returns the available projects and issue types that are available from the Jira ticket tracking system.",
					purpose: "Create new jira-projects-issue-type",
					path: "/api/web/namespaces/shared/ticket_tracking_systems/jira_projects_issue_types",
				},
				{
					action: "create",
					resourceType: "validate_ticket_tracking_system",
					operationId:
						"ves.io.schema.ticket_management.ticket_tracking_system.CustomAPI.ValidateTicketTrackingSystem",
					summary: "Validate Ticket Tracking System.",
					description:
						"Validate input for the ticket tracking system like the credentials + organization.",
					purpose: "Create new validate-ticket-tracking-system",
					path: "/api/web/namespaces/shared/ticket_tracking_systems/validate_ticket_tracking_system",
				},
				{
					action: "create",
					resourceType: "ticket_tracking_system",
					operationId:
						"ves.io.schema.ticket_management.ticket_tracking_system.API.Create",
					summary: "Create Ticket Tracking System.",
					description: "Create Ticket Tracking System.",
					purpose: "Create new ticket-tracking-system",
					path: "/api/web/namespaces/{metadata.namespace}/ticket_tracking_systems",
				},
				{
					action: "replace",
					resourceType: "ticket_tracking_system",
					operationId:
						"ves.io.schema.ticket_management.ticket_tracking_system.API.Replace",
					summary: "Replace Ticket Tracking System.",
					description:
						"Replaces attributes of a Ticket Tracking System.",
					purpose: "Replace existing ticket-tracking-system",
					path: "/api/web/namespaces/{metadata.namespace}/ticket_tracking_systems/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "ticket_tracking_system",
					operationId:
						"ves.io.schema.ticket_management.ticket_tracking_system.API.List",
					summary: "List Ticket Tracking System.",
					description:
						"List the set of ticket_tracking_system in a namespace.",
					purpose: "List all ticket-tracking-systems",
					path: "/api/web/namespaces/{namespace}/ticket_tracking_systems",
				},
				{
					action: "get",
					resourceType: "ticket_tracking_system",
					operationId:
						"ves.io.schema.ticket_management.ticket_tracking_system.API.Get",
					summary: "GET Ticket Tracking System.",
					description: "GET attributes of a Ticket Tracking System.",
					purpose: "Retrieve specific ticket-tracking-system",
					path: "/api/web/namespaces/{namespace}/ticket_tracking_systems/{name}",
				},
				{
					action: "delete",
					resourceType: "ticket_tracking_system",
					operationId:
						"ves.io.schema.ticket_management.ticket_tracking_system.API.Delete",
					summary: "DELETE Ticket Tracking System.",
					description: "DELETE the specified ticket_tracking_system.",
					purpose: "Delete ticket-tracking-system",
					path: "/api/web/namespaces/{namespace}/ticket_tracking_systems/{name}",
				},
				{
					action: "list",
					resourceType: "config",
					operationId:
						"ves.io.schema.operate.usb.CustomPublicAPI.GetConfig",
					summary: "GET USB configuration.",
					description: "GET USB configuration from the node.",
					purpose: "List all configs",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/usb/{node}/config",
				},
				{
					action: "create",
					resourceType: "config",
					operationId:
						"ves.io.schema.operate.usb.CustomPublicAPI.UpdateConfig",
					summary: "Update USB configuration.",
					description: "Update USB configuration on the node.",
					purpose: "Create new config",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/usb/{node}/config",
				},
				{
					action: "list",
					resourceType: "list",
					operationId:
						"ves.io.schema.operate.usb.CustomPublicAPI.List",
					summary: "List USB devices.",
					description: "List connected USB devices.",
					purpose: "List all lists",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/usb/{node}/list",
				},
				{
					action: "list",
					resourceType: "rule",
					operationId:
						"ves.io.schema.operate.usb.CustomPublicAPI.ListRules",
					summary: "List USB Enablement Rules.",
					description: "List USB Enablement Rules.",
					purpose: "List all rules",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/usb/{node}/rules",
				},
				{
					action: "create",
					resourceType: "add",
					operationId:
						"ves.io.schema.operate.usb.CustomPublicAPI.AddRules",
					summary: "Add USB Enablement Rules.",
					description: "Add USB Enablement Rules.",
					purpose: "Create new add",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/usb/{node}/rules/add",
				},
				{
					action: "create",
					resourceType: "delete",
					operationId:
						"ves.io.schema.operate.usb.CustomPublicAPI.DeleteRules",
					summary: "DELETE USB Enablement Rules.",
					description: "DELETE USB Enablement Rules.",
					purpose: "Create new delete",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/usb/{node}/rules/delete",
				},
				{
					action: "list",
					resourceType: "config",
					operationId:
						"ves.io.schema.operate.wifi.CustomPublicAPI.GetConfig",
					summary: "GET WIFI configuration.",
					description: "GET WIFI configuration from the node.",
					purpose: "List all configs",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/wifi/{node}/config",
				},
				{
					action: "create",
					resourceType: "config",
					operationId:
						"ves.io.schema.operate.wifi.CustomPublicAPI.UpdateConfig",
					summary: "Update WIFI configuration.",
					description: "Update WIFI configuration on the node.",
					purpose: "Create new config",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/wifi/{node}/config",
				},
				{
					action: "create",
					resourceType: "disconnect",
					operationId:
						"ves.io.schema.operate.wifi.CustomPublicAPI.Disconnect",
					summary: "Disconnect.",
					description: "Disconnect the node from WIFI network.",
					purpose: "Create new disconnect",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/wifi/{node}/disconnect",
				},
				{
					action: "list",
					resourceType: "info",
					operationId:
						"ves.io.schema.operate.wifi.CustomPublicAPI.ShowInfo",
					summary: "Show WIFI info.",
					description: "GET WIFI runtime information.",
					purpose: "List all infos",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/wifi/{node}/info",
				},
				{
					action: "list",
					resourceType: "list",
					operationId:
						"ves.io.schema.operate.wifi.CustomPublicAPI.List",
					summary: "List WIFI networks.",
					description: "List available wifi networks.",
					purpose: "List all lists",
					path: "/api/operate/namespaces/{namespace}/sites/{site}/vpm/wifi/{node}/list",
				},
			],
		},
	],
	[
		"telemetry_and_insights",
		{
			domain: "telemetry_and_insights",
			displayName: "Telemetry And Insights",
			description:
				"F5 Distributed Cloud Telemetry And Insights API specifications",
			descriptionShort:
				"F5 Distributed Cloud Telemetry And Insights API specifica...",
			resourceTypes: [
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
				"health_statu",
				"instance",
				"lb_cache_content",
				"node",
				"service",
				"status_at_site",
				"subscribe",
				"subscription-statu",
				"suggest-value",
				"top_flow_anomaly",
				"top_talker",
				"unsubscribe",
			],
			operations: [
				{
					action: "create",
					resourceType: "connectivity",
					operationId:
						"ves.io.schema.graph.connectivity.CustomAPI.Query",
					summary: "Connectivity Graph Query.",
					description:
						"Request to GET Connectivity data between the sites.",
					purpose: "Create new connectivity",
					path: "/api/data/namespaces/{namespace}/graph/connectivity",
				},
				{
					action: "create",
					resourceType: "edge",
					operationId:
						"ves.io.schema.graph.connectivity.CustomAPI.EdgeQuery",
					summary: "Connectivity Edge Query.",
					description:
						"Request to GET Connectivity data for an edge. This query is used to GET time-series data for a given edge.",
					purpose: "Create new edge",
					path: "/api/data/namespaces/{namespace}/graph/connectivity/edge",
				},
				{
					action: "create",
					resourceType: "node",
					operationId:
						"ves.io.schema.graph.connectivity.CustomAPI.NodeQuery",
					summary: "Connectivity Node Query.",
					description:
						"Request to GET Connectivity data for a site. This query is used to GET time-series data for a given site.",
					purpose: "Create new node",
					path: "/api/data/namespaces/{namespace}/graph/connectivity/node",
				},
				{
					action: "list",
					resourceType: "discovered_service",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.ListDiscoveredServices",
					summary: "List discovered services of specific type.",
					description:
						"List the discovered services of specific type like virtual-servers, K8s, consul, NGINX server, etc.",
					purpose: "List all discovered-services",
					path: "/api/discovery/custom/namespaces/{namespace}/discovered_services",
				},
				{
					action: "list",
					resourceType: "discovered_service",
					operationId: "ves.io.schema.discovered_service.API.List",
					summary: "List Discovered Services.",
					description:
						"List the set of discovered_service in a namespace.",
					purpose: "List all discovered-services",
					path: "/api/discovery/namespaces/{namespace}/discovered_services",
				},
				{
					action: "get",
					resourceType: "discovered_service",
					operationId: "ves.io.schema.discovered_service.API.Get",
					summary: "GET Discovered Service Object.",
					description: "GET Discovered Service Object.",
					purpose: "Retrieve specific discovered-service",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}",
				},
				{
					action: "create",
					resourceType: "create_http_load_balancer",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.CreateHTTPLoadBalancer",
					summary: "Create HTTP/HTTPS load balancer.",
					description:
						"Create HTTP/HTTPS load balancer using the discovered virtual server as an origin server.",
					purpose: "Create new create-http-load-balancer",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}/create_http_load_balancer",
				},
				{
					action: "create",
					resourceType: "create_tcp_load_balancer",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.CreateTCPLoadBalancer",
					summary: "Create TCP load balancer.",
					description:
						"Create TCP load balancer using the discovered virtual server as an origin server.",
					purpose: "Create new create-tcp-load-balancer",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}/create_tcp_load_balancer",
				},
				{
					action: "create",
					resourceType: "disable_visibility",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.DisableVisibility",
					summary: "Disable visibility in all workspaces.",
					description:
						"Disable Visibility of the service in all workspaces. This will remove the discovered service from being visible in other wokspaces like WAAP.",
					purpose: "Create new disable-visibility",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}/disable_visibility",
				},
				{
					action: "create",
					resourceType: "enable_visibility",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.EnableVisibility",
					summary: "Enable visibility in all workspaces.",
					description:
						"Enable Visibility of the service in all workspaces. This action will make the discovered service visible within WAAP, App Connect where the user can perform the workspace specific actions.",
					purpose: "Create new enable-visibility",
					path: "/api/discovery/namespaces/{namespace}/discovered_services/{name}/enable_visibility",
				},
				{
					action: "get",
					resourceType: "health_statu",
					operationId:
						"ves.io.schema.discovered_service.CustomDataAPI.DiscoveredServiceHealthStatus",
					summary: "Discovered Service Health Status.",
					description: "GET Discovered Service Health status.",
					purpose: "Retrieve specific health-statu",
					path: "/api/data/namespaces/{namespace}/discovered_services/{name}/health_status",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.discovered_service.CustomAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"SuggestValues returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/discovery/namespaces/{namespace}/suggest-values",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.flow.CustomFlowConnectionAPI.Subscribe",
					summary: "Subscribe to Flow Collection.",
					description: "Subscribe to Flow Collection.",
					purpose: "Create new subscribe",
					path: "/api/config/namespaces/system/flow-collection/addon/subscribe",
				},
				{
					action: "list",
					resourceType: "subscription-statu",
					operationId:
						"ves.io.schema.flow.CustomFlowConnectionAPI.GetSubscriptionStatus",
					summary: "Check subscription status for Flow Collection.",
					description:
						"Check subscription status flow Flow Collection.",
					purpose: "List all subscription-status",
					path: "/api/config/namespaces/system/flow-collection/addon/subscription-status",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.flow.CustomFlowConnectionAPI.Unsubscribe",
					summary: "Unsubscribe to Flow Collection.",
					description: "Unsubscribe to Flow Collection.",
					purpose: "Create new unsubscribe",
					path: "/api/config/namespaces/system/flow-collection/addon/unsubscribe",
				},
				{
					action: "create",
					resourceType: "flow_collection",
					operationId: "ves.io.schema.flow.CustomAPI.FlowCollection",
					summary: "Flow Collection.",
					description:
						"Request to GET flow collection from the flow records.",
					purpose: "Create new flow-collection",
					path: "/api/data/namespaces/system/flows/flow_collection",
				},
				{
					action: "create",
					resourceType: "top_flow_anomaly",
					operationId:
						"ves.io.schema.flow.CustomAPI.TopFlowAnomalies",
					summary: "Flow Anomaly detection.",
					description: "Request to GET flow anomaly records.",
					purpose: "Create new top-flow-anomalie",
					path: "/api/data/namespaces/system/flows/top_flow_anomalies",
				},
				{
					action: "create",
					resourceType: "top_talker",
					operationId: "ves.io.schema.flow.CustomAPI.TopTalkers",
					summary: "Top Talkers.",
					description:
						"Request to GET top talkers from the flow records.",
					purpose: "Create new top-talker",
					path: "/api/data/namespaces/system/flows/top_talkers",
				},
				{
					action: "create",
					resourceType: "all_ns_service",
					operationId:
						"ves.io.schema.graph.service.CustomAPI.QueryAllNamespaces",
					summary: "Service Graph Query All Namespaces.",
					description:
						"Request to GET monitoring data for a service mesh of a given application.",
					purpose: "Create new all-ns-service",
					path: "/api/data/namespaces/system/graph/all_ns_service",
				},
				{
					action: "create",
					resourceType: "lb_cache_content",
					operationId:
						"ves.io.schema.graph.service.CustomAPI.LBCacheContent",
					summary: "Cacheability query Query.",
					description:
						"Request to GET time-series cacheable data for HTTP-LBs.",
					purpose: "Create new lb-cache-content",
					path: "/api/data/namespaces/{namespace}/graph/lb_cache_content",
				},
				{
					action: "create",
					resourceType: "service",
					operationId: "ves.io.schema.graph.service.CustomAPI.Query",
					summary: "Service Graph Query.",
					description:
						"Request to GET monitoring data for a service mesh of a given application.",
					purpose: "Create new service",
					path: "/api/data/namespaces/{namespace}/graph/service",
				},
				{
					action: "list",
					resourceType: "app_type",
					operationId:
						"ves.io.schema.graph.service.CustomAPI.AppTypeList",
					summary: "Application Types.",
					description:
						"Request to GET list of application types for a given namespace. For system namespace, all the application types for the tenant will be returned in the response.",
					purpose: "List all app-types",
					path: "/api/data/namespaces/{namespace}/graph/service/app_types",
				},
				{
					action: "create",
					resourceType: "edge",
					operationId:
						"ves.io.schema.graph.service.CustomAPI.EdgeQuery",
					summary: "Service Edge Query.",
					description:
						"Request to GET time-series data for an edge in the service mesh graph.",
					purpose: "Create new edge",
					path: "/api/data/namespaces/{namespace}/graph/service/edge",
				},
				{
					action: "create",
					resourceType: "node",
					operationId:
						"ves.io.schema.graph.service.CustomAPI.NodeQuery",
					summary: "Service Node Query.",
					description:
						"Request to GET time-series data for a node in the service mesh graph.",
					purpose: "Create new node",
					path: "/api/data/namespaces/{namespace}/graph/service/node",
				},
				{
					action: "create",
					resourceType: "instance",
					operationId:
						"ves.io.schema.graph.service.CustomAPI.InstanceQuery",
					summary: "Service Instance Query.",
					description:
						"Request to GET time-series data for a service instance.",
					purpose: "Create new instance",
					path: "/api/data/namespaces/{namespace}/graph/service/node/instance",
				},
				{
					action: "create",
					resourceType: "instance",
					operationId:
						"ves.io.schema.graph.service.CustomAPI.InstancesQuery",
					summary: "Service Instances Query.",
					description:
						"Request to GET monitoring data for all instances of a service in the service mesh.",
					purpose: "Create new instance",
					path: "/api/data/namespaces/{namespace}/graph/service/node/instances",
				},
				{
					action: "get",
					resourceType: "status_at_site",
					operationId:
						"ves.io.schema.status_at_site.CustomAPI.GetStatus",
					summary: "GET Status.",
					description: "GET status of an object in a given site.",
					purpose: "Retrieve specific status-at-site",
					path: "/api/data/namespaces/{namespace}/{kind}/{name}/status_at_site",
				},
			],
		},
	],
	[
		"tenant_and_identity",
		{
			domain: "tenant_and_identity",
			displayName: "Tenant And Identity",
			description:
				"Set up granular alert routing for administrative and combined channels with personalized delivery options. Control active login sessions and enforce one-time password resets for security compliance. Define display layouts and avatar images for customized user experiences. Process onboarding access submissions and toggle account management features. Coordinate support ticket attachments and client relationship interactions across managed tenant hierarchies.",
			descriptionShort:
				"Set up granular alert routing for administrative and comb...",
			resourceTypes: [
				"Group",
				"ResourceType",
				"Schema",
				"ServiceProviderConfig",
				"User",
				"accept_to",
				"access",
				"active_alert_policy",
				"active_network_policy",
				"active_service_policy",
				"admin_notification",
				"admin_reset",
				"all_application_inventory",
				"all_application_inventory_waf_filter",
				"all_ns_stat",
				"allowed_tenant",
				"analyze_for_deletion",
				"application_inventory",
				"assign",
				"assign_namespace_role",
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
				"password_policy",
				"priority",
				"rbac_policy",
				"remove_namespace_role",
				"reopen",
				"request-delete",
				"request_initial_access",
				"reset",
				"role",
				"role_user",
				"scim",
				"send_password_email",
				"session",
				"setting",
				"signup",
				"stat",
				"state",
				"subscribe",
				"suggest-value",
				"summary",
				"support-info",
				"sync",
				"tenant-escalation-doc",
				"tenant_configuration",
				"tenant_profile",
				"to",
				"unassign",
				"unset",
				"unsubscribe",
				"update_allow_advertise_on_public",
				"user_group",
				"user_identification",
				"user_role",
				"user_token",
				"validate_contact",
				"validate_registration",
				"validate_rule",
				"view_preference",
				"whoami",
			],
			operations: [
				{
					action: "list",
					resourceType: "access",
					operationId:
						"ves.io.schema.tenant_management.allowed_tenant.CustomAPI.GetSupportTenantAccess",
					summary: "GET Support Tenant Access.",
					description:
						"GET current access details for the support tenant.",
					purpose: "List all access",
					path: "/api/web/namespaces/system/allowed_tenants/support-tenant/access",
				},
				{
					action: "create",
					resourceType: "access",
					operationId:
						"ves.io.schema.tenant_management.allowed_tenant.CustomAPI.UpdateSupportTenantAccess",
					summary: "Update Support Tenant Access.",
					description:
						"This RPC can be used to manage user access for all flavors of support tenants currently supported by the platform. Use read-only, read-write with specific namespaces or admin can specify custom groups to control access by the support tenant user. Name is well-known identifier for a specific support related tenant.",
					purpose: "Create new acces",
					path: "/api/web/namespaces/system/allowed_tenants/support-tenant/access",
				},
				{
					action: "create",
					resourceType: "allowed_tenant",
					operationId:
						"ves.io.schema.tenant_management.allowed_tenant.API.Create",
					summary: "Create Allowed Tenant.",
					description:
						"Creates a allowed_tenant config instance. Name of the object is name of the tenant that is allowed to manage.",
					purpose: "Create new allowed-tenant",
					path: "/api/web/namespaces/{metadata.namespace}/allowed_tenants",
				},
				{
					action: "replace",
					resourceType: "allowed_tenant",
					operationId:
						"ves.io.schema.tenant_management.allowed_tenant.API.Replace",
					summary: "Replace Allowed Tenant.",
					description:
						"Replaces attributes of a allowed_tenant instance including its metadata like labels, description etc.",
					purpose: "Replace existing allowed-tenant",
					path: "/api/web/namespaces/{metadata.namespace}/allowed_tenants/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "allowed_tenant",
					operationId:
						"ves.io.schema.tenant_management.allowed_tenant.API.List",
					summary: "List Allowed Tenant.",
					description:
						"List the set of allowed_tenant in a namespace.",
					purpose: "List all allowed-tenants",
					path: "/api/web/namespaces/{namespace}/allowed_tenants",
				},
				{
					action: "get",
					resourceType: "allowed_tenant",
					operationId:
						"ves.io.schema.tenant_management.allowed_tenant.API.Get",
					summary: "GET Allowed Tenant.",
					description:
						"GET allowed_tenant reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific allowed-tenant",
					path: "/api/web/namespaces/{namespace}/allowed_tenants/{name}",
				},
				{
					action: "delete",
					resourceType: "allowed_tenant",
					operationId:
						"ves.io.schema.tenant_management.allowed_tenant.API.Delete",
					summary: "DELETE Allowed Tenant.",
					description: "DELETE the specified allowed_tenant.",
					purpose: "Delete allowed-tenant",
					path: "/api/web/namespaces/{namespace}/allowed_tenants/{name}",
				},
				{
					action: "create",
					resourceType: "authentication",
					operationId: "ves.io.schema.authentication.API.Create",
					summary: "Create Authentication.",
					description: "Create authentication.",
					purpose: "Create new authentication",
					path: "/api/config/namespaces/{metadata.namespace}/authentications",
				},
				{
					action: "replace",
					resourceType: "authentication",
					operationId: "ves.io.schema.authentication.API.Replace",
					summary: "Replace Authentication.",
					description: "Replace authentication.",
					purpose: "Replace existing authentication",
					path: "/api/config/namespaces/{metadata.namespace}/authentications/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "authentication",
					operationId: "ves.io.schema.authentication.API.List",
					summary: "List Authentication.",
					description:
						"List the set of authentication in a namespace.",
					purpose: "List all authentications",
					path: "/api/config/namespaces/{namespace}/authentications",
				},
				{
					action: "get",
					resourceType: "authentication",
					operationId: "ves.io.schema.authentication.API.Get",
					summary: "GET Authentication.",
					description: "Get authentication.",
					purpose: "Retrieve specific authentication",
					path: "/api/config/namespaces/{namespace}/authentications/{name}",
				},
				{
					action: "delete",
					resourceType: "authentication",
					operationId: "ves.io.schema.authentication.API.Delete",
					summary: "DELETE Authentication.",
					description: "DELETE the specified authentication.",
					purpose: "Delete authentication",
					path: "/api/config/namespaces/{namespace}/authentications/{name}",
				},
				{
					action: "list",
					resourceType: "child_tenant",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomAPI.ListChildTenants",
					summary: "List of Child Tenants.",
					description:
						"GET list of child tenants user has access to based on assigned membership. This is an optimized list generated based on the requesting user's current group assignments that will allow access to child tenant.",
					purpose: "List all child-tenants",
					path: "/api/web/namespaces/system/partner-management/child_tenants",
				},
				{
					action: "create",
					resourceType: "migrate",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomAPI.MigrateChildTenants",
					summary: "Migrate Child Tenants.",
					description:
						"Migrate ACTIVE child tenants from existing CTM(s) to a specified new CTM.",
					purpose: "Create new migrate",
					path: "/api/web/namespaces/system/partner-management/child_tenants/migrate",
				},
				{
					action: "list",
					resourceType: "customer_support",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomerSupportCustomAPI.ListChildTenantSupportTickets",
					summary:
						"List all support tickets created in child tenant.",
					description:
						"Return list of all support tickets for a child tenant.",
					purpose: "List all customer-supports",
					path: "/api/web/namespaces/system/partner-management/customer_supports",
				},
				{
					action: "create",
					resourceType: "customer_support",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomerSupportCustomAPI.Create",
					summary: "Create customer support ticket in child tenant.",
					description:
						"Creates a new customer support ticket in our customer support provider system.",
					purpose: "Create new customer-support",
					path: "/api/web/namespaces/system/partner-management/customer_supports",
				},
				{
					action: "list",
					resourceType: "customer_support",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomerSupportCustomAPI.Get",
					summary: "GET customer support ticket in child tenant.",
					description:
						"Support ticket representation we display to customers. There's much more information associated with a ticker but this maybe sensitive/irrelevant.",
					purpose: "List all customer-supports",
					path: "/api/web/namespaces/system/partner-management/customer_supports/{tp_id}",
				},
				{
					action: "create",
					resourceType: "close",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomerSupportCustomAPI.Close",
					summary: "Close a customer support ticket in child tenant.",
					description:
						"Closes selected customer support ticket (if not already closed). You can always attempt to reopen if needed to be.",
					purpose: "Create new close",
					path: "/api/web/namespaces/system/partner-management/customer_supports/{tp_id}/close",
				},
				{
					action: "create",
					resourceType: "comment",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomerSupportCustomAPI.Comment",
					summary:
						"Add comment to a customer support ticket in child tenant.",
					description:
						"Adds additional comment to a specified customer support ticket. The comment may include an attachment.",
					purpose: "Create new comment",
					path: "/api/web/namespaces/system/partner-management/customer_supports/{tp_id}/comment",
				},
				{
					action: "create",
					resourceType: "escalate",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomerSupportCustomAPI.Escalate",
					summary: "Escalate a ticket in child tenant.",
					description:
						"Escalates a selected ticket. Only certain customers (depending on their contract) are allowed to escalate tickets.",
					purpose: "Create new escalate",
					path: "/api/web/namespaces/system/partner-management/customer_supports/{tp_id}/escalate",
				},
				{
					action: "create",
					resourceType: "priority",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomerSupportCustomAPI.Priority",
					summary: "Change priority of a ticket in child tenant.",
					description:
						"Changes priority of a selected ticket. Not possible if ticket's already closed.",
					purpose: "Create new priority",
					path: "/api/web/namespaces/system/partner-management/customer_supports/{tp_id}/priority",
				},
				{
					action: "create",
					resourceType: "reopen",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.CustomerSupportCustomAPI.Reopen",
					summary:
						"Reopen a closed customer support ticket in child tenant.",
					description:
						"Reopens a selected closed customer support ticket.",
					purpose: "Create new reopen",
					path: "/api/web/namespaces/system/partner-management/customer_supports/{tp_id}/reopen",
				},
				{
					action: "create",
					resourceType: "child_tenant",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.API.Create",
					summary: "Child Tenant.",
					description:
						"Creates a child_tenant config instance. Name of the object is the name of the child tenant to be created.",
					purpose: "Create new child-tenant",
					path: "/api/web/namespaces/{metadata.namespace}/child_tenants",
				},
				{
					action: "replace",
					resourceType: "child_tenant",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.API.Replace",
					summary: "Replace Child Tenant.",
					description:
						"Replaces attributes of a child_tenant configuration.",
					purpose: "Replace existing child-tenant",
					path: "/api/web/namespaces/{metadata.namespace}/child_tenants/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "child_tenant",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.API.List",
					summary: "List Child Tenant.",
					description: "List the set of child_tenant in a namespace.",
					purpose: "List all child-tenants",
					path: "/api/web/namespaces/{namespace}/child_tenants",
				},
				{
					action: "get",
					resourceType: "child_tenant",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.API.Get",
					summary: "GET Child Tenant.",
					description:
						"GET child_tenant reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific child-tenant",
					path: "/api/web/namespaces/{namespace}/child_tenants/{name}",
				},
				{
					action: "delete",
					resourceType: "child_tenant",
					operationId:
						"ves.io.schema.tenant_management.child_tenant.API.Delete",
					summary: "DELETE Child Tenant.",
					description: "DELETE the specified child_tenant.",
					purpose: "Delete child-tenant",
					path: "/api/web/namespaces/{namespace}/child_tenants/{name}",
				},
				{
					action: "get",
					resourceType: "child_tenant",
					operationId:
						"ves.io.schema.tenant_management.child_tenant_manager.CustomAPI.ListChildTenants",
					summary:
						"List child tenants for a given child tenant manager.",
					description:
						"GET list of child tenants managed by a child tenant manager.",
					purpose: "Retrieve specific child-tenant",
					path: "/api/web/namespaces/system/partner-management/child_tenant_managers/{name}/child_tenants",
				},
				{
					action: "create",
					resourceType: "migrate",
					operationId:
						"ves.io.schema.tenant_management.child_tenant_manager.CustomAPI.MigrateCTMChildTenants",
					summary: "Migrate CTM child tenants.",
					description:
						"Migrate ACTIVE child tenants from existing CTM to a specified new CTM.",
					purpose: "Create new migrate",
					path: "/api/web/namespaces/system/partner-management/child_tenant_managers/{name}/child_tenants/migrate",
				},
				{
					action: "create",
					resourceType: "child_tenant_manager",
					operationId:
						"ves.io.schema.tenant_management.child_tenant_manager.API.Create",
					summary: "Child Tenant Manager.",
					description:
						"Creates a child_tenant_manager config instance. Name of the object is the name of the child tenant manager to be created.",
					purpose: "Create new child-tenant-manager",
					path: "/api/web/namespaces/{metadata.namespace}/child_tenant_managers",
				},
				{
					action: "replace",
					resourceType: "child_tenant_manager",
					operationId:
						"ves.io.schema.tenant_management.child_tenant_manager.API.Replace",
					summary: "Replace Child Tenant Manager.",
					description:
						"Replaces attributes of a child_tenant_manager configuration.",
					purpose: "Replace existing child-tenant-manager",
					path: "/api/web/namespaces/{metadata.namespace}/child_tenant_managers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "child_tenant_manager",
					operationId:
						"ves.io.schema.tenant_management.child_tenant_manager.API.List",
					summary: "List Child Tenant Manager.",
					description:
						"List the set of child_tenant_manager in a namespace.",
					purpose: "List all child-tenant-managers",
					path: "/api/web/namespaces/{namespace}/child_tenant_managers",
				},
				{
					action: "get",
					resourceType: "child_tenant_manager",
					operationId:
						"ves.io.schema.tenant_management.child_tenant_manager.API.Get",
					summary: "GET Child Tenant Manager.",
					description:
						"GET child_tenant_manager reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific child-tenant-manager",
					path: "/api/web/namespaces/{namespace}/child_tenant_managers/{name}",
				},
				{
					action: "delete",
					resourceType: "child_tenant_manager",
					operationId:
						"ves.io.schema.tenant_management.child_tenant_manager.API.Delete",
					summary: "DELETE Child Tenant Manager.",
					description: "DELETE the specified child_tenant_manager.",
					purpose: "Delete child-tenant-manager",
					path: "/api/web/namespaces/{namespace}/child_tenant_managers/{name}",
				},
				{
					action: "create",
					resourceType: "contact",
					operationId: "ves.io.schema.contact.API.Create",
					summary: "Create Contact.",
					description:
						"Creates a new customer's contact detail record with us, including address and phone number.",
					purpose: "Create new contact",
					path: "/api/web/namespaces/{metadata.namespace}/contacts",
				},
				{
					action: "replace",
					resourceType: "contact",
					operationId: "ves.io.schema.contact.API.Replace",
					summary: "Replace Contact.",
					description:
						"Updates existing customer's contact details, including address and phone number.",
					purpose: "Replace existing contact",
					path: "/api/web/namespaces/{metadata.namespace}/contacts/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "contact",
					operationId: "ves.io.schema.contact.API.List",
					summary: "List Contact.",
					description: "List the set of contact in a namespace.",
					purpose: "List all contacts",
					path: "/api/web/namespaces/{namespace}/contacts",
				},
				{
					action: "get",
					resourceType: "contact",
					operationId: "ves.io.schema.contact.API.Get",
					summary: "GET Contact.",
					description:
						"Retrieves existing customer's contact details, including address and phone number.",
					purpose: "Retrieve specific contact",
					path: "/api/web/namespaces/{namespace}/contacts/{name}",
				},
				{
					action: "delete",
					resourceType: "contact",
					operationId: "ves.io.schema.contact.API.Delete",
					summary: "DELETE Contact.",
					description: "DELETE the specified contact.",
					purpose: "Delete contact",
					path: "/api/web/namespaces/{namespace}/contacts/{name}",
				},
				{
					action: "list",
					resourceType: "customer_support",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomerSupportCustomAPI.List",
					summary: "List tickets of managed tenant.",
					description:
						"Returns list of customer support tickets of managed tenant.",
					purpose: "List all customer-supports",
					path: "/api/web/namespaces/system/managed_client/customer_supports",
				},
				{
					action: "create",
					resourceType: "customer_support",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomerSupportCustomAPI.Create",
					summary:
						"Create customer support ticket in managed tenant.",
					description:
						"Creates a new customer support ticket in our customer support provider system.",
					purpose: "Create new customer-support",
					path: "/api/web/namespaces/system/managed_client/customer_supports",
				},
				{
					action: "list",
					resourceType: "customer_support",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomerSupportCustomAPI.Get",
					summary: "GET customer support ticket in managed tenant.",
					description:
						"Support ticket representation we display to customers. There's much more information associated with a ticker but this maybe sensitive/irrelevant.",
					purpose: "List all customer-supports",
					path: "/api/web/namespaces/system/managed_client/customer_supports/{tp_id}",
				},
				{
					action: "create",
					resourceType: "close",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomerSupportCustomAPI.Close",
					summary:
						"Close a customer support ticket in managed tenant.",
					description:
						"Closes selected customer support ticket (if not already closed). You can always attempt to reopen if needed to be.",
					purpose: "Create new close",
					path: "/api/web/namespaces/system/managed_client/customer_supports/{tp_id}/close",
				},
				{
					action: "create",
					resourceType: "comment",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomerSupportCustomAPI.Comment",
					summary:
						"Add comment to a customer support ticket in managed tenant.",
					description:
						"Adds additional comment to a specified customer support ticket. The comment may include an attachment.",
					purpose: "Create new comment",
					path: "/api/web/namespaces/system/managed_client/customer_supports/{tp_id}/comment",
				},
				{
					action: "create",
					resourceType: "escalate",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomerSupportCustomAPI.Escalate",
					summary: "Escalate a ticket in managed tenant.",
					description:
						"Escalates a selected ticket. Only certain customers (depending on their contract) are allowed to escalate tickets.",
					purpose: "Create new escalate",
					path: "/api/web/namespaces/system/managed_client/customer_supports/{tp_id}/escalate",
				},
				{
					action: "create",
					resourceType: "priority",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomerSupportCustomAPI.Priority",
					summary: "Priority of a ticket in managed tenant.",
					description:
						"Priority of a selected ticket. Not possible if ticket's already closed.",
					purpose: "Create new priority",
					path: "/api/web/namespaces/system/managed_client/customer_supports/{tp_id}/priority",
				},
				{
					action: "create",
					resourceType: "reopen",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomerSupportCustomAPI.Reopen",
					summary:
						"Reopen a closed customer support ticket in managed tenant.",
					description:
						"Reopens a selected closed customer support ticket.",
					purpose: "Create new reopen",
					path: "/api/web/namespaces/system/managed_client/customer_supports/{tp_id}/reopen",
				},
				{
					action: "list",
					resourceType: "managed_tenants_by_user",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomAPI.GetManagedTenantListByUser",
					summary: "GET List of Managed Tenant By User.",
					description:
						"GET list of managed tenants that user have access to based on assigned membership. This is an optimized list generated based on the requesting user's current group assignments that will allow access to managed tenant.",
					purpose: "List all managed-tenants-by-users",
					path: "/api/web/namespaces/system/managed_tenants_by_user",
				},
				{
					action: "list",
					resourceType: "managed_tenants_list",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomAPI.GetManagedTenantList",
					summary: "GET List of Managed Tenant.",
					description:
						"GET full list of managed tenants access details. This response will contain full list of managed tenant based on the configuration and is not filtered by requesting user's group membership that enable access.",
					purpose: "List all managed-tenants-lists",
					path: "/api/web/namespaces/system/managed_tenants_list",
				},
				{
					action: "list",
					resourceType: "managed_tenant",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.CustomAPI.ListSupportTenantMT",
					summary:
						"List of Managed Tenant By User For Support Operations.",
					description:
						"GET list of managed tenants that user have access to based on assingned membership. This is an optimized list generated based on the requesting user's current group assignments that will allow access to managed tenant.",
					purpose: "List all managed-tenants",
					path: "/api/web/namespaces/system/support-tenant/managed_tenants",
				},
				{
					action: "create",
					resourceType: "managed_tenant",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.API.Create",
					summary: "Create Managed Tenant.",
					description:
						"Creates a managed_tenant config instance. Name of the object is name of the tenant that is allowed to manage.",
					purpose: "Create new managed-tenant",
					path: "/api/web/namespaces/{metadata.namespace}/managed_tenants",
				},
				{
					action: "replace",
					resourceType: "managed_tenant",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.API.Replace",
					summary: "Replace Managed Tenant.",
					description:
						"Replaces attributes of a managed_tenant configuration. Update of existing tenant_choice selection is not supported but user may update existing group assignments.",
					purpose: "Replace existing managed-tenant",
					path: "/api/web/namespaces/{metadata.namespace}/managed_tenants/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "managed_tenant",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.API.List",
					summary: "List Managed Tenant.",
					description:
						"List the set of managed_tenant in a namespace.",
					purpose: "List all managed-tenants",
					path: "/api/web/namespaces/{namespace}/managed_tenants",
				},
				{
					action: "get",
					resourceType: "managed_tenant",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.API.Get",
					summary: "GET Managed Tenant.",
					description:
						"GET managed_tenant reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific managed-tenant",
					path: "/api/web/namespaces/{namespace}/managed_tenants/{name}",
				},
				{
					action: "delete",
					resourceType: "managed_tenant",
					operationId:
						"ves.io.schema.tenant_management.managed_tenant.API.Delete",
					summary: "DELETE Managed Tenant.",
					description: "DELETE the specified managed_tenant.",
					purpose: "Delete managed-tenant",
					path: "/api/web/namespaces/{namespace}/managed_tenants/{name}",
				},
				{
					action: "list",
					resourceType: "namespace",
					operationId: "ves.io.schema.namespace.API.List",
					summary: "List Namespace.",
					description: "List the set of namespace in a namespace.",
					purpose: "List all namespaces",
					path: "/api/web/namespaces",
				},
				{
					action: "create",
					resourceType: "namespace",
					operationId: "ves.io.schema.namespace.API.Create",
					summary: "Create Namespace.",
					description:
						"Creates a new namespace. Name of the object is name of the name space.",
					purpose: "Create new namespace",
					path: "/api/web/namespaces",
				},
				{
					action: "create",
					resourceType: "all_application_inventory",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.AllApplicationInventory",
					summary: "All Application Objects Inventory.",
					description:
						"AllApplicationInventory returns inventory of configured application related objects for all namespaces.",
					purpose: "Create new all-application-inventory",
					path: "/api/config/namespaces/system/all_application_inventory",
				},
				{
					action: "create",
					resourceType: "all_application_inventory_waf_filter",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.AllApplicationInventoryWaf",
					summary:
						"All Application Objects Inventory with WAF Filters.",
					description:
						"AllApplicationInventoryWaf returns inventory of configured application related objects for all namespaces with WAF Filters.",
					purpose: "Create new all-application-inventory-waf-filter",
					path: "/api/config/namespaces/system/all_application_inventory_waf_filters",
				},
				{
					action: "create",
					resourceType: "all_ns_stat",
					operationId:
						"ves.io.schema.namespace.NamespaceMLCustomAPI.GetApiEndpointsStatsAllNamespaces",
					summary: "GET API Endpoints Stats for All Namespaces.",
					description:
						"GET API endpoints stats for all Namespaces. This API is specific to system namespace.",
					purpose: "Create new all-ns-stat",
					path: "/api/ml/data/namespaces/system/api_endpoints/all_ns_stats",
				},
				{
					action: "create",
					resourceType: "evaluate-api-access",
					operationId:
						"ves.io.schema.namespace.CustomAPI.EvaluateAPIAccess",
					summary: "Evaluate API Access.",
					description:
						"EvaluateAPIAccess can evaluate multiple lists of API URL, method under a namespace for a given user of a tenant.",
					purpose: "Create new evaluate-api-acces",
					path: "/api/web/namespaces/system/evaluate-api-access",
				},
				{
					action: "create",
					resourceType: "evaluate-batch-api-access",
					operationId:
						"ves.io.schema.namespace.CustomAPI.EvaluateBatchAPIAccess",
					summary: "Evaluate Batch API Access.",
					description:
						"EvaluateBatchAPIAccess can evaluate multiple lists of API URL, method under a batch of namespaces for a given user of a tenant.",
					purpose: "Create new evaluate-batch-api-acces",
					path: "/api/web/namespaces/system/evaluate-batch-api-access",
				},
				{
					action: "create",
					resourceType: "lookup-user-role",
					operationId:
						"ves.io.schema.namespace.CustomAPI.LookupUserRoles",
					summary: "Lookup User Roles.",
					description:
						"LookupUserRoles returns roles for the the given user, namespace.",
					purpose: "Create new lookup-user-role",
					path: "/api/web/namespaces/system/lookup-user-roles",
				},
				{
					action: "create",
					resourceType: "networking_inventory",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.NetworkingInventory",
					summary: "Networking Objects Inventory.",
					description:
						"NetworkingInventory returns inventory of configured networking related objects for the tenant. Inventory of system-wide objects (global networks, sites, site mesh groups, etc) is returned.",
					purpose: "Create new networking-inventory",
					path: "/api/config/namespaces/system/networking_inventory",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.namespace.NamespaceCloudDataCustomAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"Returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/cloud-data/namespaces/system/suggest-values",
				},
				{
					action: "create",
					resourceType: "update_allow_advertise_on_public",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.UpdateAllowAdvertiseOnPublic",
					summary: "Update allow advertise on public.",
					description:
						"UpdateAllowAdvertiseOnPublic can update a config to allow advertise on public.",
					purpose: "Create new update-allow-advertise-on-public",
					path: "/api/config/namespaces/system/update_allow_advertise_on_public",
				},
				{
					action: "create",
					resourceType: "validate_rule",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.ValidateRules",
					summary: "Validate Rules.",
					description:
						"ValidateRules returns whether the value is valid or not for the specified validator rules.",
					purpose: "Create new validate-rule",
					path: "/api/config/namespaces/system/validate_rules",
				},
				{
					action: "replace",
					resourceType: "namespace",
					operationId: "ves.io.schema.namespace.API.Replace",
					summary: "Replace Namespace.",
					description:
						"Replaces attributes of a namespace including its metadata like labels, description etc.",
					purpose: "Replace existing namespace",
					path: "/api/web/namespaces/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "active_alert_policy",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.GetActiveAlertPolicies",
					summary: "GET Active Alert Policies.",
					description:
						"GetActiveAlertPolicies returns the list of active alert policies for the namespace.",
					purpose: "List all active-alert-policies",
					path: "/api/config/namespaces/{namespace}/active_alert_policies",
				},
				{
					action: "create",
					resourceType: "active_alert_policy",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.SetActiveAlertPolicies",
					summary: "Set Active Alert Policies.",
					description:
						"SetActiveAlertPolicies sets the active alert policies for the namespace An emtpy list in the request will clear the active alert policies for the namespace.",
					purpose: "Create new active-alert-policie",
					path: "/api/config/namespaces/{namespace}/active_alert_policies",
				},
				{
					action: "list",
					resourceType: "active_network_policy",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.GetActiveNetworkPolicies",
					summary: "GET Active Network Policies.",
					description:
						"GetActiveNetworkPolicies resturn the list of active network policies for the namespace.",
					purpose: "List all active-network-policies",
					path: "/api/config/namespaces/{namespace}/active_network_policies",
				},
				{
					action: "create",
					resourceType: "active_network_policy",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.SetActiveNetworkPolicies",
					summary: "Set Active Network Policies.",
					description:
						"SetActiveNetworkPolicies sets the active network policies for the namespace An emtpy list in the request will clear the active network policies for the namespace.",
					purpose: "Create new active-network-policie",
					path: "/api/config/namespaces/{namespace}/active_network_policies",
				},
				{
					action: "list",
					resourceType: "active_service_policy",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.GetActiveServicePolicies",
					summary: "GET Active Service Policies.",
					description:
						"GetActiveServicePolicies resturn the list of active service policies for the namespace.",
					purpose: "List all active-service-policies",
					path: "/api/config/namespaces/{namespace}/active_service_policies",
				},
				{
					action: "create",
					resourceType: "active_service_policy",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.SetActiveServicePolicies",
					summary: "Set Active Service Policies.",
					description:
						"SetActiveServicePolicies sets the active service policies for the namespace An emtpy list in the request will clear the active service policies for the namespace.",
					purpose: "Create new active-service-policie",
					path: "/api/config/namespaces/{namespace}/active_service_policies",
				},
				{
					action: "create",
					resourceType: "stat",
					operationId:
						"ves.io.schema.namespace.NamespaceMLCustomAPI.GetApiEndpointsStats",
					summary: "GET API Endpoints Stats for Namespace.",
					description:
						"GET API endpoints stats for the given Namespace.",
					purpose: "Create new stat",
					path: "/api/ml/data/namespaces/{namespace}/api_endpoints/stats",
				},
				{
					action: "create",
					resourceType: "application_inventory",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.ApplicationInventory",
					summary: "Application Objects Inventory.",
					description:
						"ApplicationInventory returns inventory of configured application related objects for the tenant. Inventory of namespaced objects (HTTP LBs, TCP LBs, etc) in a particular namespace is returned.",
					purpose: "Create new application-inventory",
					path: "/api/config/namespaces/{namespace}/application_inventory",
				},
				{
					action: "list",
					resourceType: "fast_acls_for_internet_vip",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.GetFastACLsForInternetVIPs",
					summary: "GET FastACLs For Internet VIPs.",
					description:
						"GetFastACLsForInternetVIPs Returns the list of Active FastACLs for Internet VIPs.",
					purpose: "List all fast-acls-for-internet-vips",
					path: "/api/config/namespaces/{namespace}/fast_acls_for_internet_vips",
				},
				{
					action: "create",
					resourceType: "fast_acls_for_internet_vip",
					operationId:
						"ves.io.schema.namespace.NamespaceCustomAPI.SetFastACLsForInternetVIPs",
					summary: "Set FastACLs For Internet VIPs.",
					description:
						"SetFastACLsForInternetVIPs activates the passed list of FastACLs for Internet VIPs. An emtpy list in the request will clear FastACLs for Internet VIPs.",
					purpose: "Create new fast-acls-for-internet-vip",
					path: "/api/config/namespaces/{namespace}/fast_acls_for_internet_vips",
				},
				{
					action: "create",
					resourceType: "suggest-value",
					operationId:
						"ves.io.schema.namespace.CustomAPI.SuggestValues",
					summary: "Suggest Values.",
					description:
						"SuggestValues returns suggested values for the specified field in the given Create/Replace/Custom request.",
					purpose: "Create new suggest-value",
					path: "/api/web/namespaces/{namespace}/suggest-values",
				},
				{
					action: "get",
					resourceType: "namespace",
					operationId: "ves.io.schema.namespace.API.Get",
					summary: "GET Namespace.",
					description:
						"This is the read representation of the namespace object.",
					purpose: "Retrieve specific namespace",
					path: "/api/web/namespaces/{name}",
				},
				{
					action: "create",
					resourceType: "cascade_delete",
					operationId:
						"ves.io.schema.namespace.CustomAPI.CascadeDelete",
					summary: "Cascade DELETE.",
					description:
						"CascadeDelete will DELETE the namespace and all configuration objects like virtual_hosts etc. Under it. Use this only if the entire namespace and its contents are to be wiped out.",
					purpose: "Create new cascade-delete",
					path: "/api/web/namespaces/{name}/cascade_delete",
				},
				{
					action: "list",
					resourceType: "namespace_role",
					operationId: "ves.io.schema.namespace_role.API.List",
					summary: "List Namespace Role.",
					description:
						"List the set of namespace_role in a namespace.",
					purpose: "List all namespace-roles",
					path: "/api/web/namespaces/{namespace}/namespace_roles",
				},
				{
					action: "get",
					resourceType: "namespace_role",
					operationId: "ves.io.schema.namespace_role.API.Get",
					summary: "GET Namespace Role.",
					description:
						"Allows listing a role of a user in a namespace.",
					purpose: "Retrieve specific namespace-role",
					path: "/api/web/namespaces/{namespace}/namespace_roles/{name}",
				},
				{
					action: "list",
					resourceType: "rbac_policy",
					operationId: "ves.io.schema.rbac_policy.API.List",
					summary: "List RBAC Policy.",
					description: "List the set of rbac_policy in a namespace.",
					purpose: "List all rbac-policys",
					path: "/api/web/namespaces/{namespace}/rbac_policys",
				},
				{
					action: "get",
					resourceType: "rbac_policy",
					operationId: "ves.io.schema.rbac_policy.API.Get",
					summary: "GET RBAC Policy.",
					description:
						"GET rbac_policy reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific rbac-policy",
					path: "/api/web/namespaces/{namespace}/rbac_policys/{name}",
				},
				{
					action: "list",
					resourceType: "role",
					operationId: "ves.io.schema.role.CustomAPI.CustomList",
					summary: "Custom List Roles.",
					description:
						"List the Role objects with all API groups which the role can access to.",
					purpose: "List all roles",
					path: "/api/web/custom/namespaces/{namespace}/roles",
				},
				{
					action: "create",
					resourceType: "role",
					operationId: "ves.io.schema.role.CustomAPI.CustomCreate",
					summary: "Custom Create Role.",
					description:
						"Create a role object and the rbac_policy object which the role associated with.",
					purpose: "Create new role",
					path: "/api/web/custom/namespaces/{namespace}/roles",
				},
				{
					action: "get",
					resourceType: "role",
					operationId: "ves.io.schema.role.CustomAPI.CustomGet",
					summary: "Custom GET Role.",
					description:
						"GET the Role objects with all API groups which the role can access to.",
					purpose: "Retrieve specific role",
					path: "/api/web/custom/namespaces/{namespace}/roles/{name}",
				},
				{
					action: "replace",
					resourceType: "role",
					operationId: "ves.io.schema.role.CustomAPI.CustomReplace",
					summary: "Custom Replace Role.",
					description: "Update the role object with new API groups.",
					purpose: "Replace existing role",
					path: "/api/web/custom/namespaces/{namespace}/roles/{name}",
				},
				{
					action: "create",
					resourceType: "role",
					operationId: "ves.io.schema.role.API.Create",
					summary: "Create Role.",
					description: "Creates a role.",
					purpose: "Create new role",
					path: "/api/web/namespaces/{metadata.namespace}/roles",
				},
				{
					action: "replace",
					resourceType: "role",
					operationId: "ves.io.schema.role.API.Replace",
					summary: "Replace Role.",
					description: "Amends a role.",
					purpose: "Replace existing role",
					path: "/api/web/namespaces/{metadata.namespace}/roles/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "role",
					operationId: "ves.io.schema.role.API.List",
					summary: "List Role",
					description: "List the set of role in a namespace.",
					purpose: "List all roles",
					path: "/api/web/namespaces/{namespace}/roles",
				},
				{
					action: "get",
					resourceType: "role",
					operationId: "ves.io.schema.role.API.Get",
					summary: "GET Role",
					description: "Reads a role.",
					purpose: "Retrieve specific role",
					path: "/api/web/namespaces/{namespace}/roles/{name}",
				},
				{
					action: "delete",
					resourceType: "role",
					operationId: "ves.io.schema.role.API.Delete",
					summary: "DELETE Role.",
					description: "DELETE the specified role.",
					purpose: "Delete role",
					path: "/api/web/namespaces/{namespace}/roles/{name}",
				},
				{
					action: "get",
					resourceType: "oidc_provider",
					operationId: "ves.io.schema.oidc_provider.CustomAPI.Get",
					summary: "GET",
					description:
						"GET implements OIDC provider query by name. Returns OIDC provider object. Query will look into current tenants `system` namespace for OIDC provider by name.",
					purpose: "Retrieve specific oidc-provider",
					path: "/api/web/custom/namespaces/{namespace}/oidc_provider/{name}",
				},
				{
					action: "create",
					resourceType: "delete",
					operationId: "ves.io.schema.oidc_provider.CustomAPI.Delete",
					summary: "DELETE",
					description:
						"DELETE deletes OIDC provider by name. This would also disable SCIM integration for the tenant, if at all, it was enabled. Returns OIDC provider object that gets deleted. Query will look into current tenants `system` namespace for OIDC provider by name.",
					purpose: "Create new delete",
					path: "/api/web/custom/namespaces/{namespace}/oidc_provider/{name}/delete",
				},
				{
					action: "list",
					resourceType: "oidc_provider",
					operationId: "ves.io.schema.oidc_provider.CustomAPI.List",
					summary: "List",
					description:
						"List implements OIDC provider query. Returns list of OIDC provider of all types. Query will look into current tenants `system` namespace.",
					purpose: "List all oidc-providers",
					path: "/api/web/custom/namespaces/{namespace}/oidc_providers",
				},
				{
					action: "create",
					resourceType: "oidc_provider",
					operationId: "ves.io.schema.oidc_provider.CustomAPI.Create",
					summary: "Create",
					description:
						"Create creates an OIDC provider in F5XC Identity. Currently we support creating provider for brokering Google identity provider and any generic OIDC provider that support OpenID Connect protocol V1.0. To configure type Google (provider_type 1), user is not required to provide well-known URL details as its already pre-configured. Parameters such as client ID, client secret and additional optional parameters as specified in the create schema needs to be provided. To configure default type (provider_type 0), user needs to provide well-known URLs and additional fields as required part of create schema. Check create response section for the details on action that needs to be taken POST sending a successful create request.",
					purpose: "Create new oidc-provider",
					path: "/api/web/custom/namespaces/{namespace}/oidc_providers",
				},
				{
					action: "get",
					resourceType: "oidc_provider",
					operationId:
						"docs_cloud_f5_com_0200_public_ves_io_schema_oidc_provider_ves_swagger_ves.io.schema.oidc_provider.CustomAPI.Get",
					summary: "GET",
					description:
						"GET implements OIDC provider query by name. Returns OIDC provider object. Query will look into current tenants `system` namespace for OIDC provider by name.",
					purpose: "Retrieve specific oidc-provider",
					path: "/api/web/custom/namespaces/{namespace}/oidc_providers/{name}",
				},
				{
					action: "create",
					resourceType: "oidc_provider",
					operationId:
						"ves.io.schema.oidc_provider.CustomAPI.Replace",
					summary: "Replace",
					description:
						"Replace updates OIDC provider parameters for a given provider instance. Since we never store client secret, any time this operation is performed, user will need to input the original/new client secret along with other existing fields as delta operations is not supported. `NOTE`: Operations performed via API client is encouraged to issue a detail GET on the current oidc_provider resource to retrieve all configured fields and this can be used in constructing payload for the update operation. Params which are not sent as part of replace operation will GET removed/unset if those params were configured prior to this operation. So its important that replace operation payload needs to have complete fields with their values as required in your final configuration. For example: admin needs to update client secret of an existing SSO configuation - first issue detail GET on the current oidc_provider resource, use all of the fields in `spec.gc_spec` from response and construct the replace request spec. Now update only client_secret field with the new value as required and send request.",
					purpose: "Create new oidc-provider",
					path: "/api/web/custom/namespaces/{namespace}/oidc_providers/{name}",
				},
				{
					action: "replace",
					resourceType: "oidc_provider",
					operationId:
						"docs_cloud_f5_com_0200_public_ves_io_schema_oidc_provider_ves_swagger_ves.io.schema.oidc_provider.CustomAPI.Replace",
					summary: "Replace",
					description:
						"Replace updates OIDC provider parameters for a given provider instance. Since we never store client secret, any time this operation is performed, user will need to input the original/new client secret along with other existing fields as delta operations is not supported. `NOTE`: Operations performed via API client is encouraged to issue a detail GET on the current oidc_provider resource to retrieve all configured fields and this can be used in constructing payload for the update operation. Params which are not sent as part of replace operation will GET removed/unset if those params were configured prior to this operation. So its important that replace operation payload needs to have complete fields with their values as required in your final configuration. For example: admin needs to update client secret of an existing SSO configuation - first issue detail GET on the current oidc_provider resource, use all of the fields in `spec.gc_spec` from response and construct the replace request spec. Now update only client_secret field with the new value as required and send request.",
					purpose: "Replace existing oidc-provider",
					path: "/api/web/custom/namespaces/{namespace}/oidc_providers/{name}",
				},
				{
					action: "create",
					resourceType: "delete",
					operationId:
						"docs_cloud_f5_com_0200_public_ves_io_schema_oidc_provider_ves_swagger_ves.io.schema.oidc_provider.CustomAPI.Delete",
					summary: "DELETE",
					description:
						"DELETE deletes OIDC provider by name. This would also disable SCIM integration for the tenant, if at all, it was enabled. Returns OIDC provider object that gets deleted. Query will look into current tenants `system` namespace for OIDC provider by name.",
					purpose: "Create new delete",
					path: "/api/web/custom/namespaces/{namespace}/oidc_providers/{name}/delete",
				},
				{
					action: "get",
					resourceType: "mapper",
					operationId:
						"ves.io.schema.oidc_provider.CustomAPI.GetOIDCMappers",
					summary: "GET OIDC mappers.",
					description:
						"GET OIDC mappers gets OIDC mappers from underlying IDM provider.",
					purpose: "Retrieve specific mapper",
					path: "/api/web/custom/namespaces/{namespace}/oidc_providers/{name}/mappers",
				},
				{
					action: "create",
					resourceType: "mapper",
					operationId:
						"ves.io.schema.oidc_provider.CustomAPI.UpdateOIDCMappers",
					summary: "Update OIDC mappers.",
					description:
						"Update OIDC mappers updates OIDC mappers in underlying IDM provider.",
					purpose: "Create new mapper",
					path: "/api/web/custom/namespaces/{namespace}/oidc_providers/{name}/mappers",
				},
				{
					action: "replace",
					resourceType: "scim",
					operationId:
						"ves.io.schema.oidc_provider.CustomAPI.UpdateScimIntegration",
					summary: "Update OIDC provider SCIM Integration.",
					description:
						"Enables / Disables the SCIM integration for the OIDC provider.",
					purpose: "Replace existing scim",
					path: "/api/web/custom/namespaces/{namespace}/oidc_providers/{name}/scim",
				},
				{
					action: "list",
					resourceType: "state",
					operationId: "ves.io.schema.signup.CustomAPI.ListStates",
					summary: "List states.",
					description:
						"Returns a list of known states of a country. List will be empty if country has no states.",
					purpose: "List all states",
					path: "/no_auth/countries/{country_code}/states/{prefix}",
				},
				{
					action: "list",
					resourceType: "city",
					operationId: "ves.io.schema.signup.CustomAPI.ListCities",
					summary: "List cities.",
					description:
						"Returns a list of known cities of a country/state.",
					purpose: "List all cities",
					path: "/no_auth/countries/{country_code}/states/{state_code}/cities/{prefix}",
				},
				{
					action: "list",
					resourceType: "country",
					operationId: "ves.io.schema.signup.CustomAPI.ListCountries",
					summary: "List countries.",
					description:
						"Returns a list of supported countries along with with additional information such as address validation rules.",
					purpose: "List all countries",
					path: "/no_auth/countries/{prefix}",
				},
				{
					action: "create",
					resourceType: "validate_registration",
					operationId:
						"ves.io.schema.signup.CustomAPI.ValidateRegistration",
					summary: "Validate Registration.",
					description:
						"ValidateRegistration validates if the signup registration request is valid when a new customer attempts to signup.",
					purpose: "Create new validate-registration",
					path: "/no_auth/login/validate_registration",
				},
				{
					action: "create",
					resourceType: "send_password_email",
					operationId:
						"ves.io.schema.signup.CustomAPI.SendPasswordEmail",
					summary: "Send Password Email.",
					description:
						"SendPasswordEmail enables resetting the password at the time of on-boarding new customer.",
					purpose: "Create new send-password-email",
					path: "/no_auth/send_password_email",
				},
				{
					action: "get",
					resourceType: "signup",
					operationId: "ves.io.schema.signup.CustomAPI.Get",
					summary: "Read Signup.",
					description:
						"GET allows users to query signup and its status. Use this to query for a status of a submitted signup object.",
					purpose: "Retrieve specific signup",
					path: "/no_auth/signup/{name}",
				},
				{
					action: "create",
					resourceType: "validate_contact",
					operationId:
						"ves.io.schema.signup.CustomAPI.ValidateContact",
					summary: "Validate contact.",
					description:
						"It validates that: * the provided country and zip code are not empty * the provided country is in the configured list of countries * a provided zip code matches a regexp for a given country.",
					purpose: "Create new validate-contact",
					path: "/no_auth/validate_contact",
				},
				{
					action: "list",
					resourceType: "state",
					operationId:
						"docs_cloud_f5_com_0217_public_ves_io_schema_signup_ves_swagger_ves.io.schema.signup.CustomAPI.ListStates",
					summary: "List states.",
					description:
						"Returns a list of known states of a country. List will be empty if country has no states.",
					purpose: "List all states",
					path: "/api/web/custom/countries/{country_code}/states/{prefix}",
				},
				{
					action: "list",
					resourceType: "city",
					operationId:
						"docs_cloud_f5_com_0217_public_ves_io_schema_signup_ves_swagger_ves.io.schema.signup.CustomAPI.ListCities",
					summary: "List cities.",
					description:
						"Returns a list of known cities of a country/state.",
					purpose: "List all cities",
					path: "/api/web/custom/countries/{country_code}/states/{state_code}/cities/{prefix}",
				},
				{
					action: "list",
					resourceType: "country",
					operationId:
						"docs_cloud_f5_com_0217_public_ves_io_schema_signup_ves_swagger_ves.io.schema.signup.CustomAPI.ListCountries",
					summary: "List countries.",
					description:
						"Returns a list of supported countries along with with additional information such as address validation rules.",
					purpose: "List all countries",
					path: "/api/web/custom/countries/{prefix}",
				},
				{
					action: "list",
					resourceType: "Group",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.ListGroups",
					summary: "List group based on filters.",
					description: "List groups based on the given filter.",
					purpose: "List all Groups",
					path: "/api/scim/namespaces/system/v2/Groups",
				},
				{
					action: "create",
					resourceType: "Group",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.CreateGroup",
					summary: "Create group with users.",
					description: "Create group with given users.",
					purpose: "Create new Group",
					path: "/api/scim/namespaces/system/v2/Groups",
				},
				{
					action: "list",
					resourceType: "Group",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.GetGroupById",
					summary: "List group based on ID.",
					description: "List group based on the given ID.",
					purpose: "Retrieve specific Group",
					path: "/api/scim/namespaces/system/v2/Groups/{id}",
				},
				{
					action: "replace",
					resourceType: "Group",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.ReplaceGroupById",
					summary: "Replace group based on ID.",
					description: "Replace group based on the given ID.",
					purpose: "Replace existing Group",
					path: "/api/scim/namespaces/system/v2/Groups/{id}",
				},
				{
					action: "delete",
					resourceType: "Group",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.DeleteGroupById",
					summary: "DELETE group based on ID.",
					description: "DELETE group based on the given ID.",
					purpose: "Delete Group",
					path: "/api/scim/namespaces/system/v2/Groups/{id}",
				},
				{
					action: "update",
					resourceType: "Group",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.PatchGroupById",
					summary: "PATCH group based on ID.",
					description: "PATCH group based on the given ID.",
					purpose: "Update Group",
					path: "/api/scim/namespaces/system/v2/Groups/{id}",
				},
				{
					action: "list",
					resourceType: "ResourceType",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.ListResourceTypes",
					summary: "GET supported resources type.",
					description: "Listresourcetypes CustomPublicAPI.",
					purpose: "List all ResourceTypes",
					path: "/api/scim/namespaces/system/v2/ResourceTypes",
				},
				{
					action: "list",
					resourceType: "ResourceType",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.GetResourceTypesById",
					summary: "GET supported resources type.",
					description: "Getresourcetypesbyid CustomPublicAPI.",
					purpose: "Retrieve specific ResourceType",
					path: "/api/scim/namespaces/system/v2/ResourceTypes/{id}",
				},
				{
					action: "list",
					resourceType: "Schema",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.ListSchemas",
					summary: "Schemas",
					description: "Listschemas CustomPublicAPI.",
					purpose: "List all Schemas",
					path: "/api/scim/namespaces/system/v2/Schemas",
				},
				{
					action: "list",
					resourceType: "Schema",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.GetSchemaById",
					summary: "Schemas By ID.",
					description: "Getschemabyid CustomPublicAPI.",
					purpose: "Retrieve specific Schema",
					path: "/api/scim/namespaces/system/v2/Schemas/{id}",
				},
				{
					action: "list",
					resourceType: "ServiceProviderConfig",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.ListServiceProviderConfig",
					summary: "List service provider configs.",
					description: "Listserviceproviderconfig CustomPublicAPI.",
					purpose: "List all ServiceProviderConfigs",
					path: "/api/scim/namespaces/system/v2/ServiceProviderConfig",
				},
				{
					action: "list",
					resourceType: "User",
					operationId: "ves.io.schema.scim.CustomPublicAPI.ListUsers",
					summary: "GET all users.",
					description: "GET all users.",
					purpose: "List all Users",
					path: "/api/scim/namespaces/system/v2/Users",
				},
				{
					action: "create",
					resourceType: "User",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.CreateUser",
					summary: "Create User with Role Assignment.",
					description:
						"Create creates a user and namespace roles binding for this user.",
					purpose: "Create new User",
					path: "/api/scim/namespaces/system/v2/Users",
				},
				{
					action: "list",
					resourceType: "User",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.GetUserById",
					summary: "GET User with ID.",
					description: "GET user by means of ID.",
					purpose: "Retrieve specific User",
					path: "/api/scim/namespaces/system/v2/Users/{id}",
				},
				{
					action: "replace",
					resourceType: "User",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.ReplaceUserById",
					summary: "Update User and Role Assignments.",
					description:
						"Replace updates user and namespace roles for this user.",
					purpose: "Replace existing User",
					path: "/api/scim/namespaces/system/v2/Users/{id}",
				},
				{
					action: "delete",
					resourceType: "User",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.DeleteUserById",
					summary: "DELETE user by ID.",
					description: "DELETE user by ID.",
					purpose: "Delete User",
					path: "/api/scim/namespaces/system/v2/Users/{id}",
				},
				{
					action: "update",
					resourceType: "User",
					operationId:
						"ves.io.schema.scim.CustomPublicAPI.PatchUserById",
					summary: "PATCH User.",
					description: "PATCH patches the fields for this user.",
					purpose: "Update User",
					path: "/api/scim/namespaces/system/v2/Users/{id}",
				},
				{
					action: "list",
					resourceType: "lookup",
					operationId: "ves.io.schema.tenant.CustomAPI.LookupCname",
					summary: "Lookup cname.",
					description: "Checks if a cname is available.",
					purpose: "List all lookups",
					path: "/no_auth/cname/lookup",
				},
				{
					action: "list",
					resourceType: "password_policy",
					operationId:
						"ves.io.schema.tenant.CustomAPI.GetPasswordPolicy",
					summary: "GetPasswordPolicy.",
					description:
						"GetPasswordPolicy returns password policy for tenant.",
					purpose: "List all password-policys",
					path: "/no_auth/tenant/idm/settings/password_policy",
				},
				{
					action: "create",
					resourceType: "assign",
					operationId:
						"ves.io.schema.tenant.CustomAPI.AssignDomainOwner",
					summary: "Assign domain owner.",
					description:
						"Assign domain owner tries to assign domain owner to user in the request. It checks that requester is domain owner as well. It implies such steps: 1) mark user as domain owner 2) if user is SSO - mark user as F5 Distributed Cloud managed - send update password email 3) set admin roles in system, shared, * namespaces NOTE: previous roles (which was explicitly assigned to this user) will be deleted.",
					purpose: "Create new assign",
					path: "/api/web/namespaces/system/tenant/domain_owner/assign",
				},
				{
					action: "create",
					resourceType: "unassign",
					operationId:
						"ves.io.schema.tenant.CustomAPI.UnassignDomainOwner",
					summary: "Unassign domain owner.",
					description:
						"Unassign domain owner tries to remove domain owner privilege from user in the request. It checks that requester is domain owner. It implies such steps: 1) remove domain owner boolean flag 2) if tenant has SSO enabled: - mark user as SSO - DELETE password credential - DELETE OTP credential (if exists) NOTE: previously granted roles (including admin roles) will be retained.",
					purpose: "Create new unassign",
					path: "/api/web/namespaces/system/tenant/domain_owner/unassign",
				},
				{
					action: "list",
					resourceType: "last_login",
					operationId:
						"ves.io.schema.tenant.CustomAPI.GetLastLoginMap",
					summary: "GetLastLoginMap.",
					description:
						"GetLastLoginMap returns last login timestamp for each user within a tenant.",
					purpose: "List all last-logins",
					path: "/api/web/namespaces/system/tenant/idm/events/last_login",
				},
				{
					action: "list",
					resourceType: "login",
					operationId:
						"ves.io.schema.tenant.CustomAPI.GetLoginEvents",
					summary: "GetLoginEvents.",
					description:
						"GetLoginEvents returns login events for specified in config period of time. It consider all users within current tenant. Login events are extracted directly from IDM.",
					purpose: "List all logins",
					path: "/api/web/namespaces/system/tenant/idm/events/login",
				},
				{
					action: "create",
					resourceType: "login_in_time",
					operationId:
						"ves.io.schema.tenant.CustomAPI.GetLoginEventsInTimeFrame",
					summary: "GetLoginEventsInTimeFrame.",
					description:
						"GetLoginEventsInTimeFrame returns login events for specified period of time. It consider all users specified by context tenant.",
					purpose: "Create new login-in-time",
					path: "/api/web/namespaces/system/tenant/idm/events/login_in_time",
				},
				{
					action: "list",
					resourceType: "setting",
					operationId:
						"ves.io.schema.tenant.CustomAPI.GetIDMSettings",
					summary: "GetIDMSettings.",
					description:
						"GetIDMSettings returns IDM settings for tenant. IDM settings contains info like password policy, brute-force detection policy, etc...",
					purpose: "List all settings",
					path: "/api/web/namespaces/system/tenant/idm/settings",
				},
				{
					action: "replace",
					resourceType: "setting",
					operationId:
						"ves.io.schema.tenant.CustomAPI.UpdateIDMSettings",
					summary: "UpdateIDMSettings.",
					description:
						"UpdateIDMSettings allows to adjust IDM settings for tenant, like password policy, brute-force detection policy, etc...",
					purpose: "Replace existing setting",
					path: "/api/web/namespaces/system/tenant/idm/settings",
				},
				{
					action: "list",
					resourceType: "inactive",
					operationId:
						"ves.io.schema.tenant.CustomAPI.ListInactiveUsers",
					summary: "ListInactiveUsers.",
					description:
						"Returns list of users for which no login events was found for last 90 days of time. It consider all users within current tenant.",
					purpose: "List all inactives",
					path: "/api/web/namespaces/system/tenant/idm/users/inactive",
				},
				{
					action: "list",
					resourceType: "lookup",
					operationId:
						"docs_cloud_f5_com_0233_public_ves_io_schema_tenant_ves_swagger_ves.io.schema.tenant.CustomAPI.LookupCname",
					summary: "Lookup cname.",
					description: "Checks if a cname is available.",
					purpose: "List all lookups",
					path: "/api/web/namespaces/system/tenant/lookup",
				},
				{
					action: "create",
					resourceType: "request-delete",
					operationId: "ves.io.schema.tenant.CustomAPI.DeleteTenant",
					summary: "DELETE Tenant.",
					description:
						"Request to mark Tenant for deletion queue, after approve it will completely removed from the system.",
					purpose: "Create new request-delete",
					path: "/api/web/namespaces/system/tenant/request-delete",
				},
				{
					action: "list",
					resourceType: "setting",
					operationId:
						"ves.io.schema.tenant.CustomAPI.GetTenantSettings",
					summary: "Tenant Settings.",
					description: "Receive current tenant settings.",
					purpose: "List all settings",
					path: "/api/web/namespaces/system/tenant/settings",
				},
				{
					action: "replace",
					resourceType: "setting",
					operationId:
						"ves.io.schema.tenant.CustomAPI.UpdateTenantSettings",
					summary: "Tenant Settings.",
					description: "Tenant settings.",
					purpose: "Replace existing setting",
					path: "/api/web/namespaces/system/tenant/settings",
				},
				{
					action: "replace",
					resourceType: "disable",
					operationId:
						"ves.io.schema.tenant.CustomAPI.DisableTenantLevelOTP",
					summary: "Disable tenant level OTP.",
					description:
						"Disable tenant level OTP disables OTP on tenant-level. After it's disabled it's up to user whether to enable OTP.",
					purpose: "Replace existing disable",
					path: "/api/web/namespaces/system/tenant/settings/otp/disable",
				},
				{
					action: "replace",
					resourceType: "enable",
					operationId:
						"ves.io.schema.tenant.CustomAPI.EnableTenantLevelOTP",
					summary: "Enable tenant level OTP.",
					description:
						"Enable tenant level OTP enables OTP on tenant-level. It enforces each user within a tenant to enable OTP.",
					purpose: "Replace existing enable",
					path: "/api/web/namespaces/system/tenant/settings/otp/enable",
				},
				{
					action: "list",
					resourceType: "favicon",
					operationId: "ves.io.schema.tenant.CustomAPI.GetFavIcon",
					summary: "Tenant favicon.",
					description: "Receive current tenant favicon.",
					purpose: "List all favicons",
					path: "/api/web/namespaces/system/tenant/settings/tenant/favicon",
				},
				{
					action: "list",
					resourceType: "image",
					operationId: "ves.io.schema.tenant.CustomAPI.GetImage",
					summary: "Tenant profile image.",
					description: "Receive current tenant profile image.",
					purpose: "List all images",
					path: "/api/web/namespaces/system/tenant/settings/tenant/image",
				},
				{
					action: "replace",
					resourceType: "image",
					operationId: "ves.io.schema.tenant.CustomAPI.UpdateImage",
					summary: "Update tenant profile image.",
					description:
						"Uploads new profile image for the tenant entity.",
					purpose: "Replace existing image",
					path: "/api/web/namespaces/system/tenant/settings/tenant/image",
				},
				{
					action: "delete",
					resourceType: "image",
					operationId: "ves.io.schema.tenant.CustomAPI.DeleteImage",
					summary: "DELETE tenant profile image.",
					description: "DELETE profile image for the tenant entity.",
					purpose: "Delete image",
					path: "/api/web/namespaces/system/tenant/settings/tenant/image",
				},
				{
					action: "list",
					resourceType: "logo",
					operationId: "ves.io.schema.tenant.CustomAPI.GetLogo",
					summary: "Tenant logo.",
					description: "Receive current tenant logo.",
					purpose: "List all logos",
					path: "/api/web/namespaces/system/tenant/settings/tenant/logo",
				},
				{
					action: "list",
					resourceType: "support-info",
					operationId:
						"ves.io.schema.tenant.CustomAPI.GetSupportInfo",
					summary: "Support Info.",
					description: "Receive support information for tenant.",
					purpose: "List all support-infos",
					path: "/api/web/namespaces/system/tenant/support-info",
				},
				{
					action: "list",
					resourceType: "tenant-escalation-doc",
					operationId:
						"ves.io.schema.tenant.CustomAPI.GetTenantEscalationDoc",
					summary: "Tenant escalation document.",
					description: "Receive current tenant escalation document.",
					purpose: "List all tenant-escalation-docs",
					path: "/api/web/namespaces/system/tenant/tenant-escalation-doc",
				},
				{
					action: "replace",
					resourceType: "deactivate",
					operationId:
						"ves.io.schema.tenant.CustomAPIEywaprime.DeactivateTenant",
					summary: "DeactivateTenant.",
					description:
						"This API mark tenant for deletion queue, after approve it will completely removed from the system. This API proxies the request to eywa’s tenant disable API.",
					purpose: "Replace existing deactivate",
					path: "/api/saas/namespaces/system/v2/tenant/deactivate",
				},
				{
					action: "list",
					resourceType: "favicon",
					operationId:
						"docs_cloud_f5_com_0233_public_ves_io_schema_tenant_ves_swagger_ves.io.schema.tenant.CustomAPI.GetFavIcon",
					summary: "Tenant favicon.",
					description: "Receive current tenant favicon.",
					purpose: "List all favicons",
					path: "/api/web/static/namespaces/system/tenant/settings/tenant/favicon",
				},
				{
					action: "list",
					resourceType: "image",
					operationId:
						"docs_cloud_f5_com_0233_public_ves_io_schema_tenant_ves_swagger_ves.io.schema.tenant.CustomAPI.GetImage",
					summary: "Tenant profile image.",
					description: "Receive current tenant profile image.",
					purpose: "List all images",
					path: "/api/web/static/namespaces/system/tenant/settings/tenant/image",
				},
				{
					action: "list",
					resourceType: "summary",
					operationId:
						"ves.io.schema.tenant.TenantSummaryCustomAPI.Summary",
					summary: "Summary",
					description: "This API returns tenant summary.",
					purpose: "List all summarys",
					path: "/api/config/tenants/{tenant}/summary",
				},
				{
					action: "create",
					resourceType: "tenant_configuration",
					operationId:
						"ves.io.schema.views.tenant_configuration.API.Create",
					summary: "Create tenant configuration.",
					description:
						"Shape of the tenant configuration specification.",
					purpose: "Create new tenant-configuration",
					path: "/api/config/namespaces/{metadata.namespace}/tenant_configurations",
				},
				{
					action: "replace",
					resourceType: "tenant_configuration",
					operationId:
						"ves.io.schema.views.tenant_configuration.API.Replace",
					summary: "Replace tenant configuration.",
					description:
						"Shape of the tenant configuration specification.",
					purpose: "Replace existing tenant-configuration",
					path: "/api/config/namespaces/{metadata.namespace}/tenant_configurations/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "tenant_configuration",
					operationId:
						"ves.io.schema.views.tenant_configuration.API.List",
					summary: "List Tenant Configuration.",
					description:
						"List the set of tenant_configuration in a namespace.",
					purpose: "List all tenant-configurations",
					path: "/api/config/namespaces/{namespace}/tenant_configurations",
				},
				{
					action: "get",
					resourceType: "tenant_configuration",
					operationId:
						"ves.io.schema.views.tenant_configuration.API.Get",
					summary: "GET tenant configuration.",
					description:
						"Shape of the tenant configuration specification.",
					purpose: "Retrieve specific tenant-configuration",
					path: "/api/config/namespaces/{namespace}/tenant_configurations/{name}",
				},
				{
					action: "delete",
					resourceType: "tenant_configuration",
					operationId:
						"ves.io.schema.views.tenant_configuration.API.Delete",
					summary: "DELETE Tenant Configuration.",
					description: "DELETE the specified tenant_configuration.",
					purpose: "Delete tenant-configuration",
					path: "/api/config/namespaces/{namespace}/tenant_configurations/{name}",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.tenant_management.CustomAPI.DelegatedAccessSubscribe",
					summary: "Subscribe Delegated Access Addon Service.",
					description:
						"Subscribe Delegated Access addon service feature. A support request will be created and feature will be enabled upon approval.",
					purpose: "Create new subscribe",
					path: "/api/web/namespaces/system/tenant_management/delegated_access/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.tenant_management.CustomAPI.DelegatedAccessUnsubscribe",
					summary: "Unsubscribe Delegated Access Addon Service.",
					description:
						"Unsubscribe Delegated Access addon service feature. A support request will be created and request will be processed upon approval.",
					purpose: "Create new unsubscribe",
					path: "/api/web/namespaces/system/tenant_management/delegated_access/unsubscribe",
				},
				{
					action: "create",
					resourceType: "tenant_profile",
					operationId:
						"ves.io.schema.tenant_management.tenant_profile.API.Create",
					summary: "Create Tenant Profile.",
					description:
						"Creates a tenant_profile config instance. Name of the object is the name of the tenant profile to be created.",
					purpose: "Create new tenant-profile",
					path: "/api/web/namespaces/{metadata.namespace}/tenant_profiles",
				},
				{
					action: "replace",
					resourceType: "tenant_profile",
					operationId:
						"ves.io.schema.tenant_management.tenant_profile.API.Replace",
					summary: "Replace Tenant Profile.",
					description:
						"Replaces attributes of a tenant_profile configuration.",
					purpose: "Replace existing tenant-profile",
					path: "/api/web/namespaces/{metadata.namespace}/tenant_profiles/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "tenant_profile",
					operationId:
						"ves.io.schema.tenant_management.tenant_profile.API.List",
					summary: "List Tenant Profile.",
					description:
						"List the set of tenant_profile in a namespace.",
					purpose: "List all tenant-profiles",
					path: "/api/web/namespaces/{namespace}/tenant_profiles",
				},
				{
					action: "get",
					resourceType: "tenant_profile",
					operationId:
						"ves.io.schema.tenant_management.tenant_profile.API.Get",
					summary: "GET Tenant Profile.",
					description:
						"GET tenant_profile reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific tenant-profile",
					path: "/api/web/namespaces/{namespace}/tenant_profiles/{name}",
				},
				{
					action: "delete",
					resourceType: "tenant_profile",
					operationId:
						"ves.io.schema.tenant_management.tenant_profile.API.Delete",
					summary: "DELETE Tenant Profile.",
					description: "DELETE the specified tenant_profile.",
					purpose: "Delete tenant-profile",
					path: "/api/web/namespaces/{namespace}/tenant_profiles/{name}",
				},
				{
					action: "create",
					resourceType: "sync",
					operationId: "ves.io.schema.user.CustomAPI.SyncUser",
					summary: "Sync user",
					description:
						"In case when user created initially from identity provider we need to sync the user data.",
					purpose: "Create new sync",
					path: "/api/web/custom/idm/user/sync",
				},
				{
					action: "replace",
					resourceType: "group_add",
					operationId: "ves.io.schema.user.CustomAPI.AddUserToGroup",
					summary: "Add user to groups.",
					description: "Assign existing user to specific groups.",
					purpose: "Replace existing group-add",
					path: "/api/web/custom/namespaces/system/users/group_add",
				},
				{
					action: "replace",
					resourceType: "group_remove",
					operationId:
						"ves.io.schema.user.CustomAPI.RemoveUserFromGroup",
					summary: "Remove user from groups.",
					description: "Remove existing user from specific groups.",
					purpose: "Replace existing group-remove",
					path: "/api/web/custom/namespaces/system/users/group_remove",
				},
				{
					action: "create",
					resourceType: "accept_to",
					operationId: "ves.io.schema.user.CustomAPI.AcceptTOS",
					summary: "Accept TOS.",
					description:
						"Accept TOS updates version of accepted terms of service.",
					purpose: "Create new accept-to",
					path: "/api/web/custom/namespaces/{namespace}/accept_tos",
				},
				{
					action: "create",
					resourceType: "role_user",
					operationId: "ves.io.schema.user.CustomAPI.AssignRole",
					summary: "Assign role to User.",
					description:
						"AssignRole allows customers to assign a namespace/role pair to multiple users.",
					purpose: "Create new role-user",
					path: "/api/web/custom/namespaces/{namespace}/role_users",
				},
				{
					action: "create",
					resourceType: "send_password_email",
					operationId:
						"ves.io.schema.user.CustomAPI.SendPasswordEmail",
					summary: "Send Password Email.",
					description:
						"SendPasswordEmail allows admin user to trigger send password email for a user to update user's password. Deprecated: use ResetPasswordByAdmin RPC instead.",
					purpose: "Create new send-password-email",
					path: "/api/web/custom/namespaces/{namespace}/send_password_email",
				},
				{
					action: "list",
					resourceType: "to",
					operationId: "ves.io.schema.user.CustomAPI.GetTOS",
					summary: "GET TOS",
					description: "GET TOS provides TOS version with text.",
					purpose: "List all tos",
					path: "/api/web/custom/namespaces/{namespace}/tos",
				},
				{
					action: "list",
					resourceType: "user_role",
					operationId: "ves.io.schema.user.CustomAPI.List",
					summary: "GET User and Role Assignments.",
					description:
						"List enumerates users and their namespace roles for this tenant.",
					purpose: "List all user-roles",
					path: "/api/web/custom/namespaces/{namespace}/user_roles",
				},
				{
					action: "create",
					resourceType: "user_role",
					operationId: "ves.io.schema.user.CustomAPI.Create",
					summary: "Create User with Role Assignment.",
					description:
						"Create creates a user and namespace roles binding for this user.",
					purpose: "Create new user-role",
					path: "/api/web/custom/namespaces/{namespace}/user_roles",
				},
				{
					action: "replace",
					resourceType: "user_role",
					operationId: "ves.io.schema.user.CustomAPI.Replace",
					summary: "Update User and Role Assignments.",
					description:
						"Replace updates user and namespace roles for this user.",
					purpose: "Replace existing user-role",
					path: "/api/web/custom/namespaces/{namespace}/user_roles",
				},
				{
					action: "create",
					resourceType: "user_role",
					operationId:
						"docs_cloud_f5_com_0251_public_ves_io_schema_user_ves_swagger_ves.io.schema.user.CustomAPI.Replace",
					summary: "Update User and Role Assignments.",
					description:
						"Replace updates user and namespace roles for this user.",
					purpose: "Create new user-role",
					path: "/api/web/custom/namespaces/{namespace}/user_roles/{name}",
				},
				{
					action: "create",
					resourceType: "cascade_delete",
					operationId: "ves.io.schema.user.CustomAPI.CascadeDelete",
					summary: "DELETE User and Related Objects.",
					description:
						"CascadeDelete deletes the user and associated namespace roles for this user. Use this only if the user and its referenced objects need to be wiped out altogether. Note: users will always be in the system namespace.",
					purpose: "Create new cascade-delete",
					path: "/api/web/custom/namespaces/{namespace}/users/cascade_delete",
				},
				{
					action: "list",
					resourceType: "whoami",
					operationId: "ves.io.schema.user.CustomAPI.Get",
					summary: "GET User Details.",
					description:
						"GET fetches user information based on the username header from the request context this API is also called as WhoAmI.",
					purpose: "List all whoamis",
					path: "/api/web/custom/namespaces/{namespace}/whoami",
				},
				{
					action: "create",
					resourceType: "admin_reset",
					operationId:
						"ves.io.schema.user.CustomAPI.ResetPasswordByAdmin",
					summary: "Reset password by admin.",
					description:
						"Reset password by admin resets password for a user specified in request payload. This request is meant to be executed by the tenant's admin.",
					purpose: "Create new admin-reset",
					path: "/api/web/custom/password/admin_reset",
				},
				{
					action: "create",
					resourceType: "reset",
					operationId: "ves.io.schema.user.CustomAPI.ResetPassword",
					summary: "Reset password.",
					description:
						"Reset password resets password for user who is making this request.",
					purpose: "Create new reset",
					path: "/api/web/custom/password/reset",
				},
				{
					action: "list",
					resourceType: "user_group",
					operationId: "ves.io.schema.user_group.CustomAPI.List",
					summary: "GET all User Groups for the tenant.",
					description: "List fetches all the groups for the tenant.",
					purpose: "List all user-groups",
					path: "/api/web/custom/namespaces/system/user_groups",
				},
				{
					action: "create",
					resourceType: "user_group",
					operationId: "ves.io.schema.user_group.CustomAPI.Create",
					summary: "Create User Group.",
					description:
						"Create creates user group with users to be assigned.",
					purpose: "Create new user-group",
					path: "/api/web/custom/namespaces/system/user_groups",
				},
				{
					action: "create",
					resourceType: "analyze_for_deletion",
					operationId:
						"ves.io.schema.user_group.CustomAPI.AnalyzeForDeletion",
					summary: "Analyze For Deletion.",
					description:
						"AnalyzeForDeletion checks the references of the object to make sure it is deletable.",
					purpose: "Create new analyze-for-deletion",
					path: "/api/web/custom/namespaces/system/user_groups/analyze_for_deletion",
				},
				{
					action: "get",
					resourceType: "user_group",
					operationId: "ves.io.schema.user_group.CustomAPI.Get",
					summary:
						"Fetch all the details for a group provided the group ID.",
					description:
						"GET fetches all the details for a group, provided the group ID and the users list associated to the group.",
					purpose: "Retrieve specific user-group",
					path: "/api/web/custom/namespaces/system/user_groups/{name}",
				},
				{
					action: "replace",
					resourceType: "user_group",
					operationId: "ves.io.schema.user_group.CustomAPI.Replace",
					summary:
						"Replace the User Group fields / accesses / associations.",
					description:
						"Replace allows updating of the different user group fields like the display name, description, user associations and RBAC accesses. The name of the user group cannot be edited and the sync_id can be edited only when SCIM is enabled for the tenant. If any of the editable fields are nil / empty in the request, it will be considered as the removal of the field value.",
					purpose: "Replace existing user-group",
					path: "/api/web/custom/namespaces/system/user_groups/{name}",
				},
				{
					action: "delete",
					resourceType: "user_group",
					operationId: "ves.io.schema.user_group.CustomAPI.Delete",
					summary: "DELETE a group provided the group ID.",
					description:
						"DELETE deletes the group, provided the group ID and the users list association to the group It also deletes associated namespace roles for this user. Use this only if the user group and its referenced objects need to be wiped out altogether.",
					purpose: "Delete user-group",
					path: "/api/web/custom/namespaces/system/user_groups/{name}",
				},
				{
					action: "replace",
					resourceType: "assign_namespace_role",
					operationId:
						"ves.io.schema.user_group.CustomAPI.AssignRole",
					summary: "Assign role to User Group.",
					description:
						"AssignRole allows customers to assign a namespace/role pair to user group.",
					purpose: "Replace existing assign-namespace-role",
					path: "/api/web/custom/namespaces/system/user_groups/{name}/assign_namespace_roles",
				},
				{
					action: "replace",
					resourceType: "remove_namespace_role",
					operationId:
						"ves.io.schema.user_group.CustomAPI.RemoveRole",
					summary: "Remove role from User Group.",
					description:
						"RemoveRole allows customers to remove a namespace/role from the user group.",
					purpose: "Replace existing remove-namespace-role",
					path: "/api/web/custom/namespaces/system/user_groups/{name}/remove_namespace_roles",
				},
				{
					action: "list",
					resourceType: "user_group",
					operationId: "ves.io.schema.user_group.API.List",
					summary: "List User Group.",
					description: "List the set of user_group in a namespace.",
					purpose: "List all user-groups",
					path: "/api/web/namespaces/{namespace}/user_groups",
				},
				{
					action: "get",
					resourceType: "user_group",
					operationId: "ves.io.schema.user_group.API.Get",
					summary: "GET User Group.",
					description: "Get user group.",
					purpose: "Retrieve specific user-group",
					path: "/api/web/namespaces/{namespace}/user_groups/{name}",
				},
				{
					action: "create",
					resourceType: "user_identification",
					operationId: "ves.io.schema.user_identification.API.Create",
					summary: "Create User Identification.",
					description:
						"Create user_identification creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new user-identification",
					path: "/api/config/namespaces/{metadata.namespace}/user_identifications",
				},
				{
					action: "replace",
					resourceType: "user_identification",
					operationId:
						"ves.io.schema.user_identification.API.Replace",
					summary: "Replace User Identification.",
					description:
						"Replace user_identification replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing user-identification",
					path: "/api/config/namespaces/{metadata.namespace}/user_identifications/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "user_identification",
					operationId: "ves.io.schema.user_identification.API.List",
					summary: "List User Identification.",
					description:
						"List the set of user_identification in a namespace.",
					purpose: "List all user-identifications",
					path: "/api/config/namespaces/{namespace}/user_identifications",
				},
				{
					action: "get",
					resourceType: "user_identification",
					operationId: "ves.io.schema.user_identification.API.Get",
					summary: "GET User Identification.",
					description:
						"GET user_identification reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific user-identification",
					path: "/api/config/namespaces/{namespace}/user_identifications/{name}",
				},
				{
					action: "delete",
					resourceType: "user_identification",
					operationId: "ves.io.schema.user_identification.API.Delete",
					summary: "DELETE User Identification.",
					description: "DELETE the specified user_identification.",
					purpose: "Delete user-identification",
					path: "/api/config/namespaces/{namespace}/user_identifications/{name}",
				},
				{
					action: "list",
					resourceType: "admin_notification",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.GetAdminNtfnPreferences",
					summary: "GET admin ntfn preferences.",
					description:
						"GET admin ntfn preferences gets current admin notification preferences for user. It combines information from two sources: - explicitly set admin notification preferences in user settings object - default values from uam config (for those notifications which not explicitly set)",
					purpose: "List all admin-notifications",
					path: "/api/web/namespaces/system/user/admin_notifications",
				},
				{
					action: "replace",
					resourceType: "admin_notification",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.UpdateAdminNtfnPreferences",
					summary: "Update admin ntfn preferences.",
					description:
						"Update admin ntfn preferences updates admin notification preferences for the user and store them in user settings object.",
					purpose: "Replace existing admin-notification",
					path: "/api/web/namespaces/system/user/admin_notifications",
				},
				{
					action: "replace",
					resourceType: "unset",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.UnsetAdminNtfnPreference",
					summary: "Unset admin ntfn preference.",
					description:
						"Unset admin ntfn preference unsets specific admin notification preference for the user and store it in user settings object. It can be used in email newsletters to allow easy unsubscribing for users.",
					purpose: "Replace existing unset",
					path: "/api/web/namespaces/system/user/admin_notifications/unset",
				},
				{
					action: "list",
					resourceType: "combined_notification",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.GetCombinedNtfnPreferences",
					summary: "GET combined ntfn preferences.",
					description:
						"GET combined ntfn preferences gets user-ntfn-preferences and admin-ntfn-preferences and returns combined result.",
					purpose: "List all combined-notifications",
					path: "/api/web/namespaces/system/user/combined_notifications",
				},
				{
					action: "replace",
					resourceType: "combined_notification",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.UpdateCombinedNtfnPreferences",
					summary: "Update combined ntfn preferences.",
					description:
						"Update combined ntfn preferences updates both user-ntfn-preferences and admin-ntfn-preferences.",
					purpose: "Replace existing combined-notification",
					path: "/api/web/namespaces/system/user/combined_notifications",
				},
				{
					action: "list",
					resourceType: "notification",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.GetNtfnPreferences",
					summary: "GET ntfn preferences.",
					description:
						"GET ntfn preferences gets current notification preferences for user. It combines information from two sources: - explicitly set notification preferences in user settings object - default values from uam config (for those notifications which not explicitly set)",
					purpose: "List all notifications",
					path: "/api/web/namespaces/system/user/notifications",
				},
				{
					action: "replace",
					resourceType: "notification",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.UpdateNtfnPreferences",
					summary: "Update ntfn preferences.",
					description:
						"Update ntfn preferences updates notification preferences for the user and store them in user settings object.",
					purpose: "Replace existing notification",
					path: "/api/web/namespaces/system/user/notifications",
				},
				{
					action: "replace",
					resourceType: "unset",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.UnsetNtfnPreference",
					summary: "Unset ntfn preference.",
					description:
						"Unset ntfn preference unsets specific notification preference for the user and store it in user settings object. It can be used in email newsletters to allow easy unsubscribing for users.",
					purpose: "Replace existing unset",
					path: "/api/web/namespaces/system/user/notifications/unset",
				},
				{
					action: "replace",
					resourceType: "admin_reset",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.ResetOtpDeviceByAdmin",
					summary: "ResetOtpDeviceByAdmin.",
					description: "TODO(evg): description.",
					purpose: "Replace existing admin-reset",
					path: "/api/web/namespaces/system/user/otp/admin_reset",
				},
				{
					action: "list",
					resourceType: "session",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.GetUserSessions",
					summary: "GetUserSessions.",
					description:
						"GetUserSessions returns a list of user sessions.",
					purpose: "List all sessions",
					path: "/api/web/namespaces/system/user/sessions",
				},
				{
					action: "list",
					resourceType: "setting",
					operationId: "ves.io.schema.user.setting.CustomAPI.Get",
					summary: "GET",
					description:
						"Retrieves current user settings object defined to the user.",
					purpose: "List all settings",
					path: "/api/web/namespaces/system/user/settings",
				},
				{
					action: "replace",
					resourceType: "setting",
					operationId: "ves.io.schema.user.setting.CustomAPI.Update",
					summary: "Update",
					description: "Update defined user settings.",
					purpose: "Replace existing setting",
					path: "/api/web/namespaces/system/user/settings",
				},
				{
					action: "replace",
					resourceType: "disable",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.DisableUserInIDM",
					summary: "DisableUserInIDM.",
					description: "Disables user in Identity.",
					purpose: "Replace existing disable",
					path: "/api/web/namespaces/system/user/settings/idm/disable",
				},
				{
					action: "replace",
					resourceType: "enable",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.EnableUserInIDM",
					summary: "EnableUserInIDM.",
					description:
						"Enables user in Identity. Use this to enable a user which is disabled.",
					purpose: "Replace existing enable",
					path: "/api/web/namespaces/system/user/settings/idm/enable",
				},
				{
					action: "list",
					resourceType: "image",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.GetUserImage",
					summary: "GetUserProfileImage.",
					description:
						"GetUserProfileImage returns user profile picture.",
					purpose: "List all images",
					path: "/api/web/namespaces/system/user/settings/image",
				},
				{
					action: "replace",
					resourceType: "image",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.UpdateUserImage",
					summary: "UpdateUserImage.",
					description: "Updates current user profile picture.",
					purpose: "Replace existing image",
					path: "/api/web/namespaces/system/user/settings/image",
				},
				{
					action: "delete",
					resourceType: "image",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.DeleteUserImage",
					summary: "DeleteUserImage.",
					description: "Deletes current user profile picture.",
					purpose: "Delete image",
					path: "/api/web/namespaces/system/user/settings/image",
				},
				{
					action: "replace",
					resourceType: "request_initial_access",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.RequestInitialAccess",
					summary: "Request Initial Access.",
					description:
						"Request initial access requests initial access for user within tenant. Emails will be send to tenant's admins with corresponding information.",
					purpose: "Replace existing request-initial-acces",
					path: "/api/web/namespaces/system/user/settings/request_initial_access",
				},
				{
					action: "list",
					resourceType: "view_preference",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.GetViewPreference",
					summary: "GET view preference.",
					description:
						"GET view preference gets view preference for specific user.",
					purpose: "List all view-preferences",
					path: "/api/web/namespaces/system/user/settings/view_preference",
				},
				{
					action: "replace",
					resourceType: "view_preference",
					operationId:
						"ves.io.schema.user.setting.CustomAPI.SetViewPreference",
					summary: "Set view preference.",
					description:
						"Set view preference sets view preference for specific user.",
					purpose: "Replace existing view-preference",
					path: "/api/web/namespaces/system/user/settings/view_preference",
				},
				{
					action: "list",
					resourceType: "user_token",
					operationId:
						"ves.io.schema.was.user_token.CustomAPI.GetUserToken",
					summary: "GET Web App Scanning Service User Token.",
					description:
						"GET one time token to connect Web App Scanning Service.",
					purpose: "List all user-tokens",
					path: "/api/config/namespaces/system/was/user_token",
				},
			],
		},
	],
	[
		"threat_campaign",
		{
			domain: "threat_campaign",
			displayName: "Threat Campaign",
			description:
				"F5 Distributed Cloud Threat Campaign API specifications",
			descriptionShort:
				"F5 Distributed Cloud Threat Campaign API specifications",
			resourceTypes: ["threat_campaign"],
			operations: [
				{
					action: "list",
					resourceType: "threat_campaign",
					operationId:
						"ves.io.schema.app_security.ThreatCampaignAPI.GetThreatCampaignById",
					summary: "GET Threat Campaign by ID.",
					description: "GET Threat Campaign by ID.",
					purpose: "Retrieve specific threat-campaign",
					path: "/api/waf/threat_campaign/{id}",
				},
			],
		},
	],
	[
		"users",
		{
			domain: "users",
			displayName: "Users",
			description:
				"Deploy namespace-scoped access credentials with lifecycle state tracking for secure machine enrollment. Build hierarchical tagging frameworks that enable systematic organization of infrastructure elements. Retrieve automated provisioning payloads for streamlined node initialization. Enable system-level automatic tagging that applies predefined metadata to newly created objects without operator action.",
			descriptionShort:
				"Deploy namespace-scoped access credentials with lifecycle...",
			resourceTypes: [
				"create",
				"delete",
				"get-cloud-init-config",
				"implicit_label",
				"known_label",
				"known_label_key",
				"state",
				"token",
			],
			operations: [
				{
					action: "list",
					resourceType: "implicit_label",
					operationId: "ves.io.schema.implicit_label.CustomAPI.Get",
					summary: "GET Implicit Labels.",
					description:
						"GET is generic label query. Two types of queries are supported * Return label with exact matching entry label key = label value. * Return list of labels that have prefix of label key = label value. Returns list of labels. Query will look into current tenants shared namespace and VES-I/O shared.",
					purpose: "List all implicit-labels",
					path: "/api/config/namespaces/system/implicit_labels",
				},
				{
					action: "create",
					resourceType: "create",
					operationId: "ves.io.schema.known_label.CustomAPI.Create",
					summary: "Create",
					description:
						"Create creates a new label in shared namespace. Any other namespace requested will return error.",
					purpose: "Create new create",
					path: "/api/config/namespaces/{namespace}/known_label/create",
				},
				{
					action: "create",
					resourceType: "delete",
					operationId: "ves.io.schema.known_label.CustomAPI.Delete",
					summary: "DELETE",
					description:
						"DELETE will DELETE a given label label key = label value from current tenants shared namespace.",
					purpose: "Create new delete",
					path: "/api/config/namespaces/{namespace}/known_label/delete",
				},
				{
					action: "list",
					resourceType: "known_label",
					operationId: "ves.io.schema.known_label.CustomAPI.Get",
					summary: "GET",
					description:
						"GET is generic label query. Two types of queries are supported Return label with exact matching entry label key = label value. Return list of labels that have prefix of label key = label value. Returns list of labels. Query will look into current tenants shared namespace and VES-I/O shared.",
					purpose: "List all known-labels",
					path: "/api/config/namespaces/{namespace}/known_labels",
				},
				{
					action: "create",
					resourceType: "create",
					operationId:
						"ves.io.schema.known_label_key.CustomAPI.Create",
					summary: "Create",
					description:
						"Create creates a new label key in shared namespace. Any other namespace requested will return error.",
					purpose: "Create new create",
					path: "/api/config/namespaces/{namespace}/known_label_key/create",
				},
				{
					action: "create",
					resourceType: "delete",
					operationId:
						"ves.io.schema.known_label_key.CustomAPI.Delete",
					summary: "DELETE",
					description:
						"DELETE will DELETE a given label key label key from current tenants shared namespace.",
					purpose: "Create new delete",
					path: "/api/config/namespaces/{namespace}/known_label_key/delete",
				},
				{
					action: "list",
					resourceType: "known_label_key",
					operationId: "ves.io.schema.known_label_key.CustomAPI.Get",
					summary: "GET",
					description:
						"GET is generic label key query. Two types of queries are supported Return label with exact matching entry label key. Return list of labels that have prefix of label key . Returns list of label keys. Query will look into current tenants shared namespace and VES-I/O shared.",
					purpose: "List all known-label-keys",
					path: "/api/config/namespaces/{namespace}/known_label_keys",
				},
				{
					action: "list",
					resourceType: "get-cloud-init-config",
					operationId:
						"ves.io.schema.token.CustomAPI.GetCloudInitConfig",
					summary: "GET Cloud Init Config.",
					description:
						"Returns cloud-init counfig for kvm provider with JWT token.",
					purpose: "List all get-cloud-init-configs",
					path: "/api/register/namespaces/system/get-cloud-init-config",
				},
				{
					action: "create",
					resourceType: "token",
					operationId: "ves.io.schema.token.API.Create",
					summary: "Create Token.",
					description:
						"Creates new token. Token object is used to manage site admission. User must generate token before provisioning and pass this token to site during it's registration.",
					purpose: "Create new token",
					path: "/api/register/namespaces/{metadata.namespace}/tokens",
				},
				{
					action: "replace",
					resourceType: "token",
					operationId: "ves.io.schema.token.API.Replace",
					summary: "Replace Token.",
					description:
						"Replaces token. Token object is used to manage site admission. User must generate token before provisioning and pass this token to site during it's registration.",
					purpose: "Replace existing token",
					path: "/api/register/namespaces/{metadata.namespace}/tokens/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "token",
					operationId: "ves.io.schema.token.API.List",
					summary: "List Token.",
					description: "List the set of token in a namespace.",
					purpose: "List all tokens",
					path: "/api/register/namespaces/{namespace}/tokens",
				},
				{
					action: "get",
					resourceType: "token",
					operationId: "ves.io.schema.token.API.Get",
					summary: "GET Token",
					description:
						"GET token. Token object is used to manage site admission. User must generate token before provisioning and pass this token to site during it's registration.",
					purpose: "Retrieve specific token",
					path: "/api/register/namespaces/{namespace}/tokens/{name}",
				},
				{
					action: "delete",
					resourceType: "token",
					operationId: "ves.io.schema.token.API.Delete",
					summary: "DELETE Token.",
					description: "DELETE the specified token.",
					purpose: "Delete token",
					path: "/api/register/namespaces/{namespace}/tokens/{name}",
				},
				{
					action: "create",
					resourceType: "state",
					operationId: "ves.io.schema.token.CustomAPI.TokenState",
					summary: "Set Token State.",
					description:
						"TokenState changes token status, it can be used to disable token.",
					purpose: "Create new state",
					path: "/api/register/namespaces/{namespace}/tokens/{name}/state",
				},
			],
		},
	],
	[
		"virtual",
		{
			domain: "virtual",
			displayName: "Virtual",
			description:
				"Deploy load balancers across protocols with origin pool management and service discovery. Set up geo-location routing to direct traffic based on client location. Define rate limiter policies to control request volume and protect services from abuse. Configure health checks for origin monitoring and automatic failover. Manage service policies for access control and traffic filtering. Enable malware protection and threat campaign blocking for security enforcement.",
			descriptionShort:
				"Deploy load balancers across protocols with origin pool m...",
			resourceTypes: [
				"api_endpoint",
				"assign",
				"available",
				"ca_certificate",
				"calls_by_response_code",
				"cluster",
				"create_ticket",
				"dos_automitigation_rule",
				"geo_location_set",
				"get-dns-info",
				"get_schema_update",
				"get_security_config",
				"healthcheck",
				"http_loadbalancer",
				"l7ddos_rps_threshold",
				"learnt_schema",
				"origin_pool",
				"pdf",
				"proxy",
				"rate_limiter_policy",
				"service_policy",
				"service_policy_rule",
				"service_policy_set",
				"sources_openapi_schema",
				"stat",
				"subscribe",
				"swagger_spec",
				"tcp_loadbalancer",
				"top_active",
				"top_sensitive_data",
				"udp_loadbalancer",
				"unlink_ticket",
				"unmerge_sources_openapi_schema",
				"unsubscribe",
				"update_schema",
				"update_state",
				"virtual_host",
				"vulnerability",
			],
			operations: [
				{
					action: "create",
					resourceType: "cluster",
					operationId: "ves.io.schema.cluster.API.Create",
					summary: "Create Cluster.",
					description:
						"Create cluster will create the object in the storage backend for namespace metadata.namespace.",
					purpose: "Create new cluster",
					path: "/api/config/namespaces/{metadata.namespace}/clusters",
				},
				{
					action: "replace",
					resourceType: "cluster",
					operationId: "ves.io.schema.cluster.API.Replace",
					summary: "Replace Cluster.",
					description:
						"Replacing an cluster object will update the object by replacing the existing spec with the provided one. For read-then-write operations a resourceVersion mismatch will occur if the object was modified between the read and write.",
					purpose: "Replace existing cluster",
					path: "/api/config/namespaces/{metadata.namespace}/clusters/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "cluster",
					operationId: "ves.io.schema.cluster.API.List",
					summary: "List Cluster.",
					description: "List the set of cluster in a namespace.",
					purpose: "List all clusters",
					path: "/api/config/namespaces/{namespace}/clusters",
				},
				{
					action: "get",
					resourceType: "cluster",
					operationId: "ves.io.schema.cluster.API.Get",
					summary: "GET Cluster.",
					description:
						"GET cluster will GET the object from the storage backend for namespace metadata.namespace.",
					purpose: "Retrieve specific cluster",
					path: "/api/config/namespaces/{namespace}/clusters/{name}",
				},
				{
					action: "delete",
					resourceType: "cluster",
					operationId: "ves.io.schema.cluster.API.Delete",
					summary: "DELETE Cluster.",
					description: "DELETE the specified cluster.",
					purpose: "Delete cluster",
					path: "/api/config/namespaces/{namespace}/clusters/{name}",
				},
				{
					action: "create",
					resourceType: "http_loadbalancer",
					operationId:
						"ves.io.schema.views.http_loadbalancer.API.Create",
					summary: "Create HTTP Load Balancer.",
					description:
						"Shape of the HTTP load balancer specification.",
					purpose: "Create new http-loadbalancer",
					path: "/api/config/namespaces/{metadata.namespace}/http_loadbalancers",
				},
				{
					action: "replace",
					resourceType: "http_loadbalancer",
					operationId:
						"ves.io.schema.views.http_loadbalancer.API.Replace",
					summary: "Replace HTTP Load Balancer.",
					description:
						"Shape of the HTTP load balancer specification.",
					purpose: "Replace existing http-loadbalancer",
					path: "/api/config/namespaces/{metadata.namespace}/http_loadbalancers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "http_loadbalancer",
					operationId:
						"ves.io.schema.views.http_loadbalancer.API.List",
					summary: "List Configure HTTP Load Balancer.",
					description:
						"List the set of http_loadbalancer in a namespace.",
					purpose: "List all http-loadbalancers",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers",
				},
				{
					action: "create",
					resourceType: "get_security_config",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CustomAPI.GetSecurityConfig",
					summary: "GET Security Config for HTTP Load Balancer.",
					description:
						"Fetch the corresponding Security Config for the given HTTP load balancers.",
					purpose: "Create new get-security-config",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers/get_security_config",
				},
				{
					action: "get",
					resourceType: "http_loadbalancer",
					operationId:
						"ves.io.schema.views.http_loadbalancer.API.Get",
					summary: "GET HTTP Load Balancer.",
					description:
						"Shape of the HTTP load balancer specification.",
					purpose: "Retrieve specific http-loadbalancer",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers/{name}",
				},
				{
					action: "delete",
					resourceType: "http_loadbalancer",
					operationId:
						"ves.io.schema.views.http_loadbalancer.API.Delete",
					summary: "DELETE Configure HTTP Load Balancer.",
					description: "DELETE the specified http_loadbalancer.",
					purpose: "Delete http-loadbalancer",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers/{name}",
				},
				{
					action: "create",
					resourceType: "assign",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CustomAPI.AssignAPIDefinition",
					summary: "Assign API Definition.",
					description:
						"Set a reference to the API Definition, with an option to create an empty one if not exists. DEPRECATED. Instead use virtual host public custom API - AssignAPIDefinition.",
					purpose: "Create new assign",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers/{name}/api_definitions/assign",
				},
				{
					action: "get",
					resourceType: "available",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CustomAPI.ListAvailableAPIDefinitions",
					summary: "List Available API Definitions.",
					description:
						"List API definitions suitable for API Inventory management API Definitions which are associated at most with one app type. DEPRECATED: instead use ListAvailableAPIDefinitions in VES.I/o.schema.views.api_definition.publicconfigcustomapi.",
					purpose: "Retrieve specific available",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers/{name}/api_definitions/available",
				},
				{
					action: "create",
					resourceType: "api_endpoint",
					operationId:
						"ves.io.schema.views.http_loadbalancer.ApiepLBCustomAPI.GetAPIEndpointsForGroups",
					summary: "GET API Endpoints.",
					description:
						"GET list of all API Endpoints associated with the HTTP loadbalancer in format suitable for API Groups management. Deprecated: instead use GetAPIEndpoints in VES.I/o.schema.virtual_host.apiepcustomapi.",
					purpose: "Create new api-endpoint",
					path: "/api/ml/data/namespaces/{namespace}/http_loadbalancers/{name}/api_endpoints",
				},
				{
					action: "get",
					resourceType: "swagger_spec",
					operationId:
						"ves.io.schema.views.http_loadbalancer.ApiepLBCustomAPI.GetSwaggerSpec",
					summary: "GET Swagger Spec for HTTP Load Balancer.",
					description:
						"GET the corresponding Swagger spec for the given HTTP load balancer.",
					purpose: "Retrieve specific swagger-spec",
					path: "/api/ml/data/namespaces/{namespace}/http_loadbalancers/{name}/api_endpoints/swagger_spec",
				},
				{
					action: "create",
					resourceType: "get_schema_update",
					operationId:
						"ves.io.schema.views.http_loadbalancer.ApiepLBCustomAPI.GetAPIEndpointsSchemaUpdates",
					summary: "GET API Endpoints Schema Updates.",
					description:
						"GET list of schema pairs, current and updated, for each endpoint in the request or all pending changes if empty list is provided. NOTE: any API endpoint defined in user swagger files should be ignored DEPRECATED. USE virtual host custom API GetAPIEndpointsSchemaUpdates.",
					purpose: "Create new get-schema-update",
					path: "/api/ml/data/namespaces/{namespace}/http_loadbalancers/{name}/api_inventory/api_endpoints/get_schema_updates",
				},
				{
					action: "create",
					resourceType: "update_schema",
					operationId:
						"ves.io.schema.views.http_loadbalancer.ApiepLBCustomAPI.UpdateAPIEndpointsSchemas",
					summary: "Update API Endpoints Schemas.",
					description:
						"Update the payload schema for the specified endpoints or all pending changes if empty list is provided. NOTE: only API endpoints returned by a call to `GetAPIEndpointsSchemaStates` can be updated. DEPRECATED. USE virtual host custom API UpdateAPIEndpointsSchemas.",
					purpose: "Create new update-schema",
					path: "/api/ml/data/namespaces/{namespace}/http_loadbalancers/{name}/api_inventory/api_endpoints/update_schemas",
				},
				{
					action: "get",
					resourceType: "dos_automitigation_rule",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CustomAPI.GetDoSAutoMitigationRules",
					summary:
						"GET DoS Auto-Mitigation Rules for HTTP Load Balancer.",
					description:
						"GET the corresponding DoS Auto-Mitigation Rules for the given HTTP load balancer.",
					purpose: "Retrieve specific dos-automitigation-rule",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers/{name}/dos_automitigation_rules",
				},
				{
					action: "delete",
					resourceType: "dos_automitigation_rule",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CustomAPI.DeleteDoSAutoMitigationRule",
					summary:
						"DELETE DoS Auto-Mitigation Rule for HTTP Load Balancer.",
					description:
						"DELETE the corresponding DoS Auto-Mitigation Rule for the given HTTP load balancer.",
					purpose: "Delete dos-automitigation-rule",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers/{name}/dos_automitigation_rules/{dos_automitigation_rule_name}",
				},
				{
					action: "get",
					resourceType: "get-dns-info",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CustomAPI.GetDnsInfo",
					summary: "GET DNS Info.",
					description:
						"GetDnsInfo is an API to GET DNS information for a given HTTP load balancer.",
					purpose: "Retrieve specific get-dns-info",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers/{name}/get-dns-info",
				},
				{
					action: "create",
					resourceType: "l7ddos_rps_threshold",
					operationId:
						"ves.io.schema.views.http_loadbalancer.CustomAPI.SetL7DDoSRPSThreshold",
					summary: "Set L7 DDoS RPS Threshold.",
					description:
						"Sets the L7 DDoS RPS threshold for HTTP load balancer.",
					purpose: "Create new l7ddos-rps-threshold",
					path: "/api/config/namespaces/{namespace}/http_loadbalancers/{name}/l7ddos_rps_threshold",
				},
				{
					action: "create",
					resourceType: "tcp_loadbalancer",
					operationId:
						"ves.io.schema.views.tcp_loadbalancer.API.Create",
					summary: "Create TCP Load Balancer.",
					description:
						"Shape of the TCP load balancer create specification.",
					purpose: "Create new tcp-loadbalancer",
					path: "/api/config/namespaces/{metadata.namespace}/tcp_loadbalancers",
				},
				{
					action: "replace",
					resourceType: "tcp_loadbalancer",
					operationId:
						"ves.io.schema.views.tcp_loadbalancer.API.Replace",
					summary: "Replace TCP Load Balancer.",
					description:
						"Shape of the TCP load balancer replace specification.",
					purpose: "Replace existing tcp-loadbalancer",
					path: "/api/config/namespaces/{metadata.namespace}/tcp_loadbalancers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "tcp_loadbalancer",
					operationId:
						"ves.io.schema.views.tcp_loadbalancer.API.List",
					summary: "List Configure TCP Load Balancer.",
					description:
						"List the set of tcp_loadbalancer in a namespace.",
					purpose: "List all tcp-loadbalancers",
					path: "/api/config/namespaces/{namespace}/tcp_loadbalancers",
				},
				{
					action: "get",
					resourceType: "tcp_loadbalancer",
					operationId: "ves.io.schema.views.tcp_loadbalancer.API.Get",
					summary: "GET TCP Load Balancer.",
					description:
						"Shape of the TCP load balancer GET specification.",
					purpose: "Retrieve specific tcp-loadbalancer",
					path: "/api/config/namespaces/{namespace}/tcp_loadbalancers/{name}",
				},
				{
					action: "delete",
					resourceType: "tcp_loadbalancer",
					operationId:
						"ves.io.schema.views.tcp_loadbalancer.API.Delete",
					summary: "DELETE Configure TCP Load Balancer.",
					description: "DELETE the specified tcp_loadbalancer.",
					purpose: "Delete tcp-loadbalancer",
					path: "/api/config/namespaces/{namespace}/tcp_loadbalancers/{name}",
				},
				{
					action: "get",
					resourceType: "get-dns-info",
					operationId:
						"ves.io.schema.views.tcp_loadbalancer.CustomAPI.GetDnsInfo",
					summary: "GET DNS Info.",
					description:
						"GetDnsInfo is an API to GET DNS information for a given TCP load balancer.",
					purpose: "Retrieve specific get-dns-info",
					path: "/api/config/namespaces/{namespace}/tcp_loadbalancers/{name}/get-dns-info",
				},
				{
					action: "create",
					resourceType: "udp_loadbalancer",
					operationId:
						"ves.io.schema.views.udp_loadbalancer.API.Create",
					summary: "Create UDP Load Balancer.",
					description:
						"Shape of the UDP load balancer create specification.",
					purpose: "Create new udp-loadbalancer",
					path: "/api/config/namespaces/{metadata.namespace}/udp_loadbalancers",
				},
				{
					action: "replace",
					resourceType: "udp_loadbalancer",
					operationId:
						"ves.io.schema.views.udp_loadbalancer.API.Replace",
					summary: "Replace UDP Load Balancer.",
					description:
						"Shape of the UDP load balancer replace specification.",
					purpose: "Replace existing udp-loadbalancer",
					path: "/api/config/namespaces/{metadata.namespace}/udp_loadbalancers/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "udp_loadbalancer",
					operationId:
						"ves.io.schema.views.udp_loadbalancer.API.List",
					summary: "List Configure UDP Load Balancer.",
					description:
						"List the set of udp_loadbalancer in a namespace.",
					purpose: "List all udp-loadbalancers",
					path: "/api/config/namespaces/{namespace}/udp_loadbalancers",
				},
				{
					action: "get",
					resourceType: "udp_loadbalancer",
					operationId: "ves.io.schema.views.udp_loadbalancer.API.Get",
					summary: "GET UDP Load Balancer.",
					description:
						"Shape of the UDP load balancer GET specification.",
					purpose: "Retrieve specific udp-loadbalancer",
					path: "/api/config/namespaces/{namespace}/udp_loadbalancers/{name}",
				},
				{
					action: "delete",
					resourceType: "udp_loadbalancer",
					operationId:
						"ves.io.schema.views.udp_loadbalancer.API.Delete",
					summary: "DELETE Configure UDP Load Balancer.",
					description: "DELETE the specified udp_loadbalancer.",
					purpose: "Delete udp-loadbalancer",
					path: "/api/config/namespaces/{namespace}/udp_loadbalancers/{name}",
				},
				{
					action: "get",
					resourceType: "get-dns-info",
					operationId:
						"ves.io.schema.views.udp_loadbalancer.CustomAPI.GetDnsInfo",
					summary: "GET DNS Info.",
					description:
						"GetDnsInfo is an API to GET DNS information for a given UDP load balancer.",
					purpose: "Retrieve specific get-dns-info",
					path: "/api/config/namespaces/{namespace}/udp_loadbalancers/{name}/get-dns-info",
				},
				{
					action: "create",
					resourceType: "subscribe",
					operationId:
						"ves.io.schema.malware_protection.subscription.CustomAPI.Subscribe",
					summary: "Subscribe to Malware Protection.",
					description: "Subscribe to Malware Protection.",
					purpose: "Create new subscribe",
					path: "/api/config/namespaces/system/malware_protection/addon/subscribe",
				},
				{
					action: "create",
					resourceType: "unsubscribe",
					operationId:
						"ves.io.schema.malware_protection.subscription.CustomAPI.Unsubscribe",
					summary: "Unsubscribe to Malware Protection.",
					description: "Unsubscribe to Malware Protection.",
					purpose: "Create new unsubscribe",
					path: "/api/config/namespaces/system/malware_protection/addon/unsubscribe",
				},
				{
					action: "create",
					resourceType: "geo_location_set",
					operationId: "ves.io.schema.geo_location_set.API.Create",
					summary: "Create Geolocation.",
					description: "Creates a Geolocation Set.",
					purpose: "Create new geo-location-set",
					path: "/api/config/dns/namespaces/{metadata.namespace}/geo_location_sets",
				},
				{
					action: "replace",
					resourceType: "geo_location_set",
					operationId: "ves.io.schema.geo_location_set.API.Replace",
					summary: "Replace Geolocation Set.",
					description: "Amends a Geolocation Set.",
					purpose: "Replace existing geo-location-set",
					path: "/api/config/dns/namespaces/{metadata.namespace}/geo_location_sets/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "geo_location_set",
					operationId: "ves.io.schema.geo_location_set.API.List",
					summary: "List Geolocation Set.",
					description:
						"List the set of geo_location_set in a namespace.",
					purpose: "List all geo-location-sets",
					path: "/api/config/dns/namespaces/{namespace}/geo_location_sets",
				},
				{
					action: "get",
					resourceType: "geo_location_set",
					operationId: "ves.io.schema.geo_location_set.API.Get",
					summary: "GET Geolocation Set.",
					description: "Reads a Geolocation.",
					purpose: "Retrieve specific geo-location-set",
					path: "/api/config/dns/namespaces/{namespace}/geo_location_sets/{name}",
				},
				{
					action: "delete",
					resourceType: "geo_location_set",
					operationId: "ves.io.schema.geo_location_set.API.Delete",
					summary: "DELETE Geolocation Set.",
					description: "DELETE the specified geo_location_set.",
					purpose: "Delete geo-location-set",
					path: "/api/config/dns/namespaces/{namespace}/geo_location_sets/{name}",
				},
				{
					action: "create",
					resourceType: "healthcheck",
					operationId: "ves.io.schema.healthcheck.API.Create",
					summary: "Create Health Check.",
					description:
						"Healthcheck object defines method to determine if the given Endpoint is healthy. Single Healthcheck object can be referred to by one or many Cluster objects.",
					purpose: "Create new healthcheck",
					path: "/api/config/namespaces/{metadata.namespace}/healthchecks",
				},
				{
					action: "replace",
					resourceType: "healthcheck",
					operationId: "ves.io.schema.healthcheck.API.Replace",
					summary: "Replace Health Check.",
					description:
						"Healthcheck object defines method to determine if the given Endpoint is healthy. Single Healthcheck object can be referred to by one or many Cluster objects.",
					purpose: "Replace existing healthcheck",
					path: "/api/config/namespaces/{metadata.namespace}/healthchecks/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "healthcheck",
					operationId: "ves.io.schema.healthcheck.API.List",
					summary: "List Health Check.",
					description: "List the set of healthcheck in a namespace.",
					purpose: "List all healthchecks",
					path: "/api/config/namespaces/{namespace}/healthchecks",
				},
				{
					action: "get",
					resourceType: "healthcheck",
					operationId: "ves.io.schema.healthcheck.API.Get",
					summary: "GET Health Check.",
					description:
						"Healthcheck object defines method to determine if the given Endpoint is healthy. Single Healthcheck object can be referred to by one or many Cluster objects.",
					purpose: "Retrieve specific healthcheck",
					path: "/api/config/namespaces/{namespace}/healthchecks/{name}",
				},
				{
					action: "delete",
					resourceType: "healthcheck",
					operationId: "ves.io.schema.healthcheck.API.Delete",
					summary: "DELETE Health Check.",
					description: "DELETE the specified healthcheck.",
					purpose: "Delete healthcheck",
					path: "/api/config/namespaces/{namespace}/healthchecks/{name}",
				},
				{
					action: "create",
					resourceType: "origin_pool",
					operationId: "ves.io.schema.views.origin_pool.API.Create",
					summary: "Create Origin Pool.",
					description:
						"Shape of the origin pool create specification.",
					purpose: "Create new origin-pool",
					path: "/api/config/namespaces/{metadata.namespace}/origin_pools",
				},
				{
					action: "replace",
					resourceType: "origin_pool",
					operationId: "ves.io.schema.views.origin_pool.API.Replace",
					summary: "Replace Origin Pool.",
					description:
						"Shape of the origin pool create specification.",
					purpose: "Replace existing origin-pool",
					path: "/api/config/namespaces/{metadata.namespace}/origin_pools/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "origin_pool",
					operationId: "ves.io.schema.views.origin_pool.API.List",
					summary: "List Origin Pool.",
					description: "List the set of origin_pool in a namespace.",
					purpose: "List all origin-pools",
					path: "/api/config/namespaces/{namespace}/origin_pools",
				},
				{
					action: "get",
					resourceType: "origin_pool",
					operationId: "ves.io.schema.views.origin_pool.API.Get",
					summary: "GET Origin Pool.",
					description: "Shape of the origin pool GET specification.",
					purpose: "Retrieve specific origin-pool",
					path: "/api/config/namespaces/{namespace}/origin_pools/{name}",
				},
				{
					action: "delete",
					resourceType: "origin_pool",
					operationId: "ves.io.schema.views.origin_pool.API.Delete",
					summary: "DELETE Origin Pool.",
					description: "DELETE the specified origin_pool.",
					purpose: "Delete origin-pool",
					path: "/api/config/namespaces/{namespace}/origin_pools/{name}",
				},
				{
					action: "create",
					resourceType: "proxy",
					operationId: "ves.io.schema.views.proxy.API.Create",
					summary: "Create Proxy.",
					description:
						"Shape of the TCP loadbalancer create specification.",
					purpose: "Create new proxy",
					path: "/api/config/namespaces/{metadata.namespace}/proxys",
				},
				{
					action: "replace",
					resourceType: "proxy",
					operationId: "ves.io.schema.views.proxy.API.Replace",
					summary: "Replace Proxy.",
					description:
						"Shape of the TCP loadbalancer replace specification.",
					purpose: "Replace existing proxy",
					path: "/api/config/namespaces/{metadata.namespace}/proxys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "proxy",
					operationId: "ves.io.schema.views.proxy.API.List",
					summary: "List Proxy.",
					description: "List the set of proxy in a namespace.",
					purpose: "List all proxys",
					path: "/api/config/namespaces/{namespace}/proxys",
				},
				{
					action: "get",
					resourceType: "proxy",
					operationId: "ves.io.schema.views.proxy.API.Get",
					summary: "GET Proxy",
					description:
						"Shape of the TCP loadbalancer GET specification.",
					purpose: "Retrieve specific proxy",
					path: "/api/config/namespaces/{namespace}/proxys/{name}",
				},
				{
					action: "delete",
					resourceType: "proxy",
					operationId: "ves.io.schema.views.proxy.API.Delete",
					summary: "DELETE Proxy.",
					description: "DELETE the specified proxy.",
					purpose: "Delete proxy",
					path: "/api/config/namespaces/{namespace}/proxys/{name}",
				},
				{
					action: "get",
					resourceType: "ca_certificate",
					operationId:
						"ves.io.schema.views.proxy.CustomAPI.GetProxyServerCACert",
					summary: "GET proxy Server CA Certificate.",
					description:
						"GetProxyServerCACert returns PEM encoded proxy server CA certificate.",
					purpose: "Retrieve specific ca-certificate",
					path: "/api/config/namespaces/{namespace}/proxys/{name}/ca_certificate",
				},
				{
					action: "create",
					resourceType: "rate_limiter_policy",
					operationId:
						"ves.io.schema.views.rate_limiter_policy.API.Create",
					summary: "Create Specification.",
					description:
						"Shape of the Rate Limiter Policy Create specification.",
					purpose: "Create new rate-limiter-policy",
					path: "/api/config/namespaces/{metadata.namespace}/rate_limiter_policys",
				},
				{
					action: "replace",
					resourceType: "rate_limiter_policy",
					operationId:
						"ves.io.schema.views.rate_limiter_policy.API.Replace",
					summary: "Replace Specification.",
					description:
						"Shape of the Rate Limiter Policy Replace specification.",
					purpose: "Replace existing rate-limiter-policy",
					path: "/api/config/namespaces/{metadata.namespace}/rate_limiter_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "rate_limiter_policy",
					operationId:
						"ves.io.schema.views.rate_limiter_policy.API.List",
					summary: "List Rate Limiter Policy.",
					description:
						"List the set of rate_limiter_policy in a namespace.",
					purpose: "List all rate-limiter-policys",
					path: "/api/config/namespaces/{namespace}/rate_limiter_policys",
				},
				{
					action: "get",
					resourceType: "rate_limiter_policy",
					operationId:
						"ves.io.schema.views.rate_limiter_policy.API.Get",
					summary: "GET Specification.",
					description:
						"Shape of the Rate Limiter Policy GET specification.",
					purpose: "Retrieve specific rate-limiter-policy",
					path: "/api/config/namespaces/{namespace}/rate_limiter_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "rate_limiter_policy",
					operationId:
						"ves.io.schema.views.rate_limiter_policy.API.Delete",
					summary: "DELETE Rate Limiter Policy.",
					description: "DELETE the specified rate_limiter_policy.",
					purpose: "Delete rate-limiter-policy",
					path: "/api/config/namespaces/{namespace}/rate_limiter_policys/{name}",
				},
				{
					action: "create",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.Create",
					summary: "Create Service Policy.",
					description:
						"Create service_policy creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new service-policy",
					path: "/api/config/namespaces/{metadata.namespace}/service_policys",
				},
				{
					action: "replace",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.Replace",
					summary: "Replace Service Policy.",
					description:
						"Replace service_policy replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing service-policy",
					path: "/api/config/namespaces/{metadata.namespace}/service_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.List",
					summary: "List Service Policy.",
					description:
						"List the set of service_policy in a namespace.",
					purpose: "List all service-policys",
					path: "/api/config/namespaces/{namespace}/service_policys",
				},
				{
					action: "get",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.Get",
					summary: "GET Service Policy.",
					description:
						"GET service_policy reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific service-policy",
					path: "/api/config/namespaces/{namespace}/service_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "service_policy",
					operationId: "ves.io.schema.service_policy.API.Delete",
					summary: "DELETE Service Policy.",
					description: "DELETE the specified service_policy.",
					purpose: "Delete service-policy",
					path: "/api/config/namespaces/{namespace}/service_policys/{name}",
				},
				{
					action: "create",
					resourceType: "service_policy_rule",
					operationId: "ves.io.schema.service_policy_rule.API.Create",
					summary: "Create Service Policy Rule.",
					description:
						"Create service_policy_rule creates a new object in the storage backend for metadata.namespace.",
					purpose: "Create new service-policy-rule",
					path: "/api/config/namespaces/{metadata.namespace}/service_policy_rules",
				},
				{
					action: "replace",
					resourceType: "service_policy_rule",
					operationId:
						"ves.io.schema.service_policy_rule.API.Replace",
					summary: "Replace Service Policy Rule.",
					description:
						"Replace service_policy_rule replaces an existing object in the storage backend for metadata.namespace.",
					purpose: "Replace existing service-policy-rule",
					path: "/api/config/namespaces/{metadata.namespace}/service_policy_rules/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "service_policy_rule",
					operationId: "ves.io.schema.service_policy_rule.API.List",
					summary: "List Service Policy Rule.",
					description:
						"List the set of service_policy_rule in a namespace.",
					purpose: "List all service-policy-rules",
					path: "/api/config/namespaces/{namespace}/service_policy_rules",
				},
				{
					action: "get",
					resourceType: "service_policy_rule",
					operationId: "ves.io.schema.service_policy_rule.API.Get",
					summary: "GET Service Policy Rule.",
					description:
						"GET service_policy_rule reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific service-policy-rule",
					path: "/api/config/namespaces/{namespace}/service_policy_rules/{name}",
				},
				{
					action: "delete",
					resourceType: "service_policy_rule",
					operationId: "ves.io.schema.service_policy_rule.API.Delete",
					summary: "DELETE Service Policy Rule.",
					description: "DELETE the specified service_policy_rule.",
					purpose: "Delete service-policy-rule",
					path: "/api/config/namespaces/{namespace}/service_policy_rules/{name}",
				},
				{
					action: "list",
					resourceType: "service_policy_set",
					operationId: "ves.io.schema.service_policy_set.API.List",
					summary: "List Service Policy Set.",
					description:
						"List the set of service_policy_set in a namespace.",
					purpose: "List all service-policy-sets",
					path: "/api/config/namespaces/{namespace}/service_policy_sets",
				},
				{
					action: "get",
					resourceType: "service_policy_set",
					operationId: "ves.io.schema.service_policy_set.API.Get",
					summary: "GET Service Policy Set.",
					description:
						"GET service_policy_set reads a given object from storage backend for metadata.namespace.",
					purpose: "Retrieve specific service-policy-set",
					path: "/api/config/namespaces/{namespace}/service_policy_sets/{name}",
				},
				{
					action: "create",
					resourceType: "virtual_host",
					operationId: "ves.io.schema.virtual_host.API.Create",
					summary: "Create Virtual Host.",
					description: "Creates virtual host in a given namespace.",
					purpose: "Create new virtual-host",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_hosts",
				},
				{
					action: "replace",
					resourceType: "virtual_host",
					operationId: "ves.io.schema.virtual_host.API.Replace",
					summary: "Replace Virtual Host.",
					description:
						"Replace a given virtual host in a given namespace.",
					purpose: "Replace existing virtual-host",
					path: "/api/config/namespaces/{metadata.namespace}/virtual_hosts/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "virtual_host",
					operationId: "ves.io.schema.virtual_host.API.List",
					summary: "List Virtual Host.",
					description: "List the set of virtual_host in a namespace.",
					purpose: "List all virtual-hosts",
					path: "/api/config/namespaces/{namespace}/virtual_hosts",
				},
				{
					action: "get",
					resourceType: "virtual_host",
					operationId: "ves.io.schema.virtual_host.API.Get",
					summary: "GET Virtual Host.",
					description: "GET virtual host from a given namespace.",
					purpose: "Retrieve specific virtual-host",
					path: "/api/config/namespaces/{namespace}/virtual_hosts/{name}",
				},
				{
					action: "delete",
					resourceType: "virtual_host",
					operationId: "ves.io.schema.virtual_host.API.Delete",
					summary: "DELETE Virtual Host.",
					description: "DELETE the specified virtual_host.",
					purpose: "Delete virtual-host",
					path: "/api/config/namespaces/{namespace}/virtual_hosts/{name}",
				},
				{
					action: "create",
					resourceType: "assign",
					operationId:
						"ves.io.schema.virtual_host.CustomAPI.AssignAPIDefinition",
					summary: "Assign API Definition.",
					description:
						"Set a reference to the API Definition, with an option to create an empty one if not exists.",
					purpose: "Create new assign",
					path: "/api/config/namespaces/{namespace}/virtual_hosts/{name}/api_definitions/assign",
				},
				{
					action: "create",
					resourceType: "api_endpoint",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetAPIEndpoint",
					summary: "GET API Endpoint.",
					description: "GET API endpoint for Virtual Host.",
					purpose: "Create new api-endpoint",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoint",
				},
				{
					action: "get",
					resourceType: "learnt_schema",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetAPIEndpointLearntSchema",
					summary: "GET GET Learnt Schema per API endpoint.",
					description:
						"GET Learnt Schema per API endpoint for a given auto discovered API endpoint for Virtual Host.",
					purpose: "Retrieve specific learnt-schema",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoint/learnt_schema",
				},
				{
					action: "get",
					resourceType: "pdf",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetAPIEndpointPDF",
					summary: "GET API Endpoint PDF.",
					description:
						"GET PDF of all metrics for a given auto discovered API endpoint for Virtual Host.",
					purpose: "Retrieve specific pdf",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoint/pdf",
				},
				{
					action: "get",
					resourceType: "sources_openapi_schema",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetAPIEPSourceOpenApiSchema",
					summary:
						"GET relevant source OpenApi schema per API endpoint.",
					description:
						"GET openapi schema per API endpoint for a given source types and Virtual Host.",
					purpose: "Retrieve specific sources-openapi-schema",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoint/sources_openapi_schema",
				},
				{
					action: "create",
					resourceType: "unmerge_sources_openapi_schema",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.UnmergeAPIEPSourceOpenApiSchema",
					summary: "Unmerge Source from API Endpoint.",
					description:
						"Unmerge Source Discovered schema from API Endpoint merged schema.",
					purpose: "Create new unmerge-sources-openapi-schema",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoint/unmerge_sources_openapi_schema",
				},
				{
					action: "get",
					resourceType: "api_endpoint",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetAPIEndpoints",
					summary: "GET API Endpoints.",
					description:
						"GET all autodiscovered API endpoints for Virtual Host.",
					purpose: "Retrieve specific api-endpoint",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoints",
				},
				{
					action: "get",
					resourceType: "stat",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetApiEndpointsStats",
					summary: "GET API Endpoints Stats for Virtual Host.",
					description:
						"GET API endpoints stats for the given Virtual Host.",
					purpose: "Retrieve specific stat",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoints/stats",
				},
				{
					action: "create",
					resourceType: "calls_by_response_code",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetAPICallSummary",
					summary: "GET Total API Calls for Virtual Host.",
					description:
						"GET total API calls for the given Virtual Host.",
					purpose: "Create new calls-by-response-code",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoints/summary/calls_by_response_code",
				},
				{
					action: "create",
					resourceType: "top_active",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetTopAPIEndpoints",
					summary: "GET Top APIs Endpoints for Virtual Host.",
					description:
						"Top APIs by requested activity metric. For example most-active APIs or most-attacked APIs.",
					purpose: "Create new top-active",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoints/summary/top_active",
				},
				{
					action: "create",
					resourceType: "top_sensitive_data",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetTopSensitiveData",
					summary: "GET Sensitive Data Summary for Virtual Host.",
					description:
						"GET sensitive data summary for the given Virtual Host. For each sensitive data type (e.g. SSN, CC, Email) we count the number of APIEPs having the respective sensitive data type and return top k (max 10) types with maximum APIEPs.",
					purpose: "Create new top-sensitive-data",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoints/summary/top_sensitive_data",
				},
				{
					action: "get",
					resourceType: "swagger_spec",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetSwaggerSpec",
					summary: "GET Swagger Spec for App Type.",
					description:
						"GET the corresponding Swagger spec for the given app type.",
					purpose: "Retrieve specific swagger-spec",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_endpoints/swagger_spec",
				},
				{
					action: "create",
					resourceType: "get_schema_update",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetAPIEndpointsSchemaUpdates",
					summary: "GET API Endpoints Schema Updates.",
					description:
						"GET list of schema paiComparablers, current and updated, for each endpoint in the request or all pending changes if empty list is provided. NOTE: any API endpoint defined in user swagger files should be ignored.",
					purpose: "Create new get-schema-update",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_inventory/api_endpoints/get_schema_updates",
				},
				{
					action: "create",
					resourceType: "update_schema",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.UpdateAPIEndpointsSchemas",
					summary: "Update API Endpoints Schemas.",
					description:
						"Update the payload schema for the specified endpoints or all pending changes if empty list is provided. NOTE: only API endpoints returned by a call to `GetAPIEndpointsSchemaStates` can be updated.",
					purpose: "Create new update-schema",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/api_inventory/api_endpoints/update_schemas",
				},
				{
					action: "create",
					resourceType: "create_ticket",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.CreateTicket",
					summary: "Create a ticket for a vulnerability.",
					description: "Create a ticket for the given vulnerability.",
					purpose: "Create new create-ticket",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/create_ticket",
				},
				{
					action: "get",
					resourceType: "get-dns-info",
					operationId:
						"ves.io.schema.virtual_host.CustomAPI.GetDnsInfo",
					summary: "GET DNS Info.",
					description:
						"GetDnsInfo is an API to GET DNS information for a given virtual host.",
					purpose: "Retrieve specific get-dns-info",
					path: "/api/config/namespaces/{namespace}/virtual_hosts/{name}/get-dns-info",
				},
				{
					action: "create",
					resourceType: "unlink_ticket",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.UnlinkTickets",
					summary: "Unlink Tickets.",
					description:
						"Remove the Ticket from vulnerability in XC platform External ticket systems will continue to have the record.",
					purpose: "Create new unlink-ticket",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/unlink_tickets",
				},
				{
					action: "create",
					resourceType: "vulnerability",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.GetVulnerabilities",
					summary: "GET Vulnerabilities for Virtual Host.",
					description:
						"GET vulnerabilities for the given Virtual Host.",
					purpose: "Create new vulnerabilitie",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/vulnerabilities",
				},
				{
					action: "create",
					resourceType: "update_state",
					operationId:
						"ves.io.schema.virtual_host.ApiepCustomAPI.UpdateVulnerabilitiesState",
					summary: "Update Vulnerabilities for Virtual Host.",
					description:
						"Update vulnerabilities for the given Virtual Host.",
					purpose: "Create new update-state",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{name}/vulnerability/update_state",
				},
			],
		},
	],
	[
		"vpm_and_node_management",
		{
			domain: "vpm_and_node_management",
			displayName: "Vpm And Node Management",
			description:
				"F5 Distributed Cloud Vpm And Node Management API specifications",
			descriptionShort:
				"F5 Distributed Cloud Vpm And Node Management API specific...",
			resourceTypes: ["upgrade_statu"],
			operations: [
				{
					action: "list",
					resourceType: "upgrade_statu",
					operationId:
						"ves.io.schema.maintenance_status.CustomAPI.GetUpgradeStatus",
					summary: "Upgrade Status.",
					description: "Request to GET the upgrade status.",
					purpose: "List all upgrade-status",
					path: "/api/data/namespaces/system/upgrade_status",
				},
			],
		},
	],
	[
		"waf",
		{
			domain: "waf",
			displayName: "Waf",
			description:
				"Set up firewall configurations with attack type settings and violation detection. Create exclusion policies to tune false positives and customize blocking responses. Deploy staged signatures before production release and monitor rule hits through security event metrics. Integrate with virtual hosts for layered protection using AI-based risk blocking and anonymization settings for sensitive data handling.",
			descriptionShort:
				"Set up firewall configurations with attack type settings ...",
			resourceTypes: [
				"active_staged_signature",
				"aggregation",
				"all_ns_event",
				"all_ns_metric",
				"app_firewall",
				"enhanced_firewall_policy",
				"event",
				"hit",
				"incident",
				"loadbalancer",
				"metric",
				"protocol_inspection",
				"released_signature",
				"rule_hit",
				"scroll",
				"security_event",
				"staged_signature",
				"suspicious_user_log",
				"waf_exclusion_policy",
			],
			operations: [
				{
					action: "create",
					resourceType: "all_ns_metric",
					operationId:
						"ves.io.schema.app_firewall.CustomDataAPI.MetricsAllNamespaces",
					summary: "MetricsAllNamespaces.",
					description: "App Firewall metrics.",
					purpose: "Create new all-ns-metric",
					path: "/api/data/namespaces/system/app_firewall/all_ns_metrics",
				},
				{
					action: "create",
					resourceType: "app_firewall",
					operationId: "ves.io.schema.app_firewall.API.Create",
					summary: "Create Application Firewall.",
					description: "Create Application Firewall.",
					purpose: "Create new app-firewall",
					path: "/api/config/namespaces/{metadata.namespace}/app_firewalls",
				},
				{
					action: "replace",
					resourceType: "app_firewall",
					operationId: "ves.io.schema.app_firewall.API.Replace",
					summary: "Replace Application Firewall.",
					description: "Replace Application Firewall.",
					purpose: "Replace existing app-firewall",
					path: "/api/config/namespaces/{metadata.namespace}/app_firewalls/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.app_firewall.CustomDataAPI.Metrics",
					summary: "Metrics",
					description: "App Firewall metrics.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/{namespace}/app_firewall/metrics",
				},
				{
					action: "list",
					resourceType: "app_firewall",
					operationId: "ves.io.schema.app_firewall.API.List",
					summary: "List Application Firewall.",
					description: "List the set of app_firewall in a namespace.",
					purpose: "List all app-firewalls",
					path: "/api/config/namespaces/{namespace}/app_firewalls",
				},
				{
					action: "get",
					resourceType: "app_firewall",
					operationId: "ves.io.schema.app_firewall.API.Get",
					summary: "GET Application Firewall.",
					description: "GET Application Firewall.",
					purpose: "Retrieve specific app-firewall",
					path: "/api/config/namespaces/{namespace}/app_firewalls/{name}",
				},
				{
					action: "delete",
					resourceType: "app_firewall",
					operationId: "ves.io.schema.app_firewall.API.Delete",
					summary: "DELETE Application Firewall.",
					description: "DELETE the specified app_firewall.",
					purpose: "Delete app-firewall",
					path: "/api/config/namespaces/{namespace}/app_firewalls/{name}",
				},
				{
					action: "create",
					resourceType: "all_ns_event",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityEventsQueryAllNamespaces",
					summary: "Security Events Query All Namespaces.",
					description:
						"GET security events for the given namespace. For `system` namespace, all security events for the tenant matching the query specified in the request will be returned in the response. User may query security events that matches various fields such as `vh_name`, `sec_event_type`, `src_site`, `city`, `country`. This API is specific to system namespace.",
					purpose: "Create new all-ns-event",
					path: "/api/data/namespaces/system/app_security/all_ns_events",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityEventsAggregationQueryAllNamespaces",
					summary:
						"Security Events Aggregation Query All Namespaces.",
					description:
						"GET summary/aggregation data for security events in the given namespace. For `system` namespace, all security events for the tenant matching the query specified in the request will be considered for aggregation. User may query security events that matches various fields such as `vh_name`, `sec_event_type`, `src_site`, `city`, `country`.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/system/app_security/all_ns_events/aggregation",
				},
				{
					action: "create",
					resourceType: "loadbalancer",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SearchLoadBalancersAllNamespaces",
					summary: "Search load balancers All Namespaces.",
					description:
						"GET list of virtual hosts matching label filter.",
					purpose: "Create new loadbalancer",
					path: "/api/data/namespaces/system/app_security/all_ns_search/loadbalancers",
				},
				{
					action: "create",
					resourceType: "event",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityEventsQuery",
					summary: "Security Events Query.",
					description:
						"GET security events for the given namespace. For `system` namespace, all security events for the tenant matching the query specified in the request will be returned in the response. User may query security events that matches various fields such as `vh_name`, `sec_event_type`, `src_site`, `city`, `country`.",
					purpose: "Create new event",
					path: "/api/data/namespaces/{namespace}/app_security/events",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityEventsAggregationQuery",
					summary: "Security Events Aggregation Query.",
					description:
						"GET summary/aggregation data for security events in the given namespace. For `system` namespace, all security events for the tenant matching the query specified in the request will be considered for aggregation. User may query security events that matches various fields such as `vh_name`, `sec_event_type`, `src_site`, `city`, `country`.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/app_security/events/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityEventsScrollQuery",
					summary: "Security Event Scroll Query.",
					description:
						'Scroll request is used to fetch large number of security events in multiple batches with each SecurityEventResponse containing no more than 500 messages. To scroll through more than 500 or all messages, one can use the SecurityEventScrollRequest. Use the scroll_id returned in the SecurityEventResponse to fetch the next batch of security events and one can continue this process till the scroll_id returned is "" which indicates no more events to scroll.',
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/app_security/events/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0020_public_ves_io_schema_app_security_ves_swagger_ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityEventsScrollQuery",
					summary: "Security Event Scroll Query.",
					description:
						'Scroll request is used to fetch large number of security events in multiple batches with each SecurityEventResponse containing no more than 500 messages. To scroll through more than 500 or all messages, one can use the SecurityEventScrollRequest. Use the scroll_id returned in the SecurityEventResponse to fetch the next batch of security events and one can continue this process till the scroll_id returned is "" which indicates no more events to scroll.',
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/app_security/events/scroll",
				},
				{
					action: "create",
					resourceType: "incident",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityIncidentsQuery",
					summary: "Security Incidents Query.",
					description:
						"GET security incidents for the given namespace. For `system` namespace, all security incidents for the tenant matching the query specified in the request will be returned in the response. User may query security incidents that matches various fields such as `vh_name`, `intent`, `city`, `country`.",
					purpose: "Create new incident",
					path: "/api/data/namespaces/{namespace}/app_security/incidents",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityIncidentsAggregationQuery",
					summary: "Security Incidents Aggregation Query.",
					description:
						"GET summary/aggregation data for security incidents in the given namespace. For `system` namespace, all security incidents for the tenant matching the query specified in the request will be considered for aggregation. User may query security events that matches various fields such as `vh_name`, `intent`, `city`, `country`.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/app_security/incidents/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityIncidentsScrollQuery",
					summary: "Security Incidents Scroll Query.",
					description:
						'Scroll request is used to fetch large number of security incidents in multiple batches with each SecurityIncidentsResponse containing no more than 500 messages. To scroll through more than 500 or all messages, one can use the SecurityIncidentsScrollRequest. Use the scroll_id returned in the SecurityIncidentsResponse to fetch the next batch of security incidents and one can continue this process till the scroll_id returned is "" which indicates no more events to scroll.',
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/app_security/incidents/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0020_public_ves_io_schema_app_security_ves_swagger_ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityIncidentsScrollQuery",
					summary: "Security Incidents Scroll Query.",
					description:
						'Scroll request is used to fetch large number of security incidents in multiple batches with each SecurityIncidentsResponse containing no more than 500 messages. To scroll through more than 500 or all messages, one can use the SecurityIncidentsScrollRequest. Use the scroll_id returned in the SecurityIncidentsResponse to fetch the next batch of security incidents and one can continue this process till the scroll_id returned is "" which indicates no more events to scroll.',
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/app_security/incidents/scroll",
				},
				{
					action: "create",
					resourceType: "metric",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SecurityEventsMetrics",
					summary: "Security Events Metrics.",
					description:
						"GET the number of security events for a given namespace. Security events can be aggregated across multiple dimensions like VIRTUAL_HOST, SITE, SEC_EVENT_TYPE, etc.,.",
					purpose: "Create new metric",
					path: "/api/data/namespaces/{namespace}/app_security/metrics",
				},
				{
					action: "create",
					resourceType: "loadbalancer",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SearchLoadBalancers",
					summary: "Search load balancers.",
					description:
						"GET list of virtual hosts matching label filter.",
					purpose: "Create new loadbalancer",
					path: "/api/data/namespaces/{namespace}/app_security/search/loadbalancers",
				},
				{
					action: "create",
					resourceType: "suspicious_user_log",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SuspiciousUserLogsQuery",
					summary: "Suspicious User Logs Query.",
					description:
						"GET suspicious user logs for the given namespace. For `system` namespace, all suspicious users logs for the tenant matching the query specified in the request will be returned in the response. User may query suspicious user logs that matches various fields such as `vh_name`, `user`, `site`, `city`, `country`.",
					purpose: "Create new suspicious-user-log",
					path: "/api/data/namespaces/{namespace}/app_security/suspicious_user_logs",
				},
				{
					action: "create",
					resourceType: "aggregation",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SuspiciousUserLogsAggregationQuery",
					summary: "Suspicious User Logs Aggregation Query.",
					description:
						"GET summary/aggregation data for suspicious user logs in the given namespace. For `system` namespace, all suspicious user logs for the tenant matching the query specified in the request will be considered for aggregation. User may query suspicious user logs that matches various fields such as `vh_name`, `user`, `site`, `city`, `country`.",
					purpose: "Create new aggregation",
					path: "/api/data/namespaces/{namespace}/app_security/suspicious_user_logs/aggregation",
				},
				{
					action: "list",
					resourceType: "scroll",
					operationId:
						"ves.io.schema.app_security.AppSecurityMonitoringAPI.SuspiciousUserLogsScrollQuery",
					summary: "Suspicious User Logs Scroll Query.",
					description:
						'Scroll request is used to fetch large number of suspicious user logs in multiple batches with each SuspiciousUserLogsResponse containing no more than 500 messages. To scroll through more than 500 or all messages, one can use the SuspiciousUserLogsScrollRequest. Use the scroll_id returned in the SuspiciousUserLogsResponse to fetch the next batch of logs and one can continue this process till the scroll_id returned is "" which indicates no more logs to scroll.',
					purpose: "List all scrolls",
					path: "/api/data/namespaces/{namespace}/app_security/suspicious_user_logs/scroll",
				},
				{
					action: "create",
					resourceType: "scroll",
					operationId:
						"docs_cloud_f5_com_0020_public_ves_io_schema_app_security_ves_swagger_ves.io.schema.app_security.AppSecurityMonitoringAPI.SuspiciousUserLogsScrollQuery",
					summary: "Suspicious User Logs Scroll Query.",
					description:
						'Scroll request is used to fetch large number of suspicious user logs in multiple batches with each SuspiciousUserLogsResponse containing no more than 500 messages. To scroll through more than 500 or all messages, one can use the SuspiciousUserLogsScrollRequest. Use the scroll_id returned in the SuspiciousUserLogsResponse to fetch the next batch of logs and one can continue this process till the scroll_id returned is "" which indicates no more logs to scroll.',
					purpose: "Create new scroll",
					path: "/api/data/namespaces/{namespace}/app_security/suspicious_user_logs/scroll",
				},
				{
					action: "create",
					resourceType: "protocol_inspection",
					operationId: "ves.io.schema.protocol_inspection.API.Create",
					summary: "Create Protocol Inspection.",
					description:
						"Create Protocol Inspection Specification in a given namespace. If one already exists it will give an error.",
					purpose: "Create new protocol-inspection",
					path: "/api/config/namespaces/{metadata.namespace}/protocol_inspections",
				},
				{
					action: "replace",
					resourceType: "protocol_inspection",
					operationId:
						"ves.io.schema.protocol_inspection.API.Replace",
					summary: "Replace Protocol Inspection.",
					description:
						"Replace Protocol Inspection specification in a given namespace.",
					purpose: "Replace existing protocol-inspection",
					path: "/api/config/namespaces/{metadata.namespace}/protocol_inspections/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "protocol_inspection",
					operationId: "ves.io.schema.protocol_inspection.API.List",
					summary: "List Configure Protocol Inspection.",
					description:
						"List the set of protocol_inspection in a namespace.",
					purpose: "List all protocol-inspections",
					path: "/api/config/namespaces/{namespace}/protocol_inspections",
				},
				{
					action: "get",
					resourceType: "protocol_inspection",
					operationId: "ves.io.schema.protocol_inspection.API.Get",
					summary: "GET Protocol Inspection.",
					description: "GET Protocol Inspection details.",
					purpose: "Retrieve specific protocol-inspection",
					path: "/api/config/namespaces/{namespace}/protocol_inspections/{name}",
				},
				{
					action: "delete",
					resourceType: "protocol_inspection",
					operationId: "ves.io.schema.protocol_inspection.API.Delete",
					summary: "DELETE Configure Protocol Inspection.",
					description: "DELETE the specified protocol_inspection.",
					purpose: "Delete protocol-inspection",
					path: "/api/config/namespaces/{namespace}/protocol_inspections/{name}",
				},
				{
					action: "create",
					resourceType: "enhanced_firewall_policy",
					operationId:
						"ves.io.schema.enhanced_firewall_policy.API.Create",
					summary: "Create Enhanced Firewall Policy.",
					description:
						"Shape of Enhanced Firewall Policy specification.",
					purpose: "Create new enhanced-firewall-policy",
					path: "/api/config/namespaces/{metadata.namespace}/enhanced_firewall_policys",
				},
				{
					action: "replace",
					resourceType: "enhanced_firewall_policy",
					operationId:
						"ves.io.schema.enhanced_firewall_policy.API.Replace",
					summary: "Replace Enhanced Firewall Policy.",
					description:
						"Shape of Enhanced Firewall Policy replace specification.",
					purpose: "Replace existing enhanced-firewall-policy",
					path: "/api/config/namespaces/{metadata.namespace}/enhanced_firewall_policys/{metadata.name}",
				},
				{
					action: "create",
					resourceType: "hit",
					operationId:
						"ves.io.schema.enhanced_firewall_policy.CustomDataAPI.EnhancedFirewallPolicyHits",
					summary: "Enhanced Firewall Policy Hits.",
					description:
						"GET the counter for Enhanced Firewall Policy hits for a given namespace.",
					purpose: "Create new hit",
					path: "/api/data/namespaces/{namespace}/enhanced_firewall_policy/hits",
				},
				{
					action: "list",
					resourceType: "enhanced_firewall_policy",
					operationId:
						"ves.io.schema.enhanced_firewall_policy.API.List",
					summary: "List Enhanced Firewall Policy.",
					description:
						"List the set of enhanced_firewall_policy in a namespace.",
					purpose: "List all enhanced-firewall-policys",
					path: "/api/config/namespaces/{namespace}/enhanced_firewall_policys",
				},
				{
					action: "get",
					resourceType: "enhanced_firewall_policy",
					operationId:
						"ves.io.schema.enhanced_firewall_policy.API.Get",
					summary: "GET Enhanced Firewall Policy.",
					description:
						"Shape of the Enhanced Firewall Policy specification.",
					purpose: "Retrieve specific enhanced-firewall-policy",
					path: "/api/config/namespaces/{namespace}/enhanced_firewall_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "enhanced_firewall_policy",
					operationId:
						"ves.io.schema.enhanced_firewall_policy.API.Delete",
					summary: "DELETE Enhanced Firewall Policy.",
					description:
						"DELETE the specified enhanced_firewall_policy.",
					purpose: "Delete enhanced-firewall-policy",
					path: "/api/config/namespaces/{namespace}/enhanced_firewall_policys/{name}",
				},
				{
					action: "create",
					resourceType: "rule_hit",
					operationId:
						"ves.io.schema.waf.WAFMonitoringAPI.ClientRuleHitsMetrics",
					summary: "Client Rule Hits Metrics.",
					description:
						"GET number of rule hits per client for a given namespace. The rule hits counter can be aggregated based on one or more labels listed here. NAMESPACE, APP_TYPE, VIRTUAL_HOST, SITE, SERVICE, INSTANCE, WAF_INSTANCE_ID, RULE_ID, RULE_SEVERITY, RULE_TAG.",
					purpose: "Create new rule-hit",
					path: "/api/data/namespaces/{namespace}/wafs/metrics/client/rule_hits",
				},
				{
					action: "create",
					resourceType: "security_event",
					operationId:
						"ves.io.schema.waf.WAFMonitoringAPI.ClientSecurityEventsMetrics",
					summary: "Client Security Events Metrics.",
					description:
						"GET number of security events per client for a given namespace. The security events counter can be aggregated based on one or more labels listed here. NAMESPACE, APP_TYPE, VIRTUAL_HOST, SITE, SERVICE, INSTANCE, WAF_INSTANCE_ID, WAF_MODE.",
					purpose: "Create new security-event",
					path: "/api/data/namespaces/{namespace}/wafs/metrics/client/security_events",
				},
				{
					action: "create",
					resourceType: "rule_hit",
					operationId:
						"ves.io.schema.waf.WAFMonitoringAPI.ServerRuleHitsMetrics",
					summary: "Server Rule Hits Metrics.",
					description:
						"GET number of rule hits per server for a given namespace. The rule hits counter can be aggregated based on one or more labels listed here. NAMESPACE, APP_TYPE, VIRTUAL_HOST, SITE, SERVICE, INSTANCE, WAF_INSTANCE_ID, RULE_ID, RULE_SEVERITY, RULE_TAG.",
					purpose: "Create new rule-hit",
					path: "/api/data/namespaces/{namespace}/wafs/metrics/server/rule_hits",
				},
				{
					action: "create",
					resourceType: "security_event",
					operationId:
						"ves.io.schema.waf.WAFMonitoringAPI.ServerSecurityEventsMetrics",
					summary: "Server Security Events Metrics.",
					description:
						"GET number of security events per server for a given namespace. The security events counter can be aggregated based on one or more labels listed here. NAMESPACE, APP_TYPE, VIRTUAL_HOST, SITE, SERVICE, INSTANCE, WAF_INSTANCE_ID, WAF_MODE.",
					purpose: "Create new security-event",
					path: "/api/data/namespaces/{namespace}/wafs/metrics/server/security_events",
				},
				{
					action: "create",
					resourceType: "waf_exclusion_policy",
					operationId:
						"ves.io.schema.waf_exclusion_policy.API.Create",
					summary: "Create WAF Exclusion Policy.",
					description: "Create a WAF exclusion policy.",
					purpose: "Create new waf-exclusion-policy",
					path: "/api/config/namespaces/{metadata.namespace}/waf_exclusion_policys",
				},
				{
					action: "replace",
					resourceType: "waf_exclusion_policy",
					operationId:
						"ves.io.schema.waf_exclusion_policy.API.Replace",
					summary: "Replace WAF Exclusion Policy.",
					description: "Replace an existing WAF exclusion policy.",
					purpose: "Replace existing waf-exclusion-policy",
					path: "/api/config/namespaces/{metadata.namespace}/waf_exclusion_policys/{metadata.name}",
				},
				{
					action: "list",
					resourceType: "waf_exclusion_policy",
					operationId: "ves.io.schema.waf_exclusion_policy.API.List",
					summary: "List WAF Exclusion Policy.",
					description:
						"List the set of waf_exclusion_policy in a namespace.",
					purpose: "List all waf-exclusion-policys",
					path: "/api/config/namespaces/{namespace}/waf_exclusion_policys",
				},
				{
					action: "get",
					resourceType: "waf_exclusion_policy",
					operationId: "ves.io.schema.waf_exclusion_policy.API.Get",
					summary: "GET WAF Exclusion Policy.",
					description: "Retrieve a WAF exclusion policy.",
					purpose: "Retrieve specific waf-exclusion-policy",
					path: "/api/config/namespaces/{namespace}/waf_exclusion_policys/{name}",
				},
				{
					action: "delete",
					resourceType: "waf_exclusion_policy",
					operationId:
						"ves.io.schema.waf_exclusion_policy.API.Delete",
					summary: "DELETE WAF Exclusion Policy.",
					description: "DELETE the specified waf_exclusion_policy.",
					purpose: "Delete waf-exclusion-policy",
					path: "/api/config/namespaces/{namespace}/waf_exclusion_policys/{name}",
				},
				{
					action: "list",
					resourceType: "active_staged_signature",
					operationId:
						"ves.io.schema.waf_signatures_changelog.WafSignatureChangelogCustomApi.GetActiveStagedSignatures",
					summary: "Active Staged Signatures.",
					description: "API to GET active Staged Signatures.",
					purpose: "List all active-staged-signatures",
					path: "/api/config/namespaces/{namespace}/virtual_hosts/{vh_name}/active_staged_signatures",
				},
				{
					action: "list",
					resourceType: "released_signature",
					operationId:
						"ves.io.schema.waf_signatures_changelog.WafSignatureChangelogCustomApi.GetReleasedSignatures",
					summary: "Released Signatures.",
					description: "API to GET Released Signatures.",
					purpose: "List all released-signatures",
					path: "/api/config/namespaces/{namespace}/virtual_hosts/{vh_name}/released_signatures",
				},
				{
					action: "create",
					resourceType: "staged_signature",
					operationId:
						"ves.io.schema.waf_signatures_changelog.SignatureCustomApi.GetStagedSignatures",
					summary: "Staged Signatures.",
					description: "API to GET Staged Signatures.",
					purpose: "Create new staged-signature",
					path: "/api/ml/data/namespaces/{namespace}/virtual_hosts/{vh_name}/staged_signatures",
				},
			],
		},
	],
]);

/**
 * Total statistics
 */
export const OPERATIONS_STATS = {
	domainCount: 38,
	operationCount: 1843,
	resourceTypeCount: 796,
};

/**
 * Get operations for a specific domain
 */
export function getDomainOperations(
	domain: string,
): DomainOperationsInfo | undefined {
	return generatedOperations.get(domain);
}

/**
 * Get operation description for a specific domain, action, and resource
 */
export function getOperationDescription(
	domain: string,
	action: string,
	resourceType?: string,
): OperationInfo | undefined {
	const domainOps = generatedOperations.get(domain);
	if (!domainOps) return undefined;

	// Find matching operation
	return domainOps.operations.find((op) => {
		if (op.action !== action) return false;
		if (resourceType && op.resourceType !== resourceType) return false;
		return true;
	});
}

/**
 * Get all resource types for a domain
 */
export function getDomainResourceTypes(domain: string): string[] {
	const domainOps = generatedOperations.get(domain);
	return domainOps?.resourceTypes || [];
}
