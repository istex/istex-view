import { createContext, useMemo, useState } from "react";

export type FullScreenContextValue = {
	isFullScreen: boolean;
	enterFullScreen: () => void;
	exitFullScreen: () => void;
};

export const FullScreenContext = createContext<FullScreenContextValue | null>(
	null,
);

export function FullScreenContextProvider({
	children,
}: FullScreenContextProviderProps) {
	const [isFullScreen, setIsFullScreen] = useState(false);

	const value = useMemo<FullScreenContextValue>(
		() => ({
			isFullScreen,
			enterFullScreen() {
				setIsFullScreen(true);
			},
			exitFullScreen() {
				setIsFullScreen(false);
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
