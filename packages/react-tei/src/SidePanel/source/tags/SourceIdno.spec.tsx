import { afterAll, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../../i18n/I18nProvider";
import { TagCatalogProvider } from "../../../tags/TagCatalogProvider";
import { tagCatalog } from "../../../tags/tagCatalog";
import { SourceIdno } from "./SourceIdno";

vi.mock("../../debug/debug.const", () => ({
	IS_DEBUG: true,
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
	<I18nProvider>
		<TagCatalogProvider tagCatalog={tagCatalog}>{children}</TagCatalogProvider>
	</I18nProvider>
);

// Mock Value and DebugTag for isolation
describe("SourceIdno", () => {
	afterAll(() => {
		vi.resetAllMocks();
	});
	it.each([
		["eISBN", "123-456-789", "ISBN 123-456-789 (électronique)"],
		["pISBN", "987-654-321", "ISBN 987-654-321 (papier)"],
		["eISSN", "9876-5432", "ISSN 9876-5432 (électronique)"],
		["pISSN", "2345-6789", "ISSN 2345-6789 (papier)"],
	])("renders %s type with label", async (type, value, expectedText) => {
		const data = {
			tag: "idno",
			attributes: { "@type": type },
			value: value,
		};
		const screen = await render(<SourceIdno data={data} />, {
			wrapper: Wrapper,
		});
		expect(screen.getByText(expectedText)).toBeVisible();
	});
});
