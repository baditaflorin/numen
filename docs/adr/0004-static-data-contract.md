# 0004 - Static Data Contract

## Status

Accepted

## Context

Mode B needs stable, versioned artifacts that the frontend can fetch from GitHub Pages and cache safely.

## Decision

Use `docs/data/v1/papers.json` and `docs/data/v1/papers.meta.json` for v1.

`papers.json` contains ordered paper records with identifiers, title, abstract, authors, year, venue, DOI/arXiv/ORCID/ontology tags, references, citations, keywords, and an embedding placeholder vector. `papers.meta.json` contains generated time, source commit, input checksum, schema version, artifact version, and record count.

Breaking schema changes move to `docs/data/v2/`. The frontend validates with Zod and keys its cache by schema plus artifact version.

## Consequences

- Small artifacts are committed.
- Large future Tantivy/DuckDB/Parquet artifacts can move to GitHub Releases by immutable tag URL.
- The UI can surface freshness and validation errors clearly.

## Alternatives Considered

- Runtime database: rejected by ADR 0001.
- Browser-only API scraping: rejected because public API availability and rate limits would make v1 fragile.
