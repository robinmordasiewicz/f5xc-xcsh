/**
 * Suggestions component - Completion popup for tab completion
 * Displays filtered suggestions with keyboard navigation
 */

import React from "react";
import { Box, Text, useInput } from "ink";

/**
 * Suggestion item with display text and completion value
 */
export interface Suggestion {
  label: string; // Display text
  value: string; // Completion value
  description?: string; // Optional description
  category?: string; // e.g., "domain", "action", "flag"
  isPrimary?: boolean; // Primary resources get brighter styling
  quotaLevel?: "none" | "warning" | "error"; // Quota status for coloring
  quotaInfo?: string; // Quota display info (e.g., "149/150") - shown right-justified
}

/**
 * Resource quota information for status line display
 */
export interface ResourceQuotaInfo {
  resourceType: string; // e.g., "healthcheck"
  displayName: string; // e.g., "Health Checks"
  current: number;
  limit: number;
  level: "none" | "warning" | "error";
}

interface SuggestionsProps {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSelect: (suggestion: Suggestion) => void;
  onNavigate: (direction: "up" | "down") => void;
  onCancel: () => void;
  maxVisible?: number;
  isActive?: boolean;
  resourceQuotaInfo?: ResourceQuotaInfo; // Quota info for status line
}

/**
 * Get category color for visual distinction
 */
function getCategoryColor(category?: string): string {
  switch (category) {
    case "domain":
      return "#2196f3"; // Blue
    case "action":
      return "#4caf50"; // Green
    case "flag":
      return "#ffc107"; // Yellow
    case "value":
      return "#9c27b0"; // Purple
    case "context":
      return "#888888"; // Gray - informational, dimmed
    default:
      return "#ffffff"; // White
  }
}

/**
 * Get quota-based color for description text
 * Returns null if no quota-specific coloring needed
 */
function getQuotaColor(
  quotaLevel?: "none" | "warning" | "error",
): string | null {
  if (quotaLevel === "error") return "#CA260A"; // Red (matches brand)
  if (quotaLevel === "warning") return "#ffc107"; // Yellow (matches flag color)
  return null; // Use default coloring
}

/**
 * Get quota indicator emoji based on level
 */
function getQuotaIndicator(quotaLevel?: "none" | "warning" | "error"): string {
  if (quotaLevel === "error") return " ❌";
  if (quotaLevel === "warning") return " ⚠️";
  return "";
}

/**
 * Single suggestion item
 */
function SuggestionItem({
  suggestion,
  isSelected,
  maxLabelWidth,
  isContextOnly,
}: {
  suggestion: Suggestion;
  isSelected: boolean;
  index: number;
  maxLabelWidth: number;
  isContextOnly?: boolean;
}): React.ReactElement {
  const categoryColor = getCategoryColor(suggestion.category);
  const quotaColor = getQuotaColor(suggestion.quotaLevel);
  const quotaIndicator = getQuotaIndicator(suggestion.quotaLevel);

  return (
    <Box justifyContent="space-between" width="100%">
      {/* Left side: Selection indicator + Label + Description */}
      <Box>
        {/* Selection indicator - hide for context-only mode (informational lists) */}
        {isContextOnly ? (
          <Text>{"   "}</Text>
        ) : (
          <Text color={isSelected ? "#CA260A" : "#333333"}>
            {isSelected ? "▶ " : "   "}
          </Text>
        )}

        {/* Label with category color - padded to align descriptions */}
        <Text color={categoryColor} bold={isSelected} inverse={isSelected}>
          {suggestion.label.padEnd(maxLabelWidth)}
        </Text>

        {/* Description if present - primary resources get brighter color */}
        {suggestion.description && (
          <Text
            color={suggestion.isPrimary ? "#ffffff" : "#666666"}
            bold={suggestion.isPrimary || false}
          >
            {" - "}
            {suggestion.description}
          </Text>
        )}
      </Box>

      {/* Right side: Quota info (if present) */}
      {suggestion.quotaInfo && (
        <Box marginLeft={2}>
          <Text
            color={quotaColor ?? "#666666"}
            bold={suggestion.quotaLevel === "error"}
          >
            ({suggestion.quotaInfo}
            {quotaIndicator})
          </Text>
        </Box>
      )}
    </Box>
  );
}

/**
 * Suggestions popup component
 * Displays a scrollable list of suggestions with keyboard navigation
 */
export function Suggestions({
  suggestions,
  selectedIndex,
  onSelect,
  onNavigate,
  onCancel,
  maxVisible = 20,
  isActive = true,
  resourceQuotaInfo,
}: SuggestionsProps): React.ReactElement | null {
  // Detect if all suggestions are context-only (informational, non-selectable)
  const isContextOnlyMode = suggestions.every((s) => s.category === "context");

  // Handle keyboard navigation
  useInput(
    (_input, key) => {
      if (!isActive) return;

      if (key.upArrow) {
        onNavigate("up");
        return;
      }

      if (key.downArrow) {
        onNavigate("down");
        return;
      }

      // Only Tab selects suggestions - Enter should execute command
      // In context-only mode, Tab does nothing (items are informational only)
      if (key.tab) {
        if (isContextOnlyMode) {
          return; // Don't select in context-only mode
        }
        const selected = suggestions.at(selectedIndex);
        if (selected) {
          onSelect(selected);
        }
        return;
      }

      if (key.escape) {
        onCancel();
        return;
      }
    },
    { isActive },
  );

  // Don't render if no suggestions
  if (suggestions.length === 0) {
    return null;
  }

  // Calculate visible window
  const totalCount = suggestions.length;
  const startIndex = Math.max(
    0,
    Math.min(
      selectedIndex - Math.floor(maxVisible / 2),
      totalCount - maxVisible,
    ),
  );
  const visibleSuggestions = suggestions.slice(
    startIndex,
    startIndex + maxVisible,
  );

  // Show scroll indicators
  const showScrollUp = startIndex > 0;
  const showScrollDown = startIndex + maxVisible < totalCount;

  // Calculate max label width for column alignment
  const maxLabelWidth = Math.max(
    ...visibleSuggestions.map((s) => s.label.length),
  );

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="#CA260A"
      paddingX={1}
    >
      {/* Scroll up indicator */}
      {showScrollUp && (
        <Text color="#666666" dimColor>
          {"\u25B2"} ({startIndex} more above)
        </Text>
      )}

      {/* Suggestion items */}
      {visibleSuggestions.map((suggestion, index) => (
        <SuggestionItem
          key={suggestion.value || `context-${startIndex + index}`}
          suggestion={suggestion}
          isSelected={startIndex + index === selectedIndex}
          index={startIndex + index}
          maxLabelWidth={maxLabelWidth}
          isContextOnly={isContextOnlyMode}
        />
      ))}

      {/* Scroll down indicator */}
      {showScrollDown && (
        <Text color="#666666" dimColor>
          {"\u25BC"} ({totalCount - startIndex - maxVisible} more below)
        </Text>
      )}

      {/* Help text - different for context-only mode */}
      <Box marginTop={1} justifyContent="space-between" width="100%">
        <Text color="#666666" dimColor>
          {isContextOnlyMode
            ? "↑↓: scroll | Esc: close"
            : "Tab/→: select | Enter: execute | ↑↓: navigate | Esc: cancel"}
        </Text>
        {/* Resource quota info in status line */}
        {resourceQuotaInfo && (
          <Text
            color={getQuotaColor(resourceQuotaInfo.level) ?? "#666666"}
            bold={resourceQuotaInfo.level === "error"}
          >
            {resourceQuotaInfo.displayName}: {resourceQuotaInfo.current}/
            {resourceQuotaInfo.limit}
            {getQuotaIndicator(resourceQuotaInfo.level)}
          </Text>
        )}
      </Box>
    </Box>
  );
}

/**
 * Hook for managing suggestion state
 */
export function useSuggestions(allSuggestions: Suggestion[]) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [filteredSuggestions, setFilteredSuggestions] =
    React.useState(allSuggestions);

  // Reset selection when suggestions change
  React.useEffect(() => {
    setSelectedIndex(0);
    setFilteredSuggestions(allSuggestions);
  }, [allSuggestions]);

  const navigate = React.useCallback(
    (direction: "up" | "down") => {
      setSelectedIndex((current) => {
        if (direction === "up") {
          return current > 0 ? current - 1 : filteredSuggestions.length - 1;
        } else {
          return current < filteredSuggestions.length - 1 ? current + 1 : 0;
        }
      });
    },
    [filteredSuggestions.length],
  );

  const filter = React.useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      const filtered = allSuggestions.filter(
        (s) =>
          s.label.toLowerCase().includes(lowerQuery) ||
          s.value.toLowerCase().includes(lowerQuery),
      );
      setFilteredSuggestions(filtered);
      setSelectedIndex(0);
    },
    [allSuggestions],
  );

  const reset = React.useCallback(() => {
    setSelectedIndex(0);
    setFilteredSuggestions(allSuggestions);
  }, [allSuggestions]);

  return {
    suggestions: filteredSuggestions,
    selectedIndex,
    selectedSuggestion: filteredSuggestions.at(selectedIndex),
    navigate,
    filter,
    reset,
    setSelectedIndex,
  };
}

export default Suggestions;
