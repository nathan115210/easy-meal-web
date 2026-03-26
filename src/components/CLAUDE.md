# Component Rules

This directory contains reusable UI components. Match the current component split between Server Components, Client Components, SCSS Modules, and stable test selectors.

## Component Design

- Prefer small, focused components.
- Reuse existing component patterns before introducing new abstractions.
- Keep props typed clearly and narrowly.
- Prefer composition over deeply branching component logic.
- Preserve stable public props for shared components where possible.

## Server And Client Boundaries

- Prefer Server Components by default.
- Add `"use client"` only when the component needs one of these:
  - React state or effects
  - event handlers such as `onClick` or `onChange`
  - App Router hooks such as `useRouter`, `usePathname`, or `useSearchParams`
  - browser-only APIs such as `window`, `speechSynthesis`, or observers
- Do not move a component to the client just for convenience.

## Accessibility

- Prefer semantic HTML first.
- Ensure interactive elements are keyboard accessible.
- Use accessible names for buttons, inputs, and icon-only actions.
- Preserve project-specific accessibility guards such as the Button requirement that `iconOnly` buttons have an `aria-label`.

## Styling

- Prefer SCSS Modules and existing naming/style conventions.
- Avoid inline or ad hoc styling when the local pattern is SCSS Modules.
- Reuse existing layout and spacing patterns where possible.
- Preserve existing local class-composition patterns instead of introducing a new styling utility without a reason.

## Testing

- When component behavior changes, update or add unit tests where appropriate.
- Test user-visible behavior rather than implementation details.
- Preserve stable `data-testid` attributes used by Playwright for critical flows.
- In unit tests, remember the repo setup mocks `next/image`, `next/link`, and App Router hooks.

## Review Expectations

- Check accessibility, prop design, rendering boundaries, and test coverage.
- Flag unnecessary client-only conversion, over-complex props, unstable selectors, and brittle tests.
