import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createHashRouter, RouterProvider } from "react-router";

import { I18nProvider } from "./i18n/I18nProvider";
import { Layout } from "./layout/Layout";
import { Loader } from "./layout/Loader";
import {
	ArkViewer,
	ArkViewerErrorBoundary,
	arkViewerLoader,
} from "./modules/ark-viewer/ArkViewer";
import { FileViewer } from "./modules/file-viewer/FileViewer";
import theme from "./theme";

const router = createHashRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				index: true,
				Component: FileViewer,
			},

			{
				path: ":ark",
				loader: arkViewerLoader,
				HydrateFallback: Loader,
				Component: ArkViewer,
				ErrorBoundary: ArkViewerErrorBoundary,
			},
		],
	},
]);

function App() {
	return (
		<ThemeProvider theme={theme}>
			<I18nProvider>
				<CssBaseline />
				<RouterProvider router={router} />
			</I18nProvider>
		</ThemeProvider>
	);
}
export default App;
