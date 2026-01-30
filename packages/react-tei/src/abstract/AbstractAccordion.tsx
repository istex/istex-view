import { useId } from "react";
import { ControlledAccordion } from "../components/ControlledAccordion";

export function AbstractAccordion({ title, children }: AbstractAccordionProps) {
	const id = useId();

	return (
		<ControlledAccordion id={id} component="section" summary={title}>
			{children}
		</ControlledAccordion>
	);
}

type AbstractAccordionProps = {
	title: React.ReactNode;
	children: React.ReactNode;
};
