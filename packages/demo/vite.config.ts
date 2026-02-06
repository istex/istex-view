import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import vitePluginDevtoolsJson from "vite-plugin-devtools-json";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	base: process.env.GITHUB_ACTIONS ? "/istex-view/" : undefined,
	server: {
		port: 3000,
	},
	plugins: [
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		vitePluginDevtoolsJson(),
		react(),
	],
});

export default config;
