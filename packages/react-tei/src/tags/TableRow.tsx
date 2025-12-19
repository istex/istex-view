import MuiTableCell from "@mui/material/TableCell";
import MuiTableRow from "@mui/material/TableRow";

import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function TableRow({ data }: ComponentProps) {
	if (!Array.isArray(data.value)) {
		console.warn("TableRow tag with non-array value:", data.value);
		return null;
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
