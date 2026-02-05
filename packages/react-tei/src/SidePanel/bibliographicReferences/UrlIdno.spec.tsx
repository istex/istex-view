import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";
import { UrlIdno } from "./UrlIdno";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
			{children}
		</TagCatalogProvider>
	);
}

describe("UrlIdno", () => {
	it("should render a link when text starts with https://", async () => {
		const jsonValue: DocumentJson = {
			tag: "idno",
			attributes: {},
			value: [{ tag: "#text", value: "https://example.com/article" }],
		};

		const screen = await render(<UrlIdno data={jsonValue} />, {
			wrapper: TestWrapper,
		});

		const link = screen.getByRole("link");
		expect(link).toBeVisible();
		expect(link).toHaveAttribute("href", "https://example.com/article");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
		expect(link).toHaveTextContent("https://example.com/article");
	});

	it("should render a link when text starts with http://", async () => {
		const jsonValue: DocumentJson = {
			tag: "idno",
			attributes: {},
			value: [{ tag: "#text", value: "http://example.com/article" }],
		};

		const screen = await render(<UrlIdno data={jsonValue} />, {
			wrapper: TestWrapper,
		});

		const link = screen.getByRole("link");
		expect(link).toBeVisible();
		expect(link).toHaveAttribute("href", "http://example.com/article");
		expect(link).toHaveAttribute("target", "_blank");
	});

	it("should render plain text when text does not start with http:// or https://", async () => {
		const jsonValue: DocumentJson = {
			tag: "idno",
			attributes: {},
			value: [{ tag: "#text", value: "doi:10.1234/example" }],
		};

		const screen = await render(<UrlIdno data={jsonValue} />, {
			wrapper: TestWrapper,
		});

		expect(screen.getByText("doi:10.1234/example")).toBeVisible();
		expect(screen.container.querySelector("a")).toBeNull();
	});

	it('should not render anything when @type is "ORCID"', async () => {
		const jsonValue: DocumentJson = {
			tag: "idno",
			attributes: { "@type": "ORCID" },
			value: [{ tag: "#text", value: "https://orcid.org/0000-0001-2345-6789" }],
		};

		const screen = await render(<UrlIdno data={jsonValue} />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.container).toBeEmptyDOMElement();
	});
});
