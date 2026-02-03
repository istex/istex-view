import { useMemo } from "react";
import type { DocumentJson } from "../parser/document";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

const getAllText = (data: DocumentJson): string => {
	if (data.tag === "#text") {
		return (data.value as string) || "";
	}
	if (Array.isArray(data.value)) {
		return data.value.map(getAllText).join("");
	}
	return "";
};

export const Q = ({ data }: ComponentProps) => {
	const rawText = useMemo(() => {
		return getAllText(data).trim();
	}, [data]);

	if (rawText.startsWith('"') && rawText.endsWith('"')) {
		return <Value data={data.value} />;
	}

	return (
		<>
			"<Value data={data.value} />"
		</>
	);
};
