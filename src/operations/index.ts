/**
 * Operations module
 * Provides utilities for looking up and resolving API operations from generated specs
 */

export {
  getOperationDefinition,
  substitutePathParams,
  inferMethodFromAction,
  hasUnsubstitutedParams,
  getPathPlaceholders,
} from "./resolver.js";
