# 0001 - Deployment Mode

## Status

Accepted

## Context

Numen must default to GitHub Pages. The product needs a rich browser app for drafting, citations, literature review, figures, offline cache lookup, and export workflows. It also needs curated paper metadata and search artifacts that are too slow, too large, or too brittle to rebuild on every page load.

The browser can persist user projects locally with IndexedDB and OPFS. Public research metadata can be generated offline and served as static artifacts. v1 does not require hosted accounts, cross-device sync, private document storage, or a secret-backed runtime API.

## Decision

Use Mode B: GitHub Pages plus pre-built data.

The runtime surface is static. GitHub Pages serves the frontend and committed data artifacts from `docs/`. Local generator commands refresh versioned artifacts under `docs/data/v1/`. Large future artifacts may be attached to GitHub Releases and referenced by immutable tag URLs.

## Consequences

- The public app has no runtime backend and no server-side secrets.
- Go code is build-time/local data tooling only.
- User projects remain local to the browser in v1.
- Expensive engines such as DuckDB-WASM, Mermaid, Cytoscape.js, and future TeX/R/WASM modules are lazy-loaded behind user actions.
- Data freshness depends on rerunning the generator and publishing the resulting artifacts.

## Alternatives Considered

- Mode A: rejected for v1 because literature-review caches and searchable metadata are better generated once and reused.
- Mode C: rejected for v1 because a runtime API would add hosting, secrets, CORS, Docker, monitoring, and operational work without being necessary for the requested core workflow.
