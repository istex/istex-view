import { EnrichmentTermAnnotationBlock } from "./EnrichmentTermAnnotationBlock";
import { ENRICHMENT_ANNOTATION_BLOCKS } from "./enrichmentTermAnnotationBlocks";

export function EnrichmentTermSection() {
	return ENRICHMENT_ANNOTATION_BLOCKS.map((block) => (
		<EnrichmentTermAnnotationBlock key={block} block={block} />
	));
}
