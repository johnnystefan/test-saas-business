---
name: refactoring/generalization
description: >
  Manage class hierarchies by pulling up, pushing down, extracting interfaces, and switching between inheritance and delegation.
  Trigger: When refactoring class hierarchies, extracting superclasses/interfaces, or resolving Liskov violations.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Refactoring class hierarchies or managing inheritance structures'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Refactoring — Dealing with Generalization

## Purpose

This skill enables the agent to manage software abstraction and class hierarchies. It provides instructions for moving fields and methods between superclasses and subclasses, extracting interfaces, and switching between inheritance and delegation to ensure a clean, maintainable architecture.

## Procedural Instructions

### 1. Optimize Hierarchies (Moving Up and Down)

- **Pull Up Field/Method:** If multiple subclasses have identical fields or methods, move them to the superclass to eliminate duplication.
- **Pull Up Constructor Body:** Extract common code from subclass constructors into a superclass constructor and call it using `super()`.
- **Push Down Field/Method:** If a behavior or field in a superclass is only used by one or a few subclasses, move it down to those specific subclasses to improve class coherence.

### 2. Extracting and Merging Structures

- **Extract Subclass:** If a class has features used only in rare cases, create a subclass to house that specific logic.
- **Extract Superclass:** If two classes share common features, create a shared superclass and move the commonalities there.
- **Extract Interface:** When multiple clients use the same subset of a class interface, or two classes share part of their interface, move that portion to a separate interface.
- **Collapse Hierarchy:** If a subclass and superclass have become practically identical over time, merge them into a single class.

### 3. Advanced Behavioral Abstraction

- **Form Template Method:** If subclasses implement algorithms with similar steps in the same order, move the structure to the superclass and leave implementation details to the subclasses.
- **Replace Inheritance with Delegation:** If a subclass uses only a portion of the superclass methods (violating Liskov Substitution), replace the "is-a" relationship with a "has-a" relationship.
- **Replace Delegation with Inheritance:** If a class delegates all its methods to another class, simplify the design by making the delegating class a subclass.

## TypeScript Examples

### Extract Interface

```typescript
// BEFORE: High coupling to the concrete class
class Employee {
  getRate(): number {
    return 100;
  }
  getName(): string {
    return 'John';
  }
  getDepartment(): string {
    return 'IT';
  }
}

// AFTER: Interface allows for more flexible client usage
interface Billable {
  getRate(): number;
}

class Employee implements Billable {
  getRate(): number {
    return 100;
  }
  getName(): string {
    return 'John';
  }
  getDepartment(): string {
    return 'IT';
  }
}
```

### Replace Inheritance with Delegation

```typescript
// BEFORE: Stack inherits many unneeded methods from Vector
class Stack extends Vector {
  push(item: unknown) {
    this.add(item);
  }
  pop() {
    return this.remove(this.size() - 1);
  }
}

// AFTER: Stack uses Vector as a helper, not a parent
class Stack {
  private vector: Vector = new Vector();

  push(item: unknown) {
    this.vector.add(item);
  }
  pop() {
    return this.vector.remove(this.vector.size() - 1);
  }
  isEmpty() {
    return this.vector.isEmpty();
  }
}
```

### Form Template Method

```typescript
// AFTER: Algorithm structure moved to the superclass
abstract class Site {
  // Template Method — algorithm skeleton defined here
  getBillableAmount(): number {
    return this.getBaseAmount() + this.getTaxAmount();
  }
  abstract getBaseAmount(): number;
  abstract getTaxAmount(): number;
}

class ResidentialSite extends Site {
  getBaseAmount() {
    return this.units * this.rate;
  }
  getTaxAmount() {
    return this.getBaseAmount() * 0.05;
  }
}
```

## Payoff

- **Deduplication:** Common behavior is centralized in superclasses or interfaces.
- **Flexibility:** Switching to delegation allows for dynamic behavior changes at runtime.
- **Clarity:** Hierarchies reflect real "is-a" relationships, making the code intuitive.
