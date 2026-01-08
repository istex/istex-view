import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from "react";
import type { DocumentJson } from "./parser/document";
import type { UnitexAnnotationBlockType } from "./SidePanel/unitex/unitexAnnotationBlocks";
import type { TermStatistic } from "./unitex/parseUnitexEnrichment";

export type PanelState = {
	isOpen: boolean;
	sections: {
		authors: boolean;
		keywords: boolean;
		source: boolean;
		footnotes: boolean;
		bibliographicReferences?: boolean;

		unitext_date?: boolean;
		unitext_orgName?: boolean;
		unitext_persName?: boolean;
		unitext_placeName?: boolean;
		unitext_geogName?: boolean;
	};
};

export type PanelSection = keyof PanelState["sections"];

export type JsonUnitexEnrichment = Partial<Record<string, TermStatistic[]>>;

export type DocumentContextType = {
	jsonDocument: DocumentJson[];
	panel: {
		state: PanelState;
		togglePanel: () => void;
		toggleSection: (section: keyof PanelState["sections"]) => void;
	};
	unitexEnrichment?: {
		document: JsonUnitexEnrichment;
		toggleBlock: (block: UnitexAnnotationBlockType) => void;
		toggleTerm: (block: UnitexAnnotationBlockType, term: string) => void;
	};
};

export const DocumentContext = createContext<DocumentContextType | undefined>(
	undefined,
);

type PanelAction =
	| { type: "TOGGLE_PANEL" }
	| { type: "TOGGLE_SECTION"; section: keyof PanelState["sections"] };

type UnitexEnrichmentAction =
	| { type: "TOGGLE_BLOCK"; block: UnitexAnnotationBlockType }
	| {
			type: "TOGGLE_ANNOTATION";
			block: UnitexAnnotationBlockType;
			term: string;
	  };

export function DocumentContextProvider({
	children,
	jsonDocument,
	jsonUnitexEnrichment: initialJsonUnitexEnrichment,
}: {
	children: React.ReactNode;
	jsonDocument: DocumentJson[];
	jsonUnitexEnrichment?: JsonUnitexEnrichment;
}) {
	const [panelState, dispatchPanelAction] = useReducer(
		(state: PanelState, action: PanelAction) => {
			switch (action.type) {
				case "TOGGLE_PANEL":
					return { ...state, isOpen: !state.isOpen };
				case "TOGGLE_SECTION":
					return {
						...state,
						isOpen: !state.sections[action.section] ? true : state.isOpen,
						sections: {
							...state.sections,
							[action.section]: !state.sections[action.section],
						},
					};
				default:
					return state;
			}
		},
		{
			isOpen: true,
			sections: {
				authors: true,
				keywords: true,
				source: true,
				footnotes: true,
				bibliographicReferences: true,
				unitext_date: true,
				unitext_orgName: true,
				unitext_persName: true,
				unitext_placeName: true,
				unitext_geogName: true,
			},
		} satisfies PanelState,
	);

	const togglePanel = useCallback(() => {
		dispatchPanelAction({ type: "TOGGLE_PANEL" });
	}, []);

	const toggleSection = useCallback((section: keyof PanelState["sections"]) => {
		dispatchPanelAction({ type: "TOGGLE_SECTION", section });
	}, []);

	const [jsonUnitexEnrichment, dispatchUnitexEnrichmentAction] = useReducer(
		(
			state: JsonUnitexEnrichment | undefined,
			action: UnitexEnrichmentAction,
		) => {
			if (!state) {
				return state;
			}

			switch (action.type) {
				case "TOGGLE_BLOCK": {
					const blockAnnotations = state[action.block] ?? [];
					if (blockAnnotations.length === 0) {
						return state;
					}
					const allDisplayed = blockAnnotations.every(
						(annotation) => annotation.displayed,
					);
					return {
						...state,
						[action.block]: blockAnnotations.map((annotation) => ({
							...annotation,
							displayed: !allDisplayed,
						})),
					};
				}
				case "TOGGLE_ANNOTATION": {
					const blockAnnotations = state[action.block] ?? [];
					return {
						...state,
						[action.block]: blockAnnotations.map((annotation) =>
							annotation.term === action.term
								? { ...annotation, displayed: !annotation.displayed }
								: annotation,
						),
					};
				}
				default:
					return state;
			}
		},
		initialJsonUnitexEnrichment,
	);

	const toggleUnitexAnnotationBlock = useCallback(
		(block: UnitexAnnotationBlockType) => {
			dispatchUnitexEnrichmentAction({
				type: "TOGGLE_BLOCK",
				block,
			});
		},
		[],
	);

	const toggleUnitexAnnotation = useCallback(
		(block: UnitexAnnotationBlockType, term: string) => {
			dispatchUnitexEnrichmentAction({
				type: "TOGGLE_ANNOTATION",
				block,
				term,
			});
		},
		[],
	);

	const contextValue = useMemo<DocumentContextType>(
		() => ({
			jsonDocument,
			panel: {
				state: panelState,
				togglePanel,
				toggleSection,
			},
			unitexEnrichment: jsonUnitexEnrichment
				? {
						document: jsonUnitexEnrichment,
						toggleBlock: toggleUnitexAnnotationBlock,
						toggleTerm: toggleUnitexAnnotation,
					}
				: undefined,
		}),
		[
			jsonDocument,
			jsonUnitexEnrichment,
			panelState,
			togglePanel,
			toggleSection,
			toggleUnitexAnnotationBlock,
			toggleUnitexAnnotation,
		],
	);

	return (
		<DocumentContext.Provider value={contextValue}>
			{children}
		</DocumentContext.Provider>
	);
}

export const useDocumentContext = () => {
	const context = useContext(DocumentContext);
	if (!context) {
		throw new Error(
			"useDocumentContext must be used within a DocumentContextProvider",
		);
	}
	return context;
};
