# Authentication

xcsh uses API tokens to connect to the F5 Distributed Cloud API.

## Obtaining an API Token

1. Log in to the F5 XC Console
2. Navigate to **Administration** > **Personal Management** > **Credentials**
3. Click **Create Credentials**
4. Select type **API Token**
5. Copy the generated token

## Environment Variables

The simplest authentication method uses environment variables:

```bash
export F5XC_API_URL="https://your-tenant.console.ves.volterra.io"
export F5XC_API_TOKEN="your-api-token"
```

Then run any xcsh command:

```bash
xcsh tenant_and_identity list namespace
```

## Connection Profiles

For managing multiple tenants, use connection profiles to save and switch between credentials.

### Create a Profile

```bash
xcsh login profile create myprofile --url https://your-tenant.console.ves.volterra.io --token your-api-token
```

### List Profiles

```bash
xcsh login profile list
```

### Switch Profiles

```bash
xcsh login profile use myprofile
```

### Show Profile Details

```bash
xcsh login profile show myprofile
```

### Delete a Profile

```bash
xcsh login profile delete myprofile
```

## Authentication Priority

xcsh uses credentials in this order:

1. **Environment variables** (`F5XC_API_URL` and `F5XC_API_TOKEN`)
2. **Active connection profile** (if no env vars set)

If environment variable credentials are invalid, xcsh will automatically fall back to the active profile.

## Verifying Authentication

Test your configuration by listing your saved profiles:

```bash
xcsh login profile list
```

Or list available resources from a domain:

```bash
xcsh virtual list http_loadbalancer
```

In interactive mode, the status bar shows the current tenant URL and connection status.
