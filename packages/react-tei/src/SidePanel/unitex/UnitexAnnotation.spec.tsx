import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { UnitexAnnotation } from "./UnitexAnnotation";

describe("UnitexAnnotation", () => {
	it("should render the annotation with term and frequency", async () => {
		const screen = await render(
			<UnitexAnnotation
				annotation={{ term: "example", frequency: 5, displayed: true }}
				color="blue"
			/>,
		);

		await expect
			.element(screen.getByRole("note"))
			.toHaveTextContent("example | 5");
	});
});
