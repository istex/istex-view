import { ExpandMore } from "@mui/icons-material";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import { useTranslation } from "react-i18next";
import {
	type PanelSection,
	useDocumentContext,
} from "../DocumentContextProvider.js";

type AccordionProps = {
	name: PanelSection;
	label: string;
	children: React.ReactNode;
};

export const Accordion = ({ name, label, children }: AccordionProps) => {
	const { t } = useTranslation();

	const { panel } = useDocumentContext();

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
			>
				<Typography variant="button">{t(label)}</Typography>
			</AccordionSummary>

			<AccordionDetails sx={{ padding: 0 }}>{children}</AccordionDetails>
		</MuiAccordion>
	);
};
