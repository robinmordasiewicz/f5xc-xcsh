/**
 * Configuration module exports.
 */

export {
  EnvVarRegistry,
  formatEnvVarsSection,
  formatConfigSection,
  type EnvVar,
} from "./envvars.js";

export {
  loadSettings,
  loadSettingsSync,
  getConfigPath,
  isValidLogoMode,
  getLogoModeDescription,
  isValidCompletionMode,
  getCompletionModeDescription,
  DEFAULT_SETTINGS,
  LOGO_MODES,
  LOGO_MODE_HELP,
  COMPLETION_MODES,
  COMPLETION_MODE_HELP,
  type AppSettings,
  type LogoDisplayMode,
  type LogoModeDefinition,
  type CompletionMode,
  type CompletionModeDefinition,
} from "./settings.js";
