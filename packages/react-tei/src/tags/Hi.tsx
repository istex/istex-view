import { Typography, type TypographyProps } from "@mui/material";
import { type ReactNode, useMemo } from "react";
import { DebugTag } from "../debug/DebugTag";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

function RecursiveHi({
	rendList: [format, ...rest],
	children,
}: RecursiveHiProps): ReactNode {
	if (!format) {
		return children;
	}

	const commonSx: TypographyProps["sx"] = {
		font: "inherit",
		fontFamily: "inherit",
		fontSize: "inherit",
		fontStyle: "inherit",
		fontVariant: "inherit",
		fontWeight: "inherit",
		lineHeight: "inherit",
		textDecoration: "inherit",
		verticalAlign: "inherit",
	};

	const recursiveChildren = (
		<RecursiveHi rendList={rest}>{children}</RecursiveHi>
	);

	switch (format) {
		case "italic":
			return (
				<Typography
					component="em"
					sx={{
						...commonSx,
						fontStyle: "italic",
					}}
				>
					{recursiveChildren}
				</Typography>
			);
		case "bold":
			return (
				<Typography
					component="strong"
					sx={{
						...commonSx,
						fontWeight: "bold",
					}}
				>
					{recursiveChildren}
				</Typography>
			);
		case "underline":
			return (
				<Typography
					component="u"
					sx={{
						...commonSx,
						textDecoration: "underline",
					}}
				>
					{children}
				</Typography>
			);
		case "superscript":
			return (
				<Typography
					component="sup"
					sx={{
						...commonSx,
						/* we use baseline and relative position to avoid line spacing issues */
						verticalAlign: "baseline",
						fontSize: "smaller",
						position: "relative",
						top: "-0.5em",
					}}
				>
					{recursiveChildren}
				</Typography>
			);
		case "subscript":
			return (
				<Typography
					component="sub"
					sx={{
						...commonSx,
						/* we use baseline and relative position to avoid line spacing issues */
						verticalAlign: "baseline",
						fontSize: "smaller",
						position: "relative",
						top: "0.33em",
					}}
				>
					{recursiveChildren}
				</Typography>
			);
		case "smallCaps":
			return (
				<Typography
					component="span"
					sx={{
						...commonSx,
						fontVariant: "small-caps",
					}}
				>
					{recursiveChildren}
				</Typography>
			);
		default:
			return (
				<DebugTag tag="hi" message={`Unknown format: ${format}`}>
					{recursiveChildren}
				</DebugTag>
			);
	}
}

type RecursiveHiProps = {
	rendList: string[];
	children: ReactNode;
};

export function Hi({ data: { value, attributes } }: ComponentProps) {
	const rendList = useMemo(
		() => (attributes?.["@rend"] ? attributes["@rend"].split(" ") : []),
		[attributes],
	);

	return (
		<RecursiveHi rendList={rendList}>
			<Value data={value} />
		</RecursiveHi>
	);
}
