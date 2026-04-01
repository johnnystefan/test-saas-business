---
name: pattern-singleton
description: >
  Teaches and applies the Singleton creational design pattern — ensuring a class has only
  one instance while providing a global access point to it.
  Trigger: When managing shared resources like database connections, config, or caches.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke:
    - 'singleton pattern, single instance, global access point'
    - 'shared resource that must have exactly one instance per application lifetime'
    - 'NestJS global provider like PrismaService, ConfigService, or Logger'
    - 'connection pool, cache client, or configuration registry that must not be duplicated'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Singleton Pattern

## Purpose

Ensures that a class has only one instance while providing a global access point to that instance. Crucial for shared resources like database connections.

## Procedural Instructions

1. **Private Constructor:** Prevent direct instantiation with `new`.
2. **Static Field:** Store the unique instance.
3. **Static Getter:** Provide a method that initializes the instance (lazy loading) if it doesn't exist and returns it.

## TypeScript Example

```typescript
class Database {
  private static instance: Database;

  private constructor() {
    // Init logic (e.g., connect to DB)
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public query(sql: string) {
    /* ... */
  }
}
```

## Payoff

- **Controlled Access:** Strict control over a global resource.
- **Memory Savings:** Avoids creating multiple heavy objects for the same task.
