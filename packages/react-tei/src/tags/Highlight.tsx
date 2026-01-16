import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDocumentContext } from "../DocumentContextProvider";
import { kebabCasify } from "../helper/kebabCasify";
import { chipColors } from "../SidePanel/unitex/unitexAnnotationBlocks";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const Highlight = ({ data }: HighlightProps) => {
	const { value, attributes } = data;
	const { unitexEnrichment } = useDocumentContext();

	const groups = useMemo(() => {
		if (!attributes?.groups || !unitexEnrichment) {
			return [];
		}
		return ([] as string[]).concat(attributes?.groups).filter((group) => {
			const term = unitexEnrichment?.document?.[group]?.find(
				({ term }) => kebabCasify(term) === attributes?.term,
			);

			return term?.displayed ?? false;
		});
	}, [unitexEnrichment, attributes?.groups, attributes?.term]);

	if (groups.length === 0) {
		return <Value data={value} />;
	}

	return (
		<Box
			component="mark"
			data-term={attributes?.term}
			data-group={groups.join(" ")}
			role="mark"
			sx={{
				color: "inherit",
				backgroundColor: "transparent",
			}}
			style={{
				boxShadow: groups
					.map((g, index) =>
						index === 0
							? `inset 0 -3px 0 ${chipColors[g as keyof typeof chipColors]}`
							: `0 ${index * 3}px 0 ${chipColors[g as keyof typeof chipColors]}`,
					)
					.join(", "),
			}}
		>
			<Value data={value} />
		</Box>
	);
};

type HighlightProps = {
	data: Omit<ComponentProps["data"], "attributes"> & {
		attributes?: {
			groups?: string[] | string;
			term?: string;
		};
	};
};
