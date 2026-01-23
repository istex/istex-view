import Typography from "@mui/material/Typography";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export function DocumentIdentifierIdno({ data }: ComponentProps) {
	const idnoType = data.attributes?.["@type"];

	switch (idnoType) {
		case "DOI":
			return (
				<Typography>
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
