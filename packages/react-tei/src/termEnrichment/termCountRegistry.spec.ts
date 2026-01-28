import { describe, expect, it } from "vitest";
import type { HighlightTag } from "./highlightTermsInTextTag";
import {
	incrementTermCountInRegistry,
	type TermCountByGroup,
} from "./termCountRegistry";

describe("incrementTermCountInRegistry", () => {
	it("should increment the count of a term in the registry", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"université-gustave-eiffel": 0,
				"eiffel-g.": 0,
				"gustave-eiffel": 0,
				"marie-curie": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		incrementTermCountInRegistry(
			registry,
			"orgName",
			"Université Gustave Eiffel",
		);

		expect(registry).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 1,
			},
			persName: {
				"université-gustave-eiffel": 0,
				"eiffel-g.": 0,
				"gustave-eiffel": 0,
				"marie-curie": 0,
			},
			teeft: {},
		});
	});

	it("should incrmeent value in multiple groups separated by a plus sign", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"université-gustave-eiffel": 0,
				"eiffel-g.": 0,
				"gustave-eiffel": 0,
				"marie-curie": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		incrementTermCountInRegistry(
			registry,
			"orgName+persName",
			"Université Gustave Eiffel",
		);

		expect(registry).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 1,
			},
			persName: {
				"université-gustave-eiffel": 1,
				"eiffel-g.": 0,
				"gustave-eiffel": 0,
				"marie-curie": 0,
			},
			teeft: {},
		});
	});

	it("should update counts for terms represented as highlights", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		const highlightTag = [
			{
				tag: "highlight",
				attributes: {
					groups: ["persName"],
					term: "eiffel-g.",
				},
				value: [
					{
						tag: "#text" as const,
						value: "Eiffel G.",
					},
				],
			},
		] as HighlightTag[];

		incrementTermCountInRegistry(registry, "persName", highlightTag);

		expect(registry).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 1,
			},
			teeft: {},
		});
	});

	it("should handle terms in multiple highlight tags", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		const highlightTag = [
			{
				tag: "highlight",
				attributes: {
					groups: ["orgName"],
					term: "université-gustave-eiffel",
				},
				value: [
					{
						tag: "#text" as const,
						value: "Université Gustave Eiffel",
					},
				],
			},
			{
				tag: "highlight",
				attributes: {
					groups: ["persName"],
					term: "eiffel-g.",
				},
				value: [
					{
						tag: "#text" as const,
						value: "Eiffel G.",
					},
				],
			},
		] as HighlightTag[];

		incrementTermCountInRegistry(registry, "orgName+persName", highlightTag);

		expect(registry).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 1,
			},
			persName: {
				"eiffel-g.": 1,
			},
			teeft: {},
		});
	});

	it("should handle terms as text tags", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		incrementTermCountInRegistry(registry, "persName", [
			{
				tag: "#text" as const,
				value: "Eiffel G.",
			},
		]);

		expect(registry).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 1,
			},
			teeft: {},
		});
	});

	it("should not initialize counts for terms not present in the registry", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 2,
			},
			persName: {
				"eiffel-g.": 3,
			},
			teeft: {},
		} as TermCountByGroup;

		incrementTermCountInRegistry(
			registry,
			"orgName",
			"Nonexistent Organization",
		);

		expect(registry).toStrictEqual(registry);
	});
});
