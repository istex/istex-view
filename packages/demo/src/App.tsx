import CssBaseline from "@mui/material/CssBaseline";

import { I18nProvider } from "./i18n/I18nProvider";
import { UploadPage } from "./upload/UploadPage";
import { ViewerContextProvider } from "./viewer/ViewerContext";
import { ViewerPage } from "./viewer/ViewerPage";

function App() {
	return (
		<I18nProvider>
			<CssBaseline />
			<ViewerContextProvider>
				<UploadPage />
				<ViewerPage />
			</ViewerContextProvider>
		</I18nProvider>
	);
}
export default App;
