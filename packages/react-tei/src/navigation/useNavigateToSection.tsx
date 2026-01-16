import { useContext } from "react";
import {
	DocumentNavigationContext,
	type DocumentNavigationContextValue,
} from "./DocumentNavigationContext";

const defaultContextValue: DocumentNavigationContextValue = {
	navigateToHeading: (headingId: string) => {
		console.error(
			`navigateToHeading called with headingId: ${headingId}, but no provider is set.`,
		);
	},
	navigateToBodyTargetSelector: (querySelector: string) => {
		console.error(
			`navigateToBodyTargetSelector called with querySelector: ${querySelector}, but no provider is set.`,
		);
	},
	navigateToFootnote: (footnoteId: string) => {
		console.error(
			`navigateToFootnote called with footnoteId: ${footnoteId}, but no provider is set.`,
		);
	},
	navigateToFootnoteRef: (id: string) => {
		console.error(
			`navigateToDocumentRef called with id: ${id}, but no provider is set.`,
		);
	},
	navigateToBibliographicReference: (id: string) => {
		console.error(
			`navigateToBibliographicReference called with id: ${id}, but no provider is set.`,
		);
	},
	navigateToBibliographicReferenceRef: (id: string) => {
		console.error(
			`navigateToBibliographicReferenceRef called with id: ${id}, but no provider is set.`,
		);
	},
};

export function useDocumentNavigation() {
	return useContext(DocumentNavigationContext) ?? defaultContextValue;
}
