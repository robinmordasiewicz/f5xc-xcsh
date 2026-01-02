/**
 * Description Resolver Module
 *
 * Unified API for fetching descriptions from upstream API specs
 * with fallback to CLI-specific custom descriptions.
 */

export {
	descriptionResolver,
	createDescriptionResolver,
	getDomainDescriptions,
	getSubcommandDescriptions,
	getOperationDescription,
	getDomainOperations,
	getDomainResourceTypes,
	getActionDescription,
	isUpstreamDomain,
	isCliOnlyDomain,
	type DescriptionResolver,
} from "./resolver.js";

export type { DescriptionTiers } from "../domains/descriptions.generated.js";
