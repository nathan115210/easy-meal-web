# Unit Testing Guidelines

Use this file for AI-assisted unit and API test generation in Easy Meal Web. Prefer the repository's current test infrastructure and existing code patterns over generic testing advice.

## Current Test Stack

- Unit and API tests use Vitest.
- React component tests use React Testing Library.
- Networked GraphQL behavior is mocked with MSW.
- Global test setup lives in `vitest.setup.ts`.
- E2E tests use Playwright and belong in `e2e/`, not in unit test files.

## Source Of Truth

- Trust current code and config over older documentation when they conflict.
- The repository has working Vitest + RTL + MSW infrastructure, but overall unit-test coverage is still light.
- Prefer adding focused tests around changed behavior instead of broad speculative coverage.

## What To Test

- Test observable behavior and public contracts.
- For data helpers and API client logic, test the real helper with MSW intercepting network calls.
- For components, test user-visible behavior, accessibility-relevant output, and state transitions.
- For hooks, test returned behavior and edge cases rather than implementation internals.
- For pure helpers, test input/output mapping and edge cases.

## What Not To Test

- Do not unit-test GraphQL Yoga route files directly when the real value is in testing helpers or schema behavior.
- Do not mock `graphqlFetchClient` when MSW can intercept the real fetch call.
- Do not overfit tests to implementation details such as internal helper calls, exact DOM structure, or SCSS class names.
- Do not use Playwright patterns in Vitest tests.

## API And Data-Helper Testing

- Follow the existing MSW GraphQL pattern described in `doc/testing/api-testing.md`.
- Prefer testing helpers in `src/utils/data-server` through real fetch calls intercepted by MSW.
- Match GraphQL operation names, endpoint paths, and variable shapes exactly.
- When API contracts change, update query documents, helper payload types, mock handlers, and tests together.

## Component Testing

- Use React Testing Library and prefer accessible queries first.
- Use `data-testid` only when role, label, or text queries are not stable enough.
- The repo test setup already mocks `next/image`, `next/link`, `next/navigation`, and some server-only Next APIs.
- Test behavior such as loading states, visibility, rendering, and interactions rather than snapshotting everything.

## Hook Testing

- Test client-hook behavior through realistic input and returned values.
- Watch for dependency-related regressions, stale closures, and browser API guards.
- Prefer object-shaped assertions that reflect how hooks are consumed in the app.

## Utility Testing

- Keep pure helper tests small and explicit.
- Cover parsing, normalization, fallback logic, and boundary conditions.
- Do not pull React or browser assumptions into tests for generic helpers unless the utility itself is browser-specific.

## MSW Guidance

- Keep handlers close to real GraphQL endpoint behavior.
- Use `graphql.link('/api/all-meals')` or the correct endpoint under test.
- Reset handlers between tests and rely on the existing server lifecycle in `vitest.setup.ts`.
- Prefer explicit mocked response shapes over broad catch-all mocks.

## Test Style

- Keep tests focused and readable.
- Prefer one behavior per test.
- Name each test case so it starts with `SHOULD` in uppercase, followed by the user-visible or contract-visible behavior being verified.
- Avoid unnecessary sleeps or timing hacks.
- Reuse existing helper patterns before inventing new test infrastructure.

## Validation

- Run `pnpm test:unit` for unit/API tests.
- Run `pnpm lint` and `pnpm format:check` when test files are part of the change.
