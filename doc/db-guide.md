# Database & Prisma Guide

This document explains how the database works in this project, how the Prisma schema is used, and how to use the
provided npm scripts in day-to-day development.

## Overview

- Database: PostgreSQL (running locally in Docker, container name `easy-meal-postgres`)
- ORM: Prisma 7
- App framework: Next.js 16 (App Router)
- Usage pattern:
  - Schema defined in `prisma/schema.prisma`
  - Migrations stored in `prisma/migrations`
  - Prisma Client generated into `prisma/generated/prisma`
    - Shared Prisma client singleton in `src/utils/lib/prisma.ts`
    - Seed data in `prisma/seed.ts`

Environment variable (in `.env`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/easy_meal"
```

---

## Prisma schema: how it’s used

`prisma/schema.prisma` defines the DB structure and is the single source of truth for:

- Models: `Meal`, `Ingredient`, `InstructionItem`
- Enum: `MealType` (values: `breakfast`, `lunch`, `dinner`, `snacks`, `dessert`, `drinks`)
- Relations:
  - One `Meal` → many `Ingredient`
  - One `Meal` → many `InstructionItem`
- Array fields:
  - `Meal.mealType: MealType[]` (e.g. `["breakfast"]`, `["dinner","snacks"]`)
  - `Meal.tags: String[]` (e.g. `["quick","high-protein"]`)
- Nutrition fields on `Meal`:
  - `calories`, `protein`, `carbs`, `fat` as `Int`

Client generation & output:

```prisma
generator client {
  provider = "prisma-client"
  output = "./generated/prisma"
}
```

This emits the Prisma Client into:

```
prisma/generated/prisma
```

Client usage pattern:

- Import the generated client in `src/utils/lib/prisma.ts`
- Expose a singleton (reuse in dev to avoid multiple connections)
- Use `prisma` only in server-side code:
  - Route handlers (`app/api/**/route.ts`)
  - Server components / server helpers (e.g. `getMealsData`)
  - Seed script (`prisma/seed.ts`)

---

## NPM scripts

The following scripts are defined in `package.json` and are the main entry points for DB / Prisma tasks:

```jsonc
"db:start": "docker start easy-meal-postgres || docker ps",
"db:stop": "docker stop easy-meal-postgres || docker ps",
"db:generate": "prisma generate",
"db:migrate": "prisma migrate dev",
"db:studio": "prisma studio",
"db:format": "prisma format",
"db:seed": "npx prisma db seed",
"db:reset": "prisma migrate reset"
```

### `db:start`

Start the local Postgres Docker container.

```bash
pnpm run db:start
```

Use this before running `pnpm dev`.

### `db:stop`

Stop the Postgres container.

```bash
pnpm run db:stop
```

Use this when you’re done working.

### `db:generate`

Generate Prisma Client from the current schema.

```bash
pnpm run db:generate
```

Use when:

- You change `prisma/schema.prisma` (models/enums).
- You’ve re-installed `node_modules`.

### `db:migrate`

Create and apply a dev migration for schema changes.

```bash
pnpm run db:migrate
```

Typical workflow after editing `schema.prisma`:

```bash
pnpm run db:format
pnpm run db:migrate
pnpm run db:generate
```

### `db:studio`

Open Prisma Studio (web UI) for inspecting/editing DB data.

```bash
pnpm run db:studio
```

### `db:format`

Format `schema.prisma`.

```bash
pnpm run db:format
```

Use after schema edits or before committing.

### `db:seed`

Run the seed script (`prisma/seed.ts`) to populate initial meals/ingredients/instructions.

```bash
pnpm run db:seed
```

Use after migrating or resetting the DB.

### `db:reset`

Hard reset of the database (dev only):

```bash
pnpm run db:reset
```

- Drops and recreates the DB schema
- Re-applies all migrations
- Optionally runs the seed

Use this when local data/schema is messed up and you want a clean slate. Do not run against production.

---

## Typical local workflow

First time / fresh environment:

```bash
pnpm run db:start      # start Postgres in Docker
pnpm run db:migrate    # apply schema to DB
pnpm run db:seed       # insert initial meals
pnm run dev           # start Next.js dev server
```

After changing `schema.prisma`:

```bash
pnpm run db:format
pnpm run db:migrate
pnpm run db:generate
pnpm run db:seed       # if your changes affect seed data
```

If the local DB is broken / out of sync:

```bash
pnpm run db:reset
pnpm run db:seed
```

---

## Project-specific schema & config notes

### `prisma/schema.prisma` (models & enums present)

- Models defined include (based on repository context):
  - `Meal` — core entity with fields like `id`, `title`, `image`, `description`, and `instructions`.
    - `Ingredient` — normalized entity related to `Meal` via a foreign key, representing each ingredient as a
      separate row.
    - `InstructionItem` — (if present) represents individual steps or instructions, related to `Meal`.
- Enums:
  - `MealType` — when used, supports filtering via GraphQL and smart search (values commonly: `breakfast`, `lunch`,
    `dinner`, `snacks`, `dessert`, `drinks`).
- Migrations:
  - See `prisma/migrations/*/migration.sql` for the exact evolution (e.g., adding nutrition fields, adjusting
    related tables). Use these files to understand current column shapes.

> Note: Ingredients are now normalized into a separate `Ingredient` table and related to `Meal` via a foreign key. Each
> ingredient is stored as a separate row, not as a JSON array on the `Meal` model.

### `prisma.config.ts` (adapter & generation specifics)

- The project uses a Prisma config file to centralize settings. Typical patterns include:
  - Adapter: `@prisma/adapter-pg` for PostgreSQL, constructed from `process.env.DATABASE_URL`.
  - Client output: generated into `prisma/generated/prisma` (as configured in the generator block).
    - Logging: enable `['query','error','warn']` in development for better visibility.

Example aspects (not full code):

- Create a single PrismaClient instance with the PG adapter, exported from `src/utils/lib/prisma.ts`.
- Reuse the client in development (`globalThis.prisma`) to avoid connection storms.
- Only import and use this client in server-side contexts (API routes, server components, seeds).

---

## Troubleshooting

- `P1001: Can't reach database server`
  - Verify the DB is running and `DATABASE_URL` is correct.
  - For Docker: run `pnpm run db:start` and check `docker ps`.

- `@prisma/client did not initialize yet`
  - Run `pnpm run db:generate`.
  - Ensure the import path is correct and generation completed successfully.

- Migration errors
  - Inspect migration SQL under `prisma/migrations/*/migration.sql`.
  - Check for incompatible changes (e.g., required fields without defaults).

---

For questions or updates, see `prisma.config.ts`, `prisma/schema.prisma`, and the seed script in `prisma/seed.ts`.
Ensure the database is reachable before running migrations or seeds.
