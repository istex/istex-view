import { type SxProps, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import type { Theme } from "@mui/material/styles";
import { useMemo } from "react";
import { TagCatalogContext, useTagCatalog } from "./TagCatalogProvider";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

const epigraphTagCatalog = {
	p: ({ data }: ComponentProps) => (
		<Typography component="p" variant="caption">
			<Value data={data.value} />
		</Typography>
	),
};

export const Epigraph = ({ data }: ComponentProps) => {
	const tagCatalog = useTagCatalog();

	const sx = useMemo((): SxProps<Theme> => {
		const rend = data.attributes?.["@rend"] ?? "right";
		if (rend === "left") {
			return {
				border: "none",
				borderLeft: (theme) => `2px solid ${theme.palette.secondary.main}`,
				borderRadius: 0,
				textAlign: "left",
			};
		}
		return {
			border: "none",
			borderRight: (theme) => `2px solid ${theme.palette.secondary.main}`,
			borderRadius: 0,
			textAlign: "right",
		};
	}, [data]);

	const catalog = useMemo(
		() => ({
			...tagCatalog,
			...epigraphTagCatalog,
		}),
		[tagCatalog],
	);
	return (
		<TagCatalogContext value={catalog}>
			<Card elevation={0} sx={sx}>
				<CardContent>
					<Value data={data.value} />
				</CardContent>
			</Card>
		</TagCatalogContext>
	);
};
