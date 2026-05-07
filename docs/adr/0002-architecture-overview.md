# 0002 - Architecture Overview and Module Boundaries

## Status

Accepted

## Context

Numen combines writing, bibliography work, literature review, visualization, export, and local persistence. The project needs clear boundaries so heavy research tooling can remain lazy-loaded and the first screen can stay fast.

## Decision

Use a static React frontend with feature folders:

- `features/workspace`: paper sections, export, project state.
- `features/library`: static paper cache, search, filters, similarity.
- `features/citations`: BibTeX parsing, citation quality checks, bibliography state.
- `features/figures`: Mermaid and chart specification workflows.
- `features/network`: citation graph visualization.
- `features/system`: version, commit, data freshness, diagnostics.

Build-time data tooling lives in Go under `cmd/` and `internal/`. Shared static schemas live in `src/lib/schema.ts` and are mirrored by Go structs in `internal/catalog`.

## Consequences

- Runtime code is browser-only.
- Data generation stays separate from user document state.
- Heavy engines are imported dynamically by feature modules.

## Alternatives Considered

- A monolithic app folder: rejected because it would make lazy-loading and testing harder.
- A runtime service boundary: rejected by ADR 0001.
