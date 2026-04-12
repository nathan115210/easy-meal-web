# Easy Meal Web Copilot Instructions

## Project

- This repository is a Next.js 16 App Router application written in TypeScript.
- Prefer React Server Components by default. Add `"use client"` only when state, effects, event handlers, router hooks, or browser APIs require it.
- Server-side data access uses Prisma with PostgreSQL. GraphQL Yoga route handlers live under `src/app/api`.

## Working Rules

- Prefer minimal, reviewable changes over broad refactors.
- Preserve existing project structure, naming, and patterns unless there is a clear reason to change them.
- Trust current code and config over older documentation when they conflict.
- Prettier is the formatting source of truth. ESLint is the semantic source of truth. Biome is supplemental only.

## Code Review Priorities

- Prioritize correctness, regressions, security issues, and missing tests over style-only feedback.
- Flag server and client boundary mistakes in App Router code, especially when browser-only APIs or hooks are introduced without `"use client"`.
- Flag GraphQL, Prisma, helper, and TypeScript type mismatches when API contracts or data shapes change.
- Treat generated files as out of scope unless the source inputs are wrong.
- Avoid recommending formatting churn when the code already matches Prettier and ESLint.

## Styling And UI

- Use SCSS Modules for component and page styles.
- Keep styling mobile-first. Base styles should target mobile, then layer tablet and desktop with the existing SCSS mixins.
- Keep changes consistent with the existing design system and shared UI patterns.
- When a UI change creates or changes reusable shared guidance, update the relevant files under `.claude/docs/design` in the same change.

## Testing

- Unit and API tests use Vitest, React Testing Library, and MSW.
- End-to-end tests use Playwright.
- Add focused tests when behavior changes and nearby test infrastructure exists.
- For review, prefer comments that point out missing coverage for edge cases, error paths, and changed behavior.

## References

- Use `CLAUDE.md` for repo-wide conventions and decision-making rules.
- Use `.claude/docs/ai-guidance-index.md` to find specialized review, testing, and design guidance.
- Common validation commands: `pnpm format:check`, `pnpm lint`, `pnpm test:unit`, `pnpm test:e2e`.
