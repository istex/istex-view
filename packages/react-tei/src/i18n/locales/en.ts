import type { Translation } from "./fr";

export const en: Translation = {
	commons: {
		colon: ": ",
	},
	document: {
		abstract: {
			title: "Abstract",
			nextLanguage: "Next Language",
			previousLanguage: "Previous Language",
		},
		tableOfContent: "Table of Contents",
		lang: "Language",
	},

	authors: {
		title: "Authors",
		label: "Author",
		genName: "Generation",
		nameLink: "Name Link",
		degree: "Degree",
		honorific: "Honorific",
		forename: "First Name",
		surname: "Last Name",
		addName: "Honorific",
		orgName: "Organization",
		address: "Organization Address",
	},
	appendices: {
		title: "Appendices",
	},
	sidePanel: {
		footNotes: "Foot Notes",
		open: "Open the side panel",
		close: "Close the side panel",
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
		documentIdentifier: {
			title: "Document Identifier",
		},
	},
	termEnrichment: {
		underlineWordsInText: "Underline words in the text",
		toggleBlock_show: "Activate underlining of words in the text",
		toggleBlock_hide: "Deactivate underlining of words in the text",
		toggleTerm_show: 'Activate underlining for the term "{{term}}"',
		toggleTerm_hide: 'Deactivate underlining for the term "{{term}}"',
		previous: "Go to previous",
		next: "Go to next",

		date_zero: "Dates",
		date_one: "Date ({{count}})",
		date_other: "Dates ({{count}})",

		orgName_zero: "Organizations names",
		orgName_one: "Organization name ({{count}})",
		orgName_other: "Organizations names ({{count}})",

		orgNameFunder_zero: "Funding organizations or funded projects",
		orgNameFunder_one: "Funding organization or funded project ({{count}})",
		orgNameFunder_other: "Funding organizations or funded projects ({{count}})",

		orgNameProvider_zero: "Resource hosting organizations",
		orgNameProvider_one: "Resource hosting organization ({{count}})",
		orgNameProvider_other: "Resource hosting organizations ({{count}})",

		persName_zero: "People names",
		persName_one: "Person name ({{count}})",
		persName_other: "People names ({{count}})",

		placeName_zero: "Administrative places names",
		placeName_one: "Administrative place name ({{count}})",
		placeName_other: "Administrative places names ({{count}})",

		geogName_zero: "Geographical places names",
		geogName_one: "Geographical place name ({{count}})",
		geogName_other: "Geographical places names ({{count}})",

		ref_zero: "References",
		ref_one: "Reference ({{count}})",
		ref_other: "References ({{count}})",

		refBibl_zero: "Citations",
		refBibl_one: "Citation ({{count}})",
		refBibl_other: "Citations ({{count}})",

		refUrl_zero: "URLs",
		refUrl_one: "URL ({{count}})",
		refUrl_other: "URLs ({{count}})",

		teeft_zero: "Specific terms (Teeft)",
		teeft_one: "Specific term (Teeft) ({{count}})",
		teeft_other: "Specific terms (Teeft) ({{count}})",
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
	figure: {
		unloaded: "Image not available",
	},
	source: {
		eISBN: {
			label: "ISBN",
			type: " (electronic)",
		},
		pISBN: {
			label: "ISBN",
			type: " (print)",
		},
		eISSN: {
			label: "ISSN",
			type: " (electronic)",
		},
		pISSN: {
			label: "ISSN",
			type: " (print)",
		},

		publisher: "{{publisher}}.",
		volume: "Vol. {{volume}}",
		issue_without_year: "no. {{issue}}",
		issue_with_year: "no. {{issue}} ({{year}})",
		year: "({{year}})",
		pages_one: "p. {{pages}}",
		pages_other: "pp. {{pages}}",
	},
};
