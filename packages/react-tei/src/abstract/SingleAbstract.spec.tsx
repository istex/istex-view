import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider.js";
import type { DocumentJson } from "../parser/document.js";
import { SingleAbstract } from "./SingleAbstract.js";

describe("SingleAbstract", () => {
	it("should return an abstract with simple value", async () => {
		const abstractJson: DocumentJson = {
			tag: "abstract",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: [
						{
							tag: "#text",
							value: "Sample Abstract Title",
						},
					],
				},
				{
					tag: "p",
					attributes: {},
					value: [
						{
							tag: "#text",
							value: "This is a sample abstract with text content.",
						},
					],
				},
			],
		};

		const screen = await render(<SingleAbstract abstract={abstractJson} />, {
			wrapper: I18nProvider,
		});

		const section = screen.getByRole("region", {
			name: "Sample Abstract Title",
		});

		expect(section).toBeVisible();

		const heading = section.getByRole("heading", {
			level: 3,
			name: "Sample Abstract Title",
		});
		expect(heading).toBeVisible();

		expect(section.getByRole("paragraph")).not.toBeInTheDocument();

		await heading.click();

		expect(
			section.getByRole("paragraph").filter({
				hasText: "This is a sample abstract with text content.",
			}),
		).toBeVisible();
	});

	it("should return an abstract with nested tags", async () => {
		const abstractJson: DocumentJson = {
			tag: "abstract",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: [
						{
							tag: "#text",
							value: "Sample Abstract Title",
						},
					],
				},
				{
					tag: "p",
					attributes: {},
					value: [
						{
							tag: "#text",
							value: "This is a sample abstract with a ",
						},
						{
							tag: "hi",
							attributes: { rend: "italic" },
							value: [
								{
									tag: "#text",
									value: "highlighted",
								},
							],
						},
						{
							tag: "#text",
							value: " word.",
						},
					],
				},
			],
		};

		const screen = await render(<SingleAbstract abstract={abstractJson} />, {
			wrapper: I18nProvider,
		});

		const section = screen.getByRole("region", {
			name: "Sample Abstract Title",
		});

		expect(section).toBeVisible();

		const heading = section.getByRole("heading", {
			level: 3,
			name: "Sample Abstract Title",
		});
		expect(heading).toBeVisible();

		expect(section.getByRole("paragraph")).not.toBeInTheDocument();

		await heading.click();

		expect(
			section.getByRole("paragraph").filter({
				hasText: "This is a sample abstract with a highlighted word.",
			}),
		).toBeVisible();
	});

	it("should support abstracts without head", async () => {
		const abstractJson: DocumentJson = {
			tag: "abstract",
			attributes: {},
			value: [
				{
					tag: "p",
					attributes: {},
					value: [
						{
							tag: "#text",
							value: "This abstract has no head element.",
						},
					],
				},
			],
		};

		const screen = await render(<SingleAbstract abstract={abstractJson} />, {
			wrapper: I18nProvider,
		});

		const section = screen.getByRole("region", {
			name: "Résumé",
		});

		expect(section).toBeVisible();

		const heading = section.getByRole("heading", { level: 3, name: "Résumé" });
		expect(heading).toBeVisible();

		expect(section.getByRole("paragraph")).not.toBeInTheDocument();

		await heading.click();

		expect(
			section.getByRole("paragraph").filter({
				hasText: "This abstract has no head element.",
			}),
		).toBeVisible();
	});

	it("should render an abstract with sections", async () => {
		const abstractJson: DocumentJson = {
			tag: "abstract",
			attributes: {},
			value: [
				{
					tag: "div",
					attributes: { type: "section" },
					value: [
						{
							tag: "head",
							attributes: {},
							value: [
								{
									tag: "#text",
									value: "Section 1",
								},
							],
						},
						{
							tag: "p",
							attributes: {},
							value: [
								{
									tag: "#text",
									value: "Content of section 1.",
								},
							],
						},
					],
				},
			],
		};

		const screen = await render(<SingleAbstract abstract={abstractJson} />, {
			wrapper: I18nProvider,
		});

		const section = screen.getByRole("region", {
			name: "Résumé",
		});

		expect(section).toBeVisible();

		const heading = section.getByRole("heading", { level: 3, name: "Résumé" });
		expect(heading).toBeVisible();

		expect(
			section.getByRole("region", { name: "Section 1" }),
		).not.toBeInTheDocument();

		await heading.click();

		const subSection = section.getByRole("region", { name: "Section 1" });
		expect(subSection).toBeVisible();

		const subHeading = subSection.getByRole("heading", {
			level: 4,
			name: "Section 1",
		});
		expect(subHeading).toBeVisible();

		expect(
			subSection.getByRole("paragraph").filter({
				hasText: "Content of section 1.",
			}),
		).toBeVisible();
	});
});
