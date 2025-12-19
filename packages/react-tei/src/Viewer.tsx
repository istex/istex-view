import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMemo, useRef } from "react";
import { DocumentAbstract } from "./DocumentAbstract.js";
import { DocumentBody } from "./DocumentBody.js";
import { DocumentContextProvider } from "./DocumentContextProvider.js";
import { DocumentTitle } from "./DocumentTitle.js";
import { I18nProvider } from "./i18n/I18nProvider.js";
import { DocumentNavigationContextProvider } from "./navigation/DocumentNavigationContext.js";
import { getDocumentJsonAtPath } from "./parser/getDocumentJsonAtPath.js";
import { transformBody } from "./parser/transformDocument.js";
import { useDocumentParser } from "./parser/useDocumentParser.js";
import { DocumentSidePanel } from "./SidePanel/DocumentSidePanel.js";
import { TagCatalogProvider } from "./tags/TagCatalogProvider.js";
import { tagCatalog } from "./tags/tagCatalog.js";
import { TableOfContent } from "./toc/TableOfContent.js";
import { TableOfContentAccordion } from "./toc/TableOfContentAccordion.js";
import { useTableOfContent } from "./toc/useTableOfContent.js";

export const Viewer = ({
	document,
	height = "100vh",
}: {
	document: string;
	height?: string;
}) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl"));

	const documentRef = useRef<HTMLDivElement | null>(null);
	const sidePanelRef = useRef<HTMLDivElement | null>(null);

	const jsonDocument = useDocumentParser(document);

	const teiHeader = getDocumentJsonAtPath(jsonDocument, [
		"TEI",
		"teiHeader",
	]) ?? {
		tag: "teiHeader",
		value: [],
	};

	const body = useMemo(() => {
		const body = getDocumentJsonAtPath(jsonDocument, [
			"TEI",
			"text",
			"body",
		]) ?? {
			tag: "body",
			value: [],
		};

		return transformBody(body);
	}, [jsonDocument]);

	const tableOfContent = useTableOfContent(body, 3);

	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={jsonDocument}>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<DocumentNavigationContextProvider
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
						>
							<Stack direction="row" flexGrow={1} justifyContent="center">
								{!isSmallScreen && (
									<TableOfContent tableOfContent={tableOfContent} />
								)}

								<Stack
									sx={{
										flexGrow: 1,
										overflowX: "hidden",
										overflowY: "auto",
										paddingInline: {
											xs: 2,
											lg: 0,
										},
										height,
										maxHeight: height,
									}}
									component="section"
								>
									<Stack
										marginInline={{
											sx: "auto",
											xl: "0 auto",
										}}
										paddingBlock={4}
										maxWidth={{ xs: "100%", md: "732px" }}
										gap={4}
										position="relative"
										ref={documentRef}
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
										>
											<DocumentTitle teiHeader={teiHeader} />
											<DocumentBody body={body} />
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
