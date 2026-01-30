import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IS_DEBUG } from "../../debug/debug.const";
import type { DocumentJson } from "../../parser/document";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";
import { useValueSeparator } from "./useValueSeparator";

const AFFILIATION_TAG = "affiliation";

export function Author({ data }: ComponentProps) {
	const { t } = useTranslation();

	const valueArray = useMemo<DocumentJson[]>(() => {
		if (Array.isArray(data.value)) {
			return data.value;
		}
		IS_DEBUG && console.warn("Author tag with no value array:", data);
		return [];
	}, [data]);

	const name = useMemo(() => {
		if (data.attributes?.["@role"] === "et-al") {
			return [{ tag: "#text", value: "et al." }];
		}
		return valueArray.filter((item) => item.tag !== AFFILIATION_TAG);
	}, [data.attributes, valueArray]);

	const nameWithSpacing = useValueSeparator(name, " ");

	const affiliations = useMemo(() => {
		return valueArray.filter((item) => item.tag === AFFILIATION_TAG);
	}, [valueArray]);

	if (!valueArray.length) {
		return null;
	}

	return (
		<ListItem
			sx={{
				padding: 0,
			}}
			aria-label={t("authors.label")}
		>
			<ListItemText
				sx={{
					margin: 0,
				}}
				rel="author"
			>
				<Value data={nameWithSpacing} />
			</ListItemText>

			{affiliations.length > 0 && (
				<List
					sx={{
						paddingBlock: 0,
						paddingInlineStart: 2,
						"& > li + li": {
							paddingTop: 0.5,
						},
					}}
				>
					<Value data={affiliations} />
				</List>
			)}
		</ListItem>
	);
}
