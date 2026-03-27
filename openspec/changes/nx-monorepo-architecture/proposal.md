# Proposal: NX Monorepo Architecture Bootstrap

## Intent

Establecer la estructura base del monorepo NX antes de cualquier desarrollo de features. Sin esta base, no hay boundaries, no hay imports tipados entre apps y libs, y no hay convenciones que los agentes puedan seguir. Este cambio define el layout definitivo del workspace.

## Scope

### In Scope
- Crear workspace NX con `pnpm` y TypeScript 6
- Scaffoldear todas las apps (`admin`, `customer`, `api-gateway`, `admin-gateway`, `auth-service`, `club-service`, `inventory-service`, `booking-service`, `finance-service`)
- Scaffoldear las libs iniciales (`shared/types`, `shared/utils`, `shared/ui`, `shared/constants`, `auth/utils`, `testing/utils`, `config/env`)
- Configurar `tsconfig.base.json` con paths aliases (`@saas/*`)
- Configurar NX boundary tags y reglas de ESLint (`@nx/enforce-module-boundaries`)
- Configurar `pnpm-workspace.yaml` y `nx.json` con caché y affected
- Docker Compose para PostgreSQL local

### Out of Scope
- Implementación de lógica de negocio (ningún endpoint, ningún componente)
- Prisma schema o migraciones (siguiente change)
- CI/CD pipeline (posterior)
- Capacitor setup para mobile (posterior)
- Redis setup (posterior)

## Approach

1. Init NX workspace vacío con preset `ts`
2. Generar apps con los generadores oficiales (`@nx/react`, `@nx/nest`)
3. Generar libs con `@nx/js:lib` (o `@nx/react:lib` para `shared/ui`)
4. Configurar `tsconfig.base.json` con paths y TS6 settings
5. Configurar tags en cada `project.json`
6. Agregar `depConstraints` al `.eslintrc.json` raíz
7. Agregar `docker-compose.yml` para PostgreSQL 16

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `/` (root) | New | `package.json`, `pnpm-workspace.yaml`, `nx.json`, `tsconfig.base.json`, `.eslintrc.json` |
| `apps/` | New | 9 apps scaffoldeadas |
| `libs/` | New | 7 libs iniciales scaffoldeadas |
| `docker-compose.yml` | New | PostgreSQL 16 + pgAdmin |
| `AGENTS.md` | Modified | Agregar `admin-gateway` que faltaba en el listado original |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| NX generators cambian con versiones — flags pueden diferir | Low | Fijar versión de NX en `package.json` |
| TS6 + NX puede tener incompatibilidades de plugin | Med | Testear con `tsc --noEmit` antes de continuar; fallback a TS 5.x si bloquea |
| Paths aliases mal configurados rompen imports en toda la base | Med | Verificar con `nx run-many --target=lint --all` post-setup |

## Rollback Plan

Todo este change es adición pura (nuevo workspace). Si algo falla: `rm -rf` del directorio y reiniciar. No hay código de negocio en riesgo.

## Dependencies

- `node` LTS instalado
- `pnpm` instalado globalmente
- `nx` CLI disponible (`pnpm dlx nx`)
- Docker Desktop corriendo (para PostgreSQL local)

## Success Criteria

- [ ] `nx run-many --target=lint --all` pasa sin errores
- [ ] `nx run-many --target=build --all` compila sin errores de TypeScript
- [ ] Imports entre apps directamente (`apps/admin` → `apps/auth-service`) son BLOQUEADOS por ESLint
- [ ] Imports desde apps a libs (`apps/admin` → `@saas/shared-types`) son PERMITIDOS
- [ ] `docker compose up` levanta PostgreSQL correctamente
