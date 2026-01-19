import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import {
	DIRECTION_NEXT,
	DIRECTION_PREVIOUS,
	type DocumentNavigationContextValue,
} from "../../navigation/DocumentNavigationContext";
import { TestDocumentNavigationContextProvider } from "../../navigation/TestDocumentNavigationContextProvider";
import { UnitexAnnotation } from "./UnitexAnnotation";

function TestWrapper({
	navigateToBodyTargetSelector,
	children,
}: {
	navigateToBodyTargetSelector?: DocumentNavigationContextValue["navigateToBodyTargetSelector"];
	children: React.ReactNode;
}) {
	return (
		<TestDocumentNavigationContextProvider
			value={{
				navigateToBodyTargetSelector,
			}}
		>
			<I18nProvider>{children}</I18nProvider>
		</TestDocumentNavigationContextProvider>
	);
}

describe("UnitexAnnotation", () => {
	it("should render the annotation with term", async () => {
		const onToggle = vi.fn();
		const screen = await render(
			<UnitexAnnotation
				annotation={{ term: "example", frequency: 5, displayed: true }}
				color="blue"
				onToggle={onToggle}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		await expect.element(screen.getByRole("note")).toHaveTextContent("example");

		expect(onToggle).not.toHaveBeenCalled();
	});

	it("should call onToggle when checkbox changes", async () => {
		const onToggle = vi.fn();
		const screen = await render(
			<UnitexAnnotation
				annotation={{ term: "example", frequency: 5, displayed: true }}
				color="blue"
				onToggle={onToggle}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const checkbox = screen.getByRole("checkbox", {
			name: 'Activer le soulignement pour le terme "example"',
		});
		await checkbox.click();

		expect(onToggle).toHaveBeenCalledTimes(1);
	});

	it("should disable navigation buttons when annotation is not displayed", async () => {
		const screen = await render(
			<UnitexAnnotation
				annotation={{ term: "example", frequency: 5, displayed: false }}
				color="blue"
				onToggle={() => {}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const previousButton = screen.getByRole("button", {
			name: "Aller au précédent",
		});
		const nextButton = screen.getByRole("button", {
			name: "Aller au suivant",
		});

		await expect.element(previousButton).toBeDisabled();
		await expect.element(nextButton).toBeDisabled();
	});

	it("should call navigateToBodyTargetSelector when navigation buttons are clicked", async () => {
		const navigateToBodyTargetSelector = vi.fn();
		const screen = await render(
			<UnitexAnnotation
				annotation={{ term: "example", frequency: 5, displayed: true }}
				color="blue"
				onToggle={() => {}}
			/>,
			{
				wrapper: ({ children }) => (
					<TestWrapper
						navigateToBodyTargetSelector={navigateToBodyTargetSelector}
					>
						{children}
					</TestWrapper>
				),
			},
		);

		const previousButton = screen.getByRole("button", {
			name: "Aller au précédent",
		});
		const nextButton = screen.getByRole("button", {
			name: "Aller au suivant",
		});

		await expect.element(previousButton).toBeEnabled();
		await expect.element(nextButton).toBeEnabled();

		await previousButton.click();
		expect(navigateToBodyTargetSelector).toHaveBeenCalledWith(
			'[data-term="example"]',
			DIRECTION_PREVIOUS,
		);

		await nextButton.click();
		expect(navigateToBodyTargetSelector).toHaveBeenCalledWith(
			'[data-term="example"]',
			DIRECTION_NEXT,
		);
	});
});
