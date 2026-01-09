import { UnitexAnnotationBlock } from "./UnitexAnnotationBlock";
import { UNITEX_ANNOTATION_BLOCKS } from "./unitexAnnotationBlocks";

export function UnitexSection() {
	return UNITEX_ANNOTATION_BLOCKS.map((block) => (
		<UnitexAnnotationBlock key={block} block={block} />
	));
}
