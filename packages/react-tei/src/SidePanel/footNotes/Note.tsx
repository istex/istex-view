import { Link, Stack } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const getNoteId = (
	attributes: { "@n"?: string; "@xml:id"?: string } | undefined,
) => {
	if (!attributes) {
		return null;
	}
	if (attributes["@n"]) {
		return attributes["@n"];
	}

	if (attributes["@xml:id"]) {
		return attributes["@xml:id"];
	}

	return null;
};

export const Note = ({ data }: ComponentProps) => {
	const noteId = useMemo(() => getNoteId(data.attributes), [data.attributes]);
	const { navigateToFootnoteRef } = useDocumentNavigation();

	return (
		<Stack direction="row" gap={1}>
			{noteId && (
				<Link
					component="button"
					data-fn-id={noteId}
					onClick={() => {
						if (!noteId) {
							console.warn("No n attribute found for note");
							return;
						}
						navigateToFootnoteRef(noteId);
					}}
					sx={{
						justifySelf: "start",
						alignSelf: "start",
					}}
				>
					{noteId}
				</Link>
			)}
			<div>
				<Value data={data.value} />
			</div>
		</Stack>
	);
};
