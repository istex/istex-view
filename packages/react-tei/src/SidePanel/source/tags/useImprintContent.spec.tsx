import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import type { DocumentJson } from "../../../parser/document";
import { useImprintContent } from "./useImprintContent";

describe("useImprintContent", () => {
	it("should return publisher if present", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "publisher",
					value: [
						{
							tag: "#text",
							value: "Springer",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ publisher: "Springer" });
	});

	it("should return volume if present", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "biblScope",
					attributes: { "@unit": "vol" },
					value: [
						{
							tag: "#text",
							value: "42",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ volume: "42" });
	});

	it("should return issue if present", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "biblScope",
					attributes: { "@unit": "issue" },
					value: [
						{
							tag: "#text",
							value: "7",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ issue: "7" });
	});

	it("should return year if present", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "date",
					attributes: { "@when": "2006-06" },
					value: [],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ year: "2006" });
	});

	it("should return the copywright year if present and date is absent", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "date",
					attributes: { "@type": "Copyright", "@when": "1999" },
					value: [],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ year: "1999" });
	});

	it('should fallback to text value for year if "@when" is absent', async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "date",
					value: [
						{
							tag: "#text",
							value: "2015-12-25",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ year: "2015" });
	});

	it("should return the from page if present", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@from": "123" },
					value: [
						{
							tag: "#text",
							value: "123",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ pages: ["123"] });
	});

	it("should return a single page when page has no from/to attributes", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "biblScope",
					attributes: { "@unit": "page" },
					value: [
						{
							tag: "#text",
							value: "45",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ pages: ["45"] });
	});

	it("should return a single page when from and to pages are identical", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@from": "50" },
					value: [
						{
							tag: "#text",
							value: "50",
						},
					],
				},
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@to": "50" },
					value: [
						{
							tag: "#text",
							value: "50",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ pages: ["50"] });
	});

	it("should return both pages if present", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@from": "123" },
					value: [
						{
							tag: "#text",
							value: "123",
						},
					],
				},
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@to": "130" },
					value: [
						{
							tag: "#text",
							value: "130",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ pages: ["123", "130"] });
	});

	it("should return empty pages array if no from page is present", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "publisher",
					value: [
						{
							tag: "#text",
							value: "Springer",
						},
					],
				},
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@to": "130" },
					value: [
						{
							tag: "#text",
							value: "130",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({ pages: [] });
	});

	it("should return null if volume, issue, year and pages are not present", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toEqual(null);
	});

	it("should return all fields if all are present", async () => {
		const imprintData: DocumentJson = {
			tag: "imprint",
			value: [
				{
					tag: "publisher",
					value: [
						{
							tag: "#text",
							value: "Nature Publishing Group",
						},
					],
				},
				{
					tag: "biblScope",
					attributes: { "@unit": "vol" },
					value: [
						{
							tag: "#text",
							value: "10",
						},
					],
				},
				{
					tag: "biblScope",
					attributes: { "@unit": "issue" },
					value: [
						{
							tag: "#text",
							value: "2",
						},
					],
				},
				{
					tag: "date",
					attributes: { "@when": "2020-01-15" },
					value: [],
				},
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@from": "100" },
					value: [
						{
							tag: "#text",
							value: "100",
						},
					],
				},
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@to": "110" },
					value: [
						{
							tag: "#text",
							value: "110",
						},
					],
				},
			],
		};

		const { result } = await renderHook(() =>
			useImprintContent({ data: imprintData }),
		);

		expect(result.current).toMatchObject({
			publisher: "Nature Publishing Group",
			volume: "10",
			issue: "2",
			year: "2020",
			pages: ["100", "110"],
		});
	});
});
