import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { DebugTag } from "../../../debug/DebugTag";
import type { ComponentProps } from "../../../tags/type";
import { Value } from "../../../tags/Value";

export function SourceIdno({ data }: ComponentProps) {
	const { t } = useTranslation();
	const idnoType = data.attributes?.["@type"];

	const className = "source-idno";

	switch (idnoType) {
		case "eISBN":
			return (
				<Typography className={className}>
					{t("source.eISBN")}
					<Value data={data.value} />
				</Typography>
			);
		case "pISBN":
			return (
				<Typography className={className}>
					{t("source.pISBN")}
					<Value data={data.value} />
				</Typography>
			);
		case "eISSN":
			return (
				<Typography className={className}>
					{t("source.eISSN")}
					<Value data={data.value} />
				</Typography>
			);
		case "pISSN":
			return (
				<Typography className={className}>
					{t("source.pISSN")}
					<Value data={data.value} />
				</Typography>
			);
		default:
			return (
				<DebugTag
					tag="idno"
					payload={data.value}
					attributes={data.attributes}
					message="Ignored Idno tag with unsupported type"
				/>
			);
	}
}
