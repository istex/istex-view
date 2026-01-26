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
			<DocumentSidePanelContextProvider>
				<DocumentContextProvider
					jsonDocument={[]}
					jsonUnitexEnrichment={enrichments}
				>
					<TestDocumentNavigationContextProvider>
						{children}
					</TestDocumentNavigationContextProvider>
				</DocumentContextProvider>
			</DocumentSidePanelContextProvider>
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

		await expect.element(screen.getByRole("list")).toHaveLength(2);
	});
});
