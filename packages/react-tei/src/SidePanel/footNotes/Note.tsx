import { Link, Stack } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const getNoteId = (
	attributes: { "@n"?: string; "@xml:id"?: string } | undefined,
) => {
	if (!attributes) {
		return {
			id: null,
			label: null,
		};
	}

	const id = attributes["@xml:id"] || attributes["@n"] || null;
	const label = attributes["@n"] || attributes["@xml:id"] || null;

	return {
		id,
		label,
	};
};

export const Note = ({ data }: ComponentProps) => {
	const { id: noteId, label } = useMemo(
		() => getNoteId(data.attributes),
		[data.attributes],
	);
	const { navigateToFootnoteRef } = useDocumentNavigation();

	const handleClick = useMemo<
		React.MouseEventHandler<HTMLAnchorElement>
	>(() => {
		return (e) => {
			e.preventDefault();
			if (!noteId) {
				return;
			}
			navigateToFootnoteRef(noteId);
		};
	}, [navigateToFootnoteRef, noteId]);

	return (
		<Stack
			direction="row"
			gap={1}
			data-fn-id={noteId}
			role="note"
			aria-label={label ?? undefined}
		>
			{noteId && (
				<Link
					role="button"
					onClick={handleClick}
					sx={{
						justifySelf: "start",
						alignSelf: "start",
						cursor: "pointer",
					}}
				>
					{label ?? noteId}
				</Link>
			)}
			<div>
				<Value data={data.value} />
			</div>
		</Stack>
	);
};
