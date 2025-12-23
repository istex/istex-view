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
	navigateToFootnote: (footnoteId: string) => {
		console.error(
			`navigateToFootnote called with footnoteId: ${footnoteId}, but no provider is set.`,
		);
	},
	navigateToDocumentRef: (id: string) => {
		console.error(
			`navigateToDocumentRef called with id: ${id}, but no provider is set.`,
		);
	},
};

export function useDocumentNavigation() {
	return useContext(DocumentNavigationContext) ?? defaultContextValue;
}
