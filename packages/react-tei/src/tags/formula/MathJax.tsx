import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMathJaxContext } from "./useMathJaxContext";

export function MathJax({ id, latex, inline }: MathJaxProps) {
	const { isPending, renderLatex } = useMathJaxContext();
	const [isIntersected, setIsIntersected] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const mathRef = useRef<HTMLSpanElement>(null);

	const {
		data: chtml,
		isPending: isRendering,
		error,
	} = useQuery({
		queryKey: ["mathJax", "render", latex],
		queryFn() {
			if (!isIntersected || !latex) {
				return Promise.resolve(document.createElement("span"));
			}
			return renderLatex(latex);
		},
		enabled: isIntersected && !isPending,
	});

	const isLoading = useMemo(() => {
		return !isIntersected || isPending || isRendering;
	}, [isIntersected, isPending, isRendering]);

	useEffect(() => {
		if (!wrapperRef.current) {
			return;
		}

		const observer = new IntersectionObserver(([entry]) => {
			setIsIntersected(entry?.isIntersecting ?? false);
		});

		observer.observe(wrapperRef.current);
		return () => {
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!isLoading && chtml) {
			mathRef.current?.replaceChildren(chtml);
		} else {
			mathRef.current?.replaceChildren();
		}
	}, [isLoading, chtml]);

	const displayStyle = inline ? "inline-block" : "block";

	error && console.error("Failed to render math with MathJax", error);
	return (
		<Box
			id={id}
			sx={{
				display: displayStyle,
				paddingInline: inline ? 0.5 : 0,
				width: inline ? "fit-content" : "100%",
				"& .MathJax": {
					display: displayStyle,
				},
			}}
			ref={wrapperRef}
		>
			{isLoading && (
				<Skeleton
					sx={{
						display: displayStyle,
						height: "24px",
						minWidth: inline ? "32px" : "100%",
					}}
				/>
			)}
			<span ref={mathRef} />
		</Box>
	);
}

export type MathJaxProps = {
	id?: string;
	latex: string;
	inline?: boolean;
};
