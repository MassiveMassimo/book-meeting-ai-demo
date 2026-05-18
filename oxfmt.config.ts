import { defineConfig } from "oxfmt"

export default defineConfig({
	$schema: "./node_modules/oxfmt/configuration_schema.json",
	semi: false,
	sortImports: {
		newlinesBetween: false,
		groups: [
			"type-import",
			[
				"value-builtin",
				"value-external",
				"value-internal",
				"value-parent",
				"value-sibling",
				"value-index",
			],
			"unknown",
		],
	},
	useTabs: true,
	sortTailwindcss: {
		stylesheet: "src/styles.css",
		functions: ["cn", "clsx", "cva", "tw"],
	},
	ignorePatterns: [
		"dist",
		"docs",
		"node_modules",
		"public",
		"src/routeTree.gen.ts",
		"pnpm-lock.yaml",
		".agents",
		".claude",
		"**/*.md",
	],
})
