import { lime } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMemo, useRef } from "react";
import { DocumentAbstract } from "./DocumentAbstract";
import { DocumentBody } from "./DocumentBody";
import { DocumentContextProvider } from "./DocumentContextProvider";
import { DocumentTitle } from "./DocumentTitle";
import { I18nProvider } from "./i18n/I18nProvider";
import { DocumentNavigationContextProvider } from "./navigation/DocumentNavigationContext";
import { getDocumentJsonAtPath } from "./parser/getDocumentJsonAtPath";
import { transformBody } from "./parser/transformDocument";
import { useDocumentParser } from "./parser/useDocumentParser";
import {
	DocumentSidePanel,
	SIDEPANEL_WIDTH,
} from "./SidePanel/DocumentSidePanel";
import { useParseMulticatCategories } from "./SidePanel/multicat/useParseMulticatCategories";
import { TagCatalogProvider } from "./tags/TagCatalogProvider";
import { tagCatalog } from "./tags/tagCatalog";
import { TableOfContent } from "./toc/TableOfContent";
import { TableOfContentAccordion } from "./toc/TableOfContentAccordion";
import { useTableOfContent } from "./toc/useTableOfContent";
import { enrichDocumentWithUnitex } from "./unitex/enrichDocumentWithUnitex";
import { useUnitexEnrichmentParser } from "./unitex/useUnitexEnrichmentParser";

export const Viewer = ({
	document,
	unitexEnrichment,
	multicatEnrichment,
	nbEnrichment,
	height = "100vh",
}: {
	document: string;
	unitexEnrichment?: string | null;
	multicatEnrichment?: string | null;
	nbEnrichment?: string | null;
	height?: string;
}) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl"));

	const documentRef = useRef<HTMLDivElement | null>(null);
	const tocRef = useRef<HTMLDivElement | null>(null);
	const sidePanelRef = useRef<HTMLDivElement | null>(null);

	const jsonDocument = useDocumentParser(document);

	const jsonUnitexEnrichment = useUnitexEnrichmentParser(unitexEnrichment);

	const jsonMulticatEnrichment = useParseMulticatCategories(multicatEnrichment);
	const jsonNbEnrichment = useParseMulticatCategories(nbEnrichment);

	const teiHeader = getDocumentJsonAtPath(jsonDocument ?? [], [
		"TEI",
		"teiHeader",
	]) ?? {
		tag: "teiHeader",
		value: [],
	};

	const body = useMemo(() => {
		const body = getDocumentJsonAtPath(jsonDocument ?? [], [
			"TEI",
			"text",
			"body",
		]) ?? {
			tag: "body",
			value: [],
		};

		return transformBody(body);
	}, [jsonDocument]);
	const enrichedBody = useMemo(() => {
		if (body && jsonUnitexEnrichment) {
			return enrichDocumentWithUnitex(body, jsonUnitexEnrichment);
		}
		return body;
	}, [body, jsonUnitexEnrichment]);

	const tableOfContent = useTableOfContent(enrichedBody);

	if (!jsonDocument) {
		return null;
	}

	return (
		<I18nProvider>
			<DocumentContextProvider
				jsonDocument={jsonDocument}
				jsonUnitexEnrichment={jsonUnitexEnrichment}
				multicatEnrichment={[...jsonNbEnrichment, ...jsonMulticatEnrichment]}
			>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<DocumentNavigationContextProvider
						tocRef={tocRef}
						documentRef={documentRef}
						sidePanelRef={sidePanelRef}
					>
						<Stack
							component="article"
							flexGrow={1}
							height={height}
							maxHeight={height}
							width="100%"
							direction="row"
							sx={{
								"& *": {
									transition: "background-color 0.3s ease-in-out",
								},
								"& .tei-highlighted-group": {
									backgroundColor: lime[50],
								},
								"& .tei-highlighted": {
									backgroundColor: lime[100],
								},
							}}
							id="viewer"
						>
							<Stack direction="row" flexGrow={1} justifyContent="center">
								{!isSmallScreen && (
									<TableOfContent
										tableOfContent={tableOfContent}
										ref={tocRef}
									/>
								)}

								<Stack
									sx={{
										flexGrow: 1,
										overflowX: "hidden",
										overflowY: "auto",
										paddingInline: {
											xs: 2,
											xl: 0,
										},
										contain: {
											xs: "size",
											md: "none",
										},
										width: {
											xs: "100%",
											md: "initial",
										},
										height,
										maxHeight: height,
									}}
									component="section"
									role="document"
									ref={documentRef}
								>
									<Stack
										marginInline={{
											xs: "auto",
											xl: "0px auto",
										}}
										paddingBlock={4}
										maxWidth={{
											xs: "100%",
											md: `calc(100dvw - ${SIDEPANEL_WIDTH})`,
											lg: "732px",
										}}
										gap={4}
										position="relative"
									>
										<DocumentAbstract teiHeader={teiHeader} />

										{isSmallScreen && (
											<TableOfContentAccordion
												tableOfContent={tableOfContent}
											/>
										)}

										<Stack
											component="section"
											sx={{
												gap: 4,
												padding: 8,
												backgroundColor: "white",
											}}
											id="document-content"
										>
											<DocumentTitle teiHeader={teiHeader} />
											<DocumentBody body={enrichedBody} />
										</Stack>
									</Stack>
								</Stack>

								<DocumentSidePanel ref={sidePanelRef} />
							</Stack>
						</Stack>
					</DocumentNavigationContextProvider>
				</TagCatalogProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
};
