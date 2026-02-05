import type { DocumentJson } from "../parser/document";

export type TextPosition = {
	nodeIndex: number; // Index in the flat node array
	node: DocumentJson; // The original node
	startInConcat: number; // Start position in concatenated string
	endInConcat: number; // End position in concatenated string
	textStart: number; // Start offset within the node's text value
	textEnd: number; // End offset within the node's text value
	path: number[]; // Path from root to this node (array of child indices)
};

export type StopTagPosition = {
	node: DocumentJson; // The stop tag node
	positionInConcat: number; // Position in the concatenated string where this stop tag appears
	childIndex: number; // Original index in the children array
};

export type ExtractionResult = {
	text: string;
	positions: TextPosition[];
	flatNodes: DocumentJson[];
	stopTags: StopTagPosition[]; // Stop tags that need to be preserved
};

/**
 * Recursively extracts all text content from a document node,
 * tracking the position of each text segment for later reconstruction.
 *
 * @param node - The document node to extract text from
 * @param isStopTag - Function to determine if a tag should stop text extraction
 * @returns ExtractionResult with concatenated text and position mappings
 */
export const extractTextWithPositions = (
	children: DocumentJson[],
	isStopTag: (tag: DocumentJson) => boolean = () => false,
): ExtractionResult => {
	const positions: TextPosition[] = [];
	const flatNodes: DocumentJson[] = [];
	const stopTags: StopTagPosition[] = [];
	let concatenatedText = "";

	const traverse = (node: DocumentJson, path: number[], childIndex: number) => {
		if (isStopTag(node)) {
			// For stop tags, track their position but don't extract text
			stopTags.push({
				node,
				positionInConcat: concatenatedText.length,
				childIndex,
			});
			flatNodes.push(node);
			return;
		}

		if (node.tag === "#text" && typeof node.value === "string") {
			const startInConcat = concatenatedText.length;
			concatenatedText += node.value;
			const endInConcat = concatenatedText.length;

			positions.push({
				nodeIndex: flatNodes.length,
				node,
				startInConcat,
				endInConcat,
				textStart: 0,
				textEnd: node.value.length,
				path: [...path],
			});
			flatNodes.push(node);
		} else if (Array.isArray(node.value)) {
			flatNodes.push(node);
			node.value.forEach((child, index) => {
				traverse(child, [...path, index], childIndex);
			});
		} else {
			flatNodes.push(node);
		}
	};

	children.forEach((child, index) => {
		traverse(child, [index], index);
	});

	return {
		text: concatenatedText,
		positions,
		flatNodes,
		stopTags,
	};
};

/**
 * Find which text positions a match spans
 */
export const findSpannedPositions = (
	positions: TextPosition[],
	matchStart: number,
	matchEnd: number,
): TextPosition[] => {
	return positions.filter(
		(pos) => pos.startInConcat < matchEnd && pos.endInConcat > matchStart,
	);
};

/**
 * Calculate the slice boundaries within a text node for a match
 */
export const getSliceBoundaries = (
	position: TextPosition,
	matchStart: number,
	matchEnd: number,
): { start: number; end: number } => {
	const relativeStart = Math.max(0, matchStart - position.startInConcat);
	const relativeEnd = Math.min(
		position.endInConcat - position.startInConcat,
		matchEnd - position.startInConcat,
	);
	return { start: relativeStart, end: relativeEnd };
};
