#!/bin/bash
# Pre-commit hook to validate docs folder structure
# This script ensures:
# 1. No internal development docs are in docs/ root
# 2. docs/guides/generated/ doesn't exist (should be auto-generated in CI)
# 3. No files that should be gitignored are committed
# 4. All markdown files in docs/ have valid internal links

set -e

ERRORS=0

echo "Validating docs folder structure..."

# Check for files that should be gitignored but are committed
echo "Checking for committed files that should be ignored..."

# Check specific patterns that should be ignored
if [ -d "docs/guides/generated" ]; then
  echo "❌ ERROR: docs/guides/generated/ directory exists"
  echo "   This directory should not be committed - it's auto-generated in CI."
  ERRORS=$((ERRORS + 1))
fi

# Check for auto-generated command docs that should not be committed
if ls docs/commands/*.md 1>/dev/null 2>&1; then
  echo "❌ ERROR: docs/commands/*.md files exist"
  echo "   These should not be committed - they're auto-generated in CI."
  ERRORS=$((ERRORS + 1))
fi

# List of files that should NOT exist in docs/ (internal development docs)
FORBIDDEN_FILES=(
  "docs/COMMAND_EXECUTION_SEQUENCE.md"
  "docs/SKILLS.md"
  "docs/SPEC_ENHANCEMENTS.md"
  "docs/SPEC_IMPLEMENTATION_SUMMARY.md"
  "docs/XCSH_SKILL_COMPLETION.md"
  "docs/api_reference.md"
  "docs/consistency-warnings-summary.md"
  "docs/description-gaps.md"
  "docs/smart-completion-guide.md"
  "docs/user_guide.md"
)

# Check for forbidden files
for file in "${FORBIDDEN_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "❌ ERROR: Internal development file found: $file"
    echo "   This file should not be committed to the repository."
    echo "   It's either an internal planning document or auto-generated content."
    ERRORS=$((ERRORS + 1))
  fi
done

# Check that docs/guides/generated/ doesn't exist (should be gitignored)
if [ -d "docs/guides/generated" ]; then
  echo "❌ ERROR: docs/guides/generated/ directory exists"
  echo "   This directory should not be committed - it's auto-generated in CI."
  ERRORS=$((ERRORS + 1))
fi

# Check for markdown files with broken internal links
echo ""
echo "Checking for markdown files with potentially broken links..."

# Find markdown files in docs/ (excluding auto-generated commands)
# Use find directly in the loop for better portability
while IFS= read -r -d '' file; do
  # Skip if file doesn't exist (handles edge cases)
  [ -f "$file" ] || continue

  # Check for links to non-existent local files
  # Match patterns like [text](local-path.md) or [text](./local-path.md)
  while IFS= read -r link; do
    # Extract the path from the link (remove anchors, query strings, and leading ./)
    link_path=$(echo "$link" | sed -E 's/\[.*\]\(([^)]+)\)/\1/' | sed 's/#.*$//' | sed 's/^\.\///' | sed 's/^\///')

    # Skip http/https links
    if [[ -z "$link_path" ]] || [[ "$link_path" == http://* ]] || [[ "$link_path" == https://* ]]; then
      continue
    fi

    # Convert the link path to an actual file path
    file_dir=$(dirname "$file")
    target_file="$file_dir/$link_path"

    # Handle index.md references
    if [[ "$link_path" == */ ]]; then
      target_file="${target_file}index.md"
    elif [[ ! "$link_path" =~ \.(md|html|txt)$ ]]; then
      # If no extension, append .md
      target_file="${target_file}.md"
    fi

    if [ ! -f "$target_file" ]; then
      # Special case: skip links to README.md (should be ./README.md)
      if [[ "$link_path" == "README.md" ]] || [[ "$link_path" == "../README.md" ]]; then
        continue
      fi
      # Special case: skip links to docs/commands/ - these are auto-generated in CI
      if [[ "$link_path" == "../commands/"* ]] || [[ "$link_path" == "docs/commands/"* ]]; then
        continue
      fi
      echo "❌ WARNING: Broken link in $file: $link_path"
      echo "   Target file does not exist: $target_file"
    fi
  done < <(grep -oE '\[[^]]*\]\([^)]+\)' "$file" 2>/dev/null | grep -v "http://" | grep -v "https://" || true)
done < <(find docs/ -name "*.md" ! -path "docs/commands/*" -print0 2>/dev/null || true)

echo ""
if [ $ERRORS -gt 0 ]; then
  echo "❌ Docs validation failed with $ERRORS error(s)"
  exit 1
else
  echo "✅ Docs folder structure is valid"
  exit 0
fi
