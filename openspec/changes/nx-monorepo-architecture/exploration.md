# Exploration: NX Monorepo Architecture

**Change:** `nx-monorepo-architecture`
**Status:** Completed
**Date:** 2026-03-27

---

## Current State

The project is a greenfield NX monorepo with no apps or libs created yet. The `AGENTS.md` and `openspec/config.yaml` define the intended architecture. We have:

- Proposed apps: `admin`, `customer`, `api-gateway`, `auth-service`, `club-service`, `inventory-service`, `booking-service`, `finance-service`
- Proposed libs: `shared/types`, `shared/utils`, `shared/ui`, `auth/utils`, `domain/[module]`
- Stack: React 19, NestJS, PostgreSQL, Prisma, Zod 4, Zustand 5, Capacitor, JWT+RBAC, Stripe, WebSockets, TypeScript 6

---

## 1. App Layer Analysis

### Proposed Apps (validated and expanded)

| App | Type | Platform | Notes |
|-----|------|----------|-------|
| `admin` | Frontend | Web only | React 19 + Zustand + React Query |
| `customer` | Frontend | Web + Mobile | React 19 + Capacitor |
| `api-gateway` | Backend BFF | Node/NestJS | Routes and aggregates for customer app |
| `admin-gateway` | Backend BFF | Node/NestJS | **NEW** — separate BFF for admin dashboard |
| `auth-service` | Backend | Node/NestJS | JWT, refresh tokens, RBAC, user management |
| `club-service` | Backend | Node/NestJS | Students, coaches, attendance, monthly fees |
| `inventory-service` | Backend | Node/NestJS | Stock, POS sales, purchase history |
| `booking-service` | Backend | Node/NestJS | Slot reservations, WebSockets for live availability |
| `finance-service` | Backend | Node/NestJS | Consolidated reporting, KPIs, cash flow |

**Decision: Split into two BFFs** (`api-gateway` for customer, `admin-gateway` for admin).

Rationale:
- Customer app needs: bookings, payments, plans, personal history — small surface area
- Admin dashboard needs: everything from all services + aggregated reports + user management
- Sharing one BFF would create a bloated gateway with authorization leakage (admin endpoints visible to customer token issuers)
- Each BFF can have its own rate limiting, response shaping, and auth middleware profile

**WebSockets needed in:**
- `booking-service` — real-time slot availability
- `api-gateway` — proxies WebSocket to booking-service for customer app
- `admin-gateway` — proxies WebSocket for live dashboard (reservations, sales, attendance)

**Capacitor needed in:**
- `customer` only — wraps the React web app for iOS/Android

---

## 2. Library Layer Design

```
libs/
├── shared/
│   ├── types/          # Zod schemas → TypeScript types (SINGLE SOURCE OF TRUTH)
│   ├── utils/          # Pure utility functions (dates, formatters, validators)
│   ├── ui/             # Design system: atoms, molecules (React components)
│   └── constants/      # App-wide constants (ROLES, STATUS maps, etc.)
├── auth/
│   └── utils/          # JWT helpers, token decode, permission checks
├── api/
│   └── client/         # Typed HTTP client (axios wrapper with Zod validation)
├── domain/
│   ├── club/           # Club domain interfaces and value objects
│   ├── inventory/      # Inventory domain interfaces
│   ├── booking/        # Booking domain interfaces + slot logic
│   └── finance/        # Finance domain interfaces + calculation logic
├── testing/
│   └── utils/          # Shared test helpers, mock factories, fixtures
└── config/
    └── env/            # Environment schema (Zod) + config loader
```

### Key Decisions

**`libs/shared/types/` is the SINGLE source of truth for all types:**
```typescript
// libs/shared/types/src/booking.ts
import { z } from "zod/v4";

export const SlotSchema = z.object({
  id: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  available: z.boolean(),
  tenantId: z.string().uuid(),
});

export type Slot = z.infer<typeof SlotSchema>;
```

Both frontend and backend import from `@saas/shared-types`. Never duplicate type definitions.

**`libs/shared/ui/` follows Atomic Design:**
- `atoms/` — Button, Input, Badge, Avatar
- `molecules/` — FormField, DataTable, StatCard
- `organisms/` — BookingCalendar, InventoryGrid
- Only used by `apps/admin` and `apps/customer` — NEVER imported by backend

**`libs/domain/[module]/` contains pure TypeScript:**
- Business rule interfaces (no framework coupling)
- Value objects and domain events
- Can be used by both backend services and frontend feature layers

**`libs/testing/utils/` provides:**
- `createMockUser(overrides?)` factory
- `createMockBooking(overrides?)` factory
- `createTestingNestApp(module)` wrapper
- Prisma test seeding utilities

---

## 3. Multi-Tenant Strategy

### Comparison

| Strategy | Pros | Cons | Best for |
|----------|------|------|----------|
| **Tenant-per-database** | Full isolation, easy backup/restore per tenant | High infra cost, hard to query cross-tenant | Enterprise, regulated industries |
| **Tenant-per-schema** (PostgreSQL schemas) | Good isolation, moderate infra, searchable | Schema migrations for 1000 tenants is painful, Prisma support is limited | Mid-scale SaaS |
| **Tenant-per-row** (tenant_id column) | Simple, single DB, easy migrations, best Prisma support | Requires strict query guards, RLS optional | Most SaaS at this scale |

### Recommendation: **Tenant-per-row with PostgreSQL RLS (Row Level Security)**

**Why:**
- Prisma has first-class support for `tenant_id` column approach
- Row Level Security in PostgreSQL is a DB-level safety net (defense in depth)
- Simple to migrate (just add `tenant_id` to every table)
- Easy to develop locally (no schema switching)
- Scales well for hundreds of tenants
- Can always graduate to per-schema later if needed

**Implementation flow:**

```
HTTP Request
    │
    ▼
NestJS Guard (TenantGuard)
    │  Extracts tenantId from JWT payload
    ▼
AsyncLocalStorage (TenantContext)
    │  Stores tenantId for the request lifecycle
    ▼
PrismaService (TenantPrismaService)
    │  Wraps every query with WHERE tenant_id = ?
    ▼
PostgreSQL (RLS policy as second safety layer)
```

```typescript
// Every Prisma query wrapped automatically:
this.prisma.student.findMany({
  where: { tenant_id: this.tenantContext.tenantId }
})
// RLS policy is the net that catches bugs:
// CREATE POLICY tenant_isolation ON students
//   USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**Tables that are NOT tenant-scoped:**
- `tenants` (the SaaS registry itself)
- `plans` (global subscription plans)
- `feature_flags` (global feature toggles)

---

## 4. BFF Pattern

### Recommended: Two BFFs with NestJS HTTP Proxy + WebSocket Proxy

```
Customer App (React + Capacitor)
    │
    ▼
api-gateway (NestJS BFF)
    ├── /auth     → auth-service
    ├── /bookings → booking-service (HTTP + WebSocket)
    ├── /payments → finance-service (Stripe webhooks)
    └── /profile  → auth-service + club-service (aggregated)

Admin Dashboard (React)
    │
    ▼
admin-gateway (NestJS BFF)
    ├── /users       → auth-service
    ├── /club        → club-service
    ├── /inventory   → inventory-service
    ├── /bookings    → booking-service (HTTP + WebSocket)
    ├── /finance     → finance-service
    └── /dashboard   → Aggregates from all services (custom endpoint)
```

**Request routing:** NestJS `@nestjs/axios` + custom `ProxyService` (not full gRPC at this stage)
- REST proxy for CRUD operations
- WebSocket proxy for real-time channels
- Aggregation endpoints (dashboard KPIs) call multiple services and merge responses

**Auth flow:** JWT validation happens at the BFF level. Individual microservices trust the internal network and receive the decoded JWT claims in headers (service-to-service internal tokens for sensitive operations).

---

## 5. NX Boundaries & Tag Rules

### Tag Taxonomy

```json
// Tags for apps:
"admin"        → { "tags": ["scope:admin", "type:app", "platform:web"] }
"customer"     → { "tags": ["scope:customer", "type:app", "platform:web-mobile"] }
"api-gateway"  → { "tags": ["scope:customer", "type:bff", "platform:node"] }
"admin-gateway"→ { "tags": ["scope:admin", "type:bff", "platform:node"] }
"auth-service" → { "tags": ["scope:shared", "type:service", "platform:node"] }
"club-service" → { "tags": ["scope:club", "type:service", "platform:node"] }
...

// Tags for libs:
"shared-types"    → { "tags": ["scope:shared", "type:types"] }
"shared-utils"    → { "tags": ["scope:shared", "type:util"] }
"shared-ui"       → { "tags": ["scope:shared", "type:ui", "platform:web"] }
"shared-constants"→ { "tags": ["scope:shared", "type:constants"] }
"auth-utils"      → { "tags": ["scope:auth", "type:util"] }
"domain-club"     → { "tags": ["scope:club", "type:domain"] }
"testing-utils"   → { "tags": ["scope:shared", "type:testing"] }
```

### Import Rules (`.eslintrc.json` `@nx/enforce-module-boundaries`)

```json
{
  "depConstraints": [
    // Apps can only import from libs, never from other apps
    { "sourceTag": "type:app",     "onlyDependOnLibsWithTags": ["type:types", "type:util", "type:ui", "type:domain", "type:constants"] },
    { "sourceTag": "type:bff",     "onlyDependOnLibsWithTags": ["type:types", "type:util", "type:domain", "type:constants"] },
    { "sourceTag": "type:service", "onlyDependOnLibsWithTags": ["type:types", "type:util", "type:domain", "type:constants"] },

    // UI libs only for web platforms
    { "sourceTag": "type:ui",      "onlyDependOnLibsWithTags": ["type:types", "type:util", "type:constants"] },

    // Domain libs don't depend on infrastructure
    { "sourceTag": "type:domain",  "onlyDependOnLibsWithTags": ["type:types", "type:constants"] },

    // Testing utils can see everything
    { "sourceTag": "type:testing", "onlyDependOnLibsWithTags": ["type:types", "type:util", "type:domain"] },

    // Scope restrictions: admin-scoped can't import customer-scoped and vice versa
    { "sourceTag": "scope:admin",    "bannedExternalImports": ["scope:customer"] },
    { "sourceTag": "scope:customer", "bannedExternalImports": ["scope:admin"] },
    // BUT both can import scope:shared
    { "sourceTag": "scope:shared",   "onlyDependOnLibsWithTags": ["scope:shared"] }
  ]
}
```

---

## 6. Configurability / Extensibility

### Recommendation: Feature Flags + Business Unit Configuration in DB

A **`config-service` is NOT needed at this stage.** Instead:

**Two-level configurability:**

1. **Plan-level features** (SaaS subscription tiers): Which modules are enabled (e.g., Free plan → only club module; Pro → all modules). Stored in `plans` table, enforced by `FeaturesGuard` at BFF level.

2. **Tenant-level configuration** (per-organization settings): Business name, timezone, currency, enabled business units, branding. Stored in `tenant_settings` table. Loaded once per request and cached in Redis.

```typescript
// libs/shared/types/src/tenant-settings.ts
export const TenantSettingsSchema = z.object({
  tenantId: z.string().uuid(),
  businessName: z.string(),
  timezone: z.string(),
  currency: z.enum(["USD", "COP", "MXN", "ARS"]),
  enabledModules: z.array(z.enum(["club", "inventory", "booking", "academy", "finance"])),
  branding: z.object({
    primaryColor: z.string(),
    logoUrl: z.string().url().optional(),
  }),
});
```

This allows the same codebase to run a baseball academy in Colombia and a tennis club in Mexico with completely different enabled features, currency, timezone, and branding.

---

## Approaches

### Approach A: Two BFFs (Recommended above)
- **Pros:** Clean separation, smaller surface area per gateway, independent scaling, different rate limits, no auth leakage
- **Cons:** Two services to maintain, slightly more infra
- **Effort:** Medium

### Approach B: Single BFF with route-level auth
- **Pros:** Less infra, simpler
- **Cons:** Admin and customer routes share JWT validation logic, easier to accidentally expose admin endpoints, harder to scale independently, harder to audit
- **Effort:** Low initially, High in maintenance

---

## Recommendation

**Go with Approach A: Two BFFs + Tenant-per-row + NX boundary tags.**

This architecture supports:
- ✅ Clean multi-tenancy with RLS as safety net
- ✅ Independent scaling of customer vs admin surface
- ✅ Clear NX boundaries that enforce architecture with linting
- ✅ Reusability (libs/shared/types as single source of truth for types)
- ✅ Extensibility (add new business unit = new service + new domain lib)
- ✅ Configurability without a separate config service

---

## Risks

- **Risk 1: RLS requires PostgreSQL session variable setup** — Prisma middleware must set `SET app.tenant_id = ?` before each query. If missed, RLS blocks the query. Needs careful setup.
- **Risk 2: Two BFFs = two deploy units to maintain** — Mitigated by NX affected builds (only redeploy what changed).
- **Risk 3: libs/shared/types becomes a bottleneck** — If all teams modify it simultaneously in a larger team. Mitigated by strict PR reviews and feature-scoped sub-packages.
- **Risk 4: WebSocket proxying in NestJS requires custom implementation** — `@nestjs/axios` doesn't proxy WebSockets. Need `http-proxy` or a custom WS gateway.

---

## Ready for Proposal

**Yes.** The architecture is well-defined enough to move to `sdd-propose`.

The proposal should cover:
1. Final app list (including `admin-gateway`)
2. Final `libs/` structure
3. Multi-tenant strategy (tenant-per-row + RLS)
4. Two-BFF pattern
5. NX boundary tag rules
6. Initial `libs/shared/types` structure with Zod as source of truth
