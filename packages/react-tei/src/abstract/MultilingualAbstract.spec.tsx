import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider";
import type { DocumentJson } from "../parser/document";
import { TagCatalogProvider } from "../tags/TagCatalogProvider";
import { tagCatalog } from "../tags/tagCatalog";
import { MultilingualAbstract } from "./MultilingualAbstract";

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

const abstracts6Languages: DocumentJson[] = [
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
						value: "Ceci est un résumé en français.",
					},
				],
			},
		],
	},
	{
		tag: "abstract",
		attributes: { "@xml:lang": "de" },
		value: [
			{
				tag: "p",
				attributes: {},
				value: [
					{
						tag: "#text",
						value: "Dies ist eine Zusammenfassung auf Deutsch.",
					},
				],
			},
		],
	},
	{
		tag: "abstract",
		attributes: { "@xml:lang": "es" },
		value: [
			{
				tag: "p",
				attributes: {},
				value: [
					{
						tag: "#text",
						value: "Este es un resumen en español.",
					},
				],
			},
		],
	},
	{
		tag: "abstract",
		attributes: { "@xml:lang": "it" },
		value: [
			{
				tag: "p",
				attributes: {},
				value: [
					{
						tag: "#text",
						value: "Questo è un riassunto in italiano.",
					},
				],
			},
		],
	},
	{
		tag: "abstract",
		attributes: { "@xml:lang": "pt" },
		value: [
			{
				tag: "p",
				attributes: {},
				value: [
					{
						tag: "#text",
						value: "Este é um resumo em português.",
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

		await expect.element(screen.getByRole("region")).not.toBeInTheDocument();
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

	it("should render navigation buttons when more than 4 languages are present", async () => {
		const screen = await render(
			<MultilingualAbstract abstracts={abstracts6Languages} />,
			{
				wrapper: ({ children }) => (
					<I18nProvider>
						<TagCatalogProvider tagCatalog={tagCatalog}>
							{children}
						</TagCatalogProvider>
					</I18nProvider>
				),
			},
		);

		const section = screen.getByRole("region", {
			name: "Résumé",
		});

		expect(section).toBeVisible();

		const heading = section.getByRole("heading", { level: 3, name: "Résumé" });
		expect(heading).toBeVisible();

		await heading.click();

		const tablist = section.getByRole("tablist");
		expect(tablist).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "anglais",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "français",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "allemand",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "espagnol",
			}),
		).toBeVisible();
		// The following languages should not be visible initially
		expect(
			tablist.getByRole("tab", {
				name: "italien",
			}),
		).not.toBeInTheDocument();
		expect(
			tablist.getByRole("tab", {
				name: "portugais",
			}),
		).not.toBeInTheDocument();

		const previousButton = tablist.getByRole("button", {
			name: "Langue précédente",
		});
		const nextButton = tablist.getByRole("button", {
			name: "Langue suivante",
		});

		expect(previousButton).toBeVisible();
		expect(previousButton).toBeDisabled();
		expect(nextButton).toBeVisible();
		expect(nextButton).not.toBeDisabled();

		// Click next to navigate to the next set of languages
		await nextButton.click();

		expect(previousButton).not.toBeDisabled();

		expect(
			tablist.getByRole("tab", {
				name: "anglais",
			}),
		).not.toBeInTheDocument();
		expect(
			tablist.getByRole("tab", {
				name: "français",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "allemand",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "espagnol",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "italien",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "portugais",
			}),
		).not.toBeInTheDocument();

		await tablist
			.getByRole("button", {
				name: "Langue précédente",
			})
			.click();

		expect(
			tablist.getByRole("tab", {
				name: "anglais",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "français",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "allemand",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "espagnol",
			}),
		).toBeVisible();
		expect(
			tablist.getByRole("tab", {
				name: "italien",
			}),
		).not.toBeInTheDocument();
		expect(
			tablist.getByRole("tab", {
				name: "portugais",
			}),
		).not.toBeInTheDocument();
	});

	it("should not render navigation buttons when 4 or fewer languages are present", async () => {
		const screen = await render(
			<MultilingualAbstract abstracts={abstracts} />,
			{
				wrapper: ({ children }) => (
					<I18nProvider>
						<TagCatalogProvider tagCatalog={tagCatalog}>
							{children}
						</TagCatalogProvider>
					</I18nProvider>
				),
			},
		);

		const section = screen.getByRole("region", {
			name: "Résumé",
		});

		expect(section).toBeVisible();

		const heading = section.getByRole("heading", { level: 3, name: "Résumé" });
		expect(heading).toBeVisible();

		await heading.click();

		const tablist = section.getByRole("tablist");
		expect(tablist).toBeVisible();

		expect(
			tablist.getByRole("button", {
				name: "Langue précédente",
			}),
		).not.toBeInTheDocument();
		expect(
			tablist.getByRole("button", {
				name: "Langue suivante",
			}),
		).not.toBeInTheDocument();
	});
});
