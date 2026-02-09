/**
 * Flag Utilities Unit Tests
 *
 * Tests for flag utility functions used in completion:
 * - extractUsedFlags: Extract flags from command args
 * - filterUsedFlags: Filter suggestions by used flags
 * - countFlagUsage: Count flag occurrences for repeatable flags
 */

import { describe, it, expect } from "vitest";
import {
  extractUsedFlags,
  filterUsedFlags,
  filterUsedFlagsFromStrings,
  countFlagUsage,
  parseCreationFlagValues,
  formatDefaultValue,
} from "../../src/repl/completion/flag-utils.js";
import {
  hasCreationFlags,
  getCreationFlags,
  getAllCreationFlagNames,
} from "../../src/repl/completion/creation-flags.js";

describe("extractUsedFlags", () => {
  describe("basic flag extraction", () => {
    it("extracts simple flags", () => {
      const result = extractUsedFlags(["--name", "test"]);
      expect(result.has("--name")).toBe(true);
    });

    it("extracts multiple flags", () => {
      const result = extractUsedFlags(["--name", "test", "--type", "http"]);
      expect(result.has("--name")).toBe(true);
      expect(result.has("--type")).toBe(true);
    });

    it("handles --flag=value pattern", () => {
      const result = extractUsedFlags(["--output=json"]);
      expect(result.has("--output")).toBe(true);
    });

    it("ignores non-flag arguments", () => {
      const result = extractUsedFlags([
        "create",
        "healthcheck",
        "--name",
        "test",
      ]);
      expect(result.has("create")).toBe(false);
      expect(result.has("healthcheck")).toBe(false);
      expect(result.has("--name")).toBe(true);
    });

    it("returns empty set for no flags", () => {
      const result = extractUsedFlags(["create", "healthcheck"]);
      expect(result.size).toBe(0);
    });

    it("handles empty args array", () => {
      const result = extractUsedFlags([]);
      expect(result.size).toBe(0);
    });
  });

  describe("flag extraction without aliases", () => {
    it("extracts --namespace flag", () => {
      const result = extractUsedFlags(["--namespace", "default"]);
      expect(result.has("--namespace")).toBe(true);
    });

    it("extracts --output flag", () => {
      const result = extractUsedFlags(["--output", "json"]);
      expect(result.has("--output")).toBe(true);
    });

    it("extracts --output=value format", () => {
      const result = extractUsedFlags(["--output=json"]);
      expect(result.has("--output")).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles repeated flags", () => {
      const result = extractUsedFlags([
        "--public-ip",
        "1.2.3.4",
        "--public-ip",
        "5.6.7.8",
      ]);
      expect(result.has("--public-ip")).toBe(true);
    });

    it("handles mixed flag formats", () => {
      const result = extractUsedFlags([
        "--name=test",
        "--output",
        "json",
        "--verbose",
      ]);
      expect(result.has("--name")).toBe(true);
      expect(result.has("--output")).toBe(true);
      expect(result.has("--verbose")).toBe(true);
    });
  });
});

describe("filterUsedFlags", () => {
  it("removes used flags from suggestions", () => {
    const suggestions = [
      { text: "--name", description: "Resource name" },
      { text: "--type", description: "Type" },
      { text: "--output", description: "Output format" },
    ];
    const usedFlags = new Set(["--name", "-n"]);
    const result = filterUsedFlags(suggestions, usedFlags);

    expect(result).toHaveLength(2);
    expect(result.map((s) => s.text)).not.toContain("--name");
    expect(result.map((s) => s.text)).toContain("--type");
    expect(result.map((s) => s.text)).toContain("--output");
  });

  it("returns all suggestions when no flags used", () => {
    const suggestions = [
      { text: "--name", description: "Resource name" },
      { text: "--type", description: "Type" },
    ];
    const usedFlags = new Set<string>();
    const result = filterUsedFlags(suggestions, usedFlags);

    expect(result).toHaveLength(2);
  });

  it("returns empty array when all flags used", () => {
    const suggestions = [
      { text: "--name", description: "Resource name" },
      { text: "--type", description: "Type" },
    ];
    const usedFlags = new Set(["--name", "--type"]);
    const result = filterUsedFlags(suggestions, usedFlags);

    expect(result).toHaveLength(0);
  });

  it("handles empty suggestions array", () => {
    const suggestions: Array<{ text: string }> = [];
    const usedFlags = new Set(["--name"]);
    const result = filterUsedFlags(suggestions, usedFlags);

    expect(result).toHaveLength(0);
  });
});

describe("filterUsedFlagsFromStrings", () => {
  it("filters string array based on used flags in args", () => {
    const flags = ["--name", "--type", "--output"];
    const args = ["--name", "test", "--output", "json"];
    const result = filterUsedFlagsFromStrings(flags, args);

    expect(result).not.toContain("--name");
    expect(result).not.toContain("--output");
    expect(result).toContain("--type");
  });

  it("returns all flags when no matching args", () => {
    const flags = ["--name", "--type"];
    const args = ["create", "healthcheck"];
    const result = filterUsedFlagsFromStrings(flags, args);

    expect(result).toEqual(flags);
  });
});

describe("countFlagUsage", () => {
  it("counts single flag occurrence", () => {
    const result = countFlagUsage(["--name", "test"]);
    expect(result.get("--name")).toBe(1);
  });

  it("counts multiple flag occurrences", () => {
    const result = countFlagUsage([
      "--public-ip",
      "1.2.3.4",
      "--public-ip",
      "5.6.7.8",
      "--public-ip",
      "9.10.11.12",
    ]);
    expect(result.get("--public-ip")).toBe(3);
  });

  it("counts multiple different flags", () => {
    const result = countFlagUsage([
      "--name",
      "test",
      "--port",
      "80",
      "--public-ip",
      "1.2.3.4",
      "--public-ip",
      "5.6.7.8",
    ]);
    expect(result.get("--name")).toBe(1);
    expect(result.get("--port")).toBe(1);
    expect(result.get("--public-ip")).toBe(2);
  });

  it("handles --flag=value pattern", () => {
    const result = countFlagUsage(["--name=test", "--port=80"]);
    expect(result.get("--name")).toBe(1);
    expect(result.get("--port")).toBe(1);
  });

  it("ignores non-flag arguments", () => {
    const result = countFlagUsage(["create", "healthcheck", "--name", "test"]);
    expect(result.has("create")).toBe(false);
    expect(result.has("healthcheck")).toBe(false);
    expect(result.get("--name")).toBe(1);
  });

  it("returns empty map for no flags", () => {
    const result = countFlagUsage(["create", "healthcheck"]);
    expect(result.size).toBe(0);
  });

  it("handles empty args array", () => {
    const result = countFlagUsage([]);
    expect(result.size).toBe(0);
  });
});

describe("hasCreationFlags", () => {
  it("returns true for healthcheck", () => {
    expect(hasCreationFlags("healthcheck")).toBe(true);
  });

  it("returns true for origin_pool", () => {
    expect(hasCreationFlags("origin_pool")).toBe(true);
  });

  it("returns true for http_loadbalancer", () => {
    expect(hasCreationFlags("http_loadbalancer")).toBe(true);
  });

  it("returns true for app_firewall", () => {
    expect(hasCreationFlags("app_firewall")).toBe(true);
  });

  it("returns false for unknown resource type", () => {
    expect(hasCreationFlags("unknown_type")).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(hasCreationFlags("HEALTHCHECK")).toBe(false);
    expect(hasCreationFlags("HealthCheck")).toBe(false);
  });
});

describe("getCreationFlags", () => {
  describe("healthcheck flags", () => {
    it("returns array of flags for healthcheck", () => {
      const flags = getCreationFlags("healthcheck");
      expect(flags.length).toBeGreaterThan(0);
    });

    it("includes required --name flag", () => {
      const flags = getCreationFlags("healthcheck");
      const nameFlag = flags.find((f) => f.name === "--name");
      expect(nameFlag).toBeDefined();
      expect(nameFlag?.required).toBe(true);
    });

    it("includes optional --type flag with enum values and default", () => {
      const flags = getCreationFlags("healthcheck");
      const typeFlag = flags.find((f) => f.name === "--type");
      expect(typeFlag).toBeDefined();
      expect(typeFlag?.required).toBe(false);
      expect(typeFlag?.valueType).toBe("enum");
      expect(typeFlag?.enumValues).toContain("http");
      expect(typeFlag?.enumValues).toContain("tcp");
      expect(typeFlag?.enumValues).toContain("udp-icmp");
      expect(typeFlag?.defaultValue).toBe("http");
    });

    it("includes interval/timeout flags with defaults", () => {
      const flags = getCreationFlags("healthcheck");
      const intervalFlag = flags.find((f) => f.name === "--interval");
      const timeoutFlag = flags.find((f) => f.name === "--timeout");

      expect(intervalFlag?.required).toBe(false);
      expect(intervalFlag?.valueType).toBe("integer");
      expect(intervalFlag?.defaultValue).toBe(15);
      expect(timeoutFlag?.required).toBe(false);
      expect(timeoutFlag?.valueType).toBe("integer");
      expect(timeoutFlag?.defaultValue).toBe(3);
    });

    it("includes optional --path flag", () => {
      const flags = getCreationFlags("healthcheck");
      const pathFlag = flags.find((f) => f.name === "--path");
      expect(pathFlag).toBeDefined();
      expect(pathFlag?.required).toBe(false);
    });
  });

  describe("origin_pool flags", () => {
    it("returns array of flags for origin_pool", () => {
      const flags = getCreationFlags("origin_pool");
      expect(flags.length).toBeGreaterThan(0);
    });

    it("includes all 10 origin server type flags", () => {
      const flags = getCreationFlags("origin_pool");
      const originFlags = [
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

      for (const flagName of originFlags) {
        const flag = flags.find((f) => f.name === flagName);
        expect(flag).toBeDefined();
        expect(flag?.isRepeatable).toBe(true);
        expect(flag?.maxOccurrences).toBe(32);
      }
    });

    it("includes --algorithm flag with enum values", () => {
      const flags = getCreationFlags("origin_pool");
      const algoFlag = flags.find((f) => f.name === "--algorithm");
      expect(algoFlag).toBeDefined();
      expect(algoFlag?.valueType).toBe("enum");
      expect(algoFlag?.enumValues).toContain("ROUND_ROBIN");
      expect(algoFlag?.enumValues).toContain("LEAST_REQUEST");
    });

    it("includes --health-check flag with max 4", () => {
      const flags = getCreationFlags("origin_pool");
      const hcFlag = flags.find((f) => f.name === "--health-check");
      expect(hcFlag).toBeDefined();
      expect(hcFlag?.isRepeatable).toBe(true);
      expect(hcFlag?.maxOccurrences).toBe(4);
    });
  });

  describe("unknown resource types", () => {
    it("returns empty array for unknown resource type", () => {
      const flags = getCreationFlags("unknown_type");
      expect(flags).toEqual([]);
    });
  });
});

describe("getAllCreationFlagNames", () => {
  it("returns set of all flag names for healthcheck", () => {
    const names = getAllCreationFlagNames("healthcheck");
    expect(names.has("--name")).toBe(true);
    expect(names.has("--type")).toBe(true);
    expect(names.has("--interval")).toBe(true);
  });

  it("returns set of all flag names for origin_pool", () => {
    const names = getAllCreationFlagNames("origin_pool");
    expect(names.has("--name")).toBe(true);
    expect(names.has("--public-ip")).toBe(true);
    expect(names.has("--algorithm")).toBe(true);
  });

  it("returns empty set for unknown resource type", () => {
    const names = getAllCreationFlagNames("unknown_type");
    expect(names.size).toBe(0);
  });

  it("includes long form flags only (no short forms)", () => {
    const names = getAllCreationFlagNames("healthcheck");
    // Only long form flags
    expect(names.has("--name")).toBe(true);
    expect(names.has("--type")).toBe(true);
    // No short forms
    expect(names.has("-n")).toBe(false);
    expect(names.has("-t")).toBe(false);
  });
});

describe("parseCreationFlagValues", () => {
  describe("basic parsing", () => {
    it("parses --flag value pattern", () => {
      const result = parseCreationFlagValues([
        "--type",
        "http",
        "--name",
        "test",
      ]);
      expect(result.get("--type")).toBe("http");
      expect(result.get("--name")).toBe("test");
    });

    it("parses --flag=value pattern", () => {
      const result = parseCreationFlagValues(["--type=tcp", "--interval=10"]);
      expect(result.get("--type")).toBe("tcp");
      expect(result.get("--interval")).toBe("10");
    });

    it("parses boolean flags without values", () => {
      const result = parseCreationFlagValues(["--use-http2", "--verbose"]);
      expect(result.get("--use-http2")).toBe("");
      expect(result.get("--verbose")).toBe("");
    });

    it("handles mixed patterns", () => {
      const result = parseCreationFlagValues([
        "--type=http",
        "--name",
        "test",
        "--use-http2",
      ]);
      expect(result.get("--type")).toBe("http");
      expect(result.get("--name")).toBe("test");
      expect(result.get("--use-http2")).toBe("");
    });
  });

  describe("value handling", () => {
    it("handles empty string values", () => {
      const result = parseCreationFlagValues(["--name", ""]);
      expect(result.get("--name")).toBe("");
    });

    it("handles numeric string values", () => {
      const result = parseCreationFlagValues([
        "--port",
        "80",
        "--interval",
        "10",
      ]);
      expect(result.get("--port")).toBe("80");
      expect(result.get("--interval")).toBe("10");
    });

    it("handles values with special characters", () => {
      const result = parseCreationFlagValues(["--path", "/api/v1/health"]);
      expect(result.get("--path")).toBe("/api/v1/health");
    });

    it("treats values starting with dash as flags", () => {
      const result = parseCreationFlagValues(["--name", "--test--"]);
      // --test-- is treated as a separate boolean flag, not a value
      expect(result.get("--name")).toBe("");
      expect(result.get("--test--")).toBe("");
    });

    it("handles equals sign in value", () => {
      const result = parseCreationFlagValues([
        "--header=Content-Type=application/json",
      ]);
      expect(result.get("--header")).toBe("Content-Type=application/json");
    });
  });

  describe("edge cases", () => {
    it("handles duplicate flags - keeps last value", () => {
      const result = parseCreationFlagValues([
        "--type",
        "http",
        "--type",
        "tcp",
      ]);
      expect(result.get("--type")).toBe("tcp");
    });

    it("handles empty args array", () => {
      const result = parseCreationFlagValues([]);
      expect(result.size).toBe(0);
    });

    it("handles non-flag arguments", () => {
      const result = parseCreationFlagValues([
        "create",
        "healthcheck",
        "--type",
        "http",
      ]);
      expect(result.get("create")).toBeUndefined();
      expect(result.get("healthcheck")).toBeUndefined();
      expect(result.get("--type")).toBe("http");
    });

    it("handles flag at end of args without value", () => {
      const result = parseCreationFlagValues(["--name", "test", "--verbose"]);
      expect(result.get("--name")).toBe("test");
      expect(result.get("--verbose")).toBe("");
    });

    it("handles consecutive boolean flags", () => {
      const result = parseCreationFlagValues([
        "--use-http2",
        "--use-origin-server-name",
      ]);
      expect(result.get("--use-http2")).toBe("");
      expect(result.get("--use-origin-server-name")).toBe("");
    });

    it("handles mixed equals and space patterns", () => {
      const result = parseCreationFlagValues([
        "--type=http",
        "--name",
        "test",
        "--path=/health",
      ]);
      expect(result.get("--type")).toBe("http");
      expect(result.get("--name")).toBe("test");
      expect(result.get("--path")).toBe("/health");
    });
  });

  describe("integration scenarios", () => {
    it("parses typical healthcheck command", () => {
      const result = parseCreationFlagValues([
        "/virtual",
        "create",
        "healthcheck",
        "--type",
        "http",
        "--name",
        "my-check",
        "--interval",
        "10",
        "--timeout",
        "5",
        "--path",
        "/health",
      ]);
      expect(result.get("--type")).toBe("http");
      expect(result.get("--name")).toBe("my-check");
      expect(result.get("--interval")).toBe("10");
      expect(result.get("--timeout")).toBe("5");
      expect(result.get("--path")).toBe("/health");
    });

    it("parses type change scenario", () => {
      const result = parseCreationFlagValues([
        "--type",
        "http",
        "--path",
        "/health",
        "--type",
        "tcp",
      ]);
      // Last --type value should be used
      expect(result.get("--type")).toBe("tcp");
      // --path is still present (validation happens elsewhere)
      expect(result.get("--path")).toBe("/health");
    });

    it("parses long form flags", () => {
      const result = parseCreationFlagValues([
        "--type",
        "http",
        "--name",
        "test",
        "--namespace",
        "default",
      ]);
      expect(result.get("--type")).toBe("http");
      expect(result.get("--name")).toBe("test");
      expect(result.get("--namespace")).toBe("default");
    });
  });

  describe("type-specific scenarios", () => {
    it("parses HTTP healthcheck flags", () => {
      const result = parseCreationFlagValues([
        "--type",
        "http",
        "--path",
        "/api/health",
        "--host-header",
        "example.com",
        "--use-http2",
      ]);
      expect(result.get("--type")).toBe("http");
      expect(result.get("--path")).toBe("/api/health");
      expect(result.get("--host-header")).toBe("example.com");
      expect(result.get("--use-http2")).toBe("");
    });

    it("parses TCP healthcheck flags", () => {
      const result = parseCreationFlagValues([
        "--type",
        "tcp",
        "--expected-response",
        "0x4f4b",
        "--send-payload",
        "0x50494e47",
      ]);
      expect(result.get("--type")).toBe("tcp");
      expect(result.get("--expected-response")).toBe("0x4f4b");
      expect(result.get("--send-payload")).toBe("0x50494e47");
    });
  });
});

describe("formatDefaultValue", () => {
  describe("primitive values", () => {
    it("formats numbers", () => {
      expect(formatDefaultValue(15)).toBe("15");
      expect(formatDefaultValue(0)).toBe("0");
      expect(formatDefaultValue(30)).toBe("30");
    });

    it("formats strings", () => {
      expect(formatDefaultValue("test")).toBe("test");
      expect(formatDefaultValue("")).toBe("");
    });

    it("formats booleans", () => {
      expect(formatDefaultValue(true)).toBe("true");
      expect(formatDefaultValue(false)).toBe("false");
    });
  });

  describe("special values", () => {
    it("returns null for undefined", () => {
      expect(formatDefaultValue(undefined)).toBe(null);
    });

    it("formats null as 'none'", () => {
      expect(formatDefaultValue(null)).toBe("none");
    });
  });

  describe("arrays", () => {
    it("formats empty arrays as 'none'", () => {
      expect(formatDefaultValue([])).toBe("none");
    });

    it("formats small arrays with values", () => {
      expect(formatDefaultValue(["a"])).toBe("a");
      expect(formatDefaultValue(["a", "b"])).toBe("a, b");
      expect(formatDefaultValue(["a", "b", "c"])).toBe("a, b, c");
    });

    it("formats large arrays with ellipsis", () => {
      expect(formatDefaultValue(["a", "b", "c", "d"])).toBe(
        "a, b, c, ... (4 items)",
      );
    });
  });

  describe("objects", () => {
    it("formats empty objects as 'none'", () => {
      expect(formatDefaultValue({})).toBe("none");
    });

    it("formats non-empty objects with key count", () => {
      expect(formatDefaultValue({ a: 1 })).toBe("1 items");
      expect(formatDefaultValue({ a: 1, b: 2, c: 3 })).toBe("3 items");
    });
  });

  describe("real flag examples", () => {
    it("handles --interval default", () => {
      expect(formatDefaultValue(15)).toBe("15");
    });

    it("handles --jitter-percent default", () => {
      expect(formatDefaultValue(30)).toBe("30");
    });

    it("handles --use-http2 default", () => {
      expect(formatDefaultValue(false)).toBe("false");
    });

    it("handles --headers default (empty object)", () => {
      expect(formatDefaultValue({})).toBe("none");
    });

    it("handles --expected-status-codes default (empty array)", () => {
      expect(formatDefaultValue([])).toBe("none");
    });
  });
});

describe("repeatable flag descriptions", () => {
  describe("healthcheck repeatable flags", () => {
    it("should not contain 'repeatable' in base description", () => {
      const healthcheckFlags = getCreationFlags("healthcheck");
      const repeatableFlags = healthcheckFlags.filter((f) => f.isRepeatable);

      expect(repeatableFlags.length).toBeGreaterThan(0);
      for (const flag of repeatableFlags) {
        expect(
          flag.description.toLowerCase(),
          `Flag ${flag.name} should not contain 'repeatable' in description`,
        ).not.toContain("repeatable");
      }
    });

    it("should not contain 'max N' in base description", () => {
      const healthcheckFlags = getCreationFlags("healthcheck");
      const repeatableFlags = healthcheckFlags.filter((f) => f.isRepeatable);

      for (const flag of repeatableFlags) {
        expect(
          flag.description,
          `Flag ${flag.name} should not contain 'max N' pattern in description`,
        ).not.toMatch(/max \d+/);
      }
    });
  });

  describe("origin_pool repeatable flags", () => {
    it("should not contain 'repeatable' in base description", () => {
      const originPoolFlags = getCreationFlags("origin_pool");
      const repeatableFlags = originPoolFlags.filter((f) => f.isRepeatable);

      expect(repeatableFlags.length).toBeGreaterThan(0);
      for (const flag of repeatableFlags) {
        expect(
          flag.description.toLowerCase(),
          `Flag ${flag.name} should not contain 'repeatable' in description`,
        ).not.toContain("repeatable");
      }
    });

    it("should not contain 'max N' in base description", () => {
      const originPoolFlags = getCreationFlags("origin_pool");
      const repeatableFlags = originPoolFlags.filter((f) => f.isRepeatable);

      for (const flag of repeatableFlags) {
        expect(
          flag.description,
          `Flag ${flag.name} should not contain 'max N' pattern in description`,
        ).not.toMatch(/max \d+/);
      }
    });
  });

  describe("repeatable metadata integrity", () => {
    it("all repeatable flags should have isRepeatable=true", () => {
      const healthcheckFlags = getCreationFlags("healthcheck");
      const originPoolFlags = getCreationFlags("origin_pool");
      const allFlags = [...healthcheckFlags, ...originPoolFlags];

      const repeatableFlags = allFlags.filter((f) => f.isRepeatable);
      expect(repeatableFlags.length).toBeGreaterThan(0);

      for (const flag of repeatableFlags) {
        expect(flag.isRepeatable).toBe(true);
      }
    });

    it("repeatable flags with maxOccurrences should have numeric value", () => {
      const healthcheckFlags = getCreationFlags("healthcheck");
      const originPoolFlags = getCreationFlags("origin_pool");
      const allFlags = [...healthcheckFlags, ...originPoolFlags];

      const repeatableFlagsWithMax = allFlags.filter(
        (f) => f.isRepeatable && f.maxOccurrences !== undefined,
      );
      expect(repeatableFlagsWithMax.length).toBeGreaterThan(0);

      for (const flag of repeatableFlagsWithMax) {
        expect(
          typeof flag.maxOccurrences,
          `Flag ${flag.name} maxOccurrences should be a number`,
        ).toBe("number");
        expect(
          flag.maxOccurrences,
          `Flag ${flag.name} maxOccurrences should be positive`,
        ).toBeGreaterThan(0);
      }
    });
  });
});
