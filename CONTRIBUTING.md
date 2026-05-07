# Contributing

Thanks for helping make Numen better.

## Local Workflow

1. Run `npm install`.
2. Run `make install-hooks`.
3. Use Conventional Commits such as `feat: add citation graph`.
4. Run `make test` and `make smoke` before pushing.

## Scope

Numen is static-first. Prefer browser execution, build-time/static data generation, and local persistence before proposing a runtime backend.

## Security

Never commit secrets. Use `.env.example` for placeholders only.
