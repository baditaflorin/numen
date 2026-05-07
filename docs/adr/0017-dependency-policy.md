# 0017 - Dependency Policy

## Status

Accepted

## Context

Numen touches academic workflows where incorrect parsing, citation handling, or export behavior can waste real time.

## Decision

Prefer mature, production-ready libraries for framework, validation, persistence, citation parsing, visualization, and test tooling. Custom code is limited to product-specific orchestration, UI state, simple fallback scoring, and data contract glue.

Heavy engines must be lazy-loaded and isolated behind adapter interfaces. Dependencies with restrictive licenses require explicit review before becoming default runtime dependencies.

## Consequences

- The app avoids hand-rolled parsers where established packages are available.
- Optional engines can evolve without rewriting the workspace.

## Alternatives Considered

- Build custom parsers and graph/rendering engines: rejected as risky and unnecessary.
- Accept any package that works: rejected because license, payload, and maintenance quality matter.
