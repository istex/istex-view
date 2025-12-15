import CssBaseline from "@mui/material/CssBaseline";

import { UploadPage } from "./upload/UploadPage";
import { ViewerContextProvider } from "./viewer/ViewerContext";
import { ViewerPage } from "./viewer/ViewerPage";

function App() {
	return (
		<>
			<CssBaseline />
			<ViewerContextProvider>
				<UploadPage />
				<ViewerPage />
			</ViewerContextProvider>
		</>
	);
}
export default App;
