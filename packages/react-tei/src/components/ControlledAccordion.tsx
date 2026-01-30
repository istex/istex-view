import PlusIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import Accordion, { type AccordionProps } from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useState } from "react";

export function ControlledAccordion({
	id,
	summary,
	children,
	sx,
	...rest
}: ControlledAccordionProps) {
	const [expanded, setExpanded] = useState<boolean>(false);
	return (
		<Accordion
			expanded={expanded}
			onChange={() => setExpanded(!expanded)}
			{...rest}
			sx={{ paddingInline: 6, paddingBlock: 4, ...sx }}
			aria-labelledby={id}
		>
			<AccordionSummary
				expandIcon={expanded ? <MinusIcon /> : <PlusIcon />}
				slotProps={{
					content: {
						component: "div",
						id,
					},
					expandIconWrapper: {
						sx: {
							color: "primary.main",
						},
					},
				}}
			>
				{summary}
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

export type ControlledAccordionProps = {
	id: string;
	summary: React.ReactNode;
	children: React.ReactNode;
} & Omit<AccordionProps, "children">;
