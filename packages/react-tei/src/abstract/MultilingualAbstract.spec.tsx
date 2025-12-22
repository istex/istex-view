import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider.js";
import type { DocumentJson } from "../parser/document.js";
import { TagCatalogProvider } from "../tags/TagCatalogProvider.js";
import { tagCatalog } from "../tags/tagCatalog.js";
import { MultilingualAbstract } from "./MultilingualAbstract.js";

const abstracts: DocumentJson[] = [
	{
		tag: "abstract",
		attributes: { "@xml:lang": "en" },
		value: [
			{
				tag: "p",
				attributes: {},
				value: [
					{
						tag: "#text",
						value: "This is an abstract in English.",
					},
				],
			},
		],
	},
	{
		tag: "abstract",
		attributes: { "@xml:lang": "fr" },
		value: [
			{
				tag: "p",
				attributes: {},
				value: [
					{
						tag: "#text",
						value: "Ceci est un ",
					},
					{
						tag: "hi",
						attributes: { rend: "italic" },
						value: [
							{
								tag: "#text",
								value: "résumé",
							},
						],
					},
					{
						tag: "#text",
						value: " en français.",
					},
				],
			},
		],
	},
];

async function renderMultilingualAbstract() {
	const screen = await render(<MultilingualAbstract abstracts={abstracts} />, {
		wrapper: ({ children }) => (
			<I18nProvider>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			</I18nProvider>
		),
	});

	const section = screen.getByRole("region", {
		name: "Résumé",
	});

	expect(section).toBeVisible();

	const heading = section.getByRole("heading", { level: 3, name: "Résumé" });
	expect(heading).toBeVisible();

	expect(section.getByRole("tablist")).not.toBeInTheDocument();
	expect(section.getByRole("paragraph")).not.toBeInTheDocument();

	await heading.click();

	const tablist = section.getByRole("tablist");
	expect(tablist).toBeVisible();

	const englishTab = tablist.getByRole("tab", { name: "anglais" });
	expect(englishTab).toBeVisible();

	const frenchTab = tablist.getByRole("tab", { name: "français" });
	expect(frenchTab).toBeVisible();

	return { section, englishTab, frenchTab };
}

describe("MultilingualAbstract", () => {
	beforeEach(() => {
		// Avoid console warnings during tests
		vi.spyOn(console, "warn").mockImplementation(() => {});
	});

	it("should render multiple render language selector as tabs", async () => {
		const { section, englishTab } = await renderMultilingualAbstract();

		expect(englishTab).toHaveAttribute("aria-selected", "true");

		expect(
			section.getByRole("paragraph").filter({
				hasText: "This is an abstract in English.",
			}),
		).toBeVisible();
	});

	it("should support switching to French tab", async () => {
		const { section, frenchTab } = await renderMultilingualAbstract();

		await frenchTab.click();

		expect(frenchTab).toHaveAttribute("aria-selected", "true");

		expect(
			section.getByRole("paragraph").filter({
				hasText: "Ceci est un résumé en français.",
			}),
		).toBeVisible();
	});

	it("should not render if no abstracts are provided", async () => {
		const screen = await render(<MultilingualAbstract abstracts={[]} />, {
			wrapper: I18nProvider,
		});

		expect(screen.getByRole("region")).not.toBeInTheDocument();
	});

	it("should not render anything if no language attribute is present", async () => {
		const abstractsWithMissingLang: DocumentJson[] = [
			{
				tag: "abstract",
				attributes: {},
				value: [
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								value: "This abstract has no language attribute.",
							},
						],
					},
				],
			},
		];

		const screen = await render(
			<MultilingualAbstract abstracts={abstractsWithMissingLang} />,
			{ wrapper: I18nProvider },
		);

		const section = screen.getByRole("region", {
			name: "Résumé",
		});

		expect(section).not.toBeInTheDocument();
	});
});
