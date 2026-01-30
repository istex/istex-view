import PlusIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import { useId } from "react";

import {
	type PanelSection,
	useDocumentSidePanelContext,
} from "./DocumentSidePanelContext";

type AccordionProps = {
	name: PanelSection;
	label: string;
	children: React.ReactNode;
};

export const Accordion = ({ name, label, children }: AccordionProps) => {
	const panel = useDocumentSidePanelContext();
	const id = useId();

	const isExpanded = panel.state.sections[name];

	return (
		<MuiAccordion
			expanded={isExpanded}
			onChange={() => panel.toggleSection(name)}
			elevation={0}
			sx={{
				"&:before": {
					backgroundColor: "transparent !important",
				},
			}}
		>
			<AccordionSummary
				expandIcon={isExpanded ? <MinusIcon /> : <PlusIcon />}
				sx={{
					borderBottom: "none",
					borderTop: "none",
				}}
				slotProps={{
					expandIconWrapper: {
						sx: {
							width: "34px",
							height: "34px",
							alignItems: "center",
							justifyContent: "center",
							color: "primary.main",
						},
					},
				}}
				id={id}
			>
				<Typography variant="button">{label}</Typography>
			</AccordionSummary>

			<AccordionDetails
				aria-labelledby={id}
				sx={{ paddingBlock: 0, paddingInline: 2 }}
			>
				{children}
			</AccordionDetails>
		</MuiAccordion>
	);
};
