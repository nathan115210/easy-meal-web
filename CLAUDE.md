# Easy Meal Web

Use this file for global project conventions. When a deeper `CLAUDE.md` exists in the path you are editing, follow the deeper file as the more specific instruction.

## Review Guidance

- Use `.claude/docs/ai-guidance-index.md` as the index for specialized AI guidance docs.
- For code review tasks, read `.claude/docs/code-review/review-guidelines.md` first.
- For review work in a specific area, also apply the closest local `CLAUDE.md` in that directory tree.

## Testing Guidance

- For unit or API test tasks, read `.claude/docs/testing/unit-testing-guidelines.md` first.
- For e2e test tasks, read `.claude/docs/testing/e2e-testing-guidelines.md` first.
- When writing tests for a specific area, also apply the closest local `CLAUDE.md` for the files under test.

## Design Guidance

- For component and page creation tasks, read `.claude/docs/design/design-guidance.md` first.
- Apply `.claude/docs/design/component-rules.md` when building or modifying any UI component.
- Apply `.claude/docs/design/page-patterns.md` when building or modifying pages.
- Use `.claude/docs/design/ai-prompt-guide.md` for prompt templates when generating pages or components.
- When building components, also apply the closest local `CLAUDE.md` for the path under development.

## Current Project Setup

- Framework: Next.js 16 App Router
- Language: TypeScript
- API: GraphQL Yoga route handlers under `src/app/api`
- Current GraphQL endpoints: `/api/all-meals` and `/api/meal`
- Rendering: React Server Components by default, Client Components only where required
- Styling: SCSS Modules
- Data layer: Prisma + PostgreSQL are active in server-side data access, even if some older docs still mention dummy JSON
- Testing: Vitest + React Testing Library + MSW for unit/API tests, Playwright for e2e tests

## Source Of Truth

- Trust current code and config over older documentation when they conflict.
- Some docs still mention `/api/graphql` or a dummy-data-first architecture. The current implementation uses split GraphQL endpoints and Prisma-backed data access in `src/utils/data-server`.
- Prettier is the formatting source of truth.
- ESLint is the lint source of truth for repo semantics.
- Biome is supplemental and must not override Prettier or ESLint decisions.

## General Working Rules

- Prefer minimal, reviewable changes over broad refactors.
- Preserve existing project structure and conventions unless there is a clear reason to change them.
- Favor consistency with the current codebase over introducing a new pattern.
- Do not add unrelated cleanup in feature or bug-fix changes.
- Keep changes easy to review and easy to revert.

## Next.js And TypeScript Rules

- Prefer Server Components by default.
- Add `"use client"` only when state, effects, event handlers, router hooks, or browser APIs are required.
- Respect App Router patterns already in use.
- Keep types explicit when they improve readability or safety.
- Prefer narrow, predictable types over broad permissive ones.
- Avoid `any` unless there is a strong and documented reason.

## Responsive Design

- **This project is mobile-first.** Base styles and layouts always target the smallest (mobile) viewport.
- Tablet and desktop rules are layered on top using the SCSS mixins `@include tablet` and `@include desktop`.
- Never write desktop-first styles and narrow down to mobile — mobile is always the default.
- This applies everywhere: new components, new pages, SCSS edits, code review, and e2e tests.

## Testing Rules

- Preserve and extend existing test patterns instead of inventing new ones.
- Unit and API tests use Vitest, RTL, and MSW. Prefer exercising real helpers with MSW interceptors rather than mocking the GraphQL client directly.
- E2E tests use Playwright only.
- Test coverage is still relatively light, so new behavior changes should add focused tests where the repo already has infrastructure.

## Validation Commands

- `pnpm format:check`
- `pnpm lint`
- `pnpm test:unit`
- `pnpm test:e2e`
