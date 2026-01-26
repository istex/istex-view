import { afterAll, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { tagCatalog } from "../../tags/tagCatalog";
import { DocumentSidePanelContextProvider } from "../DocumentSidePanelContext";
import { DocumentIdentifierIdno } from "./DocumentIdentifierIdno";

vi.mock("../../debug/debug.const", () => ({
	IS_DEBUG: true,
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
	<DocumentSidePanelContextProvider>
		<TagCatalogProvider tagCatalog={tagCatalog}>{children}</TagCatalogProvider>
	</DocumentSidePanelContextProvider>
);

// Mock Value and DebugTag for isolation
describe("DocumentIdentifierIdno", () => {
	afterAll(() => {
		vi.resetAllMocks();
	});
	it("renders idn of DOI type", async () => {
		const data = {
			tag: "idno",
			attributes: { "@type": "DOI" },
			value: "10.1000/182/xyz",
		};
		const screen = await render(<DocumentIdentifierIdno data={data} />, {
			wrapper: Wrapper,
		});
		expect(screen.getByText("10.1000/182/xyz")).toBeVisible();
	});

	it("renders DebugTag for unsupported type", async () => {
		const data = {
			tag: "idno",
			attributes: { "@type": "other" },
			value: "something else",
		};
		const screen = await render(<DocumentIdentifierIdno data={data} />, {
			wrapper: Wrapper,
		});
		await expect
			.element(screen.container.querySelector(".debug") as HTMLElement)
			.toBeInTheDocument();
	});
});
