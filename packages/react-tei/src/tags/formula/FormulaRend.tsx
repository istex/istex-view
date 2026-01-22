import { Typography } from "@mui/material";
import { useMemo } from "react";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FormulaRend({ data }: ComponentProps) {
	const rend = data.attributes?.["@rend"];

	// If formula contains multiple formula type (mathml, latex, or graphic), we only render one of them based on priority mathml > latex > graphic
	// If none found, we keep the value as is
	const value = useMemo(() => {
		if (!Array.isArray(data.value)) {
			return [];
		}

		const mathmlFigure = data.value.find((child) => {
			return (
				child.tag === "formula" &&
				((!child.attributes?.["@notation"] && !child.attributes?.["@rend"]) ||
					child.attributes?.["@notation"] === "mathml")
			);
		});

		if (mathmlFigure) {
			return [mathmlFigure];
		}

		const latexFigure = data.value.find((child) => {
			return (
				child.tag === "formula" && child.attributes?.["@notation"] === "tex"
			);
		});

		if (latexFigure) {
			return [latexFigure];
		}

		const graphic = data.value.find((child) => {
			return child.tag === "graphic";
		});

		if (graphic) {
			return [graphic];
		}

		return data.value;
	}, [data]);

	switch (rend) {
		case "display":
			return (
				<Typography component="div" role="figure">
					<Value data={value} />
				</Typography>
			);
		case "inline":
			return (
				<Typography component="span" role="figure">
					<Value data={value} />
				</Typography>
			);
		default:
			return (
				<DebugTag
					tag={data.tag}
					attributes={data.attributes}
					payload={data}
					message="Unsupported rend attribute on <formula> tag"
				/>
			);
	}
}
