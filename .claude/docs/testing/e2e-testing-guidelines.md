# E2E Testing Guidelines

Use this file for AI-assisted Playwright test generation in Easy Meal Web. Prefer the repository's existing e2e style and helpers over generic browser-testing patterns.

## Current Test Stack

- E2E tests use Playwright only.
- E2E test files live under `e2e/`.
- The current repo already uses response-based waits and `data-testid` selectors for critical UI flows.
- Shared helpers can live in `src/utils/test/e2e-test` or other existing repo locations that already support e2e tests.

## Source Of Truth

- Trust current code and config over older docs when they conflict.
- The main e2e style reference is the current `e2e/` test suite plus `doc/testing/e2e-testing.md`.
- Prefer the live code patterns in `e2e/*.spec.ts` over aspirational or future-looking docs.

## What To Test

- Test user-visible behavior and end-to-end flows.
- Cover loading states, navigation, search, filtering, infinite scroll, and regression-prone flows.
- Assert behavior the user can observe, not internal implementation details.
- Use e2e tests for integration boundaries and real flows, not for logic that is better covered with unit tests.

## What Not To Test

- Do not rewrite unit-test coverage as browser tests when the same behavior is better verified in Vitest.
- Do not depend on fragile DOM structure, nth-child selectors, or styling details.
- Do not use arbitrary sleeps when a real UI or network condition can be awaited.
- Do not over-mock routes in smoke tests unless determinism requires it.

## Playwright Style In This Repo

- Prefer `data-testid` selectors for key UI states and components.
- Use accessibility-first queries where they are stable and clear.
- Structure tests around the current repo pattern:
  - set up any wait before the triggering action
  - perform navigation or interaction
  - wait for the GraphQL/network response
  - wait for the UI to reflect the loaded state
  - assert the final visible behavior
- Preserve the existing pattern of descriptive flow comments where they add clarity.

## Network And Async Guidance

- Use `e2eResponsePromise(page, apiUrl, method)` for response-based waits where applicable.
- Set up the wait before `page.goto`, scrolling, or user actions that trigger the request.
- Prefer waiting for visible state changes like skeleton removal, URL updates, or final content visibility.
- Preserve the popup-or-same-tab fallback pattern already used in `e2e/meals.smoke.spec.ts`.

## Selector Guidance

- Prefer `getByTestId` for critical app-specific elements such as meal cards, infinite-scroll watchers, and empty states.
- Prefer `getByRole` when accessible names are stable and part of the UX contract.
- Avoid selectors that depend on layout or nested markup structure.

## Data And Environment Guidance

- For real-flow smoke tests, align with the current app behavior and seeded local data expectations.
- When determinism is needed, use targeted Playwright route interception rather than broad global mocks.
- Keep test data assumptions explicit in the test body.

## Test Style

- Keep tests focused and readable.
- Prefer one user-visible behavior per test.
- Name tests by flow or observed behavior.
- Reuse existing response-wait, popup fallback, and scroll-loading patterns before inventing new helpers.

## Validation

- Run `pnpm test:e2e` for final e2e validation.
- If useful, run a single Playwright file first.
- Run `pnpm lint` and `pnpm format:check` when e2e files are part of the change.
