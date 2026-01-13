import { MultilingualAbstract } from "./abstract/MultilingualAbstract";
import { SingleAbstract } from "./abstract/SingleAbstract";
import { useDocumentAbstracts } from "./abstract/useDocumentAbstracts";
import type { DocumentJson } from "./parser/document";

export function DocumentAbstract({ teiHeader: header }: DocumentAbstractProps) {
	const abstracts = useDocumentAbstracts(header);

	if (abstracts.length === 0) {
		return null;
	}

	if (abstracts.length === 1) {
		return <SingleAbstract abstract={abstracts[0] as DocumentJson} />;
	}

	return <MultilingualAbstract abstracts={abstracts} />;
}

type DocumentAbstractProps = {
	teiHeader: DocumentJson | undefined;
};
