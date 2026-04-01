---
name: fundamentals/solid-principles
description: >
  Evaluate and apply SOLID principles: SRP, OCP, LSP, ISP, DIP.
  Trigger: When reviewing architecture for maintainability, designing new modules, or refactoring toward cleaner dependencies.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Reviewing or applying SOLID principles to architecture or class design'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Apply SOLID Principles

## Purpose

This skill equips the agent with the SOLID principles framework to evaluate software architecture and guide refactoring processes toward more maintainable, flexible, and scalable code.

## The SOLID Framework

### 1. S — Single Responsibility Principle (SRP)

- **Concept:** A class should have only one reason to change.
- **Agent Task:** Identify classes performing unrelated tasks.
- **Refactoring:** Use **Extract Class** to move unrelated behaviors to a separate component.

### 2. O — Open/Closed Principle (OCP)

- **Concept:** Classes should be open for extension but closed for modification.
- **Agent Task:** Look for code where adding a new variant requires changing a complex `switch` or `if-else` block.
- **Refactoring:** Apply the **Strategy** or **Decorator** patterns to allow adding new behaviors without altering original classes.

### 3. L — Liskov Substitution Principle (LSP)

- **Concept:** Subclasses must be substitutable for their base classes without breaking the client code.
- **Agent Task:** Check if a subclass throws exceptions for inherited methods it cannot support.
- **Refactoring:** Redesign the hierarchy so the subclass only extends what it can actually support.

### 4. I — Interface Segregation Principle (ISP)

- **Concept:** Clients should not be forced to depend on methods they do not use.
- **Agent Task:** Identify "fat" interfaces that force implementing classes to leave methods empty.
- **Refactoring:** Break the large interface into several smaller, more specific ones.

### 5. D — Dependency Inversion Principle (DIP)

- **Concept:** High-level modules should not depend on low-level modules; both should depend on abstractions.
- **Agent Task:** Look for high-level business logic directly instantiating low-level classes.
- **Refactoring:** Create an **Interface** for the low-level service and inject it into the high-level class.

## TypeScript Examples

### Single Responsibility (SRP)

```typescript
// BAD: Class manages data AND printing
class Employee {
  constructor(public name: string) {}
  getEmployeeData() {
    /* ... */
  }
  printTimeSheetReport() {
    /* UI concern — wrong place */
  }
}

// GOOD: Responsibilities separated
class Employee {
  constructor(public name: string) {}
}
class TimeSheetReport {
  print(employee: Employee) {
    /* ... */
  }
}
```

### Open/Closed (OCP)

```typescript
// BAD: Adding a shipping method requires modifying this class
class Order {
  getShippingCost(method: string) {
    if (method === 'ground') return 10;
    if (method === 'air') return 20;
    return 0;
  }
}

// GOOD: Strategy pattern — extend without modifying
interface Shipping {
  getCost(): number;
}
class GroundShipping implements Shipping {
  getCost() {
    return 10;
  }
}
class AirShipping implements Shipping {
  getCost() {
    return 20;
  }
}

class Order {
  getShippingCost(shipping: Shipping) {
    return shipping.getCost();
  }
}
```

### Liskov Substitution (LSP)

```typescript
// BAD: ReadOnlyDocument breaks when save is called
class Document {
  save() {
    console.log('Saved');
  }
}
class ReadOnlyDocument extends Document {
  save() {
    throw new Error('Cannot save a read-only document');
  }
}

// GOOD: Hierarchy reflects actual capabilities
class Document {
  /* common props */
}
class WritableDocument extends Document {
  save() {
    console.log('Saved');
  }
}
```

### Interface Segregation (ISP)

```typescript
// BAD: Simple storage forced to implement unrelated server logic
interface CloudProvider {
  storeFile(): void;
  getServers(): void;
}

// GOOD: Smaller, specific interfaces
interface FileStorage {
  storeFile(): void;
}
interface ServerManager {
  getServers(): void;
}

class Dropbox implements FileStorage {
  storeFile() {
    /* ... */
  }
}
```

### Dependency Inversion (DIP)

```typescript
// BAD: High-level class depends on a concrete MySQL database
class BudgetReport {
  private database = new MySQLDatabase();
  open() {
    this.database.connect();
  }
}

// GOOD: High-level class depends on an interface
interface IDatabase {
  connect(): void;
}
class MySQLDatabase implements IDatabase {
  connect() {
    /* ... */
  }
}

class BudgetReport {
  constructor(private database: IDatabase) {}
  open() {
    this.database.connect();
  }
}
```

## Payoff

- **Maintainability:** Changes in one area don't break unrelated business logic.
- **Scalability:** New features can be added by creating new classes instead of modifying existing, tested code.
- **Clarity:** Smaller, specialized interfaces and classes are easier for agents and humans to understand.
