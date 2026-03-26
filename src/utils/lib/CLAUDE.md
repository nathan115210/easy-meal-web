# Utility Library Rules

This directory contains reusable non-UI code, but it is not only pure helpers. It also contains GraphQL schema/query strings, environment helpers, and the Prisma client singleton. Respect those boundaries.

## Current Structure

- Pure helper functions live here and should stay small and testable.
- GraphQL assets live under `graphql/fragments`, `graphql/queries`, and `graphql/schemas`.
- `prisma.ts` is server-only infrastructure.
- Data access that calls Prisma belongs in `src/utils/data-server`, not in generic helpers.

## Utility Design

- Prefer pure functions where possible.
- Keep helpers small, explicit, and easy to test.
- Avoid hidden side effects.
- Prefer narrow responsibilities over catch-all helpers.

## TypeScript And Contracts

- Keep function signatures clear and well typed.
- Avoid overly generic abstractions unless they provide real reuse value.
- Prefer predictable inputs and outputs.
- When changing GraphQL contracts, update schema strings, query documents, helper payload types, and UI/domain types together.

## Boundaries

- Do not import React here unless there is a strong and explicit reason.
- Avoid mixing browser-only assumptions into generic utilities unless the file is clearly browser-specific.
- Do not import the Prisma client into client-side code.
- Keep domain logic separated from formatting-only helpers.
- Treat GraphQL fragments and queries as string assets, not runtime resolver logic.

## Testing

- Add or update unit tests when nontrivial utility behavior changes.
- Test edge cases for parsing, transformation, mapping, and fallback behavior.

## Review Expectations

- Check purity, type safety, naming clarity, GraphQL contract sync, and edge-case handling.
