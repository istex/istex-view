import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import { FileViewer } from "./FileViewer";

describe("FileViewer", () => {
	it("should render the upload button", async () => {
		const screen = await render(
			<I18nProvider>
				<FileViewer />
			</I18nProvider>,
		);

		await expect
			.element(
				screen.getByRole("button", {
					name: "Document TEI",
				}),
			)
			.toBeInTheDocument();
	});

	it("should render the XML document when a tei file is uploaded", async () => {
		const screen = await render(
			<I18nProvider>
				<FileViewer />
			</I18nProvider>,
		);

		const file = new File(
			[
				`<?xml version="1.0" encoding="UTF-8"?>
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
			],
			"example.tei",
			{
				type: "text/plain",
			},
		);

		const input = screen.getByTestId("tei-file-selector-input");

		await userEvent.upload(input, file);

		await screen.getByRole("button", { name: "Lancer la visionneuse" }).click();

		await expect
			.element(screen.getByText("TEI Test Title"))
			.toBeInTheDocument();
	});
});
