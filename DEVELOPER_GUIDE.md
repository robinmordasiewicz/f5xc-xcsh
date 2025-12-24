# Developer Guide: Domain Configuration Maintenance

This guide teaches the team how to maintain and update `.specs/domain_config.yaml`, the version-controlled configuration file that customizes the xcsh CLI's domain definitions.

## What is domain_config.yaml?

`.specs/domain_config.yaml` is a **YAML configuration file** that defines team-specific customizations for CLI domains. It survives automatic upstream specification updates and allows the team to:

- Define domain aliases (short command shortcuts)
- Mark deprecated domains with migration guidance
- Document missing metadata in upstream specs
- Track issues reported to upstream

## File Location and Structure

```
xcsh/
├── .specs/
│   ├── domain_config.yaml          ← This file (YOUR responsibility)
│   ├── index.json                  ← Auto-generated (don't edit)
│   ├── .version                    ← Auto-generated (don't edit)
│   ├── domains/                    ← Auto-generated (don't edit)
│   └── resources/                  ← Auto-generated (don't edit)
├── pkg/types/
│   ├── domains_generated.go        ← Auto-generated (don't edit)
│   └── resources_generated.go      ← Auto-generated (don't edit)
```

**Key Point**: Only `.specs/domain_config.yaml` should be manually edited in the `.specs/` directory.

## File Format Reference

### Version

Always start with version matching the upstream specs version:

```yaml
version: "1.0.30"
```

Update this when you intentionally modify the configuration for a new upstream version.

### Domain Aliases

Aliases provide **short shortcuts** for frequently used domains:

```yaml
aliases:
  # General shortcuts (2-3 characters)
  load_balancer: [lb]           # Users can type: xcsh lb list http_loadbalancer
  security: [sec]               # Short for security domain
  networking: [net]             # Short for networking domain
  infrastructure: [infra]       # Short for infrastructure
  observability: [obs, o11y]    # Multiple aliases: obs or o11y
  identity: [iam]               # Standard: iam for identity

  # Your custom aliases (organization-specific)
  # Add aliases that make sense for YOUR team's workflow
```

**Usage Example**:

```bash
# All these are equivalent:
xcsh load_balancer list http_loadbalancer
xcsh lb list http_loadbalancer

# Both work because lb is aliased to load_balancer
```

**Guidelines**:
- Use 2-3 character aliases for common domains
- Use standard abbreviations where possible (iam for identity, obs for observability)
- Document non-obvious abbreviations in PR descriptions
- Keep aliases consistent across team communication

### Deprecated Domains

When upstream reorganizes domains, mark old names as deprecated:

```yaml
deprecated_domains:
  config:
    maps_to: system
    reason: "Upstream merged configuration into system domain"
    deprecated_since: "v1.0.25"

  operations:
    maps_to: site_management
    reason: "Operations split into site_management and support domains"
    deprecated_since: "v1.0.20"

  nginx:
    maps_to: nginx_one
    reason: "NGINX domain rebranded to nginx_one"
    deprecated_since: "v1.0.28"
```

**What This Does**:
1. Deprecated domain still works (redirects to mapped domain)
2. Shows deprecation warning when used
3. Guides users to the new domain name
4. Tracks when deprecation was introduced

**Guidelines**:
- Only add deprecations when upstream changes existing domain names
- Keep deprecated entries for at least 2-3 versions before removal
- Document the migration path clearly in the reason

### Missing Metadata

Document gaps in upstream specifications that need to be filled:

```yaml
missing_metadata:
  - domain: api_security
    missing_field: "is_preview"
    reason: "Need to mark preview/beta features to warn users"
    github_issue: "robinmordasiewicz/f5xc-api-enriched#123"  # Optional: link to filed issue

  - domain: security
    missing_field: "requires_subscription_tier"
    reason: "Some features limited to Advanced tier - need explicit marking"
    github_issue: null  # Not yet filed with upstream
```

**When to Add**:
- When you discover the upstream specs are missing important metadata
- When a feature requires information not available in specs
- When downstream tooling (xcsh) needs info upstream hasn't provided

**Next Steps**:
1. File an issue in [f5xc-api-enriched](https://github.com/robinmordasiewicz/f5xc-api-enriched)
2. Update the `github_issue` field with the issue link
3. PR automatically includes this info when syncing

## Making Changes to domain_config.yaml

### Change Process

```
1. Create feature branch
   $ git checkout -b feature/domain-config-update

2. Edit .specs/domain_config.yaml
   $ vim .specs/domain_config.yaml

3. Regenerate to apply changes
   $ make generate

4. Test the changes
   $ go build
   $ go test ./pkg/...

5. Commit and push
   $ git add .specs/domain_config.yaml pkg/types/domains_generated.go
   $ git commit -m "chore: add lb alias for load_balancer domain"
   $ git push origin feature/domain-config-update

6. Create PR and merge
   (Normal GitHub PR workflow)
```

### Example: Adding New Aliases

**Scenario**: Your team frequently uses the `operations` domain, but currently there's no alias.

**Steps**:

1. Edit `.specs/domain_config.yaml`:

```yaml
aliases:
  operations: [ops]  # Add this line
```

2. Regenerate and test:

```bash
make generate
go build
go test ./pkg/...
```

3. Verify it works:

```bash
$ xcsh ops --help  # Should work and show operations domain help
```

4. Commit and merge:

```bash
git add .specs/domain_config.yaml pkg/types/domains_generated.go
git commit -m "chore: add ops alias for operations domain"
git push
```

### Example: Deprecating a Domain

**Scenario**: Upstream reorganized and moved resources from `networking` to `network` and `dns`.

**Steps**:

1. Edit `.specs/domain_config.yaml`:

```yaml
deprecated_domains:
  networking:
    maps_to: network
    reason: "Upstream split networking into network, dns, and network_connectivity"
    deprecated_since: "v1.0.30"
```

2. Regenerate and test:

```bash
make generate
go build
go test ./pkg/...

# Test that deprecated domain still works with warning
./xcsh networking list some_resource
```

3. Update documentation:

```bash
# Add migration guide to PR description
```

4. Commit and merge PR

## Common Scenarios & Solutions

### Scenario 1: New Alias Requested by Team

**Request**: "Can we use `sec` instead of `security`?"

**Solution**:

```yaml
aliases:
  security: [sec]
```

Then:
```bash
make generate && go test ./pkg/...
git add .specs/domain_config.yaml pkg/types/domains_generated.go
git commit -m "chore: add sec alias for security domain"
```

### Scenario 2: Upstream Deprecates Domain

**Upstream Change**: "We renamed `nginx` → `nginx_one`"

**Solution**:

```yaml
deprecated_domains:
  nginx:
    maps_to: nginx_one
    reason: "Upstream rebranded nginx to nginx_one product line"
    deprecated_since: "v1.0.31"
```

Then communicate the change and give users time to migrate.

### Scenario 3: Need to Report Missing Spec Info

**Discovery**: "The `app_firewall` domain is missing policy creation examples"

**Solution**:

```yaml
missing_metadata:
  - domain: app_firewall
    missing_field: "policy_examples"
    reason: "Need example payloads for policy creation"
    github_issue: null
```

Then file issue:
```
Title: [REQUEST] Add policy examples to app_firewall domain
Description: xcsh users need example payloads for creating WAF policies
```

And update the github_issue field when you have the issue link.

### Scenario 4: Upstream Added New Domain

**Upstream Change**: New domain `kubernetes` added for Kubernetes integration

**What Happens Automatically**:
1. Daily `sync-upstream-specs` workflow detects the new domain
2. PR is created with new domain in `domains_generated.go`
3. You review and merge

**What You Should Do**:
1. Review the new domain's resources
2. Add aliases in `domain_config.yaml` if appropriate:
   ```yaml
   aliases:
     kubernetes: [k8s]  # If the team uses this abbreviation
   ```
3. Commit domain config along with the sync PR

## Validation & Safety

### Before Committing

Always verify your changes:

```bash
# 1. Regenerate with your config
make generate

# 2. Verify it compiles
go build

# 3. Run tests
go test ./pkg/...

# 4. Check what will be committed
git diff pkg/types/domains_generated.go
```

### After Committing

GitHub Actions automatically validates:

```
✅ verify-domains   → Domain registry is idempotent
✅ lint            → Code passes linters
✅ test            → All tests pass
```

If any check fails, the PR won't merge. Don't force it - fix the issue.

## Best Practices

### DO ✅

- **Keep it organized**: Group related aliases together with comments
- **Document changes**: Use clear commit messages
- **Test changes**: Always run `make generate && go test` locally
- **Review carefully**: Check diffs before committing
- **Stay consistent**: Match existing formatting and conventions
- **Communicate changes**: Document new aliases in release notes
- **Track upstream issues**: Link to filed GitHub issues in missing_metadata

### DON'T ❌

- **Don't edit auto-generated files**: Never manually edit `domains_generated.go` or `index.json`
- **Don't reformat unchanged sections**: Keep unrelated formatting consistent
- **Don't add aliases for uncommon domains**: Only use for frequently accessed domains
- **Don't merge without testing**: Always run `make generate` and tests first
- **Don't remove domains**: Mark as deprecated instead; let upstream deprecation guide removal
- **Don't ignore CI failures**: Fix the root cause, don't bypass validation

## FAQ

### Q: What if upstream updates `domain_config.yaml`?

**A**: They don't. Only `domains_generated.go` and spec files are updated automatically. Your manual configuration survives.

### Q: How often should I update the version field?

**A**: Update it when you intentionally change the configuration for alignment with upstream. It's just documentation - doesn't trigger anything.

### Q: Can I have multiple reasons for deprecation?

**A**: Keep it concise. If multiple reasons, pick the primary one and document the rest in a PR description.

### Q: What if an alias conflicts with a domain name?

**A**: The alias resolution system prioritizes canonical domain names. An alias can't override a real domain name. Choose different aliases.

### Q: How do I remove a deprecated domain?

**A**: Don't delete it immediately. Keep deprecated entries for 2-3 versions to give users time to migrate. After that, you can remove it.

## Related Documentation

- **README.md**: High-level overview of domain system
- **RUNBOOK.md**: How to handle upstream sync PRs
- **Makefile**: `make generate` command reference
- **scripts/generate-domains.go**: How generation works (advanced)

## Support & Questions

- **Issues with generation**: See Makefile targets and scripts/
- **Questions about domains**: Check README.md Development section
- **Upstream spec issues**: File in [f5xc-api-enriched](https://github.com/robinmordasiewicz/f5xc-api-enriched)
- **xcsh CLI issues**: File in main repository

---

**Last Updated**: 2025-12-23
**Target Audience**: xcsh development team
**Maintenance Level**: Updated with each Phase 4 cycle
