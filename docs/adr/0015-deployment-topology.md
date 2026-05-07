# 0015 - Deployment Topology

## Status

Accepted

## Context

Mode B deploys static assets only.

## Decision

GitHub Pages serves the app from `https://baditaflorin.github.io/numen/`. There is no Docker backend, no nginx, no Prometheus, and no server runbook for v1.

## Consequences

- Deployment is a git push to `main` after `make build`.
- Rollback is a git revert.
- Docker-related Mode C sections are intentionally absent.

## Alternatives Considered

- Docker backend behind nginx on port 25342: rejected because no runtime API is needed.
- Pages plus serverless functions: rejected because secrets and mutations are out of scope.
