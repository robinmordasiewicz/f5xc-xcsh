/**
 * Reserved Words and Dangerous Patterns for CLI Resource Names
 *
 * Based on industry-standard CLI conventions from:
 * - kubectl (Kubernetes)
 * - az (Azure CLI)
 * - aws (AWS CLI)
 * - gcloud (Google Cloud)
 * - terraform
 * - docker
 *
 * These patterns prevent:
 * - Command injection attacks via shell metacharacters
 * - Name conflicts with reserved CLI action verbs
 * - Path traversal and flag confusion vulnerabilities
 * - Dangerous system command execution
 */

/**
 * CLI action verbs that cannot be used as resource names.
 * These words are reserved across all major cloud CLI tools.
 */
export const RESERVED_ACTIONS = new Set([
	// CRUD operations
	"create",
	"delete",
	"list",
	"get",
	"update",
	"apply",
	"patch",
	// Info operations
	"describe",
	"show",
	"status",
	"logs",
	"events",
	// Modification
	"edit",
	"replace",
	"set",
	"unset",
	// Lifecycle
	"start",
	"stop",
	"restart",
	"rollout",
	"scale",
	// Connection
	"attach",
	"detach",
	"connect",
	"disconnect",
	// Registration
	"register",
	"deregister",
	"associate",
	"disassociate",
	// AWS-specific
	"put",
	"modify",
	// Built-in xcsh commands
	"help",
	"quit",
	"exit",
	"clear",
	"history",
	"refresh",
	"context",
	"banner",
	"profile",
	"completion",
	// Common CLI patterns
	"run",
	"exec",
	"wait",
	"open",
	"close",
	"inspect",
	"validate",
	"diff",
	"plan",
	"import",
	"export",
]);

/**
 * Shell metacharacters that enable command injection attacks.
 * These must never appear in resource names.
 *
 * Security risks:
 * - ; & | - Command chaining/piping
 * - ` $() - Command substitution
 * - < > - I/O redirection
 * - # - Comment (truncates remaining input)
 * - ! - History expansion
 * - {} [] - Brace/bracket expansion
 * - * ? ~ - Glob patterns
 */
export const SHELL_METACHARACTERS = /[;&|`$()<>\\#!{}[\]*?~\n\r]/;

/**
 * Dangerous patterns that indicate potential security issues or CLI conflicts.
 */
export const DANGEROUS_PATTERNS: Array<{
	pattern: RegExp;
	message: string;
}> = [
	{
		pattern: /^-/,
		message:
			"Name cannot start with a hyphen (would be interpreted as a flag)",
	},
	{
		pattern: /^--/,
		message:
			"Name cannot start with double-hyphen (would be interpreted as a long flag)",
	},
	{
		pattern: /\.\./,
		message: "Name cannot contain '..' (path traversal risk)",
	},
	{
		pattern: /^\./,
		message: "Name cannot start with '.' (hidden file pattern)",
	},
	{
		pattern: /\//,
		message: "Name cannot contain '/' (path separator)",
	},
	{
		pattern: /\\$/,
		message: "Name cannot end with backslash (escape sequence risk)",
	},
	{
		pattern: /\s/,
		message: "Name cannot contain whitespace",
	},
	{
		pattern: /^_/,
		message:
			"Name cannot start with underscore (reserved for internal use)",
	},
];

/**
 * Dangerous system command names that should never be resource names.
 * Attackers may try to name resources after destructive commands.
 */
export const DANGEROUS_COMMANDS = new Set([
	// File destruction
	"rm",
	"rm-rf",
	"rmdir",
	"del",
	"unlink",
	"shred",
	// Privilege escalation
	"sudo",
	"su",
	"chmod",
	"chown",
	"chattr",
	"setfacl",
	// Network tools (payload download)
	"wget",
	"curl",
	"nc",
	"netcat",
	"socat",
	"telnet",
	"ssh",
	"scp",
	"rsync",
	// Shell execution
	"bash",
	"sh",
	"zsh",
	"csh",
	"ksh",
	"fish",
	"pwsh",
	"powershell",
	// Process execution
	"exec",
	"eval",
	"source",
	"nohup",
	"xargs",
	// Process termination
	"kill",
	"pkill",
	"killall",
	"killall5",
	// Disk operations
	"dd",
	"mkfs",
	"fdisk",
	"parted",
	"format",
	// System control
	"reboot",
	"shutdown",
	"halt",
	"poweroff",
	"init",
	"systemctl",
	// Container escape
	"docker",
	"kubectl",
	"nsenter",
	"chroot",
]);

/**
 * Control characters (0x00-0x1F, 0x7F) that can cause parser confusion.
 * These are never valid in resource names.
 */
// eslint-disable-next-line no-control-regex -- Intentional: detecting control chars for security validation
export const CONTROL_CHARS = /[\x00-\x1f\x7f]/;

/**
 * RFC 1035 DNS label format for Kubernetes/cloud resource names.
 * - 1-63 characters
 * - Lowercase alphanumeric and hyphens
 * - Must start with a letter
 * - Must end with alphanumeric
 */
// eslint-disable-next-line security/detect-unsafe-regex -- False positive: bounded to 63 chars max
export const RFC1035_PATTERN = /^[a-z]([a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * RFC 1123 DNS label format (slightly more permissive than RFC 1035).
 * - Can start with a digit
 */
// eslint-disable-next-line security/detect-unsafe-regex -- False positive: bounded to 63 chars max
export const RFC1123_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
