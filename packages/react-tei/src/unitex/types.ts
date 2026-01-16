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
