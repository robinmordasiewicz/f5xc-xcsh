/**
 * Cloudstatus Client - HTTP client for F5 Cloud Status API
 *
 * No authentication required - the status API is publicly accessible.
 */

import {
	BASE_URL,
	StatusIndicator,
	type StatusResponse,
	type SummaryResponse,
	type ComponentsResponse,
	type ComponentResponse,
	type IncidentsResponse,
	type MaintenancesResponse,
	type Component,
	type ComponentGroup,
	type RegionalStatus,
	type Incident,
	type ScheduledMaintenance,
	PredefinedRegions,
	isComponentOperational,
	isComponentDegraded,
} from "./types.js";

// Simple in-memory cache
interface CacheEntry {
	data: unknown;
	expiresAt: number;
}

class Cache {
	private entries: Map<string, CacheEntry> = new Map();
	private ttl: number;

	constructor(ttlMs: number = 60_000) {
		this.ttl = ttlMs;
	}

	get<T>(key: string): T | null {
		const entry = this.entries.get(key);
		if (!entry) return null;

		if (Date.now() > entry.expiresAt) {
			this.entries.delete(key);
			return null;
		}

		return entry.data as T;
	}

	set<T>(key: string, data: T): void {
		this.entries.set(key, {
			data,
			expiresAt: Date.now() + this.ttl,
		});
	}

	clear(): void {
		this.entries.clear();
	}
}

// Client configuration options
export interface CloudstatusClientOptions {
	baseUrl?: string;
	timeout?: number;
	cacheEnabled?: boolean;
	cacheTtl?: number;
}

/**
 * F5 Cloud Status API client
 */
export class CloudstatusClient {
	private baseUrl: string;
	private timeout: number;
	private cache: Cache | null;
	private cacheEnabled: boolean;

	constructor(options: CloudstatusClientOptions = {}) {
		this.baseUrl = options.baseUrl ?? BASE_URL;
		this.timeout = options.timeout ?? 30_000;
		this.cacheEnabled = options.cacheEnabled ?? true;
		this.cache = this.cacheEnabled
			? new Cache(options.cacheTtl ?? 60_000)
			: null;
	}

	/**
	 * Perform an HTTP GET request
	 */
	private async get<T>(endpoint: string): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		// Check cache first
		if (this.cache && this.cacheEnabled) {
			const cached = this.cache.get<T>(url);
			if (cached !== null) {
				return cached;
			}
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Accept: "application/json",
				},
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`API returned status ${response.status}`);
			}

			const data = (await response.json()) as T;

			// Store in cache
			if (this.cache && this.cacheEnabled) {
				this.cache.set(url, data);
			}

			return data;
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof Error && error.name === "AbortError") {
				throw new Error("Request timed out");
			}
			throw error;
		}
	}

	/**
	 * Get overall status indicator
	 */
	async getStatus(): Promise<StatusResponse> {
		return this.get<StatusResponse>("/status.json");
	}

	/**
	 * Get complete status summary
	 */
	async getSummary(): Promise<SummaryResponse> {
		return this.get<SummaryResponse>("/summary.json");
	}

	/**
	 * Get all components
	 */
	async getComponents(): Promise<ComponentsResponse> {
		return this.get<ComponentsResponse>("/components.json");
	}

	/**
	 * Get a single component by ID
	 */
	async getComponent(id: string): Promise<ComponentResponse> {
		return this.get<ComponentResponse>(`/components/${id}.json`);
	}

	/**
	 * Get all incidents
	 */
	async getIncidents(): Promise<IncidentsResponse> {
		return this.get<IncidentsResponse>("/incidents.json");
	}

	/**
	 * Get unresolved incidents
	 */
	async getUnresolvedIncidents(): Promise<IncidentsResponse> {
		return this.get<IncidentsResponse>("/incidents/unresolved.json");
	}

	/**
	 * Get all scheduled maintenances
	 */
	async getMaintenances(): Promise<MaintenancesResponse> {
		return this.get<MaintenancesResponse>("/scheduled-maintenances.json");
	}

	/**
	 * Get upcoming maintenances
	 */
	async getUpcomingMaintenances(): Promise<MaintenancesResponse> {
		return this.get<MaintenancesResponse>(
			"/scheduled-maintenances/upcoming.json",
		);
	}

	/**
	 * Clear the response cache
	 */
	clearCache(): void {
		if (this.cache) {
			this.cache.clear();
		}
	}

	/**
	 * Extract component groups from all components
	 */
	async getComponentGroups(): Promise<ComponentGroup[]> {
		const resp = await this.getComponents();
		return extractComponentGroups(resp.components);
	}

	/**
	 * Get PoP components
	 */
	async getPoPs(): Promise<Component[]> {
		const resp = await this.getComponents();
		return filterPoPs(resp.components);
	}

	/**
	 * Get regional status
	 */
	async getRegionalStatus(): Promise<RegionalStatus[]> {
		const resp = await this.getComponents();
		return calculateRegionalStatus(resp.components);
	}
}

// Helper functions for component filtering and grouping

/**
 * Extract component groups and their children
 */
export function extractComponentGroups(
	components: Component[],
): ComponentGroup[] {
	const groupMap = new Map<string, ComponentGroup>();

	// First pass: identify groups
	for (const comp of components) {
		if (comp.group) {
			groupMap.set(comp.id, {
				id: comp.id,
				name: comp.name,
				description: comp.description,
				components: [],
				componentCount: 0,
			});
		}
	}

	// Second pass: assign components to groups
	for (const comp of components) {
		if (!comp.group && comp.group_id) {
			const group = groupMap.get(comp.group_id);
			if (group) {
				group.components.push(comp);
				group.componentCount++;
			}
		}
	}

	return Array.from(groupMap.values());
}

/**
 * Filter PoP (Point of Presence) components
 */
export function filterPoPs(components: Component[]): Component[] {
	const popRegex = /\bpop\b|edge\s*pop|point\s*of\s*presence/i;
	return components.filter(
		(comp) => !comp.group && popRegex.test(comp.description),
	);
}

/**
 * Filter components by status
 */
export function filterByStatus(
	components: Component[],
	status: string,
): Component[] {
	return components.filter((comp) => comp.status === status);
}

/**
 * Filter degraded (non-operational) components
 */
export function filterDegraded(components: Component[]): Component[] {
	return components.filter(
		(comp) => isComponentDegraded(comp) && !comp.group,
	);
}

/**
 * Filter components by group
 */
export function filterByGroup(
	components: Component[],
	groupId: string,
): Component[] {
	return components.filter((comp) => comp.group_id === groupId);
}

/**
 * Extract site code from component name
 */
export function extractSiteCode(name: string): string {
	const match = /\(([a-z0-9-]+)\)/i.exec(name.toLowerCase());
	return match?.[1] ?? "";
}

/**
 * Detect region from component group
 */
export function detectRegion(
	comp: Component,
	groups: ComponentGroup[],
): string {
	if (!comp.group_id) return "";

	const group = groups.find((g) => g.id === comp.group_id);
	if (!group) return "";

	const groupNameLower = group.name.toLowerCase();

	if (groupNameLower.includes("north america")) return "north-america";
	if (groupNameLower.includes("south america")) return "south-america";
	if (groupNameLower.includes("europe")) return "europe";
	if (groupNameLower.includes("asia")) return "asia";
	if (groupNameLower.includes("oceania")) return "oceania";
	if (groupNameLower.includes("middle east")) return "middle-east";

	return "";
}

/**
 * Calculate regional status aggregation
 */
export function calculateRegionalStatus(
	components: Component[],
): RegionalStatus[] {
	const groups = extractComponentGroups(components);
	const pops = filterPoPs(components);

	const regionMap = new Map<string, RegionalStatus>();

	// Initialize regions
	for (const region of PredefinedRegions) {
		regionMap.set(region.id, {
			region,
			overallStatus: StatusIndicator.None,
			operationalCount: 0,
			degradedCount: 0,
			totalCount: 0,
			components: [],
		});
	}

	// Assign PoPs to regions
	for (const pop of pops) {
		const regionId = detectRegion(pop, groups);
		if (!regionId) continue;

		const regional = regionMap.get(regionId);
		if (regional) {
			regional.components.push(pop);
			regional.totalCount++;
			if (isComponentOperational(pop)) {
				regional.operationalCount++;
			} else {
				regional.degradedCount++;
			}
		}
	}

	// Calculate overall status for each region
	for (const regional of regionMap.values()) {
		if (regional.degradedCount === 0) {
			regional.overallStatus = StatusIndicator.None;
		} else if (regional.totalCount > 0) {
			const ratio = regional.degradedCount / regional.totalCount;
			if (ratio < 0.25) {
				regional.overallStatus = StatusIndicator.Minor;
			} else if (ratio < 0.5) {
				regional.overallStatus = StatusIndicator.Major;
			} else {
				regional.overallStatus = StatusIndicator.Critical;
			}
		}
	}

	return Array.from(regionMap.values());
}

/**
 * Filter incidents by status
 */
export function filterIncidentsByStatus(
	incidents: Incident[],
	status: string,
): Incident[] {
	return incidents.filter((inc) => inc.status === status);
}

/**
 * Filter incidents by impact
 */
export function filterIncidentsByImpact(
	incidents: Incident[],
	impact: string,
): Incident[] {
	return incidents.filter((inc) => inc.impact === impact);
}

/**
 * Filter incidents since a given time
 */
export function filterIncidentsSince(
	incidents: Incident[],
	since: Date,
): Incident[] {
	return incidents.filter((inc) => new Date(inc.created_at) > since);
}

/**
 * Filter maintenances by status
 */
export function filterMaintenancesByStatus(
	maintenances: ScheduledMaintenance[],
	status: string,
): ScheduledMaintenance[] {
	return maintenances.filter((maint) => maint.status === status);
}

/**
 * Get active maintenances
 */
export function getActiveMaintenances(
	maintenances: ScheduledMaintenance[],
): ScheduledMaintenance[] {
	return maintenances.filter(
		(maint) =>
			maint.status === "in_progress" || maint.status === "verifying",
	);
}

// Factory function with default options
export function createCloudstatusClient(
	options?: CloudstatusClientOptions,
): CloudstatusClient {
	return new CloudstatusClient(options);
}
