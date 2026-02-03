import { Box } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { useMemo } from "react";
import { DebugTag } from "../../debug/DebugTag";
import { findTagByName } from "../../helper/findTagByName";
import type { ComponentProps } from "../type";

export function FormulaNotationLatex({ data }: ComponentProps) {
	const id = data.attributes?.["@xml:id"];
	const text = useMemo(() => {
		const text = findTagByName(data, "#text")?.value as string | undefined;
		if (!text) {
			return null;
		}
		// Mathjax is not able to parse the `\hspace*` command properly (hspace with unbreakable space), so we replace it with `\hspace`
		const sanitizedText = text.replaceAll("hspace*", "hspace");

		if (
			sanitizedText.startsWith("\\begin") ||
			(sanitizedText.startsWith("$$") && sanitizedText.endsWith("$$"))
		) {
			return sanitizedText;
		}

		if (sanitizedText.startsWith("$") && sanitizedText.endsWith("$")) {
			return `$${sanitizedText}$`;
		}

		return `$$${sanitizedText}$$`;
	}, [data]);
	if (!text) {
		return (
			<DebugTag
				message="Latex formula with no text content"
				tag="formula"
				attributes={data.attributes}
				payload={data.value}
			/>
		);
	}

	// block latex
	if (text.startsWith("\\begin{array")) {
		return (
			<Box
				id={id}
				sx={{
					width: "100%",
					maxWidth: "100%",
					overflowX: "auto",
					overflowY: "hidden",
				}}
			>
				<MathJax>{text}</MathJax>
			</Box>
		);
	}

	// inline latex
	return (
		<Box
			id={id}
			component="span"
			sx={{
				display: "inline-block",
			}}
		>
			<MathJax>{text}</MathJax>
		</Box>
	);
}
