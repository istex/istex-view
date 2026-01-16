import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import { UnitexAnnotation } from "./UnitexAnnotation";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return <I18nProvider>{children}</I18nProvider>;
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
});
