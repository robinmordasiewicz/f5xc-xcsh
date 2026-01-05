# xcsh User Guide

**Version**: 2.0.7
**Platform**: TypeScript / Ink (React for CLI)

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Modes of Operation](#modes-of-operation)
3. [Understanding Domains](#understanding-domains)
4. [Command Syntax](#command-syntax)
5. [Common Tasks](#common-tasks)
6. [Output Formats](#output-formats)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Installation

#### Using Homebrew (macOS)

```bash
brew tap robinmordasiewicz/tap
brew install --cask xcsh
```

#### Using Install Script

```bash
curl -fsSL https://robinmordasiewicz.github.io/f5xc-xcsh/install.sh | sh
```

#### Using npm (for development)

```bash
git clone https://github.com/robinmordasiewicz/f5xc-xcsh.git
cd f5xc-xcsh
npm install
npm run build
```

### Authentication

Set your API credentials:

```bash
export F5XC_API_URL="https://your-tenant.console.ves.volterra.io"
export F5XC_API_TOKEN="your-api-token"
```

Or use connection profiles:

```bash
xcsh login profile create myprofile --url https://your-tenant.console.ves.volterra.io --token your-api-token
```

### Verify Installation

```bash
xcsh version
```

---

## Modes of Operation

### Interactive Mode (REPL)

Start the interactive shell:

```bash
xcsh
```

The REPL provides:

- Command history (up/down arrows)
- Tab completion for domains and commands
- Status bar with connection information
- Rich output formatting

#### Key Bindings

| Key | Action |
|-----|--------|
| Tab | Trigger completion |
| Up/Down | Navigate history |
| Enter | Execute command |
| Ctrl+C (2x) | Exit REPL |
| Ctrl+D | Exit immediately |

### Non-Interactive Mode

Execute commands directly from the shell:

```bash
xcsh <domain> <action> [resource_type] [options]
```

Examples:

```bash
xcsh virtual list http_loadbalancer
xcsh dns get dns_zone -ns default
xcsh waf list app_firewall -o json
```

---

## Understanding Domains

xcsh organizes F5 XC APIs into 38 domains. Each domain contains related resources and operations.

### Viewing Available Domains

```bash
xcsh --help
```

### Key Domains

| Domain | Description |
|--------|-------------|
| `virtual` | HTTP, TCP, UDP load balancers and origin pools |
| `dns` | DNS zones, domains, and load balancers |
| `waf` | Web application firewalls and security policies |
| `cloud_infrastructure` | AWS, Azure, GCP connectors |
| `sites` | Cloud and edge site deployments |
| `tenant_and_identity` | User profiles and sessions |

### Getting Domain Help

```bash
xcsh <domain> --help
```

Example:

```bash
xcsh virtual --help
```

---

## Command Syntax

### Basic Pattern

```text
xcsh <domain> <action> [resource_type] [resource_name] [options]
```

### Actions

| Action | Description |
|--------|-------------|
| `list` | List resources of a type |
| `get` | Get a specific resource by name |
| `create` | Create a new resource |
| `delete` | Delete a resource |
| `replace` | Replace an existing resource |
| `status` | Get resource status |

### Common Options

| Option | Description |
|--------|-------------|
| `-ns, --namespace` | Specify namespace |
| `-o, --output` | Output format (json, yaml, table, text) |
| `-n, --name` | Resource name |
| `--help` | Show help for command |

### Examples

```bash
# List all HTTP load balancers in default namespace
xcsh virtual list http_loadbalancer

# List origin pools in production namespace
xcsh virtual list origin_pool -ns production

# Get a specific WAF policy as JSON
xcsh waf get app_firewall my-waf -o json

# List DNS zones
xcsh dns list dns_zone
```

---

## Common Tasks

### Task 1: List Load Balancers

```bash
xcsh virtual list http_loadbalancer
```

With namespace:

```bash
xcsh virtual list http_loadbalancer -ns production
```

### Task 2: Get Resource Details

```bash
xcsh virtual get http_loadbalancer my-lb-name
```

As JSON:

```bash
xcsh virtual get http_loadbalancer my-lb-name -o json
```

### Task 3: Work with Origin Pools

List all origin pools:

```bash
xcsh virtual list origin_pool
```

Get specific pool:

```bash
xcsh virtual get origin_pool my-pool
```

### Task 4: Manage DNS

List DNS zones:

```bash
xcsh dns list dns_zone
```

Get DNS zone details:

```bash
xcsh dns get dns_zone example-com
```

### Task 5: Check Cloud Status

```bash
xcsh cloudstatus status
xcsh cloudstatus incidents
xcsh cloudstatus maintenance
```

### Task 6: Manage Connection Profiles

List profiles:

```bash
xcsh login profile list
```

Create profile:

```bash
xcsh login profile create prod --url https://prod.console.ves.volterra.io --token TOKEN
```

Switch profiles:

```bash
xcsh login profile use prod
```

---

## Output Formats

Control output format with `-o` or `--output`:

| Format | Description |
|--------|-------------|
| `table` | Formatted table (default) |
| `json` | JSON output |
| `yaml` | YAML output |
| `text` | Plain text |
| `tsv` | Tab-separated values |

Examples:

```bash
xcsh virtual list http_loadbalancer -o json
xcsh dns list dns_zone -o yaml
xcsh waf list app_firewall -o table
```

---

## Troubleshooting

### Issue: "HTTP 404" Error

**Problem**: Resource not found

**Solution**:

1. Verify the resource type name is correct
2. Check the namespace with `-ns`
3. Confirm the resource exists

```bash
# Check domain help for valid resource types
xcsh virtual --help
```

### Issue: Authentication Failed

**Problem**: API token invalid or expired

**Solution**:

1. Verify environment variables are set:

   ```bash
   echo $F5XC_API_URL
   echo $F5XC_API_TOKEN
   ```

2. Check active profile:

   ```bash
   xcsh login profile list
   ```

3. Create or update profile:

   ```bash
   xcsh login profile create myprofile --url URL --token TOKEN
   ```

### Issue: Connection Timeout

**Problem**: Cannot reach API

**Solution**:

1. Check API URL format (no trailing `/api`):

   ```bash
   export F5XC_API_URL="https://your-tenant.console.ves.volterra.io"
   ```

2. Verify network connectivity:

   ```bash
   curl -s "$F5XC_API_URL/api/web/namespaces" -H "Authorization: APIToken $F5XC_API_TOKEN" | head
   ```

### Issue: REPL Not Starting

**Problem**: Interactive mode fails

**Solution**:

1. Ensure you're in a terminal (TTY)
2. Check Node.js version (18+):

   ```bash
   node --version
   ```

3. Try non-interactive mode:

   ```bash
   xcsh virtual list http_loadbalancer
   ```

---

## Getting Help

### Documentation

- [Installation Guide](install/index.md)
- [Authentication](install/authentication.md)
- [Feature Guides](guides/index.md)

### Support

- **Issues**: https://github.com/robinmordasiewicz/f5xc-xcsh/issues
- **Discussions**: https://github.com/robinmordasiewicz/f5xc-xcsh/discussions

---

*Version: 2.0.7*
*Built with TypeScript and Ink (React for CLI)*
