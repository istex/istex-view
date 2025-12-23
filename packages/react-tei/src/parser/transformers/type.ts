import type { DocumentJson } from "../document";

export type SectionContext = {
	id: string;
	level: string;
};

export type TransformContext = {
	transformers: Record<string, TransformFn>;
	section: SectionContext | null;
};

export type TransformFn = (
	context: Omit<TransformContext, "transformers">,
	node: DocumentJson,
) => {
	node: DocumentJson;
	context: Omit<TransformContext, "transformers">;
};
