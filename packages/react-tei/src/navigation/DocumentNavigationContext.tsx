import { createContext, useCallback, useMemo } from "react";

export type DocumentNavigationContextValue = {
	navigateToHeading(headingId: string): void;
};

export const DocumentNavigationContext =
	createContext<DocumentNavigationContextValue | null>(null);

export function DocumentNavigationContextProvider({
	documentRef,
	children,
}: DocumentNavigationContextProviderProps) {
	const navigateToHeading = useCallback(
		(headingId: string) => {
			const documentElement = documentRef.current;

			if (!documentElement) {
				console.error("Document element not found");
				return;
			}

			const headingElement = documentElement.querySelector<HTMLElement>(
				`#${headingId}`,
			);

			if (!headingElement) {
				console.warn(`Heading with id '${headingId}' not found`);
				return;
			}

			headingElement.scrollIntoView({ behavior: "smooth" });
		},
		[documentRef],
	);

	const value = useMemo(() => ({ navigateToHeading }), [navigateToHeading]);

	return (
		<DocumentNavigationContext.Provider value={value}>
			{children}
		</DocumentNavigationContext.Provider>
	);
}

type DocumentNavigationContextProviderProps = {
	children: React.ReactNode;

	documentRef: React.RefObject<HTMLDivElement | null>;
	sidePanelRef: React.RefObject<HTMLDivElement | null>;
};
