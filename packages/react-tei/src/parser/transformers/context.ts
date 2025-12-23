import type { SectionContext, TransformContext } from "./type";

export function withSection<T extends Pick<TransformContext, "section">>(
	context: T,
	section: SectionContext,
): T {
	return {
		...context,
		section,
	};
}
