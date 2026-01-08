import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { I18nProvider } from "./i18n/I18nProvider";
import { Layout } from "./layout/Layout";
import theme from "./theme";
import { UploadPage } from "./upload/UploadPage";
import { ViewerContextProvider } from "./viewer/ViewerContext";
import { ViewerPage } from "./viewer/ViewerPage";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<I18nProvider>
				<Layout>
					<CssBaseline />
					<ViewerContextProvider>
						<UploadPage />
						<ViewerPage />
					</ViewerContextProvider>
				</Layout>
			</I18nProvider>
		</ThemeProvider>
	);
}
export default App;
