package cmd

import (
	"fmt"
	"strings"

	"github.com/robinmordasiewicz/xcsh/pkg/branding"
	"github.com/robinmordasiewicz/xcsh/pkg/client"
)

// renderWelcomeBanner creates the modern CLI welcome banner with F5 logo
func renderWelcomeBanner() string {
	var sb strings.Builder

	// Add leading newline for visual separation
	sb.WriteString("\n")

	// Display the F5 logo with two colors:
	// - Red for the circle background (▓ characters)
	// - Bold white for the F5 text (█ characters)
	logoLines := strings.Split(branding.F5Logo, "\n")
	for _, line := range logoLines {
		coloredLine := colorizeLogoLine(line)
		sb.WriteString(coloredLine + "\n")
	}

	// Add spacing after logo
	sb.WriteString("\n")

	// Display info lines in bold white
	infoLines := []string{
		fmt.Sprintf("%s v%s", branding.CLIFullName, Version),
		buildConnectionInfo(),
		"",
		"Type 'help' for commands, 'exit' or Ctrl+D to quit.",
		"Tab completion available.",
	}

	for _, line := range infoLines {
		sb.WriteString(branding.ColorBoldWhite + line + branding.ColorReset + "\n")
	}

	// Add separator line in red
	sb.WriteString(branding.ColorRed + strings.Repeat("─", 80) + branding.ColorReset + "\n")

	return sb.String()
}

// colorizeLogoLine applies red color to circle background and white color to F5 text
// The logo uses:
// - ▓ for the red circle background
// - █ and ▒ for the white F5 text
// - ( and ) for the circle outline (rendered in red)
func colorizeLogoLine(line string) string {
	var result strings.Builder
	inRed := false
	inWhite := false

	for _, r := range line {
		switch r {
		case '▓', '▒', '(', ')':
			// Red for circle background and outline
			if !inRed {
				if inWhite {
					result.WriteString(branding.ColorReset)
					inWhite = false
				}
				result.WriteString(branding.ColorRed)
				inRed = true
			}
			if r == '▓' || r == '▒' {
				result.WriteRune('█') // Render as solid block
			} else {
				result.WriteRune(r)
			}
		case '█':
			// White for F5 text elements
			if !inWhite {
				if inRed {
					result.WriteString(branding.ColorReset)
					inRed = false
				}
				result.WriteString(branding.ColorBoldWhite)
				inWhite = true
			}
			result.WriteRune(r)
		default:
			// Reset for spaces and other characters
			if inRed || inWhite {
				result.WriteString(branding.ColorReset)
				inRed = false
				inWhite = false
			}
			result.WriteRune(r)
		}
	}

	// Final reset if we ended in a color
	if inRed || inWhite {
		result.WriteString(branding.ColorReset)
	}

	return result.String()
}

// buildConnectionInfo returns tenant and API info string
func buildConnectionInfo() string {
	if serverURL == "" {
		return "Not connected · Set F5XC_API_URL to connect"
	}

	tenant := client.ExtractTenant(serverURL)
	// Extract domain from URL for display
	domain := extractDomain(serverURL)

	return fmt.Sprintf("Tenant: %s · API: %s", tenant, domain)
}

// extractDomain extracts the domain from a URL for compact display
func extractDomain(url string) string {
	// Remove protocol
	url = strings.TrimPrefix(url, "https://")
	url = strings.TrimPrefix(url, "http://")
	// Remove trailing slashes
	url = strings.TrimSuffix(url, "/")
	return url
}
