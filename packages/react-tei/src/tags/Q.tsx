import { useMemo } from "react";
import { getRawText } from "../helper/getRawText";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const Q = ({ data }: ComponentProps) => {
	const rawText = useMemo(() => {
		return getRawText(data).trim();
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
