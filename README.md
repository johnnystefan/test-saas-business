<p align="center">
  <h1 align="center">⚾ SaaS Business Platform</h1>
</p>

<p align="center">
  <strong>Multi-tenant SaaS platform for sports business management</strong><br>
  Starting with baseball academies — designed to scale to any sports academy, gym, or training center.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NX-22.6.3-blue.svg" alt="NX">
  <img src="https://img.shields.io/badge/TypeScript-6_beta-3178c6.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-19-61dafb.svg" alt="React">
  <img src="https://img.shields.io/badge/NestJS-11-e0234e.svg" alt="NestJS">
  <img src="https://img.shields.io/badge/Prisma-7-2d3748.svg" alt="Prisma">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
</p>

<p align="center">
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#development">Development</a> •
  <a href="#ai-development">AI Development</a>
</p>

---

## Architecture

This is an **NX monorepo** with a microservices backend and two frontend applications, following Clean Architecture + DDD principles.

```
apps/
├── admin/              → Admin Dashboard       (React 19 + Zustand + React Query)
├── customer/           → Customer App          (React 19 + Capacitor mobile)
├── api-gateway/        → BFF API Gateway       (NestJS — aggregates microservices)
├── auth-service/       → Auth & JWT            (NestJS + Prisma + PostgreSQL)
├── club-service/       → Club & Members        (NestJS + Prisma + PostgreSQL)
├── inventory-service/  → Equipment             (NestJS + Prisma + PostgreSQL)
├── booking-service/    → Reservations          (NestJS + WebSockets + Prisma)
└── finance-service/    → Payments & Reports    (NestJS + Stripe + Prisma)

libs/
├── shared/types/       → Zod schemas + TypeScript types
├── shared/utils/       → Pure utility functions
├── shared/ui/          → Design system components
├── auth/utils/         → JWT helpers
└── domain/[module]/    → Domain models per business unit
```

### Key Principles

- **`apps/`** — entry points only, no business logic
- **`libs/`** — all shared logic, types, UI components, domain models
- **Repository Pattern** — services never touch Prisma directly
- **DDD Entities** — rich classes with `create/fromPrimitives/toPrimitives`, no plain types
- **Value Objects** — all domain primitives wrapped with validation

---

## Tech Stack

| Layer              | Technology                     | Version    |
| ------------------ | ------------------------------ | ---------- |
| Monorepo           | NX                             | 22.6.3     |
| Language           | TypeScript                     | **6 beta** |
| Frontend           | React                          | 19         |
| Backend            | NestJS                         | 11         |
| ORM                | Prisma                         | 7          |
| Database           | PostgreSQL                     | 16+        |
| Client State       | Zustand                        | **5**      |
| Server State       | React Query (TanStack)         | latest     |
| Validation         | Zod                            | **4**      |
| Mobile             | Capacitor                      | latest     |
| Auth               | JWT + Refresh Tokens           | —          |
| Payments           | Stripe                         | latest     |
| Real-time          | WebSockets (NestJS Gateways)   | —          |
| Testing (frontend) | Vitest + React Testing Library | latest     |
| Testing (backend)  | Jest                           | latest     |
| Testing (E2E)      | Playwright                     | latest     |
| Package Manager    | pnpm                           | 10         |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 16+
- Docker (optional)

### Install

```bash
git clone https://github.com/johnnystefan/test-saas-business.git
cd test-saas-business
pnpm install
```

### Serve

```bash
pnpm nx serve admin          # Admin dashboard
pnpm nx serve customer       # Customer app
pnpm nx serve api-gateway    # BFF API Gateway
pnpm nx serve auth-service   # Auth microservice
pnpm nx serve club-service   # Club microservice
```

---

## Development

### Run tests

```bash
pnpm nx test [app-or-lib]
pnpm nx run-many --target=test --all
```

### Lint

```bash
pnpm nx lint [app-or-lib]
pnpm nx run-many --target=lint --all
```

### Build

```bash
pnpm nx build [app-or-lib]
```

### Generate

```bash
# New app
pnpm nx g @nx/react:app [name]
pnpm nx g @nx/nest:app [name]

# New lib
pnpm nx g @nx/js:lib libs/[name]
```

### Commit convention

```
<type>[scope]: <description>

Types:  feat | fix | docs | chore | perf | refactor | style | test
Scopes: admin | customer | api-gateway | auth | club | inventory | booking | finance | shared | infra
```

---

## Pre-commit Pipeline

Every commit runs automatically:

```
git commit
    │
    ├── 🔍 TruffleHog  → blocks verified secrets (real API tokens)
    │
    └── 🤖 GGA         → AI code review against GGA_RULES.md
```

Install TruffleHog:

```bash
brew install trufflehog
```

GGA ([Gentleman Guardian Angel](https://github.com/Gentleman-Programming/gentleman-guardian-angel)) is already configured via `.gga`.

---

## AI Development

This project is built **AI-first** with a full skills system for AI coding assistants.

### Setup skills

```bash
./skills/setup.sh
```

### How it works

Skills are structured instruction files that give AI assistants the context needed to write code following this project's patterns — DDD entities, NestJS architecture, React 19 patterns, testing conventions, and more.

Over **40 skills** are available covering: TypeScript, React 19, NestJS, DDD, TDD, design patterns, refactoring techniques, SOLID principles, and project-specific architecture.

See [`AGENTS.md`](./AGENTS.md) for the full skills reference.

---

## License

MIT
