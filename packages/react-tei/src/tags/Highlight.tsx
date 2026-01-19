import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDocumentContext } from "../DocumentContextProvider";
import { kebabCasify } from "../helper/kebabCasify";
import { chipColors } from "../SidePanel/unitex/unitexAnnotationBlocks";
import type { TermStatistic } from "../unitex/parseUnitexEnrichment";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const Highlight = ({ data }: HighlightProps) => {
	const { value, attributes } = data;
	const { unitexEnrichment, teeftEnrichment } = useDocumentContext();

	const groups = useMemo(() => {
		if (!attributes?.groups || (!unitexEnrichment && !teeftEnrichment)) {
			return [];
		}
		return ([] as string[]).concat(attributes?.groups).filter((group) => {
			const allTerms: TermStatistic[] = ([] as TermStatistic[])
				.concat(unitexEnrichment?.document?.[group] ?? [])
				.concat(teeftEnrichment?.annotations ?? []);
			const term = allTerms.find(
				({ term }) => kebabCasify(term) === attributes?.term,
			);

			return term?.displayed ?? false;
		});
	}, [unitexEnrichment, teeftEnrichment, attributes?.groups, attributes?.term]);

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
