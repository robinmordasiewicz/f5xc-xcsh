import { defineConfig } from "tsup";
import { readFileSync } from "fs";

// Read package.json version
const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

// Generate build version
// Priority: XCSH_VERSION env var > package.json version
function getBuildVersion(): string {
	if (process.env.XCSH_VERSION) {
		return process.env.XCSH_VERSION;
	}

	// Use package version with build timestamp for dev builds
	const now = new Date();
	const timestamp = [
		now.getFullYear(),
		String(now.getMonth() + 1).padStart(2, "0"),
		String(now.getDate()).padStart(2, "0"),
		String(now.getHours()).padStart(2, "0"),
		String(now.getMinutes()).padStart(2, "0"),
	].join("");

	return `${packageJson.version}-${timestamp}`;
}

export default defineConfig({
	entry: ["src/index.tsx"],
	// Use ESM format - required for ink v5+ which uses top-level await
	format: ["esm"],
	dts: true,
	clean: true,
	// Bundle all dependencies into single file for standalone binary
	noExternal: [/.*/],
	// Disable code splitting - single file output required for pkg
	splitting: false,
	// Shebang is added automatically by tsup when bin is defined in package.json
	define: {
		BUILD_VERSION: JSON.stringify(getBuildVersion()),
	},
	platform: "node",
	// Add banner to polyfill require for CJS dependencies in ESM bundle
	banner: {
		js: `import { createRequire as __createRequire } from 'module';
const require = __createRequire(import.meta.url);`,
	},
	esbuildOptions(options) {
		// Stub react-devtools-core (optional dependency not needed for production)
		// This creates an empty module instead of failing to find the package
		options.alias = {
			"react-devtools-core": "./src/stubs/devtools.ts",
		};
	},
});
