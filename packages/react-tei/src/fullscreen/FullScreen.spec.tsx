import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import { I18nProvider } from "../i18n/I18nProvider";
import { DocumentSidePanelContextProvider } from "../SidePanel/DocumentSidePanelContext";
import { FullScreen } from "./FullScreen";
import { FullScreenButton } from "./FullScreenButton";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={[]}>
				<DocumentSidePanelContextProvider>
					<FullScreen>
						<FullScreenButton />
						{children}
					</FullScreen>
				</DocumentSidePanelContextProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("FullScreen", () => {
	it("should render element ouside of modal if not in fullscreen mode", async () => {
		const screen = await render(<p>Test Element</p>, {
			wrapper: TestWrapper,
		});

		await expect
			.element(screen.getByRole("paragraph"))
			.toHaveTextContent("Test Element");
		await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
	});

	it("should render element in modal if in fullscreen mode", async () => {
		const screen = await render(<p>Test Element</p>, {
			wrapper: TestWrapper,
		});

		await screen
			.getByRole("button", {
				name: "Passer en mode plein écran",
			})
			.click();

		const dialog = screen.getByRole("dialog");
		await expect.element(dialog).toBeInTheDocument();

		await expect
			.element(dialog.getByRole("paragraph"))
			.toHaveTextContent("Test Element");
	});

	it("should close modal when clicking on close button", async () => {
		const screen = await render(<p>Test Element</p>, {
			wrapper: TestWrapper,
		});

		await screen
			.getByRole("button", {
				name: "Passer en mode plein écran",
			})
			.click();

		const dialog = screen.getByRole("dialog");
		await expect.element(dialog).toBeInTheDocument();

		await screen
			.getByRole("button", {
				name: "Quitter le mode plein écran",
			})
			.click();

		await expect.element(dialog).not.toBeInTheDocument();
	});
});
