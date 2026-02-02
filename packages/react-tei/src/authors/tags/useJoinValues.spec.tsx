import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useJoinValues } from "./useJoinValues";

describe("useJoinValues", () => {
	it("should add text tags with separator between values", async () => {
		const { result } = await renderHook(() =>
			useJoinValues(
				[
					{ tag: "orgName", value: [{ tag: "#text", value: "University A" }] },
					{ tag: "orgName", value: [{ tag: "#text", value: "Institute B" }] },
				],
				", ",
			),
		);

		expect(result.current).toStrictEqual([
			{ tag: "orgName", value: [{ tag: "#text", value: "University A" }] },
			{ tag: "#text", value: ", " },
			{ tag: "orgName", value: [{ tag: "#text", value: "Institute B" }] },
		]);
	});
});
