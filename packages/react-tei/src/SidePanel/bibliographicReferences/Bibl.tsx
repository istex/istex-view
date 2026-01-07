import { useMemo } from "react";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";
import { BiblLink } from "./BiblLink";

export const Bibl = ({ data }: ComponentProps) => {
	const { value } = data;

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
			<BiblLink data={data}>
				{nestedBibls.map((bibl, index) => (
					<div>
						<Value key={index} data={bibl.value} />
					</div>
				))}
			</BiblLink>
		);
	}

	return (
		<BiblLink data={data}>
			<Value data={value} />
		</BiblLink>
	);
};
