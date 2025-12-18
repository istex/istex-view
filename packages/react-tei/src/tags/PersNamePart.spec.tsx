import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document.js";
import { getDescriptionKey, PersNamePart } from "./PersNamePart.js";

describe("PersNamePart", () => {
	describe("getDescriptionKey", () => {
		it.each([
			[
				{
					tag: "forename",
					value: [],
				},
				"forename",
				null,
			],
			[
				{
					tag: "roleName",
					attributes: { "@type": "honorific" },
					value: [],
				},
				"honorific",
				null,
			],
			[
				{
					tag: "roleName",
					attributes: { "@type": "degree" },
					value: [],
				},
				"degree",
				null,
			],
			[
				{
					tag: "roleName",
					attributes: { "@type": "unknown" },
					value: [],
				},
				null,
				"PersNamePart roleName missing or invalid @type:",
			],
			[
				{
					tag: "roleName",
					attributes: {},
					value: [],
				},
				null,
				"PersNamePart roleName missing or invalid @type:",
			],
			[
				{
					tag: "surname",
					value: [],
				},
				"surname",
				null,
			],
			[
				{
					tag: "genName",
					value: [],
				},
				"genName",
				null,
			],
			[
				{
					tag: "nameLink",
					value: [],
				},
				"nameLink",
				null,
			],
			[
				{
					tag: "addName",
					value: [],
				},
				"addName",
				null,
			],
			[
				{
					tag: "orgName",
					value: [],
				},
				"orgName",
				null,
			],
			[
				{
					tag: "unknownTag",
					value: [],
				},
				null,
				"PersNamePart unknown tag:",
			],
		])("should return description type", (input: DocumentJson, expected:
			| string
			| null, warning: string | null) => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			const descriptionKey = getDescriptionKey(input);

			expect(descriptionKey).toBe(expected);

			if (warning) {
				expect(consoleWarnSpy).toHaveBeenCalledWith(warning, input);
			} else {
				expect(consoleWarnSpy).not.toHaveBeenCalled();
			}

			consoleWarnSpy.mockRestore();
		});
	});

	it("should render PersNamePart value with aria-description", async () => {
		const { getByText } = await render(
			<PersNamePart
				data={{
					tag: "forename",
					value: [{ tag: "#text", value: "John" }],
				}}
			/>,
		);

		const spanElement = getByText("John");
		expect(spanElement).toBeInTheDocument();
		expect(spanElement).toHaveAttribute(
			"aria-description",
			"sidebar.author.forename",
		);
	});

	it("should render PersNamePart value without aria-description for unknown description type", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
		const { getByText } = await render(
			<PersNamePart
				data={{
					tag: "roleName",
					attributes: { "@type": "unknown" },
					value: [{ tag: "#text", value: "Unknown Role" }],
				}}
			/>,
		);

		const spanElement = getByText("Unknown Role");
		expect(spanElement).toBeInTheDocument();
		expect(spanElement).not.toHaveAttribute("aria-description");

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"PersNamePart roleName missing or invalid @type:",
			{
				tag: "roleName",
				attributes: { "@type": "unknown" },
				value: [{ tag: "#text", value: "Unknown Role" }],
			},
		);

		consoleWarnSpy.mockRestore();
	});

	it("should render nothing and  log a warning if data.value is not an array", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

		const { container } = await render(
			<PersNamePart
				data={{
					tag: "forename",
					value: "Not an array" as unknown as DocumentJson[],
				}}
			/>,
		);

		expect(container).toBeEmptyDOMElement();

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"PersName data.value is not an array:",
			"Not an array",
		);

		consoleWarnSpy.mockRestore();
	});

	it("should render nothing and log a warning if data.value is an empty array", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

		const { container } = await render(
			<PersNamePart
				data={{
					tag: "forename",
					value: [],
				}}
			/>,
		);

		expect(container).toBeEmptyDOMElement();

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"PersNamePart data.value is empty:",
			{
				tag: "forename",
				value: [],
			},
		);

		consoleWarnSpy.mockRestore();
	});

	it("");
});
