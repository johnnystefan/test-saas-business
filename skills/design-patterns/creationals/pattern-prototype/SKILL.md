---
name: pattern-prototype
description: >
  Teaches and applies the Prototype creational design pattern — cloning existing objects
  without making code dependent on their classes, delegating cloning to the objects themselves.
  Trigger: When creating copies of complex objects or avoiding expensive re-initialization.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'prototype pattern, object cloning, copy constructor'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Prototype Pattern

## Purpose

Enables copying existing objects without making the code dependent on their classes. The cloning responsibility is delegated to the objects themselves.

## Procedural Instructions

1. **Create Prototype Interface:** Define a `clone()` method.
2. **Implement Clone in Classes:** The class must instantiate itself and copy all field values (including private ones) to the new instance.
3. **Prototype Registry (Optional):** A central place to store frequently used prototypes for easy cloning.

## TypeScript Example

```typescript
abstract class Shape {
  constructor(
    public x: number,
    public y: number,
    public color: string,
  ) {}
  abstract clone(): Shape;
}

class Rectangle extends Shape {
  constructor(source: Rectangle) {
    super(source.x, source.y, source.color);
    this.width = source.width;
  }
  public width: number = 0;
  clone(): Shape {
    return new Rectangle(this);
  }
}
```

## Payoff

- **Efficiency:** Cloning is often cheaper than full initialization.
- **Abstraction:** You can clone objects without knowing their specific types.
