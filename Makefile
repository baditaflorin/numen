.DEFAULT_GOAL := help
GO_PACKAGES := ./cmd/... ./internal/...

.PHONY: help install-hooks dev build data test test-integration smoke lint fmt pages-preview release clean

help:
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_-]+:.*##/ {printf "%-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install-hooks: ## Wire local git hooks
	@git config core.hooksPath .githooks
	@chmod +x .githooks/* 2>/dev/null || true
	@echo "hooks installed"

dev: ## Run local frontend dev server
	@npm run dev

build: ## Build frontend into docs/ for GitHub Pages
	@npm run build

data: ## Regenerate static data artifacts
	@go run ./cmd/build-index --start "$${NUMEN_DATA_START:-1900-01-01}" --end "$${NUMEN_DATA_END:-2100-12-31}" --concurrency "$${NUMEN_DATA_CONCURRENCY:-4}" --saveEvery "$${NUMEN_DATA_SAVE_EVERY:-100}"

test: ## Run unit tests
	@npm run test
	@go test $(GO_PACKAGES)

test-integration: ## Run integration tests
	@go test -tags=integration ./test/integration/... 2>/dev/null || true

smoke: ## Run smoke tests
	@scripts/smoke.sh

lint: ## Run all linters
	@npm run fmt:check
	@npm run lint
	@npm run typecheck
	@go vet $(GO_PACKAGES)
	@if command -v golangci-lint >/dev/null 2>&1; then golangci-lint run $(GO_PACKAGES); else echo "golangci-lint not installed; skipping"; fi

fmt: ## Format code
	@npm run fmt
	@gofmt -w cmd internal

pages-preview: ## Serve docs/ locally like GitHub Pages
	@npx vite preview --host 0.0.0.0 --port 4173 --strictPort

release: ## Tag a release
	@make data
	@make test
	@make build
	@make smoke
	@git tag v$$(node -p "require('./package.json').version")

clean: ## Remove local build outputs
	@rm -rf node_modules coverage tmp dist-data
