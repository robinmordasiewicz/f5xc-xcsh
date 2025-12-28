#!/usr/bin/env bash
# Build standalone binaries using Bun
# ink v5+ requires ESM with top-level await, which pkg doesn't support
# Bun's compile feature handles ESM natively
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DIST_DIR="$PROJECT_ROOT/binaries"
ENTRY="$PROJECT_ROOT/dist/index.js"

# Check for Bun
if ! command -v bun &>/dev/null; then
  # Try common install locations
  if [[ -x "$HOME/.bun/bin/bun" ]]; then
    BUN="$HOME/.bun/bin/bun"
  else
    echo "Error: Bun is not installed. Install with: curl -fsSL https://bun.sh/install | bash"
    exit 1
  fi
else
  BUN="bun"
fi

echo "Using Bun: $BUN ($($BUN --version))"

# Ensure dist/index.js exists
if [[ ! -f "$ENTRY" ]]; then
  echo "Error: dist/index.js not found. Run 'npm run build' first."
  exit 1
fi

# Create output directory
mkdir -p "$DIST_DIR"

echo ""
echo "Building binaries for all platforms..."
echo ""

# Build for each target
build_target() {
  local target="$1"
  local output="$2"
  echo "Building: $output (target: bun-$target)"
  if $BUN build "$ENTRY" --compile --target "bun-$target" --outfile "$DIST_DIR/$output" 2>&1; then
    echo "  ✓ Built successfully"
  else
    echo "  ⚠ Failed (may require cross-compilation support)"
  fi
}

# Linux
build_target "linux-x64" "xcsh-linux-x64"
build_target "linux-arm64" "xcsh-linux-arm64"

# macOS
build_target "darwin-x64" "xcsh-macos-x64"
build_target "darwin-arm64" "xcsh-macos-arm64"

# Windows
build_target "windows-x64" "xcsh-win-x64.exe"

echo ""
echo "Build complete. Binaries:"
ls -lh "$DIST_DIR"/ 2>/dev/null || echo "  (no binaries built)"

# Generate checksums
echo ""
echo "Checksums:"
cd "$DIST_DIR"
if command -v sha256sum &>/dev/null; then
  sha256sum * 2>/dev/null || true
elif command -v shasum &>/dev/null; then
  shasum -a 256 * 2>/dev/null || true
else
  echo "  (install shasum or sha256sum for checksums)"
fi
