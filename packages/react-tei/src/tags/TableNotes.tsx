import Stack from "@mui/material/Stack";

import type { DocumentJson } from "../parser/document";
import { Value } from "./Value";

export function TableNotes({ notes }: TableNotesProps) {
	return (
		<Stack gap={1}>
			{notes.map((note, index) => (
				<Value key={index} data={note.value} />
			))}
		</Stack>
	);
}

type TableNotesProps = {
	notes: DocumentJson[];
};
