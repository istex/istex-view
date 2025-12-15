# Agent Coding Practices

This document provides an overview of coding practices and patterns for AI agents working on this monorepo.

## Setup commands

- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Run tests: `pnpm test`

## MCP

Use `context7` MCP server if available to browse package documentation

## Code style

- TypeScript strict mode
- Double quotes, use semicolons
- Use functional patterns where possible
- Put helper functions after the component or function that uses them
- Put component props after the component
- Put hook params after the hook
- Only add comments when the code is hard to follow
- Refactor code when a file gets too large:
  - Use functions when possible to avoid code taht is too large
- DO NOT create `index.ts` files that export all files in a directory

## General Practices

- Use `vitest` for unit tests

## Architecture

- Libraries are located in the `packages` folder

## Testing

To run tests for a specific package, run the following command:

```bash
pnpm turbo run test --filter=@istex/{packageName}
```

Example:

```bash
pnpm turbo run test --filter=@istex/react-viewer
```

**General Principles**

- **Explicitness over implicit behavior**: Make test setup and dependencies visible
- **Reduce duplication**: Use parameterized tests when patterns emerge
- **Clean assertions**: Use appropriate tools instead of manual traversal
- **Test isolation**: Each test should be independent and not share mutable state
- **Name you test files \*.spec.ts(x)**

**Use parameterized tests with `it.each`**

- Merge similar test cases using `it.each` to reduce duplication
- Use descriptive parameter names in test titles with `$parameter` syntax
- Group related test scenarios together

  ```typescript
  // ✅ Prefer
  it.each([
    { value: "A", expectedContent: [...] },
    { value: "B", expectedContent: [...] },
  ])(
    "does not remove section when $key is pressed",
    async ({ value, expectedContent }) => {
      // test implementation
    }
  );
  ```

**Avoid `beforeEach` for initialization**

- Promotes better test isolation and explicitness
- Each test is self-contained and independent

  ```typescript
  // ❌ Avoid
  describe("tests", () => {
    let x: Y;
    beforeEach(() => {
      x = new Y({ ... });
    });
  });

  // ✅ Prefer
  describe("tests", () => {
    it("test case", () => {
      // ...
    });
  });
  ```

**Do not use nested describe if not testing class methods**

Prefer the use of parameterized tests with `it.each`

```typescript
// ❌ Avoid
describe("tests", () => {
  describe("subtest", () => {
    // ...
  });
});

// ✅ Prefer
describe("tests", () => {
  it.each([
    /* ... */
  ])("subtest", () => {});
});
```
