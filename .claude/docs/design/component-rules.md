# Component Design Guidelines

Use this document when building or modifying any UI component in `src/components/`.
It is the single source of truth for design-system conventions, token usage, structural patterns, and Easy Meal component behavior.

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
$color-text        // #282237 — deep neutral primary text / action base
$color-brand       // #c38f59 — warm editorial accent (not the default CTA)

// Core semantic — actions
// Primary uses deep neutral (#282237), not warm brand.
$color-primary              // = $color-text — deep neutral
$color-primary-foreground   // #ffffff
$color-accent               // = $color-brand — warm supportive/editorial accent
$color-accent-foreground    // #ffffff

// Secondary / muted
$color-secondary            // warm muted surface
$color-muted                // standard border
$color-muted-foreground     // warm mid-tone

// Text scale (SCSS only — compile-time)
$color-text-primary         // = $color-text — full strength
$color-text-secondary       // rgba($color-text, 0.78)
$color-text-muted           // rgba($color-text, 0.58)
$color-text-inverse         // #ffffff

// Surface scale (SCSS only)
$color-surface              // #ffffff — card / main surface
$color-surface-muted        // warm off-white — panels, sections
$color-surface-soft         // warm input tint
$color-surface-elevated     // #ffffff
$color-surface-strong       // warm muted — heavier surfaces

// Border scale
$color-border               // standard border
$color-border-muted         // subtle border
$color-border-strong        // stronger border

// Interaction
$color-hover                // primary-tinted hover bg (8% mix)
$color-active               // primary-tinted active bg (14% mix)
$color-selected             // primary-tinted selected bg (10% mix)
$color-focus-ring           // focus outline rgba
$color-disabled             // muted text (#9f938c)
$color-disabled-background  // #efe8e3
$color-disabled-border      // #e2d7d0

// Status: strong
$color-success / $color-success-foreground
$color-warning / $color-warning-foreground
$color-destructive / $color-destructive-foreground
$color-info / $color-info-foreground

// Status: soft / calm surfaces
$color-success-soft / $color-success-soft-foreground / $color-success-soft-border
$color-warning-soft / $color-warning-soft-foreground / $color-warning-soft-border
$color-destructive-soft / $color-destructive-soft-foreground / $color-destructive-soft-border
$color-info-soft / $color-info-soft-foreground / $color-info-soft-border

// Navigation
$color-sidebar / $color-sidebar-foreground
$color-sidebar-primary / $color-sidebar-primary-foreground
$color-sidebar-hover / $color-sidebar-active
$color-topbar / $color-topbar-foreground / $color-topbar-border

// Overlay
$color-overlay              // rgba($color-text, 0.28)

// CSS custom properties (runtime, preferred in component SCSS)
var(--color-primary)          var(--color-primary-fg)
var(--color-accent)           var(--color-accent-fg)
var(--color-secondary)        var(--color-secondary-fg)
var(--color-muted)            var(--color-muted-fg)
var(--color-success)          var(--color-success-fg)
var(--color-warning)          var(--color-warning-fg)
var(--color-danger)           var(--color-danger-fg)
var(--color-surface)          // card background (#fff)
var(--color-surface-muted)    // panels, sections
var(--color-border)           // standard border
var(--color-border-muted)     // subtle border
var(--color-border-strong)    // stronger border
var(--color-hover)            // primary-tinted hover bg
var(--color-active)           // primary-tinted active bg
var(--color-selected)         // primary-tinted selected bg
var(--color-focus-ring)       // focus outline
var(--color-disabled)
var(--color-overlay)          // scrim / backdrop
```

### Color usage rules

- Prefer CSS custom properties in component SCSS.
- Use semantic meaning before raw palette values.
- Do not introduce new component-local hex values.
- Easy Meal is a mostly neutral, near-monochrome system. Emphasis should come from contrast, spacing, typography, imagery, and elevation more than from strong color.
- Avoid colorful section-based UI treatments unless a product requirement explicitly calls for them.

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

### Spacing behavior rules

- Discovery-oriented components may use more breathing room.
- Planning components should stay balanced and structured.
- List-management components can be tighter, but should still feel polished.
- Do not compress components until they feel like an admin dashboard unless the component is explicitly task-utility driven.

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

### Typography behavior rules

- Easy Meal uses **refined product typography**, not expressive magazine typography and not flat admin typography.
- Titles should feel clear and refined.
- Supporting text should stay calm and concise.
- Metadata, chips, and smaller utility text should remain readable and restrained.
- Discovery and recipe-related components can feel slightly more elevated typographically than planning/list components, but the whole system should still feel unified.

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

### Radius behavior rules

- Easy Meal should feel **slightly rounded**, not sharp and not overly soft.
- Prefer consistency over too many radius changes within the same component.
- Avoid novelty radius treatments that make components feel playful or consumer-social.

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

### Elevation behavior rules

- Easy Meal uses **moderate elevation** overall.
- Cards and surfaces should feel layered enough to read clearly.
- Do not flatten everything.
- Do not over-elevate utility surfaces until they feel busy or noisy.
- Content-led surfaces may feel slightly richer than purely utility surfaces.

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

### Motion behavior rules

- Motion should feel **calm and refined**.
- Use motion to support continuity, not spectacle.
- Discovery/content components may tolerate slightly richer transitions than task/list utilities, but only subtly.
- Task-oriented flows should feel practical and calm, not theatrical.

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

### Responsive behavior rules

- Mobile should follow the same design language as desktop, not a different visual system.
- Mobile layouts may be tighter and more sequential, but should still feel like Easy Meal.
- Desktop can take advantage of broader canvas and richer spacing.
- Discovery and recipe browsing may feel more immersive on desktop.
- Utility/task flows may become more structured on desktop and more condensed or sheet-based on mobile.

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

### SCSS behavior rules

- Keep CSS custom properties first when used as local configuration.
- Respect the component SCSS empty-line and declaration-order conventions.
- Do not introduce ad hoc style structures that drift from the existing module pattern.
- Reuse shared tokens and local patterns before inventing new micro-systems.

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

### Accessibility behavior rules

- Accessibility should not be traded away for visual neatness.
- Recipe/discovery components must still keep controls, names, and roles clear.
- Dense utility components must still preserve tap targets and clear keyboard behavior.

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

### Props behavior rules

- Shared components should expose stable, predictable APIs.
- Prefer composable props over sprawling flag combinations.
- Avoid making a component "smart" with too many mode props if composition would be clearer.

---

## 13. Easy Meal Product Component Principles

These rules define how components should **feel**, not just how they are implemented.

### Product tone

Easy Meal components should feel:

- premium
- practical
- refined

They should not feel:

- childish
- cluttered
- too corporate

### Global component behavior

- The whole app should feel consistently premium.
- Components should vary by context and task, but not by switching to a different design language.
- Discovery and recipe components can feel more visual and immersive.
- Planning and list components should feel clearer, more structured, and more utility-aware.
- Profile/settings components should remain calm and practical while still feeling part of the same product.

### Component context rules

#### Discovery components

- More spacious
- Slightly looser grouping
- More personalized where appropriate
- More content-led than utility-led

#### Recipe browsing components

- Structured and intentional
- Still visually rich
- Should not feel like a cold catalog

#### Recipe detail components

- Editorial, immersive, and premium
- Long-form sections can feel richer
- Strong hierarchy and breathing room matter

#### Meal plan components

- Calm, structured, planner-like
- Clean and overview-oriented
- Not overly dashboard-heavy

#### Shopping list components

- Efficient first
- Polished second
- Never sloppy or raw-task-app looking

#### Saved / collection components

- Curated and personal
- Should feel like a personal recipe library, not just a stash

---

## 14. Cards

### Recipe cards

- Recipe cards are **image-first**.
- The image and content must lead.
- Cards should not feel action-heavy.
- Actions should stay lightweight and secondary.
- Discover cards can feel slightly more immersive.
- Recipes and Saved cards should feel more structured and browseable.

### Card rhythm

- Desktop Discover cards can feel more immersive and premium.
- Desktop Recipes/Saved cards should remain more balanced and grid-friendly.
- Mobile Discover cards can breathe a bit more.
- Mobile Recipes/Saved cards should stay more balanced for efficient browsing.

### Card metadata

- Metadata treatment is mixed by context.
- Discover cards should stay cleaner.
- Recipes and Saved can support slightly richer metadata.
- Do not overload cards with too many facts at once.
- Title remains the dominant textual element.

### Card actions

- "Save" can be visible but subtle.
- "Add to Meal Plan" should vary by context and stay secondary in tighter layouts.
- Do not turn cards into mini control panels.

---

## 15. Buttons and Action Hierarchy

### Action hierarchy

Easy Meal uses a **balanced action hierarchy**.

- Primary actions must be clearly identifiable.
- They should still feel elegant and restrained.
- Avoid loud or aggressive CTA styling.
- Hierarchy should come from contrast, weight, placement, and surface treatment more than bright color.

### Primary buttons

Use mixed treatment:

- Deep-neutral filled buttons for important actions
- Softer or tonal treatment for calmer contexts

### Secondary buttons

Use mixed treatment:

- Outline buttons for clearer secondary actions
- Tonal or text-like treatments for quieter contexts

### Tertiary actions

Use mixed treatment:

- Usually text-like
- Quiet button treatment only where clarity benefits from it

### Destructive actions

- Clear but calm
- Noticeable enough to prevent mistakes
- Avoid harsh alert styling by default

---

## 16. Inputs, Search, Filters, and Choice Controls

### Inputs

- Most fields should feel structured and clear.
- Selected search or discovery inputs can feel slightly more premium.
- Do not make all fields overly decorative.

### Search

- Search is important but not dominant.
- Global or high-value search can have slightly more presence.
- Inline or filter search should stay close to standard field styling.

### Filter chips

- Filter chips are mixed by context.
- Discovery and recipe filters can feel more polished.
- Planning/list/task filters should stay quieter.

### Active filter chips

- Active states must be clear, but still elegant.
- Discovery/recipe filters may carry a slightly stronger active state.
- Utility filters should remain calmer.

### Choice controls

For single-select and multi-select controls:

- Task/utility choices should be structured and clear.
- Discovery or preference-oriented choices can feel slightly more premium.
- Do not make all selectors equally decorative.

---

## 17. Metadata, Chips, Badges, and Labels

- Badges, chips, and small metadata are mixed by context.
- Discovery/recipe metadata can be a bit more expressive.
- Planning/list statuses should stay quieter and more utilitarian.
- Always keep metadata restrained.
- Never let tags or status markers overpower the content.

### Nutrition and serving controls

- Nutrition information can be prominent where it matters.
- Serving controls are a high-value interaction and may be more prominent than typical secondary metadata controls.

---

## 18. Dialogs, Drawers, Bottom Sheets, and Side Panels

### Default overlays

Default overlays should feel like **refined utility**:

- clean
- polished
- structured
- functional

Examples:

- filter sheets
- plan editing
- confirmations
- settings edits
- list-generation review

### Premium overlays

Selected content-led moments can feel slightly more premium:

- recipe-focused rich previews
- curated collection moments
- elevated content surfaces

### Platform rules

- Mobile utility flows often prefer bottom sheets
- Desktop task-editing may prefer side panels
- Content-rich overlays can use larger dialogs/lightboxes on desktop

---

## 19. Feedback and State Components

### Toasts and routine feedback

- Use toast for routine success/failure confirmation.
- Auto-dismiss after a short duration.
- Do not require manual dismissal for routine cases.
- Toasts should feel clear and polished, not loud.

### Larger success confirmations

- Bigger flows may get a clearer polished confirmation moment.
- Most successes still remain quiet and quick.
- Contextual inline confirmation is allowed where it improves clarity.

### Loading

- Use structured skeletons by default.
- Preserve layout whenever possible.
- Discovery/recipe loading can feel slightly richer, but never flashy.

### Errors

- Inline/local errors should be calm, clear, and helpful.
- Page-level/blocking errors can be more visible.
- Always explain what happened and what the user can do next.

### Empty states

- Assistant-like first
- Helpful and elegant second
- Include a sensible next step
- Avoid pressure-inducing language

### Disabled, blocked, completed, new states

- Disabled: usually calm and refined
- Blocked: explain what is missing and what to do next
- Completed: routine completions stay calm; bigger completions can feel a bit more satisfying
- New/updated states: temporary emphasis should stay refined

---

## 20. Interaction-State Tone

### Hover states

- Mixed by context
- Discovery/content hovers can feel a little richer
- Utility/task hovers stay calmer

### Pressed/tap states

- Mixed by context
- Discovery/content interactions can stay calmer
- Task/list/planner actions can be a bit clearer

### Selected states

- Discovery/content selections stay calmer
- Task/list/planner selections can be clearer

### Sticky behavior

- Use sticky behavior more carefully in discovery and recipe areas
- Use it more helpfully in planning, editing, and list workflows
- Sticky UI should never dominate the screen

---

## 21. Navigation Components

### Desktop sidebar

- Mostly restrained and structured
- May hold a small amount of contextual content when useful
- Should not become a feature-dense control center

### Desktop top bar

- Can have a stronger premium presence
- Still must stay part of the restrained shell
- Should frame content rather than compete with it

### Mobile tabs

- Balanced and clear overall
- Icons-only bottom tabs
- Active-state indication should use stronger icon state plus subtle indicator support

### Section headers and section actions

- Section headers should feel balanced and refined
- Section-level actions are mixed:
  - often quiet and refined
  - a little clearer in task-oriented areas

---

## 22. Recipe-Specific Components

### Recipe detail sections

- Core utility sections like ingredients should stay clean and readable.
- Secondary sections like tips, notes, or related content can feel slightly richer.
- Related recipes can act as an editorial continuation.
- End-of-page continuation can be a stronger premium discovery moment.

### Ingredient list

- Keep simple and clean.
- Do not over-structure unless the recipe content requires it.

### Cooking steps

- Structured reading flow by default.
- Clear spacing, numbering, and supportive timing/notes when useful.

### Cooking mode

- Simple and straightforward
- Text-first
- Calm guided mode
- Still visually aligned with the product

---

## 23. Planner and Shopping Components

### Planner surfaces

- Planner layouts should remain structured and easy to scan.
- Selected content inside the planner can introduce a little more richness.
- Do not let the planner become visually noisy.

### Shopping list rows

- Efficient, but polished
- Rows may be more spacious than a raw task list
- Group headers can carry stronger typographic presence where useful

### Review/generation flows

- Use a lightweight review step when appropriate
- Keep it practical and fast
- Do not turn shopping-list generation into a heavy multi-step wizard unless needed

---

## 24. Collection Components

### Collection-management flows

- Structured and polished
- Easy to understand
- More library-management than raw utility

### Collection pages

- Curated and premium
- Still practical to browse and manage

### Collection headers

- Refined and curated by default
- Selected collections may have a stronger visual identity

---

## 25. Server vs Client Behavior Reminders for Design

When designing or building components:

- Do not default to client components for convenience
- Keep presentational components lean
- Avoid attaching unnecessary interactivity to otherwise static content
- Use progressive enhancement where possible

---

## 26. Component Checklist

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
- [ ] Component behavior matches its product context: Discover, Recipes, Recipe Detail, Meal Plan, Shopping List, Saved, or Settings
- [ ] The component feels premium, practical, and refined — never childish, cluttered, or too corporate
- [ ] Action hierarchy is balanced and restrained
- [ ] Feedback and state handling are clear, calm, and appropriate for the flow
