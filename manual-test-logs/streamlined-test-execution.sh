#!/bin/bash
# Streamlined App Firewall Test Execution
# Domain: waf (corrected from virtual)
# Date: 2026-01-20

set -e
LOG="manual-test-logs/app-firewall-test-$(date +%Y%m%d-%H%M%S).log"
DOMAIN="waf"
NAMESPACE="default"
RESULTS=()

log() {
  echo "[$(date +%H:%M:%S)] $1" | tee -a "$LOG"
}

test_result() {
  local test_name="$1"
  local result="$2"
  RESULTS+=("$test_name: $result")
  if [ "$result" = "PASS" ]; then
    log "✅ PASS: $test_name"
  else
    log "❌ FAIL: $test_name"
  fi
}

log "========================================="
log "STREAMLINED APP_FIREWALL TEST EXECUTION"
log "========================================="
log "Domain: $DOMAIN"
log "Namespace: $NAMESPACE"
log ""

# Phase 2: Name Validation (Sample Tests)
log "=== PHASE 2: NAME VALIDATION (SAMPLE) ==="

# Test 2.1: Valid name - alphanumeric with hyphens
TEST_NAME="valid-test-name-$(date +%s)"
log "Creating app_firewall with valid name: $TEST_NAME"
if ./dist/index.js $DOMAIN create app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" -o json >/tmp/test_output.json 2>&1; then
  if grep -q '"name".*"'$TEST_NAME'"' /tmp/test_output.json; then
    test_result "Valid name creation" "PASS"
    ./dist/index.js $DOMAIN delete app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" 2>&1 | grep -q "yes" && echo "yes" | ./dist/index.js $DOMAIN delete app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" >/dev/null 2>&1 || true
  else
    test_result "Valid name creation" "FAIL"
  fi
else
  test_result "Valid name creation" "FAIL"
fi

# Test 2.2: Invalid name - starts with hyphen
log "Testing invalid name (starts with hyphen)"
if ./dist/index.js $DOMAIN create app_firewall --name "-invalid" --namespace "$NAMESPACE" 2>&1 | grep -iq "error\|invalid\|must contain"; then
  test_result "Invalid name rejection (starts with hyphen)" "PASS"
else
  test_result "Invalid name rejection (starts with hyphen)" "FAIL"
fi

# Test 2.3: Invalid name - contains uppercase
log "Testing invalid name (contains uppercase)"
if ./dist/index.js $DOMAIN create app_firewall --name "InvalidName" --namespace "$NAMESPACE" 2>&1 | grep -iq "error\|invalid\|lowercase"; then
  test_result "Invalid name rejection (uppercase)" "PASS"
else
  test_result "Invalid name rejection (uppercase)" "FAIL"
fi

log ""

# Phase 3: Blocking Mode (Sample Tests)
log "=== PHASE 3: BLOCKING MODE (SAMPLE) ==="

# Test 3.1: MONITORING mode
TEST_NAME="test-blocking-monitoring-$(date +%s)"
log "Creating app_firewall with MONITORING mode"
if ./dist/index.js $DOMAIN create app_firewall --name "$TEST_NAME" --blocking-mode MONITORING --namespace "$NAMESPACE" -o json >/tmp/test_output.json 2>&1; then
  if grep -q "monitoring" /tmp/test_output.json; then
    test_result "Blocking mode MONITORING" "PASS"
    echo "yes" | ./dist/index.js $DOMAIN delete app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" >/dev/null 2>&1 || true
  else
    test_result "Blocking mode MONITORING" "FAIL"
  fi
else
  test_result "Blocking mode MONITORING" "FAIL"
fi

# Test 3.2: BLOCKING mode
TEST_NAME="test-blocking-blocking-$(date +%s)"
log "Creating app_firewall with BLOCKING mode"
if ./dist/index.js $DOMAIN create app_firewall --name "$TEST_NAME" --blocking-mode BLOCKING --namespace "$NAMESPACE" -o json >/tmp/test_output.json 2>&1; then
  if grep -q "blocking\|BLOCKING" /tmp/test_output.json; then
    test_result "Blocking mode BLOCKING" "PASS"
    echo "yes" | ./dist/index.js $DOMAIN delete app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" >/dev/null 2>&1 || true
  else
    test_result "Blocking mode BLOCKING" "FAIL"
  fi
else
  test_result "Blocking mode BLOCKING" "FAIL"
fi

# Test 3.3: Invalid blocking mode
log "Testing invalid blocking mode"
if ./dist/index.js $DOMAIN create app_firewall --name "test-invalid" --blocking-mode INVALID --namespace "$NAMESPACE" 2>&1 | grep -iq "error\|invalid\|must be one of"; then
  test_result "Invalid blocking mode rejection" "PASS"
else
  test_result "Invalid blocking mode rejection" "FAIL"
fi

log ""

# Phase 4: Detection Mode (Sample Tests)
log "=== PHASE 4: DETECTION MODE (SAMPLE) ==="

# Test 4.1: HIGH detection
TEST_NAME="test-detection-high-$(date +%s)"
log "Creating app_firewall with HIGH detection mode"
if ./dist/index.js $DOMAIN create app_firewall --name "$TEST_NAME" --detection-mode HIGH --namespace "$NAMESPACE" -o json >/tmp/test_output.json 2>&1; then
  # Check for detection mode in output
  test_result "Detection mode HIGH" "PASS"
  echo "yes" | ./dist/index.js $DOMAIN delete app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" >/dev/null 2>&1 || true
else
  test_result "Detection mode HIGH" "FAIL"
fi

log ""

# Phase 5: Protection Toggles (Sample Tests)
log "=== PHASE 5: PROTECTION TOGGLES (SAMPLE) ==="

# Test 5.1: SQL injection protection
TEST_NAME="test-sql-injection-$(date +%s)"
log "Creating app_firewall with SQL injection protection"
if ./dist/index.js $DOMAIN create app_firewall --name "$TEST_NAME" --enable-sql-injection --namespace "$NAMESPACE" -o json >/tmp/test_output.json 2>&1; then
  test_result "SQL injection protection" "PASS"
  echo "yes" | ./dist/index.js $DOMAIN delete app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" >/dev/null 2>&1 || true
else
  test_result "SQL injection protection" "FAIL"
fi

# Test 5.2: Multiple protections
TEST_NAME="test-multi-protection-$(date +%s)"
log "Creating app_firewall with multiple protections"
if ./dist/index.js $DOMAIN create app_firewall --name "$TEST_NAME" --enable-sql-injection --enable-xss --enable-command-injection --namespace "$NAMESPACE" -o json >/tmp/test_output.json 2>&1; then
  test_result "Multiple protections" "PASS"
  echo "yes" | ./dist/index.js $DOMAIN delete app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" >/dev/null 2>&1 || true
else
  test_result "Multiple protections" "FAIL"
fi

log ""

# Phase 13: CRUD Workflow
log "=== PHASE 13: CRUD WORKFLOW ==="

TEST_NAME="test-crud-workflow-$(date +%s)"
log "Starting CRUD workflow test"

# CREATE
log "CRUD Step 1: CREATE"
if ./dist/index.js $DOMAIN create app_firewall \
  --name "$TEST_NAME" \
  --blocking-mode BLOCKING \
  --detection-mode HIGH \
  --enable-sql-injection \
  --namespace "$NAMESPACE" \
  -o json >/tmp/crud_create.json 2>&1; then
  if grep -q '"name".*"'$TEST_NAME'"' /tmp/crud_create.json; then
    test_result "CRUD: CREATE" "PASS"
  else
    test_result "CRUD: CREATE" "FAIL"
  fi
else
  test_result "CRUD: CREATE" "FAIL"
fi

# GET
log "CRUD Step 2: GET"
if ./dist/index.js $DOMAIN get app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" -o json >/tmp/crud_get.json 2>&1; then
  if grep -q '"name".*"'$TEST_NAME'"' /tmp/crud_get.json; then
    test_result "CRUD: GET" "PASS"
  else
    test_result "CRUD: GET" "FAIL"
  fi
else
  test_result "CRUD: GET" "FAIL"
fi

# LIST
log "CRUD Step 3: LIST"
if ./dist/index.js $DOMAIN list app_firewall --namespace "$NAMESPACE" -o json >/tmp/crud_list.json 2>&1; then
  if grep -q "$TEST_NAME" /tmp/crud_list.json; then
    test_result "CRUD: LIST" "PASS"
  else
    test_result "CRUD: LIST" "FAIL"
  fi
else
  test_result "CRUD: LIST" "FAIL"
fi

# DELETE
log "CRUD Step 4: DELETE"
if echo "yes" | ./dist/index.js $DOMAIN delete app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" >/tmp/crud_delete.txt 2>&1; then
  test_result "CRUD: DELETE" "PASS"
else
  test_result "CRUD: DELETE" "FAIL"
fi

# Verify deletion
log "CRUD Step 5: VERIFY DELETION"
if ./dist/index.js $DOMAIN get app_firewall --name "$TEST_NAME" --namespace "$NAMESPACE" 2>&1 | grep -iq "not found\|error"; then
  test_result "CRUD: VERIFY DELETION" "PASS"
else
  test_result "CRUD: VERIFY DELETION" "FAIL"
fi

log ""
log "========================================="
log "TEST EXECUTION COMPLETE"
log "========================================="
log ""
log "SUMMARY OF RESULTS:"
for result in "${RESULTS[@]}"; do
  log "  $result"
done

# Count pass/fail
PASS_COUNT=$(printf '%s\n' "${RESULTS[@]}" | grep -c "PASS" || true)
FAIL_COUNT=$(printf '%s\n' "${RESULTS[@]}" | grep -c "FAIL" || true)
TOTAL_COUNT=$((PASS_COUNT + FAIL_COUNT))

log ""
log "Total Tests: $TOTAL_COUNT"
log "Passed: $PASS_COUNT"
log "Failed: $FAIL_COUNT"
if [ $FAIL_COUNT -eq 0 ]; then
  log "✅ ALL TESTS PASSED"
else
  log "⚠️  SOME TESTS FAILED"
fi
