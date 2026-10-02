import type { Translation } from "./fr-FR";

export const esES: Translation = {
	commons: {
		colon: ": ",
	},
	document: {
		abstract: {
			title: "Resumen",
			nextLanguage: "Siguiente idioma",
			previousLanguage: "Idioma anterior",
		},
		tableOfContent: "Índice",
		lang: "Idioma",
		retractedBadge: {
			label: "Retractado",
		},
	},
	authors: {
		title: "Autores",
		label: "Autor",
		genName: "Generación",
		nameLink: "Partícula",
		honorific: "Tratamiento",
		degree: "Grado académico",
		forename: "Nombre",
		surname: "Apellido",
		addName: "Tratamiento",
		orgName: "Organización",
		address: "Dirección de la organización",
	},
	appendices: {
		title: "Anexos",
	},
	sidePanel: {
		footNotes: "Notas al pie",
		open: "Abrir el panel lateral",
		close: "Cerrar el panel lateral",
		tabs: {
			metadata: "Metadatos del editor",
			enrichment_zero: "Enriquecimientos Istex (0)",
			enrichment_one: "Enriquecimientos Istex ({{count}})",
			enrichment_other: "Enriquecimientos Istex ({{count}})",
			enrichmentTooltip_zero: "Sin enriquecimientos Istex",
			enrichmentTooltip_one: "1 categoría de enriquecimiento Istex",
			enrichmentTooltip_other: "{{count}} categorías de enriquecimientos Istex",
		},
		source: {
			title: "Fuente",
		},
		keyword: {
			title_one: "Palabras clave ({{count}})",
			title_other: "Palabras clave ({{count}})",
		},
		footnotes: {
			title_one: "Nota al pie ({{count}})",
			title_other: "Notas al pie ({{count}})",
		},
		bibliographicReferences: {
			title_one: "Referencia bibliográfica ({{count}})",
			title_other: "Referencias bibliográficas ({{count}})",
			tooltip:
				"La verificación de las referencias bibliográficas se realiza mediante el <bibCheckLink>servicio bibCheck</bibCheckLink>.",
			validationStatus: {
				found: {
					label: "Válido",
					tooltip:
						"Referencia encontrada en Crossref o DataCite y considerada válida.",
				},
				not_found: {
					label: "No encontrada",
					tooltip:
						"Referencia no encontrada en Crossref ni en DataCite, pero que no parece haber sido generada por IA.",
				},
				to_be_verified: {
					label: "Por confirmar",
					tooltip:
						"Referencia que podría haber sido generada por IA o que podría ser errónea.",
				},
				retracted: {
					label: "Retractada",
					tooltip: "Referencia retractada.",
				},
			},
		},
		documentIdentifier: {
			title: "Identificador del documento",
		},
	},
	termEnrichment: {
		underlineWordsInText: "Subrayar las palabras del texto",
		toggleBlock_show: "Activar el subrayado de las palabras en el texto",
		toggleBlock_hide: "Desactivar el subrayado de las palabras en el texto",
		toggleTerm_show: 'Activar el subrayado de la palabra "{{term}}"',
		toggleTerm_hide: 'Desactivar el subrayado de la palabra "{{term}}"',
		previous: "Ir al anterior",
		next: "Ir al siguiente",

		date_zero: "Denominación de fecha (Unitex)",
		date_one: "Denominación de fecha (Unitex) ({{count}})",
		date_other: "Denominaciones de fechas (Unitex) ({{count}})",

		orgName_zero: "Denominación de la organización (Unitex)",
		orgName_one: "Denominación de la organización (Unitex) ({{count}})",
		orgName_other: "Denominaciones de organizaciones (Unitex) ({{count}})",

		orgNameFunder_zero: "Denominación del organismo financiador (Unitex)",
		orgNameFunder_one:
			"Denominación del organismo financiador (Unitex) ({{count}})",
		orgNameFunder_other:
			"Denominaciones de organismos financiadores (Unitex) ({{count}})",

		orgNameProvider_zero:
			"Denominación de la entidad que aloja los recursos (Unitex)",
		orgNameProvider_one:
			"Denominación de la entidad que aloja los recursos (Unitex) ({{count}})",
		orgNameProvider_other:
			"Denominaciones de entidades que alojan recursos (Unitex) ({{count}})",

		persName_zero: "Denominación de persona (Unitex)",
		persName_one: "Denominación de persona (Unitex) ({{count}})",
		persName_other: "Denominaciones de personas (Unitex) ({{count}})",

		placeName_zero: "Denominación de lugar administrativo (Unitex)",
		placeName_one: "Denominación de lugar administrativo (Unitex) ({{count}})",
		placeName_other:
			"Denominaciones de lugares administrativos (Unitex) ({{count}})",

		geogName_zero: "Denominación de lugar geográfico (Unitex)",
		geogName_one: "Denominación de lugar geográfico (Unitex) ({{count}})",
		geogName_other:
			"Denominaciones de lugares geográficos (Unitex) ({{count}})",

		ref_zero: "Referencia bibliográfica",
		ref_one: "Referencia bibliográfica ({{count}})",
		ref_other: "Referencias bibliográficas ({{count}})",

		refBibl_zero: "Cita (Unitex)",
		refBibl_one: "Cita (Unitex) ({{count}})",
		refBibl_other: "Citas (Unitex) ({{count}})",

		refUrl_zero: "URL (Unitex)",
		refUrl_one: "URL (Unitex) ({{count}})",
		refUrl_other: "URLs (Unitex) ({{count}})",

		teeft_zero: "Palabra clave (Teeft)",
		teeft_one: "Palabra clave (Teeft) ({{count}})",
		teeft_other: "Palabras clave (Teeft) ({{count}})",
	},
	multicat: {
		inist: "Categoría Inist (Naive Bayes)",
		wos: "Categoría WoS (Multicat)",
		science_metrix: "Categoría Science-Metrix (Multicat)",
		scopus: "Categoría Scopus (Multicat)",
	},
	fullScreen: {
		enter: "Pasar al modo de pantalla completa",
		exit: "Salir del modo de pantalla completa",
	},
	figure: {
		unloaded: "Imagen no disponible",
	},
	source: {
		eISBN: {
			label: "ISBN",
			type: " (electrónica)",
		},
		pISBN: {
			label: "ISBN",
			type: " (impresa)",
		},
		eISSN: {
			label: "ISSN",
			type: " (electrónica)",
		},
		pISSN: {
			label: "ISSN",
			type: " (impresa)",
		},
		publisher: "{{publisher}}.",
		volume: "Vol. {{volume}}",
		issue_without_year: "n.º {{issue}}",
		issue_with_year: "n.º {{issue}} ({{year}})",
		year: "({{year}})",
		pages_one: "p. {{pages}}",
		pages_other: "pp. {{pages}}",
	},
};
