# 0014 - Error Handling Conventions

## Status

Accepted

## Context

Numen handles local drafts, generated data, and heavy optional engines. Failures must be visible without corrupting state.

## Decision

Frontend modules return typed `Result`-like values or throw domain-specific errors caught by an app-level error boundary. User-visible failures appear in a toast and, where useful, an inline recovery panel.

Go code wraps errors with `%w` and uses `internal/utils.HandleErrorOrLogWithMessages(err, errMsg, successMsg)` at command boundaries. No panics.

## Consequences

- Adapter failures degrade features instead of crashing the app.
- Generator errors remain actionable in scripts.

## Alternatives Considered

- Silent fallback: rejected because users need to trust export and citation behavior.
- Panic-driven CLI exits: rejected by convention.
