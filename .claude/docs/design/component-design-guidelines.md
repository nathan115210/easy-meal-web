# Component Design Guidelines

Use this document when building or modifying any UI component in `src/components/`.
It is the single source of truth for design-system conventions, token usage, and structural patterns.

---

## 1. Design Token Layers

The design system has three token layers. Always reach for the innermost layer that satisfies the requirement.

| Layer                     | Where defined                             | How to consume                                    |
| ------------------------- | ----------------------------------------- | ------------------------------------------------- |
| **Raw palette**           | `src/styles/tokens/colors.scss`           | SCSS `$color-*` vars — layout / SCSS modules only |
| **Semantic tokens**       | `src/styles/tokens/colors.scss` (derived) | SCSS `$color-primary`, `$color-muted`, etc.       |
| **CSS custom properties** | `src/styles/globals.scss` `:root` block   | `var(--color-*)` — preferred in component SCSS    |

### Color tokens quick reference

```scss
// Raw palette (compile-time SCSS only)
$color-bg          // #faf8f7 — page background
$color-text        // #282237 — primary text
$color-brand       // #c38f59 — primary action / brand

// Semantic SCSS tokens
$color-primary              // same as $color-brand
$color-primary-foreground   // #ffffff
$color-secondary            // warm muted surface
$color-muted                // warm border

// CSS custom properties (runtime, preferred in components)
var(--color-primary)          var(--color-primary-fg)
var(--color-secondary)        var(--color-secondary-fg)
var(--color-muted)            var(--color-muted-fg)
var(--color-success)          var(--color-success-fg)
var(--color-warning)          var(--color-warning-fg)
var(--color-danger)           var(--color-danger-fg)
var(--color-surface)          // card background (#fff)
var(--color-surface-muted)    // panels, sections
var(--color-border)           // standard border
var(--color-border-muted)     // subtle border
var(--color-hover)            // primary-tinted hover bg
var(--color-active)           // primary-tinted active bg
var(--color-focus-ring)       // focus outline
var(--color-disabled)
```

---

## 2. Spacing

`src/styles/tokens/spacing.scss` defines a **4-point grid**. Never use arbitrary pixel values.

```scss
$space-1:  0.25rem  //  4px — tight, label-to-input gaps
$space-2:  0.5rem   //  8px — icon gap, chip internal
$space-3:  0.75rem  // 12px — inline group gap
$space-4:  1rem     // 16px — standard component padding
$space-5:  1.25rem  // 20px — medium padding
$space-6:  1.5rem   // 24px — section gap (mobile)
$space-8:  2rem     // 32px — section gap (desktop)
$space-10: 2.5rem   // 40px — large section gap
$space-12: 3rem     // 48px — page section breathing room
$space-16: 4rem     // 64px — hero-level spacing
```

### Component sizing tokens

```scss
// Buttons
$btn-height-sm: 2rem     // 32px
$btn-height:    2.5rem   // 40px
$btn-height-lg: 3rem     // 48px

// Inputs
$input-height-sm: 2.25rem  // 36px
$input-height:    2.75rem  // 44px
$input-height-lg: 3.25rem  // 52px

// Icons
$icon-size-sm: 1rem     // 16px
$icon-size:    1.25rem  // 20px
$icon-size-lg: 1.5rem   // 24px

$touch-target: 2.75rem  // 44px — WCAG minimum
```

### pxToRem helper

Use the `pxToRem()` function (from `tokens/spacing`) in SCSS modules to convert design-spec pixel values:

```scss
@use '@/styles/tokens/spacing' as *;

.element {
  padding: pxToRem(12) pxToRem(16);
}
```

---

## 3. Typography

All type sizes live in `src/styles/typography.scss` as CSS custom properties.

```scss
// Type scale
var(--text-display)   // 48px — hero / splash
var(--text-h1)        // 36px
var(--text-h2)        // 28px
var(--text-h3)        // 22px
var(--text-h4)        // 18px
var(--text-body-lg)   // 17px — featured copy
var(--text-body)      // 15px — default
var(--text-body-sm)   // 13px — secondary
var(--text-label)     // 13px — captions, metadata
var(--text-caption)   // 11px — footnotes, timestamps

// Line heights
var(--leading-tight)    // 1.10 — headings
var(--leading-snug)     // 1.25 — sub-headings
var(--leading-normal)   // 1.50 — body
var(--leading-relaxed)  // 1.65 — long-form

// Font weights
var(--font-regular)    // 400
var(--font-medium)     // 500
var(--font-semibold)   // 600
var(--font-bold)       // 700

// Letter spacing
var(--tracking-tight)    // -0.02em — display headings
var(--tracking-normal)   //  0em    — body text
var(--tracking-wide)     //  0.04em — labels, chips
var(--tracking-widest)   //  0.12em — all-caps micro-labels
```

---

## 4. Border Radius

`src/styles/tokens/border-radius.scss`:

```scss
$radius-sm:   6px    // subtle — small badges, tight containers
$radius-md:   10px   // default — inputs, list items, small cards
$radius-lg:   16px   // prominent — cards, panels, image containers
$radius-xl:   24px   // generous — chips, compact buttons, nav items
$radius-xxl:  32px   // maximum — modals, hero images
$radius-pill: 9999px // fully rounded — tags, toggle pills
```

Use `$radius-md` as the default for most components. Use `$radius-lg` for cards and containers. Use `$radius-pill` for badges and tags.

---

## 5. Elevation

`src/styles/elevation.scss` exposes shadow tokens as CSS custom properties.

```scss
var(--shadow-sm)        // resting cards, list items
var(--shadow-md)        // hovered panels, sticky surfaces
var(--shadow-lg)        // modals, overlays, floating menus
var(--shadow-card-hover) // elevated lift for interactive cards
```

**Rules:**

- Default resting state → no shadow or `--shadow-sm`
- Hover state on interactive cards → `--shadow-card-hover` paired with `--transition-surface`
- Overlays and modals → `--shadow-lg`
- Never invent custom box-shadow values; always use these tokens

---

## 6. Motion

`src/styles/motion.scss` exposes duration and easing tokens. All durations automatically collapse to `1ms` when `prefers-reduced-motion: reduce` is active.

```scss
// Durations
var(--duration-instant)  // 80ms  — state flags
var(--duration-fast)     // 120ms — hover/focus color and border
var(--duration-normal)   // 200ms — surface transitions, card lift
var(--duration-slow)     // 300ms — modal enter

// Easings
var(--ease-out)     // elements entering the screen
var(--ease-in)      // elements leaving
var(--ease-inout)   // bidirectional movement
var(--ease-spring)  // playful, success states
var(--ease-base)    // color / opacity, no direction

// Transition shorthands (use with `transition:`)
var(--transition-color)    // color, background-color, border-color at --duration-fast
var(--transition-surface)  // box-shadow + transform at --duration-normal
var(--transition-opacity)  // opacity at --duration-fast
```

**Rules:**

- Use `--transition-color` for hover/focus palette changes
- Use `--transition-surface` for card or panel lift/drop
- Exit transitions should use `--duration-fast` or `--duration-normal`, not `--duration-slow`
- Never use `transition: all` — target specific properties

---

## 7. Z-Index

`src/styles/tokens/z-index.scss` — use the `zIndex()` function or reference the token map:

```scss
@use '@/styles/tokens/z-index' as *;

.tooltip {
  z-index: zIndex('raised');
} //   1
.stickyFooter {
  z-index: zIndex('sticky');
} //  20
.topBar {
  z-index: zIndex('topbar');
} // 100
.modal {
  z-index: zIndex('modal');
} // 300
.toast {
  z-index: zIndex('toast');
} // 400
.dragging {
  z-index: zIndex('dragging');
} // 500
```

Note: Native `<dialog>` uses the browser top-layer — no z-index token needed.

---

## 8. Breakpoints / Responsive Design — Mobile First

> **This project is mobile-first.** Base SCSS always targets the smallest (mobile) viewport first. Tablet and desktop rules are layered on top with `@include tablet` and `@include desktop`. Never write desktop-first styles and override down to mobile.

`src/styles/tokens/mixins.scss` defines two breakpoints and their SCSS mixins:

| Name    | Range             | Mixin                    |
| ------- | ----------------- | ------------------------ |
| Mobile  | < 769px           | (default / base styles)  |
| Tablet  | 769px – 1199.98px | `@include tablet { … }`  |
| Desktop | ≥ 1200px          | `@include desktop { … }` |

```scss
@use '@/styles/tokens/mixins' as *;

.component {
  padding: $space-4;

  @include tablet {
    padding: $space-6;
  }

  @include desktop {
    padding: $space-8;
  }
}
```

Always write mobile-first: base styles target mobile, then layer tablet and desktop overrides with the mixins.

---

## 9. SCSS Module Patterns

### File structure

Each component lives in its own folder with exactly two files:

```
src/components/myComponent/
  MyComponent.tsx
  myComponent.module.scss
```

### @use imports

```scss
// Import what you need — do not import from globals.scss
@use '@/styles/tokens/colors' as *;
@use '@/styles/tokens/spacing' as *;
@use '@/styles/tokens/border-radius' as *;
@use '@/styles/tokens/mixins' as *;
@use '@/styles/tokens/z-index' as *;
```

### Declaration order within a block

1. Local CSS custom properties (`--component-*` variables used as local config)
2. One blank line
3. Standard CSS declarations (layout, typography, color, etc.)

```scss
// Correct
.button {
  --button-padding-inline: #{pxToRem(20)};

  display: inline-flex;
  align-items: center;
  padding-inline: var(--button-padding-inline);
}

// Wrong — custom property after standard declarations
.button {
  display: inline-flex;
  --button-padding-inline: #{pxToRem(20)}; // ← move this above
}
```

### Size variant blocks

Keep exactly one blank line immediately before `min-height` in size-variant blocks:

```scss
.sizeSm {
  --button-padding-inline: #{pxToRem(12)};

  min-height: #{$btn-height-sm};
}
```

### Conditional class composition

Prefer the minimal `cx()` helper pattern found in `Button.tsx` over template literals for multiple conditional classes:

```tsx
function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const cls = cx(styles.base, isActive && styles.active, className);
```

---

## 10. Server vs Client Component Decision

Default to **Server Components**. Add `"use client"` only when the component requires:

- `useState` / `useEffect` / `useRef`
- Event handlers (`onClick`, `onChange`, etc.)
- App Router hooks (`useRouter`, `usePathname`, `useSearchParams`)
- Browser APIs (`window`, `speechSynthesis`, Intersection/Resize Observer)

Do not convert a component to client-side purely for convenience.

---

## 11. Accessibility Requirements

- Use semantic HTML first (`<button>`, `<nav>`, `<section>`, etc.)
- All interactive elements must be keyboard-accessible (tab, enter, space, escape)
- Icon-only buttons **must** have an `aria-label` (the `Button` component enforces this with a dev-mode warning)
- Loading states set `aria-busy={true}` on the element
- Use `aria-pressed` for toggle buttons
- Minimum touch target size: `$touch-target` (44px) per WCAG 2.5.5
- Do not hide content from assistive technology unless it is decorative

---

## 12. Props Design

- Types must be explicit and narrow — avoid `any`
- Use `HTMLAttributes<HTMLElement>` spread (`...rest`) for pass-through props so consumers can add `className`, `data-*`, ARIA attributes
- Prefer optional props with sensible defaults over required props where possible
- Preserve stable public prop names on shared components — renaming a prop is a breaking change for consumers

```tsx
// Good — narrow, explicit, spreads rest
export type ChipProps = {
  label: string;
  variant?: 'default' | 'muted' | 'success';
  size?: 'sm' | 'md';
} & HTMLAttributes<HTMLSpanElement>;

// Avoid — overly broad
export type ChipProps = {
  [key: string]: unknown;
};
```

---

## 13. Component Checklist

Before marking a new component complete, verify:

- [ ] Uses design tokens — no hardcoded hex values, font sizes, or pixel dimensions outside the scale
- [ ] SCSS Modules only — no inline styles, no CSS-in-JS, no utility-class strings
- [ ] Mobile-first — base styles target mobile; `@include tablet` / `@include desktop` layer wider-viewport overrides on top
- [ ] Server Component by default unless interactivity requires client
- [ ] Semantic HTML with correct ARIA where needed
- [ ] Icon-only interactive elements have `aria-label`
- [ ] Touch targets ≥ 44px for interactive elements
- [ ] `transition` properties reference motion tokens, not hard-coded `ms` values
- [ ] Shadow references elevation tokens, not ad hoc `box-shadow` values
- [ ] Props exported and typed narrowly; `...rest` spread applied to the root element
- [ ] `data-testid` on the root element if the component is targeted by Playwright flows
