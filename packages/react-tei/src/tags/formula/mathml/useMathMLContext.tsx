import { useContext } from "react";
import { MathMLContext } from "./MathMLContext";

export function useMathMLContext() {
	return useContext(MathMLContext) ?? null;
}
