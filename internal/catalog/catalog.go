// Package catalog validates and writes static literature cache artifacts.
package catalog

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// SchemaVersion is the version of the static frontend data contract.
const SchemaVersion = "1.0.0"

// LoadPapers reads seed paper records and returns their input checksum.
func LoadPapers(path string) ([]Paper, string, error) {
	bytes, err := os.ReadFile(path) // #nosec G304 -- local generator intentionally reads caller-provided seed path.
	if err != nil {
		return nil, "", fmt.Errorf("read papers: %w", err)
	}
	var papers []Paper
	if err := json.Unmarshal(bytes, &papers); err != nil {
		return nil, "", fmt.Errorf("parse papers: %w", err)
	}
	sum := sha256.Sum256(bytes)
	return papers, hex.EncodeToString(sum[:]), nil
}

// ValidatePapers checks minimum frontend contract requirements.
func ValidatePapers(papers []Paper) error {
	if len(papers) == 0 {
		return errors.New("paper catalog is empty")
	}
	seen := map[string]bool{}
	for _, paper := range papers {
		if strings.TrimSpace(paper.ID) == "" {
			return errors.New("paper id is required")
		}
		if seen[paper.ID] {
			return fmt.Errorf("duplicate paper id %q", paper.ID)
		}
		if strings.TrimSpace(paper.Title) == "" || strings.TrimSpace(paper.Abstract) == "" {
			return fmt.Errorf("paper %q needs title and abstract", paper.ID)
		}
		if len(paper.Authors) == 0 {
			return fmt.Errorf("paper %q needs at least one author", paper.ID)
		}
		seen[paper.ID] = true
	}
	return nil
}

// SortPapers orders papers deterministically for stable artifacts.
func SortPapers(papers []Paper) {
	sort.SliceStable(papers, func(i, j int) bool {
		if papers[i].Year == papers[j].Year {
			return papers[i].ID < papers[j].ID
		}
		return papers[i].Year > papers[j].Year
	})
}

// WriteArtifacts writes paper and metadata artifacts atomically.
func WriteArtifacts(papers []Paper, checksum, output, metaOutput, artifactVersion string) (BuildSummary, error) {
	SortPapers(papers)
	meta := Metadata{
		GeneratedAt:     time.Now().UTC().Format(time.RFC3339),
		SourceCommit:    sourceCommit(),
		InputChecksum:   checksum,
		SchemaVersion:   SchemaVersion,
		ArtifactVersion: artifactVersion,
		RecordCount:     len(papers),
	}
	if err := writeJSON(output, papers); err != nil {
		return BuildSummary{}, err
	}
	if err := writeJSON(metaOutput, meta); err != nil {
		return BuildSummary{}, err
	}
	return BuildSummary{
		Output:          output,
		MetadataOutput:  metaOutput,
		Records:         len(papers),
		SchemaVersion:   SchemaVersion,
		ArtifactVersion: artifactVersion,
	}, nil
}

func writeJSON(path string, value any) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o750); err != nil {
		return fmt.Errorf("create artifact directory: %w", err)
	}
	temp := path + ".tmp"
	file, err := os.Create(temp) // #nosec G304 -- local generator intentionally writes caller-provided artifact path.
	if err != nil {
		return fmt.Errorf("create temp artifact: %w", err)
	}
	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(value); err != nil {
		_ = file.Close()
		return fmt.Errorf("encode artifact: %w", err)
	}
	if err := file.Close(); err != nil {
		return fmt.Errorf("close artifact: %w", err)
	}
	if err := os.Rename(temp, path); err != nil {
		return fmt.Errorf("replace artifact: %w", err)
	}
	return nil
}

func sourceCommit() string {
	out, err := exec.Command("git", "rev-parse", "--short", "HEAD").Output()
	if err != nil {
		return "unknown"
	}
	return strings.TrimSpace(string(out))
}
