# Design: NX Monorepo Architecture Bootstrap

## Technical Approach

Inicializar el workspace NX con pnpm workspaces, generar las 9 apps y 7 libs con los generadores oficiales de NX, configurar TypeScript 6 con path aliases en `tsconfig.base.json`, y enforcar los boundary constraints via ESLint. El resultado es un workspace que compila, lintea, y bloquea imports inválidos — sin ninguna lógica de negocio todavía.

---

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Package manager | `pnpm` | npm, yarn | Content-addressable store, strictness anti-phantom-deps, mejor soporte NX workspaces |
| NX preset | `ts` (empty) | `react`, `nest` | Más control — generamos cada app/lib explícitamente con el generador correcto |
| TS module resolution (backend) | `nodenext` | `node` (deprecated en TS6), `bundler` | NestJS usa CJS/ESM dual; `nodenext` es el único correcto para Node en TS6 |
| TS module resolution (frontend) | `bundler` | `nodenext`, `node` | Vite no hace resolución Node — `bundler` es el valor correcto para tools que manejan resolución ellos mismos |
| Path alias prefix | `@saas/` | `@app/`, `~/`, sin prefijo | Unívoco, no colisiona con paquetes npm, fácil de grep |
| Boundary enforcement | `@nx/enforce-module-boundaries` en ESLint | Manual, runtime checks | Lint-time = falla rápido en CI, sin costo runtime |

---

## Workspace Structure

```
/
├── apps/
│   ├── admin/                  ← React 19, scope:admin, platform:web
│   ├── customer/               ← React 19 + Capacitor, scope:customer, platform:web-mobile
│   ├── api-gateway/            ← NestJS BFF, scope:customer, type:bff, platform:node
│   ├── admin-gateway/          ← NestJS BFF, scope:admin, type:bff, platform:node
│   ├── auth-service/           ← NestJS, scope:shared, type:service, platform:node
│   ├── club-service/           ← NestJS, scope:club, type:service, platform:node
│   ├── inventory-service/      ← NestJS, scope:inventory, type:service, platform:node
│   ├── booking-service/        ← NestJS, scope:booking, type:service, platform:node
│   └── finance-service/        ← NestJS, scope:finance, type:service, platform:node
├── libs/
│   ├── shared/
│   │   ├── types/              ← scope:shared, type:types       — Zod schemas + TS types
│   │   ├── utils/              ← scope:shared, type:util        — Pure functions
│   │   ├── ui/                 ← scope:shared, type:ui, platform:web — Design system
│   │   └── constants/          ← scope:shared, type:constants   — Enums, status maps
│   ├── auth/
│   │   └── utils/              ← scope:auth, type:util          — JWT helpers
│   ├── testing/
│   │   └── utils/              ← scope:shared, type:testing     — Mock factories
│   └── config/
│       └── env/                ← scope:shared, type:util        — Zod env schema
├── tsconfig.base.json
├── nx.json
├── pnpm-workspace.yaml
├── .eslintrc.json
├── docker-compose.yml
└── .env.example
```

---

## Key Configuration Files

**`tsconfig.base.json` (extracto relevante)**

```jsonc
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["es2022"],
    "types": [],
    "declaration": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "paths": {
      "@saas/shared-types":    ["libs/shared/types/src/index.ts"],
      "@saas/shared-utils":    ["libs/shared/utils/src/index.ts"],
      "@saas/shared-ui":       ["libs/shared/ui/src/index.ts"],
      "@saas/shared-constants":["libs/shared/constants/src/index.ts"],
      "@saas/auth-utils":      ["libs/auth/utils/src/index.ts"],
      "@saas/testing-utils":   ["libs/testing/utils/src/index.ts"],
      "@saas/config-env":      ["libs/config/env/src/index.ts"]
    }
  }
}
```

**`pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "libs/**"
```

**`nx.json` (extracto)**

```jsonc
{
  "targetDefaults": {
    "build":  { "cache": true, "dependsOn": ["^build"] },
    "test":   { "cache": true },
    "lint":   { "cache": true }
  },
  "defaultBase": "main"
}
```

**ESLint boundary rules (extracto de `.eslintrc.json`)**

```jsonc
{
  "rules": {
    "@nx/enforce-module-boundaries": ["error", {
      "depConstraints": [
        { "sourceTag": "type:app",     "onlyDependOnLibsWithTags": ["type:types","type:util","type:ui","type:domain","type:constants"] },
        { "sourceTag": "type:bff",     "onlyDependOnLibsWithTags": ["type:types","type:util","type:domain","type:constants"] },
        { "sourceTag": "type:service", "onlyDependOnLibsWithTags": ["type:types","type:util","type:domain","type:constants"] },
        { "sourceTag": "type:ui",      "onlyDependOnLibsWithTags": ["type:types","type:util","type:constants"] },
        { "sourceTag": "scope:admin",  "notDependOnLibsWithTags": ["scope:customer"] },
        { "sourceTag": "scope:customer","notDependOnLibsWithTags": ["scope:admin"] },
        { "sourceTag": "platform:node","notDependOnLibsWithTags": ["platform:web"] }
      ]
    }]
  }
}
```

---

## Testing Strategy

| Layer | Qué testear | Approach |
|-------|-------------|----------|
| Lint | Boundary violations | `nx run-many --target=lint --all` — falla si alguna regla se rompe |
| Build | TS compilation sin errores | `nx run-many --target=build --all` — valida tsconfigs y paths |
| Manual | Docker Compose levanta PG | `docker compose up -d && psql -h localhost -U postgres` |

> No hay unit tests en este change — no hay lógica de negocio. Las specs se validan con lint + build.

---

## Migration / Rollout

No migration required. Workspace greenfield — adición pura.

---

## Open Questions

- [ ] ¿La versión de `@nx/*` plugins (react, nest, js) a fijar en `package.json`? Propuesta: usar `latest` al inicio y fijar post-init en el lockfile.
- [ ] ¿`shared/ui` usará Storybook desde el inicio o se agrega en un change posterior? (Recomendación: posterior — no está en scope de este change)
