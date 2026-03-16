import type { Translation } from "./fr";

export const en: Translation = {
	header: {
		title: "Viewer",
		subtitle: "A new way to view TEI documents in Istex",
		description:
			"Easily view and explore XML-TEI documents and their annotations",
	},
	navbar: {
		istex: "istex",
		a_zJournalsList: "Summary Review",
		documentaryDataset: "Documentary References",
		specializedCorpus: "Specialized Corpus",
		istexTdm: "Istex TDM",
		loterre: "Istex Loterre",
	},
	upload: {
		selectFile: "Select File",
		noFileSelected: "No File Selected",
		launchViewer: "Launch Viewer",
		document: {
			placeholder: "No document file selected",
			buttonLabel: "TEI Document",
		},
		unitex: {
			placeholder: "No enrichment file selected (optional)",
			buttonLabel: "Unitex Enrichment",
		},
		multicat: {
			placeholder: "No enrichment file selected (optional)",
			buttonLabel: "Multicat Enrichment",
		},
		nb: {
			placeholder: "No enrichment file selected (optional)",
			buttonLabel: "Nb Enrichment",
		},
		teeft: {
			placeholder: "No enrichment file selected (optional)",
			buttonLabel: "Teeft Enrichment",
		},
	},
	ark: {
		documentNotFound: "The requested document was not found.",
	},
	errors: {
		DocumentNotFoundError: "No documents match this identifier.",
		NoFulltextError: "Couldn't get the fulltext in TEI format.",
	},
};
