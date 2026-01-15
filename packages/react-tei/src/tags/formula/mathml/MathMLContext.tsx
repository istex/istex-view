import { createContext } from "react";

export type MathMLTagPrefix = string;

export const MathMLContext = createContext<MathMLTagPrefix | null>(null);

export function MathMLContextProvider({
	nsPrefix,
	children,
}: MathMLContextProviderProps) {
	return (
		<MathMLContext.Provider value={nsPrefix}>{children}</MathMLContext.Provider>
	);
}

export type MathMLContextProviderProps = {
	nsPrefix: MathMLTagPrefix;
	children: React.ReactNode;
};
