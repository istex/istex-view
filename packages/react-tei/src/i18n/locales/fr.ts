export const fr = {
	commons: {
		colon: " : ",
	},
	document: {
		abstract: {
			title: "Résumé",
			nextLanguage: "Langue suivante",
			previousLanguage: "Langue précédente",
		},
		tableOfContent: "Table des matières",
		lang: "Langue",
	},
	authors: {
		title: "Auteurs",
		label: "Auteur",
		genName: "Génération",
		nameLink: "Particule",
		honorific: "Civilité",
		degree: "Diplôme",
		forename: "Prénom",
		surname: "Nom",
		addName: "Civilité",
		orgName: "Organisation",
		address: "Adresse de l'organisation",
	},
	appendices: {
		title: "Annexes",
	},
	sidePanel: {
		footNotes: "Notes de bas de page",
		open: "Ouvrir le panneau latéral",
		close: "Fermer le panneau latéral",
		tabs: {
			metadata: "Métadonnées éditeur",
			enrichment_zero: "Enrichissements Istex (0)",
			enrichment_one: "Enrichissement Istex ({{count}})",
			enrichment_other: "Enrichissements Istex ({{count}})",
			enrichmentTooltip_zero: "Pas d'enrichissements Istex",
			enrichmentTooltip_one: "1 catégorie d'enrichissement Istex",
			enrichmentTooltip_other: "{{count}} catégories d'enrichissements Istex",
		},
		source: {
			title: "Source",
		},
		keyword: {
			title_one: "Mots-clé ({{count}})",
			title_other: "Mots-clés ({{count}})",
		},
		footnotes: {
			title_one: "Note de bas de page ({{count}})",
			title_other: "Notes de bas de page ({{count}})",
		},
		bibliographicReferences: {
			title_one: "Référence bibliographique ({{count}})",
			title_other: "Références bibliographiques ({{count}})",
		},
		documentIdentifier: {
			title: "Identifiant du document",
		},
	},
	termEnrichment: {
		underlineWordsInText: "Souligner les mots dans le texte",
		toggleBlock_show: "Activer le soulignement des mots dans le texte",
		toggleBlock_hide: "Désactiver le soulignement des mots dans le texte",
		toggleTerm_show: 'Activer le soulignement pour le terme "{{term}}"',
		toggleTerm_hide: 'Désactiver le soulignement pour le terme "{{term}}"',
		previous: "Aller au précédent",
		next: "Aller au suivant",

		date_zero: "Date (Unitex)",
		date_one: "Date (Unitex) ({{count}})",
		date_other: "Dates (Unitex) ({{count}})",

		orgName_zero: "Nom d'organisation (Unitex)",
		orgName_one: "Nom d'organisation (Unitex) ({{count}})",
		orgName_other: "Noms d'organisations (Unitex) ({{count}})",

		orgNameFunder_zero: "Organisme financeur ou projet financé (Unitex)",
		orgNameFunder_one:
			"Organisme financeur ou projet financé (Unitex) ({{count}})",
		orgNameFunder_other:
			"Organismes financeurs ou projets financés (Unitex) ({{count}})",

		orgNameProvider_zero: "Organisme hébergeur de ressources (Unitex)",
		orgNameProvider_one:
			"Organisme hébergeur de ressources (Unitex) ({{count}})",
		orgNameProvider_other:
			"Organismes hébergeurs de ressources (Unitex) ({{count}})",

		persName_zero: "Nom de personne (Unitex)",
		persName_one: "Nom de personne (Unitex) ({{count}})",
		persName_other: "Noms de personnes (Unitex) ({{count}})",

		placeName_zero: "Nom de lieu administratif (Unitex)",
		placeName_one: "Nom de lieu administratif (Unitex) ({{count}})",
		placeName_other: "Noms de lieux administratifs (Unitex) ({{count}})",

		geogName_zero: "Nom de lieu géographique (Unitex)",
		geogName_one: "Nom de lieu géographique (Unitex) ({{count}})",
		geogName_other: "Noms de lieux géographiques (Unitex) ({{count}})",

		ref_zero: "Référence",
		ref_one: "Référence ({{count}})",
		ref_other: "Références ({{count}})",

		refBibl_zero: "Citation (Unitex)",
		refBibl_one: "Citation (Unitex) ({{count}})",
		refBibl_other: "Citations (Unitex) ({{count}})",

		refUrl_zero: "URL (Unitex)",
		refUrl_one: "URL (Unitex) ({{count}})",
		refUrl_other: "URLs (Unitex) ({{count}})",

		teeft_zero: "Mot-clé (Teeft)",
		teeft_one: "Mot-clé (Teeft) ({{count}})",
		teeft_other: "Mot-clés (Teeft) ({{count}})",
	},
	multicat: {
		inist: "Catégorie Inist (Bayésien naïf)",
		wos: "Catégorie WOS (Multicat)",
		science_metrix: "Catégorie Science-Metrix (Multicat)",
		scopus: "Catégorie Scopus (Multicat)",
	},
	fullScreen: {
		enter: "Passer en mode plein écran",
		exit: "Quitter le mode plein écran",
	},
	figure: {
		unloaded: "Image non disponible",
	},
	source: {
		eISBN: {
			label: "ISBN",
			type: " (électronique)",
		},
		pISBN: {
			label: "ISBN",
			type: " (papier)",
		},
		eISSN: {
			label: "ISSN",
			type: " (électronique)",
		},
		pISSN: {
			label: "ISSN",
			type: " (papier)",
		},
		publisher: "{{publisher}}.",
		volume: "Vol. {{volume}}",
		issue_without_year: "n° {{issue}}",
		issue_with_year: "n° {{issue}} ({{year}})",
		year: "({{year}})",
		pages_one: "p. {{pages}}",
		pages_other: "pp. {{pages}}",
	},
};

export type Translation = typeof fr;
