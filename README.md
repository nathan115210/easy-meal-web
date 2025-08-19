<p align="center">
  <a href="#">
    <img src="./public/logo.svg" alt="Easy Meal Logo" width="120" />

  </a>
</p>

_Easy Meal_ is an open-source **Next.js** & **TypeScript** web app to help you discover recipes, plan your week, and generate shopping lists—effortlessly.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Tech Stack](#tech-stack)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

- **Smart Recipe Search** — Find recipes by ingredients, cuisine, or dietary needs.
- **Weekly Meal Planner & Reminders** — Plan your meals and get timely reminders.
- **One-Click Shopping Lists** — Instantly generate and export shopping lists.
- **Community Reviews & Tips** — Share feedback and cooking tips with others.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js `>= 14`
- npm or yarn

### Installation

```bash
git clone git@github.com:nathan115210/easy-meal-web.git
cd easy-meal-web
pnpm install
pnpm dev
```

### Running the Init Script for Database Setup
##TODO: remove - START

To compile & execute your TypeScript DB script with pnpm:

```
pnpm ts-node src/lib/database/mealsDb.ts
```

> - Troubleshhoting
> - For get error: `Error: Could not locate the bindings file. Tried:` Try below command:

```bash
rm -rf node_modules pnpm-lock.yaml database
pnpm install
npm rebuild better-sqlite3 --build-from-source
pnpm ts-node src/lib/database/mealsDb.ts
```
##TODO: remove - END


### working with Prisma ORM
1. shema file: `prisma/schema.prisma`
2. generate Prisma client: //TODO: create npm script for this
```bash
npx prisma db push
npx prisma generate
```
3. run migrations: //TODO: create npm script for this
```bash
npx prisma migrate dev --name init
```     
4. Visually browse/edit your data
```bash
npx prisma studio
```

### Running the App
```bash
pnpm install
pnpm dev
```


## TODO

- [ ] Add user authentication and profiles
- [ ] Integrate nutrition data for recipes
- [ ] Enable drag-and-drop meal planning
- [ ] Improve mobile responsiveness
- [ ] Add recipe import from external sources
- [ ] Write more unit and integration tests
- [ ] Enhance accessibility and ARIA support
- [ ] Update the README logo link with the actual prod URL
