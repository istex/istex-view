import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useDocumentContext } from "../DocumentContextProvider";

export type DocumentNavigationContextValue = {
	currentHeadingId: string | null;
	navigateToBodyTargetSelector(querySelector: string): void;
	navigateToHeading(headingId: string): void;
	navigateToFootnote(footnoteId: string): void;
	navigateToFootnoteRef(id: string): void;
	navigateToBibliographicReference(id: string): void;
	navigateToBibliographicReferenceRef(id: string): void;
};

export const DocumentNavigationContext =
	createContext<DocumentNavigationContextValue | null>(null);

type DocumentNavigationContextProviderProps = {
	children: React.ReactNode;

	documentRef: React.RefObject<HTMLDivElement | null>;
	sidePanelRef: React.RefObject<HTMLDivElement | null>;
};

const HIGHLIGHT_CLASS = "highlighted";
const HIGHLIGHT_DELAY = 500;
const HIGHLIGHT_DURATION = 1500;
const PANEL_HIGHLIGHT_DURATION = 1000;

const HIGHLIGHT_GROUP_CLASS = "highlighted-group";

export function DocumentNavigationContextProvider({
	documentRef,
	sidePanelRef,
	children,
}: DocumentNavigationContextProviderProps) {
	const { panel } = useDocumentContext();

	const [currentHeadingId, setCurrentHeadingId] = useState<string | null>(null);

	const [currentSelector, setCurrentSelector] = useState<string>("");
	const [currentElementIndex, setCurrentElementIndex] = useState<number>(0);

	const clearCurrentHighlight = useCallback(() => {
		const documentElement = documentRef.current;

		if (!documentElement) {
			return;
		}

		documentElement.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
			el.classList.remove(HIGHLIGHT_CLASS);
		});

		documentElement
			.querySelectorAll(`.${HIGHLIGHT_GROUP_CLASS}`)
			.forEach((el) => {
				el.classList.remove(HIGHLIGHT_GROUP_CLASS);
			});
	}, [documentRef]);

	const highlightElement = useCallback(
		(element: HTMLElement, duration = HIGHLIGHT_DURATION) => {
			clearCurrentHighlight();

			setTimeout(() => {
				element.classList.add(HIGHLIGHT_CLASS);
				setTimeout(() => {
					element.classList.remove(HIGHLIGHT_CLASS);
				}, duration);
			}, HIGHLIGHT_DELAY);
		},
		[clearCurrentHighlight],
	);

	const highlightGroup = useCallback(
		(elements: NodeListOf<HTMLElement>, currentElementIndex: number) => {
			clearCurrentHighlight();

			const currentElement =
				elements.length > 0 ? elements[currentElementIndex] : undefined;
			if (!currentElement) {
				return;
			}

			if (elements.length === 1) {
				return highlightElement(currentElement);
			}

			window.requestAnimationFrame(() => {
				elements.forEach((el) => {
					el.classList.add(HIGHLIGHT_GROUP_CLASS);
				});
				currentElement.classList.add(HIGHLIGHT_CLASS);
			});
		},
		[clearCurrentHighlight, highlightElement],
	);

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
			const index =
				currentSelector !== querySelector
					? 0
					: (currentElementIndex + 1) % targetElements.length;

			setCurrentElementIndex(index);

			if (!targetElements[index]) {
				console.error(
					`Target element with querySelector '${querySelector}' and index '${currentElementIndex}' not found`,
				);
				return;
			}

			targetElements[index].scrollIntoView({
				behavior: "smooth",
			});

			highlightGroup(targetElements, index);
		},
		[documentRef, currentElementIndex, currentSelector, highlightGroup],
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

			highlightElement(targetElement, PANEL_HIGHLIGHT_DURATION);
		},
		[sidePanelRef, highlightElement],
	);

	const navigateToFootnote = useCallback(
		(n: string) => {
			if (!panel.state.isOpen || !panel.state.sections.footnotes) {
				panel.toggleSection("footnotes");
				setTimeout(() => {
					navigateToPanelTargetSelector(`[data-fn-id='${n}']`);
				}, 600);
				return;
			}
			return navigateToPanelTargetSelector(`[data-fn-id='${n}']`);
		},
		[navigateToPanelTargetSelector, panel],
	);

	const navigateToBibliographicReference = useCallback(
		(id: string) => {
			if (
				!panel.state.isOpen ||
				!panel.state.sections.bibliographicReferences
			) {
				panel.toggleSection("bibliographicReferences");
				setTimeout(() => {
					navigateToPanelTargetSelector(`[data-bibref-id='${id}']`);
				}, 600);
				return;
			}
			return navigateToPanelTargetSelector(`[data-bibref-id='${id}']`);
		},
		[navigateToPanelTargetSelector, panel],
	);

	const navigateToFootnoteRef = useCallback(
		(id: string) => {
			return navigateToBodyTargetSelector(`[data-fn-id='${id}']`);
		},
		[navigateToBodyTargetSelector],
	);

	useEffect(() => {
		if (!documentRef.current) {
			return;
		}

		const observer = new IntersectionObserver(
			(intersectingElements) => {
				if (!documentRef.current) {
					return;
				}

				const intersectingElement = intersectingElements
					.filter((e) => e.isIntersecting)
					.toSorted((a, b) => {
						return a.intersectionRatio - b.intersectionRatio;
					})
					.at(0);

				if (!intersectingElement) {
					return;
				}

				window.requestAnimationFrame(() => {
					const id =
						intersectingElement.target.nodeName === "SECTION"
							? intersectingElement.target.getAttribute("aria-labelledby")
							: intersectingElement.target.id;

					setCurrentHeadingId(id);
				});
			},
			{
				root: documentRef.current,
				threshold: 0,
			},
		);

		documentRef.current
			.querySelectorAll<HTMLElement>(
				"#document-content section[aria-labelledby]:has(> h2, > h3, > h4, > h5, > h6)",
			)
			.forEach((element) => {
				observer.observe(element);
			});

		return () => {
			observer.disconnect();
		};
	}, [documentRef]);

	const navigateToBibliographicReferenceRef = useCallback(
		(id: string) => {
			return navigateToBodyTargetSelector(`[data-bibref-id='${id}']`);
		},
		[navigateToBodyTargetSelector],
	);

	const value = useMemo(
		() => ({
			currentHeadingId,
			navigateToBodyTargetSelector,
			navigateToHeading,
			navigateToFootnote,
			navigateToFootnoteRef,
			navigateToBibliographicReference,
			navigateToBibliographicReferenceRef,
		}),
		[
			currentHeadingId,
			navigateToBodyTargetSelector,
			navigateToHeading,
			navigateToFootnote,
			navigateToFootnoteRef,
			navigateToBibliographicReference,
			navigateToBibliographicReferenceRef,
		],
	);

	return (
		<DocumentNavigationContext.Provider value={value}>
			{children}
		</DocumentNavigationContext.Provider>
	);
}
