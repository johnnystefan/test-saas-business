---
name: pattern-builder
description: >
  Teaches and applies the Builder creational design pattern — constructing complex objects
  step by step, allowing different representations using the same construction process.
  Trigger: When building complex objects with many optional parameters or multi-step construction.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'builder pattern, fluent builder, step by step construction'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Builder Pattern

## Purpose

Constructs complex objects step by step. It allows producing different types and representations of an object using the same construction code.

## Procedural Instructions

1. **Identify Multi-step Creation:** Look for "Telescoping Constructors" (too many parameters).
2. **Create Builder Interface:** List all possible construction steps.
3. **Implement Concrete Builders:** Define how each step is executed for a specific representation.
4. **Director (Optional):** Define the order of steps for common configurations.

## TypeScript Example

```typescript
class Car {
  public seats: number = 0;
  public engine: string = '';
  public gps: boolean = false;
}

interface Builder {
  reset(): void;
  setSeats(n: number): void;
  setEngine(e: string): void;
  setGPS(g: boolean): void;
}

class CarBuilder implements Builder {
  private car: Car = new Car();
  reset() {
    this.car = new Car();
  }
  setSeats(n: number) {
    this.car.seats = n;
  }
  setEngine(e: string) {
    this.car.engine = e;
  }
  setGPS(g: boolean) {
    this.car.gps = g;
  }
  getProduct(): Car {
    return this.car;
  }
}
```

## Payoff

- **Control:** Finer control over the construction process.
- **Reusability:** Same construction code can build different products.
