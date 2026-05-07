# 0007 - Data Generation Pipeline

## Status

Accepted

## Context

Static paper caches need deterministic generation with metadata suitable for Pages and GitHub Releases.

## Decision

Use Go CLI generators. The v1 command is `cmd/build-index`, which reads `data/seeds/papers.json`, validates records, computes checksum metadata, orders records deterministically, and writes `docs/data/v1/papers.json` plus `docs/data/v1/papers.meta.json`.

Flags use underscores and include `--start`, `--end`, `--concurrency`, and `--saveEvery` for future batch fetchers.

## Consequences

- `make data` is idempotent.
- Partial runs write through temporary files before replacing artifacts.
- Future arXiv/Crossref/Semantic Scholar importers can share the same artifact contract.

## Alternatives Considered

- Node generator: rejected because the project already reserves Go for Mode B data tooling.
- Manual JSON editing only: rejected because metadata and checksums need to be reproducible.
