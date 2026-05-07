# 0003 - Frontend Framework and Build Tooling

## Status

Accepted

## Context

The frontend needs strict TypeScript, fast local iteration, deterministic Pages builds, lazy chunking, and testable domain logic.

## Decision

Use React, TypeScript strict mode, Vite, Tailwind CSS, Vitest, Testing Library, Playwright, TanStack Query, Zod, IDB, and Lucide React.

React provides a mature ecosystem for dense application UI. Vite provides reliable static builds with base-path support. Tailwind keeps styling local and predictable without shipping a component framework.

## Consequences

- `npm run build` writes to `docs/`.
- TypeScript catches contract drift.
- Heavy modules can be split by dynamic import.

## Alternatives Considered

- SvelteKit: strong static output, but less aligned with the requested React-oriented library ecosystem.
- Next.js static export: heavier than needed and less direct for committed `docs/` output.
- Plain TypeScript: smaller, but slower to build a complete accessible workspace.
