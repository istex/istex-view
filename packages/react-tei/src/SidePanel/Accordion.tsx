import { ExpandMore } from "@mui/icons-material";
import {
	AccordionDetails,
	AccordionSummary,
	Accordion as MuiAccordion,
	Typography,
} from "@mui/material";
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
		>
			<AccordionSummary expandIcon={<ExpandMore />}>
				<Typography variant="button">{t(label)}</Typography>
			</AccordionSummary>

			<AccordionDetails>{children}</AccordionDetails>
		</MuiAccordion>
	);
};
