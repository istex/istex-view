import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { TermStatistic } from "../../unitex/parseUnitexEnrichment";
import { TeeftSection } from "./TeeftSection";

const teeftEnrichments: TermStatistic[] = [
	{ term: "machine learning", frequency: 10, displayed: true },
	{ term: "neural network", frequency: 5, displayed: true },
	{ term: "deep learning", frequency: 3, displayed: true },
];

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<DocumentContextProvider
				jsonDocument={[]}
				jsonTeeftEnrichment={teeftEnrichments}
			>
				{children}
			</DocumentContextProvider>
		</I18nProvider>
	);
}

function EmptyTestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={[]}>
				{children}
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("TeeftSection", () => {
	it("should render a list of teeft annotations", async () => {
		const screen = await render(<TeeftSection />, {
			wrapper: TestWrapper,
		});

		const list = screen.getByRole("list");

		for (const term of [
			"machine learning",
			"neural network",
			"deep learning",
		]) {
			await expect
				.element(
					list.getByRole("note").filter({
						hasText: term,
					}),
				)
				.toBeInTheDocument();
		}
	});

	it("should not render anything when no teeft enrichment is provided", async () => {
		const screen = await render(<TeeftSection />, {
			wrapper: EmptyTestWrapper,
		});

		await expect.element(screen.getByRole("list")).not.toBeInTheDocument();
	});

	it("should render a checkbox to toggle all annotations", async () => {
		const screen = await render(<TeeftSection />, {
			wrapper: TestWrapper,
		});

		const checkbox = screen.getByRole("checkbox", {
			name: "Masquer toutes les annotations Teeft",
		});

		await expect.element(checkbox).toBeInTheDocument();
		await expect.element(checkbox).toBeChecked();
	});

	it("should toggle all annotations when clicking the checkbox", async () => {
		const screen = await render(<TeeftSection />, {
			wrapper: TestWrapper,
		});

		const checkbox = screen.getByRole("checkbox", {
			name: "Masquer toutes les annotations Teeft",
		});

		await expect.element(checkbox).toBeChecked();

		await checkbox.click();
		await expect
			.element(
				screen.getByRole("checkbox", {
					name: "Afficher toutes les annotations Teeft",
				}),
			)
			.toBeInTheDocument();

		await expect
			.element(
				screen.getByRole("checkbox", {
					name: "Afficher toutes les annotations Teeft",
				}),
			)
			.not.toBeChecked();
	});

	it("should toggle a single annotation when clicking on it", async () => {
		const screen = await render(<TeeftSection />, {
			wrapper: TestWrapper,
		});

		const list = screen.getByRole("list");

		const annotation = list.getByRole("checkbox", {
			name: 'Désactiver le soulignement pour le terme "neural network"',
		});

		await expect.element(annotation).toBeChecked();

		await annotation.click();

		await expect
			.element(
				list.getByRole("checkbox", {
					name: 'Activer le soulignement pour le terme "neural network"',
				}),
			)
			.not.toBeChecked();

		// Checkbox should now be indeterminate (partial)
		const toggleAllCheckbox = screen.getByRole("checkbox", {
			name: "Afficher toutes les annotations Teeft",
		});
		await expect
			.element(toggleAllCheckbox)
			.toHaveAttribute("aria-checked", "mixed");
	});
});
