import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import type * as React from "react";
import { useTranslation } from "react-i18next";
import { FullScreenContextProvider } from "./FullScreenContext";
import { useFullScreenContext } from "./useFullScreenContext";

export function Switch({ children }: FullScreenProps) {
	const { t } = useTranslation();
	const { isFullScreen, exitFullScreen } = useFullScreenContext();

	const closeButtonLabel = t("fullScreen.exit");

	if (!isFullScreen) {
		return children;
	}
	return (
		<Dialog fullScreen open onClose={exitFullScreen}>
			<Tooltip title={closeButtonLabel}>
				<IconButton
					onClick={exitFullScreen}
					aria-label={closeButtonLabel}
					size="small"
					sx={{
						position: "fixed",
						top: 16,
						right: 16,
						backgroundColor: "background.paper",
					}}
				>
					<CloseFullscreenIcon />
				</IconButton>
			</Tooltip>
			<DialogContent>{children}</DialogContent>
		</Dialog>
	);
}

export function FullScreen(props: FullScreenProps) {
	return (
		<FullScreenContextProvider>
			<Switch {...props} />
		</FullScreenContextProvider>
	);
}

type FullScreenProps = {
	children: React.ReactNode;
};
