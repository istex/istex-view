import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { ViewerPage } from "./ViewerPage";

vi.mock("./useViewerContext", () => {
	return {
		useViewerContext: vi.fn().mockReturnValue({
			viewerLaunched: true,
			document: {
				content: `<?xml version="1.0" encoding="UTF-8"?>
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
			},
		}),
	};
});

describe("ViewerPage", () => {
	it("should render Viewer when document is provided and viewerLaunched is true", async () => {
		const screen = await render(<ViewerPage />);

		expect(screen.getByText("TEI Test Title")).toBeInTheDocument();
	});

	it("should not render Viewer when document is not provided", async () => {
		const { useViewerContext } = await import("./useViewerContext");
		(useViewerContext as ReturnType<typeof vi.fn>).mockReturnValue({
			viewerLaunched: true,
			document: null,
		});

		const screen = await render(<ViewerPage />);

		expect(screen.getByText("TEI Test Title")).not.toBeInTheDocument();
	});

	it("should not render Viewer when viewerLaunched is false", async () => {
		const { useViewerContext } = await import("./useViewerContext");
		(useViewerContext as ReturnType<typeof vi.fn>).mockReturnValue({
			viewerLaunched: false,
			document: {
				content: `<?xml version="1.0" encoding="UTF-8"?>
				<TEI>
					<teiHeader>
						<fileDesc>
							<titleStmt>
								<title level="a" type="main">TEI Test Title</title>		
							</titleStmt>
						</fileDesc>
					</teiHeader>
				</TEI>`,
			},
		});

		const screen = await render(<ViewerPage />);

		expect(screen.getByText("TEI Test Title")).not.toBeInTheDocument();
	});
});
