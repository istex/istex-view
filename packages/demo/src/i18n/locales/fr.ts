export const fr = {
	header: {
		title: "Viewer",
		subtitle: "Un nouveau regard sur les documents TEI dans Istex",
		description:
			"Consultez et explorez facilement les documents XML-TEI et leurs enrichissements",
	},
	navbar: {
		istex: "istex",
		a_zJournalsList: "Revue de sommaire",
		documentaryDataset: "Référentiels documentaires",
		specializedCorpus: "Corpus spécialisés",
		istexTdm: "Istex TDM",
		loterre: "Istex Loterre",
	},
	home: {
		headline: "Bienvenue sur la bêta publique d'Istex\u00A0View.",
		paragraph:
			"Istex\u00A0View est un outil en ligne permettant de consulter les publications scientifiques issues de la plateforme <istexLink>Istex</istexLink>. Il offre une interface pour visualiser le contenu des documents TEI ainsi que les <enrichmentProcessLink>enrichissements générés par Istex</enrichmentProcessLink>.",
		ArkForm: {
			submitButton: "Rechercher",
		},
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
	},
};

export type Translation = typeof fr;
