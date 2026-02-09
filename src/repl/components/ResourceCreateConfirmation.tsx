/**
 * ResourceCreateConfirmation component - Confirmation dialog for resource creation
 * Displays all properties in a clean table and requires "yes" confirmation
 */

import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import { formatBeautifulTable } from "../../output/table.js";
import type { ExecutionResult } from "../executor.js";

export interface ResourceCreateConfirmationProps {
  resourceType: string;
  resourceName: string;
  namespace: string;
  domain: string;
  requestBody: Record<string, unknown>;
  onConfirm: () => Promise<ExecutionResult>;
  onCancel: () => ExecutionResult;
  onExit: (
    result: {
      output: string[];
      shouldExit: boolean;
      shouldClear: boolean;
      contextChanged: boolean;
    } | null,
  ) => void;
}

/**
 * Component states during creation workflow
 */
enum CreationState {
  CONFIRMATION = "confirmation",
  EXECUTING = "executing",
  COMPLETE = "complete",
  ERROR = "error",
}

/**
 * Format a value for display in the properties table
 * Simple values: display directly
 * Nested objects: format as "key: value, key: value" or similar
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "(none)";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    // Simple array of primitives
    const isSimple = value.every(
      (v) =>
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean",
    );
    if (isSimple && value.length <= 5) {
      return `[${value.join(", ")}]`;
    }
    // Complex array - compact format
    return JSON.stringify(value);
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);

    // Empty object
    if (keys.length === 0) {
      return "{}";
    }

    // Small object with simple values - inline format
    if (keys.length <= 3) {
      const allSimple = keys.every((k) => {
        const v = obj[k];
        return (
          v === null ||
          typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean"
        );
      });
      if (allSimple) {
        return keys
          .map((k) => {
            const v = obj[k];
            if (v === null) return `${k}: null`;
            return `${k}: ${v}`;
          })
          .join(", ");
      }
    }

    // Larger objects - compact JSON
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Build property rows from request body for table display
 * Includes metadata (Type, Name, Namespace, Domain) and all spec properties
 */
function buildPropertyRows(
  resourceType: string,
  resourceName: string,
  namespace: string,
  domain: string,
  requestBody: Record<string, unknown>,
): Array<{ property: string; value: string }> {
  const rows: Array<{ property: string; value: string }> = [
    { property: "Type", value: resourceType },
    { property: "Name", value: resourceName },
    { property: "Namespace", value: namespace },
    { property: "Domain", value: domain },
  ];

  // Add spec properties
  if (requestBody.spec && typeof requestBody.spec === "object") {
    const spec = requestBody.spec as Record<string, unknown>;
    for (const [key, value] of Object.entries(spec)) {
      rows.push({
        property: key,
        value: formatValue(value),
      });
    }
  }

  return rows;
}

/**
 * Format property rows as a beautiful table
 */
function formatPropertyTable(
  rows: Array<{ property: string; value: string }>,
): string {
  // Convert rows to format expected by formatBeautifulTable
  const data = rows.map((row) => ({
    property: row.property,
    value: row.value,
  }));

  return formatBeautifulTable(data, {
    columns: [
      { header: "PROPERTY", accessor: "property", minWidth: 18 },
      { header: "VALUE", accessor: "value", minWidth: 20 },
    ],
    wrapText: true,
  });
}

/**
 * ResourceCreateConfirmation component
 * Displays all properties in a table and requires "yes" to confirm creation
 */
export function ResourceCreateConfirmation({
  resourceType,
  resourceName,
  namespace,
  domain,
  requestBody,
  onConfirm,
  onCancel,
  onExit,
}: ResourceCreateConfirmationProps): React.ReactElement {
  const [state, setState] = useState<CreationState>(CreationState.CONFIRMATION);
  const [error, setError] = useState<string | null>(null);
  const [, setResult] = useState<ExecutionResult | null>(null);
  const [input, setInput] = useState("");

  // Handle ESC key to cancel
  useInput((_inputChar, key) => {
    if (key.escape && state === CreationState.CONFIRMATION) {
      handleCancel();
    }
  });

  /**
   * Handle confirmation to create resource
   */
  const handleConfirm = useCallback(async () => {
    setState(CreationState.EXECUTING);
    setError(null);

    try {
      const result = await onConfirm();
      setResult(result);
      setState(CreationState.COMPLETE);

      // Exit and return result to App.tsx
      onExit(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Creation failed: ${errorMessage}`);
      setState(CreationState.ERROR);
    }
  }, [onConfirm, onExit]);

  /**
   * Handle cancellation
   */
  const handleCancel = useCallback(() => {
    const result = onCancel();
    setResult(result);
    // Exit and return result to App.tsx
    onExit(result);
  }, [onCancel, onExit]);

  /**
   * Handle input submission
   */
  const handleSubmit = useCallback(
    (value: string) => {
      // Case-insensitive comparison
      if (value.toLowerCase() === "yes") {
        handleConfirm();
      } else {
        // Clear input and let user try again
        setInput("");
      }
    },
    [handleConfirm],
  );

  // Build property rows and format as table
  const propertyRows = buildPropertyRows(
    resourceType,
    resourceName,
    namespace,
    domain,
    requestBody,
  );
  const tableOutput = formatPropertyTable(propertyRows);

  return (
    <Box flexDirection="column">
      {/* State-based content */}
      {state === CreationState.CONFIRMATION && (
        <>
          {/* Properties table */}
          <Text>{tableOutput}</Text>

          {/* Single-line confirmation prompt with ESC hint */}
          <Box marginTop={1}>
            <Text color="yellow">
              ⚠️ Confirm Resource Creation: Type &quot;yes&quot; to confirm{" "}
            </Text>
            <Text color="dim">(ESC to cancel): </Text>
            <TextInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              focus={true}
            />
          </Box>
        </>
      )}

      {state === CreationState.EXECUTING && (
        <Box paddingTop={1} paddingBottom={1}>
          <Text color="yellow">
            <Spinner type="dots" />
          </Text>
          <Text> Creating resource...</Text>
        </Box>
      )}

      {state === CreationState.ERROR && error && (
        <Box flexDirection="column" paddingTop={1}>
          <Text color="red">{error}</Text>
          <Text color="dim">Press ESC to go back.</Text>
        </Box>
      )}
    </Box>
  );
}

export default ResourceCreateConfirmation;
