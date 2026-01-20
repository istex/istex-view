export function areGroupsEqual(groups1: string[], groups2: string[]) {
	if (groups1.length !== groups2.length) {
		return false;
	}
	const sorted1 = groups1.toSorted();
	const sorted2 = groups2.toSorted();
	return sorted1.every((value, index) => value === sorted2[index]);
}
