# API Rules

This directory contains thin GraphQL Yoga route handlers. Keep routing minimal and put schema, resolver, and data logic in the existing supporting layers.

## Current Structure

- Route handlers in this directory are small wrappers around `createYoga(...)`.
- The main schemas live in `src/utils/lib/graphql/schemas`.
- Server data access lives in `src/utils/data-server`.
- The current endpoints are split by use case:
  - `/api/all-meals` for paginated/filterable meal lists
  - `/api/meal` for single-meal lookup

## API And GraphQL Conventions

- Keep route files thin. Prefer changing schema and resolver logic in the GraphQL schema files, not in the route handler.
- Keep API contracts explicit and stable.
- Update GraphQL schema strings, exported TypeScript input types, query documents, and client payload types together.
- The filtering behavior in `meals-schema.ts` is the canonical implementation for search, difficulty, tags, calorie, ingredient, and meal-type filtering.
- Keep data shape transformations explicit. Do not hide them in route-handler glue code.

## Boundaries

- Avoid coupling API code to UI concerns.
- Keep transport concerns separate from data access and transformation logic.
- Use `src/utils/data-server` for Prisma-backed reads instead of querying directly from the route file.
- Do not assume a single `/api/graphql` endpoint; the project currently uses separate Yoga endpoints.

## Error Handling

- Return safe, user-appropriate errors.
- Do not expose stack traces, internal identifiers, or sensitive implementation details.
- Preserve existing behavior in `graphqlFetchClient` expectations: network failures, GraphQL errors, and null data should remain explicit.

## Testing And Review

- When API behavior changes, update or add tests using the existing Vitest + MSW GraphQL pattern.
- Prefer testing client helpers and mocked GraphQL behavior over unit-testing route files directly.
- In review, check schema/query/type sync, response-shape compatibility, and resolver edge cases.
