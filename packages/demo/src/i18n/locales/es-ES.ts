import type { Translation } from "./fr-FR";

export const esES: Translation = {
	header: {
		subtitle: "Una nueva perspectiva sobre los documentos TEI en Istex",
		description:
			"Consulte y explore fácilmente los documentos XML-TEI y sus enriquecimientos",
	},
	navbar: {
		burgerMenuAriaLabel: "Recursos externos de documentación científica",
		istex: "acceso a istex.fr",
		a_zJournalsList: "Sumarios de revistas",
		documentaryDataset: "Referencias documentales",
		specializedCorpus: "Corpus especializados",
		istexTdm: "Istex TDM",
		loterre: "Istex Loterre",
		LocalePicker: {
			selectAriaLabel: "Idioma",
		},
	},
	home: {
		headline: "Bienvenido a la versión beta pública de Istex\u00A0View.",
		paragraph:
			"Istex\u00A0View es una herramienta en línea que permite consultar las publicaciones científicas de la plataforma <istexLink>Istex</istexLink>, proporcionando una interfaz para visualizar el contenido de documentos TEI y los <enrichmentProcessLink>enriquecimientos generados por Istex</enrichmentProcessLink>.",
		examples: "Ejemplos de documentos:",
		ArkForm: {
			head: "Pruebe Istex\u00A0View introduciendo el identificador ARK de un documento Istex.",
			submitButton: "Buscar",
		},
	},
	ark: {
		documentNotFound: "No se ha encontrado el documento solicitado.",
	},
	errors: {
		DocumentNotFoundError:
			"No hay ningún documento que coincida con este identificador.",
		NoFulltextError:
			"No se ha podido obtener el texto completo en formato TEI.",
	},
};
