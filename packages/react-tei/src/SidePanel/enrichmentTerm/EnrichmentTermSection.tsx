import { memo } from "react";
import { EnrichmentTermAnnotationBlock } from "./EnrichmentTermAnnotationBlock";
import { ENRICHMENT_ANNOTATION_BLOCKS } from "./enrichmentTermAnnotationBlocks";

export const EnrichmentTermSection = memo(() => {
	return ENRICHMENT_ANNOTATION_BLOCKS.map((block) => (
		<EnrichmentTermAnnotationBlock key={block} block={block} />
	));
});
