import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { I18nProvider } from "./i18n/I18nProvider";
import { Viewer } from "./Viewer";

describe("Viewer", () => {
	it("should display the document as text", async () => {
		const screen = await render(
			<Viewer
				document={`<?xml version="1.0" encoding="UTF-8"?>
				<TEI xmlns:ns1="https://xml-schema.delivery.istex.fr/formats/ns1.xsd"
					xmlns="http://www.tei-c.org/ns/1.0"
					xmlns:tei="http://www.tei-c.org/ns/1.0"
					xmlns:sa="http://www.elsevier.com/xml/common/struct-aff/dtd"
					xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
					xsi:noNamespaceSchemaLocation="https://xml-schema.delivery.istex.fr/formats/tei-istex.xsd"
					xml:lang="en"
				>
					<teiHeader>
						<fileDesc>
							<titleStmt>
								<title level="a" type="main">TEI <hi rend="italic">Test</hi> Title</title>
							</titleStmt>
						</fileDesc>
					</teiHeader>
					<text>
						<body>
							<div>
								<head>Introduction</head>
								<p>This is a test document.</p>
								<div>
									<head>Section 1</head>
									<p>Content of section 1.</p>
								</div>
							</div>
						</body>
					</text>
				</TEI>`}
			/>,
			{
				wrapper: I18nProvider,
			},
		);

		expect(
			screen.getByRole("heading", { level: 1, name: "TEI Test Title" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { level: 2, name: "Introduction" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { level: 3, name: "Section 1" }),
		).toBeInTheDocument();

		await expect
			.element(screen.getByText("This is a test document."))
			.toBeInTheDocument();
		await expect
			.element(screen.getByText("Content of section 1."))
			.toBeInTheDocument();
	});

	it("should render a table", async () => {
		const document = `<?xml version="1.0" encoding="UTF-8"?>
		<TEI xmlns="http://www.tei-c.org/ns/1.0">
			<teiHeader>
				<fileDesc>
					<titleStmt>
						<title level="a" type="main">TEI <hi rend="italic">Test</hi> Title</title>
					</titleStmt>
				</fileDesc>
			</teiHeader>
			<text>
				<body>
					<table xml:id="t1">
						<head type="label">T<sc>able</sc> 1</head>
						<head>Sample Table</head>
						<row role="label">
							<cell>Header 1</cell>
							<cell>Header 2</cell>
						</row>
						<row role="data">
							<cell>Data 1</cell>
							<cell>Data 2</cell>
						</row>
						<note type="table-wrap-foot">
							<note>This is a table note.</note>
						</note>
					</table>
				</body>
			</text>
		</TEI>`;

		const screen = await render(<Viewer document={document} />, {
			wrapper: I18nProvider,
		});

		expect(
			screen.getByRole("table", {
				name: "Table 1 Sample Table",
			}),
		).toBeVisible();

		await expect.element(screen.getByRole("caption")).toBeVisible();
		await expect
			.element(screen.getByRole("caption"))
			.toHaveTextContent("Table 1 Sample Table");

		expect(
			screen.getByRole("columnheader", { name: "Header 1" }),
		).toBeVisible();
		expect(
			screen.getByRole("columnheader", { name: "Header 2" }),
		).toBeVisible();

		await expect
			.element(screen.getByRole("cell", { name: "Data 1" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("cell", { name: "Data 2" }))
			.toBeVisible();
		expect(
			screen.getByRole("note").filter({
				hasText: "This is a table note.",
			}),
		).toBeVisible();
	});

	it("should render the abstract with toggle", async () => {
		const document = `<?xml version="1.0" encoding="UTF-8"?>
		<TEI xmlns="http://www.tei-c.org/ns/1.0">
			<teiHeader>
				<fileDesc>
					<titleStmt>
						<title level="a" type="main">TEI <hi rend="italic">Test</hi> Title</title>
					</titleStmt>
				</fileDesc>
				<profileDesc>
					<abstract xml:lang="en">
						<p>This is the English abstract.</p>
					</abstract>
					<abstract xml:lang="fr">
						<p>Ceci est le résumé en français.</p>
					</abstract>
				</profileDesc>
			</teiHeader>
			<text>
				<body>
					<p>Document body content.</p>
				</body>
			</text>
		</TEI>`;

		const screen = await render(<Viewer document={document} />, {
			wrapper: I18nProvider,
		});

		const abstractRegion = screen.getByRole("region", {
			name: "Résumé",
		});
		expect(abstractRegion).toBeVisible();

		await abstractRegion.click();

		const tabs = screen.getByRole("tablist");
		expect(tabs).toBeVisible();

		const englishTab = screen.getByRole("tab", { name: "anglais" });
		const frenchTab = screen.getByRole("tab", { name: "français" });

		expect(englishTab).toBeVisible();
		expect(frenchTab).toBeVisible();

		expect(
			abstractRegion.getByText("This is the English abstract."),
		).toBeVisible();

		await frenchTab.click();

		expect(
			abstractRegion.getByText("This is the English abstract."),
		).not.toBeInTheDocument();
		expect(
			abstractRegion.getByText("Ceci est le résumé en français."),
		).toBeVisible();
	});

	it("should render table of contents", async () => {
		const document = `<?xml version="1.0" encoding="UTF-8"?>
		<TEI xmlns="http://www.tei-c.org/ns/1.0">
			<teiHeader>
				<fileDesc>
					<titleStmt>
						<title level="a" type="main">TEI <hi rend="italic">Test</hi> Title</title>
					</titleStmt>
				</fileDesc>
			</teiHeader>
			<text>
				<body>
					<div>
						<head>Heading 1</head>
						<p>Content of section 1.</p>
						<div>
							<head>Heading 1.1</head>
							<p>Content of subsection 1.1.</p>
						</div>
						<div>
							<head>Heading 1.2</head>
							<p>Content of subsection 1.2.</p>
						</div>
					</div>
					<div>
						<head>Heading 2</head>
						<p>Content of section 2.</p>
					</div>
				</body>
			</text>
		</TEI>`;

		const screen = await render(<Viewer document={document} />, {
			wrapper: I18nProvider,
		});

		const root = screen.getByRole("tree", {
			name: "Table des matières",
		});

		expect(
			root.getByRole("treeitem", { name: "Heading 1", exact: true }),
		).toBeInTheDocument();

		const childList = root.getByRole("group");
		expect(
			childList.getByRole("treeitem", { name: "Heading 1.1" }),
		).toBeInTheDocument();
		expect(
			childList.getByRole("treeitem", { name: "Heading 1.2" }),
		).toBeInTheDocument();

		expect(
			root.getByRole("treeitem", { name: "Heading 2" }),
		).toBeInTheDocument();
	});
});
