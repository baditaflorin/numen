# 0009 - Configuration and Secrets Management

## Status

Accepted

## Context

The frontend cannot contain secrets. Data generators may eventually call APIs but v1 uses committed seed data only.

## Decision

Use environment variables for local generator settings. Commit `.env.example` with placeholders. Ignore `.env` and `.env.*` except `.env.example`. Hooks run `gitleaks protect --staged` when available.

## Consequences

- No frontend secrets exist.
- Optional future API keys are local-only.
- The repository can remain public.

## Alternatives Considered

- Encrypted frontend keys: rejected because obfuscated secrets are still secrets.
- Hosted secret proxy: rejected by ADR 0001.
