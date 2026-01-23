import { UploadPage } from "./upload/UploadPage";
import { ViewerContextProvider } from "./viewer/ViewerContext";
import { ViewerPage } from "./viewer/ViewerPage";

export function FileViewer() {
	return (
		<ViewerContextProvider>
			<UploadPage />
			<ViewerPage />
		</ViewerContextProvider>
	);
}
