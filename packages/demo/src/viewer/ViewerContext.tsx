import { createContext, useMemo, useState } from "react";

export type ViewerContextType = {
	viewerLaunched: boolean;
	document: string | null;
	unitexEnrichment: string | null;

	launchViewer(): void;
	openDocument(document: string): void;
	openUnitexEnrichment(enrichment: string): void;
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
	const [document, setDocument] = useState<string | null>(null);
	const [unitexEnrichment, setUnitexEnrichment] = useState<string | null>(null);
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
			openDocument(document: string) {
				setDocument(document);
			},
			openUnitexEnrichment(enrichment: string) {
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
