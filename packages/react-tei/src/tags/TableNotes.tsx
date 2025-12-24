import type { DocumentJson } from "../parser/document";
import { TableNote } from "./TableNote";

export function TableNotes({ notes }: TableNotesProps) {
	if (!Array.isArray(notes) || notes.length === 0) {
		return null;
	}

	return notes.map((note, index) => <TableNote key={index} note={note} />);
}

type TableNotesProps = {
	notes: DocumentJson[];
};
