import { Card, CardContent, CardMedia } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DebugTag } from "../debug/DebugTag";
import { FigureTable } from "./figure/FigureTable";
import { figureTagCatalog } from "./figure/figureTagCatalog";
import { TagCatalogProvider } from "./TagCatalogProvider";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Figure({ data }: ComponentProps) {
	const type = data.attributes?.["@type"];
	const { t } = useTranslation();
	const value = useMemo(() => {
		if (!Array.isArray(data.value)) {
			return data.value;
		}
		return data.value.filter(
			({ tag }) => !["graphic", "link", "highlightedText"].includes(tag),
		);
	}, [data.value]);

	if (!Array.isArray(value)) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message="Figure tag with non-array value"
				payload={value}
			/>
		);
	}

	if (!Array.isArray(value)) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message="Figure tag with non-array value"
				payload={value}
			/>
		);
	}

	if (type === "table") {
		return <FigureTable data={data} />;
	}

	if (value?.length === 0) {
		return (
			<Card elevation={1}>
				<CardMedia
					sx={{
						background: (theme) => theme.palette.grey[100],
						minHeight: 200,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{t("figure.unloaded")}
				</CardMedia>
			</Card>
		);
	}

	return (
		<TagCatalogProvider tagCatalog={figureTagCatalog}>
			<Card elevation={1}>
				<CardMedia
					sx={{
						background: (theme) => theme.palette.grey[100],
						minHeight: 200,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{t("figure.unloaded")}
				</CardMedia>
				<CardContent>
					<Value data={value} />
				</CardContent>
			</Card>
		</TagCatalogProvider>
	);
}
