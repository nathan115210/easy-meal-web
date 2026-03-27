# Easy Meal Page Patterns

## Purpose

This document defines page-level structure and behavioral patterns for Easy Meal across desktop and mobile.

---

## Discover

### Role

Discover is the looser, more personalized, more inspirational side of the product.

### Desktop pattern

- curated feed with light sectioning
- soft section breaks
- flowing and browseable
- not dashboard-heavy

### Mobile pattern

- mostly continuous feed
- stronger curated block near the top
- still feed-first

### Tone

- discovery-first
- assistant-like second
- calm and curated

### Layout rules

- Discover should feel looser than Recipes
- avoid heavy boxing and rigid section panels
- avoid horizontal scrolling rows as a primary pattern
- infinite scroll is acceptable and preferred here

---

## Recipes

### Role

Recipes is the structured browse destination.

### Desktop pattern

- top search/filter area
- curated sections near the top
- grid results below
- layered and intentional

### Mobile pattern

- compact search/filter area at top
- a few curated blocks
- main recipe feed below
- scroll-friendly but still guided

### Browsing model

- hybrid browse + guidance
- recipe results are grid-first
- stronger organization than Discover

### Section behavior

- Recipes should feel more grouped and more intentional than Discover
- still airy and refined
- not a raw utility catalog

---

## Recipe Detail

### Role

Recipe Detail is the immersive editorial center of the product.

### Desktop pattern

- large visual hero
- generous spacing
- premium reading flow
- strong end-of-page continuation

### Mobile pattern

- also immersive
- should not be reduced to a tiny utility page
- should remain scroll-worthy

### Action placement

- primary actions near the top
- some context-specific actions in relevant sections
- primary emphasis can shift by entry context, but the layout should remain consistent

### Detail sections

- ingredients: simple ingredient list
- steps: structured reading flow
- nutrition: prominent
- secondary sections: mixed; utility sections stay restrained, editorial/supportive sections can feel richer
- related recipes: editorial continuation

### Long-page navigation

- light anchor help by default for longer pages
- stronger help only when a recipe becomes especially long or content-rich

---

## Cooking Mode

### Role

Cooking Mode is a simplified focus view for following recipe steps.

### Global behavior

- simple and straightforward
- text-only guidance
- calm guided mode

### Mobile pattern

- bottom-sheet guided mode

### Desktop pattern

- large dialog / lightbox

---

## Meal Plan

### Role

Meal Plan is the planning center. It should feel calm, clear, and structured.

### Desktop pattern

- clean weekly planner
- easy week overview
- not panel-heavy
- editing uses a side panel

### Mobile pattern

- card-based weekly summary
- compact but easy to scan
- editing uses a bottom sheet

### Add to Meal Plan behavior

- very quick action by default

### Planner visual rule

- planner grid stays clear and structured
- selected meal entries can add a bit of visual richness
- do not let the planner become cluttered or admin-heavy

---

## Shopping List

### Role

Shopping List is execution-focused: efficient first, polished second.

### Desktop pattern

- mostly grouped main list
- light supporting panel or summary area when useful

### Mobile pattern

- compact core list
- grouped and polished

### Item rows

- desktop rows can be more spacious than typical utility apps
- mobile remains compact at the core

### Group headers

- desktop: premium and spacious
- mobile: practical with some polish

### Generation flow

- immediate by default
- lightweight review/options when useful
- generation review/options appear in a bottom sheet

---

## Saved

### Role

Saved is a curated personal library, not a bookmark dump.

### Global pattern

- curated collections first
- premium and personal
- visual-first collection identity

### Collection pages

- curated collection pages
- still structured and practical enough to browse/manage easily

### Collection headers

- refined/curated by default
- selected collections can have slightly stronger visual treatment

### Save behavior

- quick save by default
- optional save-to-collection when useful

---

## Profile / Settings

### Role

Profile / Settings should feel calm, structured, and clearly part of the same product system.

### Entry pattern

- calm account home
- profile-led top section
- elegantly grouped settings below

### Organization

- profile-first
- practical and clear
- not a separate admin-feeling zone

---

## Home Behavior

### Desktop home

- feed-like discovery page
- curated flow rather than hero-led campaign layout

### Mobile home

- same feed-first idea as desktop
- tighter and more mobile-optimized
- should support long, smooth browsing

### Guidance rule

- discovery-first
- assistant-like second
- calm and curated

---

## Desktop vs Mobile Rules

### Desktop

- wider canvas
- spacious overall spacing
- more structure visible at once
- suitable for planner overview and richer shell framing

### Mobile

- balanced spacing overall
- same visual system
- tighter vertically where necessary
- discovery remains feed-led
- utility flows use bottom sheets often

---

## Consistency Rule

All pages should feel like the same product.

Differences between pages should come from:

- density
- layout behavior
- level of personalization
- content emphasis

They should not come from changing the visual language itself.
