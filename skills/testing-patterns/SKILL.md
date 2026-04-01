---
name: testing-patterns
description: >
  Testing patterns for this SaaS platform — Object Mothers, AAA, coverage requirements.
  Trigger: When writing unit tests for use cases, domain entities, helpers, or React components.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [admin, customer, api-gateway, auth-service, club-service, inventory-service, booking-service, finance-service, libs]
  auto_invoke: 'Writing unit or integration tests (React/frontend)'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Testing Strategy

| Type            | Tool         | What to test                               |
| --------------- | ------------ | ------------------------------------------ |
| Unit (frontend) | Vitest + RTL | React components, hooks, utilities         |
| Unit (backend)  | Jest         | Use cases, domain entities, helpers        |
| Integration     | Jest         | Repositories (with test DB), module wiring |
| E2E             | Playwright   | Critical user flows, full stack            |

Test files: co-located with source as `*.spec.ts` / `*.spec.tsx`

---

## Arrange-Act-Assert (MANDATORY)

Every test must follow the AAA pattern with explicit variable naming.

```typescript
describe('ResourceCreate', () => {
  describe('when creating a resource with valid data', () => {
    it('should persist the resource and return primitives', async () => {
      // Arrange
      const inputData = ResourceInputMother.valid();
      const mockServiceResponse = ServiceResponseMother.success();
      mockExternalService.execute.mockResolvedValue(mockServiceResponse);

      // Act
      const actualResult = await useCase.run(inputData);

      // Assert
      const expectedId = expect.any(String);
      expect(actualResult.id).toEqual(expectedId);
      expect(mockRepository.add).toHaveBeenCalledTimes(1);
    });
  });
});
```

Variable naming convention:

- `inputX` — test inputs
- `mockX` — mock instances
- `actualX` — result from the system under test
- `expectedX` — expected values

---

## Object Mothers (Test Data Factories)

Create an `*-mother.ts` file per domain entity in `__tests__/mothers/` or alongside the test.

```typescript
// resource-input.mother.ts
export class ResourceInputMother {
  static valid(overrides?: Partial<CreateResourceInput>): CreateResourceInput {
    return {
      tenantId: 'tenant-123',
      name: 'test-resource',
      status: 'ACTIVE',
      ...overrides,
    };
  }

  static withInvalidName(): CreateResourceInput {
    return this.valid({ name: '' });
  }

  static withInvalidTenant(): CreateResourceInput {
    return this.valid({ tenantId: '' });
  }
}

// resource.mother.ts
export class ResourceMother {
  static active(overrides?: Partial<ResourcePrimitives>): Resource {
    return Resource.fromPrimitives({
      id: crypto.randomUUID(),
      tenantId: 'tenant-123',
      name: 'test-resource',
      status: 'ACTIVE',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...overrides,
    });
  }

  static inactive(): Resource {
    return this.active({ status: 'INACTIVE' });
  }
}
```

---

## Backend Unit Tests (Jest — Use Cases)

Test **only use cases** at the unit level. Domain entities and repositories are covered through use cases.

```typescript
// resource-create.spec.ts
import { ResourceCreate } from './resource-create.use-case';
import { ResourceInputMother } from './__tests__/mothers/resource-input.mother';
import { ServiceResponseMother } from './__tests__/mothers/service-response.mother';

describe('ResourceCreate', () => {
  let useCase: ResourceCreate;
  let mockRepository: jest.Mocked<ResourceRepository>;
  let mockExternalService: jest.Mocked<ExternalService>;

  beforeEach(() => {
    mockRepository = {
      add: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<ResourceRepository>;

    mockExternalService = {
      execute: jest.fn(),
    } as jest.Mocked<ExternalService>;

    useCase = new ResourceCreate(mockRepository, mockExternalService);
  });

  describe('when creating a resource with valid data', () => {
    it('should persist the resource and return primitives', async () => {
      // Arrange
      const inputData = ResourceInputMother.valid();
      mockExternalService.execute.mockResolvedValue(
        ServiceResponseMother.success(),
      );

      // Act
      const actualResult = await useCase.run(inputData);

      // Assert
      expect(actualResult.id).toBeDefined();
      expect(actualResult.tenantId).toBe(inputData.tenantId);
      expect(mockRepository.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the external service fails', () => {
    it('should throw ExternalServiceError', async () => {
      // Arrange
      const inputData = ResourceInputMother.valid();
      mockExternalService.execute.mockRejectedValue(
        new Error('Service unavailable'),
      );

      // Act & Assert
      await expect(useCase.run(inputData)).rejects.toThrow(
        ExternalServiceError,
      );
    });
  });

  describe('when input is invalid', () => {
    it('should throw DomainValidationError', async () => {
      // Arrange
      const inputData = ResourceInputMother.withInvalidName();

      // Act & Assert
      await expect(useCase.run(inputData)).rejects.toThrow(
        DomainValidationError,
      );
    });
  });
});
```

---

## Frontend Unit Tests (Vitest + RTL)

Focus on **user behavior**, not implementation details.

```tsx
// user-card.spec.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from './user-card';
import { UserMother } from './__tests__/mothers/user.mother';

describe('UserCard', () => {
  it('should display user information', () => {
    // Arrange
    const user = UserMother.active();

    // Act
    render(<UserCard user={user} />);

    // Assert
    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    // Arrange
    const user = UserMother.active();
    const mockOnEdit = vi.fn();
    const userActions = userEvent.setup();

    // Act
    render(<UserCard user={user} onEdit={mockOnEdit} />);
    await userActions.click(screen.getByRole('button', { name: /edit/i }));

    // Assert
    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith(user);
    });
  });
});
```

---

## Custom Hook Tests (Vitest)

```typescript
// use-toggle.spec.ts
import { renderHook, act } from '@testing-library/react';
import { useToggle } from './use-toggle';

describe('useToggle', () => {
  it('should start with initial value', () => {
    const { result } = renderHook(() => useToggle(false));
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle state correctly', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
```

---

## Coverage Requirements

| Layer           | Coverage                       | Notes                          |
| --------------- | ------------------------------ | ------------------------------ |
| Use Cases       | **100%** — MANDATORY           | Every branch, every error path |
| Domain Entities | Covered through use cases      | Test via use case tests        |
| Helpers         | Unit test each pure function   | Simple input/output tests      |
| Controllers     | Integration tests only         | Mock services                  |
| Infrastructure  | Integration tests with test DB | Real Prisma queries            |

---

## Given-When-Then (Acceptance Tests)

```typescript
describe('Given a tenant with active resources', () => {
  describe('When a user creates a resource with a duplicate name', () => {
    it('Then it should throw ResourceAlreadyExistsError', async () => {
      // Given
      const existingResource = ResourceMother.active({ name: 'duplicated' });
      await seedRepository([existingResource]);

      // When
      const input = ResourceInputMother.valid({ name: 'duplicated' });
      const promise = useCase.run(input);

      // Then
      await expect(promise).rejects.toThrow(ResourceAlreadyExistsError);
    });
  });
});
```
