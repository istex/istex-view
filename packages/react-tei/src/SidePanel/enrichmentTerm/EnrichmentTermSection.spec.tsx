import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import { TestDocumentNavigationContextProvider } from "../../navigation/TestDocumentNavigationContextProvider";
import type { TermStatistic } from "../../termEnrichment/parseUnitexEnrichment";
import { DocumentSidePanelContextProvider } from "../DocumentSidePanelContext";
import { EnrichmentTermSection } from "./EnrichmentTermSection";
import type { EnrichmentTermAnnotationBlockType } from "./enrichmentTermAnnotationBlocks";

const enrichments = {
	date: [{ term: "2021", displayed: true }],
	placeName: [
		{ term: "Paris", displayed: true },
		{ term: "London", displayed: true },
	],
} satisfies Partial<Record<EnrichmentTermAnnotationBlockType, TermStatistic[]>>;

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<DocumentContextProvider
				jsonDocument={[]}
				jsonUnitexEnrichment={enrichments}
				termCountByGroup={{
					date: {
						"2021": 1,
					},
					placeName: {
						paris: 1,
						london: 1,
						france: 0,
					},
				}}
			>
				<DocumentSidePanelContextProvider>
					<TestDocumentNavigationContextProvider>
						{children}
					</TestDocumentNavigationContextProvider>
				</DocumentSidePanelContextProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("EnrichmentTermSection", () => {
	it.each<{
		expectedLabel: string;
		expectedTerms: string[];
	}>([
		{
			expectedLabel: "Date (1)",
			expectedTerms: ["2021"],
		},
		{
			expectedLabel: "Noms de lieux administratifs (2)",
			expectedTerms: ["Paris", "London"],
		},
	])("should render a list of terms for $type", async ({
		expectedLabel,
		expectedTerms,
	}) => {
		const screen = await render(<EnrichmentTermSection />, {
			wrapper: TestWrapper,
		});

		const accordionButton = screen.getByRole("button", {
			name: expectedLabel,
		});
		await accordionButton.click();

		const list = screen.getByRole("list", {
			name: expectedLabel,
		});
		for (const term of expectedTerms) {
			await expect
				.element(
					list.getByRole("note").filter({
						hasText: term,
					}),
				)
				.toBeInTheDocument();
		}
	});

	it("should note render anything for a block type with no annotations", async () => {
		const screen = await render(<EnrichmentTermSection />, {
			wrapper: TestWrapper,
		});

		await screen
			.getByRole("button", {
				name: "Date (1)",
			})
			.click();

		await expect
			.element(
				screen.getByRole("button", {
					includeHidden: false,
				}),
			)
			.toHaveLength(2);
	});
});
