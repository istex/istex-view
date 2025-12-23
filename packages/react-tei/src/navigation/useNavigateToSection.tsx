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
};

export function useDocumentNavigation() {
	return useContext(DocumentNavigationContext) ?? defaultContextValue;
}
