import type { SxProps } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import type { Theme } from "@mui/material/styles";
import { useMemo } from "react";
import { TagCatalogProvider, useTagCatalog } from "../TagCatalogProvider";
import type { ComponentProps } from "../type";
import { Value } from "../Value";
import { floatingTextTagCatalog } from "./floatingTexttagCatalog";

export function FloatingText({ data }: ComponentProps) {
	const type = data.attributes?.["@type"];

	const sx = useMemo((): SxProps<Theme> => {
		if (type === "statement") {
			return {
				border: "none",
				borderLeft: (theme) => `2px solid ${theme.palette.secondary.main}`,
				borderRadius: 0,
			};
		}
		return {
			border: (theme) => `2px solid ${theme.palette.secondary.main}`,
		};
	}, [type]);

	const tagCatalog = useTagCatalog();
	return (
		<TagCatalogProvider
			tagCatalog={{
				...tagCatalog,
				...floatingTextTagCatalog,
			}}
		>
			<Card elevation={0} sx={sx}>
				<CardContent>
					<Value data={data.value} />
				</CardContent>
			</Card>
		</TagCatalogProvider>
	);
}
