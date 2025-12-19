import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useId } from "react";

export function AbstractAccordion({ title, children }: AbstractAccordionProps) {
	const id = useId();

	return (
		<Accordion
			aria-labelledby={id}
			component="section"
			sx={{ paddingInline: 6, paddingBlock: 4 }}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				slotProps={{
					content: {
						component: "div",
						id,
					},
				}}
			>
				{title}
			</AccordionSummary>
			<AccordionDetails
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
				}}
			>
				{children}
			</AccordionDetails>
		</Accordion>
	);
}

type AbstractAccordionProps = {
	title: React.ReactNode;
	children: React.ReactNode;
};
