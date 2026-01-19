import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import { orange, red } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IS_DEBUG } from "./debug.const";

export function DebugTag({
	tag,
	attributes,
	message,
	children,
	payload,
	inline = false,
	type = "warning",
}: InlineDebugProps) {
	if (!IS_DEBUG) {
		return children;
	}

	const renderedTag = `<${tag}${
		attributes
			? " " +
				Object.entries(attributes)
					.map(([key, value]) => `${key}="${value}"`)
					.join(" ")
			: ""
	}>`;

	const Icon = type === "error" ? ErrorIcon : WarningIcon;

	return (
		<Box
			component="span"
			sx={{
				display: inline ? "inline-flex" : "flex",
				flexDirection: inline ? "row" : "column",
				border: `1px dashed ${type === "error" ? red[700] : orange[500]}`,
				color: type === "error" ? red[700] : orange[700],
				padding: 0.5,
			}}
			className="debug"
		>
			<Stack component="span" direction="row" gap={1}>
				<Tooltip
					title={`${message}${payload ? " (Click icon to see payload in console warnings)" : ""}`}
					placement="top"
				>
					<Icon
						sx={{
							cursor: payload ? "pointer" : "default",
						}}
						onClick={() => payload && console.error(message, payload)}
					/>
				</Tooltip>

				<Tooltip title={renderedTag} placement="top">
					<Typography component="span" fontWeight="bold">
						&lt;{tag}&gt;
					</Typography>
				</Tooltip>
			</Stack>
			{children}
		</Box>
	);
}

type InlineDebugProps = {
	tag: string;
	attributes?: Record<string, string | undefined>;
	message: string;
	payload?: unknown;
	inline?: boolean;
	type?: "error" | "warning";
	children?: React.ReactNode;
};
