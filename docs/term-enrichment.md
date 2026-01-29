# Term Enrichment

**Type**: Explanation documentation

This document explains how the TEI viewer processes and displays term enrichments. Term enrichments are linguistic annotations that highlight specific terms, entities, or concepts within the document text.

## What is Term Enrichment?

Term enrichment adds semantic annotations to text documents. These annotations identify and categorize important terms like:

- **Named entities** (people, organizations, places)
- **Technical terms** (domain-specific vocabulary)
- **Bibliographic references**
- **Keywords** and concepts
- **Linguistic features**

The viewer receives enrichments as separate XML files that reference positions in the TEI document. It then highlights these terms in the text and provides statistics and filtering in the side panel.

## Supported Enrichment Types

### 1. Unitex Enrichment

**Purpose**: Linguistic analysis and named entity recognition

**Format**: XML with `<ns1:standOff>` structure containing `<listAnnotation>` elements

**Categories**:

- `persName` - Person names
- `placeName` - Place names
- `orgName` - Organization names (with subtypes: funder, provider)
- `title` - Titles
- `date` - Dates
- `ref` - References (with subtypes: bibl, url)

**Implementation**: [parseUnitexEnrichment.ts](../packages/react-tei/src/termEnrichment/parseUnitexEnrichment.ts)

### 2. Multicat Enrichment

**Purpose**: Multi-category text classification with hierarchical categories

**Format**: XML with category hierarchy and term frequencies

**Features**:

- Hierarchical category structure (categories and subcategories)
- Term frequency scores
- Multiple categories per document

**Implementation**: [useParseMulticatCategories.tsx](../packages/react-tei/src/SidePanel/multicat/useParseMulticatCategories.tsx)

### 3. NB (Named Entity) Enrichment

**Purpose**: Named entity recognition similar to Multicat

**Format**: Uses the same parser as Multicat enrichment

**Categories**: Similar entity types as Unitex but processed differently

**Implementation**: Shares implementation with Multicat

### 4. TEEFT Enrichment

**Purpose**: Terminology extraction from specialized texts

**Format**: XML with extracted terms and their positions

**Features**:

- Domain-specific terminology
- Technical vocabulary extraction
- Case-sensitive term matching

**Implementation**: [useTeeftEnrichmentParser.tsx](../packages/react-tei/src/teeft/useTeeftEnrichmentParser.tsx)

## Design Rationale

### Why Regex-Based Matching?

Term matching uses regex rather than exact string matching:

- **Performance**: Compiled regexes are fast for repeated matching
- **Word boundaries**: Ensures terms match whole words, not substrings
- **Case handling**: Easy to toggle case sensitivity per enrichment type
- **Flexibility**: Can handle special characters and punctuation

### Why Hierarchical Nested Terms?

When terms overlap (e.g., "New York" and "New York University"), we create nested structures:

- **Completeness**: All enrichments remain visible
- **User clarity**: Shows relationship between terms
- **No conflicts**: Prevents highlight collisions
- **Clickability**: Each term independently interactive

## Enrichment Processing Pipeline

### Step 1: Parsing

```txt
Enrichment XML String
    ↓
Parser (useUnitexEnrichmentParser, etc.)
    ↓
Structured Data (TermStatistic[])
```

Each enrichment type has a dedicated parser that:

1. Parses the XML using fast-xml-parser
2. Extracts terms and their metadata
3. Organizes terms by category/type
4. Initializes display state (all terms shown by default)

### Step 2: Term Matching

```txt
Parsed Enrichments + Document Body
    ↓
enrichDocumentWithTerms()
    ↓
Enriched Document + Statistics
```

The `enrichDocumentWithTerms` function ([enrichDocumentWithTerm.ts](../packages/react-tei/src/termEnrichment/enrichDocumentWithTerm.ts)):

1. **Computes nested terms**: Identifies overlapping terms and creates a hierarchy
2. **Creates regex patterns**: Generates regular expressions for each term
3. **Traverses document**: Walks through all text nodes in the document
4. **Matches terms**: Finds term occurrences using regex matching
5. **Injects highlights**: Replaces matched text with `<highlight>` tags
6. **Tracks statistics**: Counts term occurrences by group and value

### Step 3: Rendering

```txt
Enriched Document
    ↓
Component Rendering (recursive)
    ↓
HTML with Highlighted Terms
```

The `Highlight` component ([tags/Highlight.tsx](../packages/react-tei/src/tags/Highlight.tsx)):

- Renders `<highlight>` tags as styled `<span>` elements
- Applies CSS classes based on enrichment groups
- Adds click handlers for navigation
- Shows/hides based on user filter settings

### Step 4: Statistics

The viewer counts term occurrences by group and by value. These statistics are displayed in the side panel, allowing users to see:

- Which enrichment types are present
- How many terms in each category
- Which specific terms appear most frequently

## User Interactions

### Toggling Terms

Click category headers to show/hide all terms in that category, or click individual terms to toggle them independently.

### Navigate to Term

Click a highlighted term in the document to:

1. Open the side panel
2. Switch to the enrichments tab
3. Scroll to that term in the list

## Implementation Details

### Text Node Processing

The enrichment system operates on `#text` nodes within the document JSON structure.

### Nested Terms

When terms overlap, the system creates a hierarchy to ensure all enrichments are visible without conflicts.

### Case Sensitivity

Controlled by the `termToRegex` function ([helper/termToRegex.ts](../packages/react-tei/src/helper/termToRegex.ts)). Unitex, Multicat, and NB use case-insensitive matching, while TEEFT requires exact case.

### Performance Optimization

Enrichment processing uses memoization to avoid re-computation. Enrichment files are only parsed when provided, and regex compilation happens once during the memoized computation.

## Side Panel Display

The enrichments tab shows category headers with counts, expandable sections per category, individual terms with occurrence counts, and toggle controls for visibility.

## Adding New Enrichment Types

To support a new enrichment format, create a parser hook (similar to `useUnitexEnrichmentParser`), add it to Viewer props, include it in `allEnrichments`, and create a side panel display component.

## Troubleshooting Enrichments

### Terms Not Highlighting

**Possible causes**:

1. **XML format mismatch**: Enrichment XML doesn't match expected schema
   - Solution: Compare with working examples in [testdata/](../packages/e2e/testdata/)
2. **Text mismatch**: Term text doesn't exist in document
   - Solution: Check exact text content including whitespace
3. **Case sensitivity**: TEEFT enrichments are case-sensitive
   - Solution: Verify term case matches document
4. **Parser error**: Enrichment failed to parse
   - Solution: Check browser console for parsing errors

### Missing Term Statistics

**Possible causes**:

1. **No matches found**: Terms exist in enrichment but not document
   - Solution: Verify document and enrichment match
2. **Regex compilation failed**: Invalid characters in term text
   - Solution: Check `termToRegex` function for escaping
3. **Context not updating**: State management issue
   - Solution: Verify DocumentContext reducer handles enrichment actions

### Performance Issues with Many Terms

**Solutions**:

- Limit enrichment file size (< 1000 terms recommended)
- Use more specific terms (fewer false matches)
- Consider lazy loading enrichments
- Profile with React DevTools to identify bottlenecks

### Nested Terms Displaying Incorrectly

**Debug steps**:

1. Log output of `computeNestedTerms` function
2. Verify term hierarchy structure
3. Check CSS for highlight overlays
4. Inspect DOM for nested highlight elements

## Testing Enrichments

Test files are located in [packages/e2e/testdata/](../packages/e2e/testdata/):

- `unitex-enrichment.tei` - Sample Unitex enrichment
- `multicat-enrichment.tei` - Sample Multicat enrichment
- `nb-enrichment.tei` - Sample NB enrichment
- `unitex-document.tei` - Document with Unitex enrichments

E2E tests verify:

- Terms are highlighted correctly
- Statistics are accurate
- Toggle functionality works
- Navigation functions properly

See [Testing Guide](./testing.md) for running enrichment tests.
