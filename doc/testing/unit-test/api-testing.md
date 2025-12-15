# API Testing Guide – Vitest + MSW (GraphQL)

This document explains **how API-level unit tests are set up** in the Easy Meal project using:

- **Vitest** (test runner)
- **MSW** (Mock Service Worker) for **mocking GraphQL APIs**
- Our GraphQL client helpers (e.g. `graphqlFetchClient`, `fetchMealsData`)

It is written as an onboarding reference for future developers.

---

## 1. High-level architecture

In this project we **do not** unit-test the Next.js route file (`/api/all-meals`) directly.

Instead, we test:

1. **API client helpers** (e.g. `fetchMealsData`):
   - They call the GraphQL endpoint (e.g. `/api/all-meals`) using `graphqlFetchClient`.
   - They attach the correct GraphQL query and variables.
   - They parse the response into correct TypeScript types.

2. **GraphQL API behavior** via **MSW mock handlers**:
   - MSW intercepts HTTP calls to the GraphQL endpoint used in tests.
   - We use `graphql.link('/api/all-meals')` to simulate a GraphQL server for that endpoint.
   - Handlers return **mocked data** in the same shape as the real API.

Graphically:

```text
Unit test
  └─ uses fetchMealsData()
      └─ uses graphqlFetchClient()
          └─ POST /api/all-meals (with { query, variables })
              └─ intercepted by MSW graphql.link('/api/all-meals')
                  └─ returns mocked GraphQL JSON: { data: { ... } }
```

This gives us:

- Confidence that our **client code + types** are correct.
- Stable tests that do **not** touch real Prisma/PostgreSQL.
- A clean way to extend mocks when new GraphQL operations are added.

---

## 2. File & folder structure

The MSW setup for **unit tests** in this repo is located under `src/utils/test/unit-test/msw`:

```txt
src/utils/test/unit-test/msw/
  mswServer.ts           # MSW server instance (Node)
  mocks/
    mockHandlers.ts      # Aggregates mock handler sets
    allMealsHandlers.ts  # GraphQL handlers for /api/all-meals (example)
```

Related test infra (examples of where tests and helpers live in this repo):

- `vitest.setup.ts` – global setup for Vitest (RTL, fetch, MSW, etc.)
- `src/utils/data-server/fetchMealsData.ts` – main API helper we test
- `src/utils/data-server/fetchMealsData.spec.ts` – unit tests for `fetchMealsData`
- `src/utils/data-server/graphqlFetchClient.ts` – generic GraphQL client
- `src/utils/types/meals.ts` – domain types (`Meal`, `MealsListItem`, `MealType`, etc.)
- `src/utils/lib/graphql/queries/meals-queries.ts` – GraphQL queries (`ALL_MEALS_QUERY`)

> Note: the paths above reflect the current repository layout. If your project changes folder layout, update these
> references accordingly.

---

## 3. Vitest global setup (`vitest.setup.ts`)

### 3.1 Purpose

`vitest.setup.ts` is executed before any tests. It:

- Brings in _testing-library_ matchers (`toBeInTheDocument`, etc.).
- Provides `fetch` in the JSDOM environment.
- Mocks Next.js UI/routing modules for React component tests.
- Boots **MSW server** so API calls are intercepted in tests.

### 3.2 Example (simplified view)

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import 'whatwg-fetch';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { mswServer } from '@/utils/test/unit-test/msw/mswServer';

// --- MSW server lifecycle ---
beforeAll(() => mswServer.listen({ onUnhandledRequest: 'warn' }));

afterEach(() => {
  mswServer.resetHandlers();
  cleanup();
});

afterAll(() => mswServer.close());
```

Key points:

- `mswServer.listen()` starts the MSW server before tests.
- `mswServer.resetHandlers()` ensures each test starts with a clean handler state.
- `onUnhandledRequest: 'warn'` will warn if a test hits an unmocked endpoint.

---

## 4. MSW server (`src/utils/test/unit-test/msw/mswServer.ts`)

The MSW server is responsible for holding all HTTP/GraphQL handlers:

```ts
import { setupServer } from 'msw/node';
import { mockHandlers } from './mocks/mockHandlers';

export const mswServer = setupServer(...mockHandlers);
```

This file:

- Imports an aggregated `mockHandlers` array.
- Sets up a Node-based MSW server (`setupServer`) for Vitest.

---

## 5. Handlers aggregator (`src/utils/test/unit-test/msw/mocks/mockHandlers.ts`)

We aggregate handler sets in one place:

```ts
import { allMealsHandlers } from '@/utils/test/unit-test/msw/mocks/allMealsHandlers';

export const mockHandlers = [
  ...allMealsHandlers,
  // future: ...authHandlers, ...plannerHandlers, ...
];
```

This makes it easy to add new domains:

- `allMealsHandlers` – GraphQL mocks for meals queries.
- later, e.g. `authHandlers`, `plannerHandlers`, etc.

---

## 6. GraphQL handlers for `/api/all-meals` (`allMealsHandlers.ts`)

### 6.1 Purpose

`allMealsHandlers.ts` mocks the GraphQL endpoint `/api/all-meals`. It:

- Defines a small set of **mock `Meal` data**.
- Exposes GraphQL handlers for:
  - `query AllMeals(...)` – fetch paginated meals list.
  - `query Meal($slug)` – fetch a single meal by slug.

- Mirrors **real schema behavior**: search, meal type filter, cook time range, pagination.

### 6.2 Mock data

We use full `Meal`-shaped objects in the mock dataset:

```ts
// src/utils/test/unit-test/msw/mocks/allMealsHandlers.ts (partial)
import { graphql, HttpResponse } from 'msw';
import { DifficultyLevel, MealType } from '@/utils/types/meals';
import type { MealsListItem } from '@/app/meals/page';

const mockAllMeals = [
  {
    slug: 'spicy-chicken-bowl',
    title: 'Spicy Chicken Bowl',
    image: '/images/mock/spicy-chicken-bowl.jpg',
    description: 'A quick high-protein spicy chicken rice bowl.',
    ingredients: [
      { text: 'Chicken breast', amount: '200g' },
      { text: 'Rice', amount: '150g' },
    ],
    instructions: [
      { step: 1, text: 'Cook the rice.' },
      { step: 2, text: 'Stir-fry chicken with spices.' },
    ],
    mealType: [MealType.Dinner],
    cookTime: 20,
    tags: ['high-protein', 'spicy'],
    difficulty: DifficultyLevel.Easy,
    nutritionInfo: {
      calories: 650,
      protein: 45,
      carbs: 70,
      fat: 15,
    },
  },
  // ... other mock meals
];
```

> Note: the `mockAllMeals` dataset is intentionally simplified in this guide. In the repo the mock data is typed and
> more complete.

### 6.3 Helper: `Meal` → `MealsListItem`

The API for the `/meals` page only needs a subset of fields (`MealsListItem`). We downcast full `Meal` to
`MealsListItem` before returning:

```ts
function toMealsListItem(meal) {
  const {
    title,
    slug,
    description,
    image,
    cookTime,
    mealType,
    topTags,
    difficulty,
    nutritionInfo,
  } = meal;

  return {
    title,
    slug,
    description,
    image,
    cookTime,
    mealType,
    topTags,
    difficulty,
    nutritionInfo,
  };
}
```

### 6.4 GraphQL link and types

We scope our GraphQL handlers to the Yoga endpoint:

```ts
const api = graphql.link('/api/all-meals');

// Example types used in the handlers
// type AllMealsQueryVariables = { ... }
// type AllMealsQueryResult = { meals: { items: MealsListItem[]; total: number; hasMore: boolean } };
```

### 6.5 `AllMeals` query handler

This handler matches the real GraphQL query and performs filtering + pagination similar to server resolvers:

```ts
export const allMealsHandlers = [
  api.query('AllMeals', ({ variables }) => {
    const { search, mealType, cookTimeMin, cookTimeMax, limit, offset } = variables ?? {};

    let filteredMeals = [...mockAllMeals];

    // 1) Search filter (title + description)
    if (search) {
      const q = search.toLowerCase();
      filteredMeals = filteredMeals.filter(
        (meal) => meal.title.toLowerCase().includes(q) || meal.description.toLowerCase().includes(q)
      );
    }

    // 2) MealType filter
    if (mealType && mealType.length > 0) {
      filteredMeals = filteredMeals.filter(
        (meal) =>
          Array.isArray(meal.mealType) && meal.mealType.some((item) => mealType.includes(item))
      );
    }

    // 3) CookTime bounds (min and/or max)
    if (cookTimeMin != null || cookTimeMax != null) {
      filteredMeals = filteredMeals.filter((meal) => {
        if (meal.cookTime == null) return false;
        if (cookTimeMin != null && meal.cookTime < cookTimeMin) return false;
        if (cookTimeMax != null && meal.cookTime > cookTimeMax) return false;
        return true;
      });
    }

    // 4) Pagination: limit + offset
    const pageSize = limit ?? 8;
    const pageOffset = offset ?? 0;
    const total = filteredMeals.length;

    const pageSlice = filteredMeals.slice(pageOffset, pageOffset + pageSize);
    const items = pageSlice.map(toMealsListItem);
    const hasMore = pageOffset + pageSize < total;

    return HttpResponse.json({
      data: {
        meals: {
          items,
          total,
          hasMore,
        },
      },
    });
  }),
  // ...
];
```

Key points:

- Operation name **must** match the query name: `'AllMeals'`.
- Variables are **flat** (not nested in `filter` / `pagination`) because that’s how the real query is defined.
- Filtering & pagination logic intentionally mirrors real resolvers so tests reflect realistic behavior.

---

## 7. GraphQL client (`graphqlFetchClient.ts`)

This is a generic HTTP client for GraphQL:

```ts
import { GraphQLResponse } from '@/utils/data-server/fetchGraphQL';

export async function graphqlFetchClient(apiEndPoint, query, variables, signal) {
  const res = await fetch(apiEndPoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`${apiEndPoint} - GraphQL network error ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  if (!json.data) {
    throw new Error(`${apiEndPoint} - GraphQL client: data is null`);
  }

  return json.data;
}
```

In tests:

- This function is **not mocked**.
- It does a real `fetch`, which is intercepted by MSW and served mock JSON.

---

## 8. API helper under test (`fetchMealsData.ts`)

This helper applies domain-specific behavior (page size, cook time mapping):

```ts
import { CookTimeValue, MealType } from '@/utils/types/meals';
import { graphqlFetchClient } from '@/utils/data-server/graphqlFetchClient';
import { ALL_MEALS_QUERY } from '@/utils/lib/graphql/queries/meals-queries';
import { mapCookTimeToBounds } from '@/utils/lib/helpers';

const PAGE_SIZE = 8;

async function fetchMealsData({
  pageParam = 0,
  search,
  mealType,
  cookTime,
  signal,
  limit = PAGE_SIZE,
} = {}) {
  const { cookTimeMin, cookTimeMax } = mapCookTimeToBounds(cookTime);

  const data = await graphqlFetchClient(
    '/api/all-meals',
    ALL_MEALS_QUERY,
    {
      search,
      mealType,
      cookTimeMin,
      cookTimeMax,
      limit,
      offset: pageParam,
    },
    signal
  );

  return data.meals;
}

export default fetchMealsData;
```

This function is the **main API unit test target**.

---

## 9. Unit tests for `fetchMealsData` (`fetchMealsData.spec.ts`)

The tests verify:

- Basic list fetching.
- Search filter.
- Pagination (limit & offset).
- Cook time filters (using `CookTimeValue`).
- Meal type filters.

Example:

```ts
import { describe, it, expect } from 'vitest';
import fetchMealsData from './fetchMealsData';
import { CookTimeValue, MealType } from '@/utils/types/meals';

describe('fetchMealsData', () => {
  const createSignal = () => new AbortController().signal;

  it('fetches the first page of meals', async () => {
    const result = await fetchMealsData({ signal: createSignal() });

    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result.total).toBe(result.items.length);
    expect(result.hasMore).toBe(false);
    expect(result.items[0].slug).toBe('spicy-chicken-bowl');
  });

  it('applies search filter via search variable', async () => {
    const result = await fetchMealsData({ signal: createSignal(), search: 'pasta' });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('veggie-pasta');
    expect(result.total).toBe(1);
    expect(result.hasMore).toBe(false);
  });

  it('applies pagination via limit & pageParam (offset)', async () => {
    const page1 = await fetchMealsData({ signal: createSignal(), limit: 2, pageParam: 0 });

    const page2 = await fetchMealsData({ signal: createSignal(), limit: 2, pageParam: 2 });

    expect(page1.items).toHaveLength(2);
    expect(page1.hasMore).toBe(true);

    expect(page2.items.length).toBeGreaterThanOrEqual(1);
    expect(page2.items[0].slug).not.toBe(page1.items[0].slug);
  });
});
```

Run the unit tests with your package script (example):

```bash
pnpm run test:unit
```

This will:

- Spin up MSW.
- Intercept GraphQL requests to `/api/all-meals`.
- Return mock data based on the handler logic.
- Validate that `fetchMealsData` correctly wires variables and interprets responses.

---

## 10. How to add a new GraphQL API mock

When adding a new GraphQL query/mutation:

1. **Define your real query** in `queries/*.ts`, including operation name and variables.

2. In **MSW**:
   - Add new mock data as needed.
   - Add a new handler using `api.query` or `api.mutation`:

     ```ts
     api.query('OperationName', ({ variables }) => {
       // read variables, filter fake data, return HttpResponse.json({ data: { ... } })
     });
     ```

3. **Add tests** for the helper or hook that uses this query:
   - Do not mock `graphqlFetchClient`.
   - Let MSW respond and assert on the typed result.

4. If needed, add your handler set into `mockHandlers.ts`:

   ```ts
   import { someFeatureHandlers } from './someFeatureHandlers';

   export const mockHandlers = [...allMealsHandlers, ...someFeatureHandlers];
   ```

---

## 11. Mental model summary

- **Vitest** runs tests in a Node + JSDOM environment, with global `fetch` and RTL.
- **MSW** acts as a **fake GraphQL server**:
  - All `fetch('/api/all-meals', { method: 'POST', body: { query, variables } })` calls are intercepted.
  - Handlers are defined via `graphql.link('/api/all-meals')`.
  - Handlers read `variables`, filter in-memory `mockAllMeals`, and return GraphQL-shaped JSON.

- **We test the real data helpers** (`fetchMealsData`, etc.), not synthetic ones:
  - If query/variable wiring changes, tests will fail.
  - If schema shape changes (fields, operation names), we update handlers + tests together.

This pattern gives a strong balance of:

- Realism (full GraphQL request/response).
- Speed (no DB).
- Maintainability (mocks colocated with domain types and queries).

---
