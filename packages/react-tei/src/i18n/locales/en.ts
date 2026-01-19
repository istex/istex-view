import type { Translation } from "./fr";

export const en: Translation = {
	document: {
		abstract: {
			title: "Abstract",
			nextLanguage: "Next Language",
			previousLanguage: "Previous Language",
		},
		tableOfContent: "Table of Contents",
		lang: "Language",
	},
	sidePanel: {
		footNotes: "Foot Notes",
		open: "Open the side panel",
		close: "Close the side panel",
		author: {
			title_one: "Author",
			title_other: "Authors",
			label: "Author",
			genName: "Generation",
			nameLink: "Name Link",
			degree: "Degree",
			honorific: "Honorific",
			forename: "First Name",
			surname: "Last Name",
			addName: "Honorific",
			orgName: "Organization",
		},
		keyword: {
			title_one: "Keyword ({{count}})",
			title_other: "Keywords ({{count}})",
		},
		source: {
			title: "Source",
		},
		footnotes: {
			title_one: "Footnote ({{count}})",
			title_other: "Footnotes ({{count}})",
		},
		bibliographicReferences: {
			title_one: "Reference ({{count}})",
			title_other: "References ({{count}})",
		},
	},
	unitex: {
		underlineWordsInText: "Underline words in the text",
		toggleBlock_show: "Activate underlining of words in the text",
		toggleBlock_hide: "Deactivate underlining of words in the text",
		toggleTerm_show: 'Activate underlining for the term "{{term}}"',
		toggleTerm_hide: 'Deactivate underlining for the term "{{term}}"',

		date_one: "Date ({{count}})",
		date_other: "Dates ({{count}})",
		orgName_one: "Organization name ({{count}})",
		orgName_other: "Organizations names ({{count}})",
		orgNameFunder_one: "Funding organization or funded project ({{count}})",
		orgNameFunder_other: "Funding organizations or funded projects ({{count}})",
		orgNameProvider_one: "Resource hosting organization ({{count}})",
		orgNameProvider_other: "Resource hosting organizations ({{count}})",
		persName_one: "Person name ({{count}})",
		persName_other: "People names ({{count}})",
		placeName_one: "Administrative place name ({{count}})",
		placeName_other: "Administrative places names ({{count}})",
		geogName_one: "Geographical place name ({{count}})",
		geogName_other: "Geographical places names ({{count}})",
		ref_one: "Reference ({{count}})",
		ref_other: "References ({{count}})",
		refBibl_one: "Citation ({{count}})",
		refBibl_other: "Citations ({{count}})",
		refUrl_one: "URL ({{count}})",
		refUrl_other: "URLs ({{count}})",
	},
	multicat: {
		inist: "INIST Category",
		wos: "WOS Category",
		science_metrix: "Science-Metrix Category",
		scopus: "Scopus Category",
	},
	fullScreen: {
		enter: "Enter full screen mode",
		exit: "Exit full screen mode",
	},
};
