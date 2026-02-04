import { Formula } from "../Formula";
import { Graphic } from "../Graphic";
import type { TagCatalog } from "../tagCatalog.type";
import { MathMLTag } from "./mathml/MathMLTag";
import { mathMLTagNames } from "./mathml/mathMLTagNames";

export const mathTagCatalog: TagCatalog = {
	graphic: Graphic,
	formula: Formula,
	...mathMLTagNames.reduce((acc, tagName) => {
		acc[tagName] = MathMLTag;
		return acc;
	}, {} as TagCatalog),
};
