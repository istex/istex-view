export const fr = {
	header: {
		title: "Viewer",
		subtitle: "Lorem ipsum dolor sit amet",
		description: "Excepteur sint occaecat cupidatat non proident",
	},
	navbar: {
		istex: "istex",
		a_zJournalsList: "Revue de sommaire",
		documentaryDataset: "Référentiels documentaires",
		specializedCorpus: "Corpus spécialisés",
		istexTdm: "ISTEX TDM",
		loterre: "Istex Loterre",
	},
	upload: {
		selectFile: "Sélectionner un fichier",
		noFileSelected: "Aucun fichier sélectionné",
		launchViewer: "Lancer la visionneuse",
		document: {
			placeholder: "Aucun fichier document sélectionné",
			buttonLabel: "Document TEI",
		},
		unitex: {
			placeholder: "Aucun fichier d'enrichissement sélectionné (optionnel)",
			buttonLabel: "Enrichissement Unitex",
		},
		multicat: {
			placeholder: "Aucun fichier d'enrichissement sélectionné (optionnel)",
			buttonLabel: "Enrichissement Multicat",
		},
		nb: {
			placeholder: "Aucun fichier d'enrichissement sélectionné (optionnel)",
			buttonLabel: "Enrichissement Nb",
		},
		teeft: {
			placeholder: "Aucun fichier d'enrichissement sélectionné (optionnel)",
			buttonLabel: "Enrichissement TEEFT",
		},
	},
	ark: {
		documentNotFound: "Le document demandé n'a pas été trouvé.",
	},
	errors: {
		DocumentNotFoundError: "Aucun document ne correspond à cet identifiant.",
		NoFulltextError:
			"La récupération du texte intégral au format TEI a échoué.",
		EnrichmentFetchingError:
			"La récupération de l'enrichissement {{enrichmentName}} a échoué.",
	},
};

export type Translation = typeof fr;
