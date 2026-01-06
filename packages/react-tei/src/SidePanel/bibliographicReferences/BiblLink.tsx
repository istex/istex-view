import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
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
		<ListItem
			component={Button}
			sx={{
				fontSize: "1rem",
			}}
			size="small"
			data-bibref-id={referenceId}
			onClick={() => {
				navigateToBibliographicReferenceRef(referenceId);
			}}
		>
			{children}
		</ListItem>
	);
};
