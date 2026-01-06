import { Link } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../navigation/useNavigateToSection";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const isURI = (value: string | null): value is string => {
	if (!value) {
		return false;
	}

	try {
		// Validate URL
		new URL(value);
		return true;
	} catch {
		return false;
	}
};

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

	if (attributes["@target"]) {
		return getTargetId(attributes);
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
			sx={{
				verticalAlign: "baseline",
				fontSize: "smaller",
				position: "relative",
				top: "-0.5em",
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

export function UriRef({ data }: ComponentProps) {
	const uri = useMemo(() => {
		if (data.attributes?.["@target"]) {
			return data.attributes?.["@target"];
		}

		if (typeof data.value === "string") {
			return data.value;
		}

		const textNode = Array.isArray(data.value)
			? data.value
					.filter((node): node is { tag: string; value: string } => {
						if (node.tag === "#text") {
							return typeof node.value === "string" && !!node.value?.trim();
						}

						return false;
					})
					.at(0)
			: null;

		const value = textNode?.value ?? null;
		if (!isURI(value)) {
			return null;
		}
		return value;
	}, [data]);

	if (!uri) {
		console.warn("No URI found for uri reference", { data });
		return <Value data={data.value} />;
	}

	return (
		<Link href={uri} target="_blank" rel="noopener noreferrer">
			<Value data={data.value} />
		</Link>
	);
}

export function RefFallback({ data }: ComponentProps) {
	const type = data.attributes?.["@type"] || null;
	const target = data.attributes?.["@target"] || null;

	if (!type && target?.startsWith("#")) {
		return <FootNoteRef data={data} />;
	}

	if (isURI(target)) {
		return <UriRef data={data} />;
	}
	return <Value data={data.value} />;
}

export function Ref({ data }: ComponentProps) {
	const type = data.attributes?.["@type"];

	switch (type) {
		case "bibr":
			return <BibliographicReferenceRef data={data} />;
		case "fn":
			return <FootNoteRef data={data} />;
		case "uri":
			return <UriRef data={data} />;
		default:
			return <RefFallback data={data} />;
	}
}
