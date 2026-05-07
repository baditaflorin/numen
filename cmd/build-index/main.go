package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"

	"github.com/baditaflorin/numen/internal/catalog"
	"github.com/baditaflorin/numen/internal/utils"
)

func main() {
	var input string
	var output string
	var metaOutput string
	var artifactVersion string
	var start string
	var end string
	var concurrency int
	var saveEvery int

	flag.StringVar(&input, "input", "data/seeds/papers.json", "input seed JSON")
	flag.StringVar(&output, "output", "docs/data/v1/papers.json", "output paper artifact")
	flag.StringVar(&metaOutput, "meta_output", "docs/data/v1/papers.meta.json", "output metadata artifact")
	flag.StringVar(&artifactVersion, "artifact_version", "v0.1.0-data.1", "artifact version")
	flag.StringVar(&start, "start", "1900-01-01", "inclusive start date for future fetchers")
	flag.StringVar(&end, "end", "2100-12-31", "inclusive end date for future fetchers")
	flag.IntVar(&concurrency, "concurrency", 4, "future fetcher concurrency")
	flag.IntVar(&saveEvery, "saveEvery", 100, "future batch checkpoint interval")
	flag.IntVar(&saveEvery, "save_every", 100, "future batch checkpoint interval")
	flag.Parse()

	_ = start
	_ = end
	_ = concurrency
	_ = saveEvery

	summary, err := run(input, output, metaOutput, artifactVersion)
	utils.HandleErrorOrLogWithMessages(err, "build index failed", "build index complete")
	if err := json.NewEncoder(os.Stdout).Encode(summary); err != nil {
		fmt.Fprintf(os.Stderr, "encode summary: %v\n", err)
		os.Exit(1)
	}
}

func run(input, output, metaOutput, artifactVersion string) (catalog.BuildSummary, error) {
	papers, checksum, err := catalog.LoadPapers(input)
	if err != nil {
		return catalog.BuildSummary{}, err
	}
	if err := catalog.ValidatePapers(papers); err != nil {
		return catalog.BuildSummary{}, err
	}
	return catalog.WriteArtifacts(papers, checksum, output, metaOutput, artifactVersion)
}
