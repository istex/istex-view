import { useContext, useMemo } from "react";
import { ListContext, type ListContextValue } from "./ListContext";

export function useListType(type?: string | null | undefined) {
	const parentListContext = useContext(ListContext);
	return useMemo<ListContextValue>(() => {
		switch (type) {
			case "order":
				return "ol";
			case "bullet":
				return "ul";
			default:
				return parentListContext ?? "ul";
		}
	}, [parentListContext, type]);
}
