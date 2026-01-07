import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { type ReactNode, useMemo } from "react";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type { ComponentProps } from "../../tags/type";

export const BiblLink = ({
	data,
	children,
}: ComponentProps & {
	children: ReactNode;
}) => {
	const { navigateToBibliographicReferenceRef } = useDocumentNavigation();
	const { attributes } = data;

	const referenceId = useMemo(() => {
		return attributes?.["@xml:id"] || null;
	}, [attributes]);

	if (!referenceId) {
		console.warn("No xml:id attribute found for bibliographic reference");
		return children;
	}

	return (
		<Stack
			sx={{
				fontSize: "1rem",
			}}
			direction="row"
			gap={1}
		>
			<IconButton
				data-bibref-id={referenceId}
				sx={{ alignSelf: "start", padding: 0 }}
				onClick={() => {
					navigateToBibliographicReferenceRef(referenceId);
				}}
				color="primary"
				aria-labelledby={`bibl-ref-${referenceId}`}
			>
				<ManageSearchIcon />
			</IconButton>
			<div id={`bibl-ref-${referenceId}`}>{children}</div>
		</Stack>
	);
};
