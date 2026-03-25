# Easy Meal — Development Guide

This guide explains the internal architecture, data flow, GraphQL setup, caching, and development workflow for the \*
\*Easy Meal\*\* application.

If you're looking for installation instructions or general information, see **README.md**.

---

## Table of Contents

- [Easy Meal — Development Guide](#easy-meal--development-guide)
  - [Table of Contents](#table-of-contents)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Data Layer](#data-layer)
  - [Dummy Data](#dummy-data)
  - [Future DB Integration](#future-db-integration)
- [GraphQL API](#graphql-api)
  - [Why GraphQL?](#why-graphql)
  - [Schema Definition](#schema-definition)
    - [Types](#types)
    - [Queries](#queries)
  - [Resolvers](#resolvers)
  - [GraphQL Route Handler](#graphql-route-handler)
  - [Testing with GraphiQL](#testing-with-graphiql)
  - [Example Queries](#example-queries)
    - [Fetch all meals:](#fetch-all-meals)
    - [Fetch a single meal:](#fetch-a-single-meal)
  - [Adding New Fields](#adding-new-fields)
  - [Extending with Mutations](#extending-with-mutations)
- [🛰️ Data Fetching in Next.js](#️-data-fetching-in-nextjs)
  - [Direct fetch](#direct-fetch)
  - [Using apiFetchServer](#using-apifetchserver)
- [⚡ Caching \& Revalidation](#-caching--revalidation)
  - [ISR](#isr)
  - [Cache Tags](#cache-tags)
  - [Testing Tag Revalidation](#testing-tag-revalidation)
- [Conventions \& Best Practices](#conventions--best-practices)
- [Future Improvements](#future-improvements)

---

# Architecture Overview

```
React Server Components (UI)
↓
GraphQL Schema & Resolvers
↓
Data Layer (dummy JSON → DB later)
↓
Next.js ISR & caching
```

Key concepts:

- UI does **not** import data directly
- GraphQL acts as the source of truth for data contracts
- Dummy data can be replaced with database calls transparently
- Strong typing across all layers

---

# Folder Structure

```
src/
 ├── app/
 │    ├── all-meals/
 │    ├── api/
 │    │    └── graphql/
 │    │         └── route.ts
 │    └── layout.tsx
 │
 ├── lib/
 │    └── graphql/
 │         ├── schema.ts
 │         └── client.ts
 │
 ├── utils/
 │    ├── data/
 │    │    └── mealsData.ts
 │    └── types/
 │         └── meals.ts
 │
 ├── components/
 │    └── ...
 │
public/
 └── placeholder.png
```

---

# Data Layer

## Dummy Data

Stored in:

```
src/utils/data/mealsData.ts
```

Exports:

- `getMealsData()`
- `getMealBySlug()`

These act as the **data source abstraction**.

---

## Future DB Integration

Switch to PostgreSQL + Prisma (or Drizzle):

- Replace the repository functions only
- No need to change GraphQL schema or UI
- Caching & revalidation remain the same

---

# GraphQL API

## Why GraphQL?

- Precise field selection (no over-fetching)
- Strongly typed schemas
- Self-documenting API
- Perfect match for Server Components

---

## Schema Definition

Located at:

```
src/lib/graphql/schema.ts
```

### Types

```graphql
type Meal {
  title: String!
  slug: String!
  image: String!
  description: String!
  ingredients: [MealIngredient!]!
  instructions: [MealInstruction!]!
  creator: String!
  creator_email: String!
  category: [String!]
}
```

### Queries

```graphql
type Query {
  meals: [Meal!]!
  meal(slug: String!): Meal
}
```

---

## Resolvers

```ts
const resolvers = {
  Query: {
    meals: () => getMealsData(),
    meal: (_parent, args) => getMealBySlug(args.slug),
  },
};
```

---

## GraphQL Route Handler

```
src/app/api/graphql/route.ts
```

```ts
import { createYoga } from 'graphql-yoga';
import { schema } from '@/lib/graphql/schema';

const yogaApp = createYoga({
  schema,
  graphqlEndpoint: '/api/all-meals',
  graphiql: process.env.NODE_ENV !== 'production',
});

export { yogaApp as GET, yogaApp as POST };
```

---

## Testing with GraphiQL

Run:

```
pnpm dev
```

Then visit:

```
http://localhost:3000/api/all-meals
```

---

## Example Queries

### Fetch all meals:

```graphql
query {
  meals {
    title
    slug
    image
    description
  }
}
```

### Fetch a single meal:

```graphql
query ($slug: String!) {
  meal(slug: $slug) {
    title
    ingredients {
      text
      amount
    }
  }
}
```

---

## Adding New Fields

Steps:

1. Update TypeScript type
2. Update dummy data
3. Update GraphQL schema
4. Add resolver if needed

---

## Extending with Mutations

Add to the schema:

```graphql
type Mutation {
  createMeal(data: CreateMealInput!): Meal!
}
```

Add a resolver:

```ts
Mutation: {
  createMeal: (_parent, { data }) => {
    return createMealInDb(data);
  };
}
```

Add revalidation:

```ts
revalidateTag('meals:list', undefined);
```

---

# 🛰️ Data Fetching in Next.js

## Direct fetch

```ts
await fetch('/api/graphql', {
  method: 'POST',
  body: JSON.stringify({ query }),
});
```

---

## Using apiFetchServer

```ts
await apiFetchServer('/api/graphql', {
  method: 'POST',
  body: { query },
  revalidate: 60,
  tags: ['meals:list'],
});
```

Benefits:

- Base URL handled automatically
- Unified caching logic
- Cleaner API calls

---

# ⚡ Caching & Revalidation

## ISR

Fetch revalidation:

```ts
revalidate: 60;
```

Page refetches every 60 seconds.

---

## Cache Tags

Assign in fetch:

```ts
tags: ['meals:list'];
```

Invalidate:

```ts
revalidateTag('meals:list', undefined);
```

---

## Testing Tag Revalidation

1. Open `/all-meals`
2. Check server log: API hit
3. Refresh → cached
4. Call `/api/revalidate/meals`
5. Refresh → API hit again

---

# Conventions & Best Practices

- Keep schema as the main contract
- UI never imports data directly
- Prefer Server Components
- Use tags for invalidation
- Keep resolvers pure

---

# Future Improvements

- Add mutations
- Add filtering & pagination
- Add DB with Prisma
- Add unit tests for resolvers
- Add client-side GraphQL hooks

---
