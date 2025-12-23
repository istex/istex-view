import { createContext, useCallback, useMemo, useState } from "react";
import { useDocumentContext } from "../DocumentContextProvider";

export type DocumentNavigationContextValue = {
	navigateToHeading(headingId: string): void;
	navigateToFootnote(footnoteId: string): void;
	navigateToDocumentRef(id: string): void;
};

export const DocumentNavigationContext =
	createContext<DocumentNavigationContextValue | null>(null);

type DocumentNavigationContextProviderProps = {
	children: React.ReactNode;

	documentRef: React.RefObject<HTMLDivElement | null>;
	sidePanelRef: React.RefObject<HTMLDivElement | null>;
};

export function DocumentNavigationContextProvider({
	documentRef,
	sidePanelRef,
	children,
}: DocumentNavigationContextProviderProps) {
	const { panel } = useDocumentContext();
	const [currentSelector, setCurrentSelector] = useState<string>("");
	const [currentElementIndex, setCurrentElementIndex] = useState<number>(0);
	const navigateToBodyTargetSelector = useCallback(
		(querySelector: string) => {
			const documentElement = documentRef.current;

			if (!documentElement) {
				console.error("Document element not found");
				return;
			}

			const targetElements =
				documentElement.querySelectorAll<HTMLElement>(querySelector);

			if (!targetElements.length) {
				console.warn(`Element with querySelector '${querySelector}' not found`);
				return;
			}
			if (currentSelector !== querySelector) {
				setCurrentSelector(querySelector);
			}
			setCurrentElementIndex((prevIndex) => {
				if (currentSelector !== querySelector) {
					return 0;
				}
				return (prevIndex + 1) % targetElements.length;
			});

			if (!targetElements[currentElementIndex]) {
				console.error(
					`Target element with querySelector '${querySelector}' and index '${currentElementIndex}' not found`,
				);
				return;
			}

			targetElements[currentElementIndex].scrollIntoView({
				behavior: "smooth",
			});
		},
		[documentRef, currentElementIndex, currentSelector],
	);

	const navigateToHeading = useCallback(
		(headingId: string) => {
			return navigateToBodyTargetSelector(`#${headingId}`);
		},
		[navigateToBodyTargetSelector],
	);

	const navigateToPanelTargetSelector = useCallback(
		(querySelector: string) => {
			const sidePanelElement = sidePanelRef.current;

			if (!sidePanelElement) {
				console.error("Side panel element not found");
				return;
			}

			const targetElement =
				sidePanelElement.querySelector<HTMLElement>(querySelector);

			if (!targetElement) {
				console.warn(`Element with querySelector '${querySelector}' not found`);
				return;
			}

			targetElement.scrollIntoView({
				behavior: "smooth",
			});
		},
		[sidePanelRef],
	);

	const navigateToFootnote = useCallback(
		(footnoteId: string) => {
			if (!panel.state.isOpen || !panel.state.sections.footnotes) {
				panel.openSection("footnotes");
				setTimeout(() => {
					navigateToPanelTargetSelector(`#${footnoteId}`);
				}, 600);
				return;
			}
			return navigateToPanelTargetSelector(`#${footnoteId}`);
		},
		[navigateToPanelTargetSelector, panel],
	);

	const navigateToDocumentRef = useCallback(
		(id: string) => {
			return navigateToBodyTargetSelector(`[data-id='${id}']`);
		},
		[navigateToBodyTargetSelector],
	);

	const value = useMemo(
		() => ({
			navigateToHeading,
			navigateToFootnote,
			navigateToDocumentRef,
		}),
		[navigateToHeading, navigateToFootnote, navigateToDocumentRef],
	);

	return (
		<DocumentNavigationContext.Provider value={value}>
			{children}
		</DocumentNavigationContext.Provider>
	);
}
