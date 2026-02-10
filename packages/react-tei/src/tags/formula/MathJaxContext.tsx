import { useQuery } from "@tanstack/react-query";
import { createContext, useMemo } from "react";

export type DisplayMode = "inline" | "block";

export type MathJaxContextType = {
	isPending: boolean;
	error?: unknown | undefined;
	renderLatex(math: string): Promise<MathMLElement | HTMLElement>;
};

export const MathJaxContext = createContext<MathJaxContextType | undefined>(
	undefined,
);

declare global {
	interface Window {
		MathJax: {
			tex: {
				inlineMath: Record<string, [string, string][]>;
			};
			options: {
				enableMenu: boolean;
			};
			tex2chtmlPromise(math: string): Promise<HTMLElement>;
			tex2mmlPromise(math: string): Promise<string>;
		};
	}
}

window.MathJax = {
	tex: {
		inlineMath: { "[+]": [["$", "$"]] },
	},
	options: {
		enableMenu: false,
	},
	tex2chtmlPromise() {
		throw new Error("MathJax is not loaded");
	},
	tex2mmlPromise() {
		throw new Error("MathJax is not loaded");
	},
};

// We cannot load MathJax from npm as it is node only, so we load it from CDN and provide it via context
function loadMathJax() {
	const script = document.createElement("script");
	script.src = "https://cdn.jsdelivr.net/npm/mathjax@4.1.0/tex-chtml.js";
	script.async = true;

	return new Promise<void>((resolve, reject) => {
		script.onload = () => {
			resolve();
		};
		script.onerror = () => {
			reject(new Error("Failed to load MathJax"));
		};
		document.head.appendChild(script);
	});
}

export function MathJaxProvider({ children }: MathJaxProviderProps) {
	const {
		isPending,
		error,
		data: mathJax,
	} = useQuery({
		queryKey: ["mathJax"],
		async queryFn() {
			await loadMathJax();
			return window.MathJax;
		},
	});

	const value = useMemo<MathJaxContextType>(() => {
		return {
			isPending,
			async renderLatex(math) {
				if (error) {
					return Promise.reject(error);
				}

				if (!mathJax) {
					return Promise.reject(new Error("MathJax is not loaded"));
				}

				const mathml = await mathJax.tex2mmlPromise(math);

				const fragment = document.createElement("span");
				fragment.innerHTML = mathml;

				const mathElement = fragment.querySelector("math");
				if (!mathElement) {
					// fallback to chtml if mathml rendering fails
					return mathJax.tex2chtmlPromise(math);
				}

				return mathElement;
			},
		};
	}, [isPending, mathJax, error]);

	return (
		<MathJaxContext.Provider value={value}>{children}</MathJaxContext.Provider>
	);
}

type MathJaxProviderProps = {
	children: React.ReactNode;
};
