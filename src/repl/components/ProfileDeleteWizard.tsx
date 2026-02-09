/**
 * ProfileDeleteWizard component - Multi-step wizard for profile deletion
 * Orchestrates profile switching and confirmation for safe deletion
 */

import React, { useState, useCallback } from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import type { REPLSession } from "../session.js";
import { ProfileSwitcher } from "./ProfileSwitcher.js";
import { ConfirmationDialog } from "./ConfirmationDialog.js";
import {
  formatConnectionTable,
  buildConnectionInfo,
} from "../../domains/login/profile/connection-table.js";

interface ProfileDeleteWizardProps {
  profileToDelete: string;
  isActive: boolean;
  session: REPLSession;
  width?: number;
  onExit: (success: boolean, messages: string[]) => void;
}

/**
 * Wizard steps for the deletion process
 */
enum WizardStep {
  PROFILE_SWITCH = "switch",
  CREATE_PROFILE = "create",
  CONFIRMATION = "confirmation",
  EXECUTING = "executing",
  COMPLETE = "complete",
}

/**
 * ProfileDeleteWizard component
 * Handles the complete profile deletion workflow with safeguards
 */
export function ProfileDeleteWizard({
  profileToDelete,
  isActive,
  session,
  width = 80,
  onExit,
}: ProfileDeleteWizardProps): React.ReactElement {
  // State for wizard flow - always start with confirmation
  const [step, setStep] = useState<WizardStep>(WizardStep.CONFIRMATION);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  /**
   * Handle profile selection from ProfileSwitcher
   * After switching profiles, proceed with deletion
   */
  const handleProfileSelect = useCallback(
    async (profileName: string) => {
      setStep(WizardStep.EXECUTING);
      setStatusMessage("Switching profiles...");
      setError(null);

      try {
        const success = await session.switchProfile(profileName);
        if (!success) {
          throw new Error(`Failed to switch to profile '${profileName}'`);
        }

        // Profile switched successfully, now delete the old profile
        setStatusMessage("Deleting profile...");

        const manager = session.getProfileManager();
        const result = await manager.delete(profileToDelete);

        if (!result.success) {
          throw new Error(result.message);
        }

        // Deletion successful - build output messages
        const messages = [`Profile '${profileToDelete}' deleted successfully.`];
        messages.push(`Now using profile '${profileName}'.`);
        messages.push(""); // Empty line before table

        // Get current profile and session state for connection table
        const profile = session.getActiveProfile();
        if (profile) {
          const connectionInfo = buildConnectionInfo(
            profileName,
            profile.apiUrl,
            !!profile.apiToken,
            profile.defaultNamespace || session.getNamespace(),
            session.isAuthenticated(),
            session.isTokenValidated(),
            session.getValidationError() ?? undefined,
            session.getAuthSource(),
            session.getEnvVarsPresent(),
          );

          // Format and add connection table
          const tableLines = formatConnectionTable(connectionInfo);
          messages.push(...tableLines);
        }

        onExit(true, messages);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(`Failed: ${errorMessage}`);
        setStep(WizardStep.PROFILE_SWITCH); // Return to selection
      }
    },
    [session, profileToDelete, onExit],
  );

  /**
   * Handle create new profile request
   */
  const handleCreateProfile = useCallback(() => {
    setStep(WizardStep.CREATE_PROFILE);
    // TODO: Implement inline profile creation form
    // For now, just show a placeholder
    onExit(false, [
      "Profile creation from wizard is not yet implemented.",
      "Please use 'login profile create' command and try deletion again.",
    ]);
  }, [onExit]);

  /**
   * Handle confirmation to delete profile
   * After user confirms "yes", either go to profile selection (if active) or delete immediately
   */
  const handleConfirm = useCallback(async () => {
    setError(null);

    // If this is the active profile, need to switch to another one first
    if (isActive) {
      setStep(WizardStep.PROFILE_SWITCH);
      return;
    }

    // Not the active profile, proceed with deletion immediately
    setStep(WizardStep.EXECUTING);
    setStatusMessage("Deleting profile...");

    try {
      const manager = session.getProfileManager();
      const result = await manager.delete(profileToDelete);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Deletion successful
      const messages = [`Profile '${profileToDelete}' deleted successfully.`];
      onExit(true, messages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Deletion failed: ${errorMessage}`);
      setStep(WizardStep.CONFIRMATION); // Return to confirmation
    }
  }, [session, profileToDelete, isActive, onExit]);

  /**
   * Handle cancellation at any step
   */
  const handleCancel = useCallback(() => {
    onExit(false, ["Profile deletion cancelled."]);
  }, [onExit]);

  return (
    <Box flexDirection="column" width={width}>
      {/* Header */}
      <Box borderStyle="round" borderColor="red" padding={1}>
        <Text bold color="red">
          ⚠️ Delete Profile: {profileToDelete}
        </Text>
      </Box>

      {/* Step content */}
      {step === WizardStep.PROFILE_SWITCH && (
        <ProfileSwitcher
          currentProfile={profileToDelete}
          onSelect={handleProfileSelect}
          onCreate={handleCreateProfile}
          onCancel={handleCancel}
          session={session}
          width={width}
        />
      )}

      {step === WizardStep.CONFIRMATION && (
        <ConfirmationDialog
          title="Confirm Profile Deletion"
          message={[
            `You are about to permanently delete profile '${profileToDelete}'.`,
            "This action cannot be undone.",
            "",
            isActive
              ? "After confirmation, you will be prompted to select a replacement profile."
              : "",
            "",
          ]}
          confirmText="yes"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          width={width}
        />
      )}

      {step === WizardStep.EXECUTING && (
        <Box paddingTop={1} paddingBottom={1} paddingLeft={2}>
          <Text color="yellow">
            <Spinner type="dots" />
          </Text>
          <Text> {statusMessage}</Text>
        </Box>
      )}

      {step === WizardStep.CREATE_PROFILE && (
        <Box paddingTop={1} paddingBottom={1} paddingLeft={2}>
          <Text color="yellow">Profile creation wizard (TODO)</Text>
        </Box>
      )}

      {/* Error display */}
      {error && (
        <Box paddingTop={1} paddingLeft={2}>
          <Text color="red">⚠️ {error}</Text>
          <Text> </Text>
          <Text color="dim">Press ESC to go back or try again.</Text>
        </Box>
      )}
    </Box>
  );
}

export default ProfileDeleteWizard;
