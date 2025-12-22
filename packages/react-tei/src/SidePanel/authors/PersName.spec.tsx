import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { authorTagCatalogs } from "./authorsTagCatalog";
import { PersName } from "./PersName";

describe("PersName", () => {
	it("should render PersName value", async () => {
		const { getByText } = await render(
			<PersName
				data={{
					tag: "persName",
					value: [
						{ tag: "forename", value: [{ tag: "#text", value: "John" }] },
						{ tag: "surname", value: [{ tag: "#text", value: "Doe" }] },
					],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={authorTagCatalogs}>
						{children}
					</TagCatalogProvider>
				),
			},
		);
		expect(getByText("John")).toBeInTheDocument();
		expect(getByText("John")).toHaveAttribute(
			"aria-description",
			"sidePanel.author.forename",
		);
		expect(getByText("Doe")).toBeInTheDocument();
		expect(getByText("John")).toHaveAttribute("aria-description", undefined);
	});

	it("should render nothing and log a warning if data.value is not an array", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

		const { container } = await render(
			<PersName
				data={{
					tag: "persName",
					value: "Not an array" as unknown as DocumentJson[],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={authorTagCatalogs}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		expect(container).toBeEmptyDOMElement();

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"PersName data.value is not an array:",
			"Not an array",
		);

		consoleWarnSpy.mockRestore();
	});

	it("should render nothing and log a warning if data.value is an empty array", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

		const { container } = await render(
			<PersName
				data={{
					tag: "persName",
					value: [],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={authorTagCatalogs}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		expect(container).toBeEmptyDOMElement();

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"PersName data.value is empty:",
			{
				tag: "persName",
				value: [],
			},
		);

		consoleWarnSpy.mockRestore();
	});
});
