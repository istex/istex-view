import { createContext, useMemo, useState } from "react";

export type ViewerContextType = {
	viewerLaunched: boolean;
	document: {
		filename: string;
		content: string;
	} | null;
	unitexEnrichment: {
		filename: string;
		content: string;
	} | null;

	launchViewer(): void;
	openDocument(document: { filename: string; content: string }): void;
	openUnitexEnrichment(enrichment: { filename: string; content: string }): void;
	closeDocument(): void;
};

export const ViewerContext = createContext<ViewerContextType | undefined>(
	undefined,
);

export function ViewerContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [viewerLaunched, setViewerLaunched] = useState(false);
	const [document, setDocument] = useState<{
		filename: string;
		content: string;
	} | null>(null);
	const [unitexEnrichment, setUnitexEnrichment] = useState<{
		filename: string;
		content: string;
	} | null>(null);
	const value = useMemo(
		() => ({
			viewerLaunched,
			document,
			unitexEnrichment,
			launchViewer() {
				if (!document) {
					return;
				}
				setViewerLaunched(true);
			},
			openDocument(document: { filename: string; content: string }) {
				setDocument(document);
			},
			openUnitexEnrichment(enrichment: { filename: string; content: string }) {
				setUnitexEnrichment(enrichment);
			},
			closeDocument() {
				setDocument(null);
				setUnitexEnrichment(null);
			},
		}),
		[viewerLaunched, document, unitexEnrichment],
	);

	return (
		<ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
	);
}
