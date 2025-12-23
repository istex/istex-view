import { Link, Stack } from "@mui/material";
import { useMemo } from "react";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const Note = ({ data }: ComponentProps) => {
	const n = useMemo(() => data.attributes?.["@n"], [data.attributes]);
	const { navigateToFootnoteRef } = useDocumentNavigation();

	return (
		<Stack direction="row" gap={1}>
			{n && (
				<Link
					component="button"
					data-fn-id={n}
					onClick={() => {
						if (!n) {
							console.warn("No n attribute found for note");
							return;
						}
						navigateToFootnoteRef(n);
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
