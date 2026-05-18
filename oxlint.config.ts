import { defineConfig } from "oxlint"

export default defineConfig({
	$schema: "./node_modules/oxlint/configuration_schema.json",
	plugins: [
		"eslint",
		"unicorn",
		"react",
		"typescript",
		"import",
		"oxc",
		"jsx-a11y",
		"react-perf",
		"promise",
	],
	settings: {
		"jsx-a11y": {
			components: {
				Button: "button",
			},
		},
	},
	rules: {
		"jsx-a11y/no-noninteractive-tabindex": "off",
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
	],
})
