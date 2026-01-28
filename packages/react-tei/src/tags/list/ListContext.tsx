import { createContext } from "react";

export type ListContextValue = "ol" | "ul";

export const ListContext = createContext<ListContextValue | undefined>(
	undefined,
);
