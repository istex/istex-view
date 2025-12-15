import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import vitePluginDevtoolsJson from "vite-plugin-devtools-json";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
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
