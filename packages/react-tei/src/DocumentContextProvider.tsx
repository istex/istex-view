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
import type { TermStatistic } from "./termEnrichment/parseUnitexEnrichment";
import type { TermCountByGroup } from "./termEnrichment/termCountRegistry";

export type JsonTermEnrichment = Partial<Record<string, TermStatistic[]>>;

export type DocumentContextType = {
	jsonDocument: DocumentJson[];
	termEnrichment?: {
		document: JsonTermEnrichment;
		termCountByGroup: TermCountByGroup;
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

type TermEnrichmentAction =
	| { type: "TOGGLE_BLOCK"; block: EnrichmentTermAnnotationBlockType }
	| {
			type: "TOGGLE_ANNOTATION";
			block: EnrichmentTermAnnotationBlockType;
			term: string;
	  };

export function DocumentContextProvider({
	children,
	jsonDocument,
	jsonUnitexEnrichment: initialJsonUnitexEnrichment,
	jsonTeeftEnrichment: initialJsonTeeftEnrichment,
	multicatEnrichment = [],
	termCountByGroup,
}: {
	children: React.ReactNode;
	jsonDocument: DocumentJson[];
	jsonUnitexEnrichment?: JsonTermEnrichment;
	jsonTeeftEnrichment?: TermStatistic[];
	multicatEnrichment?: MulticatCategory[];
	termCountByGroup?: TermCountByGroup;
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
			termEnrichment: jsonTermEnrichment
				? {
						document: jsonTermEnrichment,
						toggleBlock: toggleEnrichmentAnnotationBlock,
						toggleTerm: toggleEnrichmentAnnotation,
						termCountByGroup: termCountByGroup ?? {},
					}
				: undefined,
			multicatEnrichment,
		}),
		[
			jsonDocument,
			jsonTermEnrichment,
			multicatEnrichment,
			toggleEnrichmentAnnotationBlock,
			toggleEnrichmentAnnotation,
			termCountByGroup,
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
