# Numen

![Live Pages](https://img.shields.io/badge/live-GitHub%20Pages-006d77)
![Version](https://img.shields.io/badge/version-v0.1.0-a15c00)
![Mode](https://img.shields.io/badge/mode-B%20static%20data-4d7c0f)

Live GitHub Pages URL: https://baditaflorin.github.io/numen/

Repository: https://github.com/baditaflorin/numen

Support development: https://www.paypal.com/paypalme/florinbadita

Numen is a static-first academic writing platform for drafting, citations, literature review, figures, and submission-ready PDFs.

![Numen demo](https://baditaflorin.github.io/numen/demo.png)

## Quickstart

```bash
npm install
make data
make build
make pages-preview
make test
```

## Architecture

Numen is a Mode B GitHub Pages app. The runtime surface is static: the browser loads the app, static paper metadata, and versioned artifacts from `docs/`. Offline/local generators refresh small committed data files and can publish large release artifacts later.

```mermaid
flowchart LR
  A["Researcher browser"] --> B["GitHub Pages: static Numen app"]
  B --> C["IndexedDB / OPFS local projects"]
  B --> D["docs/data/v1 static paper cache"]
  E["Local data generators"] --> D
  B --> F["Lazy browser modules: Mermaid, Cytoscape, DuckDB-WASM adapters"]
```

## Documentation

- Architecture: https://github.com/baditaflorin/numen/blob/main/docs/architecture.md
- Data contract: https://github.com/baditaflorin/numen/blob/main/docs/data.md
- Deployment: https://github.com/baditaflorin/numen/blob/main/docs/deploy.md
- ADRs: https://github.com/baditaflorin/numen/tree/main/docs/adr
- Postmortem: https://github.com/baditaflorin/numen/blob/main/docs/postmortem.md

## Local Hooks

```bash
make install-hooks
```

Hooks run formatting, linting, type checks, tests, smoke tests, and secret scanning locally. This project intentionally does not use GitHub Actions.
