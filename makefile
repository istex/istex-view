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
	@pnpm turbo run dev

test: 									## Run Unit tests
	@pnpm turbo run test

test-watch: 							## Run Unit tests in watch mode
	@pnpm turbo watch test:watch

typecheck:								## Run type checks
	@pnpm turbo run typecheck

lint-check:								## Run lint checks
	@pnpm turbo run lint:check --no-cache

lint-apply:								## Apply lint fixes
	@pnpm turbo run lint:apply --no-cache
