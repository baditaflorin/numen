package catalog

// Author identifies a paper author and optional ORCID.
type Author struct {
	Name  string `json:"name"`
	ORCID string `json:"orcid,omitempty"`
}

// Paper is the public static metadata record consumed by the frontend.
type Paper struct {
	ID           string    `json:"id"`
	Title        string    `json:"title"`
	Abstract     string    `json:"abstract"`
	Authors      []Author  `json:"authors"`
	Year         int       `json:"year"`
	Venue        string    `json:"venue"`
	DOI          string    `json:"doi,omitempty"`
	ArxivID      string    `json:"arxivId,omitempty"`
	Keywords     []string  `json:"keywords"`
	OntologyTags []string  `json:"ontologyTags"`
	References   []string  `json:"references"`
	Citations    []string  `json:"citations"`
	Embedding    []float64 `json:"embedding"`
}

// Metadata describes how and when a static data artifact was generated.
type Metadata struct {
	GeneratedAt     string `json:"generatedAt"`
	SourceCommit    string `json:"sourceCommit"`
	InputChecksum   string `json:"inputChecksum"`
	SchemaVersion   string `json:"schemaVersion"`
	ArtifactVersion string `json:"artifactVersion"`
	RecordCount     int    `json:"recordCount"`
}

// BuildSummary is the stable JSON result emitted by the generator.
type BuildSummary struct {
	Output          string `json:"output"`
	MetadataOutput  string `json:"metadataOutput"`
	Records         int    `json:"records"`
	SchemaVersion   string `json:"schemaVersion"`
	ArtifactVersion string `json:"artifactVersion"`
}
