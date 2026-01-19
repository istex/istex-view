import { useContext } from "react";
import { FullScreenContext } from "./FullScreenContext";

export function useFullScreenContext() {
	const context = useContext(FullScreenContext);
	if (!context) {
		throw new Error(
			"useFullScreenContext must be used within a FullScreenContextProvider",
		);
	}

	return context;
}
