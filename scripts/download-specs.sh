#!/bin/bash
# Download enriched API specifications from GitHub releases
# Source: https://github.com/robinmordasiewicz/f5xc-api-enriched/releases
#
# This script downloads the latest enriched API specs and extracts them
# to .specs/domains/ for use during the build process.

set -e

SPECS_DIR=".specs"
ENRICHED_REPO="robinmordasiewicz/f5xc-api-enriched"
API_URL="https://api.github.com/repos/${ENRICHED_REPO}/releases/latest"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}ℹ${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Fetch latest release information
log_info "Fetching latest enriched spec release..."
RELEASE_JSON=$(curl -sL "$API_URL")

if [ -z "$RELEASE_JSON" ]; then
    log_error "Failed to fetch release information from GitHub API"
    exit 1
fi

VERSION=$(echo "$RELEASE_JSON" | grep -o '"tag_name"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$VERSION" ]; then
    log_error "Could not determine latest version"
    exit 1
fi

log_info "Latest version: $VERSION"

# Check if already downloaded
if [ -f "$SPECS_DIR/.version" ]; then
    CURRENT_VERSION=$(cat "$SPECS_DIR/.version")
    if [ "$CURRENT_VERSION" = "$VERSION" ]; then
        log_success "Specs already up to date ($VERSION)"
        exit 0
    fi
    log_info "Updating from $CURRENT_VERSION to $VERSION"
fi

# Find download URLs
ZIP_URL=$(echo "$RELEASE_JSON" | grep -o '"browser_download_url"[[:space:]]*:[[:space:]]*"[^"]*\.zip"' | head -1 | cut -d'"' -f4)
INDEX_URL=$(echo "$RELEASE_JSON" | grep -o '"browser_download_url"[[:space:]]*:[[:space:]]*"[^"]*index\.json"' | head -1 | cut -d'"' -f4)

if [ -z "$ZIP_URL" ]; then
    log_error "Could not find specs ZIP file in release assets"
    exit 1
fi

# Create specs directory
mkdir -p "$SPECS_DIR"

# Download ZIP file
log_info "Downloading specs from: $ZIP_URL"
if ! curl -sL "$ZIP_URL" -o "$SPECS_DIR/specs.zip"; then
    log_error "Failed to download specs ZIP file"
    exit 1
fi

# Verify ZIP file is valid
if ! unzip -t "$SPECS_DIR/specs.zip" > /dev/null 2>&1; then
    log_error "Downloaded ZIP file is corrupted"
    rm -f "$SPECS_DIR/specs.zip"
    exit 1
fi

# Extract domain specs
log_info "Extracting domain specifications..."
unzip -q -o "$SPECS_DIR/specs.zip" -d "$SPECS_DIR"
rm -f "$SPECS_DIR/specs.zip"

# Download index if available
if [ -n "$INDEX_URL" ]; then
    log_info "Downloading index metadata..."
    curl -sL "$INDEX_URL" -o "$SPECS_DIR/index.json"
fi

# Record version
echo "$VERSION" > "$SPECS_DIR/.version"

# Verify domains directory
if [ ! -d "$SPECS_DIR/domains" ]; then
    log_error "Domains directory not found in downloaded specs"
    exit 1
fi

# Count domain files
DOMAIN_COUNT=$(find "$SPECS_DIR/domains" -name "*.json" -type f | wc -l)
if [ "$DOMAIN_COUNT" -eq 0 ]; then
    log_error "No domain spec files found"
    exit 1
fi

log_success "Downloaded enriched specs $VERSION"
log_info "Location: $SPECS_DIR/domains/"
log_info "Domain files: $DOMAIN_COUNT"
