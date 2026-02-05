import { Card, CardContent, CardMedia } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DebugTag } from "../debug/DebugTag";
import { figureTagCatalog } from "./figure/figureTagCatalog";
import { useFigureValue } from "./figure/useFigureValue";
import { TagCatalogProvider } from "./TagCatalogProvider";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Figure({ data }: ComponentProps) {
	const { t } = useTranslation();
	const value = useFigureValue({ data });

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

	if (value?.length === 0) {
		return (
			<Card elevation={1}>
				<CardMedia
					sx={{
						background: (theme) => theme.palette.grey[100],
						minHeight: 240,
						minWidth: 320,
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
						minHeight: 240,
						minWidth: 320,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{t("figure.unloaded")}
				</CardMedia>
				<CardContent role="note">
					<Value data={value} />
				</CardContent>
			</Card>
		</TagCatalogProvider>
	);
}
