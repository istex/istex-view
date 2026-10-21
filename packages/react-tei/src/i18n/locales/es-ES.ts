import type { Translation } from "./fr-FR";

export const esES: Translation = {
	commons: {
		colon: ": ",
	},
	document: {
		abstract: {
			title: "Resumen",
			nextLanguage: "Idioma siguiente",
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
		footNotes: "Notas a pie de página",
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
			title_one: "Palabra clave ({{count}})",
			title_other: "Palabras clave ({{count}})",
		},
		footnotes: {
			title_one: "Nota a pie de página ({{count}})",
			title_other: "Notas a pie de página ({{count}})",
		},
		bibliographicReferences: {
			title_one: "Referencia bibliográfica ({{count}})",
			title_other: "Referencias bibliográficas ({{count}})",
			tooltip:
				"La verificación de las referencias bibliográficas se realiza mediante el <bibCheckLink>servicio web bibCheck</bibCheckLink>.",
			validationStatus: {
				found: {
					label: "Válida",
					tooltip:
						"Referencia encontrada en Crossref o DataCite y considerada válida.",
				},
				not_found: {
					label: "No encontrada",
					tooltip:
						"Referencia no encontrada en Crossref ni en DataCite, pero que no parece haber sido generada por IA.",
				},
				to_be_verified: {
					label: "Por verificar",
					tooltip: "Referencia posiblemente generada por IA o errónea.",
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
		toggleBlock_show: "Activar el subrayado de las palabras del texto",
		toggleBlock_hide: "Desactivar el subrayado de las palabras del texto",
		toggleTerm_show: 'Activar el subrayado del término "{{term}}"',
		toggleTerm_hide: 'Desactivar el subrayado del término "{{term}}"',
		previous: "Ir al anterior",
		next: "Ir al siguiente",

		date_zero: "Fecha (Unitex)",
		date_one: "Fecha (Unitex) ({{count}})",
		date_other: "Fechas (Unitex) ({{count}})",

		orgName_zero: "Nombre de la organización (Unitex)",
		orgName_one: "Nombre de la organización (Unitex) ({{count}})",
		orgName_other: "Nombres de las organizaciones (Unitex) ({{count}})",

		orgNameFunder_zero: "Organismo financiador o proyecto financiado (Unitex)",
		orgNameFunder_one:
			"Organismo financiador o proyecto financiado (Unitex) ({{count}})",
		orgNameFunder_other:
			"Organismos financiadores o proyectos financiados (Unitex) ({{count}})",

		orgNameProvider_zero:
			"Organismo proveedeor de hosting de recursos (Unitex)",
		orgNameProvider_one:
			"Organismo proveedeor de hosting de recursos (Unitex) ({{count}})",
		orgNameProvider_other:
			"Organismos proveedeores de hosting de recursos (Unitex) ({{count}})",

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
		enter: "Pasar al modo pantalla completa",
		exit: "Salir del modo pantalla completa",
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
