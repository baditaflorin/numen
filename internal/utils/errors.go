// Package utils contains small command helpers shared by local generators.
package utils

import (
	"fmt"
	"log/slog"
	"os"
)

// HandleErrorOrLogWithMessages logs a command error or success message and exits on failure.
func HandleErrorOrLogWithMessages(err error, errMsg, successMsg string) {
	if err != nil {
		slog.Error(errMsg, "error", err)
		fmt.Fprintf(os.Stderr, "%s: %v\n", errMsg, err)
		os.Exit(1)
	}
	slog.Info(successMsg)
}
