---
name: pattern-proxy
description: >
  Teaches and applies the Proxy structural design pattern — providing a substitute
  for another object to control access, add lazy loading, logging, or caching.
  Trigger: When controlling access to objects, adding cross-cutting concerns, or lazy loading.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'proxy pattern, access control, lazy loading, virtual proxy'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Proxy Pattern

## Purpose

Provides a substitute or placeholder for another object to control access to it (e.g., lazy loading, logging, access control).

## Procedural Instructions

1. **Define Service Interface:** Create an interface that both the real service and the proxy will follow.
2. **Create Real Service:** The class that performs the actual business logic.
3. **Create Proxy:** Implements the same interface, maintains a reference to the service, and controls access/execution.

## TypeScript Example

```typescript
interface Subject {
  request(): void;
}

class RealSubject implements Subject {
  request() {
    console.log('RealSubject handling request');
  }
}

class ProxySubject implements Subject {
  private realSubject: RealSubject | null = null;

  request() {
    if (this.checkAccess()) {
      if (!this.realSubject) this.realSubject = new RealSubject(); // Lazy Init
      this.realSubject.request();
      this.logAccess();
    }
  }

  private checkAccess(): boolean {
    return true;
  }
  private logAccess() {
    console.log('Proxy: Logging request');
  }
}
```

## Payoff

- **Control:** Manage service lifecycle and access without modifying the service class.
- **Robustness:** The proxy works even if the service isn't ready or available.
