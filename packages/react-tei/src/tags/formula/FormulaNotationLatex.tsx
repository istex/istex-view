import { useMemo } from "react";
import { DebugTag } from "../../debug/DebugTag";
import { findTagByName } from "../../helper/findTagByName";
import type { ComponentProps } from "../type";
import { MathJax } from "./MathJax";

export function FormulaNotationLatex({ data }: ComponentProps) {
	const id = data.attributes?.["@xml:id"];
	const { inline, latex } = useMemo(() => {
		const text = findTagByName(data, "#text")?.value as string | undefined;
		if (!text) {
			return {
				inline: true,
				latex: "",
			};
		}
		// Mathjax is not able to parse the `\hspace*` command properly (hspace with unbreakable space), so we replace it with `\hspace`
		const sanitizedText = text
			.replaceAll("hspace*", "hspace")
			.replaceAll("\\fl", "");

		if (sanitizedText.startsWith("\\begin") || sanitizedText.startsWith("$$")) {
			return {
				inline: false,
				latex: sanitizedText.replaceAll("$$", ""),
			};
		}

		return {
			inline: true,
			latex: sanitizedText.replaceAll(/^\$|\$$/g, ""),
		};
	}, [data]);
	if (!latex) {
		return (
			<DebugTag
				message="Latex formula with no text content"
				tag="formula"
				attributes={data.attributes}
				payload={data.value}
			/>
		);
	}

	return <MathJax id={id} inline={inline} latex={latex} />;
}
