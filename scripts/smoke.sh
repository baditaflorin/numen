#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f docs/index.html ]]; then
  echo "docs/index.html does not exist; run make build first" >&2
  exit 1
fi

if ! grep -q 'id="root"' docs/index.html; then
  echo "docs/index.html is not a Vite app shell" >&2
  exit 1
fi

npm run smoke
