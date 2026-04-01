---
name: pattern-flyweight
description: >
  Teaches and applies the Flyweight structural design pattern — minimizing memory usage
  by sharing common state between multiple fine-grained objects.
  Trigger: When dealing with large numbers of similar objects consuming too much memory.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'flyweight pattern, shared state, memory optimization'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Flyweight Pattern

## Purpose

Minimizes memory usage by sharing common parts of state between multiple objects instead of keeping all data in each object.

## Procedural Instructions

1. **Split State:** Divide fields into **Intrinsic** (constant/shared) and **Extrinsic** (unique/contextual).
2. **Create Flyweight:** A class that stores only intrinsic state.
3. **Implement Factory:** A factory that manages a pool of existing flyweights to ensure reuse.
4. **Client Responsibility:** Clients must store or calculate extrinsic state and pass it to flyweight methods.

## TypeScript Example

```typescript
// Shared state (Flyweight)
class TreeType {
  constructor(
    private name: string,
    private color: string,
  ) {}
  draw(x: number, y: number) {
    /* Draw logic */
  }
}

// Factory manages sharing
class TreeFactory {
  private static types: Map<string, TreeType> = new Map();
  static getTreeType(name: string, color: string) {
    let type = this.types.get(name + color);
    if (!type) {
      type = new TreeType(name, color);
      this.types.set(name + color, type);
    }
    return type;
  }
}

// Context stores unique state
class Tree {
  constructor(
    private x: number,
    private y: number,
    private type: TreeType,
  ) {}
  draw() {
    this.type.draw(this.x, this.y);
  }
}
```

## Payoff

- **Efficiency:** Massive reduction in RAM usage when dealing with millions of objects.
