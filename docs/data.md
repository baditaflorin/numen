# Data Contract

Current schema version: `1.0.0`

Artifacts:

- `docs/data/v1/papers.json`
- `docs/data/v1/papers.meta.json`

`papers.json` is a deterministic array of paper records:

```json
{
  "id": "arxiv:2401.00001",
  "title": "Example title",
  "abstract": "Short abstract",
  "authors": [{ "name": "Ada Lovelace", "orcid": "0000-0000-0000-0000" }],
  "year": 2026,
  "venue": "arXiv",
  "doi": "10.0000/example",
  "arxivId": "2401.00001",
  "keywords": ["writing", "retrieval"],
  "ontologyTags": ["IAO:0000316"],
  "references": ["doi:10.0000/seed"],
  "citations": ["doi:10.0000/downstream"],
  "embedding": [0.12, 0.42, 0.77]
}
```

Metadata includes `generatedAt`, `sourceCommit`, `inputChecksum`, `schemaVersion`, `artifactVersion`, and `recordCount`.

Run:

```bash
make data
```

The generator is idempotent and writes deterministic output.
