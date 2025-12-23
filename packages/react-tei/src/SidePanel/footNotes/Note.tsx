import { Link, Stack } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const getId = (
	attributes: { ["@xml:id"]?: string; ["@n"]?: string } | undefined,
) => {
	if (!attributes) {
		return null;
	}
	if (attributes["@xml:id"]) {
		if (attributes["@xml:id"].split(" ").length > 1) {
			console.warn(
				`Attribute @xml:id contain more than one id, using the first first one: ${attributes["@xml:id"]}`,
			);
			return attributes["@xml:id"].split(" ")[0];
		}
		return attributes["@xml:id"];
	}
	if (attributes?.["@n"]) {
		return `n-${attributes["@n"]}`;
	}

	return null;
};

export const Note = ({ data }: ComponentProps) => {
	const id = useMemo(() => getId(data.attributes), [data.attributes]);
	const { navigateToDocumentRef } = useDocumentNavigation();

	return (
		<Stack direction="row" gap={1}>
			{id && (
				<Link
					component="button"
					id={id}
					onClick={() => {
						if (!id) {
							console.warn("No id found for note");
							return;
						}
						navigateToDocumentRef(id);
					}}
					sx={{
						justifySelf: "start",
						alignSelf: "start",
					}}
				>
					{data.attributes?.["@n"]}
				</Link>
			)}
			<div>
				<Value data={data.value} />
			</div>
		</Stack>
	);
};
