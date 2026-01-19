import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { useFullScreenContext } from "./useFullScreenContext";

export function FullScreenButton() {
	const { t } = useTranslation();
	const { isFullScreen, enterFullScreen } = useFullScreenContext();

	const label = t("fullScreen.enter");

	if (isFullScreen) {
		return null;
	}

	return (
		<Tooltip title={label}>
			<IconButton
				color="primary"
				onClick={enterFullScreen}
				aria-label={label}
				size="small"
			>
				<OpenInFullIcon />
			</IconButton>
		</Tooltip>
	);
}
