# Proposal: club-service

## Intent

Transform the placeholder NestJS club-service into a functional multi-tenant service for sports club management, starting with core entities (Club, Student, Membership) to enable basic enrollment and student management operations.

## Scope

### In Scope

- Prisma schema with Club, Student, Membership entities + migrations
- Domain layer: entities, value objects, repository interfaces (DDD pattern)
- Infrastructure layer: Prisma repositories with proper mapping
- Application layer: CRUD use cases for clubs, students, and memberships
- REST controllers with Zod validation (register students, list members, etc.)
- Unit tests for domain and application layers
- Integration tests for repositories

### Out of Scope

- Advanced scheduling/booking integration (separate service)
- Payment processing (delegated to finance-service)
- Inventory management (separate service)
- Real-time notifications (separate feature)

## Approach

Follow Domain-Driven Design (DDD) with Clean Architecture layers:

1. Domain layer: entities (Club, Student, Membership) + value objects (ClubId, StudentEmail, etc.)
2. Application layer: pure use cases (RegisterStudent, ListMembers, CreateClub)
3. Infrastructure layer: Prisma repositories implementing domain contracts
4. Presentation layer: NestJS controllers with Zod DTOs

Use the `nestjs-domain` skill patterns for entity structure and the `prisma` skill for multi-tenant schema design.

## Affected Areas

| Area                                    | Impact   | Description                                    |
| --------------------------------------- | -------- | ---------------------------------------------- |
| `apps/club-service/src/app/`            | Modified | Replace placeholder with modular structure     |
| `apps/club-service/prisma/`             | New      | Schema, migrations, Prisma configuration       |
| `apps/club-service/src/domain/`         | New      | Entities, value objects, repository interfaces |
| `apps/club-service/src/application/`    | New      | Use cases and DTOs                             |
| `apps/club-service/src/infrastructure/` | New      | Prisma service and repository implementations  |

## Risks

| Risk                          | Likelihood | Mitigation                                                |
| ----------------------------- | ---------- | --------------------------------------------------------- |
| Prisma 7 configuration issues | Medium     | Follow auth-service patterns and Prisma skill             |
| Complex multi-tenant queries  | Medium     | Use tenant_id filtering in all repository operations      |
| Domain model over-engineering | Low        | Start with minimal entities, add complexity incrementally |

## Rollback Plan

- Revert to the current placeholder state (AppController + AppService)
- Drop the Prisma schema and remove database dependencies
- Remove domain/application/infrastructure folders

## Dependencies

- `@saas/shared-types` (for base entities and DTOs)
- `@saas/auth-utils` (for JWT guard integration)
- PostgreSQL database (shared with auth-service)

## Success Criteria

- [ ] Club CRUD operations work end-to-end (create, list, update, disable)
- [ ] Student registration and enrollment in clubs
- [ ] Membership creation and status management
- [ ] All repository operations respect tenant isolation
- [ ] Unit tests pass for domain logic
- [ ] Integration tests pass for database operations
