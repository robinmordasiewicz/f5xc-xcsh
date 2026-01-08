# OpenCode Agent Guidelines for GitHub Operations

This document outlines best practices for GitHub operations to ensure proper integration with the automation toolchain and avoid conflicts with CI/CD pipelines.

## Core Principles

1. **Never bypass branch protection** - Always use PRs for merging to protected branches
2. **Leverage automation workflows** - Let the CI/CD pipeline handle builds, tests, and releases
3. **Avoid manual overrides** - Commands like `--admin` flag bypass safety controls
4. **Follow the established automation chain** - Trust the toolchain over manual interventions

## GitHub Operations Best Practices

### Branch Management

| Do | Don't |
|-----|-------|
| Create feature branches for all changes | Push directly to main |
| Use descriptive branch names | Create unnamed or generic branches |
| Delete branches after merge | Leave stale branches untracked |

### Pull Requests

| Do | Don't |
|-----|-------|
| Create PRs for all changes | Use `gh pr merge --admin` to bypass checks |
| Wait for CI checks to pass | Merge before validation completes |
| Use squash merge for sync PRs | Use --merge for large features |
| Delete branches after merge | Keep branches after merge |

### Automation Toolchain Integration

The repository uses an automation toolchain that includes:

1. **sync-upstream-specs.yml** - Syncs API specs from upstream
2. **ci.yml** - Runs tests, linting, and build verification
3. **release.yml** - Builds and publishes releases on push to main

#### Proper Workflow for API Spec Updates

```text
1. Upstream repo releases new API specs
   └── Triggers: sync-upstream-specs.yml (repository_dispatch)

2. Sync workflow creates PR automatically
   └── Waits for: CI checks pass → Auto-merge enabled

3. Merge triggers CI workflow
   └── Runs: Lint, Test (3 platforms), Build, Verify Generated

4. CI success triggers Release workflow
   └── Creates: New release with version timestamp

5. Release triggers:
   ├── Binaries built (Linux, macOS, Windows)
   ├── GitHub release created
   ├── npm package published
   ├── macOS binaries signed & notarized
   └── Homebrew cask updated
```

### Prohibited Operations

```bash
# NEVER use --admin flag to bypass branch protection
gh pr merge --admin --merge <pr>

# NEVER push directly to protected branches
git push origin main

# NEVER create empty commits to "trigger" workflows
git commit --allow-empty -m "trigger"

# NEVER skip pre-commit hooks
git commit --no-verify
```

### Required Operations

```bash
# ALWAYS create feature branches
git checkout -b chore/describe-your-change

# ALWAYS create PRs for main branch
gh pr create --title "chore: description" --body "details"

# ALWAYS let CI pass before merging
gh pr merge <pr> --admin --merge  # Only after checks pass

# ALWAYS clean up branches after merge
gh pr view --delete-branch
```

## Version Management

### Release Version Format

```text
v{upstream_api_version}-{YYMMDDHHMM}
Example: v2.0.21-2601080650
```

- Upstream API version comes from `.specs/index.json`
- Timestamp is UTC-based for uniqueness
- Release workflow auto-generates this format

### Manual Release (if CI fails)

If CI fails and you need to retry:

1. Create a minimal PR (e.g., README update)
2. Let CI run and pass
3. Merge PR normally (triggers release)

```bash
# Create retry branch
git checkout -b chore/retry-release

# Make minimal change
git add README.md
git commit -m "chore: retry release"

# Push and create PR
git push -u origin chore/retry-release
gh pr create --title "chore: retry release" --base main

# Wait for CI, then merge
gh pr merge <pr> --admin --merge
```

## Workflow Triggers

| Event | Triggered Workflow | Result |
|-------|-------------------|--------|
| Upstream release | repository_dispatch | Auto sync PR created |
| PR merged to main | ci.yml | Tests run |
| CI passes on main | release.yml | New release created |
| Daily schedule | sync-upstream-specs.yml | Check for updates |
| Manual dispatch | ci.yml, sync-upstream-specs.yml | On-demand run |

## Error Handling

### If Release Fails

1. Check the failed workflow run logs
2. Identify the root cause
3. Fix the issue in a feature branch
4. Create PR and merge to retry release

### Common Issues

| Issue | Solution |
|-------|----------|
| Windows build fails with `'.' is not recognized` | Ensure scripts use `bash` explicitly |
| macOS timeout on GitHub API | Retry (transient) |
| Pre-commit hook fails | Fix the actual issue, don't bypass |

## Quick Reference

```bash
# 1. Create feature branch
git checkout -b <type>/<description>

# 2. Make changes and commit
git add <files>
git commit -m "<type>: description"

# 3. Push and create PR
git push -u origin <branch>
gh pr create --title "<type>: description" --base main

# 4. Wait for CI checks (required status checks)
gh pr view <pr> --json state,statusCheckRollup

# 5. Merge (CI must pass first)
gh pr merge <pr> --admin --merge

# 6. Clean up (optional - auto-deletes if enabled)
gh pr view <pr> --delete-branch
```

## Summary

> **Trust the automation toolchain.** The workflows are designed to handle releases, syncing, and validation automatically. Manual interventions should only be needed to fix actual issues in the code or configuration, not to bypass the safety controls.

Following these guidelines ensures:

- No conflicts with automation
- Proper audit trail via PRs
- Consistent release versioning
- Validated code in main branch
