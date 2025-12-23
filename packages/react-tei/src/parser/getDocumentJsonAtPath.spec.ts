import { describe, expect, it } from "vitest";
import { getDocumentJsonAtPath } from "./getDocumentJsonAtPath";

describe("getDocumentJsonAtPath", () => {
	const documentJson = [
		{
			tag: "TEI",
			value: [
				{
					tag: "teiHeader",
					value: [
						{
							tag: "fileDesc",
							value: [
								{
									tag: "titleStmt",
									value: [{ tag: "title", value: "Content of title" }],
								},
							],
						},
						{
							tag: "fileDesc",
							value: [{ tag: "author", value: "Content of fileDesc" }],
						},
						{
							tag: "sourceDesc",
							value: [{ tag: "namesdates", value: "Content of namesdates" }],
						},
					],
				},
				{
					tag: "text",
					value: [
						{ tag: "body", value: [{ tag: "div", value: "Content of div" }] },
						{
							tag: "body",
							value: [{ tag: "div", value: "Content of div sibling" }],
						},
					],
				},
			],
		},
	];

	it.each([
		[["TEI", "text", "body", "div"], { tag: "div", value: "Content of div" }],
		[
			["TEI", "text", "body"],
			{
				tag: "body",
				value: [{ tag: "div", value: "Content of div" }],
			},
		],
		[["TEI", "text", "header"], undefined],
		[
			["TEI", "teiHeader", "fileDesc", "author"],
			{ tag: "author", value: "Content of fileDesc" },
		],
		[
			["TEI", "teiHeader", "fileDesc", "titleStmt"],
			{
				tag: "titleStmt",
				value: [{ tag: "title", value: "Content of title" }],
			},
		],
		[
			["TEI", "teiHeader", "fileDesc"],
			{
				tag: "fileDesc",
				value: [
					{
						tag: "titleStmt",
						value: [{ tag: "title", value: "Content of title" }],
					},
				],
			},
		],
		[
			["TEI", "teiHeader", "sourceDesc", "namesdates"],
			{ tag: "namesdates", value: "Content of namesdates" },
		],
		[
			["TEI", "teiHeader", "sourceDesc"],
			{
				tag: "sourceDesc",
				value: [{ tag: "namesdates", value: "Content of namesdates" }],
			},
		],
	])("should return the document Json at the specified path", (path, expectedDocument) => {
		const result = getDocumentJsonAtPath(documentJson, path);
		expect(result).toStrictEqual(expectedDocument);
	});

	it("should return undefined for a non-existing path", () => {
		const path = ["TEI", "text", "header"];
		const result = getDocumentJsonAtPath(documentJson, path);

		expect(result).toBeUndefined();
	});

	it("should return undefined when path is empty", () => {
		const path: string[] = [];
		const result = getDocumentJsonAtPath(documentJson, path);

		expect(result).toBeUndefined();
	});
});
