# Supported TEI Tags

This document lists all TEI tags supported by the istex-view viewer.

## Sections

- **Body**: Main document body
- **Footnotes**: Footnotes sidebar section
- **Bibref**: Bibliographic references sidebar section
- **Authors**: Authors sidebar section
- **Source**: Source sidebar section
- **Keywords**: Keywords sidebar section
- **Figure**: Inside figure elements
- **FloatingText**: Inside floating text elements

## All Supported Tags

| Tag | Description | Sections | Component |
| --- | ----------- | -------- | --------- |
| `addName` | Additional name | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/authors/tags/PersNamePart.tsx) |
| `address` | Physical address | Authors | [Address.tsx](../packages/react-tei/src/authors/tags/Address.tsx) |
| `addrLine` | Address line | Authors | NoOp |
| `affiliation` | Author affiliation | Authors | [Affiliation.tsx](../packages/react-tei/src/authors/tags/Affiliation.tsx) |
| `author` | Author element | Authors, Bibref | [Author.tsx](../packages/react-tei/src/authors/tags/Author.tsx) / NoOp |
| `bibl` | Bibliographic reference | Body, Bibref | [Bibl.tsx](../packages/react-tei/src/SidePanel/bibliographicReferences/Bibl.tsx) |
| `biblScope` | Bibliographic scope (volume, pages, etc.) | Body, Bibref, Source | NoOp |
| `biblStruct` | Structured bibliographic reference | Bibref | [BiblStruct.tsx](../packages/react-tei/src/SidePanel/bibliographicReferences/BiblStruct.tsx) |
| `bloc` | Address block | Authors | NoOp |
| `body` | Document body container | Body, FloatingText | NoOp |
| `city` | City name | Authors | NoOp |
| `country` | Country name | Authors | NoOp |
| `date` | Date element | Body, Footnotes, Bibref, Source | [DateTag.tsx](../packages/react-tei/src/tags/DateTag.tsx) |
| `district` | District name | Authors | NoOp |
| `div` | Division/section | Body | [Div.tsx](../packages/react-tei/src/tags/Div.tsx) |
| `email` | Email address | Authors | Nothing |
| `emph` | Emphasized text | Body, Footnotes, Bibref | [Emph.tsx](../packages/react-tei/src/tags/Emph.tsx) |
| `figDesc` | Figure description | Figure | [FigDesc.tsx](../packages/react-tei/src/tags/figure/FigDesc.tsx) |
| `figure` | Figure with graphics or tables | Body | [Figure.tsx](../packages/react-tei/src/tags/Figure.tsx) |
| `floatingText` | Floating text element | Body | [FloatingText.tsx](../packages/react-tei/src/tags/floatingText/FloatingText.tsx) |
| `forename` | First name | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/authors/tags/PersNamePart.tsx) / NoOp |
| `formula` | Mathematical formula with notation or rendering | Body, Footnotes, Bibref | [Formula.tsx](../packages/react-tei/src/tags/Formula.tsx) |
| `genName` | Generational name (Jr., Sr., etc.) | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/authors/tags/PersNamePart.tsx) / NoOp |
| `graphic` | Graphic element (used in formulas) | Body, Footnotes, Bibref | [Graphic.tsx](../packages/react-tei/src/tags/Graphic.tsx) |
| `head` | Heading element | Body, Figure, FloatingText, Keywords | [Head.tsx](../packages/react-tei/src/tags/Head.tsx) / [FloatingTextHead.tsx](../packages/react-tei/src/tags/floatingText/FloatingTextHead.tsx) / Nothing |
| `hi` | Highlighted text (various renditions) | Body, Footnotes, Bibref, Figure, Keywords | [Hi.tsx](../packages/react-tei/src/tags/Hi.tsx) |
| `highlight` | Enrichment highlight | Body, Figure | [Highlight.tsx](../packages/react-tei/src/tags/Highlight.tsx) |
| `highlightedText` | Text highlighted by enrichment | Body, Figure | NoOp |
| `idno` | Identifier number | Authors, Source | [SourceIdno.tsx](../packages/react-tei/src/SidePanel/source/tags/SourceIdno.tsx) / Nothing |
| `imprint` | Imprint information | Source | [SourceImprint.tsx](../packages/react-tei/src/SidePanel/source/tags/SourceImprint.tsx) |
| `item` | List item | Body, Keywords | NoOp |
| `keywords` | Keywords section | Keywords | [Keywords.tsx](../packages/react-tei/src/SidePanel/keywords/Keywords.tsx) |
| `l` | Line (in verse) | Footnotes | [L.tsx](../packages/react-tei/src/tags/L.tsx) |
| `label` | Label element | Figure | [Head.tsx](../packages/react-tei/src/tags/figure/Head.tsx) |
| `lg` | Line group (verse stanza) | Footnotes | [Lg.tsx](../packages/react-tei/src/tags/Lg.tsx) |
| `list` | List element (ordered/unordered) | Body, Keywords | [List.tsx](../packages/react-tei/src/tags/list/List.tsx) / NoOp |
| `math` | MathML root element | Body, Footnotes, Bibref | [MathMLTag.tsx](../packages/react-tei/src/tags/formula/mathml/MathMLTag.tsx) |
| MathML tags | All MathML tags (203 total) | Body, Footnotes, Bibref | [MathMLTag.tsx](../packages/react-tei/src/tags/formula/mathml/MathMLTag.tsx) |
| `name` | Generic name element | Authors, Bibref | [Name.tsx](../packages/react-tei/src/authors/tags/Name.tsx) / NoOp |
| `nameLink` | Name linking particle (de, von, etc.) | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/authors/tags/PersNamePart.tsx) / NoOp |
| `note` | Note/footnote element | Footnotes, Bibref | [Note.tsx](../packages/react-tei/src/SidePanel/footNotes/Note.tsx) / NoOp |
| `orgName` | Organization name | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/authors/tags/PersNamePart.tsx) / NoOp |
| `p` | Paragraph | Body, Footnotes | [P.tsx](../packages/react-tei/src/tags/P.tsx) |
| `persName` | Personal name | Authors, Bibref | [PersName.tsx](../packages/react-tei/src/SidePanel/bibliographicReferences/PersName.tsx) / NoOp |
| `postBox` | Post office box | Authors | NoOp |
| `postCode` | Postal code | Authors | NoOp |
| `pubPlace` | Publication place | Bibref | NoOp |
| `publisher` | Publisher | Bibref, Source | NoOp |
| `quote` | Quoted text block | Body, Footnotes, Bibref | [Quote.tsx](../packages/react-tei/src/tags/Quote.tsx) |
| `ref` | Reference (footnote, bibliographic, URL, table) | Body, Footnotes, Bibref | [Ref.tsx](../packages/react-tei/src/tags/Ref.tsx) |
| `region` | Region name | Authors | NoOp |
| `roleName` | Role name | Authors, Bibref | Nothing / NoOp |
| `s` | Sentence | Body | NoOp |
| `sc` | Small capitals | Body | NoOp |
| `series` | Series information | Bibref | NoOp |
| `settlement` | Settlement name | Authors | NoOp |
| `state` | State name | Authors | NoOp |
| `street` | Street name | Authors | NoOp |
| `surname` | Last name | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/authors/tags/PersNamePart.tsx) / NoOp |
| `table` | Table element | Body | [Table.tsx](../packages/react-tei/src/tags/Table.tsx) |
| `term` | Keyword term | Keywords | [Term.tsx](../packages/react-tei/src/SidePanel/keywords/Term.tsx) |
| `title` | Title element | Body, Bibref | [Title.tsx](../packages/react-tei/src/tags/Title.tsx) / NoOp |

See [mathMLTagNames.ts](../packages/react-tei/src/tags/formula/mathml/mathMLTagNames.ts) for the complete list of 203 supported MathML tags.

## Reference Types

The `ref` tag supports multiple reference types via the `@type` attribute:

- `bibr`: Bibliographic reference
- `fn`: Footnote reference
- `url`/`uri`: URL/URI reference
- `fig`/`figure`: Figure reference
- `table`: Table reference
- `table-fn`: Table footnote reference

## Notes

- `NoOp` components render their children without additional styling or behavior
- `Nothing` components render nothing (children are hidden)
- Math tags (formula, graphic, and all MathML tags) are available in all contexts
