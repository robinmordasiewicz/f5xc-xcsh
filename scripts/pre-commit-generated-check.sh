#!/bin/bash
# Pre-commit hook to check for generated file drift
# This prevents CI failures by catching issues before commit

set -e

echo "🔍 Checking for generated file drift..."

# Download specs first
./scripts/download-specs.sh >/dev/null 2>&1

# Regenerate domains
npx tsx scripts/generate-domains.ts >/dev/null 2>&1

# Regenerate completions
npx tsx scripts/generate-completions.ts >/dev/null 2>&1

# Check for changes
if ! git diff --quiet src/types/domains_generated.ts; then
  echo "❌ ERROR: Generated domains are out of sync!"
  echo ""
  echo "   To fix, run:"
  echo "     npx tsx scripts/generate-domains.ts"
  echo "     git add src/types/domains_generated.ts"
  echo "     git commit"
  echo ""
  echo "   Changes detected:"
  git diff --stat src/types/domains_generated.ts
  exit 1
fi

if ! git diff --quiet completions/; then
  echo "❌ ERROR: Generated completions are out of sync!"
  echo ""
  echo "   To fix, run:"
  echo "     npx tsx scripts/generate-completions.ts"
  echo "     git add completions/"
  echo "     git commit"
  echo ""
  echo "   Changes detected:"
  git diff --stat completions/
  exit 1
fi

echo "✅ Generated files are up to date."
