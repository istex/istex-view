import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MathJaxContext } from "better-react-mathjax";
import { useMemo, useRef } from "react";
import { DocumentAuthors } from "./authors/DocumentAuthors";
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
import { DocumentSidePanelContextProvider } from "./SidePanel/DocumentSidePanelContext";
import { useParseMulticatCategories } from "./SidePanel/multicat/useParseMulticatCategories";
import { TagCatalogProvider } from "./tags/TagCatalogProvider";
import { tagCatalog } from "./tags/tagCatalog";
import { useTeeftEnrichmentParser } from "./teeft/useTeeftEnrichmentParser";
import { enrichDocumentWithTerms } from "./termEnrichment/enrichDocumentWithTerm";
import { useUnitexEnrichmentParser } from "./termEnrichment/useUnitexEnrichmentParser";
import { TableOfContent } from "./toc/TableOfContent";
import { TableOfContentAccordion } from "./toc/TableOfContentAccordion";
import { useTableOfContent } from "./toc/useTableOfContent";

export const Viewer = ({
	document,
	unitexEnrichment,
	multicatEnrichment,
	nbEnrichment,
	teeftEnrichment,
	stickyTopOffset,
}: {
	document: string;
	unitexEnrichment?: string | null;
	multicatEnrichment?: string | null;
	nbEnrichment?: string | null;
	teeftEnrichment?: string | null;
	stickyTopOffset?: number;
}) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl"));

	const tocRef = useRef<HTMLDivElement | null>(null);
	const sidePanelRef = useRef<HTMLDivElement | null>(null);

	const jsonDocument = useDocumentParser(document);

	const jsonUnitexEnrichment = useUnitexEnrichmentParser(unitexEnrichment);

	const jsonMulticatEnrichment = useParseMulticatCategories(multicatEnrichment);
	const jsonNbEnrichment = useParseMulticatCategories(nbEnrichment);

	const jsonTeeftEnrichment = useTeeftEnrichmentParser(teeftEnrichment);

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

	const allEnrichments = useMemo(() => {
		return {
			...jsonUnitexEnrichment,
			teeft: jsonTeeftEnrichment,
		};
	}, [jsonUnitexEnrichment, jsonTeeftEnrichment]);
	const { enrichedDocument: enrichedBody, termCountByGroup } = useMemo<
		ReturnType<typeof enrichDocumentWithTerms>
	>(() => {
		if (body && allEnrichments) {
			return enrichDocumentWithTerms(body, allEnrichments);
		}
		return {
			enrichedDocument: body,
			termCountByGroup: {},
		};
	}, [body, allEnrichments]);

	const tableOfContent = useTableOfContent(enrichedBody);

	if (!jsonDocument) {
		return null;
	}

	return (
		<MathJaxContext asyncLoad hideUntilTypeset="first">
			<I18nProvider>
				<DocumentSidePanelContextProvider>
					<DocumentContextProvider
						jsonDocument={jsonDocument}
						jsonUnitexEnrichment={jsonUnitexEnrichment}
						jsonTeeftEnrichment={jsonTeeftEnrichment}
						multicatEnrichment={[
							...jsonNbEnrichment,
							...jsonMulticatEnrichment,
						]}
						termCountByGroup={termCountByGroup}
					>
						<TagCatalogProvider tagCatalog={tagCatalog}>
							<DocumentNavigationContextProvider
								tocRef={tocRef}
								sidePanelRef={sidePanelRef}
							>
								<Stack
									component="article"
									flexGrow={1}
									width="100%"
									direction="row"
									sx={{
										"& *": {
											transition: "background-color 0.3s ease-in-out",
										},
										"& .tei-highlighted-group": {
											backgroundColor: "#E3EF63",
											color: "#4A4A4A",
										},
										"& .tei-highlighted, & .tei-highlighted .tei-highlighted-group":
											{
												backgroundColor: "#C4D733",
												color: "#1D1D1D",
											},
									}}
									id="viewer"
								>
									<Stack direction="row" flexGrow={1} justifyContent="center">
										{!isSmallScreen && (
											<TableOfContent
												tableOfContent={tableOfContent}
												ref={tocRef}
												stickyTopOffset={stickyTopOffset}
											/>
										)}

										<Stack
											sx={{
												flexGrow: 1,
												paddingInline: 0,
												contain: {
													xs: "size",
													md: "none",
												},
												width: {
													xs: "100%",
													md: "initial",
												},
											}}
											component="section"
											role="document"
											id="document-container"
										>
											<Stack
												marginInline={{
													xs: "auto",
													xl: "1rem auto",
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
												<DocumentTitle teiHeader={teiHeader} />

												<DocumentAbstract teiHeader={teiHeader} />

												<DocumentAuthors />

												{isSmallScreen && (
													<TableOfContentAccordion
														tableOfContent={tableOfContent}
													/>
												)}

												<Stack
													component="section"
													sx={{
														gap: 4,
														padding: {
															xs: 2,
															md: 8,
														},
														backgroundColor: "white",
													}}
													id="document-content"
												>
													<DocumentBody body={enrichedBody} />
												</Stack>
											</Stack>
										</Stack>

										<DocumentSidePanel
											ref={sidePanelRef}
											stickyTopOffset={stickyTopOffset}
										/>
									</Stack>
								</Stack>
							</DocumentNavigationContextProvider>
						</TagCatalogProvider>
					</DocumentContextProvider>
				</DocumentSidePanelContextProvider>
			</I18nProvider>
		</MathJaxContext>
	);
};
