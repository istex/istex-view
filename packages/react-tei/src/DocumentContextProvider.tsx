import { createContext, useContext, useReducer } from "react";
import type { DocumentJson } from "./parser/document.js";

export type PanelState = {
	isOpen: boolean;
	sections: {
		authors: boolean;
		keywords: boolean;
	};
};

export type PanelSection = keyof PanelState["sections"];

export type DocumentContextType = {
	jsonDocument: DocumentJson[];
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
}: {
	children: React.ReactNode;
	jsonDocument: DocumentJson[];
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
