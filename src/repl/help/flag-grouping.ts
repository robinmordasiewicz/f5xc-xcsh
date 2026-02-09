import type { CreationFlagDefinition } from "../completion/creation-flags.js";
import { getCreationFlags } from "../completion/creation-flags.js";

export interface FlagGroup {
  /** Group ID (e.g., "required", "common", "http", "tcp") */
  id: string;
  /** Display label (e.g., "REQUIRED FLAGS", "HTTP OPTIONS") */
  label: string;
  /** Optional description */
  description?: string;
  /** Priority for group ordering (lower = higher priority) */
  priority: number;
  /** Flags in this group */
  flags: CreationFlagDefinition[];
}

/**
 * Group flags by category for help display.
 *
 * Groups:
 * 1. Required flags (required=true)
 * 2. Common options (no applicableTypes)
 * 3. Type-specific options (from applicableTypes)
 */
export function groupFlagsForHelp(
  resourceType: string,
  typeFilter?: string,
): FlagGroup[] {
  const allFlags = getCreationFlags(resourceType);
  const groups = new Map<string, FlagGroup>();

  for (const flag of allFlags) {
    // Apply type filter if specified
    if (typeFilter && flag.applicableTypes?.length) {
      if (!flag.applicableTypes.includes(typeFilter)) {
        continue;
      }
    }

    // Determine group
    let groupId: string;
    let groupLabel: string;
    let groupPriority: number;

    if (flag.required) {
      groupId = "required";
      groupLabel = "REQUIRED FLAGS";
      groupPriority = 1;
    } else if (!flag.applicableTypes || flag.applicableTypes.length === 0) {
      groupId = "common";
      groupLabel = "COMMON OPTIONS";
      groupPriority = 10;
    } else {
      // Type-specific group
      const type = flag.applicableTypes[0] ?? "unknown"; // Primary type
      groupId = type;
      groupLabel = `${type.toUpperCase()} OPTIONS`;
      groupPriority = 20 + flag.applicableTypes.indexOf(type);
    }

    // Create group if not exists
    if (!groups.has(groupId)) {
      groups.set(groupId, {
        id: groupId,
        label: groupLabel,
        priority: groupPriority,
        flags: [],
      });
    }

    groups.get(groupId)?.flags.push(flag);
  }

  // Sort groups by priority, then flags within groups
  return Array.from(groups.values())
    .sort((a, b) => a.priority - b.priority)
    .map((group) => ({
      ...group,
      flags: group.flags.sort(
        (a, b) =>
          (a.priority || 50) - (b.priority || 50) ||
          a.name.localeCompare(b.name),
      ),
    }));
}
