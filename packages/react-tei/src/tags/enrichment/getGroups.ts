export function getGroups(groups: string[] | string | undefined) {
	const groupsArray = typeof groups === "string" ? groups.split(" ") : groups;
	return ([] as string[]).concat(groupsArray ?? []);
}
