import { createContext } from "react";

export type DocumentContextType = {
	jsonDocument: Record<string, unknown> | null;
};

export const DocumentContext = createContext<DocumentContextType | undefined>(
	undefined,
);

export function DocumentContextProvider({
	children,
	jsonDocument,
}: {
	children: React.ReactNode;
	jsonDocument: Record<string, unknown> | null;
}) {
	return (
		<DocumentContext.Provider
			value={{
				jsonDocument,
			}}
		>
			{children}
		</DocumentContext.Provider>
	);
}
