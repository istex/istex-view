import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableHead from "@mui/material/TableHead";

import { TableCaption } from "./TableCaption.js";
import { TableNotes } from "./TableNotes.js";
import { TableRow } from "./TableRow.js";
import type { ComponentProps } from "./type.js";

export function Table({ data: { value, attributes } }: ComponentProps) {
	if (!Array.isArray(value)) {
		console.warn("Table tag with non-array value:", value);
		return null;
	}

	const heads = value.filter((item) => item.tag === "head");

	const tableLabel = heads.find((item) => {
		return item.attributes?.["@type"] === "label";
	});

	const tableTitle = heads.find((item) => {
		return item.attributes?.["@type"] == null;
	});

	const tableHead = value.filter(
		(item) => item.tag === "row" && item.attributes?.["@role"] === "label",
	);
	const rows = value.filter(
		(item) => item.tag === "row" && item.attributes?.["@role"] === "data",
	);

	const captionId = `table_caption_${attributes?.["@xml:id"]}`;

	const notesGroup = value.find((item) => item.tag === "note");
	const notes = Array.isArray(notesGroup?.value) ? notesGroup.value : [];

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
					id={`table_${attributes?.["@xml:id"]}`}
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
					<TableCaption id={captionId} label={tableLabel} title={tableTitle} />
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
			<TableNotes notes={notes} />
		</Stack>
	);
}
