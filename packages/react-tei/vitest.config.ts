import react from "@vitejs/plugin-react-swc";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
		testTimeout: 2500,
		coverage: {
			provider: "v8",
		},
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{ browser: "chromium" }],
			viewport: { width: 1920, height: 1080 },
		},
	},
});
