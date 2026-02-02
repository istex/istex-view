import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { DebugTag } from "../../../debug/DebugTag";
import type { ComponentProps } from "../../../tags/type";
import { Value } from "../../../tags/Value";

export const IDNO_ATTRIBUTE_TYPE = "@type";
export const SUPPORTED_IDNOS: string[] = ["eISBN", "pISBN", "eISSN", "pISSN"];

export function SourceIdno({ data }: ComponentProps) {
	const { t } = useTranslation();
	const idnoType = data.attributes?.[IDNO_ATTRIBUTE_TYPE];

	const className = "source-idno";

	if (!idnoType || !SUPPORTED_IDNOS.includes(idnoType)) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				payload={data}
				message="Ignored Idno tag with unsupported type"
			/>
		);
	}

	return (
		<Typography className={className} component="span">
			{t(`source.${idnoType}.label`)} <Value data={data.value} />{" "}
			{t(`source.${idnoType}.type`)}
		</Typography>
	);
}
