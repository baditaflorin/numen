# 0012 - Metrics and Observability

## Status

Accepted

## Context

Mode B has no runtime server. Usage metrics would require a third-party script or beacon endpoint.

## Decision

Ship no analytics in v1.

Expose local diagnostics in the UI: app version, git commit, data artifact version, data generated time, loaded record count, and adapter status.

## Consequences

- No PII or usage telemetry is collected.
- Product decisions rely on user feedback, issues, and local testing.

## Alternatives Considered

- Plausible analytics: privacy-respecting but unnecessary for v1.
- Self-hosted beacon: rejected because it would create a runtime endpoint.
