# E2E Test Rules

This directory contains Playwright tests. Match the current smoke-test style already present in this repo.

## Current Framework

- E2E coverage uses Playwright only.
- Follow the existing Playwright style already present in this directory.
- Do not introduce another e2e framework here.

## Test Design

- Test user-visible behavior and real flows.
- Prefer stable selectors and resilient assertions.
- Use `data-testid` selectors for core UI flows where the repo already exposes them.
- Structure tests around the real flow already used here:
  - trigger navigation or interaction
  - wait for the relevant GraphQL request
  - assert loading state clears
  - assert the final visible state

## Reliability

- Prefer deterministic setup and teardown.
- Keep test data assumptions explicit.
- Use the existing `e2eResponsePromise(page, apiUrl, method)` helper for network waits.
- Avoid arbitrary sleeps when a real condition can be awaited.
- Preserve patterns already used here for popup fallback and scroll-triggered loading.

## Scope

- E2E tests should cover critical user journeys, loading states, integration boundaries, and regressions.
- Do not use e2e tests where a focused unit test is the better fit.
- Use route mocking selectively; prefer real end-to-end behavior for smoke flows unless determinism requires mocking.

## Review Expectations

- Flag brittle selectors, unstable timing assumptions, over-mocking, and weak user-flow coverage.
