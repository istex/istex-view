import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import { useMemo } from "react";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const Bibl = ({ data }: ComponentProps) => {
	const { navigateToBibliographicReferenceRef } = useDocumentNavigation();
	const { attributes, value } = data;

	const cleanedValues = useMemo(() => {
		if (!Array.isArray(value)) {
			return [];
		}
		return value.filter((item) => item.tag !== "#text");
	}, [value]);

	const nestedBibls = useMemo(() => {
		if (!Array.isArray(value)) {
			return [];
		}
		return value.filter((item) => item.tag === "bibl");
	}, [value]);

	if (!Array.isArray(value)) {
		console.warn("Bibl value is not an array:", value);
		return null;
	}

	if (nestedBibls && nestedBibls.length > 0) {
		if (nestedBibls.length !== cleanedValues.length) {
			console.warn(
				"Bibl contains mixed content with nested bibl and other content:",
				value,
			);
		}

		return (
			<ListItem
				component={Link}
				role="button"
				href="#"
				data-bibref-id={attributes?.["@xml:id"] || undefined}
				onClick={(e) => {
					e.preventDefault();

					const referenceId = attributes?.["@xml:id"];
					if (!referenceId) {
						console.warn("No n attribute found for bibliographic reference");
						return;
					}
					navigateToBibliographicReferenceRef(referenceId);
				}}
				sx={{
					textDecoration: "underline",
					textDecorationColor: "var(--Link-underlineColor)",
					"& :hover": { textDecorationColor: "inherit" },
				}}
			>
				{nestedBibls.map((bibl, index) => (
					<div>
						<Value key={index} data={bibl.value} />
					</div>
				))}
			</ListItem>
		);
	}

	return (
		<ListItem
			component={Button}
			sx={{
				fontSize: "1rem",
			}}
			size="small"
			data-bibref-id={attributes?.["@xml:id"] || undefined}
			onClick={() => {
				const referenceId = attributes?.["@xml:id"];
				if (!referenceId) {
					console.warn("No n attribute found for bibliographic reference");
					return;
				}
				navigateToBibliographicReferenceRef(referenceId);
			}}
		>
			<Value data={value} />
		</ListItem>
	);
};
