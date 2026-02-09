/**
 * Login Domain - Authentication, identity, and session management for F5 XC
 */

import type { DomainDefinition, ActionGroup } from "../registry.js";
import { listCommand as profileListCommand } from "./profile/list.js";
import { showCommand as profileShowCommand } from "./profile/show.js";
import { createCommand as profileCreateCommand } from "./profile/create.js";
import { useCommand as profileUseCommand } from "./profile/use.js";
import { deleteCommand as profileDeleteCommand } from "./profile/delete.js";
import { editCommand as profileEditCommand } from "./profile/edit.js";
import {
  listCommand as contextListCommand,
  showCommand as contextShowCommand,
  setCommand as contextSetCommand,
} from "./context/index.js";
import { bannerCommand } from "./banner/index.js";
import { whoamiCommand } from "./whoami/index.js";

/**
 * Action Groups - Verb-first routing (e.g., "login list profile")
 */

// List action - enumerate resources
const listAction: ActionGroup = {
  name: "list",
  description:
    "List available items of a given resource type. Display profiles or namespaces with current status indicators.",
  descriptionShort: "List profiles or namespaces",
  descriptionMedium: "Enumerate profiles or namespaces with status indicators.",
  resources: new Map([
    ["profile", profileListCommand],
    ["context", contextListCommand],
  ]),
};

// Show action - display details
const showAction: ActionGroup = {
  name: "show",
  description:
    "Show detailed information about a specific resource or current status. Display profile details or current namespace context.",
  descriptionShort: "Show profile or context details",
  descriptionMedium:
    "Display detailed information for profiles or namespace context.",
  resources: new Map([
    ["profile", profileShowCommand],
    ["context", contextShowCommand],
  ]),
};

// Create action - create new resources
const createAction: ActionGroup = {
  name: "create",
  description:
    "Create new resources interactively. Set up new connection profiles with tenant URL and credentials.",
  descriptionShort: "Create new profiles",
  descriptionMedium: "Interactively create new connection profiles.",
  resources: new Map([["profile", profileCreateCommand]]),
};

// Use action - activate/switch resources
const useAction: ActionGroup = {
  name: "use",
  description:
    "Activate or switch to a different resource. Change active profile or namespace context for subsequent operations.",
  descriptionShort: "Switch active profile or context",
  descriptionMedium:
    "Activate a different profile or namespace for operations.",
  resources: new Map([
    ["profile", profileUseCommand],
    ["context", contextSetCommand], // context "use" maps to context "set"
  ]),
};

// Edit action - modify existing resources
const editAction: ActionGroup = {
  name: "edit",
  description:
    "Edit existing resource configuration. Modify profile settings including URL, token, and namespace defaults.",
  descriptionShort: "Edit profile configuration",
  descriptionMedium: "Modify existing profile settings.",
  resources: new Map([["profile", profileEditCommand]]),
};

// Delete action - remove resources
const deleteAction: ActionGroup = {
  name: "delete",
  description:
    "Delete existing resources. Remove saved profiles from local configuration.",
  descriptionShort: "Delete profiles",
  descriptionMedium: "Remove saved profiles from configuration.",
  resources: new Map([["profile", profileDeleteCommand]]),
};

/**
 * Login domain definition - Verb-first structure
 */
export const loginDomain: DomainDefinition = {
  name: "login",
  description:
    "Authentication, identity, and session management for F5 XC. Manage connection profiles to save and switch between tenants, handle context for namespace targeting, and verify current authentication status.",
  descriptionShort: "Authentication and session management",
  descriptionMedium:
    "Manage connection profiles, authentication contexts, and session identity for F5 Distributed Cloud.",
  defaultCommand: whoamiCommand,
  commands: new Map([["banner", bannerCommand]]),
  actions: new Map([
    ["list", listAction],
    ["show", showAction],
    ["create", createAction],
    ["use", useAction],
    ["edit", editAction],
    ["delete", deleteAction],
  ]),
  subcommands: new Map(), // Clean break - no backward compatibility
};
