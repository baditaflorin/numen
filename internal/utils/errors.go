package utils

import (
	"fmt"
	"log/slog"
	"os"
)

func HandleErrorOrLogWithMessages(err error, errMsg, successMsg string) {
	if err != nil {
		slog.Error(errMsg, "error", err)
		fmt.Fprintf(os.Stderr, "%s: %v\n", errMsg, err)
		os.Exit(1)
	}
	slog.Info(successMsg)
}
