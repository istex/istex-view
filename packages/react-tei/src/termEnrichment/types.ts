import type { DocumentJson } from "../parser/document";

export type NormalizedTerm = {
	term: string;
	group: string;
	artificial?: boolean;
};

export type NestedTerm = {
	term: string;
	groups: string[];
	subTerms?: NestedTerm[];
	artificial?: boolean;
	sourceTerm?: string | null;
};

export type GroupedTerm = {
	term: string;
	groups: string[];
	artificial?: boolean;
};

export type TermWithPosition = {
	term: NestedTerm;
	start: number;
	end: number;
};

export type SubTermAtPosition = {
	subTerm: NestedTerm;
	start: number;
	end: number;
	fromTermGroups: string[];
};

export type TextTag = {
	tag: "#text";
	attributes?: Record<string, string>;
	value: string;
} & DocumentJson;

export type HighlightTag = {
	tag: "highlight";
	attributes: {
		groups: string[];
		term: string;
		noAnchor?: boolean;
	};
	value: (TextTag | HighlightTag)[];
} & DocumentJson;

export type HighlightedTextTag = {
	tag: "highlightedText";
	attributes?: Record<string, string>;
	value: (HighlightTag | TextTag)[];
} & DocumentJson;

export type TermData = {
	termRegex: RegExp;
	term: string;
	groups: string[];
	value?: (TextTag | HighlightTag)[] | string;
};
