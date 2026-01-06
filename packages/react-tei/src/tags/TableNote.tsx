import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { DocumentJson } from "../parser/document";
import { TableNotes } from "./TableNotes";
import { Value } from "./Value";

export function getTableNoteId(
	xmlId: string | null | undefined,
): string | undefined {
	if (!xmlId) {
		return undefined;
	}
	return `table-note-${xmlId}`;
}

export function TableNote({ note }: TableNoteProps) {
	if (!Array.isArray(note.value)) {
		return (
			<Box role="note">
				<Value data={note.value} />
			</Box>
		);
	}

	const id = getTableNoteId(note.attributes?.["@xml:id"]);
	const type = note.attributes?.["@type"];

	switch (type) {
		case "table-wrap-foot":
			return (
				<Stack role="group" gap={0.5} id={id}>
					<TableNotes notes={note.value} />
				</Stack>
			);

		case "inline":
		case "legend":
			return (
				<Box component="span" role="note" id={id}>
					<Value data={note.value} />
				</Box>
			);

		case "foot-note": {
			const label = note.value.find((item) => item.tag === "label");
			const content = note.value.filter((item) => item.tag !== "label");
			return (
				<Stack role="note" direction="row" gap={0.5} id={id}>
					{label && (
						<Typography component="sup">
							<Value data={label.value} />
						</Typography>
					)}
					<Box component="div" flex={1}>
						<Value data={content} />
					</Box>
				</Stack>
			);
		}
		default:
			console.warn(`Unhandled table note type: ${type}`, note);
			return (
				<Box role="note" id={id}>
					<Value data={note.value} />
				</Box>
			);
	}
}

type TableNoteProps = {
	note: DocumentJson;
};
