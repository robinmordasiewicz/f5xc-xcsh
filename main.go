package main

import (
	"os"

	"github.com/robinmordasiewicz/vesctl/cmd"
	"github.com/robinmordasiewicz/vesctl/pkg/errors"
)

func main() {
	if err := cmd.Execute(); err != nil {
		// Use granular exit codes for better scriptability
		os.Exit(errors.GetExitCode(err))
	}
}
