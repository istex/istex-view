import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from "react";
import type { DocumentJson } from "./parser/document";
import type { EnrichmentTermAnnotationBlockType } from "./SidePanel/enrichmentTerm/enrichmentTermAnnotationBlocks";
import type { MulticatCategory } from "./SidePanel/multicat/useParseMulticatCategories";
import type { TermStatistic } from "./unitex/parseUnitexEnrichment";

export type PanelState = {
	isOpen: boolean;
	sections: {
		authors: boolean;
		keywords: boolean;
		source: boolean;
		footnotes: boolean;
		bibliographicReferences?: boolean;

		termEnrichment_date?: boolean;
		termEnrichment_orgName?: boolean;
		termEnrichment_orgNameFunder?: boolean;
		termEnrichment_orgNameProvider?: boolean;
		termEnrichment_refBibl?: boolean;
		termEnrichment_refUrl?: boolean;
		termEnrichment_persName?: boolean;
		termEnrichment_placeName?: boolean;
		termEnrichment_geogName?: boolean;
		termEnrichment_teeft?: boolean;

		multicat_inist?: boolean;
		multicat_wos?: boolean;
		multicat_science_metrix?: boolean;
		multicat_scopus?: boolean;

		teeft?: boolean;
	};
};

export type PanelSection = keyof PanelState["sections"];

export type JsonTermEnrichment = Partial<Record<string, TermStatistic[]>>;

export type DocumentContextType = {
	jsonDocument: DocumentJson[];
	panel: {
		state: PanelState;
		togglePanel: () => void;
		toggleSection: (section: keyof PanelState["sections"]) => void;
	};
	termEnrichment?: {
		document: JsonTermEnrichment;
		toggleBlock: (block: EnrichmentTermAnnotationBlockType) => void;
		toggleTerm: (
			block: EnrichmentTermAnnotationBlockType,
			term: string,
		) => void;
	};
	multicatEnrichment: MulticatCategory[];
};

export const DocumentContext = createContext<DocumentContextType | undefined>(
	undefined,
);

type PanelAction =
	| { type: "TOGGLE_PANEL" }
	| { type: "TOGGLE_SECTION"; section: keyof PanelState["sections"] };

type TermEnrichmentAction =
	| { type: "TOGGLE_BLOCK"; block: EnrichmentTermAnnotationBlockType }
	| {
			type: "TOGGLE_ANNOTATION";
			block: EnrichmentTermAnnotationBlockType;
			term: string;
	  };

export const initialPanelState: PanelState = {
	isOpen: true,
	sections: {
		authors: true,
		keywords: true,
		source: true,
		footnotes: true,
		bibliographicReferences: true,

		termEnrichment_date: true,
		termEnrichment_orgName: true,
		termEnrichment_orgNameFunder: true,
		termEnrichment_orgNameProvider: true,
		termEnrichment_persName: true,
		termEnrichment_placeName: true,
		termEnrichment_geogName: true,
		termEnrichment_refBibl: true,
		termEnrichment_refUrl: true,
		termEnrichment_teeft: true,

		multicat_inist: true,
		multicat_wos: true,
		multicat_science_metrix: true,
		multicat_scopus: true,

		teeft: true,
	},
};

export function DocumentContextProvider({
	children,
	jsonDocument,
	jsonUnitexEnrichment: initialJsonUnitexEnrichment,
	jsonTeeftEnrichment: initialJsonTeeftEnrichment,
	multicatEnrichment = [],
}: {
	children: React.ReactNode;
	jsonDocument: DocumentJson[];
	jsonUnitexEnrichment?: JsonTermEnrichment;
	jsonTeeftEnrichment?: TermStatistic[];
	multicatEnrichment?: MulticatCategory[];
}) {
	const initialJsonTermEnrichment = useMemo(() => {
		if (!initialJsonUnitexEnrichment && !initialJsonTeeftEnrichment) {
			return undefined;
		}

		return {
			...initialJsonUnitexEnrichment,
			teeft: initialJsonTeeftEnrichment,
		};
	}, [initialJsonUnitexEnrichment, initialJsonTeeftEnrichment]);

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
		initialPanelState,
	);

	const togglePanel = useCallback(() => {
		dispatchPanelAction({ type: "TOGGLE_PANEL" });
	}, []);

	const toggleSection = useCallback((section: keyof PanelState["sections"]) => {
		dispatchPanelAction({ type: "TOGGLE_SECTION", section });
	}, []);

	const [jsonTermEnrichment, dispatchTermEnrichmentAction] = useReducer(
		(state: JsonTermEnrichment | undefined, action: TermEnrichmentAction) => {
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
		initialJsonTermEnrichment,
	);

	const toggleEnrichmentAnnotationBlock = useCallback(
		(block: EnrichmentTermAnnotationBlockType) => {
			dispatchTermEnrichmentAction({
				type: "TOGGLE_BLOCK",
				block,
			});
		},
		[],
	);

	const toggleEnrichmentAnnotation = useCallback(
		(block: EnrichmentTermAnnotationBlockType, term: string) => {
			dispatchTermEnrichmentAction({
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
			termEnrichment: jsonTermEnrichment
				? {
						document: jsonTermEnrichment,
						toggleBlock: toggleEnrichmentAnnotationBlock,
						toggleTerm: toggleEnrichmentAnnotation,
					}
				: undefined,
			multicatEnrichment,
		}),
		[
			jsonDocument,
			jsonTermEnrichment,
			multicatEnrichment,
			panelState,
			togglePanel,
			toggleSection,
			toggleEnrichmentAnnotationBlock,
			toggleEnrichmentAnnotation,
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
