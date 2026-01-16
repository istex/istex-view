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
