import Stack from "@mui/material/Stack";

import type { DocumentJson } from "../parser/document.js";
import { Value } from "./Value.js";

export function TableNotes({ notes }: TableNotesProps) {
	return (
		<Stack
			gap={1}
			sx={{
				"& p": {
					padding: 0,
					margin: 0,
					color: "text.secondary",
				},
			}}
		>
			{notes.map((note, index) => (
				<Value key={index} data={note.value} />
			))}
		</Stack>
	);
}

type TableNotesProps = {
	notes: DocumentJson[];
};
