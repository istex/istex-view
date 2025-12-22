import { withSection } from "../context";
import type { TransformFn } from "../type";

export const transformDiv: TransformFn = (context, node) => {
	const hasHead = Array.isArray(node.value)
		? node.value.some(
				(child) => typeof child === "object" && child.tag === "head",
			)
		: false;

	if (hasHead) {
		const id = `section-${Math.random().toString(36).substr(2, 9)}`;
		const level = (
			context.section ? parseInt(context.section.level, 10) + 1 : 2
		).toString();

		return {
			node: {
				...node,
				attributes: {
					...node.attributes,
					id,
					level,
				},
				value: Array.isArray(node.value)
					? node.value.map((child) => {
							if (typeof child === "object" && child.tag === "head") {
								return {
									...child,
									attributes: {
										...child.attributes,
										id,
										level,
									},
								};
							}
							return child;
						})
					: node.value,
			},
			context: withSection(context, { id, level }),
		};
	}

	return { node, context };
};
