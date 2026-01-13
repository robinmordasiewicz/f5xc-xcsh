/**
 * ProfileSwitcher component - Interactive profile selection menu
 * Used when deleting an active profile to select a replacement
 */

import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { REPLSession } from "../session.js";
import type { Profile } from "../../profile/types.js";
import { extractTenantFromUrl } from "../../domains/login/profile/connection-table.js";

interface ProfileSwitcherProps {
	currentProfile: string;
	onSelect: (profileName: string) => void;
	onCreate: () => void;
	onCancel: () => void;
	session: REPLSession;
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
 * ProfileSwitcher component
 * Displays list of available profiles with keyboard navigation
 */
export function ProfileSwitcher({
	currentProfile,
	onSelect,
	onCreate,
	onCancel,
	session,
	width = 80,
}: ProfileSwitcherProps): React.ReactElement {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [loading, setLoading] = useState(true);

	// Load profiles on mount
	useEffect(() => {
		async function loadProfiles() {
			try {
				const manager = session.getProfileManager();
				const allProfiles = await manager.list();
				// Filter out the current profile
				const otherProfiles = allProfiles.filter(
					(p) => p.name !== currentProfile,
				);
				setProfiles(otherProfiles);
				setLoading(false);
			} catch (error) {
				console.error("Failed to load profiles:", error);
				setLoading(false);
			}
		}
		loadProfiles();
	}, [session, currentProfile]);

	// Handle keyboard input
	useInput(
		useCallback(
			(inputChar, key) => {
				if (key.escape) {
					onCancel();
					return;
				}

				// Handle 'c' key for create
				if (inputChar === "c" || inputChar === "C") {
					onCreate();
					return;
				}

				if (profiles.length === 0) return;

				// Arrow keys for navigation
				if (key.upArrow) {
					setSelectedIndex((prev) =>
						prev > 0 ? prev - 1 : profiles.length - 1,
					);
				} else if (key.downArrow) {
					setSelectedIndex((prev) =>
						prev < profiles.length - 1 ? prev + 1 : 0,
					);
				} else if (key.return && profiles[selectedIndex]) {
					// Enter to select
					const selected = profiles[selectedIndex];
					if (selected) {
						onSelect(selected.name);
					}
				}
			},
			[profiles, selectedIndex, onSelect, onCreate, onCancel],
		),
	);

	if (loading) {
		return (
			<Box flexDirection="column">
				<Text>Loading profiles...</Text>
			</Box>
		);
	}

	// Special case: No other profiles available
	if (profiles.length === 0) {
		return (
			<Box flexDirection="column" paddingTop={1}>
				<HorizontalRule width={width} />

				<Box paddingTop={1} paddingBottom={1}>
					<Text bold color="yellow">
						⚠️ No other profiles available
					</Text>
				</Box>

				<Box flexDirection="column" paddingLeft={2} paddingBottom={1}>
					<Text>
						You must create a new profile before deleting this one.
					</Text>
					<Text> </Text>
					<Text bold>
						<Text color="yellow">[c]</Text> Create new profile
					</Text>
					<Text bold>
						<Text color="dim">[ESC]</Text> Cancel deletion
					</Text>
				</Box>

				<HorizontalRule width={width} />
			</Box>
		);
	}

	// Normal case: Show profile list
	return (
		<Box flexDirection="column" paddingTop={1}>
			<HorizontalRule width={width} />

			<Box paddingTop={1} paddingBottom={1} paddingLeft={2}>
				<Text bold>Select replacement profile:</Text>
			</Box>

			{/* Profile list */}
			<Box flexDirection="column" paddingLeft={2} paddingBottom={1}>
				{profiles.map((profile, index) => {
					const isSelected = index === selectedIndex;
					const arrow = isSelected ? "❯" : " ";
					const tenant = extractTenantFromUrl(profile.apiUrl);

					return (
						<Box key={profile.name}>
							{isSelected ? (
								<Text bold color="yellow">
									{arrow} {profile.name}
								</Text>
							) : (
								<Text>
									{arrow} {profile.name}
								</Text>
							)}
							<Text color="dim"> ({tenant})</Text>
						</Box>
					);
				})}
			</Box>

			{/* Help text */}
			<Box flexDirection="column" paddingLeft={2} paddingBottom={1}>
				<Text bold>
					<Text color="yellow">[c]</Text> Create new profile
				</Text>
				<Text bold>
					<Text color="dim">[ESC]</Text> Cancel deletion
				</Text>
			</Box>

			<HorizontalRule width={width} />
		</Box>
	);
}

export default ProfileSwitcher;
