import { createContext, useEffect, useMemo, useState } from "react";
import { getReactRootElement } from "../navigation/DocumentNavigationContext";

export type FullScreenContextValue = {
	isFullScreen: boolean;
	toggleFullScreen: () => void;
};

export const FullScreenContext = createContext<FullScreenContextValue | null>(
	null,
);

function enableScroll() {
	getReactRootElement()?.style.setProperty("overflow-y", "auto");
}

function disableScroll() {
	getReactRootElement()?.style.setProperty("overflow-y", "hidden");
}

export function FullScreenContextProvider({
	children,
}: FullScreenContextProviderProps) {
	const [isFullScreen, setIsFullScreen] = useState(false);

	useEffect(() => {
		if (!isFullScreen) {
			return enableScroll();
		}

		disableScroll();
		return () => {
			enableScroll();
		};
	}, [isFullScreen]);

	const value = useMemo<FullScreenContextValue>(
		() => ({
			isFullScreen,
			toggleFullScreen() {
				setIsFullScreen((prev) => !prev);
			},
		}),
		[isFullScreen],
	);

	return (
		<FullScreenContext.Provider value={value}>
			{children}
		</FullScreenContext.Provider>
	);
}

export type FullScreenContextProviderProps = {
	children: React.ReactNode;
};
