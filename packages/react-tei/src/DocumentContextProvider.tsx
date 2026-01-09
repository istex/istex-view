import { createContext, useContext, useReducer } from "react";
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

export type DocumentContextType = {
	jsonDocument: DocumentJson[];
	jsonUnitexEnrichment?: Record<string, TermStatistic[]>;
	panel: {
		state: PanelState;
		togglePanel: () => void;
		toggleSection: (section: keyof PanelState["sections"]) => void;
	};
};

export const DocumentContext = createContext<DocumentContextType | undefined>(
	undefined,
);

type PanelAction =
	| { type: "TOGGLE_PANEL" }
	| { type: "TOGGLE_SECTION"; section: keyof PanelState["sections"] };

export function DocumentContextProvider({
	children,
	jsonDocument,
	jsonUnitexEnrichment,
}: {
	children: React.ReactNode;
	jsonDocument: DocumentJson[];
	jsonUnitexEnrichment?: Partial<
		Record<UnitexAnnotationBlockType, TermStatistic[]>
	>;
}) {
	const [panelState, dispatch] = useReducer(
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

	const togglePanel = () => {
		dispatch({ type: "TOGGLE_PANEL" });
	};

	const toggleSection = (section: keyof PanelState["sections"]) => {
		dispatch({ type: "TOGGLE_SECTION", section });
	};

	return (
		<DocumentContext.Provider
			value={{
				jsonDocument,
				jsonUnitexEnrichment,
				panel: {
					state: panelState,
					togglePanel,
					toggleSection,
				},
			}}
		>
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
