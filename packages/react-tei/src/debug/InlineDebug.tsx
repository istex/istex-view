import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import { orange } from "@mui/material/colors";
import Tooltip from "@mui/material/Tooltip";
import { IS_DEBUG } from "./debug.const";

export function InlineDebug({ message, children, payload }: InlineDebugProps) {
	if (!IS_DEBUG) {
		return children;
	}

	return (
		<Tooltip
			title={`${message}${payload ? " (Click icon to see payload in console warnings)" : ""}`}
			placement="top"
		>
			<Box
				component="span"
				sx={{
					display: "flex",
					flexDirection: "column",
					border: `1px dashed ${orange[500]}`,
					color: orange[700],
					padding: 0.5,
				}}
				className="debug"
			>
				<WarningIcon
					sx={{
						cursor: payload ? "pointer" : "default",
					}}
					onClick={() => payload && console.warn(message, payload)}
				/>
				{children}
			</Box>
		</Tooltip>
	);
}

type InlineDebugProps = {
	message: string;
	payload?: unknown;
	children?: React.ReactNode;
};
