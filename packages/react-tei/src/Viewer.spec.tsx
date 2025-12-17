import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Viewer } from "./Viewer.js";

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

		expect(screen.getByText("This is a test document.")).toBeInTheDocument();
		expect(screen.getByText("Content of section 1.")).toBeInTheDocument();
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
						<note>
							<note>This is a table note.</note>
						</note>
					</table>
				</body>
			</text>
		</TEI>`;

		const screen = await render(<Viewer document={document} />);

		expect(
			screen.getByRole("table", {
				name: "Table 1: Sample Table",
			}),
		).toBeVisible();

		expect(screen.getByRole("caption")).toBeVisible();
		expect(screen.getByRole("caption")).toHaveTextContent(
			"Table 1: Sample Table",
		);

		expect(
			screen.getByRole("columnheader", { name: "Header 1" }),
		).toBeVisible();
		expect(
			screen.getByRole("columnheader", { name: "Header 2" }),
		).toBeVisible();

		expect(screen.getByRole("cell", { name: "Data 1" })).toBeVisible();
		expect(screen.getByRole("cell", { name: "Data 2" })).toBeVisible();
		expect(screen.getByText("This is a table note.")).toBeVisible();
	});
});
