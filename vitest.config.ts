import react from "@vitejs/plugin-react-swc";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		include: ["packages/**/*.spec.ts", "packages/**/*.spec.tsx"],
		exclude: ["packages/e2e/**/*"],
		testTimeout: 2500,
		setupFiles: ["test/setup.ts"],
		coverage: {
			provider: "v8",
		},
		browser: {
			enabled: true,
			provider: playwright({
				contextOptions: {
					locale: "fr-FR",
				},
			}),
			instances: [{ browser: "chromium" }],
			viewport: { width: 1920, height: 1080 },
		},
	},
});
