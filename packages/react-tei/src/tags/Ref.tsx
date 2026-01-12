import { Link } from "@mui/material";
import { useMemo } from "react";
import { DebugTag } from "../debug/DebugTag";
import { useDocumentNavigation } from "../navigation/useNavigateToSection";
import { getTableId } from "./Table";
import { getTableNoteId } from "./TableNote";
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

export function FootNoteRef({
	data: { tag, value, attributes },
}: ComponentProps) {
	const { navigateToFootnote } = useDocumentNavigation();

	const noteId = useMemo(() => getNoteRefId(attributes), [attributes]);

	if (!noteId) {
		return (
			<DebugTag
				tag={tag}
				attributes={attributes}
				message="No n nor target attribute found for footnote reference"
				payload={{
					attributes,
					value,
				}}
			>
				<Value data={value} />
			</DebugTag>
		);
	}
	return (
		<Link
			data-fn-id={noteId}
			component="button"
			onClick={() => navigateToFootnote(noteId)}
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
	data: { tag, value, attributes },
}: ComponentProps) {
	const { navigateToBibliographicReference } = useDocumentNavigation();

	const id = useMemo(() => getTargetId(attributes), [attributes]);

	if (!id) {
		return (
			<DebugTag
				tag={tag}
				attributes={attributes}
				message="No target attribute found for bibliographic reference"
				payload={{
					attributes,
					value,
				}}
			>
				<Value data={value} />
			</DebugTag>
		);
	}
	return (
		<Link
			data-bibref-id={id}
			component="button"
			onClick={() => navigateToBibliographicReference(id)}
		>
			<Value data={value} />
		</Link>
	);
}

type ElementIdFn = (target: string | null | undefined) => string | undefined;

export function DocumentRef({
	data,
	elementIdFn,
}: ComponentProps & {
	elementIdFn: ElementIdFn;
}) {
	const { navigateToBodyTargetSelector } = useDocumentNavigation();

	const target = elementIdFn(
		data.attributes?.["@target"]?.replace(/^#/, "") ?? null,
	);

	if (!target) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message="No target attribute found for table reference"
				payload={data}
			>
				<Value data={data.value} />
			</DebugTag>
		);
	}

	return (
		<Link
			component="button"
			onClick={() => navigateToBodyTargetSelector(`#${target}`)}
			data-target={`#${target}`}
		>
			{<Value data={data.value} />}
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
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message="No URI found for uri reference"
				payload={data}
			>
				<Value data={data.value} />
			</DebugTag>
		);
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
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message="Ref tag with target attribute starting with # but no type attribute."
				payload={data}
			>
				<Value data={data.value} />
			</DebugTag>
		);
	}

	if (isURI(target)) {
		return <UriRef data={data} />;
	}
	return <Value data={data.value} />;
}

const tableIdFn: ElementIdFn = (target) => getTableId(target);
const tableFnIdFn: ElementIdFn = (target) => getTableNoteId(target);

export function Ref({ data }: ComponentProps) {
	const type = data.attributes?.["@type"];

	switch (type) {
		case "bibr":
			return <BibliographicReferenceRef data={data} />;
		case "fn":
			return <FootNoteRef data={data} />;
		case "url":
		case "uri":
			return <UriRef data={data} />;
		case "fig":
		case "figure":
			// Figure are not rendered so we do not displate anything for their references
			// TODO: implement figure reference once figure rendering is implemented
			return <Value data={data.value} />;
		case "table":
			return <DocumentRef data={data} elementIdFn={tableIdFn} />;
		case "table-fn":
			return <DocumentRef data={data} elementIdFn={tableFnIdFn} />;
		default:
			return <RefFallback data={data} />;
	}
}
