# Viewer Architecture

This document describes the internal architecture of the **@istex/react-tei** viewer component, including its API, component structure, data flow, and extensibility points.

## Architectural Decisions

### Why Multiple Context Providers?

The architecture uses multiple specialized contexts rather than a single global state for several reasons:

- **Separation of concerns**: Each context manages a distinct aspect (document data, navigation, UI state)
- **Performance**: Components only re-render when their specific context changes
- **Testability**: Contexts can be tested and mocked independently
- **Extensibility**: New features can add contexts without modifying existing ones

### Why JSON Intermediate Representation?

TEI XML is first parsed into a JSON structure before rendering:

- **Performance**: JSON traversal is faster than DOM queries
- **Transformation**: Easier to manipulate and enrich (e.g., adding highlights)
- **Testability**: Simpler to create test fixtures
- **Memoization**: React can efficiently compare JSON structures

## Core Component API

### Viewer Component

**Import**: `import { Viewer } from '@istex/react-tei/Viewer'`

The Viewer component accepts a TEI XML document string and optional enrichment XML strings (Unitex, Multicat, NB, TEEFT). See the component source for prop details.

## Component Architecture

### Component Hierarchy

The Viewer component wraps multiple context providers (I18n, DocumentSidePanel, Document, TagCatalog, and DocumentNavigation) which provide data to core components like TableOfContent, DocumentTitle, DocumentBody, and DocumentSidePanel.

### Core Components

See the [src/](../packages/react-tei/src/) directory for component implementations.

### Context Providers

The viewer uses React Context for state management and dependency injection:

#### DocumentContext

- **Purpose**: Provides parsed document data and enrichments to all components
- **File**: [DocumentContextProvider.tsx](../packages/react-tei/src/DocumentContextProvider.tsx)

#### DocumentNavigationContext

- **Purpose**: Manages navigation state and interactions
- **File**: [navigation/DocumentNavigationContext.tsx](../packages/react-tei/src/navigation/DocumentNavigationContext.tsx)

#### DocumentSidePanelContext

- **Purpose**: Controls side panel visibility and content
- **File**: [SidePanel/DocumentSidePanelContext.tsx](../packages/react-tei/src/SidePanel/DocumentSidePanelContext.tsx)

#### TagCatalogProvider

- **Purpose**: Registry of TEI tag renderers mapping tag names to React components.
- **File**: [tags/TagCatalogProvider.tsx](../packages/react-tei/src/tags/TagCatalogProvider.tsx)

## TEI Tag Catalog

The viewer implements renderers for common TEI tags. Each tag is mapped to a React component in the tag catalog.

### Supported TEI Tags

See [tags/tagCatalog.ts](../packages/react-tei/src/tags/tagCatalog.ts) for the complete list of supported TEI tags and their corresponding React components.

### Adding Custom Tags

Extend the viewer with custom TEI tags by providing a custom tag catalog to the TagCatalogProvider. See [tags/TagCatalogProvider.tsx](../packages/react-tei/src/tags/TagCatalogProvider.tsx) for details.

## Internationalization

The viewer supports multiple languages using i18next.

The viewer supports English and French. Translation files are in [i18n/locales/](../packages/react-tei/src/i18n/locales/).

## Styling and Theming

The viewer uses Material-UI's theming system and Emotion for styling. Wrap the Viewer in a Material-UI ThemeProvider to apply custom themes.

## Term Enrichment System

See [Term Enrichment](./term-enrichment.md) for detailed information on how term enrichments are processed and displayed.

## Performance Considerations

The viewer uses React's memoization extensively to avoid unnecessary re-parsing and re-rendering.

### Performance Bottlenecks to Watch

- **Large documents (>5000 elements)**: Consider implementing virtual scrolling
- **Complex enrichments (>1000 terms)**: Regex matching can be slow; cache compiled regexes
- **Deep nesting**: Recursive rendering can cause stack issues; limit TEI nesting depth
- **Frequent re-renders**: Check that contexts aren't changing unnecessarily

## Debugging Guide

### Common Issues and Solutions

**Problem**: Terms not highlighting correctly

- Check enrichment XML format matches expected schema
- Verify term text matches document text (case sensitivity)
- Inspect `enrichDocumentWithTerms` output in browser DevTools
- Check if regex patterns are generated correctly

**Problem**: Navigation not working

- Ensure elements have proper `id` attributes
- Check DocumentNavigationContext is providing refs correctly
- Verify scroll behavior isn't blocked by CSS overflow settings

**Problem**: Context not updating

- Check if context value is properly memoized
- Verify dispatch actions are being called
- Use React DevTools to inspect context values

**Problem**: Performance degradation

- Profile with React DevTools Profiler
- Check for missing memoization in expensive computations
- Verify useEffect dependencies are correct

### Debugging Tools

- **React DevTools**: Inspect component tree, props, and context
- **React DevTools Profiler**: Identify performance bottlenecks
- **Browser DevTools**: Debug document JSON structure
- **Vitest UI**: Interactive test debugging in browser mode

## Testing

See [Testing Guide](./testing.md) for details on the test suite.

## Extension Points

The viewer can be extended by providing custom tag renderers through the TagCatalog, adding new enrichment parsers, and implementing custom navigation behavior through the DocumentNavigationContext.

### Adding a New TEI Tag

1. Create component in [tags/](../packages/react-tei/src/tags/) (e.g., `MyTag.tsx`)
2. Add tests in `MyTag.spec.tsx`
3. Register in [tagCatalog.ts](../packages/react-tei/src/tags/tagCatalog.ts)
4. Update TypeScript types if needed
5. Add E2E test with sample TEI document

**Key considerations**:

- Handle nested content recursively
- Support all relevant TEI attributes
- Apply consistent styling with theme
- Add accessibility attributes (ARIA labels, roles)

### Adding a New Enrichment Type

1. Create parser hook in `src/myEnrichment/` (e.g., `useMyEnrichmentParser.tsx`)
2. Add prop to Viewer component
3. Integrate parser output into DocumentContext
4. Create side panel display component
5. Add test data and E2E tests

**Key considerations**:

- Follow existing parser patterns (memoization, null handling)
- Ensure term matching respects case sensitivity requirements
- Add statistics tracking for the side panel
- Consider nested term conflicts

### Modifying the Document Parser

- **Location**: [parser/useDocumentParser.tsx](../packages/react-tei/src/parser/useDocumentParser.tsx)
- **Warning**: Changes here affect all document rendering. Test thoroughly.
- **Common modifications**:
  - Supporting new TEI elements
  - Adjusting XML parsing options
  - Transforming document structure
  - Extracting metadata
- **Testing checklist**:
  - Run full unit test suite
  - Test with various TEI documents
  - Verify enrichments still work
  - Check performance with large documents

## Common Maintenance Tasks

### Updating Dependencies

1. Update catalog in root [package.json](../package.json)
2. Run `pnpm update` to update all packages
3. Test thoroughly (unit + E2E)
4. Check for breaking changes in changelogs
5. Update code if APIs changed

**Critical dependencies to watch**:

- **React**: Major versions may require migration
- **Material-UI**: Theme structure changes
- **fast-xml-parser**: Parser API changes
- **i18next**: Translation format changes

### Adding Translation Keys

1. Add key to [en/translation.json](../packages/react-tei/src/i18n/locales/en/translation.json)
2. Add same key to [fr/translation.json](../packages/react-tei/src/i18n/locales/fr/translation.json)
3. Use in component with `useTranslation` hook
4. TypeScript will verify key exists

### Modifying Styles

Styles are managed through Material-UI's `sx` prop and theme.

**Global styles**: Modify theme in Demo's [theme.tsx](../packages/demo/src/theme.tsx)
**Component styles**: Use `sx` prop for component-specific styles
**CSS classes**: Used sparingly (e.g., enrichment highlights)

**Style guidelines**:

- Use theme tokens (spacing, colors, breakpoints)
- Avoid hardcoded values
- Ensure responsive design
- Test in dark mode if applicable

### Release Process

1. Update version in [package.json](../packages/react-tei/package.json)
2. Update CHANGELOG with changes
3. Run full test suite
4. Build all packages: `pnpm build`
5. Commit and tag release
6. Publish to npm (if applicable)
7. Deploy demo app

## Dependencies

See [package.json](../packages/react-tei/package.json) for the complete list of dependencies.
