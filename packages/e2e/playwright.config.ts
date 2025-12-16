import { defineConfig, devices } from "@playwright/test";

const command = process.env.DEV
	? 'pnpm turbo run --filter="@istex/viewer-demo" dev'
	: 'pnpm turbo run --filter="@istex/viewer-demo" preview';
const baseURL = process.env.DEV
	? "http://localhost:3000/istex-view"
	: "http://localhost:8000/istex-view";

export default defineConfig({
	testDir: "./src",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "line",
	use: {
		baseURL,
		trace: "on-first-retry",
		locale: "fr-FR",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	webServer: {
		command,
		url: `${baseURL}/`,
		reuseExistingServer: !process.env.CI,
	},
});
