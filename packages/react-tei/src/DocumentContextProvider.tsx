import { createContext } from "react";
import type { DocumentJsonValue } from "./parser/document.js";

export type DocumentContextType = {
	jsonDocument: DocumentJsonValue;
};

export const DocumentContext = createContext<DocumentContextType | undefined>(
	undefined,
);

export function DocumentContextProvider({
	children,
	jsonDocument,
}: {
	children: React.ReactNode;
	jsonDocument: DocumentJsonValue;
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
