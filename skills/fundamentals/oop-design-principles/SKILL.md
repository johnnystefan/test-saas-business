---
name: fundamentals/oop-design-principles
description: >
  Apply core OOP design principles: Encapsulate What Varies, Program to an Interface, Favor Composition over Inheritance.
  Trigger: When designing extensible systems, refactoring brittle hierarchies, or evaluating coupling.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Designing extensible architecture or evaluating inheritance vs composition'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Object-Oriented Design Principles

## Purpose

This skill provides the agent with three fundamental principles for high-quality software design: separating volatile code from stable code, reducing coupling through abstractions, and choosing flexible object relationships over rigid hierarchies.

## Procedural Instructions

### 1. Encapsulate What Varies

- **Goal:** Minimize the effect of changes by isolating unstable parts of the application.
- **Agent Task:** Identify code sections likely to change (e.g., tax laws, payment providers, export formats).
- **Action:**
  - **Method Level:** Extract the varying logic into a separate method (e.g., move tax calculation out of `getOrderTotal`).
  - **Class Level:** If the logic becomes too complex, extract it into a dedicated class (e.g., a `TaxCalculator` class).

### 2. Program to an Interface, Not an Implementation

- **Goal:** Ensure the design is extensible without breaking existing code by depending on abstractions.
- **Agent Task:** Check if Class A is directly dependent on concrete Class B.
- **Action:**
  1. Determine what Class A specifically needs from Class B.
  2. Describe those methods in a new **Interface** or **Abstract Class**.
  3. Make Class B implement this interface.
  4. Change Class A to depend on the Interface instead of the concrete class.

### 3. Favor Composition Over Inheritance

- **Goal:** Avoid the combinatorial explosion of subclasses and tight coupling inherent in deep inheritance.
- **Agent Task:** Analyze if a class hierarchy is growing in multiple independent dimensions (e.g., Type + Color + Material).
- **Action:**
  - Identify "is-a" relationships that could be replaced with "has-a" relationships.
  - Extract dimensions into separate hierarchies and have the primary class contain a reference to them.
  - Use delegation to allow changing behaviors at runtime by switching the contained object.

## TypeScript Examples

### Encapsulate What Varies

```typescript
// BAD: Tax logic embedded directly — changes here break the whole order
class Order {
  getTotal(items: Item[]): number {
    const subtotal = items.reduce((sum, i) => sum + i.price, 0);
    return subtotal * 1.21; // Tax hardcoded — what happens with different regions?
  }
}

// GOOD: Tax logic isolated — swap TaxCalculator without touching Order
interface TaxCalculator {
  calculate(subtotal: number): number;
}
class StandardTax implements TaxCalculator {
  calculate(subtotal: number) {
    return subtotal * 0.21;
  }
}
class Order {
  constructor(private tax: TaxCalculator) {}
  getTotal(items: Item[]): number {
    const subtotal = items.reduce((sum, i) => sum + i.price, 0);
    return subtotal + this.tax.calculate(subtotal);
  }
}
```

### Program to an Interface

```typescript
// BAD: Company depends on a concrete Designer
class Company {
  private employee = new Designer();
  createSoftware() {
    this.employee.doWork();
  }
}

// GOOD: Company depends on the Employee interface
interface Employee {
  doWork(): void;
}
class Designer implements Employee {
  doWork() {
    /* ... */
  }
}
class Developer implements Employee {
  doWork() {
    /* ... */
  }
}

class Company {
  constructor(private employees: Employee[]) {}
  createSoftware() {
    this.employees.forEach((e) => e.doWork());
  }
}
```

### Favor Composition Over Inheritance

```typescript
// BAD: Class explosion — SportsCar, ElectricSportsCar, ElectricSUV...
class Car extends Vehicle {
  /* ... */
}
class SportsCar extends Car {
  /* ... */
}
class ElectricSportsCar extends SportsCar {
  /* ... */
}

// GOOD: Compose behaviors independently
interface Engine {
  start(): void;
}
class ElectricEngine implements Engine {
  start() {
    /* ... */
  }
}
class GasEngine implements Engine {
  start() {
    /* ... */
  }
}

class Car {
  constructor(private engine: Engine) {}
  start() {
    this.engine.start();
  }
}
```

## Payoff

- **Resilience:** Changes to volatile logic don't affect the stable parts of the system.
- **Flexibility:** New functionality can be added by implementing interfaces without modifying existing client code.
- **Maintainability:** Reduces the complexity of large class hierarchies and clarifies object responsibilities.
