import { Link } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../navigation/useNavigateToSection";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const getTargetId = (
	attributes: { ["@target"]?: string; ["@n"]?: string } | undefined,
) => {
	if (!attributes) {
		return null;
	}
	if (attributes["@target"]) {
		return attributes["@target"]?.replace(/^#/, "");
	}
	if (attributes?.["@n"]) {
		return `n-${attributes["@n"]}`;
	}

	return null;
};
export function Ref({ data: { value, attributes } }: ComponentProps) {
	const id = useMemo(() => getTargetId(attributes), [attributes]);

	const { navigateToFootnote } = useDocumentNavigation();

	if (attributes?.["@type"] === "fn") {
		return (
			<Link
				data-id={id}
				component="button"
				onClick={() => {
					if (!id) {
						console.warn("No target id found for footnote reference");
						return;
					}
					navigateToFootnote(id);
				}}
			>
				<Value data={value} />
			</Link>
		);
	}
	return <Value data={value} />;
}
