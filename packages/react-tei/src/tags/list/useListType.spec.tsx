import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { ListContext, type ListContextValue } from "./ListContext";
import { useListType } from "./useListType";

describe("useListType", () => {
	it('should default to "ul" when no type is provided and no parent context', async () => {
		const { result } = await renderHook(() => useListType());
		expect(result.current).toBe("ul");
	});

	it('shoudl return "ol" when type is "order"', async () => {
		const { result } = await renderHook(() => useListType("order"));
		expect(result.current).toBe("ol");
	});

	it('should return "ul" when type is "bullet"', async () => {
		const { result } = await renderHook(() => useListType("bullet"));
		expect(result.current).toBe("ul");
	});

	it.each<ListContextValue>([
		"ul",
		"ol",
	])("should inherit parent context when type is undefined", async (parentValue) => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<ListContext.Provider value={parentValue}>
				{children}
			</ListContext.Provider>
		);

		const { result } = await renderHook(() => useListType(undefined), {
			wrapper,
		});
		expect(result.current).toBe(parentValue);
	});
});
