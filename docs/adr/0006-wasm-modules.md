# 0006 - WASM Modules

## Status

Accepted

## Context

The target stack includes WASM-heavy engines: TeX Live, DuckDB, Pyodide/matplotlib, WebR/ggplot2, and future NLP helpers. GitHub Pages cannot set arbitrary COOP/COEP headers, and first-load payload must stay under 200KB gzipped.

## Decision

Use lazy, user-triggered WASM adapters. v1 ships a DuckDB-WASM adapter boundary and browser-native fallbacks for search/export. Mermaid and Cytoscape.js are lazy JS engines. TeX/R/Python engines are represented by importable adapter contracts and documented as future installable chunks once their licensing, headers, and asset hosting are validated.

The app must remain useful if a heavy adapter fails to load.

## Consequences

- First load stays small.
- GitHub Pages remains viable.
- PDF export in v1 produces submission bundles and browser-printable drafts; full TeX compilation is a guarded adapter path rather than a required boot dependency.

## Alternatives Considered

- Bundle all engines: rejected for payload size and Pages header limitations.
- Runtime backend compilation: rejected by ADR 0001.
