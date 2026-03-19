export const fr = {
	header: {
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
		examples: "Exemples de documents\u00A0:",
		ArkForm: {
			head: "Testez Istex\u00A0View en saisissant l'identifiant ARK d'un document Istex.",
			submitButton: "Rechercher",
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
