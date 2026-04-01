---
name: pattern-abstract-factory
description: >
  Teaches and applies the Abstract Factory creational design pattern — producing families
  of related objects without specifying their concrete classes, ensuring product compatibility.
  Trigger: When creating families of related objects or enforcing product compatibility constraints.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'abstract factory pattern, product families, object creation'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Abstract Factory Pattern

## Purpose

Allows producing families of related objects without specifying their concrete classes. It ensures that the products you obtain from a factory are compatible with each other.

## Procedural Instructions

1. **Map Product Families:** Identify groups of related products (e.g., Victorian Chair + Victorian Sofa).
2. **Declare Abstract Interfaces:** Create interfaces for each distinct product type in the family.
3. **Declare Abstract Factory:** An interface with creation methods for all abstract products.
4. **Implement Concrete Factories:** One factory per variant (e.g., ModernFactory, VictorianFactory).

## TypeScript Example

```typescript
interface Chair {
  hasLegs(): boolean;
}
interface Sofa {
  hasCushions(): boolean;
}

// Abstract Factory
interface FurnitureFactory {
  createChair(): Chair;
  createSofa(): Sofa;
}

// Concrete Family: ArtDeco
class ArtDecoChair implements Chair {
  hasLegs() {
    return true;
  }
}
class ArtDecoSofa implements Sofa {
  hasCushions() {
    return true;
  }
}

class ArtDecoFactory implements FurnitureFactory {
  createChair(): Chair {
    return new ArtDecoChair();
  }
  createSofa(): Sofa {
    return new ArtDecoSofa();
  }
}
```

## Payoff

- **Consistency:** Guarantees products from the same factory are compatible.
- **Decoupling:** Client code only interacts with interfaces, not concrete implementations.
