package cmd

// EnvVarSpec represents an environment variable specification for the CLI.
type EnvVarSpec struct {
	Name        string `json:"name" yaml:"name"`
	Description string `json:"description" yaml:"description"`
	RelatedFlag string `json:"related_flag,omitempty" yaml:"related_flag,omitempty"`
	Required    bool   `json:"required,omitempty" yaml:"required,omitempty"`
	Sensitive   bool   `json:"sensitive,omitempty" yaml:"sensitive,omitempty"`
}

// EnvVarRegistry contains all environment variables supported by vesctl.
// This registry is the single source of truth for --help and --spec output.
var EnvVarRegistry = []EnvVarSpec{
	{
		Name:        "VES_API_TOKEN",
		Description: "API token for authenticating with F5 Distributed Cloud services.",
		RelatedFlag: "--api-token",
		Required:    false,
		Sensitive:   true,
	},
	{
		Name:        "VES_API_URL",
		Description: "F5 Distributed Cloud API endpoint URL override.",
		RelatedFlag: "--server-url",
		Required:    false,
		Sensitive:   false,
	},
	{
		Name:        "VES_CACERT",
		Description: "Path to the CA certificate file for TLS server verification.",
		RelatedFlag: "--cacert",
		Required:    false,
		Sensitive:   false,
	},
	{
		Name:        "VES_CERT",
		Description: "Path to the client certificate file for mTLS authentication.",
		RelatedFlag: "--cert",
		Required:    false,
		Sensitive:   false,
	},
	{
		Name:        "VES_CONFIG",
		Description: "Path to the vesctl configuration file.",
		RelatedFlag: "--config",
		Required:    false,
		Sensitive:   false,
	},
	{
		Name:        "VES_KEY",
		Description: "Path to the client private key file for mTLS authentication.",
		RelatedFlag: "--key",
		Required:    false,
		Sensitive:   false,
	},
	{
		Name:        "VES_OUTPUT",
		Description: "Default output format for command results (text, json, yaml, or table).",
		RelatedFlag: "--output-format",
		Required:    false,
		Sensitive:   false,
	},
	{
		Name:        "VES_P12_FILE",
		Description: "Path to the PKCS#12 bundle file containing client certificate and key.",
		RelatedFlag: "--p12-bundle",
		Required:    false,
		Sensitive:   false,
	},
	{
		Name:        "VES_P12_PASSWORD",
		Description: "Password for decrypting the PKCS#12 bundle file.",
		RelatedFlag: "",
		Required:    false,
		Sensitive:   true,
	},
}

// GetEnvVarByName returns the EnvVarSpec for a given environment variable name.
func GetEnvVarByName(name string) *EnvVarSpec {
	for i := range EnvVarRegistry {
		if EnvVarRegistry[i].Name == name {
			return &EnvVarRegistry[i]
		}
	}
	return nil
}

// GetEnvVarByFlag returns the EnvVarSpec for a given CLI flag.
func GetEnvVarByFlag(flag string) *EnvVarSpec {
	for i := range EnvVarRegistry {
		if EnvVarRegistry[i].RelatedFlag == flag {
			return &EnvVarRegistry[i]
		}
	}
	return nil
}
