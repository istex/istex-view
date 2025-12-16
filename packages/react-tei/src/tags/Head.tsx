import type { JSX } from "react";
import type { DocumentJson } from "../parser/document.js";
import { DocumentTag } from "./DocumentTag.js";

export const Head = ({ data: { value }, depth = 1 }: HeadProps) => {
	const headerLevel = Math.max(2, Math.min(6, depth));
	const Tag = `h${headerLevel}` as keyof JSX.IntrinsicElements;

	return (
		<Tag>
			<DocumentTag data={value ?? []} />
		</Tag>
	);
};

type HeadProps = { data: DocumentJson; depth?: number };
