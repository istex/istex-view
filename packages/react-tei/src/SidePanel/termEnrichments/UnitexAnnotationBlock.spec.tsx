import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import { TestDocumentNavigationContextProvider } from "../../navigation/TestDocumentNavigationContextProvider";
import type { TermStatistic } from "../../termEnrichment/parseUnitexEnrichment";
import { AnnotationBlock } from "./AnnotationBlock";
import type { AnnotationBlockType } from "./annotationBlocks";

const enrichments = {
	unitex_date: [{ term: "2021", frequency: 3, displayed: true }],
	unitex_placeName: [
		{ term: "Paris", frequency: 2, displayed: true },
		{ term: "London", frequency: 1, displayed: true },
	],
} satisfies Partial<Record<AnnotationBlockType, TermStatistic[]>>;

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<DocumentContextProvider
				jsonDocument={[]}
				jsonUnitexEnrichment={enrichments}
			>
				<TestDocumentNavigationContextProvider>
					{children}
				</TestDocumentNavigationContextProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("UnitexAnnotationBlock", () => {
	it.each<{
		type: AnnotationBlockType;
		expectedLabel: string;
		expectedTerms: string[];
	}>([
		{
			type: "unitex_date",
			expectedLabel: "Date (1)",
			expectedTerms: ["2021"],
		},
		{
			type: "unitex_placeName",
			expectedLabel: "Noms de lieux administratifs (2)",
			expectedTerms: ["Paris", "London"],
		},
	])("should render a list of terms for $type", async ({
		type,
		expectedLabel,
		expectedTerms,
	}) => {
		const screen = await render(<AnnotationBlock block={type} />, {
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

	it("should not render anything for a block type with no annotations", async () => {
		const screen = await render(<AnnotationBlock block="unitex_orgName" />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.container).toBeEmptyDOMElement();
	});

	it("should toggle all terms display when clicking on the toggle all checkbox", async () => {
		const screen = await render(<AnnotationBlock block="unitex_placeName" />, {
			wrapper: TestWrapper,
		});

		{
			const checkbox = await expectBlockToBeChecked(screen, true);
			await expectTermToBeChecked(screen, "Paris", true);
			await expectTermToBeChecked(screen, "London", true);

			await checkbox.click();
		}

		{
			const checkbox = await expectBlockToBeChecked(screen, false);

			await expectTermToBeChecked(screen, "Paris", false);
			await expectTermToBeChecked(screen, "London", false);

			await checkbox.click();
		}

		await expectBlockToBeChecked(screen, true);
		await expectTermToBeChecked(screen, "Paris", true);
		await expectTermToBeChecked(screen, "London", true);
	});

	it("should be partially checked when some terms are displayed and others are not", async () => {
		const screen = await render(<AnnotationBlock block="unitex_placeName" />, {
			wrapper: TestWrapper,
		});

		await expectBlockToBeChecked(screen, true);
		await expectTermToBeChecked(screen, "Paris", true);

		const londonCheckbox = await expectTermToBeChecked(screen, "London", true);
		await londonCheckbox.click();

		await expectTermToBeChecked(screen, "London", false);
		await expectBlockToBePartiallyChecked(screen);
	});
});

async function expectBlockToBeChecked(
	screen: Awaited<ReturnType<typeof render>>,
	checked: boolean,
) {
	const checkbox = screen.getByRole("checkbox", {
		name: checked
			? "Désactiver le soulignement des mots dans le texte"
			: "Activer le soulignement des mots dans le texte",
		exact: true,
	});

	await expect.element(checkbox).toBeInTheDocument();

	if (checked) {
		await expect.element(checkbox).toBeChecked();
		await expect.element(checkbox).not.toBePartiallyChecked();
	} else {
		await expect.element(checkbox).not.toBeChecked();
	}

	return checkbox;
}

async function expectBlockToBePartiallyChecked(
	screen: Awaited<ReturnType<typeof render>>,
) {
	const checkbox = screen.getByRole("checkbox", {
		name: "Activer le soulignement des mots dans le texte",
		exact: true,
	});
	await expect.element(checkbox).toBeInTheDocument();
	await expect.element(checkbox).toBePartiallyChecked();

	return checkbox;
}

async function expectTermToBeChecked(
	screen: Awaited<ReturnType<typeof render>>,
	term: string,
	checked: boolean,
) {
	const checkbox = screen.getByRole("checkbox", {
		name: checked
			? `Désactiver le soulignement pour le terme "${term}"`
			: `Activer le soulignement pour le terme "${term}"`,
		exact: true,
	});

	await expect.element(checkbox).toBeInTheDocument();

	if (checked) {
		await expect.element(checkbox).toBeChecked();
	} else {
		await expect.element(checkbox).not.toBeChecked();
	}

	return checkbox;
}
