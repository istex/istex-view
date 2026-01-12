import { useMemo } from "react";
import { DebugTag } from "../../debug/DebugTag";
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
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message="Bibl value is not an array"
				payload={value}
			/>
		);
	}

	if (nestedBibls && nestedBibls.length > 0) {
		return (
			<>
				{nestedBibls.length !== cleanedValues.length && (
					<DebugTag
						tag={data.tag}
						attributes={data.attributes}
						message="Bibl contains mixed content with nested bibl and other content:"
						payload={value}
					/>
				)}
				<BiblLink data={data}>
					{nestedBibls.map((bibl, index) => (
						<div key={index}>
							<Value key={index} data={bibl.value} />
						</div>
					))}
				</BiblLink>
			</>
		);
	}

	return (
		<BiblLink data={data}>
			<Value data={value} />
		</BiblLink>
	);
};
