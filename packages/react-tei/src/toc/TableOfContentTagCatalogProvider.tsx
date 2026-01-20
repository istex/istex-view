import { useMemo } from "react";
import { NoOp } from "../tags/NoOp";
import { TagCatalogProvider, useTagCatalog } from "../tags/TagCatalogProvider";

export function TableOfContentTagCatalogProvider({
	children,
}: TableOfContentTagCatalogProviderProps) {
	const tagCatalog = useTagCatalog();

	const tocTagCatalog = useMemo(() => {
		return {
			...tagCatalog,
			highlight: NoOp,
		};
	}, [tagCatalog]);

	return (
		<TagCatalogProvider tagCatalog={tocTagCatalog}>
			{children}
		</TagCatalogProvider>
	);
}

export type TableOfContentTagCatalogProviderProps = {
	children: React.ReactNode;
};
