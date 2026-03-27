# Easy Meal AI Prompt Guide

## Purpose

Use this guide when asking AI to design or generate Easy Meal pages and components.

The goal is to keep outputs aligned with the established design system instead of letting the AI invent a different visual language each time.

---

## Master Prompt Prefix

Use this before page or component-specific prompts.

```text
Use the Easy Meal design guidance.

Easy Meal should feel premium, practical, and refined.
It is a health/productivity product first, premium lifestyle second, and content-friendly third.

Use one consistent design language across desktop and mobile.
The future native mobile app should follow the same design language as the web mobile breakpoint.

Visual rules:
- mostly neutral, near-monochrome UI
- very light neutral base with deep-neutral emphasis
- slightly rounded corners
- moderate elevation
- structured but restrained page chrome
- calm refined motion only

Tone rules:
- discovery-first on home
- concierge-like assistance, smart guide second
- never coach-like or pressure-inducing
- calm, clear feedback that auto-dismisses for routine actions

Content rules:
- recipe cards are image-first
- recipe detail is immersive editorial
- recipes and meal planning are equally central
- Discover is looser and more personalized
- Recipes is more structured and intentional
- Meal Plan is calm and planner-like
- Shopping List is efficient but polished
- Saved is curated and personal

Do not invent a new visual language.
Do not make the UI childish, cluttered, or too corporate.
Use the existing design direction consistently.
```

---

## Prompt Template: Page Design

```text
Design the [PAGE NAME] page for Easy Meal.

Platform:
- [desktop / mobile / both]

Page goals:
- [goal 1]
- [goal 2]
- [goal 3]

Required behavior:
- [behavior 1]
- [behavior 2]
- [behavior 3]

Use the Easy Meal design system:
- premium, practical, refined
- near-monochrome, very light neutral base, deep-neutral emphasis
- slightly rounded, moderate elevation
- structured but restrained page chrome
- calm refined motion

Respect the page-specific direction:
- [Discover: looser, personalized, inspirational]
- [Recipes: structured, intentional, lightly guided]
- [Recipe Detail: immersive editorial]
- [Meal Plan: calm planner]
- [Shopping List: efficient but polished]
- [Saved: curated personal collection]
- [Profile/Settings: structured and calm]

Also include:
- loading state
- empty state
- error state
- action hierarchy
- mobile behavior if relevant

Do not invent a new style. Keep the result aligned with Easy Meal's existing guidance.
```

---

## Prompt Template: Component Design

```text
Design the [COMPONENT NAME] component for Easy Meal.

Platform:
- [desktop / mobile / responsive]

Component purpose:
- [what it does]

Required states:
- default
- hover / press if relevant
- active / selected if relevant
- disabled if relevant
- loading if relevant
- error if relevant

Rules:
- keep the component within the Easy Meal design system
- premium, practical, refined
- near-monochrome visual language
- slightly rounded corners
- moderate elevation only where needed
- calm and clear interaction feedback
- avoid loud color, heavy chrome, or childish styling

If the component is content-led:
- keep imagery/content primary
- keep actions secondary

If the component is task-led:
- keep it clear, efficient, and polished

Describe:
- visual structure
- content hierarchy
- interaction behavior
- desktop/mobile differences if any
```

---

## Prompt Template: Responsive Conversion

```text
Convert this Easy Meal [PAGE / COMPONENT] from desktop to mobile.

Rules:
- keep the same design language as desktop
- do not create a different product identity on mobile
- preserve premium / practical / refined tone
- preserve near-monochrome visual system
- preserve calm feedback and restrained chrome

Mobile-specific guidance:
- bottom tabs are icon-only
- filters use bottom sheet / drawer
- mobile home stays feed-first
- recipe browsing stays scroll-friendly
- mobile meal plan uses card-based weekly summary
- mobile shopping list keeps compact core behavior with polished grouping

Explain:
- what stays the same
- what becomes tighter or more compact
- what interaction patterns change for mobile
```

---

## Prompt Template: Generate a New Page Pattern

```text
Create a new Easy Meal page pattern for [NEW PAGE NAME].

It must belong naturally to the existing product, not look like a separate app.

Follow these rules:
- same premium / practical / refined tone
- same near-monochrome light-neutral design language
- same slightly rounded + moderate elevation surface logic
- same structured but restrained shell
- same calm, refined interaction style
- same clear, auto-dismissing routine feedback

Decide where the page belongs within the system:
- closer to Discover
- closer to Recipes
- closer to Meal Plan
- closer to Shopping List
- closer to Saved
- closer to Settings

Then design the page accordingly.
```

---

## Prompt Template: UX Critique

```text
Critique this Easy Meal design against the established product guidance.

Review it for:
- visual consistency with premium / practical / refined tone
- alignment with the near-monochrome neutral system
- whether page chrome is restrained enough
- whether imagery/content lead appropriately
- whether actions are balanced and not too loud
- whether feedback is clear and calm
- whether desktop and mobile feel like the same product
- whether this page matches the correct page-behavior type
  - Discover = looser, more personalized
  - Recipes = more structured, lightly guided
  - Recipe Detail = immersive editorial
  - Meal Plan = calm structured planner
  - Shopping List = efficient but polished
  - Saved = curated personal collection
  - Settings = structured and calm

Identify:
- what fits
- what drifts away from the system
- the minimum changes needed to bring it back in line
```

---

## Short Prompt Add-Ons

Use these as small modifiers.

### Make it calmer

```text
Reduce visual noise. Keep the UI calmer, quieter, and more restrained.
```

### Make it more premium

```text
Increase the premium feel through spacing, hierarchy, imagery, and surface treatment, not through louder color or decorative effects.
```

### Make it more practical

```text
Improve clarity and efficiency without making the page feel corporate or overly dense.
```

### Make it more in-system

```text
Bring this back into the Easy Meal design system. Do not invent new visual language or new interaction tone.
```

---

## Anti-Patterns to Avoid

Do not ask AI for:

- playful, colorful foodie-app styling
- bright gradients and loud CTAs
- glassmorphism-heavy UI
- corporate admin-dashboard styling
- dense utility listing everywhere
- different visual languages between desktop and mobile
- coach-like or guilt-based assistant copy

---

## Best Practice

Always tell AI:

1. which page or component it is working on
2. whether the context is desktop or mobile
3. which Easy Meal section behavior it should follow
4. what the key user goal is
5. what states must be included

That keeps outputs consistent and useful.
