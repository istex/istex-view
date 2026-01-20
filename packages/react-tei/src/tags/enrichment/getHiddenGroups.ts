import type { JsonTermEnrichment } from "../../DocumentContextProvider";
import { kebabCasify } from "../../helper/kebabCasify";

export function getHiddenGroups({
	enrichmentGroups,
	term,
	groups,
	parentHiddenGroups,
}: getHiddenGroupsParams) {
	if (!term || !enrichmentGroups) {
		return [];
	}

	return groups.filter((group) => {
		const enrichmentTerms = enrichmentGroups[group] ?? [];
		const enrichmentTerm = enrichmentTerms.find(
			({ term: t }) => kebabCasify(t) === term,
		);

		// If no enrichment term found for this group, we consider it as displayed as it is a parent group
		if (!enrichmentTerm) {
			return parentHiddenGroups?.includes(group) ?? false;
		}

		return !enrichmentTerm.displayed;
	});
}

export type getHiddenGroupsParams = {
	enrichmentGroups: JsonTermEnrichment | undefined;
	term: string | undefined;
	groups: string[];
	parentHiddenGroups?: string[];
};
