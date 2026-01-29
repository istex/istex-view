# Supported TEI Tags

This document lists all TEI tags currently supported by the `@istex/react-tei` viewer, organized by category.

## Text Content

Tags for basic text content and paragraphs.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<p>` | [P.tsx](../packages/react-tei/src/tags/P.tsx) | Paragraph - main text container |
| `<s>` | NoOp | Sentence (renders content without wrapper) |
| `#text` | NoOp | Text nodes (handled internally) |

## Structure & Organization

Tags for organizing document structure.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<div>` | [Div.tsx](../packages/react-tei/src/tags/Div.tsx) | Division - major structural unit |
| `<body>` | NoOp | Document body (renders content without wrapper) |
| `<head>` | [Head.tsx](../packages/react-tei/src/tags/Head.tsx) | Section heading |
| `<floatingText>` | [FloatingText.tsx](../packages/react-tei/src/tags/floatingText/FloatingText.tsx) | Separate text block (e.g., inset, sidebar) |

## Typography & Emphasis

Tags for text styling and emphasis.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<hi>` | [Hi.tsx](../packages/react-tei/src/tags/Hi.tsx) | Highlighted text (supports multiple rendition styles) |
| `<emph>` | [Emph.tsx](../packages/react-tei/src/tags/Emph.tsx) | Emphasized text (italic by default) |
| `<sc>` | NoOp | Small capitals (renders content) |

## Quotations & References

Tags for quotes and citations.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<quote>` | [Quote.tsx](../packages/react-tei/src/tags/Quote.tsx) | Block quotation |
| `<ref>` | [Ref.tsx](../packages/react-tei/src/tags/Ref.tsx) | Reference (footnotes, bibliographic refs, URIs) |
| `<bibl>` | NoOp | Bibliographic citation (renders content) |
| `<biblScope>` | NoOp | Scope of bibliographic reference (renders content) |

## Lists

Tags for ordered and unordered lists.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<list>` | [List.tsx](../packages/react-tei/src/tags/list/List.tsx) | List container (auto-detects labelled/unlabelled) |

**Note**: List rendering automatically detects whether the list is labelled (definition list) or unlabelled (bulleted/numbered) based on content structure.

## Poetry & Verse

Tags for poetry and verse structures.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<lg>` | [Lg.tsx](../packages/react-tei/src/tags/Lg.tsx) | Line group (stanza, verse paragraph) |
| `<l>` | [L.tsx](../packages/react-tei/src/tags/L.tsx) | Line of verse |

## Tables

Tags for tabular data.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<table>` | [Table.tsx](../packages/react-tei/src/tags/Table.tsx) | Table with optional caption and notes |

**Sub-components** (used internally by Table):

- [TableRow.tsx](../packages/react-tei/src/tags/TableRow.tsx) - Table row
- [TableCaption.tsx](../packages/react-tei/src/tags/TableCaption.tsx) - Table caption
- [TableNote.tsx](../packages/react-tei/src/tags/TableNote.tsx) - Individual table note
- [TableNotes.tsx](../packages/react-tei/src/tags/TableNotes.tsx) - Table notes container

## Figures & Graphics

Tags for images and figures.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<figure>` | [Figure.tsx](../packages/react-tei/src/tags/Figure.tsx) | Figure container (images, tables, diagrams) |
| `<graphic>` | [Graphic.tsx](../packages/react-tei/src/tags/Graphic.tsx) | Graphic element placeholder |

## Mathematical Formulas

Tags for mathematical and chemical notation.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<formula>` | [Formula.tsx](../packages/react-tei/src/tags/Formula.tsx) | Mathematical or chemical formula |

**Supported notations**:

- MathML (full support for all MathML tags)
- TeX notation (via temml renderer)

**MathML tags**: The viewer supports all standard MathML 3.0 tags including:

- Layout elements: `<mrow>`, `<mfrac>`, `<msup>`, `<msub>`, `<msubsup>`, `<mover>`, `<munder>`, `<munderover>`, `<mtable>`, `<mtr>`, `<mtd>`, etc.
- Token elements: `<mi>`, `<mn>`, `<mo>`, `<mtext>`, `<mspace>`, `<ms>`
- General layout: `<mpadded>`, `<mphantom>`, `<menclose>`, `<mfenced>`, `<msqrt>`, `<mroot>`
- Actions: `<maction>`
- Semantic elements: `<semantics>`, `<annotation>`, `<annotation-xml>`
- Content MathML: `<apply>`, `<cn>`, `<ci>`, `<csymbol>`, functions and operators

See [mathMLTagNames.ts](../packages/react-tei/src/tags/formula/mathml/mathMLTagNames.ts) for the complete list.

## Metadata & Names

Tags for metadata and named entities.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<title>` | [Title.tsx](../packages/react-tei/src/tags/Title.tsx) | Title of work |
| `<date>` | [DateTag.tsx](../packages/react-tei/src/tags/DateTag.tsx) | Date |

## Enrichments

Special tags for term enrichment display.

| Tag | Component | Description |
| --- | --------- | ----------- |
| `<highlight>` | [Highlight.tsx](../packages/react-tei/src/tags/Highlight.tsx) | Highlighted enrichment term (generated internally) |
| `<highlightedText>` | NoOp | Legacy enrichment wrapper (renders content) |

**Note**: Enrichment highlights are injected dynamically during document processing. See [Term Enrichment](./term-enrichment.md) for details.

## Special Rendering

Tags with special rendering behavior.

| Tag | Component | Description |
| --- | --------- | ----------- |
| NoOp | [NoOp.tsx](../packages/react-tei/src/tags/NoOp.tsx) | Passes through children without wrapper |
| Nothing | [Nothing.tsx](../packages/react-tei/src/tags/Nothing.tsx) | Renders nothing (completely hidden) |

## Unsupported Tags

Tags not in the catalog are rendered using a fallback that:

1. Displays tag name in debug mode
2. Recursively renders child content
3. Logs warning to console

To add support for a new tag, see the [Extension Points](./viewer-architecture.md#extension-points) section.

## Tag Attributes

Most tags support TEI standard attributes:

- `@xml:id` - Unique identifier for navigation
- `@n` - Number or label
- `@type` - Subtype classification
- `@rend` - Rendition style (for `<hi>`)
- `@target` - Reference target (for `<ref>`)
- `@corresp` - Correspondence link

Specific attribute handling varies by tag. Check individual component files for details.

## Adding Custom Tags

To add support for a new TEI tag:

1. Create component in [tags/](../packages/react-tei/src/tags/)
2. Add to [tagCatalog.ts](../packages/react-tei/src/tags/tagCatalog.ts)
3. Write tests
4. Update this documentation

See [Viewer Architecture](./viewer-architecture.md#adding-a-new-tei-tag) for detailed instructions.
