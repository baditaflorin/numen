# 0005 - Client-Side Storage Strategy

## Status

Accepted

## Context

Users need local drafts, BibTeX, figure specs, and workspace preferences to survive refreshes without accounts.

## Decision

Use IndexedDB through the `idb` package for structured project state. Use `localStorage` only for low-risk UI preferences. OPFS is reserved for future large project bundles and PDF/TeX cache artifacts.

## Consequences

- Drafts stay private to the user's browser.
- No server sync exists in v1.
- Export/import remains the portability path.

## Alternatives Considered

- `localStorage` for all state: rejected because project objects can grow and need versioned migrations.
- Server persistence: rejected by ADR 0001.
