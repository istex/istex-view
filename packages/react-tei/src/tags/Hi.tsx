import { Typography } from "@mui/material";
import { type ReactNode, useMemo } from "react";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

function RecursiveHi({
	rendList: [format, ...rest],
	children,
}: RecursiveHiProps): ReactNode {
	if (!format) {
		return children;
	}

	const recursiveChildren = (
		<RecursiveHi rendList={rest}>{children}</RecursiveHi>
	);

	switch (format) {
		case "italic":
			return <Typography component="em">{recursiveChildren}</Typography>;
		case "bold":
			return (
				<Typography
					component="strong"
					sx={{
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
						fontVariant: "small-caps",
					}}
				>
					{recursiveChildren}
				</Typography>
			);
		default:
			console.warn(`Unknown format: ${format}`);
			return recursiveChildren;
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
