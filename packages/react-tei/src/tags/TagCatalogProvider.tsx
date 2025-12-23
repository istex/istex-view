import { type ComponentType, createContext, useContext } from "react";
import type { ComponentProps } from "./type";

export const TagCatalogContext = createContext<Record<
	string,
	ComponentType<ComponentProps>
> | null>(null);

export const TagCatalogProvider = ({
	children,
	tagCatalog,
}: {
	children: React.ReactNode;
	tagCatalog: Record<string, ComponentType<ComponentProps>>;
}) => {
	return (
		<TagCatalogContext.Provider value={tagCatalog}>
			{children}
		</TagCatalogContext.Provider>
	);
};

export const useTagCatalog = (): Record<
	string,
	ComponentType<ComponentProps>
> => {
	const context = useContext(TagCatalogContext);
	if (!context) {
		throw new Error("useTagCatalog must be used within a TagCatalogProvider");
	}
	return context;
};
