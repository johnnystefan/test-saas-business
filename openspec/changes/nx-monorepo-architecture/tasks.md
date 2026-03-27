# Tasks: NX Monorepo Architecture Bootstrap

## Phase 1: Workspace Foundation

- [x] 1.1 Crear workspace NX vacío: `pnpm dlx create-nx-workspace@latest saas-business --preset=ts --packageManager=pnpm --nxCloud=skip`
- [x] 1.2 Instalar TypeScript 6 beta: `pnpm add -D typescript@beta` en el root
- [x] 1.3 Crear `pnpm-workspace.yaml` declarando `apps/*` y `libs/**` como packages
- [x] 1.4 Configurar `nx.json`: habilitar caché para `build`, `test`, `lint`; `defaultBase: "main"`
- [x] 1.5 Crear `tsconfig.base.json` con target `es2022`, `moduleResolution: bundler`, `types: []`, y todos los `@saas/*` path aliases para las 7 libs
- [x] 1.6 Crear `.env.example` con `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`
- [x] 1.7 Crear `docker-compose.yml` con PostgreSQL 16 en puerto 5432 y pgAdmin opcional

## Phase 2: Apps Scaffolding

- [x] 2.1 Generar `apps/admin`: `nx g @nx/react:app admin --directory=apps/admin --bundler=vite --style=css`
- [x] 2.2 Generar `apps/customer`: `nx g @nx/react:app customer --directory=apps/customer --bundler=vite --style=css`
- [x] 2.3 Generar `apps/api-gateway`: `nx g @nx/nest:app --name=api-gateway --directory=apps/api-gateway`
- [x] 2.4 Generar `apps/admin-gateway`: `nx g @nx/nest:app --name=admin-gateway --directory=apps/admin-gateway`
- [x] 2.5 Generar `apps/auth-service`: `nx g @nx/nest:app --name=auth-service --directory=apps/auth-service`
- [x] 2.6 Generar `apps/club-service`: `nx g @nx/nest:app --name=club-service --directory=apps/club-service`
- [x] 2.7 Generar `apps/inventory-service`: `nx g @nx/nest:app --name=inventory-service --directory=apps/inventory-service`
- [x] 2.8 Generar `apps/booking-service`: `nx g @nx/nest:app --name=booking-service --directory=apps/booking-service`
- [x] 2.9 Generar `apps/finance-service`: `nx g @nx/nest:app --name=finance-service --directory=apps/finance-service`

## Phase 3: Libs Scaffolding

- [x] 3.1 Generar `libs/shared/types`: `nx g @nx/js:lib shared-types --directory=libs/shared/types --bundler=tsc`
- [x] 3.2 Generar `libs/shared/utils`: `nx g @nx/js:lib shared-utils --directory=libs/shared/utils --bundler=tsc`
- [x] 3.3 Generar `libs/shared/ui`: `nx g @nx/react:lib shared-ui --directory=libs/shared/ui --bundler=vite`
- [x] 3.4 Generar `libs/shared/constants`: `nx g @nx/js:lib shared-constants --directory=libs/shared/constants --bundler=tsc`
- [x] 3.5 Generar `libs/auth/utils`: `nx g @nx/js:lib auth-utils --directory=libs/auth/utils --bundler=tsc`
- [x] 3.6 Generar `libs/testing/utils`: `nx g @nx/js:lib testing-utils --directory=libs/testing/utils --bundler=tsc`
- [x] 3.7 Generar `libs/config/env`: `nx g @nx/js:lib config-env --directory=libs/config/env --bundler=tsc`

## Phase 4: Tags & Boundaries

- [ ] 4.1 Agregar tags NX a cada `apps/*/project.json` — ejes `scope`, `type`, `platform` según design
- [ ] 4.2 Agregar tags NX a cada `libs/**/project.json` — ejes `scope`, `type` (y `platform:web` para `shared-ui`)
- [ ] 4.3 Actualizar `.eslintrc.json` raíz con `@nx/enforce-module-boundaries` y los `depConstraints` del design
- [ ] 4.4 Corregir tsconfigs de apps NestJS: cambiar `moduleResolution` a `nodenext`, agregar `"types": ["node"]`, `"rootDir": "./src"`
- [ ] 4.5 Corregir tsconfigs de apps React: confirmar `moduleResolution: bundler`, `jsx: react-jsx`, eliminar `target: es5` si existe

## Phase 5: Verificación

- [ ] 5.1 Ejecutar `nx run-many --target=lint --all` — debe pasar sin errores de boundary
- [ ] 5.2 Ejecutar `nx run-many --target=build --all` — debe compilar sin errores TypeScript
- [ ] 5.3 Verificar que `apps/admin` → `apps/auth-service` es BLOQUEADO por ESLint (spec: cross-app prohibition)
- [ ] 5.4 Verificar que `apps/admin` → `@saas/shared-types` es PERMITIDO (spec: app-to-lib permission)
- [ ] 5.5 Ejecutar `docker compose up -d` y confirmar que PostgreSQL 16 responde en puerto 5432
- [ ] 5.6 Commit final: `chore(infra): bootstrap NX monorepo with apps, libs, boundaries and Docker`
