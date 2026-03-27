---
name: tdd
description: >
  Test-Driven Development workflow for this NX monorepo (React frontend + NestJS backend).
  Trigger: ALWAYS when implementing features, fixing bugs, or refactoring - regardless of component.
  This is a MANDATORY workflow, not optional.
license: MIT
metadata:
  author: gentleman-programming
  version: "2.0"
  scope: [root, admin, customer, api-gateway, auth-service, club-service, inventory-service, booking-service, finance-service, libs]
  auto_invoke:
    - "Implementing feature"
    - "Fixing bug"
    - "Refactoring code"
    - "Working on task"
    - "Modifying component"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

## TDD Cycle (MANDATORY)

```
+-----------------------------------------+
|  RED -> GREEN -> REFACTOR               |
|     ^                        |          |
|     +------------------------+          |
+-----------------------------------------+
```

**The question is NOT "should I write tests?" but "what tests do I need?"**

---

## The Three Laws of TDD

1. **No production code** until you have a failing test
2. **No more test** than necessary to fail
3. **No more code** than necessary to pass

---

## Detect Your Stack

Before starting, identify which component you're working on:

| Working in | Stack | Runner | Test pattern | Skill |
|------------|-------|--------|-------------|-------|
| `apps/admin/` or `apps/customer/` | TypeScript / React | Vitest + RTL | `*.spec.{ts,tsx}` (co-located) | `vitest` |
| `apps/*-service/` or `apps/api-gateway/` | TypeScript / NestJS | Jest | `*.spec.ts` (co-located) | `polyglot-test-agent` |
| `libs/` | TypeScript | Vitest or Jest (match consumer) | `*.spec.ts` (co-located) | — |

---

## Phase 0: Assessment (ALWAYS FIRST)

Before writing ANY code:

### Frontend (`apps/admin/`, `apps/customer/`, `libs/shared/ui/`)

```bash
# 1. Find existing tests
fd "*.spec.tsx" apps/admin/src/

# 2. Check coverage
nx test admin --coverage

# 3. Read existing tests
```

### Backend (`apps/*-service/`, `apps/api-gateway/`)

```bash
# 1. Find existing tests
fd "*.spec.ts" apps/auth-service/src/

# 2. Run specific test
nx test auth-service --testPathPattern=user

# 3. Read existing tests
```

### Shared Libs (`libs/`)

```bash
# 1. Find existing tests
fd "*.spec.ts" libs/shared/types/src/

# 2. Run tests
nx test shared-types
```

### Decision Tree (All Stacks)

```
+------------------------------------------+
|     Does test file exist for this code?  |
+----------+-----------------------+-------+
           | NO                    | YES
           v                       v
+------------------+    +------------------+
| CREATE test file |    | Check coverage   |
| -> Phase 1: RED  |    | for your change  |
+------------------+    +--------+---------+
                                 |
                        +--------+--------+
                        | Missing cases?  |
                        +---+---------+---+
                            | YES     | NO
                            v         v
                    +-----------+ +-----------+
                    | ADD tests | | Proceed   |
                    | Phase 1   | | Phase 2   |
                    +-----------+ +-----------+
```

---

## Phase 1: RED - Write Failing Tests

### For NEW Functionality

**Frontend (Vitest + RTL)**

```typescript
// apps/admin/src/features/bookings/components/booking-form.spec.tsx
import { render, screen } from "@testing-library/react";
import { BookingForm } from "./booking-form";

describe("BookingForm", () => {
  it("should show error when slot is unavailable", () => {
    // Given
    const unavailableSlot = { id: "1", available: false };

    // When
    render(<BookingForm slot={unavailableSlot} onSubmit={vi.fn()} />);

    // Then
    expect(screen.getByText(/slot not available/i)).toBeInTheDocument();
  });
});
```

**Backend Service (Jest)**

```typescript
// apps/booking-service/src/booking/booking.service.spec.ts
import { BookingService } from "./booking.service";
import { BookingRepository } from "./booking.repository";

describe("BookingService", () => {
  let service: BookingService;
  let repository: jest.Mocked<BookingRepository>;

  beforeEach(() => {
    repository = { findAvailableSlots: jest.fn() } as any;
    service = new BookingService(repository);
  });

  it("should return empty array when no slots available", async () => {
    // Given
    repository.findAvailableSlots.mockResolvedValue([]);

    // When
    const result = await service.getAvailableSlots("club-1", new Date());

    // Then
    expect(result).toEqual([]);
  });
});
```

**Backend Controller (Jest + NestJS TestingModule)**

```typescript
// apps/booking-service/src/booking/booking.controller.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";

describe("BookingController", () => {
  let controller: BookingController;
  let service: jest.Mocked<BookingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [{ provide: BookingService, useValue: { getAvailableSlots: jest.fn() } }],
    }).compile();

    controller = module.get(BookingController);
    service = module.get(BookingService);
  });

  it("should return slots from service", async () => {
    // Given
    service.getAvailableSlots.mockResolvedValue([{ id: "slot-1" }] as any);

    // When
    const result = await controller.getAvailableSlots("club-1");

    // Then
    expect(result).toHaveLength(1);
  });
});
```

### For BUG FIXES

Write a test that **reproduces the bug** first:

**Frontend:** `expect(() => render(<BookingCard booking={null} />)).not.toThrow();`

**Backend:** `expect(service.cancelBooking("invalid-id")).rejects.toThrow(NotFoundException);`

**Run → Should FAIL (reproducing the bug)**

### For REFACTORING

Capture ALL current behavior BEFORE refactoring:

```bash
# Run ALL existing tests — they must PASS before you touch anything
nx test [app-or-lib]
# This is your safety net
```

**Run → All should PASS (baseline)**

---

## Phase 2: GREEN - Minimum Code

Write the MINIMUM code to make the test pass. Hardcoding is valid for the first test.

**Frontend:**

```typescript
// Test expects getDiscountedPrice(100, 10) === 90
function getDiscountedPrice() {
  return 90; // FAKE IT — valid for the first test
}
```

**Backend:**

```typescript
// Test expects getAvailableSlots() returns []
async getAvailableSlots(): Promise<Slot[]> {
  return []; // FAKE IT — valid for the first test
}
```

**This passes. But we're not done...**

---

## Phase 3: Triangulation (CRITICAL)

**One test allows faking. Multiple tests FORCE real logic.**

Add tests with different inputs that break the hardcoded value:

| Scenario | Required? |
|----------|-----------|
| Happy path | YES |
| Zero/empty values | YES |
| Boundary values | YES |
| Different valid inputs | YES (breaks fake) |
| Error conditions | YES |

**Frontend:**

```typescript
it("should apply 10% discount", () => {
  expect(getDiscountedPrice(100, 10)).toBe(90);
});

// ADD — breaks the fake:
it("should apply 20% discount on 200", () => {
  expect(getDiscountedPrice(200, 20)).toBe(160);
});

it("should return full price when discount is 0", () => {
  expect(getDiscountedPrice(100, 0)).toBe(100);
});
```

**Backend:**

```typescript
it("should return available slots when exist", async () => {
  repository.findAvailableSlots.mockResolvedValue([{ id: "1" }] as any);
  const result = await service.getAvailableSlots("club-1", new Date());
  expect(result).toHaveLength(1);
});

it("should throw when club not found", async () => {
  repository.findAvailableSlots.mockRejectedValue(new NotFoundException());
  await expect(service.getAvailableSlots("ghost-club", new Date())).rejects.toThrow(NotFoundException);
});
```

**Now fake BREAKS → Real implementation required.**

---

## Phase 4: REFACTOR

Tests GREEN → Improve code quality WITHOUT changing behavior.

- Extract functions/methods
- Improve naming
- Add proper TypeScript types
- Reduce duplication
- Apply NX lib boundaries (move shared logic to `libs/`)

**Run tests after EACH change → Must stay GREEN**

---

## Quick Reference

```
+------------------------------------------------+
|                 TDD WORKFLOW                    |
+------------------------------------------------+
| 0. ASSESS: What tests exist? What's missing?   |
|                                                |
| 1. RED: Write ONE failing test                 |
|    +-- Run -> Must fail with clear error       |
|                                                |
| 2. GREEN: Write MINIMUM code to pass           |
|    +-- Fake It is valid for first test         |
|                                                |
| 3. TRIANGULATE: Add tests that break the fake  |
|    +-- Different inputs, edge cases            |
|                                                |
| 4. REFACTOR: Improve with confidence           |
|    +-- Tests stay green throughout             |
|                                                |
| 5. REPEAT: Next behavior/requirement           |
+------------------------------------------------+
```

---

## Anti-Patterns (NEVER DO)

```typescript
// 1. Code first, tests after
function newFeature() { ... }  // Then writing tests = USELESS

// 2. Skip triangulation
// Single test allows faking forever

// 3. Test implementation details
expect(component.state.isLoading).toBe(true);   // BAD — test behavior, not internals
expect(mockService).toHaveBeenCalledTimes(3);    // BAD — brittle coupling

// 4. All tests at once before any code
// Write ONE test, make it pass, THEN write the next

// 5. Giant test methods
// Each test should verify ONE behavior

// 6. Mocking what you own
// Never mock your own services/repos in unit tests for the SAME module
// Use real implementations or test doubles at the boundary
```

---

## Commands by Stack

### Frontend (`apps/admin/`, `apps/customer/`)

```bash
nx test admin                                # Watch mode
nx test admin --watch=false                  # Single run (CI)
nx test admin --coverage                     # Coverage report
nx test admin --testNamePattern="BookingForm" # Filter by name
```

### Backend (`apps/*-service/`)

```bash
nx test auth-service                         # All tests
nx test auth-service --watch=false           # Single run (CI)
nx test auth-service --testPathPattern=user  # Filter by path
nx test auth-service --coverage              # Coverage report
```

### Shared Libs (`libs/`)

```bash
nx test shared-types
nx run-many --target=test --all              # Run all tests in monorepo
nx affected --target=test                    # Only affected by changes
```
