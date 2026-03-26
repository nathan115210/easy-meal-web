# Hook Rules

This directory contains custom React hooks. In the current codebase these hooks are client-only and often coordinate browser APIs, router state, or small pieces of reusable UI behavior.

## Hook Conventions

- Custom hooks must start with `use`.
- Keep hooks focused on one responsibility.
- Prefer composable hooks over overly broad hooks.
- Keep hooks thin when the transformation logic can live in `src/utils/lib`.

## React Correctness

- Watch dependency arrays carefully.
- Avoid stale closures and hidden state coupling.
- Do not trigger avoidable side effects during render.
- Guard browser-only APIs with `typeof window !== 'undefined'` or equivalent checks.
- Avoid disabling hook lint rules unless there is a documented reason.

## API Design

- Prefer clear return shapes as objects. That matches the current hook style better than tuples.
- Keep naming consistent with how hooks are consumed in the codebase.
- When a hook coordinates URL state, make that explicit and predictable. Preserve patterns like `router.push(..., { scroll: false })` where already used.

## Testing

- Add or update tests when hook logic changes meaningfully.
- Test observable behavior and edge cases, not implementation internals only.
- Prefer exercising hook behavior through realistic inputs and mocked browser/runtime boundaries instead of over-mocking the hook itself.

## Review Expectations

- Check dependency correctness, closure safety, side effects, browser API guards, typing, and API clarity.
