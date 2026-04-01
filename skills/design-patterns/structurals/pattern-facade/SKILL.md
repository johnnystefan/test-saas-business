---
name: pattern-facade
description: >
  Teaches and applies the Facade structural design pattern — providing a simplified
  interface to a complex subsystem, library, or framework.
  Trigger: When simplifying access to complex APIs or hiding subsystem complexity.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'facade pattern, simplified interface, subsystem abstraction'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Facade Pattern

## Purpose

Provides a simplified interface to a complex library, framework, or any other set of classes.

## Procedural Instructions

1. **Identify Complexity:** Locate a subsystem that is hard to use or has too many dependencies.
2. **Define Facade Class:** Create a class that provides simple methods for the most common tasks.
3. **Delegate Work:** The facade should initialize and manage subsystem objects, directing client calls to them.

## TypeScript Example

```typescript
class ComplexSubsystem {
  initialize() {}
  process() {}
  getResults() {
    return 'Data';
  }
}

class Facade {
  private subsystem = new ComplexSubsystem();

  public simpleOperation(): string {
    this.subsystem.initialize();
    this.subsystem.process();
    return this.subsystem.getResults();
  }
}
```

## Payoff

- **Decoupling:** Protects clients from changes in the complex subsystem.
- **Ease of Use:** Provides a shortcut to frequently used features.
