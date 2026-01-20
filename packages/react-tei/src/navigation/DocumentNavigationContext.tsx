import { createContext, useCallback, useEffect, useMemo, useRef } from "react";
import {
	type PanelSection,
	useDocumentContext,
} from "../DocumentContextProvider";

export const DIRECTION_NEXT = "next";
export const DIRECTION_PREVIOUS = "previous";
export type Direction = typeof DIRECTION_NEXT | typeof DIRECTION_PREVIOUS;

export type DocumentNavigationContextValue = {
	navigateToBodyTargetSelector(
		querySelector: string,
		direction?: Direction,
	): void;
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
	tocRef: React.RefObject<HTMLDivElement | null>;
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

function scrollIntoViewIfNeeded(
	parentElement: HTMLElement,
	element: Element | null | undefined,
) {
	if (!element) {
		return;
	}

	const parentBoundingRect = parentElement.getBoundingClientRect();
	const elementBoundingRect = element.getBoundingClientRect();

	// Element is below or above the visible area
	if (
		elementBoundingRect.bottom > parentBoundingRect.height ||
		elementBoundingRect.top >= parentBoundingRect.top
	) {
		element.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	}
}

export function DocumentNavigationContextProvider({
	tocRef,
	documentRef,
	sidePanelRef,
	children,
}: DocumentNavigationContextProviderProps) {
	const { panel } = useDocumentContext();

	const currentSelectorRef = useRef<CurrentSelectorRef | null>(null);

	const navigateToTargetLoop = useCallback(
		(
			wrapperElement: HTMLElement,
			querySelector: string,
			direction: Direction = DIRECTION_NEXT,
		) => {
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
				const directionValue = direction === "next" ? 1 : -1;
				currentSelectorRef.current.index =
					(currentSelectorRef.current.index +
						directionValue +
						targetElements.length) %
					targetElements.length;
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
		(querySelector: string, direction: Direction = DIRECTION_NEXT) => {
			const documentElement = documentRef.current;

			if (!documentElement) {
				console.error("Document element not found");
				return;
			}

			navigateToTargetLoop(documentElement, querySelector, direction);
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
		async (section: PanelSection, querySelector: string) => {
			const sidePanelElement = sidePanelRef.current;

			if (!sidePanelElement) {
				console.error("Side panel element not found");
				return;
			}

			if (!panel.state.sections[section]) {
				panel.toggleSection(section);
				await new Promise((resolve) => setTimeout(resolve, 600));
			} else if (!panel.state.isOpen) {
				panel.togglePanel();
				await new Promise((resolve) => setTimeout(resolve, 600));
			}

			navigateToTargetLoop(sidePanelElement, querySelector);
		},
		[sidePanelRef, navigateToTargetLoop, panel],
	);

	const navigateToFootnote = useCallback(
		(n: string) => {
			navigateToPanelTargetSelector("footnotes", buildDataSelector(n, "fn"));
		},
		[navigateToPanelTargetSelector],
	);

	const navigateToBibliographicReference = useCallback(
		(id: string) => {
			return navigateToPanelTargetSelector(
				"bibliographicReferences",
				buildDataSelector(id, "bibref"),
			);
		},
		[navigateToPanelTargetSelector],
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

					if (!tocRef.current || !id) {
						return;
					}

					// This is an anti-pattern for react, but this improves performance a lot, especially on large documents by avoiding re-renders
					tocRef.current
						.querySelector("[aria-current]")
						?.removeAttribute("aria-current");

					const tocElement = tocRef.current.querySelector(
						`[data-navigate-to="${id}"]`,
					);

					tocElement?.setAttribute("aria-current", "true");
					scrollIntoViewIfNeeded(tocRef.current, tocElement);
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
	}, [documentRef, tocRef]);

	const navigateToBibliographicReferenceRef = useCallback(
		(id: string) => {
			return navigateToBodyTargetSelector(buildDataSelector(id, "bibref"));
		},
		[navigateToBodyTargetSelector],
	);

	const value = useMemo(
		() => ({
			navigateToBodyTargetSelector,
			navigateToHeading,
			navigateToFootnote,
			navigateToFootnoteRef,
			navigateToBibliographicReference,
			navigateToBibliographicReferenceRef,
		}),
		[
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
