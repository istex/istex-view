# Supported TEI Tags

This document lists all TEI tags supported by the istex-view viewer.

## Sections

- **Body**: Main document body
- **Footnotes**: Footnotes sidebar section
- **Bibref**: Bibliographic references sidebar section
- **Authors**: Authors sidebar section
- **Source**: Source sidebar section
- **\***: Supported in all applicable sections

## All Supported Tags

| Tag | Description | Sections | Component |
| --- | ----------- | -------- | --------- |
| `addName` | Additional name | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/SidePanel/authors/PersNamePart.tsx) |
| `affiliation` | Author affiliation | Authors | Nothing |
| `author` | Author element | Bibref | NoOp |
| `bibl` | Bibliographic reference | Body, Bibref | [Bibl.tsx](../packages/react-tei/src/SidePanel/bibliographicReferences/Bibl.tsx) |
| `biblScope` | Bibliographic scope (volume, pages, etc.) | Body, Bibref | NoOp |
| `biblStruct` | Structured bibliographic reference | Bibref | [BiblStruct.tsx](../packages/react-tei/src/SidePanel/bibliographicReferences/BiblStruct.tsx) |
| `body` | Document body container | Body | NoOp |
| `date` | Date element | Body, Footnotes, Bibref | [DateTag.tsx](../packages/react-tei/src/tags/DateTag.tsx) |
| `div` | Division/section | Body | [Div.tsx](../packages/react-tei/src/tags/Div.tsx) |
| `email` | Email address | Authors | Nothing |
| `emph` | Emphasized text | Body, Footnotes, Bibref | [Emph.tsx](../packages/react-tei/src/tags/Emph.tsx) |
| `figure` | Figure with graphics or tables | Body | [Figure.tsx](../packages/react-tei/src/tags/Figure.tsx) |
| `floatingText` | Floating text element | Body | [FloatingText.tsx](../packages/react-tei/src/tags/floatingText/FloatingText.tsx) |
| `forename` | First name | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/SidePanel/authors/PersNamePart.tsx) |
| `formula` | Mathematical formula with notation or rendering | Body, Footnotes, Bibref | [Formula.tsx](../packages/react-tei/src/tags/Formula.tsx) |
| `genName` | Generational name (Jr., Sr., etc.) | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/SidePanel/authors/PersNamePart.tsx) |
| `graphic` | Graphic element (used in formulas) | Body, Footnotes, Bibref | [Graphic.tsx](../packages/react-tei/src/tags/Graphic.tsx) |
| `head` | Heading element | Body | [Head.tsx](../packages/react-tei/src/tags/Head.tsx) |
| `hi` | Highlighted text (various renditions) | Body, Footnotes, Bibref | [Hi.tsx](../packages/react-tei/src/tags/Hi.tsx) |
| `highlight` | Enrichment highlight | Body | [Highlight.tsx](../packages/react-tei/src/tags/Highlight.tsx) |
| `highlightedText` | Text highlighted by enrichment | Body | NoOp |
| `idno` | Identifier number | Source | [SourceIdno.tsx](../packages/react-tei/src/SidePanel/source/SourceIdno.tsx) |
| `l` | Line (in verse) | Footnotes | [L.tsx](../packages/react-tei/src/tags/L.tsx) |
| `lg` | Line group (verse stanza) | Footnotes | [Lg.tsx](../packages/react-tei/src/tags/Lg.tsx) |
| `list` | List element (ordered/unordered) | Body | [List.tsx](../packages/react-tei/src/tags/list/List.tsx) |
| `math` | MathML root element | Body, Footnotes, Bibref | [MathMLTag.tsx](../packages/react-tei/src/tags/formula/mathml/MathMLTag.tsx) |
| MathML tags | All MathML tags (203 total) | Body, Footnotes, Bibref | [MathMLTag.tsx](../packages/react-tei/src/tags/formula/mathml/MathMLTag.tsx) |
| `name` | Generic name element | Authors, Bibref | [Name.tsx](../packages/react-tei/src/SidePanel/authors/Name.tsx) |
| `nameLink` | Name linking particle (de, von, etc.) | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/SidePanel/authors/PersNamePart.tsx) |
| `note` | Note/footnote element | Footnotes, Bibref | [Note.tsx](../packages/react-tei/src/SidePanel/footNotes/Note.tsx) |
| `orgName` | Organization name | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/SidePanel/authors/PersNamePart.tsx) |
| `p` | Paragraph | Body, Footnotes | [P.tsx](../packages/react-tei/src/tags/P.tsx) |
| `persName` | Personal name | Authors, Bibref | [PersName.tsx](../packages/react-tei/src/SidePanel/authors/PersName.tsx) |
| `pubPlace` | Publication place | Bibref | NoOp |
| `publisher` | Publisher | Bibref | NoOp |
| `quote` | Quoted text block | Body, Footnotes, Bibref | [Quote.tsx](../packages/react-tei/src/tags/Quote.tsx) |
| `ref` | Reference (footnote, bibliographic, URL, table) | Body, Footnotes, Bibref | [Ref.tsx](../packages/react-tei/src/tags/Ref.tsx) |
| `roleName` | Role name | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/SidePanel/authors/PersNamePart.tsx) |
| `s` | Sentence | Body | NoOp |
| `sc` | Small capitals | Body | NoOp |
| `series` | Series information | Bibref | NoOp |
| `surname` | Last name | Authors, Bibref | [PersNamePart.tsx](../packages/react-tei/src/SidePanel/authors/PersNamePart.tsx) |
| `table` | Table element | Body | [Table.tsx](../packages/react-tei/src/tags/Table.tsx) |
| `title` | Title element | Body, Bibref | [Title.tsx](../packages/react-tei/src/tags/Title.tsx) |

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
