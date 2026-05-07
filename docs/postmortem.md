# Postmortem

## What Was Built

Numen v0.1.0 is a Mode B GitHub Pages application at https://baditaflorin.github.io/numen/.

The repository at https://github.com/baditaflorin/numen contains:

- Static React/Vite academic writing workbench published from `main` `/docs`.
- Local-first draft storage through IndexedDB.
- Static literature cache under `docs/data/v1/`.
- Go data generator at `cmd/build-index`.
- BibTeX parsing via Citation.js, Mermaid figures, Cytoscape citation graph, lazy DuckDB-WASM adapter check, Markdown/LaTeX/PDF/ZIP export tools.
- Local hooks, Makefile targets, Vitest unit tests, Go tests, and Playwright smoke test.
- Visible GitHub star link, PayPal support link, version, commit, and data freshness in the UI.

## Was Mode B Correct?

Yes. Mode A would have been possible for the editor alone, but the literature-review cache benefits from deterministic generated artifacts. Mode C would have added operational burden without helping v1 because there are no accounts, private sync, runtime secrets, or shared mutations.

## What Worked

- GitHub Pages served the app from day one.
- Lazy-loading kept the initial JS under the requested budget while still allowing heavy engines to exist as optional chunks.
- The Go generator produced deterministic public data plus metadata.
- Playwright caught a local preview mismatch around the `/numen/` base path.

## What Did Not Work

- Full TeX Live/WebR/Pyodide/LanguageTool execution was not bundled in v0.1.0. The app exposes adapter boundaries and useful export fallbacks, but complete browser TeX compilation needs a separate licensing, header, and asset-hosting pass.
- GitHub Pages cannot set COOP/COEP headers, so threaded WASM modules need extra care or non-threaded builds.
- Build chunks for Mermaid, Cytoscape, DuckDB-WASM, and PDF export are large, although they are lazy.

## Surprises

- `go test ./...` walked into an npm package under `node_modules`, so Go checks are scoped to `./cmd/... ./internal/...`.
- Vite preview is a better Pages simulator than a plain static server because it respects the configured base path.
- Citation.js works well as a lazy BibTeX parser but needs local TypeScript declarations.

## Accepted Tech Debt

- The generated cache is seeded, not yet fetched from arXiv/Crossref/Semantic Scholar.
- Citation similarity uses a lightweight lexical fallback plus placeholder embeddings, not sentence-transformers yet.
- PDF output is a browser-generated draft, not a TeX Live compiled submission PDF.
- PDF/A, ExifTool, LanguageTool, Hunspell, Vale, JabRef, Zotero translator-server, WebR, Pyodide, and local LLM support are represented as planned adapters rather than default runtime engines.

## Next Three Improvements

1. Add a real scheduled/local importer for arXiv, Crossref, Semantic Scholar, and ORCID metadata with resumable checkpoints.
2. Add a TeX compilation adapter using a reviewed WASM engine and document the exact Pages-compatible asset/header strategy.
3. Add real similarity artifacts: TF-IDF vectors, sentence-transformer embeddings, and a DuckDB/Parquet release artifact path.

## Time Spent vs Estimate

Estimated v0.1.0 scaffold: 4-6 hours.

Actual implementation pass: about 2 hours of focused build time in this session, with the heaviest time spent on frontend assembly, Pages build behavior, and smoke-test reliability.
