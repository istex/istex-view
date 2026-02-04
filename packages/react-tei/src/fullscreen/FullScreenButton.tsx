import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { useFullScreenContext } from "./useFullScreenContext";

export function FullScreenButton() {
	const { t } = useTranslation();
	const { isFullScreen, toggleFullScreen } = useFullScreenContext();

	const label = isFullScreen ? t("fullScreen.exit") : t("fullScreen.enter");
	return (
		<Tooltip title={label}>
			<IconButton
				color="primary"
				onClick={toggleFullScreen}
				aria-label={label}
				size="small"
			>
				{isFullScreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
			</IconButton>
		</Tooltip>
	);
}
