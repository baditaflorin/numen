# 0008 - Go Project Layout

## Status

Accepted

## Context

Mode B uses Go for local data generation, not for a runtime API.

## Decision

Follow the requested layout where applicable:

- `cmd/build-index/`: static artifact generator.
- `internal/catalog/`: paper schema, loading, validation, artifact writing.
- `internal/utils/`: shared error logging helper.
- `configs/`, `scripts/`, `test/`: support files.
- `api/` and `pkg/`: present as documented placeholders only when useful; no runtime API is implemented in v1.

## Consequences

- There is no `cmd/server`.
- No Dockerfile or compose stack is needed.
- Go tests cover generator logic.

## Alternatives Considered

- Single Go file: rejected because the generator will grow to include multiple importers.
- Runtime Go API layout: rejected by ADR 0001.
