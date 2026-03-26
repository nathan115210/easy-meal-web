# Review Guidelines

Use this file as a summary of the repository's existing code review standards. Prefer the repository's configured tools over generic style preferences.

## Source Of Truth

- Trust current code and configuration over older docs when they conflict.
- Some older docs still mention `/api/graphql` or a dummy-data-first setup. The current implementation uses GraphQL Yoga endpoints at `/api/all-meals` and `/api/meal`, backed by Prisma data access in `src/utils/data-server`.
- Prettier is the formatting source of truth. Follow `.prettierrc.json` rather than inventing alternate formatting rules.
- ESLint is enabled through `eslint.config.mjs` and currently extends Next.js core-web-vitals and Next.js TypeScript defaults only.
- Biome is configured as a supplemental review tool for JavaScript, TypeScript, CSS, SCSS, JSON, and JSONC. If Biome feedback conflicts with Prettier formatting or ESLint semantics, defer to Prettier for formatting and ESLint for lint semantics.

## Formatting Expectations

- Use semicolons.
- Prefer single quotes in JavaScript and TypeScript code. JSX attribute quotes follow formatter defaults unless the repository config says otherwise.
- Keep lines within roughly 100 columns.
- Use 2-space indentation.
- Keep trailing commas compatible with the current Prettier setup.
- Preserve LF line endings.

## SCSS Expectations For Component Styles

### For SCSS under `src/components`:

- Place local CSS custom properties before standard declarations within the rule block when they are used as local styling variables.
- Keep exactly one blank line between the last custom property and the first standard declaration.
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

## Review Priorities

- **This project is mobile-first.** Flag any SCSS where the base rule targets desktop and media queries narrow it to mobile. Base styles must target the mobile viewport; tablet and desktop overrides must use `@include tablet` and `@include desktop`.
- Respect existing Next.js App Router and TypeScript patterns already used in the repository.
- Prefer minimal, reviewable changes over broad refactors.
- Do not propose style-only churn when the existing code already satisfies Prettier and ESLint.
- Treat generated output and build artifacts as out of scope for review.
- For Prisma-generated code and other generated files, focus review on the source inputs rather than the generated output.
- Pay special attention to schema, query, helper, and type synchronization when GraphQL contracts change.
- Pay special attention to server/client boundaries when reviewing components and hooks.

## Practical Checks

- For formatting, prefer the repository commands: `pnpm format` and `pnpm format:check`.
- For linting, use ESLint as configured by the repository.
- For unit and API changes, prefer the existing Vitest + MSW patterns.
- For e2e changes, prefer the existing Playwright smoke-test patterns and response-wait helpers.
- Use Biome as an additional reviewer signal, not as a replacement for the current ESLint plus Prettier setup.

## Known Tension

- This repository already has a clear formatting toolchain with Prettier, while ESLint is intentionally light. Biome should stay conservative here. Do not use Biome to introduce style rules that would create unrelated churn or contradict Prettier output.
