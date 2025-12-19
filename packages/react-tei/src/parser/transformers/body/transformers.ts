import type { TransformFn } from "../type.js";
import { transformDiv } from "./div.js";

export const bodyTransformers: Record<string, TransformFn> = {
	div: transformDiv,
};
