# Demo Architecture

**Type**: Reference documentation

This document describes the architecture of **@istex/viewer-demo**, a React application that demonstrates the capabilities of the `@istex/react-tei` viewer component. The demo provides two ways to visualize TEI documents: file upload and ARK identifier lookup.

## Purpose

The demo application serves multiple purposes:

- **Showcase** viewer features and capabilities
- **Reference implementation** for integrating the viewer
- **Testing environment** for development and debugging
- **User documentation** through working examples

## Viewer Modules

### File Viewer Module

**Location**: [modules/file-viewer/](../packages/demo/src/modules/file-viewer/)

**Purpose**: Allows users to upload and view TEI documents from their local system

**Features**:

- Upload TEI XML documents via file picker
- Upload enrichment files (Unitex, Multicat, NB, TEEFT)
- Persist uploaded files in component state
- Display documents using the `@istex/react-tei` Viewer

**User flow**:

1. User selects TEI document file
2. Optionally selects enrichment files
3. Files are read and stored in ViewerContext
4. Navigate to viewer page
5. Viewer component renders the document

### ARK Viewer Module

**Location**: [modules/ark-viewer/](../packages/demo/src/modules/ark-viewer/)

**Purpose**: Load and display documents by their ARK (Archival Resource Key) identifier

**Features**:

- Fetch documents from remote sources using ARK IDs
- Loading states during document retrieval
- Error handling for missing or invalid documents
- Sample TEI and enrichment XML files for testing

**User flow**:

1. User enters ARK identifier or follows link
2. Router loader initiates document fetch
3. Loading indicator displayed
4. Document rendered or error shown

## Internationalization

**Location**: [i18n/](../packages/demo/src/i18n/)

Provides language detection based on browser settings, with translation resources for English and French.

## Build Configuration

**File**: [vite.config.ts](../packages/demo/vite.config.ts)

Configured for GitHub Pages deployment at `/istex-view/` with development server on port 3000.

## Routing Structure

**Router type**: Hash-based (`createHashRouter`) for compatibility with static hosting (GitHub Pages).

## Design Patterns

The demo uses context-based state management, route-based code splitting with React Router loaders, and component composition. The clean separation between file-based and ARK-based viewing modes demonstrates flexible integration patterns for the `@istex/react-tei` viewer component.
