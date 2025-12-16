import type { DocumentJson, DocumentJsonValue } from "../parser/document.js";
import { tagCatalog } from "./tagCatalog.js";

export const DocumentTag = ({
	data,
	debug,
	depth = 1,
}: {
	data?: DocumentJsonValue;
	debug?: boolean;
	depth?: number;
}) => {
	if (!data) {
		return null;
	}

	if (Array.isArray(data)) {
		return data.map((item, index) => (
			<DocumentTag key={index} data={item} depth={depth} />
		));
	}

	if (typeof data === "string") {
		return data;
	}

	const { tag, value } = data as DocumentJson;
	if (tag === "#text") {
		return value as string;
	}

	const TagComponent = tagCatalog[tag];
	if (TagComponent) {
		return <TagComponent data={data} depth={depth} />;
	}

	if (["TEI", "text", "body"].includes(tag)) {
		if (!Array.isArray(value)) {
			return <DocumentTag data={value} depth={depth} />;
		}

		return value.map((value, index) => (
			<DocumentTag key={index} data={value} depth={depth} />
		));
	}

	if (!debug) {
		return null;
	}

	return <div>{JSON.stringify(data)}</div>;
};
