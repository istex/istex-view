import { use } from "react";
import { MathJaxContext } from "./MathJaxContext";

export function useMathJaxContext() {
	const context = use(MathJaxContext);
	if (!context) {
		throw new Error("useMathJaxContext must be used within a MathJaxProvider");
	}
	return context;
}
