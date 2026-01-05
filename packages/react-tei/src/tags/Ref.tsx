import { Link } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../navigation/useNavigateToSection";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const getNoteRefId = (
	attributes: { "@n"?: string; "@target"?: string } | undefined,
) => {
	if (!attributes) {
		return null;
	}
	if (attributes["@n"]) {
		const nValues = attributes["@n"].split(" ");
		if (nValues.length > 1) {
			console.warn(
				"Multiple n attributes found for footnote reference, only the first one will be used",
				{ attributes },
			);
		}
		return nValues[0];
	}

	if (attributes["@target"]) {
		const targetValues = attributes["@target"].split(" ");
		if (targetValues.length > 1) {
			console.warn(
				"Multiple target attributes found for footnote reference, only the first one will be used",
				{ attributes },
			);
		}
		return targetValues[0]?.replace(/^#/, "");
	}

	return null;
};

export function FootNoteRef({ data: { value, attributes } }: ComponentProps) {
	const { navigateToFootnote } = useDocumentNavigation();

	const noteId = useMemo(() => getNoteRefId(attributes), [attributes]);

	if (!noteId) {
		console.warn("No n nor target attribute found for footnote reference", {
			attributes,
			value,
		});
		return <Value data={value} />;
	}
	return (
		<Link
			data-fn-id={noteId}
			component="button"
			onClick={() => {
				if (!noteId) {
					console.warn("No n attribute found for footnote reference");
					return;
				}
				navigateToFootnote(noteId);
			}}
		>
			<Value data={value} />
		</Link>
	);
}

export function Ref({ data }: ComponentProps) {
	if (data.attributes?.["@type"] === "fn") {
		return <FootNoteRef data={data} />;
	}
	return <Value data={data.value} />;
}
