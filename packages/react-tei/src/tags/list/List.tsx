import type { ComponentProps } from "../type";
import { LabelledList } from "./LabelledList";
import { UnlabelledList } from "./UnlabelledList";
import { useIsLabelledList } from "./useIsLabelledList";

export function List({ data }: ComponentProps) {
	const isLabelledList = useIsLabelledList(data);

	if (isLabelledList) {
		return <LabelledList data={data} />;
	}

	return <UnlabelledList data={data} />;
}
