# 0016 - Local Git Hooks

## Status

Accepted

## Context

The project intentionally avoids GitHub Actions and needs repeatable local quality gates.

## Decision

Use plain `.githooks/` scripts wired by `make install-hooks`.

- `pre-commit`: formatting checks, lint, typecheck, and staged secret scanning.
- `commit-msg`: Conventional Commits validation.
- `pre-push`: `make test`, `make build`, and `make smoke`.
- `post-merge` and `post-checkout`: regenerate data when inputs are newer than artifacts.

## Consequences

- Hooks are transparent shell scripts.
- Contributors can run every hook target manually.
- Missing optional security tools fail with clear installation guidance where appropriate.

## Alternatives Considered

- Lefthook: capable, but a plain shell setup has fewer moving parts for v1.
- GitHub Actions: rejected by project constraints.
