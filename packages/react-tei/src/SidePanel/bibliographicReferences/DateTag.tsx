import type { ComponentProps } from "../../tags/type";

export const DateTag = ({ data }: ComponentProps): string | null => {
	if (!data.attributes?.["@when"]) {
		console.warn("Date tag missing @when attribute:", data);
		return null;
	}
	return data.attributes["@when"];
};
