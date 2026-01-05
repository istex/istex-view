import type { ComponentProps } from "../../tags/type";

export const DateTag = ({ data }: ComponentProps): string | null => {
	return data.attributes?.["@when"] || null;
};
