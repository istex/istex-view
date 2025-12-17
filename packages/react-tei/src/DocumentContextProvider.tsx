import { createContext, useContext, useReducer } from "react";
import type { DocumentJson } from "./parser/document.js";

export type PanelState = {
	isOpen: boolean;
	sections: {
		authors: boolean;
	};
};

export type PanelSection = keyof PanelState["sections"];

export type DocumentContextType = {
	jsonDocument: DocumentJson[];
	panel: {
		state: PanelState;
		openPanel: () => void;
		closePanel: () => void;
		togglePanel: () => void;
		openSection: (section: keyof PanelState["sections"]) => void;
		closeSection: (section: keyof PanelState["sections"]) => void;
		toggleSection: (section: keyof PanelState["sections"]) => void;
	};
};

export const DocumentContext = createContext<DocumentContextType | undefined>(
	undefined,
);

type PanelAction =
	| { type: "OPEN_PANEL" }
	| { type: "CLOSE_PANEL" }
	| { type: "TOGGLE_PANEL" }
	| { type: "OPEN_SECTION"; section: keyof PanelState["sections"] }
	| { type: "CLOSE_SECTION"; section: keyof PanelState["sections"] }
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
				case "OPEN_PANEL":
					return { ...state, isOpen: true };
				case "CLOSE_PANEL":
					return { ...state, isOpen: false };
				case "TOGGLE_PANEL":
					return { ...state, isOpen: !state.isOpen };
				case "OPEN_SECTION":
					return {
						...state,
						sections: {
							...state.sections,
							[action.section]: true,
						},
					};
				case "CLOSE_SECTION":
					return {
						...state,
						sections: {
							...state.sections,
							[action.section]: false,
						},
					};
				case "TOGGLE_SECTION":
					return {
						...state,
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
			},
		} satisfies PanelState,
	);

	const openPanel = () => {
		dispatch({ type: "OPEN_PANEL" });
	};

	const closePanel = () => {
		dispatch({ type: "CLOSE_PANEL" });
	};

	const togglePanel = () => {
		dispatch({ type: "TOGGLE_PANEL" });
	};

	const openSection = (section: keyof PanelState["sections"]) => {
		dispatch({ type: "OPEN_SECTION", section });
	};

	const closeSection = (section: keyof PanelState["sections"]) => {
		dispatch({ type: "CLOSE_SECTION", section });
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
					openPanel,
					closePanel,
					togglePanel,
					openSection,
					closeSection,
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
