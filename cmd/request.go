package cmd

import (
	"github.com/spf13/cobra"
)

var requestCmd = &cobra.Command{
	Use:     "request",
	Aliases: []string{"req", "r"},
	Short:   "Execute custom API requests to F5 Distributed Cloud.",
	Long:    `Execute custom API requests to F5 Distributed Cloud.`,
	Example: `vesctl request secrets encrypt --policy-doc temp_policy --public-key pub_key secret`,
}

func init() {
	rootCmd.AddCommand(requestCmd)
}
