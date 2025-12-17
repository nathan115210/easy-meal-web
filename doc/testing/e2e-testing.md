# End-to-End (E2E) Testing Guide — Playwright

## Purpose

This document explains the end-to-end (E2E) testing strategy, conventions, and recommended practices for the Easy Meal
project. It focuses on Playwright-based tests that run against a running instance of the application (dev or
production-like server) and, when necessary, a real local database.

## Goals

- Validate core user flows end-to-end (pages, navigation, forms, search, infinite scroll).
- Provide a small set of deterministic smoke tests for CI.
- Keep tests reliable and fast where possible by using network mocking selectively.
- Provide patterns and helpers used across tests in this repo.

## High-level plan

I'll present: setup and commands, project layout and naming, Playwright config advice, stable selector rules, common
test patterns (response waiting, popup fallback, infinite scroll), guidance for DB + seed, CI job recipe, prioritized
test scenarios, and troubleshooting tips.

## Checklist (what this doc covers)

- [x] Where E2E tests live and naming conventions
- [x] How to run tests locally (basic commands)
- [x] Playwright config recommendations and projects (desktop / mobile)
- [x] Test data: DB, migrations, seeding for deterministic runs
- [x] Selector best practices and `data-testid` usage
- [x] Network strategies: when to mock vs hit real server
- [x] Common test patterns & helpers used in repo
- [x] CI recipe and artifact capture (traces / videos)
- [x] Prioritized list of E2E scenarios to implement
- [x] Troubleshooting notes and common fixes

## Project layout & file conventions

- Put E2E tests under `e2e/` at repo root.
  - `e2e/*.spec.ts` for top-level smoke tests (existing pattern).
  - `e2e/pages/*.spec.ts` or `e2e/features/*.spec.ts` for organized suites.
- Helper utilities and Playwright fixtures go under `e2e/utils/`.
- Use `.spec.ts` suffix for Playwright tests.

## Selector & test-id conventions

- Prefer `data-testid` attributes for stable selection in tests. The repo already uses many `data-testid` values (e.g.
  `meal-card`, `meals-infinite-list`, `cards-list-skeleton`).
- Use accessibility-first queries for assertions where possible (e.g. `getByRole('button', { name: /search/i })`).
- Avoid fragile CSS selectors (`:nth-child`) and structure-dependent selectors.

## Naming guidelines

- Test file name should describe the page or flow: `meals.smoke.spec.ts`, `create-meal.flow.spec.ts`,
  `smart-search.spec.ts`.
- Test names should describe the user story: `loads skeleton then renders meals`.

## Playwright config recommendations

Recommended `playwright.config.ts` options (example):

```ts
import { devices } from '@playwright/test';

const config = {
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 5000 },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    headless: true,
    baseURL: process.env.PW_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
};
export default config;
```

Notes:

- Use `projects` to run a small set of critical tests in `mobile` mode.
- Keep per-test `timeout` large enough for slow CI machines.

## Local dev: running tests

1. Start the DB and app (recommended):

```bash
pnpm run db:start       # start postgres container (local)
pnpm run db:migrate     # apply migrations
pnpm run db:seed        # seed deterministic test data
pnpm run dev            # start Next.js dev server (or `pnpm start` for prod build)
```

2. Run Playwright tests using the project's npm scripts (preferred):

```bash
# run all e2e tests (uses the project's script `test:e2e`)
pnpm run test:e2e

# open Playwright test runner UI (uses the project's script `test:e2e:ui`)
pnpm run test:e2e:ui

# run a single file (using the npm script with -- filter)
pnpm run test:e2e -- e2e/meals.smoke.spec.ts

# run headed and slow down for debugging
pnpm run test:e2e -- --headed --project=chromium --debug
```

3. When debugging flakiness, run one test with `--trace` and open trace with Playwright inspector.

## Network strategy: mock vs real server

- Prefer testing critical user flows against a **real server + seeded DB** in smoke tests (ensures end-to-end coverage).
- For deterministic functional paths (filter/search results that must match exact fixtures) use **route interception** (
  `page.route`) to return stable fixtures.
- Mocking benefits:
  - Speed and determinism.
  - Avoids heavy DB setup for many tests.
- Real-server benefits:
  - True integration of frontend, API route, Prisma, DB.
  - Catch integration regressions.

Recommended pattern: a small suite of smoke tests use the real server (DB seeded), while many feature tests use mocking.

## Common test patterns and helpers

This repo uses and benefits from the following patterns. Helpers for these patterns should live in `e2e/utils/` (
examples included in repo):

1. `responsePromise` (wait-for-response pattern)
   - Always _set up_ the response wait _before_ the action that triggers it.
   - Example:

```ts
const loadPromise = page.waitForResponse(
  (r) => r.url().includes('/api/all-meals') && r.request().method() === 'POST'
);
await page.goto('/meals');
await loadPromise;
```

2. Infinite scroll: set up a wait for the "load more" POST before scrolling the watcher.

```ts
const morePromise = page.waitForResponse(
  (r) => r.url().includes('/api/all-meals') && r.request().method() === 'POST'
);
await page.getByTestId('infinite-scroll-watcher').scrollIntoViewIfNeeded();
await morePromise;
```

3. Popup vs same-tab navigation fallback
   - Some CTAs open a new window (popup). Tests should handle both cases.

```ts
const popupPromise = page
  .context()
  .waitForEvent('page', { timeout: 3000 })
  .catch(() => null);
await locator.click();
const popup = await popupPromise;
if (popup) {
  await popup.waitForLoadState('domcontentloaded');
  await expect(popup).toHaveURL(/\/meals$/);
} else {
  await page.waitForURL(/\/meals$/);
}
```

4. Robust click fallback
   - If Playwright complains the element is not actionable, try DOM click fallback.

```ts
try {
  await locator.click({ timeout: 5000 });
} catch {
  await locator.evaluate((el) => (el as HTMLElement).click());
}
```

5. Wait for UI state changes (skeleton -> content)
   - Prefer waiting for DOM changes rather than fixed sleeps. Example: wait for skeleton count to be zero.

```ts
await expect(page.getByTestId('cards-list-skeleton')).toHaveCount(0);
```

6. Route mocking for deterministic scenarios (e.g., search for 'pasta')

```ts
await page.route('**/api/all-meals', async (route) => {
  const req = route.request();
  const post = (await req.postData()) ?? '';
  if (post.includes('pasta')) {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(pastaFixture),
    });
  } else {
    await route.continue();
  }
});
```

## Test scaffolding & helper suggestions

Create an `e2e/utils/helpers.ts` with helpers such as:

- `waitForGraphqlPost(page, endpoint, predicate)`
- `clickWithPopupFallback(locator, page)`
- `scrollToWatcherAndWait(page, watcherTestId)`

## Prioritized E2E scenarios (recommended roadmap)

Implement tests in priority order. Each item describes the flow and important asserts.

High priority (smoke / CI):

1. `meals.smoke.spec.ts` (meals page)
   - Loads skeleton, then meal cards render (initial load)
   - Loading more on scroll (infinite scroll)
   - Error state displayed when API returns 500 (mock)
   - Empty state and CTAs when filters return 0 (verify CTAs and navigation)

2. `meal-detail.smoke.spec.ts` (meal details page)
   - Load a specific meal page (`/meals/:slug`) — verify title, image, ingredients, instructions
   - Loading skeleton shown while fetching

3. `create-meal.flow.spec.ts` (create meal)
   - Open create page, fill fields, upload image (use `setInputFiles`), submit
   - Verify new meal appears on meals list (or redirect to /meals)

4. `smart-search.flow.spec.ts` (smart search)
   - Open smart-search, toggle some options, run search
   - Verify URL sync with params and correct result filtering

Medium priority:

- Authentication flows (sign in / sign up) if auth is used in-app
- Reactions to edge-case server errors or slow responses

Lower priority (can be mocked or covered by unit tests):

- Minor UI interactions for non-critical components

## Test data & DB guidance

- Use the provided npm scripts to prepare DB for real-server tests:

```bash
pnpm run db:start
pnpm run db:migrate
pnpm run db:seed
```

- For CI, run these steps in your job before Playwright:
  - Start Docker postgres container
  - `pnpm run db:migrate`
  - `pnpm run db:seed`
  - Build and start Next.js (or use `pnpm start` with the production build)

## CI recipe (GitHub Actions example)

A single job that runs Playwright tests might look like this (conceptual):

```yaml
name: E2E Tests
on: [push]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install --frozen-lockfile
      - name: Start DB
        run: |
          docker run -d --name easy-meal-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15
      - run: pnpm run db:wait # optional wait helper to ensure db ready
      - run: pnpm run db:migrate
      - run: pnpm run db:seed
      - run: pnpm run build
      - run: pnpm start &
      - run: npx playwright install --with-deps
      - run: npx playwright test --reporter=html
    timeout-minutes: 30
```

Notes:

- Add timeouts and retries for flaky network steps.
- Collect Playwright artifacts and upload them as workflow artifacts.

## Flakiness mitigation & best practices

- Use `data-testid` to select key elements.
- Set up network response waits _before_ triggering actions that request them.
- Prefer route mocking for fragile assertions about content values.
- For infinite scroll, always `waitForResponse` the "load more" request.
- Handle popups with `page.context().waitForEvent('page', { timeout: 3000 }).catch(() => null)` and fallback to same-tab
  navigation.
- If Playwright says a locator is not actionable, `scrollIntoViewIfNeeded()` first and/or use the DOM-click fallback.
- Keep tests small and focused — avoid one huge end-to-end test that covers many unrelated behaviors.

## Troubleshooting common failures

- **Timeout waiting for response**: Ensure `waitForResponse` is set up before the action that triggers the request.
- **Hydration mismatch errors**: Run tests against a production build when possible or wait for client hydration by
  detecting an element that appears after hydration.
- **Popup wait timeouts**: Use the popup fallback pattern shown above to avoid long timeouts when a popup isn't opened.
- **Locator not clickable**: use `await locator.scrollIntoViewIfNeeded()`; if still blocked, use DOM click fallback.

## Debugging tips

- Run tests locally with `--headed` and `--debug` to see the browser.
- Use `--trace on` to record a trace when rerunning a failing test and open it with
  `npx playwright show-trace trace.zip`.
- Capture console logs in tests with `page.on('console', msg => console.log(msg.text()))`.

## Appendix: small helper snippets

Create `e2e/utils/helpers.ts` with reusable helpers.

**waitForGraphqlPost**

```ts
export function waitForGraphqlPost(page, path, predicate) {
  return page.waitForResponse(
    (r) => r.url().includes(path) && r.request().method() === 'POST' && predicate(r)
  );
}
```

**clickWithPopupFallback**

```ts
export async function clickWithPopupFallback(locator, page) {
  const popupPromise = page
    .context()
    .waitForEvent('page', { timeout: 3000 })
    .catch(() => null);
  try {
    await locator.click({ timeout: 5000 });
  } catch {
    await locator.evaluate((el) => (el as HTMLElement).click());
  }
  const popup = await popupPromise;
  return popup;
}
```

## Conclusion

This guide provides a practical, predictable approach for building E2E tests for Easy Meal. Start with a small set of
stable smoke tests that run against a seeded DB, and expand with mocked feature tests for faster coverage. If you'd
like, I can add example tests into `e2e/` and helpers into `e2e/utils/` to get you started.

---

**Next steps I can take for you (pick one):**

1. Add a `e2e/utils/helpers.ts` file with the snippets above and a small example `e2e/meals.smoke.spec.ts` that follows
   repo conventions;
2. Add GitHub Actions workflow YAML example in `.github/workflows/e2e.yml` using the CI recipe above;
3. Add a short README section that links to this doc.

Which would you like me to do next?
