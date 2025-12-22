import type { DocumentJson } from "../parser/document.js";
import { useTagCatalog } from "./TagCatalogProvider.js";

const IS_DEBUG_ENABLED = !!import.meta.env.DEBUG;

export type DocumentJsonValue = DocumentJson | DocumentJson[] | string | number;

export function Value({
	data,
	depth = 1,
}: {
	data?: DocumentJsonValue | undefined;
	depth?: number;
}) {
	const tagCatalog = useTagCatalog();

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

	const TagComponent = tagCatalog[tag];
	if (TagComponent) {
		return <TagComponent data={data} depth={depth} />;
	}

	if (!IS_DEBUG_ENABLED) {
		return null;
	}

	console.warn(`No component found for tag <${tag}>`, { attributes, value });

	if (!value) {
		return null;
	}

	if (typeof value === "string" || typeof value === "number") {
		return value;
	}

	return value.map((data) => <Value data={data} depth={depth} />);
}
