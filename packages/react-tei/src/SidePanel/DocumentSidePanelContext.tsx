import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from "react";
import {
	MULTICAT_SECTIONS,
	TERM_ENRICHMENT_SECTIONS,
	useSidePanelEnrichments,
} from "./useSidePanelEnrichments";

export type PanelTab = "metadata" | "enrichment";

export type PanelState = {
	isOpen: boolean;
	currentTab: PanelTab;
	sections: {
		keywords: boolean;
		source: boolean;
		footnotes: boolean;
		bibliographicReferences?: boolean;
		documentIdentifier?: boolean;

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
	};
};

export type DocumentSidePanelContextType = {
	state: PanelState;
	enrichmentCount: number;
	topOffset?: number;
	selectTab: (tab: PanelTab) => void;
	togglePanel: () => void;
	toggleSection: (section: keyof PanelState["sections"]) => void;
	openSection: (section: keyof PanelState["sections"]) => void;
};

export type PanelSection = keyof PanelState["sections"];

export type PanelAction =
	| { type: "SELECT_TAB"; tab: PanelTab }
	| { type: "TOGGLE_PANEL" }
	| { type: "TOGGLE_SECTION"; section: keyof PanelState["sections"] }
	| { type: "OPEN_SECTION"; section: keyof PanelState["sections"] };

export const TAB_METADATA: PanelTab = "metadata";
export const TAB_ENRICHMENT: PanelTab = "enrichment";

const TAB_METADATA_SECTIONS: PanelSection[] = [
	"keywords",
	"source",
	"footnotes",
	"bibliographicReferences",
	"documentIdentifier",
];

export const initialPanelState: PanelState = {
	isOpen: true,
	currentTab: TAB_ENRICHMENT,
	sections: {
		keywords: true,
		source: true,
		footnotes: true,
		bibliographicReferences: true,
		documentIdentifier: true,

		...TERM_ENRICHMENT_SECTIONS.reduce(
			(acc, section) => {
				acc[`termEnrichment_${section}`] = false;
				return acc;
			},
			{} as Partial<PanelState["sections"]>,
		),

		...MULTICAT_SECTIONS.reduce(
			(acc, section) => {
				acc[`multicat_${section}`] = false;
				return acc;
			},
			{} as Partial<PanelState["sections"]>,
		),
	},
};

export const DocumentSidePanelContext = createContext<
	DocumentSidePanelContextType | undefined
>(undefined);

export function DocumentSidePanelContextProvider({
	topOffset,
	children,
}: {
	topOffset?: number;
	children: React.ReactNode;
}) {
	const { enrichmentCount, openEnrichment } = useSidePanelEnrichments();

	const [panelState, dispatchPanelAction] = useReducer(
		(state: PanelState, action: PanelAction) => {
			switch (action.type) {
				case "SELECT_TAB":
					return { ...state, currentTab: action.tab };
				case "TOGGLE_PANEL":
					return { ...state, isOpen: !state.isOpen };
				case "TOGGLE_SECTION":
					return {
						...state,
						isOpen: !state.sections[action.section] ? true : state.isOpen,
						currentTab: TAB_METADATA_SECTIONS.includes(action.section)
							? TAB_METADATA
							: TAB_ENRICHMENT,
						sections: {
							...state.sections,
							[action.section]: !state.sections[action.section],
						},
					};
				case "OPEN_SECTION":
					return {
						...state,
						isOpen: true,
						currentTab: TAB_METADATA_SECTIONS.includes(action.section)
							? TAB_METADATA
							: TAB_ENRICHMENT,
						sections: {
							...state.sections,
							[action.section]: true,
						},
					};
				default:
					return state;
			}
		},
		{
			...initialPanelState,
			sections: {
				...initialPanelState.sections,
				...(openEnrichment ? { [openEnrichment]: true } : {}),
			},
			currentTab: enrichmentCount > 0 ? TAB_ENRICHMENT : TAB_METADATA,
		},
	);

	const selectTab = useCallback((tab: PanelTab) => {
		dispatchPanelAction({ type: "SELECT_TAB", tab });
	}, []);

	const togglePanel = useCallback(() => {
		dispatchPanelAction({ type: "TOGGLE_PANEL" });
	}, []);

	const toggleSection = useCallback((section: keyof PanelState["sections"]) => {
		dispatchPanelAction({ type: "TOGGLE_SECTION", section });
	}, []);

	const openSection = useCallback((section: keyof PanelState["sections"]) => {
		dispatchPanelAction({ type: "OPEN_SECTION", section });
	}, []);

	const value = useMemo(
		() => ({
			state: panelState,
			enrichmentCount,
			topOffset,
			selectTab,
			togglePanel,
			toggleSection,
			openSection,
		}),
		[
			panelState,
			enrichmentCount,
			topOffset,
			selectTab,
			togglePanel,
			toggleSection,
			openSection,
		],
	);

	return (
		<DocumentSidePanelContext.Provider value={value}>
			{children}
		</DocumentSidePanelContext.Provider>
	);
}

export function useDocumentSidePanelContext() {
	const context = useContext(DocumentSidePanelContext);
	if (!context) {
		throw new Error(
			"useDocumentSidePanelContext must be used within a DocumentSidePanelContextProvider",
		);
	}
	return context;
}
