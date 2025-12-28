/**
 * Subscription Client
 * HTTP client for F5 XC subscription, addon services, and quota management APIs
 */

import type { APIClient } from "../api/client.js";
import type {
	AddonServiceInfo,
	SubscriptionInfo,
	QuotaUsageInfo,
	QuotaItem,
	QuotaSummary,
	PlanInfo,
	ValidationRequest,
	ValidationResult,
	ValidationCheck,
	ActivationStatusResult,
	PendingActivation,
	ListPlansResponse,
	ListAddonServicesResponse,
	ActivationStatusAPIResponse,
	QuotaAPIResponse,
	CurrentPlanResponse,
	CurrentPlanDetail,
} from "./types.js";
import {
	AddonState,
	AccessStatus,
	ActivationType,
	SubscriptionState,
	ValidationStatus,
	isAddonActive,
	isAddonAvailable,
	isQuotaExceeded,
	isQuotaAtRisk,
	getQuotaRemainingCapacity,
	getQuotaStatusFromPercentage,
	getAccessStatusDescription,
	getStateDescription,
} from "./types.js";

/**
 * Subscription client for F5 XC subscription APIs
 */
export class SubscriptionClient {
	private readonly apiClient: APIClient;

	constructor(apiClient: APIClient) {
		this.apiClient = apiClient;
	}

	/**
	 * Format display name from service name
	 * e.g., "client-side-defense" -> "Client Side Defense"
	 */
	private formatDisplayName(name: string): string {
		return name
			.split("-")
			.map((word) =>
				word.length > 0
					? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
					: "",
			)
			.join(" ");
	}

	/**
	 * Normalize tier value
	 */
	private normalizeTier(tier: string): string {
		const normalized = tier.toUpperCase().trim();
		switch (normalized) {
			case "NO_TIER":
			case "NOTIER":
			case "":
				return "NO_TIER";
			case "BASIC":
				return "BASIC";
			case "STANDARD":
				return "STANDARD";
			case "ADVANCED":
				return "ADVANCED";
			case "PREMIUM":
				return "PREMIUM";
			default:
				return tier;
		}
	}

	/**
	 * Normalize state value
	 */
	private normalizeState(state: string): string {
		const normalized = state.toUpperCase().trim();
		switch (normalized) {
			case "AS_NONE":
			case "NONE":
			case "":
				return AddonState.None;
			case "AS_PENDING":
			case "PENDING":
				return AddonState.Pending;
			case "AS_SUBSCRIBED":
			case "SUBSCRIBED":
				return AddonState.Subscribed;
			case "AS_ERROR":
			case "ERROR":
				return AddonState.Error;
			default:
				return state;
		}
	}

	/**
	 * Normalize access status value
	 */
	private normalizeAccessStatus(status: string): string {
		const normalized = status.toUpperCase().trim();
		switch (normalized) {
			case "AS_AC_ALLOWED":
			case "ALLOWED":
			case "":
				return AccessStatus.Allowed;
			case "AS_AC_PBAC_DENY":
			case "DENIED":
			case "DENY":
				return AccessStatus.Denied;
			case "AS_AC_PBAC_DENY_UPGRADE_PLAN":
			case "UPGRADE_REQUIRED":
			case "UPGRADE_PLAN":
				return AccessStatus.UpgradeRequired;
			case "AS_AC_PBAC_DENY_CONTACT_SALES":
			case "CONTACT_SALES":
				return AccessStatus.ContactSales;
			case "AS_AC_PBAC_DENY_INTERNAL_SVC":
			case "INTERNAL_SERVICE":
				return AccessStatus.InternalService;
			default:
				return status;
		}
	}

	/**
	 * Determine tier from tenant type
	 */
	private determineTierFromTenantType(tenantType: string): string {
		switch (tenantType.toUpperCase()) {
			case "ENTERPRISE":
				return "Advanced";
			case "FREEMIUM":
				return "Standard";
			default:
				return "Standard";
		}
	}

	/**
	 * Get subscription plans
	 */
	async getPlans(namespace: string = "system"): Promise<PlanInfo[]> {
		try {
			const path = `/api/web/namespaces/${namespace}/plans`;
			const response = await this.apiClient.get<ListPlansResponse>(path);

			const plans: PlanInfo[] = [];
			for (const item of response.data?.items ?? []) {
				if (!item?.metadata?.name) continue;
				const plan: PlanInfo = {
					name: item.metadata.name,
					displayName: item.spec?.display_name ?? item.metadata.name,
					includedServices:
						item.spec?.included_services?.map(
							(s) => s.name ?? "",
						) ?? [],
					allowedServices:
						item.spec?.allowed_services?.map((s) => s.name ?? "") ??
						[],
				};
				if (item.spec?.description) {
					plan.description = item.spec.description;
				}
				plans.push(plan);
			}

			return plans;
		} catch {
			// Plans API may not be available
			return [];
		}
	}

	/**
	 * Get addon service activation status
	 */
	async getAddonServiceActivationStatus(
		addonName: string,
	): Promise<AddonServiceInfo | null> {
		try {
			const path = `/api/web/namespaces/system/addon_services/${addonName}/activation-status`;
			const response =
				await this.apiClient.get<ActivationStatusAPIResponse>(path);

			return {
				name: addonName,
				displayName: this.formatDisplayName(addonName),
				tier: this.normalizeTier(response.data.tier ?? ""),
				state: this.normalizeState(response.data.state ?? ""),
				accessStatus: this.normalizeAccessStatus(
					response.data.access_status ?? "",
				),
			};
		} catch {
			return null;
		}
	}

	/**
	 * Get addon services
	 */
	async getAddonServices(
		namespace: string = "system",
	): Promise<AddonServiceInfo[]> {
		const path = `/api/web/namespaces/${namespace}/addon_services`;
		const response =
			await this.apiClient.get<ListAddonServicesResponse>(path);

		const addons: AddonServiceInfo[] = [];
		for (const item of response.data.items ?? []) {
			let addon: AddonServiceInfo = {
				name: item.name,
				displayName: this.formatDisplayName(item.name),
				tier: "",
				state: AddonState.None,
				accessStatus: AccessStatus.Allowed,
			};
			if (item.description) {
				addon.description = item.description;
			}
			if (item.namespace) {
				addon.namespace = item.namespace;
			}

			// Skip disabled services
			if (item.disabled) {
				addon.state = AddonState.None;
				addon.accessStatus = AccessStatus.Denied;
			}

			// Fetch activation status for each addon
			const activationStatus = await this.getAddonServiceActivationStatus(
				item.name,
			);
			if (activationStatus) {
				addon = {
					...addon,
					state: activationStatus.state,
					accessStatus: activationStatus.accessStatus,
					tier: activationStatus.tier,
				};
			}

			addons.push(addon);
		}

		return addons;
	}

	/**
	 * Get quota usage information (tenant-level)
	 */
	async getQuotaInfo(): Promise<QuotaUsageInfo> {
		const path = "/api/web/namespaces/system/quota/usage";
		const response = await this.apiClient.get<QuotaAPIResponse>(path);

		const objects: QuotaItem[] = [];

		// Use "objects" field if present, fall back to deprecated "quota_usage"
		const quotaMap =
			response.data.objects ?? response.data.quota_usage ?? {};

		for (const [name, entry] of Object.entries(quotaMap)) {
			const limit = entry.limit?.maximum ?? 0;
			const usage = entry.usage?.current ?? 0;

			// Skip unlimited quotas and negative values
			if (limit < 0 || usage < 0) {
				continue;
			}

			const percentage = limit > 0 ? (usage / limit) * 100 : 0;

			const quotaItem: QuotaItem = {
				name,
				displayName: entry.display_name ?? name,
				objectType: name,
				limit,
				usage,
				percentage,
				status: getQuotaStatusFromPercentage(percentage),
			};
			if (entry.description) {
				quotaItem.description = entry.description;
			}
			objects.push(quotaItem);
		}

		return {
			namespace: "tenant", // Quotas are tenant-level
			objects,
		};
	}

	/**
	 * Get current usage plan
	 */
	async getCurrentUsagePlan(): Promise<CurrentPlanDetail | null> {
		const path = "/api/web/namespaces/system/usage_plans/current";
		const response = await this.apiClient.get<CurrentPlanResponse>(path);

		// Find the current plan
		for (const plan of response.data.plans ?? []) {
			if (plan.current) {
				return plan;
			}
		}

		// Return first plan if no current plan marked
		if (response.data.plans && response.data.plans.length > 0) {
			return response.data.plans[0] ?? null;
		}

		return null;
	}

	/**
	 * Get subscription tier from current plan
	 */
	async getTierFromCurrentPlan(): Promise<string> {
		const plan = await this.getCurrentUsagePlan();
		if (!plan) {
			return "Standard";
		}
		return this.determineTierFromTenantType(plan.tenant_type);
	}

	/**
	 * Get complete subscription information
	 */
	async getSubscriptionInfo(): Promise<SubscriptionInfo> {
		// Get plans
		const plans = await this.getPlans("system");

		// Get addon services
		const addons = await this.getAddonServices("system");

		// Get quota info
		const quotaInfo = await this.getQuotaInfo();

		// Determine tier from current usage plan
		let tier: string;
		try {
			tier = await this.getTierFromCurrentPlan();
		} catch {
			// Fall back to legacy detection
			tier = this.determineTierFromPlansAndAddons(plans, addons);
		}

		// Separate active and available addons
		const activeAddons = addons.filter(isAddonActive);
		const availableAddons = addons.filter(isAddonAvailable);

		// Build quota summary
		let atRisk = 0;
		let exceeded = 0;
		for (const q of quotaInfo.objects) {
			if (isQuotaExceeded(q)) {
				exceeded++;
			} else if (isQuotaAtRisk(q)) {
				atRisk++;
			}
		}

		const quotaSummary: QuotaSummary = {
			totalLimits: quotaInfo.objects.length,
			limitsAtRisk: atRisk,
			limitsExceeded: exceeded,
			objects: quotaInfo.objects,
		};

		const info: SubscriptionInfo = {
			tier,
			activeAddons,
			availableAddons,
			quotaSummary,
			plan: plans[0] ?? {
				name: "unknown",
				displayName: "Unknown",
			},
		};

		return info;
	}

	/**
	 * Determine tier from plans and addons (legacy fallback)
	 */
	private determineTierFromPlansAndAddons(
		plans: PlanInfo[],
		addons: AddonServiceInfo[],
	): string {
		// Check plans first
		for (const plan of plans) {
			const nameLower = plan.name.toLowerCase();
			const displayLower = plan.displayName.toLowerCase();

			if (
				nameLower.includes("advanced") ||
				displayLower.includes("advanced")
			) {
				return "Advanced";
			}
			if (
				nameLower.includes("enterprise") ||
				displayLower.includes("enterprise")
			) {
				return "Advanced";
			}
		}

		// Check if any advanced-tier addons are active
		for (const addon of addons) {
			if (
				isAddonActive(addon) &&
				(addon.tier === "ADVANCED" || addon.tier === "PREMIUM")
			) {
				return "Advanced";
			}
		}

		return "Standard";
	}

	/**
	 * Validate resource deployment
	 */
	async validateResource(req: ValidationRequest): Promise<ValidationResult> {
		const result: ValidationResult = {
			valid: true,
			checks: [],
			warnings: [],
			errors: [],
		};

		// Validate quota if resource type and count specified
		if (req.resourceType && req.count && req.count > 0) {
			const quotaInfo = await this.getQuotaInfo();

			let found = false;
			for (const q of quotaInfo.objects) {
				if (
					q.objectType?.toLowerCase() ===
						req.resourceType.toLowerCase() ||
					q.name.toLowerCase() === req.resourceType.toLowerCase()
				) {
					found = true;
					const remaining = getQuotaRemainingCapacity(q);
					const check: ValidationCheck = {
						type: "quota",
						resource: req.resourceType,
						current: q.usage,
						requested: req.count,
						limit: q.limit,
						result: ValidationStatus.Pass,
					};

					if (req.count > remaining) {
						check.result = ValidationStatus.Fail;
						check.message = `Quota exceeded: ${req.resourceType} would have ${Math.floor(q.usage + req.count)}/${q.limit} (requesting ${req.count}, only ${Math.floor(remaining)} available)`;
						result.valid = false;
						result.errors?.push(check.message);
					} else if ((q.usage + req.count) / q.limit >= 0.8) {
						check.result = ValidationStatus.Warning;
						check.message = `Quota warning: ${req.resourceType} will be at ${Math.round(((q.usage + req.count) / q.limit) * 100)}% after deployment`;
						result.warnings?.push(check.message);
					} else {
						check.message = `Quota OK: ${req.resourceType} has sufficient capacity (${Math.floor(remaining)} available)`;
					}

					result.checks.push(check);
					break;
				}
			}

			if (!found) {
				result.checks.push({
					type: "quota",
					resource: req.resourceType,
					requested: req.count,
					result: ValidationStatus.Warning,
					message: `No quota limit found for resource type: ${req.resourceType}`,
				});
			}
		}

		// Validate feature/addon if specified
		if (req.feature) {
			const addons = await this.getAddonServices("system");

			let found = false;
			for (const addon of addons) {
				if (addon.name.toLowerCase() === req.feature.toLowerCase()) {
					found = true;
					const check: ValidationCheck = {
						type: "feature",
						feature: req.feature,
						currentTier: addon.tier,
						status: getStateDescription(addon.state),
						result: ValidationStatus.Pass,
					};

					if (isAddonActive(addon)) {
						check.message = `Feature '${req.feature}' is active (tier: ${addon.tier})`;
					} else if (
						addon.accessStatus === AccessStatus.UpgradeRequired
					) {
						check.result = ValidationStatus.Fail;
						check.message = `Feature '${req.feature}' requires a plan upgrade`;
						result.valid = false;
						result.errors?.push(check.message);
					} else if (
						addon.accessStatus === AccessStatus.ContactSales
					) {
						check.result = ValidationStatus.Fail;
						check.message = `Feature '${req.feature}' requires contacting F5 sales`;
						result.valid = false;
						result.errors?.push(check.message);
					} else if (isAddonAvailable(addon)) {
						check.result = ValidationStatus.Warning;
						check.message = `Feature '${req.feature}' is available but not subscribed`;
						result.warnings?.push(check.message);
					} else {
						check.result = ValidationStatus.Fail;
						check.message = `Feature '${req.feature}' is not available (access: ${getAccessStatusDescription(addon.accessStatus)})`;
						result.valid = false;
						result.errors?.push(check.message);
					}

					result.checks.push(check);
					break;
				}
			}

			if (!found) {
				result.checks.push({
					type: "feature",
					feature: req.feature,
					result: ValidationStatus.Warning,
					message: `Feature '${req.feature}' not found in addon services`,
				});
			}
		}

		return result;
	}

	/**
	 * Filter addons by criteria
	 */
	filterAddons(
		addons: AddonServiceInfo[],
		filter: string,
	): AddonServiceInfo[] {
		if (!filter) {
			return addons;
		}

		switch (filter.toLowerCase()) {
			case "active":
				return addons.filter(isAddonActive);
			case "available":
				return addons.filter(isAddonAvailable);
			case "denied":
				return addons.filter(
					(a) =>
						a.accessStatus === AccessStatus.Denied ||
						a.accessStatus === AccessStatus.UpgradeRequired ||
						a.accessStatus === AccessStatus.ContactSales ||
						a.accessStatus === AccessStatus.InternalService,
				);
			default:
				return addons;
		}
	}

	/**
	 * Get pending activation requests
	 */
	async getPendingActivations(
		namespace: string = "system",
	): Promise<ActivationStatusResult> {
		const addons = await this.getAddonServices(namespace);

		const result: ActivationStatusResult = {
			pendingActivations: [],
			activeAddons: [],
			totalPending: 0,
		};

		for (const addon of addons) {
			if (addon.state === AddonState.Pending) {
				const pending: PendingActivation = {
					addonService: addon.name,
					subscriptionState: SubscriptionState.Pending,
					message: this.getActivationMessage(
						addon.activationType ?? "",
					),
				};
				if (addon.namespace) {
					pending.namespace = addon.namespace;
				}
				if (addon.activationType) {
					pending.activationType = addon.activationType;
				}
				result.pendingActivations.push(pending);
			}

			if (isAddonActive(addon)) {
				result.activeAddons.push(addon.name);
			}
		}

		result.totalPending = result.pendingActivations.length;
		return result;
	}

	/**
	 * Get activation message based on type
	 */
	private getActivationMessage(activationType: string): string {
		switch (activationType) {
			case ActivationType.Self:
				return "Self-activation in progress";
			case ActivationType.PartiallyManaged:
				return "Awaiting partial backend processing";
			case ActivationType.Managed:
				return "Awaiting SRE approval";
			default:
				return "Activation pending";
		}
	}
}

/**
 * Create subscription client from API client
 */
export function createSubscriptionClient(
	apiClient: APIClient,
): SubscriptionClient {
	return new SubscriptionClient(apiClient);
}
