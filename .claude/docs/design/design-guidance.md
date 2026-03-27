# Easy Meal Design Guidance

## Purpose

This document defines the core design direction for Easy Meal so AI tools, design work, and implementation work all follow the same product taste, interaction logic, and cross-platform behavior.

This guidance applies to:

- desktop web
- mobile web
- future native mobile app

The future native mobile app should follow the same design language as the web mobile breakpoint.

---

## Product North Star

Easy Meal should feel like a **premium, practical, refined** product for busy users who want help deciding what to eat, planning meals, and generating shopping lists without friction.

It is:

- health / productivity first
- premium lifestyle second
- content-friendly third

It should not feel:

- childish
- cluttered
- too corporate

The product should reduce decision fatigue while still making food feel appealing, curated, and worth returning to.

---

## Core Product Balance

Easy Meal has two equally central pillars:

- Recipes
- Meal Planning

Supporting sections:

- Discover
- Shopping List
- Saved
- Profile / Settings

The product should never collapse into only a recipe browser or only a planner tool. It should feel like one system where recipes inspire decisions, meal planning turns those decisions into action, and shopping lists support execution.

---

## Cross-Platform Rule

Use one design language across desktop and mobile.

Do not create a separate visual identity for mobile. Instead:

- keep the same taste
- keep the same component logic
- keep the same interaction tone
- adapt density and layout by context

Rule: **one design language, different page behaviors**.

---

## Visual Taste

### Target adjectives

- premium
- practical
- refined

### Avoid

- childish
- cluttered
- too corporate

### Overall feel

- calm
- polished
- structured
- modern
- elegant without being decorative
- quiet rather than noisy

---

## Visual System

### Color

- mostly neutral
- near-monochrome overall
- one restrained accent at most
- avoid colorful section-based UI
- emphasis should come from contrast, spacing, typography, imagery, and elevation rather than loud color

### Neutral direction

- main: very light neutral
- secondary: deep neutral

### Shape language

- slightly rounded
- not sharp/boxy
- not overly soft/playful

### Elevation

- moderate
- surfaces should feel layered
- not flat-minimal
- not heavy/shadow-dominant

### Page chrome

- structured but restrained
- headers, bars, nav, and shells should frame content, not dominate it

### Motion

- calm and refined
- subtle only
- motion should support continuity, not spectacle

---

## Density by Task

Density should vary by page purpose.

### Discovery

- spacious

### Planning

- balanced

### List management

- compact

This is intentional. The product should not use one density everywhere.

---

## Navigation

### Desktop

- hybrid structure
- left sidebar + stronger top bar presence

### Mobile

- hybrid structure
- bottom tabs for major sections
- deeper flows use standard stacked navigation

### Mobile bottom tabs

- Recipes
- Discover
- Meal Plan
- Shopping List
- More

### More menu

- Saved
- Profile
- Preferences
- Settings
- Help

---

## Product Tone and Guidance Style

### Home feeling

- discovery-first
- assistant-like second
- curated and calm
- helps users decide faster

### Assistant / guidance tone

- concierge-like first
- smart guide second
- never coach-like
- never pressure-inducing
- never guilt-based

Rule: **help the user decide, never pressure the user**.

### Personalization

- Discover / Home: more personalized
- Meal Plan / Shopping List: more neutral and structured

---

## Feedback Principles

### Action tone

- balanced
- clear
- elegant
- restrained

### Feedback rule

After meaningful actions, always communicate clearly.

Routine feedback should:

- auto-dismiss after a few seconds
- not require manual dismissal
- avoid lingering on screen unnecessarily

Use:

- toast for routine success/failure
- inline messaging for local issues
- stronger persistent messaging only when blocked or critical

### Success

- balanced clarity
- not celebratory by default
- bigger flows can get a more polished confirmation

### Errors

- local errors stay calm and helpful
- page-level or blocking errors become more visible
- always explain what happened and what the user can do next

### Destructive actions

- clear but calm
- noticeable enough to prevent mistakes
- not alarm-heavy by default

### Confirmations

- routine confirmations stay calm and light
- higher-risk confirmations get more explanation and stronger emphasis

---

## Form Principles

Forms should feel:

- structured
- supportive
- clearly labeled
- calm and easy to complete

Validation should be:

- specific
- helpful
- concise
- supportive, not scolding

Helper text should:

- stay restrained
- appear where useful
- reduce uncertainty without cluttering the UI

---

## Search and Filtering

### Search

Search is important but not dominant.

It should:

- be easy to reach
- not visually block content
- stay especially lightweight on mobile

### Desktop filtering

- hybrid model
- light top filters first
- advanced filters expandable

### Mobile filtering

- filter button opens bottom sheet / drawer

---

## Content and Imagery

### Food imagery

Food imagery should feel:

- curated editorial
- bright and clean
- intentional
- premium
- appetizing
- not noisy
- not messy

### Recipe cards

- image-first
- content should still feel structured
- actions stay lightweight
- cards should not feel like mini toolbars

### Recipe card actions

- balanced visibility
- image and content lead
- actions are secondary

---

## Typography

Typography should be:

- refined product typography
- readable first
- elegant in hierarchy
- premium through spacing and rhythm
- not overly editorial
- not flat admin UI

### Titles

- clear and refined

### Supporting text

- calm and concise

### CTA copy

- clear and refined
- calm, specific, never pushy

---

## State Design Rules

### Loading

- structured skeletons by default
- layout-preserving
- slightly richer in recipe/discovery areas

### Empty states

- assistant-like first
- helpful and elegant second
- clear next step
- calm and curated
- never pushy

### Empty search results

- calm explanation first
- fallback suggestions when helpful

### Offline / network states

- usually clear and calm
- more visible when important flows are blocked

### Selected / active states

- discovery/content selections stay calmer
- task/list/planner selections can be clearer

### Hover / press states

- content/discovery can feel a little richer
- task/list/planner interactions stay clearer and more practical

### Disabled / blocked states

- quiet by default
- blocked states should explain what is missing and what to do next

### Completed / just-added states

- routine updates stay calm
- bigger milestones and task additions can be slightly clearer

---

## Global Component Rules

### Buttons

Primary buttons:

- balanced hierarchy
- deep-neutral filled for important actions
- softer/tonal where the context is calmer

Secondary buttons:

- outline where clarity helps
- tonal or text-like in quieter contexts

Tertiary actions:

- usually text-like
- quiet button treatment when clarity needs it

### Icon buttons

- balanced and restrained by default
- important ones can be slightly stronger

### Inputs

- structured and clear by default
- selected search/discovery inputs can feel a bit more premium

### Filter chips

- mixed by context
- discovery/recipe chips can feel a bit more polished
- planning/list filters stay quieter

### Metadata / chips / badges

- recipe/discovery metadata can be slightly more expressive
- planning/list statuses stay quieter and more utilitarian

### Dialogs / modals / drawers

- refined utility by default
- some content-led moments can feel more premium

---

## Area-by-Area Behavior Summary

### Discover

- looser
- more personalized
- more inspirational
- more feed-like
- more assistant-like

### Recipes

- more structured
- more intentional
- still lightly guided
- not a cold catalog

### Recipe Detail

- immersive editorial
- premium
- elegant on both desktop and mobile
- strong continuation into more recipe discovery

### Meal Plan

- clean
- calm
- structured
- not dashboard-heavy

### Shopping List

- efficient first
- polished second
- structured
- not raw utility-only

### Saved

- curated personal collection
- premium
- personal
- intentional

### Profile / Settings

- structured
- calm
- practical
- still part of the same premium system

---

## Desktop Shell Behavior

### Left sidebar

- restrained and structured
- small amount of contextual content when useful
- should frame content, not dominate it

### Top bar

- more premium presence than a minimal utility bar
- still part of the restrained overall shell

### Section headers

- balanced and refined

### Content width

- wide app canvas on desktop

### Page spacing

- spacious overall on desktop

---

## Mobile Shell Behavior

### Top area / header

- structured and compact

### Bottom tabs

- balanced and clear
- icons only — no labels

### Active tab indication

- stronger icon state plus a subtle indicator/container
- still restrained overall

### Page spacing

- balanced mobile spacing overall

### Mobile recipe card rhythm

- Discover: more immersive
- Recipes / Saved: more balanced

---

## Motion and Transition Rules

### Major section transitions

- calm and refined

### Into recipe detail

- calm continuity

### Into task flows (Meal Plan, Shopping List)

- calm utility continuity

### Sticky behavior

- more helpful in planning/list/task areas
- lighter in discovery/recipe areas

### Horizontal scrolling

- avoid horizontal scrolling rows as a primary pattern in discovery areas

### Pagination / content loading

- infinite scroll is preferred almost everywhere

---

## Taxonomy and Information Strategy

### Categories

- discovery-led more than taxonomy-led
- browsing by mood and editorial curation first

### Dietary information

- important in filters and settings
- restrained visible metadata in recipe cards and lists

### Nutrition

- prominent on recipe detail pages

### Portion / serving controls

- prominent on recipe detail pages

### Ingredient list structure

- simple list — not overly subdivided

### Step presentation

- structured reading flow
- not fragmented

---

## Onboarding

### Onboarding flow

- guided but short
- do not create a long multi-screen funnel that delays access

### Visual style

- mostly refined and minimal
- a few stronger visual moments are allowed to introduce the product

### Content tone

- practical first
- lightly refined and encouraging second
- never pushy, never overwhelming

---

## AI Generation Rules

When AI generates Easy Meal pages or components:

### Global rules

- do not invent a new visual language
- keep desktop and mobile inside one consistent system
- preserve premium / practical / refined tone
- avoid childish, cluttered, or corporate UI

### Visual rules

- use a very light neutral base
- use deeper neutrals for emphasis
- keep color restrained
- use slightly rounded corners
- use moderate elevation
- let imagery, typography, spacing, and contrast carry the premium feel

### Layout rules

- Discover is looser and more personalized
- Recipes is more structured and intentional
- Meal Plan is calm and planner-like
- Shopping List is efficient but polished
- Saved is curated and personal
- Profile / Settings is structured and calm

### Interaction rules

- search is important but not dominant
- desktop filters are hybrid
- mobile filters open in a bottom sheet / drawer
- actions are balanced
- feedback must always be clear
- routine feedback should auto-dismiss

### Content rules

- recipe cards are image-first
- recipe detail is immersive editorial
- recipe actions stay secondary to content
- recipe results are grid-first
- avoid turning cards into action-heavy utility objects

### Tone rules

- assistance should feel concierge-like
- guidance should feel smart but calm
- never coach-like
- never guilt-inducing
- always reduce user effort without adding pressure

---

## One-Line Summary

Easy Meal should feel like a **premium, practical, refined, near-monochrome meal-planning and recipe product** with **editorial food presentation**, **structured but restrained product chrome**, **clear calm feedback**, and a **single consistent design language across desktop and mobile**, where **Recipes and Meal Planning are equally central**.
