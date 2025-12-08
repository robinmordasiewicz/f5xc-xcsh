package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/robinmordasiewicz/vesctl/pkg/client"
	"github.com/robinmordasiewicz/vesctl/pkg/config"
)

var (
	// Config file path
	cfgFile string

	// Connection settings (vesctl compatible)
	serverURL string
	cert        string
	key         string
	cacert      string
	p12Bundle   string
	hardwareKey bool // Use yubikey for TLS connection
	useAPIToken bool // Use API token from VES_API_TOKEN environment variable

	// Output control (vesctl compatible)
	outputFormat string // Output format for command (canonical: --output-format)
	outputDir    string // Output dir for command

	// Behavior flags (vesctl compatible)
	showCurl       bool // Emit requests from program in CURL format
	timeout        int  // Timeout (in seconds) for command to finish
	nonInteractive bool // Fail on missing arguments instead of prompting

	// Internal flags (not exposed to CLI)
	debug bool

	// Global client instance
	apiClient *client.Client
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "vesctl",
	Short: "Command-line interface for F5 Distributed Cloud services.",
	Long:  `Command-line interface for F5 Distributed Cloud services.`,
	// Run handles the root command when no subcommand is specified
	RunE: func(cmd *cobra.Command, args []string) error {
		// Handle --spec flag for root command
		if CheckSpecFlag() {
			format := GetOutputFormatWithDefault("json")
			return OutputSpec(cmd, format)
		}
		// If no --spec flag, show help
		return cmd.Help()
	},
	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
		// Skip client initialization for non-API commands
		skipCommands := map[string]bool{
			"version":    true,
			"completion": true,
			"help":       true,
			"vesctl":     true, // Root command itself
		}
		if skipCommands[cmd.Name()] {
			return nil
		}

		// Initialize the API client
		cfg := &client.Config{
			ServerURL: serverURL,
			Cert:      cert,
			Key:       key,
			CACert:    cacert,
			P12Bundle: p12Bundle,
			Debug:     debug,
			Timeout:   timeout,
		}

		// Handle API token authentication
		if useAPIToken {
			token := os.Getenv("VES_API_TOKEN")
			if token == "" {
				return fmt.Errorf("VES_API_TOKEN environment variable not set")
			}
			cfg.APIToken = token
		}

		var err error
		apiClient, err = client.New(cfg)
		if err != nil {
			return fmt.Errorf("failed to initialize client: %w", err)
		}

		return nil
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
func Execute() error {
	return rootCmd.Execute()
}

func init() {
	cobra.OnInitialize(initConfig)

	// Global flags matching original vesctl exactly
	pf := rootCmd.PersistentFlags()

	// Connection settings (vesctl compatible)
	pf.StringVarP(&cacert, "cacert", "a", "", "Path to the server CA certificate file for TLS verification.")
	pf.StringVarP(&cert, "cert", "c", "", "Path to the client certificate file for mTLS authentication.")
	// Get default config path for help text (matches original vesctl behavior)
	defaultConfigPath := "$HOME/.vesconfig"
	if home, err := os.UserHomeDir(); err == nil {
		defaultConfigPath = filepath.Join(home, ".vesconfig")
	}
	pf.StringVar(&cfgFile, "config", "", fmt.Sprintf("Path to the configuration file containing API URL and credentials (default %q).", defaultConfigPath))
	pf.BoolVar(&hardwareKey, "hardwareKey", false, "Use a YubiKey hardware security module for TLS authentication.")
	pf.StringVarP(&key, "key", "k", "", "Path to the client private key file for mTLS authentication.")

	// Output format: --output-format is canonical, --outfmt is hidden alias for backward compatibility
	pf.StringVar(&outputFormat, "output-format", "", "Set the output format to text, json, yaml, or table.")
	pf.StringVar(&outputFormat, "outfmt", "", "Output format for command (deprecated: use --output-format).")
	_ = pf.MarkHidden("outfmt") // Hide deprecated alias

	pf.StringVarP(&outputDir, "output", "o", "./", "Directory path for command output files.")
	pf.StringVar(&p12Bundle, "p12-bundle", "", "Path to PKCS#12 bundle file containing client certificate and key. Set password in VES_P12_PASSWORD.")
	pf.StringVarP(&serverURL, "server-url", "u", "", "F5 Distributed Cloud API endpoint URL.")
	pf.BoolVar(&showCurl, "show-curl", false, "Output equivalent curl commands for each API request.")
	pf.IntVar(&timeout, "timeout", 5, "Maximum time in seconds to wait for command completion.")
	pf.BoolVar(&useAPIToken, "api-token", false, "Authenticate using the API token from VES_API_TOKEN environment variable.")
	pf.BoolVar(&nonInteractive, "non-interactive", false, "Disable interactive prompts and fail if required arguments are missing.")

	// Bind flags to viper (errors are ignored as flags are guaranteed to exist)
	_ = viper.BindPFlag("server-url", pf.Lookup("server-url"))
	_ = viper.BindPFlag("cert", pf.Lookup("cert"))
	_ = viper.BindPFlag("key", pf.Lookup("key"))
	_ = viper.BindPFlag("cacert", pf.Lookup("cacert"))
	_ = viper.BindPFlag("p12-bundle", pf.Lookup("p12-bundle"))

	// Register --spec flag for machine-readable CLI specification
	RegisterSpecFlag(rootCmd)
}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
		viper.SetConfigType("yaml") // .vesconfig files are YAML
	} else {
		home, err := os.UserHomeDir()
		if err != nil {
			if debug {
				fmt.Fprintln(os.Stderr, "Warning: could not find home directory:", err)
			}
			return
		}

		viper.AddConfigPath(home)
		viper.SetConfigType("yaml")
		viper.SetConfigName(".vesconfig")
	}

	viper.SetEnvPrefix("VES")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err == nil {
		if debug {
			fmt.Fprintln(os.Stderr, "Using config file:", viper.ConfigFileUsed())
		}
		applyConfigToFlags()
	} else {
		// No config file found, apply default
		if serverURL == "" {
			serverURL = "http://localhost:8001"
		}
	}
}

// applyConfigToFlags applies viper config values to flags
func applyConfigToFlags() {
	cfg, err := config.Load(viper.ConfigFileUsed())
	if err != nil {
		// If config file couldn't be loaded, apply default
		if serverURL == "" {
			serverURL = "http://localhost:8001"
		}
		return
	}

	// VES_API_URL environment variable overrides server-url from config
	if envURL := os.Getenv("VES_API_URL"); envURL != "" {
		serverURL = envURL
	} else if serverURL == "" && cfg.ServerURL != "" {
		// Apply config values if CLI flags not set
		serverURL = cfg.ServerURL
	}

	if cert == "" && cfg.Cert != "" {
		cert = expandPath(cfg.Cert)
	}
	if key == "" && cfg.Key != "" {
		key = expandPath(cfg.Key)
	}
	if p12Bundle == "" && cfg.P12Bundle != "" {
		p12Bundle = expandPath(cfg.P12Bundle)
	}

	// Apply API token config if not already set via CLI flag
	if !useAPIToken && cfg.APIToken {
		useAPIToken = true
	}

	// Apply fallback default if still not set
	if serverURL == "" {
		serverURL = "http://localhost:8001"
	}
}

// expandPath expands ~ to home directory
func expandPath(path string) string {
	if len(path) > 0 && path[0] == '~' {
		home, err := os.UserHomeDir()
		if err != nil {
			return path
		}
		return filepath.Join(home, path[1:])
	}
	return path
}

// GetClient returns the initialized API client
func GetClient() *client.Client {
	return apiClient
}

// GetOutputFormat returns the current output format (defaults to table for list operations)
func GetOutputFormat() string {
	if outputFormat != "" {
		return outputFormat
	}
	return "table" // Default to table for list operations
}

// GetOutputFormatWithDefault returns the current output format with a custom default
func GetOutputFormatWithDefault(defaultFmt string) string {
	if outputFormat != "" {
		return outputFormat
	}
	return defaultFmt
}

// IsNonInteractive returns whether non-interactive mode is enabled
func IsNonInteractive() bool {
	return nonInteractive
}

// GetOutputDir returns the output directory
func GetOutputDir() string {
	return outputDir
}

// IsDebug returns whether debug mode is enabled
func IsDebug() bool {
	return debug
}

// GetTimeout returns the timeout in seconds
func GetTimeout() int {
	return timeout
}

// ShowCurl returns whether to emit CURL format
func ShowCurl() bool {
	return showCurl
}
