# Shell Completion

Enable comprehensive tab completion for all xcsh commands, including domain names, operations, resource types, namespaces, and resource names.

## Features

- **Domain Completion**: Complete all domain names (e.g., `virtual`, `dns`, `waf`)
- **Operation Completion**: Complete all operations (`list`, `get`, `create`, `delete`, `status`, `patch`, `add-labels`, `remove-labels`)
- **Resource Type Completion**: Complete resource types within each domain
- **Namespace Completion**: Dynamic completion of available namespaces from your API
- **Resource Name Completion**: Dynamic completion of resource names for `get`, `delete`, and `status` operations
- **Label Key Completion**: Common label key suggestions for `add-labels` and `remove-labels` operations
- **Performance**: 3-second timeout with 5-minute caching to prevent shell slowdown

## Bash

```bash
# Current session
source <(xcsh completion bash)

# Permanent (Linux)
xcsh completion bash > /etc/bash_completion.d/xcsh

# Permanent (macOS with Homebrew)
xcsh completion bash > $(brew --prefix)/etc/bash_completion.d/xcsh
```

## Zsh

```bash
# Enable completion system (if not already enabled)
echo "autoload -U compinit; compinit" >> ~/.zshrc

# Install completion
xcsh completion zsh > "${fpath[1]}/_xcsh"
```

## Fish

```bash
xcsh completion fish > ~/.config/fish/completions/xcsh.fish
```

## PowerShell

```powershell
xcsh completion powershell | Out-String | Invoke-Expression
```

## Usage Examples

Once completion is installed, use `<TAB>` to complete commands:

### Domain Completion

```bash
# Complete domain names
xcsh v<TAB>              # Completes to: virtual, vpm_and_node_management
xcsh vi<TAB>             # Completes to: virtual
xcsh dn<TAB>             # Completes to: dns
xcsh wa<TAB>             # Completes to: waf
```

### Operation Completion

```bash
# Complete operations
xcsh virtual <TAB>
# Suggests: list, get, create, delete, replace, apply, status, patch, add-labels, remove-labels

xcsh dns <TAB>
# Shows available operations
```

### Resource Type Completion

```bash
# Complete resource types
xcsh virtual list <TAB>
# Completes to: http_loadbalancer, origin_pool, tcp_loadbalancer, udp_loadbalancer, etc.

xcsh dns get <TAB>
# Shows dns resource types like dns_zone, dns_domain
```

### Namespace Completion

```bash
# Complete namespaces (requires API access)
xcsh virtual list http_loadbalancer -ns <TAB>
# Suggests: default, production, staging, etc. (from your F5 XC tenant)

xcsh virtual get origin_pool example-pool -ns <TAB>
# Dynamic namespace completion for your specific namespace
```

### Resource Name Completion

```bash
# Complete resource names (requires API access)
xcsh virtual get http_loadbalancer <TAB>
# Suggests: example-lb-1, prod-lb, staging-lb, etc. (from your namespace)

xcsh virtual delete origin_pool <TAB>
# Shows available origin pools to delete
```

### Label Key Completion

```bash
# Complete label keys
xcsh virtual add-labels http_loadbalancer example-lb --label-key <TAB>
# Suggests: environment, application, owner, cost-center, tier, version

xcsh virtual add-labels http_loadbalancer example-lb -ns production --label-key <TAB>
# Common F5 XC label keys
```

## API Integration

Dynamic completions (namespaces and resource names) require API access:

```bash
# Set your API credentials
export F5XC_API_URL="https://your-tenant.console.ves.volterra.io"
export F5XC_API_TOKEN="your-api-token"

# Now namespace and resource name completion will work
xcsh virtual list http_loadbalancer -ns <TAB>  # Shows your namespaces
xcsh virtual get http_loadbalancer <TAB>       # Shows your resources
```

## Troubleshooting

### Completions not working after upgrade

Zsh caches completion functions in `~/.zcompdump*` files. After upgrading xcsh, the stale cache may prevent new completions from loading.

**Fix:** Clear the cache and restart your shell:

```bash
rm -f ~/.zcompdump* && exec zsh
```

### Completions not loading at all

Ensure the completion system is enabled in your `~/.zshrc`:

```bash
autoload -Uz compinit && compinit
```

Then restart your shell or run:

```bash
source ~/.zshrc
```

### Dynamic Completions Not Working

If namespace and resource name completions aren't appearing:

**Check API Credentials:**

```bash
# Verify your API credentials are set
echo $F5XC_API_URL
echo $F5XC_API_TOKEN

# If not set, configure them
export F5XC_API_URL="https://your-tenant.console.ves.volterra.io"
export F5XC_API_TOKEN="your-api-token"
```

**Check API Connectivity:**

```bash
# Test API access
curl -s -H "Authorization: APIToken $F5XC_API_TOKEN" "$F5XC_API_URL/api/web/namespaces" | head

# If this fails, check your credentials and API URL
```

**Completion Fallback:**

If API access fails, completions gracefully fall back to common defaults:

- **Namespaces**: `default`, `system`
- **Resource names**: None (no fallback available without API)
- **Other completions**: Static completions work normally

This ensures your shell stays responsive even if the API is unavailable.

### Performance Issues

Completions use caching with a 5-minute TTL to prevent performance issues:

**Cache Details:**

- Static completions (domains, operations, resource types): Instant
- Dynamic completions (namespaces, resource names): 3-second timeout, 5-minute cache
- Cache is per-shell session (new terminal = fresh cache)

**If completions are slow:**

1. Verify your API URL and token are correct
2. Check your network connectivity to the F5 XC API
3. The 3-second timeout prevents blocking; if you see delays, it's usually the API responding slowly
