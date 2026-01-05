import { Link } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../navigation/useNavigateToSection";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const getTargetId = (
	attributes: { "@n"?: string; "@target"?: string } | undefined,
) => {
	if (!attributes) {
		return null;
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

	return getTargetId(attributes);
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

export function BibliographicReferenceRef({
	data: { value, attributes },
}: ComponentProps) {
	const { navigateToBibliographicReference } = useDocumentNavigation();

	const id = useMemo(() => getTargetId(attributes), [attributes]);

	if (!id) {
		console.warn("No target attribute found for bibliographic reference", {
			attributes,
			value,
		});
		return <Value data={value} />;
	}
	return (
		<Link
			data-bibref-id={id}
			component="button"
			onClick={() => {
				if (!id) {
					console.warn("No n attribute found for footnote reference");
					return;
				}
				navigateToBibliographicReference(id);
			}}
		>
			<Value data={value} />
		</Link>
	);
}

export function Ref({ data }: ComponentProps) {
	switch (data.attributes?.["@type"]) {
		case "bibr":
			return <BibliographicReferenceRef data={data} />;
		case "fn":
			return <FootNoteRef data={data} />;
		default:
			return <Value data={data.value} />;
	}
}
