import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableHead from "@mui/material/TableHead";

import { TableCaption } from "./TableCaption";
import { TableNotes } from "./TableNotes";
import { TableRow } from "./TableRow";
import type { ComponentProps } from "./type";

export function getTableId(
	xmlId: string | null | undefined,
): string | undefined {
	if (!xmlId) {
		return undefined;
	}
	return `table-${xmlId}`;
}

export function Table({ data: { value, attributes } }: ComponentProps) {
	if (!Array.isArray(value)) {
		console.warn("Table tag with non-array value:", value);
		return null;
	}

	const heads = value.filter((item) => item.tag === "head");

	const tableLabel = heads.find((item) => {
		return item.attributes?.["@type"] === "label";
	});

	const tableTitles = heads.filter((item) => {
		return item.attributes?.["@type"] == null;
	});

	const tableHead = value.filter(
		(item) => item.tag === "row" && item.attributes?.["@role"] === "label",
	);
	const rows = value.filter(
		(item) => item.tag === "row" && item.attributes?.["@role"] === "data",
	);

	const captionId = `table_caption_${attributes?.["@xml:id"]}`;

	const notesGroup = value.filter((item) => item.tag === "note");

	return (
		<Stack gap={1}>
			<Box
				sx={{
					width: "100%",
					maxWidth: "100%",
					overflowX: "auto",
				}}
			>
				<MuiTable
					aria-labelledby={captionId}
					id={getTableId(attributes?.["@xml:id"])}
					sx={{
						"& caption": {
							color(theme) {
								return theme.palette.text.primary;
							},
							borderBottom(theme) {
								return `1px solid ${theme.palette.divider}`;
							},
						},
					}}
				>
					<TableCaption
						id={captionId}
						label={tableLabel}
						titles={tableTitles}
					/>
					<MuiTableHead>
						{tableHead.map((row, rowIndex) => (
							<TableRow key={rowIndex} data={row} />
						))}
					</MuiTableHead>
					<MuiTableBody>
						{rows.map((row, rowIndex) => (
							<TableRow key={rowIndex} data={row} />
						))}
					</MuiTableBody>
				</MuiTable>
			</Box>
			<TableNotes notes={notesGroup} />
		</Stack>
	);
}
