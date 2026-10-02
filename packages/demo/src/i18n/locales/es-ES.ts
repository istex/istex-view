import type { Translation } from "./fr-FR";

export const esES: Translation = {
	header: {
		subtitle: "Una nueva perspectiva sobre los documentos TEI en Istex",
		description:
			"Visualice y explore fácilmente documentos XML-TEI y sus anotaciones",
	},
	navbar: {
		istex: "Acceso a Istex.fr",
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
			"Istex\u00A0View es una herramienta en línea que permite consultar las publicaciones científicas de la plataforma <istexLink>Istex</istexLink>. Ofrece una interfaz para visualizar el contenido de los documentos TEI, así como los <enrichmentProcessLink>enriquecimientos Istex</enrichmentProcessLink>.",
		examples: "Ejemplos:",
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
			"No hemos podido obtener el texto completo en formato TEI.",
	},
};
