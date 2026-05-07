# 0013 - Testing Strategy

## Status

Accepted

## Context

The app needs confidence without GitHub Actions. Checks must be fast enough for local hooks.

## Decision

Use:

- Vitest for TypeScript unit tests.
- Testing Library for focused component tests.
- Go `testing` plus `testify` for generator tests.
- Playwright for one happy-path smoke test against the built `docs/` site.
- `scripts/smoke.sh` as the shared smoke entrypoint.

`make test`, `make build`, and `make smoke` are pre-push gates.

## Consequences

- Broken Pages builds are caught locally.
- Tests stay close to source modules.

## Alternatives Considered

- GitHub Actions: rejected by project constraints.
- Browser-only manual testing: rejected as too fragile.
