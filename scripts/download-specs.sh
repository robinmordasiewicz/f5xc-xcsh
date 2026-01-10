#!/bin/bash
# Download enriched API specifications from GitHub releases
# Source: https://github.com/robinmordasiewicz/f5xc-api-enriched/releases
#
# This script downloads the latest enriched API specs and extracts them
# to .specs/domains/ for use during the build process.
#
# The downloaded specs include all domain resources with:
# - Complete OpenAPI 3.0 specifications
# - Example values using 'example-' prefix (standard naming convention)
# - Consolidated openapi.json/yaml for reference
#
# Features:
# - Exponential backoff retry logic for transient network errors
# - Automatic fallback on permanent errors
# - Detailed logging for debugging
# - Version caching in .specs/.version to track upstream releases

set -e

SPECS_DIR=".specs"
ENRICHED_REPO="robinmordasiewicz/f5xc-api-enriched"
API_URL="https://api.github.com/repos/${ENRICHED_REPO}/releases/latest"

# Retry configuration
MAX_RETRIES=5
INITIAL_BACKOFF=3
MAX_BACKOFF=120
RATE_LIMIT_BACKOFF=60

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_debug() {
  echo -e "${BLUE}⋯${NC} $1"
}

# GitHub authentication (optional, but recommended for CI to avoid rate limits)
# Priority: GITHUB_TOKEN env var > GH CLI token > unauthenticated
GITHUB_AUTH_HEADER=""
AUTH_SOURCE=""

if [ -n "$GITHUB_TOKEN" ]; then
  GITHUB_AUTH_HEADER="Authorization: Bearer $GITHUB_TOKEN"
  AUTH_SOURCE="GITHUB_TOKEN"
elif command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
  # Try to get token from GitHub CLI if available and logged in
  GH_TOKEN=$(gh auth token 2>/dev/null)
  if [ -n "$GH_TOKEN" ]; then
    GITHUB_AUTH_HEADER="Authorization: Bearer $GH_TOKEN"
    AUTH_SOURCE="gh auth"
  fi
fi

if [ -n "$AUTH_SOURCE" ]; then
  log_debug "Using authenticated GitHub API requests ($AUTH_SOURCE)"
else
  # Only warn if we don't have cached specs - new downloads need more API calls
  if [ -f "$SPECS_DIR/.version" ] && [ -f "$SPECS_DIR/index.json" ]; then
    log_debug "No GitHub auth - using unauthenticated requests (cached specs available)"
  else
    log_warn "No GitHub auth - API requests may be rate limited (60/hour)"
    log_debug "Set GITHUB_TOKEN or run 'gh auth login' for higher rate limits"
  fi
fi

# Pre-flight check: verify we're not rate limited before making requests
# This prevents wasted time on retries when we know we're blocked
check_rate_limit_status() {
  local rate_url="https://api.github.com/rate_limit"
  local curl_opts=(-s --max-time 10 --connect-timeout 5)
  if [ -n "$GITHUB_AUTH_HEADER" ]; then
    curl_opts+=(-H "$GITHUB_AUTH_HEADER")
  fi

  local response
  response=$(curl "${curl_opts[@]}" "$rate_url" 2>/dev/null)
  if [ -z "$response" ]; then
    return 0 # Can't check, proceed anyway
  fi

  # Extract core rate limit remaining (handle both compact and pretty-printed JSON)
  # Flatten JSON to single line for reliable parsing
  local flat_response
  flat_response=$(echo "$response" | tr -d '\n' | tr -s ' ')

  local remaining
  remaining=$(echo "$flat_response" | sed -n 's/.*"core"[^}]*"remaining"[[:space:]]*:[[:space:]]*\([0-9]*\).*/\1/p')
  if [ -z "$remaining" ]; then
    return 0 # Couldn't parse, proceed anyway
  fi

  if [ "$remaining" -eq 0 ]; then
    local reset_time
    reset_time=$(echo "$flat_response" | sed -n 's/.*"core"[^}]*"reset"[[:space:]]*:[[:space:]]*\([0-9]*\).*/\1/p')
    local now
    now=$(date +%s)
    local wait_secs=$((reset_time - now))
    if [ "$wait_secs" -gt 0 ] && [ "$wait_secs" -lt 3600 ]; then
      log_warn "GitHub API rate limit exhausted"
      log_warn "Reset in $((wait_secs / 60)) minutes"
      if [ -n "$AUTH_SOURCE" ]; then
        log_error "Even authenticated requests are rate limited - this is unusual"
        return 1
      else
        log_info "Tip: Set GITHUB_TOKEN or run 'gh auth login' for 5000 requests/hour"
      fi
      # If we have cached specs, we can continue with them
      if [ -f "$SPECS_DIR/.version" ] && [ -f "$SPECS_DIR/index.json" ]; then
        log_info "Using cached specs (may be outdated)"
        return 2 # Special return code: use cache
      fi
      return 1
    fi
  else
    log_debug "Rate limit remaining: $remaining requests"
  fi

  return 0
}

# Check if error is specifically a rate limit error (requires longer backoff)
# Returns 0 if rate limited, 1 otherwise
is_rate_limit_error() {
  local error="$1"
  local http_code="${2:-}"

  # HTTP 429 is explicit rate limit
  if [ "$http_code" = "429" ]; then
    return 0
  fi

  # HTTP 403 with rate limit message
  if [ "$http_code" = "403" ]; then
    if echo "$error" | grep -qiE "(rate.limit|API rate limit exceeded|abuse detection)"; then
      return 0
    fi
  fi

  # Rate limit messages in response body
  if echo "$error" | grep -qiE "(rate.limit|API rate limit exceeded|abuse detection)"; then
    return 0
  fi

  return 1
}

# Determine if an error is transient (worth retrying)
is_transient_error() {
  local error="$1"
  local http_code="${2:-}"

  # Empty error with no HTTP code - treat as transient (benefit of doubt)
  if [ -z "$error" ] && [ -z "$http_code" ]; then
    return 0
  fi

  # HTTP status code based detection
  if [ -n "$http_code" ]; then
    case "$http_code" in
      # Rate limiting - transient
      429)
        log_debug "Rate limit exceeded (HTTP 429) - will use extended backoff"
        return 0
        ;;
      # Forbidden - often rate limiting without proper headers
      403)
        log_debug "Forbidden (HTTP 403) - possibly rate limited"
        return 0
        ;;
      # Server errors - always transient
      500 | 502 | 503 | 504)
        log_debug "Server error (HTTP $http_code)"
        return 0
        ;;
      # Success codes - not an error
      2*)
        return 1
        ;;
    esac
  fi

  # Network timeouts, connection errors, temporary DNS issues
  if echo "$error" | grep -qiE "(timeout|connection|refused|temporarily|unavailable|timed out|resolving|name or service|reset by peer|broken pipe)"; then
    return 0
  fi

  # Rate limit messages in response body
  if echo "$error" | grep -qiE "(rate.limit|API rate limit exceeded|abuse detection)"; then
    return 0
  fi

  # Empty response (API returned nothing)
  if echo "$error" | grep -qiE "(empty|no data|unexpected EOF)"; then
    return 0
  fi

  # curl exit codes for transient errors
  # 7: connection failed, 28: operation timeout, 35: SSL connect error, 56: recv error
  return 1
}

# Retry function with exponential backoff for API calls
# Captures HTTP status code for better error classification
retry_api_with_backoff() {
  local name="$1"
  local url="$2"
  local attempt=1
  local backoff=$INITIAL_BACKOFF

  while [ $attempt -le $MAX_RETRIES ]; do
    log_debug "[$name] Attempt $attempt/$MAX_RETRIES"

    # Build curl command with optional auth header
    # Use longer timeouts for CI environments that may be slower
    local curl_opts=(-s -L --max-time 60 --connect-timeout 15 -w "\n%{http_code}")
    if [ -n "$GITHUB_AUTH_HEADER" ]; then
      curl_opts+=(-H "$GITHUB_AUTH_HEADER")
    fi

    # Execute curl and capture response with HTTP code
    local response
    response=$(curl "${curl_opts[@]}" "$url" 2>&1)
    local exit_code=$?

    # Extract HTTP code (last line) and body (everything else)
    local http_code
    local body
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    # Log response details for debugging
    log_debug "[$name] HTTP Code: $http_code, curl exit: $exit_code"

    # Success case
    if [ $exit_code -eq 0 ] && [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
      log_debug "[$name] Request successful"
      echo "$body"
      return 0
    fi

    # Determine error message
    local error=""
    if [ $exit_code -ne 0 ]; then
      error="curl exit code $exit_code"
      # Provide more context for common curl errors
      case $exit_code in
        6) error="$error (could not resolve host)" ;;
        7) error="$error (failed to connect)" ;;
        28) error="$error (operation timed out)" ;;
        35) error="$error (SSL connect error)" ;;
        56) error="$error (receive error)" ;;
      esac
    elif [ -n "$body" ]; then
      # Try to extract error message from JSON response
      error=$(echo "$body" | grep -o '"message"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | cut -d'"' -f4)
      [ -z "$error" ] && error="HTTP $http_code"
    else
      error="Empty response (HTTP $http_code)"
    fi

    if [ $attempt -eq $MAX_RETRIES ]; then
      log_error "[$name] Failed after $MAX_RETRIES attempts"
      log_error "HTTP Code: $http_code, Exit Code: $exit_code"
      log_error "Error: $error"
      log_error "URL: $url"
      [ -n "$GITHUB_AUTH_HEADER" ] && log_error "Auth: Using token" || log_error "Auth: No token (may be rate limited)"
      return 1
    fi

    # Check if error is transient (pass both error message and HTTP code)
    if is_transient_error "$error" "$http_code"; then
      # Use longer backoff for rate limit errors
      local wait_time=$backoff
      if is_rate_limit_error "$error" "$http_code"; then
        wait_time=$RATE_LIMIT_BACKOFF
        log_warn "[$name] Rate limit detected - using extended backoff"
      fi

      log_warn "[$name] Transient error (attempt $attempt/$MAX_RETRIES): $error"
      log_warn "[$name] Retrying in ${wait_time}s..."
      sleep "$wait_time"

      # Exponential backoff: double the wait time, cap at MAX_BACKOFF
      backoff=$((backoff * 2))
      if [ $backoff -gt $MAX_BACKOFF ]; then
        backoff=$MAX_BACKOFF
      fi
    else
      # Permanent error - don't retry
      log_error "[$name] Permanent error (not retrying): $error"
      return 1
    fi

    attempt=$((attempt + 1))
  done

  return 1
}

# Retry function with exponential backoff for file downloads
retry_download_with_backoff() {
  local name="$1"
  local url="$2"
  local output_file="$3"
  local attempt=1
  local backoff=$INITIAL_BACKOFF

  while [ $attempt -le $MAX_RETRIES ]; do
    log_debug "[$name] Attempt $attempt/$MAX_RETRIES"
    log_debug "[$name] URL: $url"

    # Execute curl for file download with increased timeout for CI environments
    local error
    if error=$(curl -f -L --max-time 180 --connect-timeout 15 "$url" -o "$output_file" 2>&1); then
      log_debug "[$name] Download successful"
      return 0
    fi

    local exit_code=$?

    # Provide more context for common curl errors
    local error_detail=""
    case $exit_code in
      6) error_detail=" (could not resolve host)" ;;
      7) error_detail=" (failed to connect)" ;;
      22) error_detail=" (HTTP error)" ;;
      28) error_detail=" (operation timed out)" ;;
      35) error_detail=" (SSL connect error)" ;;
      56) error_detail=" (receive error)" ;;
    esac

    if [ $attempt -eq $MAX_RETRIES ]; then
      log_error "[$name] Failed after $MAX_RETRIES attempts"
      log_error "Exit code: $exit_code$error_detail"
      log_error "Error: $error"
      log_error "URL: $url"
      return $exit_code
    fi

    # Check if error is transient
    if is_transient_error "$error"; then
      log_warn "[$name] Transient error (attempt $attempt/$MAX_RETRIES): $error$error_detail"
      log_warn "[$name] Retrying in ${backoff}s..."
      sleep "$backoff"

      backoff=$((backoff * 2))
      if [ $backoff -gt $MAX_BACKOFF ]; then
        backoff=$MAX_BACKOFF
      fi
    else
      log_error "[$name] Permanent error (not retrying): $error$error_detail"
      return $exit_code
    fi

    attempt=$((attempt + 1))
  done

  return 1
}

# Helper function to fetch API with retry (returns JSON body)
fetch_api_with_retry() {
  local name="$1"
  local url="$2"
  retry_api_with_backoff "$name" "$url"
}

# Helper function to download file with retry
fetch_file_with_retry() {
  local name="$1"
  local url="$2"
  local output_file="$3"
  retry_download_with_backoff "$name" "$url" "$output_file"
}

# Pre-flight rate limit check
log_debug "Checking GitHub API rate limit status..."
check_rate_limit_status
RATE_LIMIT_STATUS=$?

if [ $RATE_LIMIT_STATUS -eq 2 ]; then
  # Rate limited but have cached specs - use them
  log_success "Using cached specs (rate limited)"
  exit 0
elif [ $RATE_LIMIT_STATUS -eq 1 ]; then
  # Rate limited and no cache - fail
  log_error "Cannot proceed: rate limited with no cached specs"
  exit 1
fi

# Fetch latest release information
log_info "Fetching latest enriched spec release..."
RELEASE_JSON=$(fetch_api_with_retry "GitHub API" "$API_URL")

if [ -z "$RELEASE_JSON" ]; then
  log_error "Failed to fetch release information from GitHub API"
  exit 1
fi

VERSION=$(echo "$RELEASE_JSON" | grep -o '"tag_name"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$VERSION" ]; then
  log_error "Could not determine latest version from API response"
  log_debug "API Response: $RELEASE_JSON"
  exit 1
fi

log_info "Latest version: $VERSION"

# Check if already downloaded AND required files exist
# Note: .specs/index.json and .specs/domains/ are gitignored, so they won't
# exist after a fresh git clone even if .specs/.version exists
if [ -f "$SPECS_DIR/.version" ]; then
  CURRENT_VERSION=$(cat "$SPECS_DIR/.version")
  if [ "$CURRENT_VERSION" = "$VERSION" ] && [ -f "$SPECS_DIR/index.json" ] && [ -d "$SPECS_DIR/domains" ]; then
    log_success "Specs already up to date ($VERSION)"
    exit 0
  fi
  if [ "$CURRENT_VERSION" != "$VERSION" ]; then
    log_info "Updating from $CURRENT_VERSION to $VERSION"
  else
    log_info "Re-downloading specs (required files missing)"
  fi
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

# Download ZIP file with retry logic
log_info "Downloading specs from: $ZIP_URL"
fetch_file_with_retry "ZIP Download" "$ZIP_URL" "$SPECS_DIR/specs.zip"

# Verify ZIP file is valid
log_debug "Verifying ZIP file integrity..."
if ! unzip -t "$SPECS_DIR/specs.zip" >/dev/null 2>&1; then
  log_error "Downloaded ZIP file is corrupted"
  rm -f "$SPECS_DIR/specs.zip"
  exit 1
fi
log_success "ZIP file verified"

# Clean up old domain specs to prevent stale files from accumulating
# when upstream reorganizes or removes domains
if [ -d "$SPECS_DIR/domains" ]; then
  log_info "Cleaning up old domain specs..."
  rm -rf "$SPECS_DIR/domains"
fi

# Extract domain specs
log_info "Extracting domain specifications..."
unzip -q -o "$SPECS_DIR/specs.zip" -d "$SPECS_DIR"
rm -f "$SPECS_DIR/specs.zip"

# Download index if available
if [ -n "$INDEX_URL" ]; then
  log_info "Downloading index metadata..."
  fetch_file_with_retry "Index Download" "$INDEX_URL" "$SPECS_DIR/index.json"
fi

# Record version
echo "$VERSION" >"$SPECS_DIR/.version"

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

# Restore CHANGELOG.md to prevent git dirty state during releases
# The downloaded specs ZIP may include a CHANGELOG.md that differs from our tracked version
# This ensures GoReleaser's git validation passes without skipping any checks
if [ -f "$SPECS_DIR/CHANGELOG.md" ] && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git ls-files --error-unmatch "$SPECS_DIR/CHANGELOG.md" >/dev/null 2>&1; then
    log_info "Restoring CHANGELOG.md to tracked version..."
    git checkout -- "$SPECS_DIR/CHANGELOG.md" 2>/dev/null && log_success "CHANGELOG.md restored" || log_warn "Could not restore CHANGELOG.md"
  fi
fi
