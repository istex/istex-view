import { createContext, useMemo, useState } from "react";

export type ViewerContextType = {
	viewerLaunched: boolean;
	document: DocumentFile | null;
	unitexEnrichment: DocumentFile | null;
	multicatEnrichment: DocumentFile | null;
	nbEnrichment: DocumentFile | null;
	teeftEnrichment: DocumentFile | null;

	launchViewer(): void;
	openDocument(document: DocumentFile): void;
	openUnitexEnrichment(enrichment: DocumentFile | null): void;
	openMulticatEnrichment(enrichment: DocumentFile | null): void;
	openNbEnrichment(enrichment: DocumentFile | null): void;
	openTeeftEnrichment(enrichment: DocumentFile | null): void;
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
	const [document, setDocument] = useState<DocumentFile | null>(null);
	const [unitexEnrichment, setUnitexEnrichment] = useState<DocumentFile | null>(
		null,
	);

	const [multicatEnrichment, setMulticatEnrichment] =
		useState<DocumentFile | null>(null);

	const [nbEnrichment, setNbEnrichment] = useState<DocumentFile | null>(null);

	const [teeftEnrichment, setTeeftEnrichment] = useState<DocumentFile | null>(
		null,
	);

	const value = useMemo(
		() => ({
			viewerLaunched,
			document,
			unitexEnrichment,
			multicatEnrichment,
			nbEnrichment,
			teeftEnrichment,
			launchViewer() {
				if (!document) {
					return;
				}
				setViewerLaunched(true);
			},
			openDocument(document: DocumentFile) {
				setDocument(document);
			},
			openUnitexEnrichment(enrichment: DocumentFile | null) {
				setUnitexEnrichment(enrichment);
			},
			openMulticatEnrichment(enrichment: DocumentFile | null) {
				setMulticatEnrichment(enrichment);
			},
			openNbEnrichment(enrichment: DocumentFile | null) {
				setNbEnrichment(enrichment);
			},
			openTeeftEnrichment(enrichment: DocumentFile | null) {
				setTeeftEnrichment(enrichment);
			},
			closeDocument() {
				setDocument(null);
				setUnitexEnrichment(null);
			},
		}),
		[
			viewerLaunched,
			document,
			unitexEnrichment,
			multicatEnrichment,
			nbEnrichment,
			teeftEnrichment,
		],
	);

	return (
		<ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
	);
}

export type DocumentFile = {
	filename: string;
	content: string;
};
