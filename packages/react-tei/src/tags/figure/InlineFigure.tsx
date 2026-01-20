import { Box, Tooltip } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../TagCatalogProvider";
import type { ComponentProps } from "../type";
import { Value } from "../Value";
import { FigureTable } from "./FigureTable";
import { figureTagCatalog } from "./figureTagCatalog";

export function InlineFigure({ data }: ComponentProps) {
	const { t } = useTranslation();
	const type = data.attributes?.["@type"];
	const value = useMemo(() => {
		if (!Array.isArray(data.value)) {
			return data.value;
		}
		return data.value.filter(
			({ tag }) => !["graphic", "link", "highlightedText"].includes(tag),
		);
	}, [data.value]);

	if (type === "table") {
		return <FigureTable data={data} />;
	}

	if (value?.length === 0) {
		return (
			<Box
				component="span"
				sx={{
					background: (theme) => theme.palette.grey[100],
					padding: (theme) => theme.spacing(0.5, 2),
				}}
			>
				{t("figure.unloaded")}
			</Box>
		);
	}

	return (
		<TagCatalogProvider tagCatalog={figureTagCatalog}>
			<Tooltip title={<Value data={value} />}>
				<Box
					component="span"
					sx={{
						background: (theme) => theme.palette.grey[100],
						padding: (theme) => theme.spacing(0.5, 2),
					}}
				>
					{t("figure.unloaded")}
				</Box>
			</Tooltip>
		</TagCatalogProvider>
	);
}
