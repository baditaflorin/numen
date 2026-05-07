#!/usr/bin/env bash
set -euo pipefail

if [[ data/seeds/papers.json -nt docs/data/v1/papers.json ]]; then
  make data
fi
