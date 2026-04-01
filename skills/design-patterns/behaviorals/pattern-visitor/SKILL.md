---
name: pattern-visitor
description: >
  Teaches and applies the Visitor behavioral design pattern — separating an algorithm
  from the object structure it operates on, enabling new operations without modifying existing classes.
  Trigger: When adding operations to a stable class hierarchy without modifying those classes.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'visitor pattern, double dispatch, object structure operations'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Visitor Pattern

## Purpose

Separates an algorithm from the object structure on which it operates, allowing you to add new operations to existing object structures without modifying them.

## Procedural Instructions

1. **Declare Visitor Interface:** Define a "visit" method for each class in the object structure.
2. **Declare Element Interface:** Add an `accept(visitor)` method to the base of the object structure.
3. **Implement Accept in Elements:** Each concrete class calls the visitor method corresponding to its own class (`Double Dispatch`).
4. **Implement Concrete Visitors:** Create a class for each new operation that needs to be performed across the object structure.

## TypeScript Example

```typescript
interface Shape {
  accept(v: Visitor): void;
}

class Circle implements Shape {
  accept(v: Visitor) {
    v.visitCircle(this);
  }
}

interface Visitor {
  visitCircle(c: Circle): void;
  visitRectangle(r: Rectangle): void;
}

class XMLExportVisitor implements Visitor {
  visitCircle(c: Circle) {
    console.log('Exporting Circle to XML...');
  }
  visitRectangle(r: Rectangle) {
    /* ... */
  }
}
```

## Payoff

- **OCP:** Add new behaviors that work with objects of different classes without changing those classes.
- **SRP:** Moves multiple versions of the same behavior into a single Visitor class.
