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
	sidePanel: {
		footNotes: "Notes de bas de page",
		open: "Ouvrir le panneau latéral",
		close: "Fermer le panneau latéral",
		author: {
			title_one: "Auteur ({{count}})",
			title_other: "Auteurs ({{count}})",
			label: "Auteur",
			genName: "Génération",
			nameLink: "Particule",
			honorific: "Civilité",
			degree: "Diplôme",
			forename: "Prénom",
			surname: "Nom",
			addName: "Civilité",
			orgName: "Organisation",
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

		date_one: "Date ({{count}})",
		date_other: "Dates ({{count}})",
		orgName_one: "Nom d'organisation ({{count}})",
		orgName_other: "Noms d'organisations ({{count}})",
		orgNameFunder_one: "Organisme financeur ou projet financé ({{count}})",
		orgNameFunder_other:
			"Organismes financeurs ou projets financés ({{count}})",
		orgNameProvider_one: "Organisme hébergeur de ressources ({{count}})",
		orgNameProvider_other: "Organismes hébergeurs de ressources ({{count}})",
		persName_one: "Nom de personne ({{count}})",
		persName_other: "Noms de personnes ({{count}})",
		placeName_one: "Nom de lieu administratif ({{count}})",
		placeName_other: "Noms de lieux administratifs ({{count}})",
		geogName_one: "Nom de lieu géographique ({{count}})",
		geogName_other: "Noms de lieux géographiques ({{count}})",
		ref_one: "Référence ({{count}})",
		ref_other: "Références ({{count}})",
		refBibl_one: "Citation ({{count}})",
		refBibl_other: "Citations ({{count}})",
		refUrl_one: "URL ({{count}})",
		refUrl_other: "URLs ({{count}})",
		teeft_one: "Terme spécifique (Teeft) ({{count}})",
		teeft_other: "Termes spécifiques (Teeft) ({{count}})",
	},
	multicat: {
		inist: "Catégorie INIST",
		wos: "Catégorie WOS",
		science_metrix: "Catégorie Science-Metrix",
		scopus: "Catégorie Scopus",
	},
	fullScreen: {
		enter: "Passer en mode plein écran",
		exit: "Quitter le mode plein écran",
	},
	figure: {
		unloaded: "Image non disponible",
	},
	source: {
		eISBN: "eISBN : ",
		pISBN: "pISBN : ",
		eISSN: "eISSN : ",
		pISSN: "pISSN : ",
	},
};

export type Translation = typeof fr;
