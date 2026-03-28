---
name: react-19
description: >
  React 19 component patterns for the admin dashboard and customer app.
  Trigger: When creating React components, hooks, forms, data fetching with React Query, or client state with Zustand.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [admin, customer]
  auto_invoke: 'Writing React components or hooks'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Core Rules

- **Functional components only** — no class components
- **Container / Presentational pattern** — containers handle data, presentationals render
- **Custom hooks** for all reusable logic — never inline in components
- **React Query** for all server state (fetching, caching, mutations)
- **Zustand** for client-side global state
- **Zod + React Hook Form** for all forms
- NEVER use `useEffect` for data fetching — use React Query
- NEVER use prop drilling beyond 2 levels — use context or Zustand

---

## Container / Presentational Pattern

```tsx
// users-list.container.tsx — handles data
export function UsersListContainer() {
  const { data: users, isLoading, error } = useUsersQuery();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!users?.length) return <EmptyState />;

  return <UsersList users={users} />;
}

// users-list.tsx — pure presentational, no data fetching
interface UsersListProps {
  readonly users: User[];
}

export function UsersList({ users }: UsersListProps) {
  return (
    <ul>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </ul>
  );
}
```

---

## Feature Folder Structure

```
src/features/your-feature/
├── components/
│   ├── your-feature-list.container.tsx   # Data-aware
│   ├── your-feature-list.tsx             # Presentational
│   └── your-feature-card.tsx             # Presentational
├── hooks/
│   ├── use-your-feature-query.ts         # React Query
│   └── use-your-feature-mutation.ts      # React Query mutation
├── stores/
│   └── your-feature.store.ts             # Zustand (if client state needed)
├── api/
│   └── your-feature.api.ts               # API call functions
└── types.ts                               # Feature types
```

---

## React Query — Server State

```typescript
// use-users-query.ts
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/users.api';

export function useUsersQuery(tenantId: string) {
  return useQuery({
    queryKey: ['users', tenantId],
    queryFn: () => fetchUsers(tenantId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// use-create-user-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserApi,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users', newUser.tenantId] });
    },
  });
}
```

Query key convention: `[domain, tenantId, ...filters]`

---

## Forms with React Hook Form + Zod

```tsx
// create-user-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';

const CreateUserSchema = z.object({
  name: z.string().min(1, { error: 'Name is required' }),
  email: z.email({ error: 'Invalid email' }),
  role: z.enum(['admin', 'member', 'viewer']),
});

type CreateUserFormData = z.infer<typeof CreateUserSchema>;

export function CreateUserForm() {
  const { mutate: createUser, isPending } = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit = (data: CreateUserFormData) => {
    createUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <select {...register('role')}>
        <option value="admin">Admin</option>
        <option value="member">Member</option>
        <option value="viewer">Viewer</option>
      </select>

      <button disabled={isPending}>Create User</button>
    </form>
  );
}
```

---

## Custom Hooks

```typescript
// use-toggle.ts
interface UseToggleReturn {
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
}

export function useToggle(initialValue = false): UseToggleReturn {
  const [isOpen, setIsOpen] = useState(initialValue);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);
  return { isOpen, open, close, toggle };
}
```

React 19 note: `useCallback` wrapping is no longer needed — React Compiler handles memoization automatically.

---

## Code Splitting (MANDATORY for heavy features)

```tsx
import { lazy, Suspense } from 'react';

// Route-based code splitting
const BookingsDashboard = lazy(
  () => import('@/features/bookings/components/bookings-dashboard.container'),
);

function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <BookingsDashboard />
    </Suspense>
  );
}
```

---

## Component Rules

- Keep components under **150 lines**
- Extract complex JSX into sub-components
- No `useEffect` for data fetching — use React Query
- No inline objects/arrays as props (creates new references every render)
- Use **semantic HTML** for accessibility
- Add ARIA labels to interactive elements

```tsx
// ✅ GOOD: Semantic + accessible
<button aria-label="Delete user" onClick={handleDelete}>
  <TrashIcon aria-hidden="true" />
  Delete
</button>
```

---

## Declarative Naming for Components

```tsx
// ❌ BAD: Imperative/complex conjugations
<UserDataTransformer />
<ApiResponseConverter />

// ✅ GOOD: Simple, declarative
<UserProfile />
<DataDisplay />
<UserCard />
```

---

## Component File Structure

```tsx
// user-card.tsx

// 1. Imports
import type { User } from '../types';
import { useToggle } from '../hooks/use-toggle';

// 2. Types
interface UserCardProps {
  readonly user: User;
  readonly onEdit?: (user: User) => void;
}

// 3. Sub-components (only if very small and tightly coupled)
function UserAvatar({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="avatar" />;
}

// 4. Main component (named export)
export function UserCard({ user, onEdit }: UserCardProps) {
  const { isOpen, toggle } = useToggle();

  return (
    <div>
      <UserAvatar src={user.avatar} alt={`${user.name} avatar`} />
      <h3>{user.name}</h3>
      {isOpen && <p>{user.email}</p>}
      <button onClick={toggle}>{isOpen ? 'Collapse' : 'Expand'}</button>
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
    </div>
  );
}
```
