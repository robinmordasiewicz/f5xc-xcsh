/**
 * Subscription Types
 * Type definitions for F5 XC subscription, addon services, and quota management
 */

// Addon service tier values
export const Tier = {
	NoTier: "NO_TIER",
	Basic: "BASIC", // Discontinued - maps to Standard
	Standard: "STANDARD", // Active tier
	Advanced: "ADVANCED", // Active tier
	Premium: "PREMIUM", // Discontinued - maps to Advanced
} as const;

export type TierValue = (typeof Tier)[keyof typeof Tier];

// Addon service state values
export const AddonState = {
	None: "AS_NONE",
	Pending: "AS_PENDING",
	Subscribed: "AS_SUBSCRIBED",
	Error: "AS_ERROR",
} as const;

export type AddonStateValue = (typeof AddonState)[keyof typeof AddonState];

// Access status values
export const AccessStatus = {
	Allowed: "AS_AC_ALLOWED",
	Denied: "AS_AC_PBAC_DENY",
	UpgradeRequired: "AS_AC_PBAC_DENY_UPGRADE_PLAN",
	ContactSales: "AS_AC_PBAC_DENY_CONTACT_SALES",
	InternalService: "AS_AC_PBAC_DENY_INTERNAL_SVC",
	Unknown: "AS_AC_UNKNOWN",
	EOL: "AS_AC_EOL",
} as const;

export type AccessStatusValue =
	(typeof AccessStatus)[keyof typeof AccessStatus];

// Activation type values
export const ActivationType = {
	Self: "self",
	PartiallyManaged: "partially_managed",
	Managed: "managed",
} as const;

export type ActivationTypeValue =
	(typeof ActivationType)[keyof typeof ActivationType];

// Subscription state values
export const SubscriptionState = {
	Pending: "SUBSCRIPTION_PENDING",
	Enabled: "SUBSCRIPTION_ENABLED",
	DisablePending: "SUBSCRIPTION_DISABLE_PENDING",
	Disabled: "SUBSCRIPTION_DISABLED",
} as const;

export type SubscriptionStateValue =
	(typeof SubscriptionState)[keyof typeof SubscriptionState];

// Validation result status
export const ValidationStatus = {
	Pass: "PASS",
	Fail: "FAIL",
	Warning: "WARNING",
} as const;

export type ValidationStatusValue =
	(typeof ValidationStatus)[keyof typeof ValidationStatus];

// Quota status values
export const QuotaStatus = {
	OK: "OK",
	Warning: "WARNING",
	Exceeded: "EXCEEDED",
} as const;

export type QuotaStatusValue = (typeof QuotaStatus)[keyof typeof QuotaStatus];

/**
 * Plan information
 */
export interface PlanInfo {
	name: string;
	displayName: string;
	description?: string;
	includedServices?: string[];
	allowedServices?: string[];
}

/**
 * Addon service information
 */
export interface AddonServiceInfo {
	name: string;
	displayName: string;
	description?: string;
	tier: string;
	state: string;
	accessStatus: string;
	activationType?: string;
	namespace?: string;
}

/**
 * Check if addon is active
 */
export function isAddonActive(addon: AddonServiceInfo): boolean {
	return addon.state === AddonState.Subscribed;
}

/**
 * Check if addon is available for subscription
 */
export function isAddonAvailable(addon: AddonServiceInfo): boolean {
	return (
		addon.accessStatus === AccessStatus.Allowed &&
		addon.state !== AddonState.Subscribed
	);
}

/**
 * Check if addon access is denied
 */
export function isAddonDenied(addon: AddonServiceInfo): boolean {
	return (
		addon.accessStatus === AccessStatus.Denied ||
		addon.accessStatus === AccessStatus.UpgradeRequired ||
		addon.accessStatus === AccessStatus.ContactSales ||
		addon.accessStatus === AccessStatus.InternalService
	);
}

/**
 * Check if addon needs upgrade
 */
export function addonNeedsUpgrade(addon: AddonServiceInfo): boolean {
	return addon.accessStatus === AccessStatus.UpgradeRequired;
}

/**
 * Check if addon needs sales contact
 */
export function addonNeedsContactSales(addon: AddonServiceInfo): boolean {
	return addon.accessStatus === AccessStatus.ContactSales;
}

/**
 * Check if addon is end-of-life
 */
export function isAddonEOL(addon: AddonServiceInfo): boolean {
	return addon.accessStatus === AccessStatus.EOL;
}

/**
 * Check if addon can be activated
 */
export function canActivateAddon(addon: AddonServiceInfo): boolean {
	return (
		addon.accessStatus === AccessStatus.Allowed &&
		addon.state !== AddonState.Subscribed &&
		!isAddonEOL(addon)
	);
}

/**
 * Quota summary
 */
export interface QuotaSummary {
	totalLimits: number;
	limitsAtRisk: number;
	limitsExceeded: number;
	objects?: QuotaItem[];
	resources?: QuotaItem[];
}

/**
 * Single quota item
 */
export interface QuotaItem {
	name: string;
	displayName: string;
	description?: string;
	objectType?: string;
	limit: number;
	usage: number;
	percentage: number;
	status: string;
}

/**
 * Check if quota is exceeded
 */
export function isQuotaExceeded(quota: QuotaItem): boolean {
	return quota.usage >= quota.limit;
}

/**
 * Check if quota is at risk (>80% usage)
 */
export function isQuotaAtRisk(quota: QuotaItem): boolean {
	return quota.percentage >= 80 && quota.percentage < 100;
}

/**
 * Get remaining capacity for quota
 */
export function getQuotaRemainingCapacity(quota: QuotaItem): number {
	const remaining = quota.limit - quota.usage;
	return remaining < 0 ? 0 : remaining;
}

/**
 * Complete subscription information
 */
export interface SubscriptionInfo {
	tier: string;
	tenantName?: string;
	plan: PlanInfo;
	activeAddons: AddonServiceInfo[];
	availableAddons: AddonServiceInfo[];
	quotaSummary: QuotaSummary;
}

/**
 * Quota usage information
 */
export interface QuotaUsageInfo {
	namespace: string;
	objects: QuotaItem[];
	resources?: QuotaItem[];
	apis?: RateLimit[];
}

/**
 * Rate limit configuration
 */
export interface RateLimit {
	name: string;
	rate: number;
	burst: number;
	unit: string;
}

/**
 * Validation request
 */
export interface ValidationRequest {
	resourceType?: string;
	count?: number;
	feature?: string;
	terraformPlan?: string;
	namespace?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
	valid: boolean;
	checks: ValidationCheck[];
	warnings?: string[];
	errors?: string[];
}

/**
 * Single validation check
 */
export interface ValidationCheck {
	type: string;
	resource?: string;
	feature?: string;
	current?: number;
	requested?: number;
	limit?: number;
	requiredTier?: string;
	currentTier?: string;
	status?: string;
	result: string;
	message?: string;
}

/**
 * Check if validation passed
 */
export function isValidationPassed(check: ValidationCheck): boolean {
	return check.result === ValidationStatus.Pass;
}

/**
 * Check if validation failed
 */
export function isValidationFailed(check: ValidationCheck): boolean {
	return check.result === ValidationStatus.Fail;
}

/**
 * Check if validation has warning
 */
export function isValidationWarning(check: ValidationCheck): boolean {
	return check.result === ValidationStatus.Warning;
}

/**
 * Activation response
 */
export interface ActivationResponse {
	addonService: string;
	namespace?: string;
	subscriptionState?: string;
	activationType?: string;
	accessStatus?: string;
	requestId?: string;
	message: string;
	nextSteps?: string;
	isPending: boolean;
	isImmediate: boolean;
}

/**
 * Pending activation
 */
export interface PendingActivation {
	addonService: string;
	namespace?: string;
	subscriptionState: string;
	activationType?: string;
	message?: string;
}

/**
 * Activation status result
 */
export interface ActivationStatusResult {
	pendingActivations: PendingActivation[];
	activeAddons: string[];
	totalPending: number;
}

// Description helper functions

/**
 * Get human-readable tier description
 */
export function getTierDescription(tier: string): string {
	switch (tier) {
		case Tier.NoTier:
			return "No Tier";
		case Tier.Basic:
			return "Standard"; // Basic discontinued, maps to Standard
		case Tier.Standard:
			return "Standard";
		case Tier.Advanced:
			return "Advanced";
		case Tier.Premium:
			return "Advanced"; // Premium discontinued, maps to Advanced
		default:
			return "Unknown";
	}
}

/**
 * Get human-readable state description
 */
export function getStateDescription(state: string): string {
	switch (state) {
		case AddonState.None:
			return "Not Subscribed";
		case AddonState.Pending:
			return "Pending";
		case AddonState.Subscribed:
			return "Subscribed";
		case AddonState.Error:
			return "Error";
		default:
			return "Unknown";
	}
}

/**
 * Get human-readable access status description
 */
export function getAccessStatusDescription(status: string): string {
	switch (status) {
		case AccessStatus.Allowed:
			return "Allowed";
		case AccessStatus.Denied:
			return "Denied";
		case AccessStatus.UpgradeRequired:
			return "Upgrade Required";
		case AccessStatus.ContactSales:
			return "Contact Sales";
		case AccessStatus.InternalService:
			return "Internal Service";
		case AccessStatus.Unknown:
			return "Unknown";
		case AccessStatus.EOL:
			return "End of Life";
		default:
			return "Unknown";
	}
}

/**
 * Get human-readable activation type description
 */
export function getActivationTypeDescription(activationType: string): string {
	switch (activationType) {
		case ActivationType.Self:
			return "Self-Activation (immediate)";
		case ActivationType.PartiallyManaged:
			return "Partially Managed (requires approval)";
		case ActivationType.Managed:
			return "Fully Managed (SRE intervention required)";
		default:
			return "Unknown";
	}
}

/**
 * Get human-readable subscription state description
 */
export function getSubscriptionStateDescription(state: string): string {
	switch (state) {
		case SubscriptionState.Pending:
			return "Pending Activation";
		case SubscriptionState.Enabled:
			return "Enabled";
		case SubscriptionState.DisablePending:
			return "Pending Deactivation";
		case SubscriptionState.Disabled:
			return "Disabled";
		default:
			return state;
	}
}

/**
 * Get quota status from percentage
 */
export function getQuotaStatusFromPercentage(percentage: number): string {
	if (percentage >= 100) {
		return QuotaStatus.Exceeded;
	}
	if (percentage >= 80) {
		return QuotaStatus.Warning;
	}
	return QuotaStatus.OK;
}

// API Response Types (internal use)

export interface ListPlansResponse {
	items: PlanItem[];
}

export interface PlanItem {
	name: string;
	metadata: {
		name: string;
		namespace: string;
		description?: string;
		labels?: Record<string, string>;
	};
	spec: {
		display_name?: string;
		description?: string;
		included_services?: ServiceReference[];
		allowed_services?: ServiceReference[];
	};
}

export interface ServiceReference {
	name?: string;
	namespace?: string;
}

export interface ListAddonServicesResponse {
	items: AddonServiceItem[];
}

export interface AddonServiceItem {
	tenant?: string;
	namespace?: string;
	name: string;
	uid?: string;
	description?: string;
	disabled?: boolean;
}

export interface ActivationStatusAPIResponse {
	activation_status?: string;
	state?: string;
	access_status?: string;
	tier?: string;
}

export interface QuotaAPIResponse {
	objects?: Record<string, QuotaEntry>;
	resources?: Record<string, QuotaEntry>;
	apis?: Record<string, QuotaEntry>;
	quota_usage?: Record<string, QuotaEntry>;
}

export interface QuotaEntry {
	limit?: { maximum: number };
	usage?: { current: number };
	display_name?: string;
	description?: string;
}

export interface CurrentPlanResponse {
	locale: string;
	plans: CurrentPlanDetail[];
}

export interface CurrentPlanDetail {
	name: string;
	title: string;
	tenant_type: string;
	current: boolean;
}
