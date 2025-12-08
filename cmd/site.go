package cmd

import (
	"github.com/spf13/cobra"
)

// Site-specific flags matching original vesctl
var (
	siteLogColor    bool
	siteLogFabulous bool
	siteLogLevel    int
)

var siteCmd = &cobra.Command{
	Use:     "site",
	Aliases: []string{"s"},
	Short:   "Deploy and manage F5 XC sites on public cloud providers.",
	Long:    `Deploy and manage F5 XC sites on public cloud providers.`,
	Example: `vesctl site aws_vpc create`,
}

func init() {
	rootCmd.AddCommand(siteCmd)

	// Site-specific flags matching original vesctl
	siteCmd.PersistentFlags().BoolVar(&siteLogColor, "log-color", true, "Enable colored log output.")
	siteCmd.PersistentFlags().BoolVar(&siteLogFabulous, "log-fabulous", true, "Enable enhanced log formatting.")
	siteCmd.PersistentFlags().IntVar(&siteLogLevel, "log-level", 3, "Set the logging verbosity level for site operations.")
}
