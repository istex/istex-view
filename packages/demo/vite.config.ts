import { resolve } from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import vitePluginDevtoolsJson from "vite-plugin-devtools-json";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	base: "/istex-view/",
	server: {
		port: 3000,
	},
	build: {
		rollupOptions: {
			input: {
				"404.html": resolve(__dirname, "./404.html"),
				"index.html": resolve(__dirname, "./index.html"),
			},
		},
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
