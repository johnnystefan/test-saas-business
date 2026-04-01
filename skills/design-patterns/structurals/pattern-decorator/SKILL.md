---
name: pattern-decorator
description: >
  Teaches and applies the Decorator structural design pattern — attaching new behaviors
  to objects dynamically by wrapping them inside decorator objects.
  Trigger: When adding responsibilities to objects at runtime without modifying their class.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke:
    - 'decorator pattern, dynamic behavior, wrapper object'
    - 'adding cross-cutting behavior (logging, caching, retry) to a NestJS provider without modifying it'
    - 'wrapping a repository or use case to add observability or metrics'
    - 'need to compose behaviors at runtime instead of hardcoding them in the class'
    - 'CachedRepository wrapping PrismaRepository, or LoggedUseCase wrapping a use case'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Decorator Pattern

## Purpose

Attaches new behaviors to objects dynamically by placing them inside special wrapper objects that contain the behaviors.

## Procedural Instructions

1. **Identify Layers:** Look for a primary component and optional "add-on" features.
2. **Define Component Interface:** Common interface for both the core object and its wrappers.
3. **Create Base Decorator:** A class that wraps a component and delegates all work to it.
4. **Implement Concrete Decorators:** Classes that override base methods to add behavior before/after delegation.

## TypeScript Example

```typescript
interface Notifier {
  send(msg: string): void;
}

class SimpleNotifier implements Notifier {
  send(msg: string) {
    console.log(`Sending: ${msg}`);
  }
}

class BaseDecorator implements Notifier {
  constructor(protected wrappee: Notifier) {}
  send(msg: string) {
    this.wrappee.send(msg);
  }
}

class SMSDecorator extends BaseDecorator {
  send(msg: string) {
    super.send(msg);
    console.log(`SMS: ${msg}`);
  }
}
```

## Payoff

- **Flexibility:** Add/remove responsibilities at runtime.
- **Composition over Inheritance:** Avoids bloating classes with every possible combination of features.
