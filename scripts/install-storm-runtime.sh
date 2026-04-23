#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is required but was not found on PATH." >&2
  exit 1
fi

RUNTIME_PACKAGES="${STORM_RUNTIME_DEPS:-@storm/runtime @storm/cli}"

echo "Installing Storm runtime dependencies: $RUNTIME_PACKAGES"
npm install "$@" $RUNTIME_PACKAGES

echo
if command -v storm >/dev/null 2>&1; then
  echo "Storm CLI detected at: $(command -v storm)"
else
  echo "Note: 'storm' command not found on PATH yet."
  echo "If your Storm runtime package exposes a different executable, configure STORM_RUNTIME_DEPS accordingly."
  echo "Example: STORM_RUNTIME_DEPS='@storm/runtime @storm/cli' npm run install:storm"
fi
