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

- **Mobile-first.** Base styles always target the mobile viewport. Use `@include tablet` and `@include desktop` to layer wider-viewport overrides on top. Never write styles that start from desktop and narrow down to mobile.
- Prefer SCSS Modules and existing naming/style conventions.
- Avoid inline or ad hoc styling when the local pattern is SCSS Modules.
- Reuse existing layout and spacing patterns where possible.
- Preserve existing local class-composition patterns instead of introducing a new styling utility without a reason.

### SCSS Declaration Ordering And Empty-Line Rules

When editing SCSS in this directory:

- Place local CSS custom properties first within a declaration block when they are used as local styling variables.
- After the last custom property, add exactly one blank line before the first standard declaration.
- In size-variant blocks, keep exactly one blank line immediately before the `min-height` declaration so `declaration-empty-line-before` remains compliant.
- Do not reorder declarations in a way that places standard declarations above local custom properties when the block is using CSS variables as local configuration.

### Preferred pattern:

```scss
.selector {
  --smart-search-panel-padding: #{pxToRem(8) pxToRem(16) 0 pxToRem(16)};

  border-right: 1px solid $color-border;
}
```

### Preferred size-variant pattern:

```scss
.sizeSm {
  --button-padding-inline: #{pxToRem(12)};

  min-height: #{$btn-height-sm};
}
```

### Avoid:

```scss
.selector {
  border-right: 1px solid $color-border;
  --smart-search-panel-padding: #{pxToRem(8) pxToRem(16) 0 pxToRem(16)};
}
```

## Testing

- When component behavior changes, update or add unit tests where appropriate.
- Test user-visible behavior rather than implementation details.
- Preserve stable `data-testid` attributes used by Playwright for critical flows.
- In unit tests, remember the repo setup mocks `next/image`, `next/link`, and App Router hooks.

## Review Expectations

- Check accessibility, prop design, rendering boundaries, and test coverage.
- Flag unnecessary client-only conversion, over-complex props, unstable selectors, and brittle tests.
