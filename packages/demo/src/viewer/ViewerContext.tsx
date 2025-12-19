import { createContext, useMemo, useState } from "react";

export type ViewerContextType = {
	document: string | null;

	openDocument(document: string): void;
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
	const [document, setDocument] = useState<string | null>(null);
	const value = useMemo(
		() => ({
			document,
			openDocument(document: string) {
				setDocument(document);
			},
			closeDocument() {
				setDocument(null);
			},
		}),
		[document],
	);

	return (
		<ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
	);
}
