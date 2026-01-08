import { useMemo } from "react";
import { useDocumentContext } from "../DocumentContextProvider";
import { kebabCasify } from "../helper/kebabCasify";
import {
	highlightTermsInFragment,
	type TextFragment,
} from "./highlightTermsInFragment";
import type { ComponentProps } from "./type";

export const TextFragmentComponent = ({
	textFragment,
}: {
	textFragment: TextFragment;
}) => {
	if (typeof textFragment === "string") {
		return <>{textFragment}</>;
	}
	return (
		<span
			data-term-id={`term-${kebabCasify(textFragment.term)}`}
			className={`highlight-${textFragment.group}`}
		>
			{textFragment.content.map((fragment, index) => (
				<TextFragmentComponent key={index} textFragment={fragment} />
			))}
		</span>
	);
};

export const Text = ({ data }: ComponentProps) => {
	const { jsonUnitexEnrichment } = useDocumentContext();

	const terms: {
		term: string;
		group: string;
		displayed: boolean;
	}[] = useMemo(() => {
		if (!jsonUnitexEnrichment) {
			return [];
		}
		return Object.entries(jsonUnitexEnrichment).flatMap(([group, terms]) =>
			terms.map((term) => {
				return { term: term.term, group, displayed: term.displayed };
			}),
		);
	}, [jsonUnitexEnrichment]);

	const highlightedText = useMemo(() => {
		if (typeof data.value !== "string") {
			return null;
		}
		const text = data.value;

		return highlightTermsInFragment([text], terms);
	}, [data.value, terms]);

	if (!highlightedText) {
		console.warn("Text tag does not contain string value", data);
		return null;
	}
	return (
		<>
			{highlightedText.map((textFragment, index) => {
				return (
					<TextFragmentComponent key={index} textFragment={textFragment} />
				);
			})}
		</>
	);
};
