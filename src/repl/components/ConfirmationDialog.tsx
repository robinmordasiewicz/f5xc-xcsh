/**
 * ConfirmationDialog component - Interactive confirmation dialog requiring typing "yes"
 * Used for dangerous operations like profile deletion
 */

import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";

interface ConfirmationDialogProps {
  title: string;
  message: string[]; // Multi-line warning message
  confirmText: string; // Required text to confirm (e.g., "yes")
  onConfirm: () => void;
  onCancel: () => void;
  width?: number;
}

/**
 * Render a horizontal rule in F5 red
 */
function HorizontalRule({ width }: { width: number }): React.ReactElement {
  const rule = "\u2500".repeat(Math.max(width, 1));
  return <Text color="#CA260A">{rule}</Text>;
}

/**
 * ConfirmationDialog component
 * Displays a warning message and requires user to type exact confirmation text
 */
export function ConfirmationDialog({
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  width = 80,
}: ConfirmationDialogProps): React.ReactElement {
  const [input, setInput] = useState("");

  // Handle ESC key to cancel
  useInput((_inputChar, key) => {
    if (key.escape) {
      onCancel();
    }
  });

  // Handle input submission
  const handleSubmit = useCallback(
    (value: string) => {
      // Case-insensitive comparison
      if (value.toLowerCase() === confirmText.toLowerCase()) {
        onConfirm();
      } else {
        // Clear input and let user try again
        setInput("");
      }
    },
    [confirmText, onConfirm],
  );

  // Check if current input matches (for validation feedback)
  const inputMatches =
    input.toLowerCase() === confirmText.toLowerCase() && input.length > 0;

  return (
    <Box flexDirection="column" width={width}>
      {/* Top border with title */}
      <Box borderStyle="round" borderColor="red" padding={1}>
        <Text bold color="red">
          ⚠️ {title}
        </Text>
      </Box>

      {/* Message lines */}
      <Box flexDirection="column" paddingTop={1} paddingLeft={2}>
        {message.map((line, index) =>
          line ? (
            <Text key={index} color="white">
              {line}
            </Text>
          ) : (
            <Text key={index}>{line}</Text>
          ),
        )}
      </Box>

      {/* Input prompt */}
      <Box paddingTop={1}>
        <HorizontalRule width={width} />
      </Box>

      <Box paddingLeft={2} paddingTop={1} paddingBottom={1}>
        <Text bold>Type &quot;</Text>
        <Text bold color="yellow">
          {confirmText}
        </Text>
        <Text bold>&quot; to confirm: </Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          focus={true}
        />
      </Box>

      <Box>
        <HorizontalRule width={width} />
      </Box>

      {/* Help text */}
      <Box paddingTop={1} paddingLeft={2}>
        {input.length > 0 && !inputMatches ? (
          <Text color="yellow">
            ⚠️ Input doesn&apos;t match. Press Enter to try again.
          </Text>
        ) : (
          <Text color="dim">[ESC] Cancel</Text>
        )}
      </Box>
    </Box>
  );
}

export default ConfirmationDialog;
