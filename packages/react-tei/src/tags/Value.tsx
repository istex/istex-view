import { DebugTag } from "../debug/DebugTag";
import { IS_DEBUG } from "../debug/debug.const";
import type { DocumentJson, DocumentJsonValue } from "../parser/document";
import { useTagCatalog } from "./TagCatalogProvider";

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

	const { tag, value } = data as DocumentJson;

	const TagComponent = tagCatalog[tag];
	if (TagComponent) {
		return <TagComponent data={data} />;
	}

	if (!IS_DEBUG) {
		return null;
	}

	if (typeof value === "string") {
		return value;
	}

	return (
		<DebugTag
			tag={data.tag}
			attributes={data.attributes}
			message={`No value for tag <${tag}>`}
			payload={data}
			type="error"
		>
			{value?.map((data, index) => (
				<Value data={data} key={index} />
			))}
		</DebugTag>
	);
}

type ValueProps = {
	data: DocumentJson | DocumentJsonValue;
};
