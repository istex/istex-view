# Repository Architecture

This document describes the monorepo structure, package organization, and development tools used in the Istex TEI Viewer project. The primary goal is to **make the TEI viewer reusable in other applications** while maintaining a demo application and comprehensive test suite.

## Why a Monorepo?

A monorepo approach allows us to:

- Keep the core viewer library and demo application in sync
- Share TypeScript configurations and development tools
- Test changes across all packages simultaneously
- Simplify the release process for the reusable library

## Package Structure

### 📦 [@istex/react-tei](../packages/react-tei/)

**The core library** - Reusable TEI viewer React component:

- **Purpose**: Provide a React component to visualize and enrich TEI (Text Encoding Initiative) documents
- **Package type**: React library (ES module)
- **Exports**: The package exposes all source files via `./*` exports for maximum flexibility.

### 🎨 [@istex/viewer-demo](../packages/demo/)

The **Demonstration application** showcasing the TEI viewer capabilities:

- **Purpose**:
  - Demonstrate viewer features and usage patterns
  - Serve as an integration reference for developers
  - Provide a testing environment for the core library
- **Package type**: React application built with Vite

See [Demo Architecture](./demo-architecture.md) for detailed information.

### 🧪 [@istex/e2e](../packages/e2e/)

The **End-to-end test suite** ensuring viewer functionality in real scenarios:

- **Purpose**: Validate that the viewer works correctly with various TEI documents and enrichments
- **Package type**: Playwright test suite

See [Testing Guide](./testing.md) for how to run and write tests.

## Configuration Files

All packages share base configurations:

- [tsconfig.base.json](../tsconfig.base.json): Base TypeScript config
- [biome.json](../biome.json): Linting and formatting rules
- [vitest.config.ts](../vitest.config.ts): Test configuration

Each package extends these with its own `tsconfig.json` and build configuration.

## Workspace Configuration

See [pnpm-workspace.yaml](../pnpm-workspace.yaml) for workspace definition. Inter-package dependencies use the `workspace:^` protocol.

## Dependency Management

The project uses pnpm's [catalog feature](https://pnpm.io/catalogs) to manage shared dependency versions across packages, ensuring version consistency for React, TypeScript, Material-UI, and other shared dependencies.

## Development Workflow

### Working Across Packages

The `workspace:^` protocol creates symlinks between packages during development:

- Changes in `react-tei` are immediately available in `demo`
- No need to rebuild or reinstall after changes
- Hot Module Replacement works across package boundaries

### Turbo Cache

Turbo caches build outputs for faster subsequent builds:

- Cache is stored in `node_modules/.cache/turbo/`
- Clear cache if builds seem stale: `pnpm turbo run build --force`
- CI builds start with empty cache

### Common Development Tasks

**Adding a new npm dependency**:

```sh
cd packages/react-tei
pnpm add library-name
```

**Adding a dev dependency (all packages)**:

```sh
# Update catalog in root package.json
pnpm add -D -w dev-tool-name
```

**Removing a dependency**:

```sh
cd packages/react-tei
pnpm remove library-name
```

**Checking bundle size**:

```sh
cd packages/demo
pnpm build
# Check dist/ folder size
```

## Monorepo Tips for Maintainers

### Import Path Guidelines

**Within same package**: Use relative imports

```tsx
import { helper } from './utils/helper';
```

**Cross-package**: Use package name

```tsx
import { Viewer } from '@istex/react-tei/Viewer';
```

**Never**: Import internal files from other packages

```tsx
// ❌ Wrong
import { internal } from '@istex/react-tei/src/internal';

// ✅ Correct
import { internal } from '@istex/react-tei/internal';
```

### Managing Breaking Changes

If changing `react-tei` public API:

1. Update `demo` app to use new API
2. Update E2E tests if affected
3. Document breaking change
4. Consider deprecation period
5. Bump major version
