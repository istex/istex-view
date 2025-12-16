import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { ViewerPage } from "./ViewerPage.js";

vi.mock("./useViewerContext", () => {
	return {
		useViewerContext: vi.fn().mockReturnValue({
			document: `<?xml version="1.0" encoding="UTF-8"?>
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
								<title level="a" type="main">TEI Test Title</title>
							</titleStmt>
						</fileDesc>
					</teiHeader>
				</TEI>`,
		}),
	};
});

describe("ViewerPage", () => {
	it("should render Viewer when document is provided", async () => {
		const screen = await render(<ViewerPage />);

		expect(screen.getByText("TEI Test Title")).toBeInTheDocument();
	});
});
