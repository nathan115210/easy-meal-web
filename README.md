
<p align="center">
  <a href="#">
    <img src="./public/logo.svg" alt="Easy Meal Logo" width="120" />
  </a>
</p>

*Easy Meal* is an open-source **Next.js 16** & **TypeScript** web application designed to help you discover recipes,
plan weekly meals, and generate shopping lists—effortlessly.
It is optimized for **scalability**, **modern data fetching**, and **component-based architecture**.

---

## Table of Contents

* [Features](#features)
* [Getting Started](#getting-started)
* [Tech Stack](#tech-stack)
* [Project Architecture](#project-architecture)
* [GraphQL API](#graphql-api)
* [Caching Strategy](#caching-strategy)
* [Contributing](#contributing)
* [License](#license)
* [Acknowledgments](#acknowledgments)

For detailed engineering documentation, see:
📘 **Developer Guide → `docs/development-guide.md`**

---

## Features

* **Smart Recipe Search** — Find recipes by ingredients, cuisine, or dietary needs.
* **Weekly Meal Planner & Reminders** — Plan meals and get timely reminders.
* **One-Click Shopping Lists** — Instantly generate and export shopping lists.
* **Community Reviews & Tips** — Share feedback and cooking tips with others.

---

## 🛠️ Getting Started

### Prerequisites

* Node.js `>= 18`
* pnpm, npm, or yarn

### Installation

```bash
git clone git@github.com:nathan115210/easy-meal-web.git
cd easy-meal-web
pnpm install
pnpm dev
```

---

## 🧰 Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Framework  | **Next.js 16 (App Router)**      |
| Language   | **TypeScript**                   |
| API        | **GraphQL Yoga**                 |
| Rendering  | React Server Components          |
| Styling    | SCSS Modules / CSS               |
| Data Layer | Dummy JSON → PostgreSQL (future) |

---

## 🏛️ Project Architecture (High-Level)

```
UI (React Server Components)
↓
GraphQL Layer (schema + resolvers)
↓
Data Access Layer (dummy data → DB later)
```

Full architecture explained in
📘 `docs/development-guide.md`

---

## 🍽️ GraphQL API

The GraphQL endpoint is available at:

```
/api/graphql
```

Why GraphQL?

* Strong typing
* Partial field selection
* Great for server components
* Easy expansion as app grows

Example Query:

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

More examples in the Developer Guide.

---

## ⚡ Caching Strategy

Easy Meal uses:

* **Next.js Fetch Cache**
* **Incremental Static Regeneration (ISR)**
* **Tag-based invalidation via `revalidateTag()`**

Example:

```ts
apiFetchServer('/api/graphql', {
  revalidate: 60,
  tags: ['meals:list'],
});
```

This ensures fast loading and fresh data when meals are added or updated.

---

## 🤝 Contributing

Contributions are welcome!
Feel free to open issues or pull requests.

---

## 📄 License

MIT License © Nathan115210

---

## 🌟 Acknowledgments

Thanks to the open-source community for tools such as:

* Next.js
* React
* GraphQL Yoga
* TypeScript

---