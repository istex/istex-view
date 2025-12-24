import { Typography } from "@mui/material";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { useDocumentSources } from "./useDocumentSources";

export const SourceSection = () => {
	const documentSources = useDocumentSources();

	if (documentSources.length === 0) {
		return null;
	}

	return (
		<Accordion name="source" label="sidePanel.source.title">
			<Typography>
				<Value data={documentSources} />
			</Typography>
		</Accordion>
	);
};
