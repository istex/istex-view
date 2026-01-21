import { Component, useMemo } from "react";
import temml from "temml";
import { DebugTag } from "../../debug/DebugTag";
import { findTagByName } from "../../helper/findTagByName";
import type { ComponentProps } from "../type";

class ErrorBoundary extends Component<
	{ children: React.ReactNode; data: ComponentProps["data"] },
	{ hasError: boolean }
> {
	constructor(props: {
		children: React.ReactNode;
		data: ComponentProps["data"];
	}) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Error rendering LaTeX formula:", error, errorInfo);
	}
	override render() {
		if (this.state.hasError) {
			return (
				<DebugTag
					message="Error rendering LaTeX formula"
					tag="formula"
					attributes={this.props.data.attributes}
					payload={this.props.data.value}
				/>
			);
		}
		return this.props.children;
	}
}

export function FormulaNotationLatex({ data }: ComponentProps) {
	const text = useMemo(
		() => findTagByName(data, "#text")?.value as string | undefined,
		[data],
	);

	if (!text) {
		return (
			<DebugTag
				message="Latex formula with no text content"
				tag="formula"
				attributes={data.attributes}
				payload={data.value}
			/>
		);
	}
	return (
		<ErrorBoundary data={data}>
			<span
				ref={(element) => {
					if (!element) {
						return;
					}
					temml.render(text, element, {
						displayMode: true,
						// throwOnError: true,
					});
				}}
			/>
		</ErrorBoundary>
	);
}
