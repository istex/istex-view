import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../../i18n/I18nProvider";
import type { DocumentJson } from "../../../parser/document";
import { SourceImprint } from "./SourceImprint";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return <I18nProvider>{children}</I18nProvider>;
}

describe("SourceImprint", () => {
	it("should return render anything when imprint is empty", async () => {
		const imprint: DocumentJson = {
			tag: "imprint",
			value: [],
		};
		const screen = await render(<SourceImprint data={imprint} />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.container).toBeEmptyDOMElement();
	});

	it("should render imprint content when available", async () => {
		const imprint: DocumentJson = {
			tag: "imprint",
			value: [
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

		const screen = await render(<SourceImprint data={imprint} />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(screen.getByText("Vol. 10, n° 2 (2020), pp. 100-110"))
			.toBeInTheDocument();
	});

	it("should render when partial content is available", async () => {
		const imprint: DocumentJson = {
			tag: "imprint",
			value: [
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
			],
		};

		const screen = await render(<SourceImprint data={imprint} />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(screen.getByText("n° 2 (2020), p. 100"))
			.toBeInTheDocument();
	});
});
