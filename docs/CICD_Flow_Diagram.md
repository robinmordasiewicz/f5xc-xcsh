# CI/CD Automation Flow Diagram

This document provides visual representations of the complete automation chain for the xcsh project.

## Overview

The automation pipeline consists of 5 interconnected workflows that handle upstream synchronization, CI validation, release creation, and documentation deployment.

```mermaid
graph TD
    Start[Start: Upstream f5xc-api-enriched releases new specs] --> Dispatch[repository_dispatch event<br/>type: enriched-specs-updated]
    Dispatch --> Sync[sync-upstream-specs.yml]

    subgraph SyncWorkflow ["Sync Workflow"]
        CheckUpstream[check-upstream job<br/>Compare .specs/.version vs upstream] --> HasUpdates{has_updates?}

        HasUpdates -- No --> LogNoUpdate[Log: No updates available]
        HasUpdates -- Yes --> UpdateRegenerate[update-and-regenerate job<br/>• Download specs<br/>• Regenerate code<br/>• Run tests<br/>• Create PR]

        UpdateRegenerate --> SetStatuses[Set commit statuses<br/>• Lint ✓<br/>• Test (3 platforms) ✓<br/>• Build ✓]
    end

    SyncWorkflow --> PRCreated[PR created]

    subgraph CIWorkflow ["CI Validation Workflow"]
        PRCreated --> TriggerCI[ci.yml triggered<br/>by PR creation]

        TriggerCI --> LintJob[lint job<br/>• TypeScript typecheck<br/>• ESLint<br/>• Prettier<br/>• Security audit]
        LintJob --> TestJob[test job<br/>Matrix: ubuntu/macos/windows<br/>+ Node 22]
        TestJob --> VerifyJob[verify-generated job<br/>• Regenerate domains_generated.ts<br/>• Validate files]
        VerifyJob --> BuildJob[build job<br/>• npm run build<br/>• Upload artifacts]
    end

    CIWorkflow --> AllChecksPass[All 5 required<br/>status checks pass ✓]

    subgraph BranchProtection ["Branch Protection"]
        AllChecksPass --> AutoMerge{Auto-merge enabled?}

        AutoMerge -- Yes/Sync PR --> AutoMergePR[Auto-merge PR<br/>Squash merge<br/>Delete branch]
        AutoMerge -- No/Feature PR --> RequestReview[Request review<br/>1 approval required]
        RequestReview --> ManualMerge[Manual merge<br/>gh pr merge --squash]
    end

    AutoMergePR --> Merged[PR merged to main]
    ManualMerge --> Merged

    Merged --> PushMain[git push to main]

    subgraph ReleaseWorkflow ["Release Workflow"]
        PushMain --> TriggerRelease[release.yml triggered<br/>by push to main]

        TriggerRelease --> TestRelease[test job<br/>• npm test<br/>• npm typecheck]
        TestRelease --> VersionJob[version job<br/>• Read .specs/index.json<br/>• Generate UTC timestamp<br/>• Create version tag<br/>• Push tag]

        VersionJob --> BuildLinux[build-linux<br/>• linux/amd64<br/>• linux/arm64]
        VersionJob --> BuildMac[build-macos<br/>• darwin/amd64 (Intel)<br/>• darwin/arm64 (M1/M2)]
        VersionJob --> BuildWin[build-windows<br/>• windows/amd64<br/>• windows/arm64]

        BuildLinux --> CreateRelease[create-release job<br/>• Download artifacts<br/>• Generate SHA256<br/>• Create GitHub release<br/>• Attach binaries + checksums]
        BuildMac --> CreateRelease
        BuildWin --> CreateRelease

        CreateRelease --> PublishNPM[publish-npm job<br/>• npm publish]
        CreateRelease --> SignMac[sign-macos job<br/>• Apple Developer ID sign<br/>• Notarize<br/>• Staple ticket<br/>• Update Homebrew cask]
    end

    subgraph DocsWorkflow ["Documentation Workflow"]
        ReleasePublished[Release published] --> WorkflowRun[workflow_run event<br/>release.yml completed]
        WorkflowRun --> TriggerDocs[docs.yml triggered]

        TriggerDocs --> WaitForRelease[wait-for-release<br/>Wait for release.yml]
        WaitForRelease --> CheckRelease[check-release<br/>Get release from API<br/>Output version]
        CheckRelease --> BuildWinDocs[build-windows-docs<br/>• Download binary<br/>• Generate install docs]

        BuildWinDocs --> BuildDocs[build job (macos)<br/>• Test Homebrew install<br/>• Test install.sh<br/>• Test source build<br/>• Generate command docs<br/>• Generate subscription docs<br/>• Validate docs exist<br/>• Build MkDocs site]

        BuildDocs --> Deploy[Deploy to gh-pages<br/>Force push]
    end

    Deploy --> DocsDeployed[Documentation deployed<br/>https://robinmordasiewicz.github.io/f5xc-xcsh]

    style Start fill:#e1f5fe,stroke:#0d6efd,color:#fff
    style SyncWorkflow fill:#fff4e6,stroke:#ff6b6b,color:#000
    style CIWorkflow fill:#e3f2fd,stroke:#6c5ce7,color:#000
    style BranchProtection fill:#fff9c4,stroke:#f59e0b,color:#000
    style ReleaseWorkflow fill:#d1fae5,stroke:#5419e5,color:#000
    style DocsWorkflow fill:#f39c12,stroke:#e67e22,color:#000
    style DocsDeployed fill:#6ee7b7,stroke:#27ae60,color:#000
```

---

## Detailed Flow Breakdown

### Phase 1: Upstream Sync

```
┌─────────────────────────────────────────────────────────────┐
│ External Trigger: f5xc-api-enriched releases      │
└─────────────────────────────────────────────────────────────┘
                         ↓
        repository_dispatch event
        (type: enriched-specs-updated)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ sync-upstream-specs.yml workflow                    │
├─────────────────────────────────────────────────────────┤
│ Job 1: check-upstream                               │
│ • Fetch latest release from upstream                   │
│ • Compare with .specs/.version                       │
│ • Output: has_updates, new_version                 │
└─────────────────────────────────────────────────────────────┘
                         ↓
              has_updates == true?
              /                  \
             NO                    YES
            /                        \
┌───────────────┐    ┌─────────────────────────────────────┐
│ Log no-update  │    │ Job 2: update-and-regenerate     │
└───────────────┘    │ • Download new specs             │
                         │ • Regenerate domains_generated.ts  │
                         │ • Regenerate completions         │
                         │ • Run tests                   │
                         │ • Create PR with auto-merge    │
                         └─────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────┐
│ Set commit statuses to satisfy branch protection:      │
│ ✓ Lint                                             │
│ ✓ Test (ubuntu-latest, 22)                         │
│ ✓ Test (macos-latest, 22)                          │
│ ✓ Test (windows-latest, 22)                         │
│ ✓ Build                                             │
└─────────────────────────────────────────────────────────────┘
```

### Phase 2: CI Validation

```
┌─────────────────────────────────────────────────────────────┐
│ PR created → ci.yml triggered                     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 1: lint (ubuntu-latest)                     │
│ • TypeScript type check (npm run typecheck)          │
│ • ESLint (npx eslint --fix src/)                 │
│ • Prettier (npx prettier --write src/)            │
│ • Security audit (npm audit --audit-level=high)      │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 2: lint-python (ubuntu-latest)               │
│ • Ruff linting                                      │
│ • Ruff formatting                                    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 3: test (matrix)                              │
│ ├─ ubuntu-latest + node 22                       │
│ ├─ macos-latest + node 22                        │
│ └─ windows-latest + node 22                       │
│                                                    │
│ • Runs npm run test:unit                            │
│ • Uploads coverage to codecov                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 4: verify-generated (ubuntu-latest)            │
│ • Regenerates domains_generated.ts                   │
│ • Regenerates completions/*                         │
│ • Validates against committed files                    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 5: build (ubuntu-latest) [depends on all above]│
│ • Runs npm run build                               │
│ • Creates dist/ directory                            │
│ • Uploads dist/ and completions/ as artifacts        │
└─────────────────────────────────────────────────────────────┘
                         ↓
            All 5 required status checks PASS ✓
```

### Phase 3: Branch Protection Decision

```
              All checks pass ✓
                     ↓
    ┌─────────────────────────┐
    │ Branch Protection Gate │
    └─────────────────────────┘
                     ↓
      Auto-merge enabled?
         /            \
        NO            YES
       /                \
┌──────────────┐    ┌──────────────────────┐
│ Manual review │    │ Auto-merge PR     │
│ • 1 approval │    │ • Squash merge    │
│ • Manual merge│    │ • Delete branch     │
└──────────────┘    └──────────────────────┘
         ↓                    ↓
┌──────────────────────────────────┐
│ PR merged to main ✓        │
└──────────────────────────────────┘
                ↓
        git push to main
```

### Phase 4: Release

```
┌─────────────────────────────────────────────────────────────┐
│ Push to main → release.yml triggered            │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 1: test (ubuntu-latest)                     │
│ • npm run test:unit                                │
│ • npm run typecheck                                 │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 2: version (ubuntu-latest)                   │
│ • Read .specs/index.json                             │
│ • Generate UTC timestamp (YYMMDDHHMM)               │
│ • Create version string: v{upstream}-{timestamp}      │
│ • Create git tag                                   │
│ • Push tag to origin                               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────┬──────────────────────┬──────────────────┐
│                    │                      │                  │
│ Job 3a: build-linux │ Job 3b: build-macos│ Job 3c: build-win│
│                    │                      │                  │
│ • linux/amd64       │ • darwin/amd64        │ • windows/amd64   │
│ • linux/arm64       │ • darwin/arm64        │ • windows/arm64   │
│                    │                      │                  │
│ • Upload artifacts  │ • Upload artifacts   │ • Upload artifacts│
└──────────────────────┴──────────────────────┴──────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 4: create-release (ubuntu-latest)              │
│ • Download all build artifacts                       │
│ • Generate SHA256 checksums for all binaries        │
│ • Create GitHub release with tag                   │
│ • Attach:                                          │
│   • xcsh-linux-amd64                                │
│   • xcsh-linux-arm64                                │
│   • xcsh-darwin-amd64                                │
│   • xcsh-darwin-arm64                                │
│   • xcsh-windows-amd64.exe                            │
│   • xcsh-windows-arm64.exe                            │
│   • SHA256 checksums.txt                               │
│   • Shell completions                                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
                GitHub release published ✓
                         ↓
┌──────────────────────┬──────────────────────┐
│                    │                      │
│ Job 5: publish-npm │ Job 6: sign-macos  │
│                    │                      │
│ • npm publish       │ • Sign with Apple    │
│                    │   Developer ID      │
│                    │                      │
│                    │ • Notarize with Apple│
│                    │                      │
│                    │ • Staple ticket     │
│                    │                      │
│                    │ • Update Homebrew   │
│                    │   cask with SHA256 │
└──────────────────────┴──────────────────────┘
```

### Phase 5: Documentation

```
┌─────────────────────────────────────────────────────────────┐
│ Release published → workflow_run event          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ docs.yml triggered                                 │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 1: wait-for-release (ubuntu-latest)             │
│ • Wait for release.yml workflow to complete        │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 2: check-release (ubuntu-latest)               │
│ • Get latest release from GitHub API                 │
│ • Output version                                     │
│ • Verify release exists                               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 3: build-windows-docs (windows-latest)        │
│ • Download xcsh-windows-amd64.exe               │
│ • Generate Windows installation documentation           │
│ • Upload as artifact                                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 4: build (macos-latest)                     │
│ • Download xcsh-darwin-amd64                      │
│                                                    │
│ • Test Homebrew installation:                       │
│   • Retry with exponential backoff (10s, 20s, 40s)  │
│                                                    │
│ • Test install.sh script:                          │
│   • Retry with exponential backoff                    │
│                                                    │
│ • Test source build:                                │
│   • Clean build from scratch                        │
│                                                    │
│ • Generate command documentation:                     │
│   • Run xcsh and output all commands                │
│                                                    │
│ • Generate subscription documentation:                  │
│   • Query F5XC API for tier requirements           │
│                                                    │
│ • Validate required docs exist:                      │
│   • docs/install/binary.md                         │
│   • docs/install/homebrew.md                        │
│   • docs/install/script.md                          │
│   • docs/install/source.md                          │
│   • docs/install/environment-variables.md              │
│                                                    │
│ • Build MkDocs site                                 │
│                                                    │
│ • Deploy to gh-pages (force push)                    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Documentation deployed ✓                            │
│ https://robinmordasiewicz.github.io/f5xc-xcsh       │
└─────────────────────────────────────────────────────────────┘
```

---

## Timeline

### Typical End-to-End Flow

| Phase | Duration | Cumulative | Notes |
|--------|----------|-------------|--------|
| Upstream release | N/A | 0min | External trigger |
| Sync detection | 30s | 0.5min | Daily 6 AM UTC |
| PR creation | 1min | 1.5min | Automated |
| CI validation | 10min | 11.5min | 3 platforms |
| Auto-merge | <1min | 12.5min | Sync PRs only |
| Release workflow | 15min | 27.5min | 6 jobs |
| Docs workflow | 8min | 35.5min | Platform-specific |
| **Total** | **~35.5min** | - | From upstream to docs |

### Decision Points

| Point | Decision | Trigger | Outcome |
|-------|----------|---------|----------|
| Sync check | has_updates? | version comparison |
| Branch protection | Auto-merge? | PR type (sync vs feature) |
| Merge method | Squash vs merge | Auto-merge settings |
| Release timing | CI passed? | Push to main triggers release |
| Docs trigger | workflow_run | Release completed |

---

## Key Interconnections

### Workflows That Chain

| Trigger | Source | Target | Purpose |
|---------|--------|--------|---------|
| `repository_dispatch` | upstream repo | sync-upstream-specs.yml | Notify of new specs |
| `push` (PR) | PR creation | ci.yml | Validate changes |
| `push` (merge) | main branch | release.yml | Build and publish |
| `workflow_run` | release.yml | docs.yml | Update documentation |

### Shared Dependencies

| Dependency | Used By | Required For |
|------------|-----------|--------------|
| .specs/ | All workflows | API specifications |
| domains_generated.ts | ci.yml, release.yml | Domain registry |
| npm artifacts | ci.yml, release.yml | Build verification |
| GitHub release artifacts | release.yml, docs.yml | Binary distribution |

### Status Check Chain

```
sync-upstream-specs.yml
  ↓ (sets statuses)
  ├─ Lint ✓
  ├─ Test (ubuntu-latest, 22) ✓
  ├─ Test (macos-latest, 22) ✓
  ├─ Test (windows-latest, 22) ✓
  └─ Build ✓
        ↓
  Branch protection satisfied
        ↓
  Auto-merge possible
```

---

## Quick Reference

### Trigger Quick Reference

| Event | Workflow | Result |
|--------|----------|--------|
| Upstream release | sync-upstream-specs.yml | PR created |
| PR created | ci.yml | Validation runs |
| PR merged | release.yml | New release |
| Release published | docs.yml | Docs updated |
| Daily 6 AM UTC | sync-upstream-specs.yml | Check for updates |
| Manual trigger | Any workflow | On-demand run |

### Status Check Quick Reference

| Check | Purpose | Fails When |
|-------|---------|-------------|
| Lint | TypeScript, ESLint, Prettier | Code style issues |
| Test (ubuntu) | Linux unit tests | Test failures |
| Test (macos) | macOS unit tests | Test failures |
| Test (windows) | Windows unit tests | Test failures |
| Build | Full build verification | Build errors |
