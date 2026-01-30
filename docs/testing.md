# Testing Guide

This guide explains how to run tests, write new tests, and understand the testing infrastructure for the Istex TEI Viewer project.

## Testing Strategy

The project uses a two-tier testing approach:

1. **Unit Tests** - Fast, isolated tests for components and functions
2. **End-to-End (E2E) Tests** - Full integration tests simulating real user scenarios

## Unit Tests

### Configuration

**File**: [vitest.config.ts](../vitest.config.ts)

Configured to test all packages except E2E using real browser environment with Playwright.

### Test File Structure

Unit tests are co-located with source files using the `.spec.tsx` or `.spec.ts` extension.

### Writing Unit Tests

Tests use `vitest-browser-react` for component rendering and [Vitest Browser mode](https://vitest.dev/guide/browser/) for user-centric tests. See test files for examples.

### Running Unit Tests

See makefile for available test commands.

### Test Coverage

Generate coverage reports with `pnpm test --coverage`.

## End-to-End Tests

### E2E Configuration

**File**: [packages/e2e/playwright.config.ts](../packages/e2e/playwright.config.ts)

Configured to automatically start the demo server and test against production or development builds.

### E2E Test File Structure

E2E tests are in [packages/e2e/src/](../packages/e2e/src/) with test data in the [testdata/](../packages/e2e/testdata/) directory.

### Writing E2E Tests

Tests use Playwright with standard patterns for user interaction, navigation testing, and visual regression. See test files in [packages/e2e/src/](../packages/e2e/src/) for examples.

### Running E2E Tests

See makefile for available E2E test commands (production and development modes).

## Test Data

Test documents are in [packages/e2e/testdata/](../packages/e2e/testdata/) covering various TEI structures and enrichment types.

## Maintaining Tests

### Test Maintenance Tips

**Flaky tests**:

- Add proper wait conditions: `await expect.element(element).toBeVisible()`
- Avoid fixed timeouts
- Check for race conditions
- Run test multiple times to verify stability

**Slow tests**:

- Mock expensive operations (API calls, file I/O)
- Use smaller test documents
- Parallelize independent tests
- Profile with `--reporter=verbose`

**Brittle tests**:

- Use semantic queries (role, label) over CSS selectors
- Test behavior, not implementation
- Avoid testing internal state
- Keep tests focused on single behavior

### Adding Test Data

**For unit tests**:

- Create minimal test fixtures inline or in test files
- Use builder pattern for complex objects
- Share common fixtures via test utilities

**For E2E tests**:

- Add TEI documents to [testdata/](../packages/e2e/testdata/)
- Keep files minimal (only necessary elements)
- Name descriptively: `feature-scenario.tei`
- Document special cases in file comments

## Best Practices

Follow standard testing practices: test behavior not implementation, use descriptive test names, keep tests isolated, and prefer user-centric assertions over implementation details.

## Continuous Integration

Tests run automatically on pull requests and commits. See CI configuration for details.

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
