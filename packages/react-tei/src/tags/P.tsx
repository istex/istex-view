/** biome-ignore-all lint/performance/noAccumulatingSpread: Array is not big */
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { removeEmptyTextValues } from "../helper/removeEmptyTextValues";
import type { DocumentJson } from "../parser/document";
import { InlineFigure } from "./figure/InlineFigure";
import { NoOp } from "./NoOp";
import { TagCatalogProvider, useTagCatalog } from "./TagCatalogProvider";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function groupConsecutiveNonTableValues(values: DocumentJson[]) {
	const cleanedValues = removeEmptyTextValues(values);

	return cleanedValues.reduce<DocumentJson[][]>((groupedValues, item) => {
		const lastGroup = groupedValues.at(-1);

		if (item.tag === "table") {
			if (lastGroup && lastGroup.length > 0 && lastGroup[0]?.tag !== "table") {
				return [...groupedValues, [item]];
			}
			return [...groupedValues, [item]];
		}

		if (!lastGroup || lastGroup[0]?.tag === "table") {
			return [...groupedValues, [item]];
		}

		return [...groupedValues.slice(0, -1), [...lastGroup, item]];
	}, []);
}

export function P({ data }: ComponentProps) {
	const tagCatalog = useTagCatalog();

	const inlineCatalog = useMemo(() => {
		return {
			...tagCatalog,
			p: NoOp, // Prevent nested <p> tags
			figure: InlineFigure,
		};
	}, [tagCatalog]);
	if (!Array.isArray(data.value)) {
		return (
			<Typography
				variant="body1"
				sx={{
					"& .debug": {
						display: "inline-flex",
						flexDirection: "row",
					},
				}}
			>
				<Value data={data.value} />
			</Typography>
		);
	}

	const groups = groupConsecutiveNonTableValues(data.value);

	return groups.map((group, index) => {
		if (group.length === 1 && group[0]?.tag === "table") {
			return (
				<TagCatalogProvider key={index} tagCatalog={inlineCatalog}>
					<Value data={group[0]} />
				</TagCatalogProvider>
			);
		}

		return (
			<TagCatalogProvider tagCatalog={inlineCatalog}>
				<Typography
					variant="body1"
					key={index}
					sx={{
						"& .debug": {
							display: "inline-flex",
							flexDirection: "row",
						},
					}}
				>
					{group.map((item, itemIndex) => (
						<Value key={itemIndex} data={item} />
					))}
				</Typography>
			</TagCatalogProvider>
		);
	});
}
