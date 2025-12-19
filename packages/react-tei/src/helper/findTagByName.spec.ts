import { describe, expect, it } from "vitest";

import type { DocumentJson } from "../parser/document.js";
import { findTagByName } from "./findTagByName.js";

const ABSTRACT: DocumentJson = {
	tag: "abstract",
	attributes: {},
	value: [
		{
			tag: "head",
			attributes: {},
			value: [
				{
					tag: "#text",
					attributes: {},
					value: "Abstract Headline",
				},
			],
		},
	],
};

const TEI_HEADER: DocumentJson = {
	tag: "teiHeader",
	attributes: {},
	value: [
		{
			tag: "fileDesc",
			attributes: {},
			value: [],
		},
		{
			tag: "profileDesc",
			attributes: {},
			value: [{ tag: "creation", attributes: {}, value: [] }, ABSTRACT],
		},
	],
};

const TEXT: DocumentJson = {
	tag: "text",
	attributes: {},
	value: [],
};
const DOCUMENT: DocumentJson[] = [
	{
		tag: "TEI",
		value: [TEI_HEADER, TEXT],
	},
];

describe("findTagByName", () => {
	it("should return the sub-document with the given tag name", () => {
		const header = findTagByName(DOCUMENT, "teiHeader");
		expect(header).toEqual(TEI_HEADER);
	});

	it("should return undefined if the tag is not found", () => {
		const result = findTagByName(DOCUMENT, "nonExistentTag");
		expect(result).toBeUndefined();
	});

	it("should return nested tag", () => {
		const result = findTagByName(DOCUMENT, "abstract");
		expect(result).toEqual(ABSTRACT);
	});

	it("should only search up to the specified max depth", () => {
		const result = findTagByName(DOCUMENT, "abstract", 2);
		expect(result).toBeUndefined();
	});

	it("should support searching from a single DocumentJson object", () => {
		const result = findTagByName(TEI_HEADER, "abstract");
		expect(result).toEqual(ABSTRACT);
	});

	it("should return undefined when document is undefined", () => {
		const result = findTagByName(undefined, "anyTag");
		expect(result).toBeUndefined();
	});
});
