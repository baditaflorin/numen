# 0010 - GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The live GitHub Pages URL is a first-class deliverable. The repository must keep the built site in git so Pages can serve it without GitHub Actions. The `.gitignore` should ignore generic build output such as `dist/` while preserving the Pages publish directory.

## Decision

Publish from the `main` branch `/docs` folder.

The Vite build writes production assets directly to `docs/`. The app uses the base path `/numen/`, hashed assets, and a `docs/404.html` SPA fallback. Small static data artifacts live under `docs/data/v1/`. The live URL is `https://baditaflorin.github.io/numen/`.

No `CNAME` is configured in v1. If a custom domain is added later, the `CNAME` file will be committed under `docs/` and DNS instructions will be added to `docs/deploy.md`.

## Consequences

- `docs/` is intentionally committed.
- `dist/` remains ignored for temporary builds, but it is not the Pages output.
- Every successful `make build` produces a Pages-ready tree.
- Rollback is a normal git revert of the publishing commit.

## Alternatives Considered

- `gh-pages` branch: rejected because it makes local-only hooks and milestone commits harder to inspect.
- Repository root publishing: rejected because it mixes source files and production assets.
- GitHub Actions Pages deployment: rejected because the project explicitly uses local hooks, not Actions.
