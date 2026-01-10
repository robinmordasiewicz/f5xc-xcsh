/**
 * Core Profiler for xcsh startup performance analysis
 *
 * Provides hierarchical span tracking, memory snapshots, network instrumentation,
 * and bottleneck identification for diagnosing startup performance issues.
 */

/**
 * Profile span representing a timed operation
 */
export interface ProfileSpan {
	id: string;
	name: string;
	label: string;
	parentId: string | undefined;
	startTime: number;
	endTime: number | undefined;
	duration: number | undefined;
	metadata: Record<string, unknown>;
	isNetwork: boolean | undefined;
	children: ProfileSpan[];
}

/**
 * Network-specific span with request/response details
 */
export interface NetworkSpan extends ProfileSpan {
	url: string;
	method: string;
	statusCode: number | undefined;
	requestSize: number | undefined;
	responseSize: number | undefined;
	retryCount: number;
	error: string | undefined;
}

/**
 * Memory snapshot at a point in time
 */
export interface MemorySnapshot {
	timestamp: number;
	label: string;
	heapUsedMB: number;
	heapTotalMB: number;
	externalMB: number;
	rssMB: number;
}

/**
 * Identified performance bottleneck
 */
export interface Bottleneck {
	spanId: string;
	spanName: string;
	duration: number;
	threshold: number;
	reason: string;
	suggestion: string;
}

/**
 * Complete profile report
 */
export interface ProfileReport {
	startupTimeMs: number;
	spans: ProfileSpan[];
	networkSpans: NetworkSpan[];
	memorySnapshots: MemorySnapshot[];
	memoryPeakMB: number;
	memoryDeltaMB: number;
	bottlenecks: Bottleneck[];
	level: ProfileLevel;
}

/**
 * Profiling detail levels
 */
export type ProfileLevel = "none" | "basic" | "detailed" | "full";

/**
 * Profiler configuration
 */
export interface ProfilerConfig {
	enabled: boolean;
	level: ProfileLevel;
	thresholds: {
		slowPhaseMs: number;
		slowNetworkMs: number;
		memorySpikeMB: number;
	};
}

const DEFAULT_THRESHOLDS = {
	slowPhaseMs: 100,
	slowNetworkMs: 500,
	memorySpikeMB: 50,
};

/**
 * Get profiling level from environment
 */
function getProfileLevel(): ProfileLevel {
	const level = process.env.XCSH_PROFILE_LEVEL;
	if (level === "basic" || level === "detailed" || level === "full") {
		return level;
	}
	// Legacy support: XCSH_PROFILE=true maps to basic
	if (process.env.XCSH_PROFILE === "true") {
		return "basic";
	}
	return "none";
}

/**
 * Core Profiler class for tracking startup performance
 */
export class Profiler {
	private readonly config: ProfilerConfig;
	private readonly spans: Map<string, ProfileSpan> = new Map();
	private readonly networkSpans: Map<string, NetworkSpan> = new Map();
	private readonly memorySnapshots: MemorySnapshot[] = [];
	private readonly startTime: number;
	private spanCounter = 0;
	private rootSpanId: string | null = null;

	constructor(config?: Partial<ProfilerConfig>) {
		const level = getProfileLevel();
		this.config = {
			enabled: level !== "none",
			level,
			thresholds: {
				...DEFAULT_THRESHOLDS,
				...config?.thresholds,
			},
		};
		this.startTime = Date.now();

		// Take initial memory snapshot
		if (this.isEnabled()) {
			this.memorySnapshot("profiler_init");
		}
	}

	/**
	 * Check if profiling is enabled
	 */
	isEnabled(): boolean {
		return this.config.enabled;
	}

	/**
	 * Get current profiling level
	 */
	getLevel(): ProfileLevel {
		return this.config.level;
	}

	/**
	 * Get elapsed time since profiler start
	 */
	elapsed(): number {
		return Date.now() - this.startTime;
	}

	/**
	 * Generate unique span ID
	 */
	private generateSpanId(): string {
		return `span_${++this.spanCounter}`;
	}

	/**
	 * Start a new profiling span
	 */
	startSpan(name: string, label?: string, parentId?: string): string {
		if (!this.isEnabled()) return "";

		const id = this.generateSpanId();
		const span: ProfileSpan = {
			id,
			name,
			label: label ?? name,
			parentId: parentId ?? undefined,
			startTime: this.elapsed(),
			endTime: undefined,
			duration: undefined,
			metadata: {},
			isNetwork: undefined,
			children: [],
		};

		this.spans.set(id, span);

		// Track root span
		if (!parentId && !this.rootSpanId) {
			this.rootSpanId = id;
		}

		// Add to parent's children
		if (parentId) {
			const parent = this.spans.get(parentId);
			if (parent) {
				parent.children.push(span);
			}
		}

		// Emit to stderr in basic mode
		if (this.config.level === "basic") {
			console.error(`[PROFILE] ${name}:start: ${span.startTime}ms`);
		}

		return id;
	}

	/**
	 * End a profiling span
	 */
	endSpan(spanId: string, metadata?: Record<string, unknown>): void {
		if (!this.isEnabled() || !spanId) return;

		const span = this.spans.get(spanId);
		if (!span) return;

		span.endTime = this.elapsed();
		span.duration = span.endTime - span.startTime;
		if (metadata) {
			span.metadata = { ...span.metadata, ...metadata };
		}

		// Emit to stderr in basic mode
		if (this.config.level === "basic") {
			console.error(
				`[PROFILE] ${span.name}:end: ${span.endTime}ms (${span.duration}ms)`,
			);
		}
	}

	/**
	 * Create a checkpoint within current context (simple timing marker)
	 */
	checkpoint(name: string): void {
		if (!this.isEnabled()) return;

		const elapsed = this.elapsed();
		if (this.config.level === "basic") {
			console.error(`[PROFILE] ${name}: ${elapsed}ms`);
		}
	}

	/**
	 * Start a network span with additional request details
	 */
	startNetworkSpan(url: string, method: string, parentId?: string): string {
		if (!this.isEnabled()) return "";

		const id = this.generateSpanId();
		const span: NetworkSpan = {
			id,
			name: `network:${method}`,
			label: `${method} ${this.truncateUrl(url)}`,
			parentId: parentId ?? undefined,
			startTime: this.elapsed(),
			endTime: undefined,
			duration: undefined,
			metadata: {},
			children: [],
			isNetwork: true,
			url,
			method,
			statusCode: undefined,
			requestSize: undefined,
			responseSize: undefined,
			retryCount: 0,
			error: undefined,
		};

		this.networkSpans.set(id, span);
		this.spans.set(id, span);

		// Add to parent's children
		if (parentId) {
			const parent = this.spans.get(parentId);
			if (parent) {
				parent.children.push(span);
			}
		}

		if (this.config.level !== "none") {
			console.error(
				`[PROFILE] network:${method}:start: ${span.startTime}ms - ${this.truncateUrl(url)}`,
			);
		}

		return id;
	}

	/**
	 * End a network span with response details
	 */
	endNetworkSpan(
		spanId: string,
		details: {
			statusCode?: number;
			responseSize?: number;
			retryCount?: number;
			error?: string;
		},
	): void {
		if (!this.isEnabled() || !spanId) return;

		const span = this.networkSpans.get(spanId);
		if (!span) return;

		span.endTime = this.elapsed();
		span.duration = span.endTime - span.startTime;
		span.statusCode = details.statusCode;
		span.responseSize = details.responseSize;
		span.retryCount = details.retryCount ?? 0;
		span.error = details.error;

		if (this.config.level !== "none") {
			const status = details.error
				? `ERROR: ${details.error}`
				: `${details.statusCode ?? "?"}`;
			console.error(
				`[PROFILE] network:end: ${span.endTime}ms (${span.duration}ms) - ${status}`,
			);
		}
	}

	/**
	 * Take a memory snapshot
	 */
	memorySnapshot(label: string): void {
		if (!this.isEnabled()) return;
		if (this.config.level === "basic") return; // Skip memory in basic mode

		const memory = process.memoryUsage();
		const snapshot: MemorySnapshot = {
			timestamp: this.elapsed(),
			label,
			heapUsedMB: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
			heapTotalMB:
				Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
			externalMB: Math.round((memory.external / 1024 / 1024) * 100) / 100,
			rssMB: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
		};

		this.memorySnapshots.push(snapshot);

		if (this.config.level === "detailed" || this.config.level === "full") {
			console.error(
				`[PROFILE] memory:${label}: heap=${snapshot.heapUsedMB}MB rss=${snapshot.rssMB}MB`,
			);
		}
	}

	/**
	 * Identify bottlenecks based on configured thresholds
	 */
	private identifyBottlenecks(): Bottleneck[] {
		const bottlenecks: Bottleneck[] = [];

		for (const span of this.spans.values()) {
			if (!span.duration) continue;

			const isNetwork = this.networkSpans.has(span.id);
			const threshold = isNetwork
				? this.config.thresholds.slowNetworkMs
				: this.config.thresholds.slowPhaseMs;

			if (span.duration > threshold) {
				const suggestion = isNetwork
					? "Check network connectivity or API server status"
					: "Consider lazy loading or parallelizing this operation";

				bottlenecks.push({
					spanId: span.id,
					spanName: span.name,
					duration: span.duration,
					threshold,
					reason: `Duration ${span.duration}ms exceeds threshold ${threshold}ms`,
					suggestion,
				});
			}
		}

		// Check memory spikes
		if (this.memorySnapshots.length >= 2) {
			const first = this.memorySnapshots[0];
			const peak = Math.max(...this.memorySnapshots.map((s) => s.rssMB));
			const spike = peak - (first?.rssMB ?? 0);

			if (spike > this.config.thresholds.memorySpikeMB) {
				bottlenecks.push({
					spanId: "memory",
					spanName: "memory_spike",
					duration: spike,
					threshold: this.config.thresholds.memorySpikeMB,
					reason: `Memory increased by ${spike.toFixed(1)}MB`,
					suggestion:
						"Review large object allocations during startup",
				});
			}
		}

		return bottlenecks.sort((a, b) => b.duration - a.duration);
	}

	/**
	 * Get all root-level spans (no parent)
	 */
	private getRootSpans(): ProfileSpan[] {
		return Array.from(this.spans.values()).filter((span) => !span.parentId);
	}

	/**
	 * Generate complete profile report
	 */
	generateReport(): ProfileReport {
		const spans = this.getRootSpans();
		const networkSpans = Array.from(this.networkSpans.values());
		const bottlenecks = this.identifyBottlenecks();

		const memoryStart = this.memorySnapshots[0]?.rssMB ?? 0;
		const memoryEnd =
			this.memorySnapshots[this.memorySnapshots.length - 1]?.rssMB ?? 0;
		const memoryPeak = Math.max(
			...this.memorySnapshots.map((s) => s.rssMB),
			0,
		);

		return {
			startupTimeMs: this.elapsed(),
			spans,
			networkSpans,
			memorySnapshots: this.memorySnapshots,
			memoryPeakMB: memoryPeak,
			memoryDeltaMB: memoryEnd - memoryStart,
			bottlenecks,
			level: this.config.level,
		};
	}

	/**
	 * Truncate URL for display
	 */
	private truncateUrl(url: string): string {
		try {
			const parsed = new URL(url);
			return (
				parsed.pathname.slice(0, 40) +
				(parsed.pathname.length > 40 ? "..." : "")
			);
		} catch {
			return url.slice(0, 40);
		}
	}
}

/**
 * Global profiler instance
 */
let globalProfiler: Profiler | null = null;

/**
 * Get or create the global profiler instance
 */
export function getProfiler(): Profiler {
	if (!globalProfiler) {
		globalProfiler = new Profiler();
	}
	return globalProfiler;
}

/**
 * Initialize the global profiler (call at script start)
 */
export function initProfiler(config?: Partial<ProfilerConfig>): Profiler {
	globalProfiler = new Profiler(config);
	return globalProfiler;
}
