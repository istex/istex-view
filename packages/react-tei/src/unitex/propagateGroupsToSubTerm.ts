import type { NestedTerm } from "./types";

// Helper to propagate parent groups to a subTerm and its descendants
export const propagateGroupsToSubTerm = (
	subTerm: NestedTerm,
	parentGroups: string[],
): NestedTerm => {
	const combinedGroups = [...new Set([...parentGroups, ...subTerm.groups])];
	return {
		...subTerm,
		groups: combinedGroups,
		...(subTerm.subTerms && {
			subTerms: subTerm.subTerms.map((st) =>
				propagateGroupsToSubTerm(st, combinedGroups),
			),
		}),
	};
};
