import { DocumentTag } from "./DocumentTag.js";

export const Head = ({ data }: { data: string | Record<string, unknown> }) => {
	if (typeof data === "string") {
		return <h2>{data}</h2>;
	}

	return Object.entries(data).map(([key, value]) => (
		<DocumentTag key={key} name={key} data={value as Record<string, unknown>} />
	));
};
