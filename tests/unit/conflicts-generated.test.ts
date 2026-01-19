/**
 * Tests for generated conflict data from x-f5xc-conflicts-with extension
 */

import { describe, it, expect } from "vitest";
import {
	PROPERTY_CONFLICTS,
	propertyToFlagName,
	flagToPropertyName,
	getConflictsForFlag,
	flagsConflict,
	CONFLICTS_SPEC_VERSION,
	CONFLICT_PROPERTY_COUNT,
	CONFLICT_RELATIONSHIP_COUNT,
} from "../../src/types/conflicts_generated.js";

describe("conflicts_generated", () => {
	describe("PROPERTY_CONFLICTS map", () => {
		it("should be a Map with conflict data", () => {
			expect(PROPERTY_CONFLICTS).toBeInstanceOf(Map);
			expect(PROPERTY_CONFLICTS.size).toBeGreaterThan(0);
		});

		it("should have host_header conflict with use_origin_server_name", () => {
			const hostHeaderConflicts = PROPERTY_CONFLICTS.get("host_header");
			expect(hostHeaderConflicts).toBeDefined();
			expect(hostHeaderConflicts).toContain("use_origin_server_name");
		});

		it("should have use_origin_server_name conflict with host_header", () => {
			const useOriginConflicts = PROPERTY_CONFLICTS.get(
				"use_origin_server_name",
			);
			expect(useOriginConflicts).toBeDefined();
			expect(useOriginConflicts).toContain("host_header");
		});

		it("should have bidirectional conflicts", () => {
			// For each property with conflicts, verify the reverse exists
			for (const [property, conflicts] of PROPERTY_CONFLICTS) {
				for (const conflict of conflicts) {
					const reverseConflicts = PROPERTY_CONFLICTS.get(conflict);
					expect(
						reverseConflicts,
						`Expected ${conflict} to have reverse conflicts`,
					).toBeDefined();
					expect(
						reverseConflicts,
						`Expected ${conflict} to conflict with ${property}`,
					).toContain(property);
				}
			}
		});
	});

	describe("propertyToFlagName", () => {
		it("should convert underscores to hyphens and add --prefix", () => {
			expect(propertyToFlagName("host_header")).toBe("--host-header");
			expect(propertyToFlagName("use_origin_server_name")).toBe(
				"--use-origin-server-name",
			);
			expect(propertyToFlagName("simple")).toBe("--simple");
		});

		it("should handle multiple underscores", () => {
			expect(propertyToFlagName("a_b_c_d")).toBe("--a-b-c-d");
		});

		it("should handle empty string", () => {
			expect(propertyToFlagName("")).toBe("--");
		});
	});

	describe("flagToPropertyName", () => {
		it("should convert hyphens to underscores and remove --prefix", () => {
			expect(flagToPropertyName("--host-header")).toBe("host_header");
			expect(flagToPropertyName("--use-origin-server-name")).toBe(
				"use_origin_server_name",
			);
			expect(flagToPropertyName("--simple")).toBe("simple");
		});

		it("should handle flags without -- prefix", () => {
			expect(flagToPropertyName("host-header")).toBe("host_header");
		});

		it("should handle multiple hyphens", () => {
			expect(flagToPropertyName("--a-b-c-d")).toBe("a_b_c_d");
		});
	});

	describe("getConflictsForFlag", () => {
		it("should return conflicting flags for --host-header", () => {
			const conflicts = getConflictsForFlag("--host-header");
			expect(conflicts).toContain("--use-origin-server-name");
		});

		it("should return conflicting flags for --use-origin-server-name", () => {
			const conflicts = getConflictsForFlag("--use-origin-server-name");
			expect(conflicts).toContain("--host-header");
		});

		it("should return empty array for flag with no conflicts", () => {
			const conflicts = getConflictsForFlag("--nonexistent-flag");
			expect(conflicts).toEqual([]);
		});

		it("should convert property names to flag names in results", () => {
			const conflicts = getConflictsForFlag("--host-header");
			// All results should start with --
			for (const conflict of conflicts) {
				expect(conflict).toMatch(/^--/);
			}
		});
	});

	describe("flagsConflict", () => {
		it("should return true for conflicting flags", () => {
			expect(
				flagsConflict("--host-header", "--use-origin-server-name"),
			).toBe(true);
			expect(
				flagsConflict("--use-origin-server-name", "--host-header"),
			).toBe(true);
		});

		it("should return false for non-conflicting flags", () => {
			expect(flagsConflict("--host-header", "--path")).toBe(false);
			expect(flagsConflict("--nonexistent", "--another-nonexistent")).toBe(
				false,
			);
		});
	});

	describe("metadata exports", () => {
		it("should export spec version", () => {
			expect(CONFLICTS_SPEC_VERSION).toBeDefined();
			expect(typeof CONFLICTS_SPEC_VERSION).toBe("string");
			// Should be a semver-like version
			expect(CONFLICTS_SPEC_VERSION).toMatch(/^\d+\.\d+\.\d+/);
		});

		it("should export property count", () => {
			expect(CONFLICT_PROPERTY_COUNT).toBeDefined();
			expect(typeof CONFLICT_PROPERTY_COUNT).toBe("number");
			expect(CONFLICT_PROPERTY_COUNT).toBeGreaterThan(0);
			// Should match the map size
			expect(CONFLICT_PROPERTY_COUNT).toBe(PROPERTY_CONFLICTS.size);
		});

		it("should export relationship count", () => {
			expect(CONFLICT_RELATIONSHIP_COUNT).toBeDefined();
			expect(typeof CONFLICT_RELATIONSHIP_COUNT).toBe("number");
			expect(CONFLICT_RELATIONSHIP_COUNT).toBeGreaterThan(0);
		});
	});
});

describe("conflict data quality", () => {
	it("should have meaningful conflict groups (not just self-references)", () => {
		for (const [property, conflicts] of PROPERTY_CONFLICTS) {
			// No property should conflict with itself
			expect(
				conflicts,
				`${property} should not conflict with itself`,
			).not.toContain(property);
		}
	});

	it("should have reasonable conflict counts", () => {
		// Based on plan: ~4,500+ unique properties expected
		// Actual may vary, but should be substantial
		expect(PROPERTY_CONFLICTS.size).toBeGreaterThan(100);
	});
});
