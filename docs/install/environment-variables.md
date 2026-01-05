# Environment Variables

xcsh can be configured using environment variables.

## Authentication Variables

| Variable | Description |
|----------|-------------|
| `F5XC_API_TOKEN` | API token for authenticating with F5 Distributed Cloud services |
| `F5XC_API_URL` | F5 Distributed Cloud API endpoint URL |

## Output Variables

| Variable | Description |
|----------|-------------|
| `F5XC_OUTPUT` | Default output format for command results (json, yaml, table, text, tsv) |

## Usage Examples

### Basic Setup

=== "Mac/Linux"

    ```bash
    # Set API credentials
    export F5XC_API_URL="https://your-tenant.console.ves.volterra.io"
    export F5XC_API_TOKEN="your-api-token"

    # Run command
    xcsh virtual list http_loadbalancer
    ```

=== "Windows"

    ```powershell
    # Set API credentials
    $env:F5XC_API_URL = "https://your-tenant.console.ves.volterra.io"
    $env:F5XC_API_TOKEN = "your-api-token"

    # Run command
    xcsh virtual list http_loadbalancer
    ```

### JSON Output Default

=== "Mac/Linux"

    ```bash
    export F5XC_OUTPUT="json"

    # All commands now output JSON by default
    xcsh virtual list http_loadbalancer
    ```

=== "Windows"

    ```powershell
    $env:F5XC_OUTPUT = "json"

    # All commands now output JSON by default
    xcsh virtual list http_loadbalancer
    ```

## Shell Configuration

Add to your shell profile for persistent configuration:

### Bash (~/.bashrc)

```bash
export F5XC_API_URL="https://your-tenant.console.ves.volterra.io"
export F5XC_API_TOKEN="your-api-token"
```

### Zsh (~/.zshrc)

```bash
export F5XC_API_URL="https://your-tenant.console.ves.volterra.io"
export F5XC_API_TOKEN="your-api-token"
```

### Fish (~/.config/fish/config.fish)

```fish
set -x F5XC_API_URL "https://your-tenant.console.ves.volterra.io"
set -x F5XC_API_TOKEN "your-api-token"
```

### PowerShell ($PROFILE)

```powershell
$env:F5XC_API_URL = "https://your-tenant.console.ves.volterra.io"
$env:F5XC_API_TOKEN = "your-api-token"
```

!!! note "PowerShell Profile"
    Add to your `$PROFILE` for persistent configuration. Create it first if needed:
    ```powershell
    New-Item -ItemType File -Force -Path $PROFILE
    ```

## Precedence

Environment variables override connection profile settings:

1. **Environment variables** (highest priority)
2. Active connection profile
3. Default values (lowest priority)

## Security Considerations

- Never commit environment variables with secrets to version control
- Use secret management tools for production environments
- Consider using `.envrc` with direnv for project-specific settings
- Ensure proper file permissions on shell configuration files
