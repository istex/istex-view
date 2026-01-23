import Typography from "@mui/material/Typography";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export function SourceIdno({ data }: ComponentProps) {
	const idnoType = data.attributes?.["@type"];

	switch (idnoType) {
		case "eISBN":
			return (
				<Typography>
					eISBN: <Value data={data.value} />
				</Typography>
			);
		case "pISBN":
			return (
				<Typography>
					pISBN: <Value data={data.value} />
				</Typography>
			);
		case "eISSN":
			return (
				<Typography>
					eISSN: <Value data={data.value} />
				</Typography>
			);
		case "pISSN":
			return (
				<Typography>
					pISSN: <Value data={data.value} />
				</Typography>
			);
		default:
			return (
				<DebugTag
					tag="idno"
					payload={data.value}
					attributes={data.attributes}
					message="Ignored Idno tab with unsupported type"
				/>
			);
	}
}
