import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider";
import { TestDocumentNavigationContextProvider } from "../navigation/TestDocumentNavigationContextProvider";
import { TagCatalogProvider } from "../tags/TagCatalogProvider";
import { tagCatalog } from "../tags/tagCatalog";
import { TocHeading } from "./TocHeading";
import type { Heading } from "./useTableOfContent";

describe("TocHeading", () => {
	it("should render children as a tree", async () => {
		const navigateToHeading = vi.fn();

		const headings: Heading[] = [
			{
				id: "heading-1",
				content: "Heading 1",
				children: [
					{ id: "heading-1-1", content: "Heading 1.1", children: [] },
					{ id: "heading-1-2", content: "Heading 1.2", children: [] },
				],
			},
			{ id: "heading-2", content: "Heading 2", children: [] },
		];

		const screen = await render(<TocHeading headings={headings} />, {
			wrapper(props) {
				return (
					<I18nProvider>
						<TagCatalogProvider tagCatalog={tagCatalog}>
							<TestDocumentNavigationContextProvider
								value={{
									navigateToHeading,
								}}
							>
								{props.children}
							</TestDocumentNavigationContextProvider>
						</TagCatalogProvider>
					</I18nProvider>
				);
			},
		});

		const root = screen.getByRole("tree", {
			name: "Table des matières",
		});

		expect(root).toBeInTheDocument();

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

	it("should navigate to heading on click", async () => {
		const navigateToHeading = vi.fn();

		const headings: Heading[] = [
			{ id: "heading-1", content: "Heading 1", children: [] },
		];

		const screen = await render(<TocHeading headings={headings} />, {
			wrapper(props) {
				return (
					<I18nProvider>
						<TagCatalogProvider tagCatalog={tagCatalog}>
							<TestDocumentNavigationContextProvider
								value={{
									navigateToHeading,
								}}
							>
								{props.children}
							</TestDocumentNavigationContextProvider>
						</TagCatalogProvider>
					</I18nProvider>
				);
			},
		});

		const item = screen.getByRole("treeitem", { name: "Heading 1" });
		expect(item).toBeInTheDocument();

		await item.click();

		expect(navigateToHeading).toHaveBeenCalledWith("heading-1");
	});
});
