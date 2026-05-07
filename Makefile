.DEFAULT_GOAL := help

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
	@echo "data pipeline will be added in the next milestone"

test: ## Run unit tests
	@echo "tests will be added in the next milestone"

test-integration: ## Run integration tests
	@echo "integration tests will be added in a later milestone"

smoke: ## Run smoke tests
	@echo "smoke tests will be added in the next milestone"

lint: ## Run all linters
	@echo "linters will be added in the next milestone"

fmt: ## Format code
	@echo "formatters will be added in the next milestone"

pages-preview: ## Serve docs/ locally like GitHub Pages
	@npx --yes http-server docs -p 4173 -c-1

release: ## Tag a release
	@echo "release automation will be added in a later milestone"

clean: ## Remove local build outputs
	@rm -rf node_modules coverage tmp dist-data
