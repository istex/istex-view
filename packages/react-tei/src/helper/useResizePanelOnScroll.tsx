import { useCallback, useEffect, useRef } from "react";
import { ROOT_ELEMENT_ID } from "../navigation/DocumentNavigationContext";

// We do not use react states here to avoid performance lags on scroll
export function useResizePanelOnScroll(
	ref: React.RefObject<HTMLDivElement | null>,
) {
	const windowHeightRef = useRef(0);

	const resizeElement = useCallback(() => {
		window.requestAnimationFrame(() => {
			if (!ref.current) {
				return;
			}

			const topOffset = Math.max(ref.current.getBoundingClientRect().top, 0);

			ref.current.style.height = `${windowHeightRef.current - topOffset}px`;
		});
	}, [ref]);

	const handleWindowResize = useCallback(() => {
		windowHeightRef.current = window.innerHeight;
		resizeElement();
	}, [resizeElement]);

	useEffect(() => {
		windowHeightRef.current = window.innerHeight;
		window.addEventListener("resize", handleWindowResize);
		return () => window.removeEventListener("resize", handleWindowResize);
	}, [handleWindowResize]);

	const handleScroll = useCallback(() => {
		resizeElement();
	}, [resizeElement]);

	useEffect(() => {
		const root = document.querySelector(ROOT_ELEMENT_ID) ?? document.body;
		root.addEventListener("scroll", handleScroll);
		return () => root.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);
}
