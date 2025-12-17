default: help

help:									## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install:								## Install dependencies
	@pnpm install
	@pnpm playwright install chromium chromium-headless-shell

build:									## Build the project
	@pnpm turbo run build --no-cache

build-watch:							## Build the project in watch mode
	@pnpm turbo watch build

dev:									## Start containers
	@pnpm turbo watch dev --filter="@istex/viewer-demo" --ui="stream"

test: 									## Run Unit tests
	@pnpm turbo run test

test-watch: 							## Run Unit tests in watch mode
	@pnpm turbo watch test:watch

test-browser: 							## Run Unit tests in browser mode
	@pnpm turbo run test:browser

test-browser-react-tei: 				## Run demo React TEI in browser mode
	@pnpm turbo run test:browser --filter="@istex/react-tei"

test-browser-demo: 						## Run demo tests in browser mode
	@pnpm turbo run test:browser --filter="@istex/viewer-demo"

e2e:
	@pnpm turbo run e2e --no-cache

e2e-ui:
	@pnpm turbo run --ui=stream e2e:ui

typecheck:								## Run type checks
	@pnpm turbo run typecheck --no-cache

lint-check:								## Run lint checks
	@pnpm turbo run lint:check --no-cache

lint-apply:								## Apply lint fixes
	@pnpm turbo run lint:apply --no-cache
