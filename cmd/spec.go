package cmd

import (
	"encoding/json"
	"fmt"
	"os"
	"sort"

	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"gopkg.in/yaml.v3"

	"github.com/robinmordasiewicz/vesctl/pkg/errors"
)

// specFlag controls whether to output machine-readable spec
var specFlag bool

// RegisterSpecFlag registers the --spec flag on the root command
// This should be called from root.go init after rootCmd is defined
func RegisterSpecFlag(rootCmd *cobra.Command) {
	rootCmd.PersistentFlags().BoolVar(&specFlag, "spec", false, "Output machine-readable CLI specification (JSON/YAML)")
}

// CLISpec represents the complete CLI specification
type CLISpec struct {
	Name                 string         `json:"name" yaml:"name"`
	Version              string         `json:"version" yaml:"version"`
	Description          string         `json:"description" yaml:"description"`
	Usage                string         `json:"usage" yaml:"usage"`
	EnvironmentVariables []EnvVarSpec   `json:"environment_variables" yaml:"environment_variables"`
	GlobalFlags          []FlagSpec     `json:"global_flags" yaml:"global_flags"`
	Commands             []CommandSpec  `json:"commands" yaml:"commands"`
	ExitCodes            []ExitCodeSpec `json:"exit_codes" yaml:"exit_codes"`
}

// CommandSpec represents a command's specification
type CommandSpec struct {
	Path        []string      `json:"path" yaml:"path"`
	Use         string        `json:"use" yaml:"use"`
	Short       string        `json:"short" yaml:"short"`
	Long        string        `json:"long,omitempty" yaml:"long,omitempty"`
	Aliases     []string      `json:"aliases,omitempty" yaml:"aliases,omitempty"`
	Example     string        `json:"example,omitempty" yaml:"example,omitempty"`
	Flags       []FlagSpec    `json:"flags,omitempty" yaml:"flags,omitempty"`
	Subcommands []CommandSpec `json:"subcommands,omitempty" yaml:"subcommands,omitempty"`
}

// FlagSpec represents a flag's specification
type FlagSpec struct {
	Name        string `json:"name" yaml:"name"`
	Shorthand   string `json:"shorthand,omitempty" yaml:"shorthand,omitempty"`
	Type        string `json:"type" yaml:"type"`
	Default     string `json:"default,omitempty" yaml:"default,omitempty"`
	Description string `json:"description" yaml:"description"`
	Required    bool   `json:"required,omitempty" yaml:"required,omitempty"`
	Hidden      bool   `json:"hidden,omitempty" yaml:"hidden,omitempty"`
}

// ExitCodeSpec represents an exit code's specification
type ExitCodeSpec struct {
	Code        int    `json:"code" yaml:"code"`
	Name        string `json:"name" yaml:"name"`
	Description string `json:"description" yaml:"description"`
}

// GenerateSpec generates the CLI specification
func GenerateSpec(cmd *cobra.Command) *CLISpec {
	spec := &CLISpec{
		Name:                 "vesctl",
		Version:              Version, // From version.go
		Description:          cmd.Long,
		Usage:                cmd.Use,
		EnvironmentVariables: EnvVarRegistry,
		GlobalFlags:          extractFlags(cmd.PersistentFlags()),
		Commands:             extractCommands(cmd, []string{}),
		ExitCodes:            getExitCodes(),
	}
	return spec
}

// extractCommands recursively extracts command specifications
func extractCommands(cmd *cobra.Command, parentPath []string) []CommandSpec {
	var commands []CommandSpec

	for _, subCmd := range cmd.Commands() {
		// Skip hidden commands
		if subCmd.Hidden {
			continue
		}

		cmdPath := append(parentPath, subCmd.Name())
		cmdSpec := CommandSpec{
			Path:    cmdPath,
			Use:     subCmd.Use,
			Short:   subCmd.Short,
			Long:    subCmd.Long,
			Aliases: subCmd.Aliases,
			Example: subCmd.Example,
			Flags:   extractFlags(subCmd.LocalFlags()),
		}

		// Recursively extract subcommands
		if subCmd.HasSubCommands() {
			cmdSpec.Subcommands = extractCommands(subCmd, cmdPath)
		}

		commands = append(commands, cmdSpec)
	}

	// Sort commands alphabetically
	sort.Slice(commands, func(i, j int) bool {
		return commands[i].Use < commands[j].Use
	})

	return commands
}

// extractFlags extracts flag specifications from a FlagSet
func extractFlags(flags *pflag.FlagSet) []FlagSpec {
	var flagSpecs []FlagSpec

	flags.VisitAll(func(f *pflag.Flag) {
		// Skip hidden flags
		if f.Hidden {
			return
		}

		flagSpec := FlagSpec{
			Name:        f.Name,
			Shorthand:   f.Shorthand,
			Type:        f.Value.Type(),
			Default:     f.DefValue,
			Description: f.Usage,
		}

		flagSpecs = append(flagSpecs, flagSpec)
	})

	// Sort flags alphabetically
	sort.Slice(flagSpecs, func(i, j int) bool {
		return flagSpecs[i].Name < flagSpecs[j].Name
	})

	return flagSpecs
}

// getExitCodes returns the exit code specifications
func getExitCodes() []ExitCodeSpec {
	return []ExitCodeSpec{
		{Code: errors.ExitSuccess, Name: "ExitSuccess", Description: "Success"},
		{Code: errors.ExitGenericError, Name: "ExitGenericError", Description: "Generic/unknown error"},
		{Code: errors.ExitValidationError, Name: "ExitValidationError", Description: "Invalid arguments or validation failure"},
		{Code: errors.ExitAuthError, Name: "ExitAuthError", Description: "Authentication or authorization failure"},
		{Code: errors.ExitConnectionError, Name: "ExitConnectionError", Description: "Connection or timeout to API"},
		{Code: errors.ExitNotFoundError, Name: "ExitNotFoundError", Description: "Resource not found"},
		{Code: errors.ExitConflictError, Name: "ExitConflictError", Description: "Resource conflict"},
		{Code: errors.ExitRateLimitError, Name: "ExitRateLimitError", Description: "Rate limited"},
	}
}

// OutputSpec outputs the CLI specification in the requested format
func OutputSpec(cmd *cobra.Command, format string) error {
	spec := GenerateSpec(cmd)

	switch format {
	case "json":
		encoder := json.NewEncoder(os.Stdout)
		encoder.SetIndent("", "  ")
		return encoder.Encode(spec)
	case "yaml":
		encoder := yaml.NewEncoder(os.Stdout)
		encoder.SetIndent(2)
		return encoder.Encode(spec)
	default:
		// Default to JSON for machine readability
		encoder := json.NewEncoder(os.Stdout)
		encoder.SetIndent("", "  ")
		return encoder.Encode(spec)
	}
}

// CheckSpecFlag checks if --spec flag is set and outputs spec if so
// Returns true if spec was output (caller should exit)
func CheckSpecFlag() bool {
	return specFlag
}

// HandleSpecFlag handles the --spec flag and outputs the spec
// This should be called from PersistentPreRunE in root command
// Pass the root command to avoid circular dependency
func HandleSpecFlag(rootCmd *cobra.Command) error {
	if specFlag {
		format := GetOutputFormatWithDefault("json")
		if err := OutputSpec(rootCmd, format); err != nil {
			return fmt.Errorf("failed to output spec: %w", err)
		}
		// Exit after outputting spec
		os.Exit(0)
	}
	return nil
}
