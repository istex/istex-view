import { describe, expect, it } from "vitest";
import { withSection } from "./context.js";

describe("withSection", () => {
	it("should create a new TransformContext with the given SectionContext", () => {
		const newSection = { id: "sec1", level: "1" };
		const initialContext = { transformers: {}, section: null };

		const updatedContext = withSection(initialContext, newSection);

		expect(updatedContext).toEqual({
			section: newSection,
		});
		expect(initialContext).toEqual({ section: null }); // Ensure immutability
	});
});
