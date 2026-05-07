# 0011 - Logging Strategy

## Status

Accepted

## Context

Mode B has no server logs. Browser logs should not leak user draft text.

## Decision

Production browser logging is limited to non-sensitive diagnostics for adapter load failures and data validation errors. Development builds may log richer debug state behind Vite dev mode.

Go generators write stable JSON summaries to stdout and human-readable errors to stderr.

## Consequences

- No draft contents are logged in production.
- Generator output remains scriptable.

## Alternatives Considered

- Client analytics logs: rejected for v1.
- Verbose browser logging: rejected because it risks leaking private writing.
