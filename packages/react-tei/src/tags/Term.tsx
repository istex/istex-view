import { Hi } from "./Hi";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Term({ data }: ComponentProps) {
	const rend = data.attributes?.["@rend"];

	if (rend) {
		return <Hi data={data} />;
	}

	return <Value data={data.value} />;
}
