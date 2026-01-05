import { ListItem } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type { DocumentJson } from "../../parser/document";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const getTagOrder = (tag: DocumentJson): number => {
	switch (tag.tag) {
		case "title":
			if (tag.attributes?.["@level"] === "a") {
				// article title
				return 1;
			} else {
				// source title
				return 4;
			}
		case "author":
			return 2;
		case "date":
			return 3;
		case "biblScope": {
			switch (tag.attributes?.["@unit"]) {
				case "vol":
					return 5;
				case "page":
					return tag.attributes?.["@from"] ? 6 : 7;
				default:
					console.warn("Unknown @unit for biblScope:", tag);
					return 8;
			}
		}
		case "publisher":
			return 9;
		default:
			return 99;
	}
};

export const BiblValue = ({ data: { value } }: ComponentProps) => {
	const orderedValues = useMemo(() => {
		if (!Array.isArray(value)) {
			return [];
		}
		return value.filter((item) => item.tag !== "#text");
	}, [value]).sort((a, b) => {
		return getTagOrder(a) - getTagOrder(b);
	});

	return (
		<div>
			{orderedValues.flatMap((element, index, array) => {
				if (
					element.tag === "biblScope" &&
					element.attributes?.["@unit"] === "page"
				) {
					const nextElement = array[index + 1];
					if (
						nextElement &&
						nextElement.tag === "biblScope" &&
						nextElement.attributes?.["@unit"] === "page"
					) {
						return [<Value data={element} />, "-"];
					}
				}

				return index < array.length - 1
					? [<Value data={element} />, ", "]
					: [<Value data={element} />];
			})}
		</div>
	);
};

export const Bibl = ({ data }: ComponentProps) => {
	const { navigateToBibliographicReferenceRef } = useDocumentNavigation();
	const { attributes, value } = data;
	const cleanedValues = useMemo(() => {
		if (!Array.isArray(value)) {
			return [];
		}
		return value.filter((item) => item.tag !== "#text");
	}, [value]).sort((a, b) => {
		const aIndex = getTagOrder(a);
		const bIndex = getTagOrder(b);
		return aIndex - bIndex;
	});

	const nestedBibls = useMemo(() => {
		return cleanedValues.filter((item) => item.tag === "bibl");
	}, [cleanedValues]);

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
				{nestedBibls.map((bibl, index) => (
					<div key={index}>
						<BiblValue data={bibl} />
					</div>
				))}
			</ListItem>
		);
	}

	return (
		<ListItem
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
			<BiblValue data={data} />
		</ListItem>
	);
};
