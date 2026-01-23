import { LabelledList } from "./list/LabelledList";
import { UnlabelledList } from "./list/UnlabelledList";
import { useIsLabelledList } from "./list/useIsLabelledList";
import type { ComponentProps } from "./type";

export function List({ data }: ComponentProps) {
	const isLabelledList = useIsLabelledList(data);

	if (isLabelledList) {
		return <LabelledList data={data} />;
	}

	return <UnlabelledList data={data} />;
}
