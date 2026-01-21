# Claude Code Skills for xcsh

## Available Skills

### /xcsh - F5 Distributed Cloud CLI Integration

Access specifications and capabilities from locally installed xcsh binary.

**Location**: `.claude/skills/xcsh/`

**Prerequisites**:

- xcsh installed via Homebrew, npm, or direct download
- xcsh available at one of:
  - `/opt/homebrew/bin/xcsh` (Homebrew on macOS)
  - `/usr/local/bin/xcsh` (system-wide install)
  - `~/.local/bin/xcsh` (user-local install)
  - Or accessible in PATH

**Installation**:

```bash
# Install xcsh if not already installed
brew install robinmordasiewicz/tap/xcsh
# OR
npm install -g @robinmordasiewicz/f5xc-xcsh
```

**Usage**:

```bash
# Check xcsh installation and version
/xcsh version

# List available F5 XC domains
/xcsh domains

# Get resource specification (when implemented)
/xcsh spec healthcheck create
```

## Current Status

The `/xcsh` skill framework is ready and functional. The enhanced `--spec` implementation exists in the codebase (`src/output/spec.ts` and `src/output/schema-extractor.ts`) for the healthcheck resource, providing:

- Field constraints (min/max values, types, patterns)
- OneOf groups (mutually exclusive field selections)
- Recommended values from F5 best practices
- Context-specific requirements (create vs update)
- Minimum viable configuration examples

**Next Step**: Connect the --spec implementation to the CLI routing system so `xcsh healthcheck create --spec` returns the enhanced ResourceSpec.

## Benefits

When fully implemented, the skill will provide:

- **Real-time Access**: Query xcsh capabilities directly from local installation
- **Enhanced Specs**: Get detailed field constraints and validation rules
- **Recommended Values**: F5 XC best practices and optimal settings
- **Token Efficiency**: Scripts execute without loading into context
- **Automatic Updates**: Skill adapts as new resources get --spec support

## Example Workflow

Once --spec routing is connected:

1. AI assistant invokes `/xcsh spec healthcheck create`
2. Receives ResourceSpec with:
   - Required fields for minimum viable config
   - OneOf group showing http/tcp/udp health check types
   - Recommended values (interval=15, timeout=3, jitter=30)
   - Field constraints (timeout: 1-600 seconds)
3. Generates valid xcsh command:

   ```bash
   xcsh healthcheck create \
     --name api-health \
     --type http \
     --path /api/health \
     --interval 15 \
     --timeout 3 \
     --healthy-threshold 3 \
     --unhealthy-threshold 1 \
     --jitter-percent 30
   ```

4. User receives optimized, validated configuration

## Skill Architecture

```bash
.claude/skills/xcsh/
├── SKILL.md                 # Skill definition with YAML frontmatter
├── scripts/
│   ├── detect-xcsh.sh      # Find xcsh binary in common locations
│   ├── get-spec.sh         # Retrieve resource specifications
│   ├── list-domains.sh     # Show available F5 XC domains
│   ├── check-version.sh    # Verify installation and version
│   └── test-skill.sh       # Test suite for skill validation
└── references/
    └── xcsh-usage.md       # Detailed usage patterns and examples
```

## Future Extensions

As more resources receive enhanced `--spec` implementations:

- **Networking**: origin_pool, http_loadbalancer configurations
- **Security**: waf_policy, bot_defense, api_security settings
- **DNS**: dns_zone, dns_lb_record management
- **Infrastructure**: aws_vpc_site, azure_vnet_site, gcp_vpc_site deployments
- **Certificates**: certificate_chain, private_key management

The `/xcsh` skill automatically adapts to new spec implementations without requiring updates.

## Testing

Run the skill test suite:

```bash
.claude/skills/xcsh/scripts/test-skill.sh
```

Expected output:

- ✓ Detects xcsh binary location
- ✓ Verifies version information
- ✓ Lists available domains
- ⚠ Notes --spec routing status

## Implementation Notes

### Design Principles

1. **Progressive Disclosure**: Skill loads metadata first, then body, then executes scripts only when needed
2. **Token Efficiency**: Scripts run without loading into context (low token cost)
3. **Platform Agnostic**: Works across macOS (Homebrew), Linux (Linuxbrew), and npm installs
4. **Error Handling**: Clear installation instructions when binary not found
5. **Future-Proof**: Designed to scale as more resources gain --spec support

### Technical Details

- **Binary Detection**: Checks multiple common installation paths before falling back to PATH
- **Spec Retrieval**: Invokes `xcsh <resource> <action> --spec` and returns JSON
- **Version Checking**: Validates xcsh is accessible and reports version
- **Domain Listing**: Shows available F5 XC domains (currently shows helpful placeholder)

### Extension Pattern

To add --spec support for a new resource:

1. Implement schema extraction in `src/output/schema-extractor.ts`
2. Add resource case in `src/output/spec.ts::getCommandSpec()`
3. Connect routing in CLI command system
4. Skill automatically discovers and uses new spec

No changes needed to the skill itself - it adapts automatically.

## Troubleshooting

### Binary Not Found

```bash
ERROR: xcsh not found. Please install via:
  brew install robinmordasiewicz/tap/xcsh
  OR
  npm install -g @robinmordasiewicz/f5xc-xcsh
```

**Solution**: Install xcsh using preferred method, then verify with `/xcsh version`

### Spec Not Available

```text
⚠ --spec functionality not yet connected to CLI routing
```

**Status**: Implementation exists in codebase, routing integration in progress

**Workaround**: Use standard xcsh commands without --spec until routing is connected

## Related Documentation

- [xcsh Usage Patterns](.claude/skills/xcsh/references/xcsh-usage.md) - Detailed usage guide
- [Spec Implementation](../docs/SPEC_IMPLEMENTATION_SUMMARY.md) - Enhanced --spec development notes
- [Spec Enhancements](../docs/SPEC_ENHANCEMENTS.md) - Design doc for --spec feature
