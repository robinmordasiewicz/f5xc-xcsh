# Runbook: Handling Automated Upstream Specification Updates

This document describes how to handle pull requests created by the automated `sync-upstream-specs` workflow when F5 Distributed Cloud API specifications are updated.

## Overview

The `sync-upstream-specs` GitHub Actions workflow runs daily (6 AM UTC) to check for upstream API specification updates. When updates are detected, it:

1. Downloads the latest enriched API specifications
2. Regenerates domain and resource registries
3. Validates code quality and runs tests
4. **Creates a pull request** with all changes

This runbook describes what to do when such a PR appears.

## Workflow Triggers

The workflow creates a PR automatically in these scenarios:

### 1. Daily Scheduled Check (Most Common)
- **Time**: 6 AM UTC daily
- **Trigger**: Cron schedule (`0 6 * * *`)
- **Action**: Checks upstream for new releases, creates PR if newer version available

### 2. Manual Trigger
- **When**: Team member manually triggers via GitHub Actions UI
- **Use Case**: Immediate sync needed, don't want to wait for daily run
- **Command**: Go to Actions → Sync Upstream Specs → Run workflow

### 3. Configuration Change
- **When**: Changes pushed to `.specs/domain_config.yaml`
- **Use Case**: Domain aliases or deprecation settings updated
- **Action**: Regenerates with new configuration

## Handling an Upstream Sync PR

### Step 1: Review PR Summary

When the PR is created, check the PR body which includes:

```
## 🔄 Automated Upstream Specification Sync

**Previous Version:** `v1.0.30`
**New Version:** `v1.0.31`

### 📊 Summary
This PR automatically syncs changes from the upstream F5 Distributed Cloud API enriched specifications.

### ✅ Validation Checklist
- [x] Build succeeds
- [x] Tests pass
- [x] Generated code is reproducible (idempotent)
- [x] Domain count matches upstream specs
```

All validation items should have ✅. If any are ❌, **do not merge** - investigate the failure.

### Step 2: Examine Code Changes

Key files to review:

| File | Change Type | What to Look For |
|------|-------------|------------------|
| `pkg/types/domains_generated.go` | Auto-generated | Domain count changes (check git diff stats) |
| `pkg/types/resources_generated.go` | Auto-generated | Resource count/migration changes |
| `.specs/index.json` | Auto-generated | New domains or reorganization |
| `.specs/domain_config.yaml` | Manual | Should NOT change (only you modify this) |

**Expected**: The `git diff` will show mostly auto-generated file changes. Changes to other files should be minimal.

### Step 3: Check Domain Changes

Run this to see domain migration summary:

```bash
git diff --stat origin/main...PR_BRANCH | grep domains
```

Look for:
- **New domains added** (expected with upstream updates)
- **Domains removed** (check if deprecated, not deleted)
- **Resource migrations** (some resources may move between domains)

### Step 4: Validation Against CI Pipeline

The PR should have passed these checks:

```
✅ verify-lint-config - golangci-lint version consistency
✅ lint - Go linting passes
✅ test - Unit tests pass on all platforms
✅ verify-schemas - Schema generation is idempotent
✅ verify-domains - Domain generation is idempotent
✅ spec-quality - Specification quality validation
✅ build - Binary builds successfully
✅ goreleaser-check - Release configuration valid
```

All must be green ✅. If any failed:

1. Click on the failing check to see details
2. Review the error message
3. If it's a transient failure (network issue, etc.), use the "Run workflow" button to retry
4. If it's a code issue, **do not merge** - wait for the team to fix it

### Step 5: Approve and Merge

Once you've verified the changes:

```bash
# Option 1: Merge via GitHub UI
# - Click "Approve" on the PR
# - Click "Merge pull request"
# - Select "Create a merge commit"

# Option 2: Via Command Line
git checkout main
git pull origin main
git merge origin/sync/upstream-v1.0.31  # branch name will vary
git push origin main
```

## Domain Changes Reference

### Adding New Domains

If upstream adds new domains, they automatically appear in `domains_generated.go` and are immediately available in the CLI:

```bash
# New domain becomes available after merge
xcsh <new_domain> list <resource_type>
```

No manual domain registration needed - the system discovers them automatically.

### Deprecated Domains

If you need to deprecate a domain (because upstream reorganized it), update `.specs/domain_config.yaml`:

```yaml
deprecated_domains:
  old_domain_name:
    maps_to: new_domain_name
    reason: "Upstream reorganized domain structure"
    deprecated_since: "v1.0.31"
```

Then:

```bash
make generate
git add .specs/domain_config.yaml pkg/types/domains_generated.go
git commit -m "chore: deprecate old_domain_name in favor of new_domain_name"
git push
```

## Troubleshooting

### PR Build Fails

**Symptom**: One or more CI checks show ❌

**Investigation**:
1. Click the failed check to see logs
2. Look for compilation errors, test failures, or validation issues
3. Check if it's a transient failure (network timeout, etc.)

**Solutions**:
- **Transient failure**: Retry the workflow via GitHub Actions UI
- **Consistent failure**: Investigate root cause or contact upstream project
- **Don't merge** until all checks pass

### Domain Count Mismatch

**Symptom**: PR includes warning about domain count change

**Expected behavior**:
- Domain count can increase (new domains added)
- Domain count rarely decreases (deprecation, not deletion)

**Investigation**:
```bash
# Check what domains were added/removed
git diff origin/main...PR_BRANCH pkg/types/domains_generated.go | grep -E '^\+"|^-"'
```

### Tests Fail After Merge

If tests fail after merging an upstream update:

1. Check if it's a legitimate breaking change upstream
2. Review error messages for migration guidance
3. Update domain configuration if domains were reorganized
4. Run `make generate` to regenerate all definitions
5. Commit fixes and push

## Prevention & Best Practices

### Keep domain_config.yaml Updated

The `.specs/domain_config.yaml` file survives automatic updates. Keep it current with:

- Domain aliases that your users expect
- Deprecated domain mappings (for graceful migration)
- Documentation of any upstream spec issues you've reported

### Monitor Upstream Project

Follow [robinmordasiewicz/f5xc-api-enriched](https://github.com/robinmordasiewicz/f5xc-api-enriched) for:

- Major API restructuring announcements
- Deprecation notices
- Breaking changes coming upstream

### Regular Manual Trigger

If you need immediate sync (don't want to wait 24 hours):

1. Go to GitHub Actions
2. Select "Sync Upstream Specs"
3. Click "Run workflow"
4. Check the created PR and merge if valid

## FAQ

### Q: Can I edit the auto-generated PR before merging?

**A**: No. The PR is meant to be merged as-is. If changes are needed:
1. File an issue upstream if it's a spec problem
2. Update `.specs/domain_config.yaml` for local customization
3. Create a separate PR for any additional changes

### Q: What if the PR conflicts with our changes?

**A**: Rare, but possible. If conflict occurs:
1. Close the auto-generated PR
2. Create a manual PR to resolve conflicts
3. Run `make generate` to regenerate files cleanly
4. Test thoroughly before merging

### Q: Can I disable automatic syncing?

**A**: Yes, but not recommended. To disable:
1. Go to GitHub Actions
2. Disable the "Sync Upstream Specs" workflow
3. Document why you disabled it

Note: You'll need to manually run `make generate` when updating specs.

### Q: How often should we update?

**A**: Merge upstream syncs regularly (weekly recommended):

✅ **Good**: Merge upstream syncs as they appear (~1-2x/week typically)
✅ **Better**: Manual trigger for critical fixes immediately
❌ **Bad**: Let syncs pile up (merge conflicts increase)
❌ **Worse**: Disable automation and manually sync occasionally

## Contact & Escalation

For issues with upstream sync PRs:

1. **CI Failures**: Check GitHub Actions logs, retry if transient
2. **Spec Issues**: File issue in [f5xc-api-enriched](https://github.com/robinmordasiewicz/f5xc-api-enriched)
3. **xcsh Integration Issues**: File issue in this repository
4. **Questions**: See README.md "Development & Domain System" section

---

**Last Updated**: 2025-12-23
**Maintained By**: xcsh team
**Related Files**:
- `.github/workflows/sync-upstream-specs.yml` - Workflow definition
- `.specs/domain_config.yaml` - Domain customization
- `scripts/generate-domains.go` - Domain generation script
- `Makefile` - Generation commands
