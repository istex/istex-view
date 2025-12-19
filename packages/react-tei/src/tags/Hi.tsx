import { Typography } from "@mui/material";
import { type ReactNode, useCallback, useMemo } from "react";
import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function Hi({ data: { value, attributes } }: ComponentProps) {
	const rend = useMemo(
		() => (attributes?.["@rend"] ? attributes["@rend"].split(" ") : []),
		[attributes],
	);

	const renderFormat = useCallback(
		(format: string, children: React.ReactNode) => {
			switch (format) {
				case "italic":
					return <Typography component="em">{children}</Typography>;
				case "bold":
					return <Typography component="strong">{children}</Typography>;
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
								verticalAlign: "super",
								fontSize: "smaller",
								marginLeft: "-0.25em",
							}}
						>
							{children}
						</Typography>
					);
				case "subscript":
					return (
						<Typography
							component="sub"
							sx={{
								verticalAlign: "sub",
								fontSize: "smaller",
								marginLeft: "-0.25em",
							}}
						>
							{children}
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
							{children}
						</Typography>
					);
				default:
					return children;
			}
		},
		[],
	);

	const recursiveRender = useCallback(
		(rend: string[]): ReactNode => {
			const [format, ...rest] = rend;
			if (!format) {
				return <Value data={value} />;
			}

			return renderFormat(format, recursiveRender(rest));
		},
		[renderFormat, value],
	);

	return recursiveRender(rend);
}
