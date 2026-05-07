package catalog

import (
	"os"
	"path/filepath"
	"testing"
)

func TestWriteArtifacts(t *testing.T) {
	papers := []Paper{
		{
			ID:       "b",
			Title:    "Second",
			Abstract: "Abstract",
			Authors:  []Author{{Name: "Ada"}},
			Year:     2024,
			Venue:    "Journal",
		},
		{
			ID:       "a",
			Title:    "First",
			Abstract: "Abstract",
			Authors:  []Author{{Name: "Grace"}},
			Year:     2026,
			Venue:    "Journal",
		},
	}
	dir := t.TempDir()
	summary, err := WriteArtifacts(papers, "checksum", filepath.Join(dir, "papers.json"), filepath.Join(dir, "meta.json"), "test")
	if err != nil {
		t.Fatal(err)
	}
	if summary.Records != 2 {
		t.Fatalf("records = %d, want 2", summary.Records)
	}
	if _, err := os.Stat(filepath.Join(dir, "papers.json")); err != nil {
		t.Fatal(err)
	}
}

func TestValidatePapersRejectsDuplicateIDs(t *testing.T) {
	papers := []Paper{
		{ID: "same", Title: "One", Abstract: "A", Authors: []Author{{Name: "Ada"}}, Year: 2026, Venue: "Journal"},
		{ID: "same", Title: "Two", Abstract: "B", Authors: []Author{{Name: "Grace"}}, Year: 2026, Venue: "Journal"},
	}
	if err := ValidatePapers(papers); err == nil {
		t.Fatal("expected duplicate id error")
	}
}
