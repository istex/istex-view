import { describe, expect, it } from "vitest";
import {
	recursiveTransform,
	transformAbstract,
	transformBody,
	transformDocument,
} from "./transformDocument.js";
import { bodyTransformers } from "./transformers/body/transformers.js";

describe("recursiveTransform", () => {
	it("should return the same node if no transformer is found", () => {
		const node = {
			tag: "unknown",
			attributes: {},
			value: "Some content",
		};

		const transformed = recursiveTransform(
			{ transformers: {}, section: null },
			node,
		);

		expect(transformed).toStrictEqual(node);
	});

	it("should transform a node using the appropriate transformer", () => {
		const body = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: "Section Title",
				},
				{
					tag: "p",
					attributes: {},
					value: "This is a paragraph.",
				},
			],
		};

		const transformed = recursiveTransform(
			{ transformers: bodyTransformers, section: null },
			body,
		);

		expect(transformed).toStrictEqual({
			tag: "div",
			attributes: { id: expect.any(String), level: "2" },
			value: [
				{
					tag: "head",
					attributes: { id: expect.any(String), level: "2" },
					value: "Section Title",
				},
				{
					tag: "p",
					attributes: {},
					value: "This is a paragraph.",
				},
			],
		});
	});

	it("should handle nested transformations correctly", () => {
		const body = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: "Section 1",
				},
				{
					tag: "div",
					attributes: {},
					value: [
						{
							tag: "head",
							attributes: {},
							value: "Subsection 1.1",
						},
						{
							tag: "p",
							attributes: {},
							value: "This is a sub-paragraph.",
						},
					],
				},
			],
		};

		const transformed = recursiveTransform(
			{ transformers: bodyTransformers, section: null },
			body,
		);

		expect(transformed).toStrictEqual({
			tag: "div",
			attributes: { id: expect.any(String), level: "2" },
			value: [
				{
					tag: "head",
					attributes: { id: expect.any(String), level: "2" },
					value: "Section 1",
				},
				{
					tag: "div",
					attributes: { id: expect.any(String), level: "3" },
					value: [
						{
							tag: "head",
							attributes: { id: expect.any(String), level: "3" },
							value: "Subsection 1.1",
						},
						{
							tag: "p",
							attributes: {},
							value: "This is a sub-paragraph.",
						},
					],
				},
			],
		});
	});

	it("should support custom context", () => {
		const body = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: "Section Title",
				},
			],
		};

		const transformed = recursiveTransform(
			{
				transformers: bodyTransformers,
				section: { id: "custom-id", level: "5" },
			},
			body,
		);

		expect(transformed).toStrictEqual({
			tag: "div",
			attributes: { id: expect.any(String), level: "6" },
			value: [
				{
					tag: "head",
					attributes: { id: expect.any(String), level: "6" },
					value: "Section Title",
				},
			],
		});
	});
});

describe("transformDocument", () => {
	it("should transform section recursively", () => {
		const body = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: "Section 1",
				},
				{
					tag: "p",
					attributes: {},
					value: "This is a paragraph.",
				},
				{
					tag: "div",
					attributes: {},
					value: [
						{
							tag: "head",
							attributes: {},
							value: "Subsection 1.1",
						},
						{
							tag: "p",
							attributes: {},
							value: "This is a sub-paragraph.",
						},
					],
				},
			],
		};

		expect(transformDocument(bodyTransformers, body)).toStrictEqual({
			tag: "div",
			attributes: { id: expect.any(String), level: "2" },
			value: [
				{
					tag: "head",
					attributes: { id: expect.any(String), level: "2" },
					value: "Section 1",
				},
				{
					tag: "p",
					attributes: {},
					value: "This is a paragraph.",
				},
				{
					tag: "div",
					attributes: { id: expect.any(String), level: "3" },
					value: [
						{
							tag: "head",
							attributes: { id: expect.any(String), level: "3" },
							value: "Subsection 1.1",
						},
						{
							tag: "p",
							attributes: {},
							value: "This is a sub-paragraph.",
						},
					],
				},
			],
		});
	});
});

describe("transformBody", () => {
	it("should transform section recursively", () => {
		const body = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: "Section 1",
				},
				{
					tag: "p",
					attributes: {},
					value: "This is a paragraph.",
				},
				{
					tag: "div",
					attributes: {},
					value: [
						{
							tag: "head",
							attributes: {},
							value: "Subsection 1.1",
						},
						{
							tag: "p",
							attributes: {},
							value: "This is a sub-paragraph.",
						},
					],
				},
			],
		};

		expect(transformBody(body)).toStrictEqual({
			tag: "div",
			attributes: { id: expect.any(String), level: "2" },
			value: [
				{
					tag: "head",
					attributes: { id: expect.any(String), level: "2" },
					value: "Section 1",
				},
				{
					tag: "p",
					attributes: {},
					value: "This is a paragraph.",
				},
				{
					tag: "div",
					attributes: { id: expect.any(String), level: "3" },
					value: [
						{
							tag: "head",
							attributes: { id: expect.any(String), level: "3" },
							value: "Subsection 1.1",
						},
						{
							tag: "p",
							attributes: {},
							value: "This is a sub-paragraph.",
						},
					],
				},
			],
		});
	});
});

describe("transformAbstract", () => {
	it("should transform section recursively", () => {
		const body = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: "Section 1",
				},
				{
					tag: "p",
					attributes: {},
					value: "This is a paragraph.",
				},
				{
					tag: "div",
					attributes: {},
					value: [
						{
							tag: "head",
							attributes: {},
							value: "Subsection 1.1",
						},
						{
							tag: "p",
							attributes: {},
							value: "This is a sub-paragraph.",
						},
					],
				},
			],
		};

		expect(transformAbstract(body)).toStrictEqual({
			tag: "div",
			attributes: { id: expect.any(String), level: "4" },
			value: [
				{
					tag: "head",
					attributes: { id: expect.any(String), level: "4" },
					value: "Section 1",
				},
				{
					tag: "p",
					attributes: {},
					value: "This is a paragraph.",
				},
				{
					tag: "div",
					attributes: { id: expect.any(String), level: "5" },
					value: [
						{
							tag: "head",
							attributes: { id: expect.any(String), level: "5" },
							value: "Subsection 1.1",
						},
						{
							tag: "p",
							attributes: {},
							value: "This is a sub-paragraph.",
						},
					],
				},
			],
		});
	});
});
