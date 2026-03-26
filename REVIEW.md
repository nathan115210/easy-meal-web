# Code Review Guidelines

## Source of truth

- Prettier is the formatting source of truth.
- ESLint defines lint semantics for this repository.
- Biome is supplemental and should not override Prettier or ESLint.
- Treat generated output and build artifacts as out of scope for style review.

## Always check

- New or changed API behavior is type-safe and does not silently change response contracts.
- New component behavior includes appropriate unit-test coverage when the repo has an existing test pattern.
- New hooks and utilities handle edge cases and preserve type safety.
- E2E changes avoid brittle selectors and timing-based flakiness.
- Client/server boundaries are correct for Next.js App Router.

## SCSS review rules for component styles

For SCSS under `src/components`:

- Local CSS custom properties should appear before standard declarations within the rule block.
- There should be exactly one blank line between the last custom property and the first standard declaration.
- In size-variant blocks, keep exactly one blank line immediately before the `min-height` declaration.
- Flag declaration-order changes that move standard declarations above local custom properties when the block uses CSS variables as local configuration.

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

## Skip or down-rank

- Formatting nits already handled by Prettier.
- Generated files, lockfiles, and build artifacts.
- Broad style churn unrelated to the PR goal.

## Review tone

- Prefer concrete findings with user impact.
- Keep suggestions actionable.
- Do not invent stylistic preferences that are not grounded in repo tooling or local conventions.
