import { Link } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../navigation/useNavigateToSection";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function FootNoteRef({ data: { value, attributes } }: ComponentProps) {
	const { navigateToFootnote } = useDocumentNavigation();

	const n = useMemo(() => {
		const nValues = attributes?.["@n"]?.split(" ") ?? [];
		if (nValues.length > 1) {
			console.warn(
				"Multiple n attributes found for footnote reference, only the first one will be used",
				{ attributes },
			);
		}
		return nValues[0];
	}, [attributes]);

	if (!n) {
		console.warn("No n attribute found for footnote reference", {
			attributes,
			value,
		});
		return <Value data={value} />;
	}
	return (
		<Link
			data-fn-id={n}
			component="button"
			onClick={() => {
				if (!n) {
					console.warn("No n attribute found for footnote reference");
					return;
				}
				navigateToFootnote(n);
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
