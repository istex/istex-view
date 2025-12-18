import type { DocumentJson } from "../parser/document.js";
import { tagCatalog } from "./tagCatalog.js";

const IS_DEBUG_ENABLED = !!import.meta.env.DEBUG;

export function Value({
	data,
	depth = 1,
}: {
	data?: DocumentJson[] | DocumentJson | string | undefined;
	depth?: number;
}) {
	if (!data) {
		return null;
	}

	if (Array.isArray(data)) {
		return data.map((item, index) => (
			<Value key={index} data={item} depth={depth} />
		));
	}

	if (typeof data === "string" || typeof data === "number") {
		return data;
	}

	const { tag, attributes, value } = data as DocumentJson;
	if (tag === "#text") {
		return value as string;
	}

	const TagComponent = tagCatalog[tag];
	if (TagComponent) {
		return <TagComponent data={data} depth={depth} />;
	}

	if (!IS_DEBUG_ENABLED) {
		return null;
	}

	console.warn(`No component found for tag <${tag}>`, { attributes, value });

	if (typeof value === "string") {
		return value;
	}

	if (!value) {
		return null;
	}

	return value.map((data) => <Value data={data} depth={depth} />);
}
