import {
	DocumentNavigationContext,
	type DocumentNavigationContextValue,
} from "./DocumentNavigationContext";

export const testNavigationContextProviderValue: DocumentNavigationContextValue =
	{
		navigateToHeading: () => {
			throw new Error("navigateToBodyTargetSelector has been called");
		},
		navigateToBodyTargetSelector: () => {
			throw new Error("navigateToBodyTargetSelector has been called");
		},
		navigateToFootnoteRef: () => {
			throw new Error("navigateToFootnoteRef has been called");
		},
		navigateToFootnote: () => {
			throw new Error("navigateToFootnote has been called");
		},
		navigateToBibliographicReference: () => {
			throw new Error("navigateToBibliographicReference has been called");
		},
		navigateToBibliographicReferenceRef: () => {
			throw new Error(`navigateToBibliographicReferenceRef has been called`);
		},
	};

export function TestDocumentNavigationContextProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value?: Partial<DocumentNavigationContextValue>;
}) {
	return (
		<DocumentNavigationContext.Provider
			value={{
				...testNavigationContextProviderValue,
				...value,
			}}
		>
			{children}
		</DocumentNavigationContext.Provider>
	);
}
