# Istex TEI Viewer

A reusable React component for displaying and enriching TEI (Text Encoding Initiative) XML documents.

## Quick Start

**Prerequisites:** Node.js 18+ and pnpm

```sh
# Install dependencies
make install

# Start the demo application
make dev
```

Visit <http://localhost:3000/> to see the viewer in action.

## Features

- **TEI Document Rendering**: Display TEI XML documents with semantic structure
- **Term Enrichment**: Support for Unitex, Multicat, NB, and TEEFT enrichments
- **Interactive Navigation**: Table of contents, footnotes, and bibliographic references
- **Customizable**: Built with Material-UI for easy theming
- **Internationalization**: English and French language support
- **Responsive**: Works on desktop and mobile devices

## Project Structure

This monorepo contains three packages:

- **`@istex/react-tei`**: Core React component library (reusable in your projects)
- **`@istex/viewer-demo`**: Demo application showcasing the viewer
- **`@istex/e2e`**: End-to-end test suite with Playwright

## Using the Viewer

### Installation

```sh
pnpm add @istex/react-tei
```

### Basic Usage

```tsx
import { Viewer } from '@istex/react-tei/Viewer';

function App() {
  return (
    <Viewer
      teiDocument={teiXmlString}
      enrichments={[unitexEnrichment, multicatEnrichment]}
    />
  );
}
```

See [Viewer Architecture](./docs/viewer-architecture.md) for detailed API documentation.

## Development

### Running Tests

**Unit tests:**

```sh
make test              # Headless mode
make test-watch        # Watch mode (headless)
make test-browser      # Interactive browser mode
```

**End-to-end tests:**

```sh
make e2e               # Production build
make e2e-ui            # Development mode with hot reload
```

### Project Commands

```sh
make install           # Install all dependencies
make dev              # Start demo app (port 3000)
make build            # Build all packages
make lint             # Run Biome linter
make format           # Format code with Biome
make typecheck        # Type check with TypeScript
```

## Documentation

### How-To Guides

- [Testing Guide](./docs/testing.md) - Running and writing tests

### Reference

- [Repository Architecture](./docs/repository-architecture.md) - Monorepo structure and tools
- [Viewer Architecture](./docs/viewer-architecture.md) - Component API and internals
- [Demo Architecture](./docs/demo-architecture.md) - Demo application structure

### Explanation

- [Term Enrichment](./docs/term-enrichment.md) - How term enrichment works

## Contributing

This project uses:

- **pnpm workspaces** for monorepo management
- **Turbo** for build orchestration
- **Biome** for linting and formatting
- **TypeScript** for type safety
- **Vitest** for unit testing
- **Playwright** for E2E testing

## License

This project is licensed under the CeCILL License - see the [licence.md](./licence.md) file for details.
