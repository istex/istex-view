import { ExpandMore } from "@mui/icons-material";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import { useId } from "react";

import {
	type PanelSection,
	useDocumentContext,
} from "../DocumentContextProvider";

type AccordionProps = {
	name: PanelSection;
	label: string;
	children: React.ReactNode;
};

export const Accordion = ({ name, label, children }: AccordionProps) => {
	const { panel } = useDocumentContext();
	const id = useId();

	return (
		<MuiAccordion
			expanded={panel.state.sections[name]}
			onChange={() => panel.toggleSection(name)}
			elevation={0}
			sx={{
				"&:before": {
					backgroundColor: "transparent !important",
				},
			}}
		>
			<AccordionSummary
				expandIcon={<ExpandMore />}
				sx={{
					borderBottom: "none",
					borderTop: "none",
				}}
				id={id}
			>
				<Typography variant="button">{label}</Typography>
			</AccordionSummary>

			<AccordionDetails aria-labelledby={id} sx={{ padding: 0 }}>
				{children}
			</AccordionDetails>
		</MuiAccordion>
	);
};
