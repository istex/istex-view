import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { TermStatistic } from "../../unitex/parseUnitexEnrichment";
import { UnitexSection } from "./UnitexSection";
import type { UnitexAnnotationBlockType } from "./unitexAnnotationBlocks";

const enrichments = {
	date: [{ term: "2021", frequency: 3, displayed: true }],
	placeName: [
		{ term: "Paris", frequency: 2, displayed: true },
		{ term: "London", frequency: 1, displayed: true },
	],
} satisfies Partial<Record<UnitexAnnotationBlockType, TermStatistic[]>>;

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<DocumentContextProvider
				jsonDocument={[]}
				jsonUnitexEnrichment={enrichments}
			>
				{children}
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("UnitexSection", () => {
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
		const screen = await render(<UnitexSection />, {
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
		const screen = await render(<UnitexSection />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.getByRole("list")).toHaveLength(2);
	});
});
