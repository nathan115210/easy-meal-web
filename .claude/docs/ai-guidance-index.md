# AI Guidance Index

Use this file as the entry point for repository-specific AI guidance documents.

## Order Of Use

1. Start with the repository root `CLAUDE.md` for global project conventions.
2. Use the nearest local `CLAUDE.md` for path-specific rules.
3. Use the specialized docs in this folder when the task type matches:
   - Code review → `code-review/review-guidelines.md`
   - Unit / API tests → `testing/unit-testing-guidelines.md`
   - Playwright e2e tests → `testing/e2e-testing-guidelines.md`
   - Component or page creation → `design/design-guidance.md` + `design/component-rules.md` + `design/page-patterns.md`
   - Generating UI with AI → also load `design/ai-prompt-guide.md`

## Specialized Docs

- Code review: `code-review/review-guidelines.md`
- Unit and API tests: `testing/unit-testing-guidelines.md`
- Playwright e2e tests: `testing/e2e-testing-guidelines.md`
- Design system (core guidance): `design/design-guidance.md`
- Page-level layout and behavior: `design/page-patterns.md`
- Component implementation rules: `design/component-rules.md`
- AI prompt templates for UI work: `design/ai-prompt-guide.md`

## Source Of Truth

- Trust current code and repo config over older documentation when they conflict.
- Use these docs to refine AI behavior, not to replace the actual implementation, lint config, formatter config, or test setup already in the repository.

## Intent

- Keep project-wide conventions in `CLAUDE.md`.
- Keep task-specific operational guidance in `.claude/docs/**`.
- Keep `.claude/agents/*.md` as thin task entry points that point to these docs instead of duplicating them.
