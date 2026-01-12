import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { type ReactNode, useMemo } from "react";
import { DebugTag } from "../../debug/DebugTag";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type { ComponentProps } from "../../tags/type";

export const BiblLink = ({
	data,
	children,
}: ComponentProps & {
	children: ReactNode;
}) => {
	const { navigateToBibliographicReferenceRef } = useDocumentNavigation();
	const { tag, attributes } = data;

	const referenceId = useMemo(() => {
		return attributes?.["@xml:id"] || null;
	}, [attributes]);

	if (!referenceId) {
		return (
			<DebugTag
				tag={tag}
				attributes={attributes}
				message="No xml:id attribute found for bibliographic reference"
				payload={data}
				inline
			>
				<Stack
					sx={{
						fontSize: "1rem",
					}}
					direction="row"
					gap={1}
					role="note"
				>
					{children}
				</Stack>
			</DebugTag>
		);
	}

	const id = `bibl-ref-${referenceId}`;

	return (
		<Stack
			sx={{
				fontSize: "1rem",
			}}
			direction="row"
			gap={1}
			role="note"
			aria-labelledby={id}
			data-bibref-id={referenceId}
		>
			<IconButton
				sx={{ alignSelf: "start", padding: 0 }}
				onClick={() => {
					navigateToBibliographicReferenceRef(referenceId);
				}}
				color="primary"
				aria-labelledby={id}
			>
				<ManageSearchIcon />
			</IconButton>
			<div id={id}>{children}</div>
		</Stack>
	);
};
