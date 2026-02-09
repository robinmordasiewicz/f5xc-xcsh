# Quick Reference

Common xcsh CLI commands and patterns.

## Resource Management

| Description | Command |
|-------------|--------|
| List resources in a domain | `xcsh {domain} list {resource}` |
| Get resource as YAML | `xcsh {domain} get {resource} {name} -o yaml` |
| Create resource from file | `xcsh {domain} create {resource} -f {file}.yaml` |
| Delete resource | `xcsh {domain} delete {resource} {name} -ns {namespace}` |
| Replace/update resource | `xcsh {domain} replace {resource} {name} -f {file}.yaml` |

## Output Formats

| Description | Command |
|-------------|--------|
| Output as YAML | `xcsh {domain} get {resource} {name} -o yaml` |
| Output as JSON | `xcsh {domain} get {resource} {name} -o json` |
| Wide output with more columns | `xcsh {domain} list {resource} -o wide` |

## Namespace Operations

| Description | Command |
|-------------|--------|
| Specify namespace | `xcsh {domain} get {resource} {name} -ns {namespace}` |
| List in all namespaces | `xcsh {domain} list {resource} --all-namespaces` |

## AI Assistant

Using the xcsh AI assistant for natural language queries

| Query | Interpretation |
|-------|---------------|
| "list all load balancers" | Lists HTTP load balancers in the current namespace |
| "create a load balancer for api.example.com" | Generates configuration and creates HTTP LB |
| "show me the origin pools" | Lists origin pools with details |

---

*CLI examples specific to xcsh. See domain guides for API resource details.*
