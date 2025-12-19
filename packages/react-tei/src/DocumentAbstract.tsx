import { MultilingualAbstract } from "./abstract/MultilingualAbstract.js";
import { SingleAbstract } from "./abstract/SingleAbstract.js";
import { findChildrenByName } from "./helper/findChildrenByName.js";
import { findTagByName } from "./helper/findTagByName.js";
import type { DocumentJson } from "./parser/document.js";

export function DocumentAbstract({ header }: DocumentAbstractProps) {
	const profileDesc = findTagByName(header, "profileDesc");
	const abstracts = findChildrenByName(profileDesc, "abstract");

	if (abstracts.length === 0) {
		return null;
	}

	if (abstracts.length === 1) {
		return <SingleAbstract abstract={abstracts[0] as DocumentJson} />;
	}

	return <MultilingualAbstract abstracts={abstracts} />;
}

type DocumentAbstractProps = {
	header: DocumentJson | undefined;
};
