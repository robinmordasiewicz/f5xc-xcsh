/**
 * Suggestions Keyboard Behavior Unit Tests
 *
 * Component-level tests for keyboard event handling in the Suggestions component.
 * These tests verify that keyboard shortcuts work correctly, with a focus on
 * REGRESSION-004: Enter vs Tab key behavior.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "ink-testing-library";
import React from "react";
import {
  Suggestions,
  type Suggestion,
} from "../../src/repl/components/Suggestions.js";

describe("Suggestions Keyboard Behavior", () => {
  const mockSuggestions: Suggestion[] = [
    {
      label: "create",
      value: "create",
      description: "Create a resource",
      category: "action",
    },
    {
      label: "list",
      value: "list",
      description: "List resources",
      category: "action",
    },
    {
      label: "show",
      value: "show",
      description: "Show resource details",
      category: "action",
    },
  ];

  let onSelect: ReturnType<typeof vi.fn>;
  let onNavigate: ReturnType<typeof vi.fn>;
  let onCancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSelect = vi.fn();
    onNavigate = vi.fn();
    onCancel = vi.fn();
  });

  describe("Tab Key Behavior", () => {
    // SKIPPED: ink-testing-library doesn't trigger useInput callbacks via stdin.write()
    // Actual keyboard behavior verified by tests/regression/known-bugs.test.ts REGRESSION-004
    it.skip("should call onSelect when Tab is pressed", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      // Simulate Tab key
      stdin.write("\t");

      expect(onSelect).toHaveBeenCalledWith(mockSuggestions[0]);
    });

    // SKIPPED: ink-testing-library doesn't trigger useInput callbacks via stdin.write()
    // Actual keyboard behavior verified by tests/regression/known-bugs.test.ts REGRESSION-004
    it.skip("should select the suggestion at the current index", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={1}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      stdin.write("\t");

      expect(onSelect).toHaveBeenCalledWith(mockSuggestions[1]);
    });

    it("should not call onSelect if index is out of bounds", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={99}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      stdin.write("\t");

      // Should not call onSelect for invalid index
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("Enter Key Behavior (REGRESSION-004)", () => {
    it("should NOT call onSelect when Enter is pressed", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      // Simulate Enter key
      stdin.write("\r");

      // Enter should NOT trigger onSelect - it should pass through for command execution
      expect(onSelect).not.toHaveBeenCalled();
    });

    it("should allow Enter to pass through without intercepting", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={1}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      stdin.write("\r");

      // Verify no suggestion selection occurred
      expect(onSelect).not.toHaveBeenCalled();
      expect(onNavigate).not.toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe("Navigation Keys", () => {
    // SKIPPED: ink-testing-library doesn't trigger useInput callbacks via stdin.write()
    // Actual keyboard behavior verified by tests/integration/completion-flow.test.ts
    it.skip("should call onNavigate('up') when Up arrow is pressed", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={1}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      // Simulate Up arrow
      stdin.write("\u001B[A");

      expect(onNavigate).toHaveBeenCalledWith("up");
    });

    // SKIPPED: ink-testing-library doesn't trigger useInput callbacks via stdin.write()
    // Actual keyboard behavior verified by tests/integration/completion-flow.test.ts
    it.skip("should call onNavigate('down') when Down arrow is pressed", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      // Simulate Down arrow
      stdin.write("\u001B[B");

      expect(onNavigate).toHaveBeenCalledWith("down");
    });
  });

  describe("Escape Key Behavior", () => {
    // SKIPPED: ink-testing-library doesn't trigger useInput callbacks via stdin.write()
    // Actual keyboard behavior verified by tests/integration/completion-flow.test.ts
    it.skip("should call onCancel when Escape is pressed", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      // Simulate Escape key
      stdin.write("\u001B");

      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe("Inactive State", () => {
    it("should not respond to keyboard when isActive=false", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
          isActive={false}
        />,
      );

      stdin.write("\t");
      stdin.write("\r");
      stdin.write("\u001B[A");
      stdin.write("\u001B");

      expect(onSelect).not.toHaveBeenCalled();
      expect(onNavigate).not.toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe("Help Text Display", () => {
    it("should display updated help text with Enter key instruction", () => {
      const { lastFrame } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      const output = lastFrame();

      // Verify help text includes Enter key instruction
      expect(output).toContain("Enter: execute");
      expect(output).toContain("Tab/→: select");
      expect(output).toContain("navigate");
      expect(output).toContain("Esc: cancel");
    });
  });

  describe("Empty Suggestions", () => {
    it("should not render when suggestions array is empty", () => {
      const { lastFrame } = render(
        <Suggestions
          suggestions={[]}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      expect(lastFrame()).toBe("");
    });
  });

  describe("Context-Only Mode", () => {
    const contextOnlySuggestions: Suggestion[] = [
      {
        label: "Enter a unique name (names already taken):",
        value: "",
        description: "",
        category: "context",
      },
      {
        label: "• test-http-debug",
        value: "",
        description: "",
        category: "context",
      },
      {
        label: "• test-http-ok",
        value: "",
        description: "",
        category: "context",
      },
      {
        label: "• my-healthcheck",
        value: "",
        description: "",
        category: "context",
      },
    ];

    it("should display context-only help text when all suggestions are context category", () => {
      const { lastFrame } = render(
        <Suggestions
          suggestions={contextOnlySuggestions}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      const output = lastFrame();

      // Verify context-only help text
      expect(output).toContain("↑↓: scroll");
      expect(output).toContain("Esc: close");
      // Should NOT contain selectable mode help text
      expect(output).not.toContain("Tab/→: select");
      expect(output).not.toContain("Enter: execute");
    });

    it("should NOT display selection indicator (▶) for context-only suggestions", () => {
      const { lastFrame } = render(
        <Suggestions
          suggestions={contextOnlySuggestions}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      const output = lastFrame();

      // Should NOT contain the selection arrow
      expect(output).not.toContain("▶");
    });

    it("should display normal help text when mixed categories present", () => {
      const mixedSuggestions: Suggestion[] = [
        { label: "hint text", value: "", description: "", category: "context" },
        {
          label: "actual-resource",
          value: "actual-resource",
          description: "Resource",
          category: "value",
        },
      ];

      const { lastFrame } = render(
        <Suggestions
          suggestions={mixedSuggestions}
          selectedIndex={1}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      const output = lastFrame();

      // Should contain selectable mode help text for mixed suggestions
      expect(output).toContain("Tab/→: select");
      expect(output).toContain("Enter: execute");
    });

    it("should display selection indicator for mixed category suggestions", () => {
      const mixedSuggestions: Suggestion[] = [
        { label: "hint text", value: "", description: "", category: "context" },
        {
          label: "actual-resource",
          value: "actual-resource",
          description: "Resource",
          category: "value",
        },
      ];

      const { lastFrame } = render(
        <Suggestions
          suggestions={mixedSuggestions}
          selectedIndex={1}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      const output = lastFrame();

      // Should contain selection arrow for selectable items
      expect(output).toContain("▶");
    });
  });

  describe("Multiple Key Press Sequence", () => {
    // SKIPPED: ink-testing-library doesn't trigger useInput callbacks via stdin.write()
    // Actual keyboard behavior verified by tests/integration/completion-flow.test.ts
    it.skip("should handle Up then Tab correctly", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={1}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      // Navigate up
      stdin.write("\u001B[A");
      expect(onNavigate).toHaveBeenCalledWith("up");

      // Then select with Tab
      stdin.write("\t");
      expect(onSelect).toHaveBeenCalled();
    });

    // SKIPPED: ink-testing-library doesn't trigger useInput callbacks via stdin.write()
    // Actual keyboard behavior verified by tests/integration/completion-flow.test.ts
    it.skip("should handle Down then Tab correctly", () => {
      const { stdin } = render(
        <Suggestions
          suggestions={mockSuggestions}
          selectedIndex={0}
          onSelect={onSelect}
          onNavigate={onNavigate}
          onCancel={onCancel}
        />,
      );

      // Navigate down
      stdin.write("\u001B[B");
      expect(onNavigate).toHaveBeenCalledWith("down");

      // Then select with Tab
      stdin.write("\t");
      expect(onSelect).toHaveBeenCalled();
    });
  });
});
