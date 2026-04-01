---
name: pattern-strategy
description: >
  Teaches and applies the Strategy behavioral design pattern — defining a family of
  algorithms, encapsulating each one, and making them interchangeable at runtime.
  Trigger: When implementing interchangeable algorithms, sorting strategies, or payment methods.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'strategy pattern, interchangeable algorithms, runtime behavior swap'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Strategy Pattern

## Purpose

Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

## Procedural Instructions

1. **Identify Variant Algorithms:** Look for a class that performs a task in multiple different ways.
2. **Declare Strategy Interface:** Define a common method for executing the algorithm.
3. **Implement Concrete Strategies:** Place each variation of the algorithm into its own class.
4. **Update Context:** The original class stores a reference to a Strategy and delegates work to it.
5. **Set Strategy at Runtime:** Provide a setter in the Context so the client can swap strategies.

## TypeScript Example

```typescript
interface RouteStrategy {
  buildRoute(a: string, b: string): void;
}

class WalkingStrategy implements RouteStrategy {
  buildRoute(a: string, b: string) {
    console.log('Walking route...');
  }
}

class Navigator {
  // Context
  private strategy!: RouteStrategy;
  setStrategy(s: RouteStrategy) {
    this.strategy = s;
  }
  calculate(a: string, b: string) {
    this.strategy.buildRoute(a, b);
  }
}
```

## Payoff

- **Flexibility:** Switch algorithms used inside an object at runtime.
- **Isolation:** Separates the implementation details of an algorithm from the code that uses it.
