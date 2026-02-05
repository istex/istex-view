import Box, { type BoxProps } from "@mui/material/Box";
import { useMemo } from "react";
import {
	SIDEPANEL_PADDING,
	SIDEPANEL_WIDTH,
} from "../SidePanel/DocumentSidePanel";
import { useDocumentSidePanelContext } from "../SidePanel/DocumentSidePanelContext";
import { FullScreenContextProvider } from "./FullScreenContext";
import { useFullScreenContext } from "./useFullScreenContext";

export function Switch({ children }: FullScreenProps) {
	const { isFullScreen } = useFullScreenContext();
	const {
		state: { isOpen },
		topOffset,
	} = useDocumentSidePanelContext();

	const fullScreenSx = useMemo<BoxProps["sx"]>(() => {
		if (!isFullScreen) {
			return {};
		}

		return {
			position: "fixed",
			top: topOffset ?? 0,
			left: 0,
			bottom: 0,
			right: {
				xs: 0,
				md: isOpen ? SIDEPANEL_WIDTH : SIDEPANEL_PADDING,
			},
			backgroundColor: "#fff",
			transition: "right 0.3s",
			zIndex: 9,
			paddingBlock: 2,
			paddingInline: {
				xs: 2,
				md: 4,
			},
			overflowY: "auto",
			borderRight: {
				xs: 0,
				md: `32px solid #f6f9fa`,
			},
		};
	}, [topOffset, isOpen, isFullScreen]);

	return (
		<Box sx={fullScreenSx} role={isFullScreen ? "dialog" : undefined}>
			{children}
		</Box>
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
