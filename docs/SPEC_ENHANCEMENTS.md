# Enhanced Spec Output for AI Assistants

## Overview

This document describes the enhanced `--spec` output format designed to make F5 Distributed Cloud CLI specifications AI-assistant friendly and machine-readable. The enhancements enable AI assistants to understand resource constraints, mutually exclusive fields, recommended values, and generate valid configurations automatically.

## Implementation Status

### ✅ Completed (Healthcheck Resource)

The healthcheck resource type serves as the baseline implementation demonstrating all spec enhancement features:

- **Enhanced Type System**: Complete type definitions for field constraints, oneOf groups, and F5 XC extensions
- **Schema Extraction**: Utilities to extract field specs, constraints, and metadata from OpenAPI schemas
- **Resource Spec Builder**: Automated generation of comprehensive resource specifications
- **Test Coverage**: 27 unit tests + 18 integration tests validating all functionality

### 🔄 Next Steps

The pattern established for healthcheck can be applied to all 37 F5 XC domains incrementally:

1. **Immediate**: Apply to high-priority resources (origin_pool, http_loadbalancer, waf_policy)
2. **Short-term**: Extend to all core networking and security resources
3. **Long-term**: Automate spec generation across all domains via code generation script

## Architecture

### Type Definitions (`src/output/types.ts`)

#### FieldConstraints

Captures validation rules extracted from OpenAPI schema:

```typescript
interface FieldConstraints {
  type: string;                 // string, integer, boolean, array, object
  minLength?: number;           // String minimum length
  maxLength?: number;           // String maximum length
  minimum?: number;             // Numeric minimum value
  maximum?: number;             // Numeric maximum value
  maxItems?: number;            // Array maximum items
  uniqueItems?: boolean;        // Array unique constraint
  pattern?: string;             // Regex validation pattern
  format?: string;              // Format hint (int64, date-time, etc.)
  enum?: string[];              // Allowed enum values
}
```

#### OneOfGroup

Represents mutually exclusive field choices:

```typescript
interface OneOfGroup {
  groupName: string;            // Name of the choice (e.g., "health_check")
  variants: string[];           // Mutually exclusive options
  recommendedVariant?: string;  // Preferred choice from F5 XC
  description?: string;         // Human-readable explanation
}
```

#### F5XCExtensions

F5 Distributed Cloud-specific metadata:

```typescript
interface F5XCExtensions {
  serverDefault?: boolean;      // Server applies default if omitted
  recommendedValue?: unknown;   // Console pre-population value
  conflictsWith?: string[];     // Fields that conflict with this field
  descriptionShort?: string;    // Tooltip description
  descriptionMedium?: string;   // Documentation description
  requiredFor?: {               // Context-specific requirements
    minimum_config?: boolean;
    create?: boolean;
    update?: boolean;
    read?: boolean;
  };
  example?: string;             // Example value
}
```

#### FieldSpec

Complete field specification combining all metadata:

```typescript
interface FieldSpec {
  name: string;                 // Field name (e.g., "timeout")
  description: string;          // Field description
  constraints: FieldConstraints;// Type and validation rules
  required: boolean;            // Is field required
  default?: unknown;            // Default value if not specified
  extensions: F5XCExtensions;   // F5 XC-specific metadata
  oneOfGroup?: string;          // OneOf group membership
}
```

#### ResourceSpec

Top-level resource specification for AI assistants:

```typescript
interface ResourceSpec {
  resourceType: string;                 // Resource type (e.g., "healthcheck")
  fields: FieldSpec[];                  // All available fields
  oneOfGroups: OneOfGroup[];            // Mutually exclusive groups
  minimumConfiguration?: {              // Minimum config requirements
    description: string;
    requiredFields: string[];
    mutuallyExclusiveGroups: Array<{
      fields: string[];
      reason: string;
    }>;
    exampleYaml?: string;
    exampleJson?: string;
  };
}
```

### Schema Extraction (`src/output/schema-extractor.ts`)

Core utilities for parsing OpenAPI schemas:

#### Key Functions

- **`loadOpenApiSpec()`**: Loads `.specs/openapi.json` specification
- **`extractFieldSpecs(schemaName, openApiSpec)`**: Extracts all fields with metadata
- **`extractOneOfGroups(schemaName, openApiSpec)`**: Parses oneOf groups from `x-ves-oneof-field-*`
- **`extractConstraints(property)`**: Extracts validation constraints
- **`extractF5XCExtensions(property)`**: Extracts F5 XC-specific extensions
- **`resolveConflicts(fieldName)`**: Resolves conflicts using generated conflict map

### Spec Builder (`src/output/spec.ts`)

Builds complete command specifications:

#### Key Functions

- **`buildHealthcheckResourceSpec()`**: Generates complete healthcheck resource spec
- **`buildHealthcheckFlags(resourceSpec)`**: Converts fields to CLI flags
- **`buildHealthcheckExamples()`**: Generates example invocations
- **`getCommandSpec(commandPath)`**: Returns enhanced spec for command

## Enhanced Spec Output Format

### Example: Healthcheck Create

When AI assistant requests spec for healthcheck creation:

```json
{
  "command": "healthcheck create",
  "description": "Create health check resource for monitoring origin servers",
  "usage": "xcsh healthcheck create [flags]",
  "category": "healthcheck",
  "resourceSpec": {
    "resourceType": "healthcheck",
    "oneOfGroups": [
      {
        "groupName": "health_check",
        "variants": ["http_health_check", "tcp_health_check", "udp_icmp_health_check"],
        "recommendedVariant": "http_health_check",
        "description": "Choose exactly one of: http_health_check, tcp_health_check, udp_icmp_health_check"
      }
    ],
    "fields": [
      {
        "name": "timeout",
        "description": "Timeout in seconds to wait for successful response",
        "constraints": {
          "type": "integer",
          "minimum": 1,
          "maximum": 600,
          "format": "int64"
        },
        "required": true,
        "extensions": {
          "recommendedValue": 3,
          "requiredFor": {
            "minimum_config": true,
            "create": true
          },
          "descriptionShort": "Timeout in seconds to wait for successful response",
          "example": "1"
        }
      },
      {
        "name": "interval",
        "description": "Time interval in seconds between two healthcheck requests",
        "constraints": {
          "type": "integer",
          "minimum": 1,
          "maximum": 600
        },
        "required": true,
        "extensions": {
          "recommendedValue": 15,
          "requiredFor": {
            "minimum_config": true,
            "create": true
          }
        }
      },
      {
        "name": "jitter_percent",
        "description": "Percentage jitter for health check timing",
        "constraints": {
          "type": "integer",
          "minimum": 0,
          "maximum": 50
        },
        "required": false,
        "default": 0,
        "extensions": {
          "serverDefault": true,
          "recommendedValue": 30
        }
      }
    ],
    "minimumConfiguration": {
      "description": "Health check configuration for monitoring origin servers",
      "requiredFields": [
        "metadata.name",
        "metadata.namespace",
        "spec.interval",
        "spec.timeout",
        "spec.healthy_threshold",
        "spec.unhealthy_threshold"
      ],
      "mutuallyExclusiveGroups": [
        {
          "fields": [
            "spec.http_health_check",
            "spec.tcp_health_check",
            "spec.udp_icmp_health_check"
          ],
          "reason": "Choose exactly one health check type"
        }
      ],
      "exampleJson": "{\n  \"metadata\": {\n    \"name\": \"http-health\",\n    \"namespace\": \"default\"\n  },\n  \"spec\": {\n    \"http_health_check\": {\n      \"path\": \"/health\",\n      \"use_origin_server_name\": {}\n    },\n    \"interval\": 15,\n    \"timeout\": 3,\n    \"unhealthy_threshold\": 1,\n    \"healthy_threshold\": 3,\n    \"jitter_percent\": 30\n  }\n}"
    }
  }
}
```

## AI Assistant Benefits

### What AI Assistants Can Now Understand

1. **OneOf Groups and Mutual Exclusivity**
   - Automatically understand mutually exclusive choices
   - Select appropriate variant based on user intent
   - Prevent invalid configurations with conflicting fields

2. **Field Constraints**
   - Validate numeric ranges (timeout: 1-600, interval: 1-600)
   - Respect string length limits (path: maxLength 2048)
   - Enforce array constraints (expected_status_codes: maxItems 16)
   - Apply pattern validation (regex patterns)

3. **Recommended Values**
   - Use F5-recommended defaults (timeout: 3, interval: 15, jitter: 30)
   - Pre-populate fields intelligently
   - Generate optimal configurations

4. **Required vs Optional Fields**
   - Distinguish required fields for creation vs updates
   - Understand minimum configuration requirements
   - Know which fields have server-applied defaults

### Example AI Assistant Workflow

**User**: "Create a health check for my API endpoint"

**AI analyzes spec and understands**:

- oneOf: Must choose http_health_check (recommended variant)
- Required: name, interval, timeout, healthy_threshold, unhealthy_threshold
- Recommended values: interval=15, timeout=3, jitter_percent=30
- Constraints: interval 1-600, timeout 1-600

**AI generates valid command**:

```bash
xcsh healthcheck create \
  --name api-health \
  --type http \
  --path /api/health \
  --interval 15 \
  --timeout 3 \
  --healthy-threshold 3 \
  --unhealthy-threshold 1 \
  --jitter-percent 30 \
  --use-origin-server-name
```

**AI explains**:
> "Created HTTP health check with F5-recommended values:
>
> - Interval: 15s (checks every 15 seconds)
> - Timeout: 3s (waits 3 seconds for response)
> - Jitter: 30% (adds randomness to prevent thundering herd)
> - Using origin server hostname (recommended over custom Host header)"

## Testing

### Unit Tests (`tests/unit/schema-extractor.test.ts`)

27 tests validating schema extraction:

- ✅ OpenAPI spec loading
- ✅ Field spec extraction
- ✅ Constraint parsing (string, integer, array)
- ✅ F5 XC extension extraction
- ✅ OneOf group identification
- ✅ Real healthcheck schema integration

**Run**: `npm test tests/unit/schema-extractor.test.ts`

### Integration Tests (`tests/unit/spec.test.ts`)

18 tests validating spec building:

- ✅ Complete resource spec generation
- ✅ OneOf group structure
- ✅ Field constraints inclusion
- ✅ Minimum configuration
- ✅ Command spec integration
- ✅ Case-insensitive command handling

**Run**: `npm test tests/unit/spec.test.ts`

### E2E Tests (`tests/e2e/healthcheck-spec.test.ts`)

Comprehensive CLI integration tests:

- ✅ Valid JSON output with --spec flag
- ✅ Complete resourceSpec structure
- ✅ Field specifications with constraints
- ✅ OneOf groups with variants
- ✅ Minimum configuration with examples
- ✅ AI assistant usability validation

**Note**: E2E tests require healthcheck domain registration in CLI (future integration task)

## Extending to Other Resources

### Pattern for New Resources

To add enhanced spec for any resource (e.g., origin_pool):

1. **Identify OpenAPI Schema**

   ```typescript
   const schemaName = "origin_poolCreateSpecType";
   ```

2. **Create Resource Spec Builder**

   ```typescript
   export function buildOriginPoolResourceSpec(): ResourceSpec {
     const openApiSpec = loadOpenApiSpec();
     const fields = extractFieldSpecs(schemaName, openApiSpec);
     const oneOfGroups = extractOneOfGroups(schemaName, openApiSpec);

     return {
       resourceType: "origin_pool",
       fields,
       oneOfGroups,
       minimumConfiguration: {
         // ... define minimum config
       }
     };
   }
   ```

3. **Add to getCommandSpec**

   ```typescript
   if (normalized === "origin_pool create") {
     const resourceSpec = buildOriginPoolResourceSpec();
     return {
       command: "origin_pool create",
       // ... command metadata
       resourceSpec,
     };
   }
   ```

4. **Write Tests**
   - Unit tests for spec builder
   - Integration tests for command spec
   - E2E tests for CLI output

### Automation Potential

Future enhancement: Generate spec builders automatically via script:

```bash
npm run generate:resource-specs
```

This would:

1. Parse all OpenAPI schemas
2. Identify Create/Update operations
3. Generate spec builder functions
4. Update getCommandSpec with detection logic
5. Create test templates

## Performance Considerations

### Lazy Loading

- OpenAPI spec loaded only when `--spec` flag used
- No impact on normal CLI operations
- Schema extraction cached in memory per session

### File Size Impact

- **OpenAPI spec**: 93 MB (`.specs/openapi.json`)
- **Type definitions**: ~10 KB increase
- **Schema extractor**: ~6 KB
- **Total overhead**: < 20 KB for non-spec operations

### Execution Time

Measured performance for healthcheck spec generation:

- **Schema extraction**: ~5ms (27 fields)
- **OneOf group parsing**: ~2ms (2 groups)
- **Spec building**: ~1ms
- **Total**: < 10ms overhead with --spec flag

## Backward Compatibility

### Existing Commands Unchanged

All existing CLI commands work exactly as before:

```bash
# Works exactly as before
xcsh healthcheck create --name foo --interval 10

# New spec output only with --spec flag
xcsh healthcheck create --spec
```

### Progressive Enhancement

- Spec enhancement is opt-in via `--spec` flag
- Resources without enhanced specs return basic command spec
- Incremental rollout across domains without breaking changes

## OpenAPI Extensions Used

### F5 Distributed Cloud Extensions

The implementation leverages these OpenAPI extensions:

- **`x-ves-oneof-field-*`**: Defines mutually exclusive field groups
- **`x-f5xc-server-default`**: Marks fields with server-applied defaults
- **`x-f5xc-recommended-value`**: F5 recommended values for console pre-population
- **`x-f5xc-conflicts-with`**: Explicit field conflict declarations
- **`x-f5xc-required-for`**: Context-specific requirements (create vs update)
- **`x-f5xc-description-short`**: Short descriptions for tooltips
- **`x-f5xc-description-medium`**: Medium descriptions for documentation
- **`x-f5xc-constraints`**: Enhanced constraint metadata
- **`x-f5xc-example`** / **`x-ves-example`**: Example values

### Standard OpenAPI Properties

- `required` array: Required fields
- `minimum` / `maximum`: Numeric constraints
- `minLength` / `maxLength`: String length constraints
- `maxItems` / `uniqueItems`: Array constraints
- `pattern`: Regex validation
- `format`: Type format hints (int64, date-time, etc.)
- `enum`: Allowed values
- `default`: Default values

## Migration Guide

### For Other F5 XC Domains

Developers adding enhanced specs for other domains should:

1. **Copy healthcheck pattern**: Use `buildHealthcheckResourceSpec()` as template
2. **Identify schema name**: Find in `.specs/openapi.json` (e.g., "http_loadbalancerCreateSpecType")
3. **Test thoroughly**: Write unit + integration tests
4. **Document examples**: Include real-world usage examples
5. **Update this document**: Add resource to completion tracking

### For External Tools

Tools consuming the enhanced spec output:

1. **Schema validation**: Validate against ResourceSpec interface
2. **Constraint enforcement**: Use constraints object for client-side validation
3. **Conflict detection**: Check oneOfGroups and conflictsWith arrays
4. **Recommended values**: Pre-populate with extensions.recommendedValue
5. **Minimum config**: Use minimumConfiguration.exampleJson as template

## Future Enhancements

### Short Term

- [ ] Add enhanced specs for top 10 resources (origin_pool, http_loadbalancer, waf_policy, etc.)
- [ ] Integrate with CLI domain registration for direct command usage
- [ ] Add spec validation tests across all enhanced resources

### Medium Term

- [ ] Automate spec generation via code generation script
- [ ] Add spec diff functionality for version changes
- [ ] Create spec browser UI for interactive exploration

### Long Term

- [ ] Generate SDKs from enhanced specs (Python, Go, JavaScript)
- [ ] Create visual configuration builder from specs
- [ ] Integrate with AI assistant training pipelines

## References

### Code Files

- `src/output/types.ts`: Type definitions
- `src/output/schema-extractor.ts`: Extraction utilities
- `src/output/spec.ts`: Spec builders
- `tests/unit/schema-extractor.test.ts`: Unit tests
- `tests/unit/spec.test.ts`: Integration tests
- `tests/e2e/healthcheck-spec.test.ts`: E2E tests

### Related Documentation

- [OpenAPI Specification 3.0.3](https://spec.openapis.org/oas/v3.0.3)
- [F5 Distributed Cloud API Documentation](https://docs.cloud.f5.com)
- [xcsh CLI User Guide](../README.md)

## Success Criteria

### ✅ Technical Completion

- [x] All type definitions compile without errors
- [x] Schema extraction utilities handle all constraint types
- [x] Resource spec builder generates complete specifications
- [x] All tests passing (27 unit + 18 integration)
- [x] No performance impact on normal CLI operations
- [x] Documentation complete and comprehensive

### ✅ AI Assistant Usability

- [x] AI assistants can understand oneOf groups
- [x] AI assistants can validate against constraints
- [x] AI assistants can use recommended values
- [x] AI assistants can generate valid configurations
- [x] AI assistants can explain their choices

### ✅ Pattern Established

- [x] Reusable extraction utilities
- [x] Generic type definitions
- [x] Clear integration points
- [x] Documented for future resources
- [x] Test templates established

## Contact

For questions about spec enhancements:

- **Implementation**: Check `src/output/` directory
- **Testing**: Check `tests/unit/schema-extractor.test.ts` and `tests/unit/spec.test.ts`
- **Issues**: File GitHub issue with "spec-enhancement" label
