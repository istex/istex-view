import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { useIsLabelledList } from "./useIsLabelledList";

describe("useIsLabelledList", () => {
	it("should return true when list has a label inside an item", async () => {
		const document: DocumentJson = {
			tag: "list",
			attributes: {},
			value: [
				{
					tag: "highlightedText",
					value: [],
				},
				{
					tag: "item",
					value: [
						{
							tag: "highlightedText",
							value: [],
						},
						{
							tag: "label",
							value: [
								{
									tag: "highlightedText",
									value: [
										{
											tag: "#text",
											value: "1",
										},
									],
								},
							],
						},
						{
							tag: "highlightedText",
							value: [],
						},
						{
							tag: "p",
							value: [
								{
									tag: "highlightedText",
									value: [],
								},
								{
									tag: "hi",
									value: [
										{
											tag: "highlightedText",
											value: [
												{
													tag: "#text",
													value: "Lorem",
												},
											],
										},
									],
									attributes: {
										"@rend": "italic",
									},
								},
								{
									tag: "highlightedText",
									value: [],
								},
							],
						},
						{
							tag: "highlightedText",
							value: [],
						},
					],
				},
				{
					tag: "item",
					value: [
						{
							tag: "highlightedText",
							value: [],
						},
						{
							tag: "label",
							value: [
								{
									tag: "highlightedText",
									value: [
										{
											tag: "#text",
											value: "2",
										},
									],
								},
							],
						},
						{
							tag: "highlightedText",
							value: [],
						},
						{
							tag: "p",
							value: [
								{
									tag: "highlightedText",
									value: [],
								},
								{
									tag: "hi",
									value: [
										{
											tag: "highlightedText",
											value: [
												{
													tag: "#text",
													value: "Ispum",
												},
											],
										},
									],
									attributes: {
										"@rend": "italic",
									},
								},
								{
									tag: "highlightedText",
									value: [],
								},
							],
						},
						{
							tag: "highlightedText",
							value: [],
						},
					],
				},
			],
		};

		const result = await renderHook(() => useIsLabelledList(document));
		expect(result.result.current).toBe(true);
	});

	it("should return false when list has no label", async () => {
		const document: DocumentJson = {
			tag: "list",
			attributes: {
				"@type": "ordered",
			},
			value: [
				{
					tag: "item",
					value: [
						{
							tag: "p",
							value: [
								{
									tag: "#text",
									value: "Item without label",
								},
							],
						},
					],
				},
			],
		};

		const result = await renderHook(() => useIsLabelledList(document));
		expect(result.result.current).toBe(false);
	});
});
