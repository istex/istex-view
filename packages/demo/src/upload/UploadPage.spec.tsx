import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { ViewerContextProvider } from "../viewer/ViewerContext";
import { UploadPage } from "./UploadPage";

vi.mock("../viewer/useViewerContext");

describe("UploadPage", () => {
	it("should display two file picker no selected file and disabled launch viewer button", async () => {
		const screen = await render(<UploadPage />, {
			wrapper: ({ children }) => (
				<ViewerContextProvider>{children}</ViewerContextProvider>
			),
		});

		expect(
			screen.getByText("upload.teiFile upload.noFileSelected"),
		).toBeInTheDocument();
		expect(
			screen.getByText("upload.unitexFile upload.noFileSelected"),
		).toBeInTheDocument();
		expect(screen.getByText("upload.launchViewer")).toBeInTheDocument();
		expect(screen.getByText("upload.launchViewer")).toBeDisabled();
	});

	it("should display uploaded tei file and enable launch viewer button", async () => {
		const screen = await render(<UploadPage />, {
			wrapper: ({ children }) => (
				<ViewerContextProvider>{children}</ViewerContextProvider>
			),
		});

		await expect
			.element(screen.getByText("upload.teiFile upload.noFileSelected"))
			.toBeInTheDocument();
		await expect
			.element(screen.getByText("upload.launchViewer"))
			.toBeInTheDocument();
		await expect
			.element(screen.getByText("upload.launchViewer"))
			.toBeDisabled();

		const file = new File(["<TEI></TEI>"], "example.tei", {
			type: "text/plain",
		});

		const input = screen.getByTestId("tei-file-selector-input");

		await userEvent.upload(input, file);

		await expect
			.element(screen.getByText("upload.teiFile example.tei"))
			.toBeInTheDocument();
		await expect
			.element(screen.getByText("upload.launchViewer"))
			.not.toBeDisabled();
	});

	it("should display uploaded openUnitexEnrichment and keep launch viewer button disabled", async () => {
		const screen = await render(<UploadPage />, {
			wrapper: ({ children }) => (
				<ViewerContextProvider>{children}</ViewerContextProvider>
			),
		});

		expect(
			screen.getByText("upload.unitexFile upload.noFileSelected"),
		).toBeInTheDocument();
		expect(screen.getByText("upload.launchViewer")).toBeInTheDocument();
		expect(screen.getByText("upload.launchViewer")).toBeDisabled();

		const file = new File(["<unitex></unitex>"], "example.unitex", {
			type: "text/plain",
		});

		const input = screen.getByTestId("unitex-enrichment-file-selector-input");

		await userEvent.upload(input, file);

		expect(
			screen.getByText("upload.unitexFile example.unitex"),
		).toBeInTheDocument();
		expect(screen.getByText("upload.launchViewer")).toBeDisabled();
	});
});
