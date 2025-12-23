import type { DocumentJson, DocumentJsonValue } from "../parser/document";
import { useTagCatalog } from "./TagCatalogProvider";

const IS_DEBUG_ENABLED = !!import.meta.env.DEBUG;

export function Value({ data }: ValueProps) {
	const tagCatalog = useTagCatalog();

	if (!data) {
		return null;
	}

	if (Array.isArray(data)) {
		return data.map((item, index) => <Value key={index} data={item} />);
	}

	if (typeof data === "string") {
		return data;
	}

	const { tag, attributes, value } = data as DocumentJson;

	const TagComponent = tagCatalog[tag];
	if (TagComponent) {
		return <TagComponent data={data} />;
	}

	if (!IS_DEBUG_ENABLED) {
		return null;
	}

	console.warn(`No component found for tag <${tag}>`, { attributes, value });

	if (!value) {
		return null;
	}

	if (typeof value === "string") {
		return value;
	}

	return value.map((data) => <Value data={data} />);
}

type ValueProps = {
	data: DocumentJson | DocumentJsonValue;
};
