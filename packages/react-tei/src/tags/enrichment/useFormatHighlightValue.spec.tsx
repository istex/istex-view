import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import { TagCatalogContext } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { useFormatHighlightValue } from "./useFormatHighlightValue";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<DocumentContextProvider
			jsonDocument={[]}
			jsonUnitexEnrichment={{
				persName: [
					{ term: "Albert Einstein", displayed: true },
					{ term: "Nancy", displayed: true },
				],
				placeName: [
					{
						term: "London",
						displayed: false,
					},
					{ term: "Nancy", displayed: false },
					{
						term: "Université Albert Einstein",
						displayed: false,
					},
				],
			}}
		>
			<TagCatalogContext value={tagCatalog}>{children}</TagCatalogContext>
		</DocumentContextProvider>
	);
}

describe("useFormatHightlightValue", () => {
	it("should return the value if value is string", async () => {
		const { result } = await renderHook(
			() =>
				useFormatHighlightValue({
					data: {
						tag: "highlight",
						value: "Albert Einstein",
						attributes: {
							term: "albert-einstein",
							groups: ["persName"],
						},
					},
				}),
			{
				wrapper: TestWrapper,
			},
		);

		expect(result.current).toEqual({
			value: "Albert Einstein",
			groups: ["persName"],
			displayedGroups: ["persName"],
		});
	});

	it("should return all groups if attribute groups is a string", async () => {
		const { result } = await renderHook(
			() =>
				useFormatHighlightValue({
					data: {
						tag: "highlight",
						value: "Nancy",
						attributes: {
							term: "nancy",
							groups: "persName",
						},
					},
				}),
			{
				wrapper: TestWrapper,
			},
		);

		expect(result.current).toEqual({
			value: "Nancy",
			groups: ["persName"],
			displayedGroups: ["persName"],
		});
	});

	it("should return an empty list of displayedGroups if the highlight has no group", async () => {
		const { result } = await renderHook(
			() =>
				useFormatHighlightValue({
					data: {
						tag: "highlight",
						value: "Albert Einstein",
						attributes: {
							term: "albert-einstein",
							groups: [],
						},
					},
				}),
			{
				wrapper: TestWrapper,
			},
		);

		expect(result.current).toEqual({
			value: "Albert Einstein",
			groups: [],
			displayedGroups: [],
		});
	});

	it("should return an empty list of displayedGroups if all groups are hidden", async () => {
		const { result } = await renderHook(
			() =>
				useFormatHighlightValue({
					data: {
						tag: "highlight",
						value: "London",
						attributes: {
							term: "london",
							groups: ["placeName"],
						},
					},
				}),
			{
				wrapper: TestWrapper,
			},
		);

		expect(result.current).toEqual({
			value: "London",
			groups: ["placeName"],
			displayedGroups: [],
		});
	});

	it("should return the list of displayedGroups if at least one group is displayed", async () => {
		const { result } = await renderHook(
			() =>
				useFormatHighlightValue({
					data: {
						tag: "highlight",
						value: "Nancy",
						attributes: {
							term: "nancy",
							groups: ["persName", "placeName"],
						},
					},
				}),
			{
				wrapper: TestWrapper,
			},
		);

		expect(result.current).toEqual({
			value: "Nancy",
			groups: ["persName", "placeName"],
			displayedGroups: ["persName"],
		});
	});

	it("should remove parent hidden groups from displayedGroups", async () => {
		const { result } = await renderHook(
			() =>
				useFormatHighlightValue({
					data: {
						tag: "highlight",
						value: "Université Albert Einstein",
						attributes: {
							term: "universite-albert-einstein",
							groups: ["placeName"],
							parentHiddenGroups: ["placeName"],
						},
					},
				}),
			{
				wrapper: TestWrapper,
			},
		);

		expect(result.current).toEqual({
			value: "Université Albert Einstein",
			groups: ["placeName"],
			displayedGroups: [],
		});
	});

	it("should add parent hidden groups to children hightlight", async () => {
		const { result } = await renderHook(
			() =>
				useFormatHighlightValue({
					data: {
						tag: "highlight",
						attributes: {
							term: "université-albert-einstein",
							groups: ["placeName"],
							parentHiddenGroups: [],
						},
						value: [
							{
								tag: "highlight",
								value: "Université ",
								attributes: {
									term: "nancy",
									groups: ["placeName"],
								},
							},
							{
								tag: "highlight",
								value: "Albert Einstein",
								attributes: {
									term: "albert-einstein",
									groups: ["placeName", "persName"],
								},
							},
						],
					},
				}),
			{
				wrapper: TestWrapper,
			},
		);

		expect(result.current).toEqual({
			groups: ["placeName"],
			displayedGroups: [],
			value: [
				{
					tag: "highlight",
					value: "Université ",
					attributes: {
						term: "nancy",
						groups: ["placeName"],
						parentHiddenGroups: ["placeName"],
					},
				},
				{
					tag: "highlight",
					value: "Albert Einstein",
					attributes: {
						term: "albert-einstein",
						groups: ["placeName", "persName"],
						parentHiddenGroups: ["placeName"],
					},
				},
			],
		});
	});

	it("should only keep value for highlight children if thay have the same groups and term as parent hidden groups", async () => {
		const { result } = await renderHook(
			() =>
				useFormatHighlightValue({
					data: {
						tag: "highlight",
						attributes: {
							term: "université-albert-einstein",
							groups: ["placeName"],
							parentHiddenGroups: [],
						},
						value: [
							{
								tag: "highlight",
								value: "Université ",
								attributes: {
									term: "université-albert-einstein",
									groups: ["placeName"],
								},
							},
							{
								tag: "highlight",
								value: "Albert Einstein",
								attributes: {
									term: "albert-einstein",
									groups: ["placeName", "persName"],
								},
							},
						],
					},
				}),
			{
				wrapper: TestWrapper,
			},
		);

		expect(result.current).toEqual({
			groups: ["placeName"],
			displayedGroups: [],
			value: [
				{
					tag: "#text",
					value: "Université ",
				},
				{
					tag: "highlight",
					value: "Albert Einstein",
					attributes: {
						term: "albert-einstein",
						groups: ["placeName", "persName"],
						parentHiddenGroups: ["placeName"],
					},
				},
			],
		});
	});
});
