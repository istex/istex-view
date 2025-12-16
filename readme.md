# Istex TEI Viewer

This repository contains a TEI viewer designed for Istex Search.

## Architecture

This project is setup as a monorepo that contains the following projects:
- `demo`: A demo of the TEI viewer
- `react-tei`: The library that contains the TEI viewer

## Installation

To install the project dependencies, tun the following command:

```sh
make install
```

## Development

The viewer demo can be started using the following command:

```sh
make dev
```

You can then go to http://localhost:3000/ to access to the demo app locally.

## Test

### Unit Test

Unit tests can be run using the following commands:

- `make test` to run tests in headless mode
- `make test-watch` to run tests in headless mode with watch enabled
- `make test-browser` to run tests in UI mode with watch mode enabled

### E2E

E2E tests can be run using the following commands:

- `make e2e` to run tests in headless mode using production environment
- `make e2e-ui` to run tests in UI mode using development environment for hot reload
