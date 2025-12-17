/** biome-ignore-all lint/performance/noAccumulatingSpread: Array is not big */
import Typography from "@mui/material/Typography";

import type { DocumentJson } from "../parser/document.js";
import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function groupValuesWitoutTable(values: DocumentJson[]) {
	return values.reduce<DocumentJson[][]>((groupedValues, item) => {
		if (item.tag === "table") {
			const lastGroup = groupedValues[groupedValues.length - 1];
			if (lastGroup && lastGroup.length > 0 && lastGroup[0]?.tag !== "table") {
				return [...groupedValues, [item]];
			}
			return [...groupedValues, [item]];
		}

		if (typeof item.value === "string" && item.value.trim() === "") {
			return groupedValues;
		}

		const lastGroup = groupedValues[groupedValues.length - 1];
		if (!lastGroup || lastGroup[0]?.tag === "table") {
			return [...groupedValues, [item]];
		}

		return [...groupedValues.slice(0, -1), [...lastGroup, item]];
	}, []);
}

export function P({ data }: ComponentProps) {
	if (!Array.isArray(data.value)) {
		return (
			<Typography variant="body1">
				<Value data={data.value} />
			</Typography>
		);
	}

	const groups = groupValuesWitoutTable(data.value);

	return groups.map((group, index) => {
		if (group.length === 1 && group[0]?.tag === "table") {
			return <Value key={index} data={group[0]} />;
		}

		return (
			<Typography variant="body1" key={index}>
				{group.map((item, itemIndex) => (
					<Value key={itemIndex} data={item} />
				))}
			</Typography>
		);
	});
}
