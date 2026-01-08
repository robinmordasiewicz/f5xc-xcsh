# xcsh

F5 Distributed Cloud Shell - A command-line interface for managing F5 Distributed Cloud resources.

**API Version:** v2.0.21

Built with F5 Distributed Cloud API specifications.

Version v2.0.21 includes updated API specifications for enhanced functionality.

## Documentation

Full documentation is available at **[robinmordasiewicz.github.io/f5xc-xcsh](https://robinmordasiewicz.github.io/f5xc-xcsh)**

## Installation

### Homebrew

```bash
brew tap robinmordasiewicz/tap
brew install --cask xcsh
```

### Install Script

```bash
curl -fsSL https://raw.githubusercontent.com/robinmordasiewicz/f5xc-xcsh/main/install.sh | sh
```

## Usage

### Basic Command Structure

The CLI is organized around **domains** matching F5 Distributed Cloud API structure:

```bash
xcsh <domain> <operation> <resource-type> [resource-name] [flags]
```

### Domain-Based Commands

Common domains include:

| Domain                 | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `virtual`              | HTTP, TCP, UDP load balancers and origin pools  |
| `cloud_infrastructure` | AWS, Azure, GCP cloud sites and credentials     |
| `waf`                  | Web application firewalls and security policies |
| `dns`                  | DNS zones and load balancing                    |
| `sites`                | Site management and virtual sites               |
| `tenant_and_identity`  | User profiles and sessions                      |
| `ai_services`          | AI assistant for natural language queries       |

### Examples

#### List Resources

```bash
# List HTTP load balancers in default namespace
xcsh virtual list http_loadbalancer

# List in specific namespace
xcsh virtual list http_loadbalancer -ns production
```

#### Get a Specific Resource

```bash
# Get a load balancer configuration
xcsh virtual get http_loadbalancer example-lb

# Get from specific namespace as YAML
xcsh virtual get http_loadbalancer example-lb -ns production -o yaml
```

#### Create a Resource

```bash
# Create from YAML file
xcsh virtual create http_loadbalancer -f lb-config.yaml
```

#### Delete a Resource

```bash
# Delete a resource
xcsh virtual delete http_loadbalancer example-lb -ns production
```

#### Apply (Create or Update)

```bash
# Apply from YAML (creates if not exists, updates if does)
xcsh virtual apply http_loadbalancer -f lb-config.yaml
```

#### Get Help

```bash
# Show available domains
xcsh --help

# Show domain-specific operations
xcsh virtual --help
```

## Development

### Build from Source

```bash
git clone https://github.com/robinmordasiewicz/f5xc-xcsh.git
cd f5xc-xcsh
npm install
npm run build
./dist/index.js version
```

### Domain Registry

xcsh contains **38 domains** organized by functional area and automatically synchronized with F5 Distributed Cloud API specifications:

- **Load Balancing**: virtual (HTTP, TCP, UDP load balancers and origin pools)
- **Infrastructure**: cloud_infrastructure, sites, ce_management
- **Security**: waf, bot_and_threat_defense, network_security
- **Networking**: network, dns
- **Observability**: observability, statistics, telemetry_and_insights
- **Identity**: tenant_and_identity, users, authentication

## License

This project is open source. See the LICENSE file for details.
