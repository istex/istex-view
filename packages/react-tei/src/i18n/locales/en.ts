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
		tabs: {
			metadata: "Editor Metadata",
			enrichment_zero: "Istex Enrichments (0)",
			enrichment_one: "Istex Enrichment ({{count}})",
			enrichment_other: "Istex Enrichments ({{count}})",
			enrichmentTooltip_zero: "No Istex enrichments",
			enrichmentTooltip_one: "1 category of Istex enrichment",
			enrichmentTooltip_other: "{{count}} categories of Istex enrichments",
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

		date_zero: "Dates (Unitex)",
		date_one: "Date (Unitex) ({{count}})",
		date_other: "Dates (Unitex) ({{count}})",

		orgName_zero: "Organizations names (Unitex)",
		orgName_one: "Organization name (Unitex) ({{count}})",
		orgName_other: "Organizations names (Unitex) ({{count}})",

		orgNameFunder_zero: "Funding organizations or funded projects (Unitex)",
		orgNameFunder_one:
			"Funding organization or funded project (Unitex) ({{count}})",
		orgNameFunder_other:
			"Funding organizations or funded projects (Unitex) ({{count}})",

		orgNameProvider_zero: "Resource hosting organizations",
		orgNameProvider_one: "Resource hosting organization (Unitex) ({{count}})",
		orgNameProvider_other:
			"Resource hosting organizations (Unitex) ({{count}})",

		persName_zero: "People names (Unitex)",
		persName_one: "Person name (Unitex) ({{count}})",
		persName_other: "People names (Unitex) ({{count}})",

		placeName_zero: "Administrative places names (Unitex)",
		placeName_one: "Administrative place name (Unitex) ({{count}})",
		placeName_other: "Administrative places names (Unitex) ({{count}})",

		geogName_zero: "Geographical places names (Unitex)",
		geogName_one: "Geographical place name (Unitex) ({{count}})",
		geogName_other: "Geographical places names (Unitex) ({{count}})",

		ref_zero: "References",
		ref_one: "Reference ({{count}})",
		ref_other: "References ({{count}})",

		refBibl_zero: "Citations (Unitex)",
		refBibl_one: "Citation (Unitex) ({{count}})",
		refBibl_other: "Citations (Unitex) ({{count}})",

		refUrl_zero: "URLs (Unitex)",
		refUrl_one: "URL (Unitex) ({{count}})",
		refUrl_other: "URLs (Unitex) ({{count}})",

		teeft_zero: "Keyword (Teeft)",
		teeft_one: "Keyword (Teeft) ({{count}})",
		teeft_other: "Keywords (Teeft) ({{count}})",
	},
	multicat: {
		inist: "Inist Category (Naive Bayes)",
		wos: "WOS Category (Multicat)",
		science_metrix: "Science-Metrix Category (Multicat)",
		scopus: "Scopus Category (Multicat)",
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
