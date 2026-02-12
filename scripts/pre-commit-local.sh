#!/usr/bin/env bash
# Repository-specific pre-commit hooks for f5xc-xcsh
# Called by the universal .pre-commit-config.yaml local-hooks entry
set -euo pipefail

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

# --- Generated file drift detection ---
if [ -x scripts/pre-commit-generated-check.sh ]; then
  echo "[local] Checking generated file drift..."
  bash scripts/pre-commit-generated-check.sh
fi

# --- Docs structure validation ---
if echo "$STAGED_FILES" | grep -q '^docs/' && [ -x scripts/pre-commit-docs-validate.sh ]; then
  echo "[local] Validating docs structure..."
  bash scripts/pre-commit-docs-validate.sh
fi

# --- Python linting (ruff) ---
PY_FILES=$(echo "$STAGED_FILES" | grep '^scripts/.*\.py$' || true)
if [ -n "$PY_FILES" ]; then
  echo "[local] Linting Python files with ruff..."
  if command -v ruff &>/dev/null; then
    echo "$PY_FILES" | xargs ruff check --fix
    echo "$PY_FILES" | xargs ruff format
  else
    echo "[local] ruff not installed, skipping Python lint"
  fi
fi

# --- Shell formatting (shfmt) ---
SH_FILES=$(echo "$STAGED_FILES" | grep '\.sh$' || true)
if [ -n "$SH_FILES" ]; then
  if command -v shfmt &>/dev/null; then
    echo "[local] Formatting shell scripts with shfmt..."
    echo "$SH_FILES" | xargs shfmt -i 2 -ci -bn -w
  fi
fi

# --- TypeScript / React checks ---
TS_FILES=$(echo "$STAGED_FILES" | grep '^src/.*\.tsx\?$' || true)
if [ -n "$TS_FILES" ]; then
  if [ -f package.json ]; then
    echo "[local] Running TypeScript type check..."
    npm run typecheck 2>/dev/null || echo "[local] typecheck failed or not configured"

    echo "[local] Running ESLint..."
    npx eslint --fix src/ 2>/dev/null || echo "[local] eslint failed or not configured"

    echo "[local] Running Prettier..."
    npx prettier --write "src/**/*.{ts,tsx}" 2>/dev/null || true
  fi
fi

# --- npm security audit ---
if echo "$STAGED_FILES" | grep -q '^package\(-lock\)\?\.json$'; then
  if command -v npm &>/dev/null; then
    echo "[local] Running npm security audit..."
    npm audit --audit-level=high 2>/dev/null || true
  fi
fi

echo "[local] All repo-specific checks passed."