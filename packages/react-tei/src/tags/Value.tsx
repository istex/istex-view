import { DebugTag } from "../debug/DebugTag";
import { IS_DEBUG } from "../debug/debug.const";
import type { DocumentJson, DocumentJsonValue } from "../parser/document";
import { MathMLContextProvider } from "./formula/mathml/MathMLContext";
import { MathMLTag } from "./formula/mathml/MathMLTag";
import { useMathMLContext } from "./formula/mathml/useMathMLContext";
import { useTagCatalog } from "./TagCatalogProvider";

const MATHML_NAMESPACE_URL = "http://www.w3.org/1998/Math/MathML";

export function Value({ data }: ValueProps) {
	const tagCatalog = useTagCatalog();
	const mathMLNsPrefix = useMathMLContext();

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

	const mathMLNS = attributes
		? Object.keys(attributes).find(
				(key) =>
					key.startsWith("@xmlns:") && attributes[key] === MATHML_NAMESPACE_URL,
			)
		: null;

	if (mathMLNS) {
		return (
			<MathMLContextProvider nsPrefix={mathMLNS.replace("@xmlns:", "")}>
				<MathMLTag data={data} />
			</MathMLContextProvider>
		);
	} else if (tag.startsWith(`${mathMLNsPrefix}:`)) {
		return <MathMLTag data={data} />;
	}

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
