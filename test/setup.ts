import { afterEach, beforeEach, vi } from "vitest";

window.IS_REACT_ACT_ENVIRONMENT = true;

declare global {
	var IS_REACT_ACT_ENVIRONMENT: boolean;
}

beforeEach(() => {
	window.IS_REACT_ACT_ENVIRONMENT = true;
	vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});
