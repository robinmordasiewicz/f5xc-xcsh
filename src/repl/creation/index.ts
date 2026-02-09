/**
 * Resource Creation Module
 *
 * Provides flag parsing and resource building for CLI-based resource creation.
 */

export {
  parseCreationFlags,
  hasCreationFlagsInArgs,
  getFlagValue,
  getFlagValues,
  getFlagIntValue,
  isFlagSet,
  type ParsedCreationFlags,
} from "./flag-parser.js";

export {
  getResourceBuilder,
  hasResourceBuilder,
  getBuilderResourceTypes,
  buildResource,
  validateResourceFlags,
  type ResourceBuilder,
  type ValidationResult,
  type HealthcheckRequestBody,
  type OriginPoolRequestBody,
} from "./builders/index.js";
