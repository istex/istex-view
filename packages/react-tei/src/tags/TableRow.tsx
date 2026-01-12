import MuiTableCell from "@mui/material/TableCell";
import MuiTableRow from "@mui/material/TableRow";
import { DebugTag } from "../debug/DebugTag";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function TableRow({ data }: ComponentProps) {
	if (!Array.isArray(data.value)) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message="TableRow tag with non-array value"
				payload={data.value}
			/>
		);
	}

	const cells = data.value.filter((item) => item.tag === "cell");

	return (
		<MuiTableRow>
			{cells.map((cell, cellIndex) => {
				const rowSpan = cell.attributes?.["@rows"]
					? parseInt(cell.attributes?.["@rows"], 10)
					: undefined;
				const colSpan = cell.attributes?.["@cols"]
					? parseInt(cell.attributes?.["@cols"], 10)
					: undefined;

				return (
					<MuiTableCell key={cellIndex} rowSpan={rowSpan} colSpan={colSpan}>
						<Value data={cell.value} />
					</MuiTableCell>
				);
			})}
		</MuiTableRow>
	);
}
