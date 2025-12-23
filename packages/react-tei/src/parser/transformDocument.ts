import type { DocumentJson } from "./document";
import { transformDiv } from "./transformers/body/div";
import { bodyTransformers } from "./transformers/body/transformers";
import type { TransformContext, TransformFn } from "./transformers/type";

export const noOpTransformer: TransformFn = (context, node) => ({
	node,
	context,
});

export function recursiveTransform(
	{ transformers, ...rest }: TransformContext,
	node: DocumentJson,
): DocumentJson {
	const transformer = transformers[node.tag] || noOpTransformer;

	const { node: transformedNode, context: transformedContext } = transformer(
		rest,
		node,
	);

	const innerContext = {
		transformers,
		...transformedContext,
	};

	return {
		...transformedNode,
		value: Array.isArray(transformedNode.value)
			? transformedNode.value.map((child) => {
					return recursiveTransform(innerContext, child);
				})
			: transformedNode.value,
	};
}

export function transformDocument(
	transformers: Record<string, TransformFn>,
	document: DocumentJson,
): DocumentJson {
	return recursiveTransform({ transformers, section: null }, document);
}

export function transformAbstract(document: DocumentJson) {
	return recursiveTransform(
		{
			transformers: {
				div: transformDiv,
			},
			section: {
				id: "abstract",
				level: "3",
			},
		},
		document,
	);
}

export function transformBody(document: DocumentJson) {
	return transformDocument(bodyTransformers, document);
}
