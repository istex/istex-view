import type { TransformFn } from "../type";
import { transformDiv } from "./div";

export const bodyTransformers: Record<string, TransformFn> = {
	div: transformDiv,
};
