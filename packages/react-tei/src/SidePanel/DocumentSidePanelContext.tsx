import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from "react";

export type PanelState = {
	isOpen: boolean;
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

		teeft?: boolean;
	};
};

export type DocumentSidePanelContextType = {
	state: PanelState;
	togglePanel: () => void;
	toggleSection: (section: keyof PanelState["sections"]) => void;
	openSection: (section: keyof PanelState["sections"]) => void;
};

export type PanelSection = keyof PanelState["sections"];

export type PanelAction =
	| { type: "TOGGLE_PANEL" }
	| { type: "TOGGLE_SECTION"; section: keyof PanelState["sections"] }
	| { type: "OPEN_SECTION"; section: keyof PanelState["sections"] };

export const initialPanelState: PanelState = {
	isOpen: true,
	sections: {
		keywords: true,
		source: true,
		footnotes: true,
		bibliographicReferences: true,
		documentIdentifier: true,

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

export const DocumentSidePanelContext = createContext<
	DocumentSidePanelContextType | undefined
>(undefined);

export function DocumentSidePanelContextProvider({
	children,
}: {
	children: React.ReactNode;
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
				case "OPEN_SECTION":
					return {
						...state,
						isOpen: true,
						sections: {
							...state.sections,
							[action.section]: true,
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

	const openSection = useCallback((section: keyof PanelState["sections"]) => {
		dispatchPanelAction({ type: "OPEN_SECTION", section });
	}, []);

	const value = useMemo(
		() => ({
			state: panelState,
			togglePanel,
			toggleSection,
			openSection,
		}),
		[panelState, togglePanel, toggleSection, openSection],
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
