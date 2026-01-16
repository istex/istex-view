import { Typography } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import Temml from "temml";
import { DebugTag } from "../debug/DebugTag";
import { findTagByName } from "../helper/findTagByName";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function TexFormula({ data }: ComponentProps) {
	const texContainerRef = useRef<HTMLSpanElement | null>(null);

	const texFormula = useMemo(() => {
		return Array.isArray(data.value)
			? (findTagByName(data.value, "#text")?.value as string)
			: null;
	}, [data.value]);

	useEffect(() => {
		if (!texContainerRef.current || !texFormula) {
			return;
		}

		Temml.render(texFormula, texContainerRef.current);
	}, [texFormula]);

	if (!texFormula) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				payload={data}
				message={`No TEX found inside <formula> tag`}
			/>
		);
	}

	return <Typography component="span" role="figure" ref={texContainerRef} />;
}

export function FormulaNotation({ data }: ComponentProps) {
	const notation = data.attributes?.["@notation"];

	switch (notation) {
		case "latex":
		case "tex": {
			return <TexFormula data={data} />;
		}

		default:
			return (
				<DebugTag
					tag={data.tag}
					attributes={data.attributes}
					payload={data}
					message={`Unsupported notation attribute (${notation}) on <formula> tag`}
				/>
			);
	}
}

function FormulaRend({ data }: ComponentProps) {
	const rend = data.attributes?.["@rend"];
	switch (rend) {
		case "display":
			return (
				<Typography component="span" role="figure">
					<Value data={data.value} />
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

const FORMULA_SUPPORTED_NOTATIONS = ["mathml", "none"];
const FORMULA_SUPPORTED_RENDS = ["inline"];

export function Formula({ data }: ComponentProps) {
	const notation = data.attributes?.["@notation"];
	const rend = data.attributes?.["@rend"];

	if (notation && !FORMULA_SUPPORTED_NOTATIONS.includes(notation)) {
		return <FormulaNotation data={data} />;
	}

	if (rend && !FORMULA_SUPPORTED_RENDS.includes(rend)) {
		return <FormulaRend data={data} />;
	}

	return (
		<Typography component="span" role="figure">
			<Value data={data.value} />
		</Typography>
	);
}
