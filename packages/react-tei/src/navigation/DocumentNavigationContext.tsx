import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
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

const HIGHLIGHT_CLASS = "tei-highlighted";
const HIGHLIGHT_GROUP_CLASS = `${HIGHLIGHT_CLASS}-group`;

function clearCurrentHighlight() {
	document.querySelectorAll(`.${HIGHLIGHT_GROUP_CLASS}`).forEach((el) => {
		el.classList.remove(HIGHLIGHT_GROUP_CLASS, HIGHLIGHT_CLASS);
	});
}

export function highlightGroup(
	elements: NodeListOf<HTMLElement>,
	currentElementIndex: number,
) {
	clearCurrentHighlight();

	const currentElement =
		elements.length > 0 ? elements[currentElementIndex] : undefined;
	if (!currentElement) {
		return;
	}

	window.requestAnimationFrame(() => {
		elements.forEach((el) => {
			el.classList.add(HIGHLIGHT_GROUP_CLASS);
		});
		currentElement.classList.add(HIGHLIGHT_CLASS);
	});
}

export function buildDataSelector(target: string, dataTarget: string): string {
	return target
		.split(" ")
		.map((t) => `[data-${dataTarget}-id~="${t}"]`)
		.join(", ");
}

export function DocumentNavigationContextProvider({
	documentRef,
	sidePanelRef,
	children,
}: DocumentNavigationContextProviderProps) {
	const { panel } = useDocumentContext();

	const [currentHeadingId, setCurrentHeadingId] = useState<string | null>(null);

	const currentSelectorRef = useRef<CurrentSelectorRef | null>(null);

	const navigateToTargetLoop = useCallback(
		(wrapperElement: HTMLElement, querySelector: string) => {
			const targetElements =
				wrapperElement.querySelectorAll<HTMLElement>(querySelector);

			if (!targetElements.length) {
				console.warn(`Element with querySelector '${querySelector}' not found`);
				return;
			}

			if (
				currentSelectorRef.current?.element !== wrapperElement ||
				currentSelectorRef.current?.selector !== querySelector
			) {
				currentSelectorRef.current = {
					element: wrapperElement,
					selector: querySelector,
					index: 0,
				};
			} else {
				currentSelectorRef.current.index =
					(currentSelectorRef.current.index + 1) % targetElements.length;
			}

			const index = currentSelectorRef.current.index;

			if (!targetElements[index]) {
				console.error(
					`Target element with querySelector '${querySelector}' and index '${index}' not found`,
				);
				return;
			}

			targetElements[index].scrollIntoView({
				behavior: "smooth",
			});

			highlightGroup(targetElements, index);
		},
		[],
	);

	const navigateToBodyTargetSelector = useCallback(
		(querySelector: string) => {
			const documentElement = documentRef.current;

			if (!documentElement) {
				console.error("Document element not found");
				return;
			}

			navigateToTargetLoop(documentElement, querySelector);
		},
		[documentRef, navigateToTargetLoop],
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

			navigateToTargetLoop(sidePanelElement, querySelector);
		},
		[sidePanelRef, navigateToTargetLoop],
	);

	const navigateToFootnote = useCallback(
		(n: string) => {
			const selector = buildDataSelector(n, "fn");

			if (!panel.state.isOpen || !panel.state.sections.footnotes) {
				panel.toggleSection("footnotes");
				setTimeout(() => {
					navigateToPanelTargetSelector(selector);
				}, 600);
				return;
			}
			return navigateToPanelTargetSelector(selector);
		},
		[navigateToPanelTargetSelector, panel],
	);

	const navigateToBibliographicReference = useCallback(
		(id: string) => {
			const selector = buildDataSelector(id, "bibref");

			if (
				!panel.state.isOpen ||
				!panel.state.sections.bibliographicReferences
			) {
				panel.toggleSection("bibliographicReferences");
				setTimeout(() => {
					navigateToPanelTargetSelector(selector);
				}, 600);
				return;
			}
			return navigateToPanelTargetSelector(selector);
		},
		[navigateToPanelTargetSelector, panel],
	);

	const navigateToFootnoteRef = useCallback(
		(id: string) => {
			return navigateToBodyTargetSelector(buildDataSelector(id, "fn"));
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
					.at(-1);

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
				threshold: 0.01,
			},
		);

		documentRef.current
			.querySelectorAll<HTMLElement>(
				"#document-content section[aria-labelledby] :is(h2, h3, h4, h5, h6)",
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
			return navigateToBodyTargetSelector(buildDataSelector(id, "bibref"));
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

type CurrentSelectorRef = {
	element: HTMLElement;
	selector: string;
	index: number;
};
