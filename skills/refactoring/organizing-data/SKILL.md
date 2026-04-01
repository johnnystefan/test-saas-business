---
name: refactoring/organizing-data
description: >
  Improve data handling by encapsulating fields, replacing primitives with objects, and managing type codes.
  Trigger: When refactoring primitive obsession, encapsulating public fields/collections, or replacing magic numbers.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Refactoring data structures or replacing primitives with domain objects'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Refactoring — Organizing Data

## Purpose

This skill enables the agent to improve how data is handled within a program. It focuses on replacing primitive types with specialized objects, ensuring proper encapsulation of fields and collections, and managing object relationships to reduce complexity and improve maintainability.

## Procedural Instructions

### 1. Encapsulate Data Access

- **Self Encapsulate Field:** If you are accessing private fields directly within a class, create a getter and setter. This provides flexibility for subclasses to redefine how data is retrieved or set.
- **Encapsulate Field:** If a field is public, make it private and provide access methods to protect the object's internal state.
- **Encapsulate Collection:** If a class returns a collection (array, list), do not return the collection itself. Return a read-only representation and provide specific `add`/`remove` methods.

### 2. Replace Primitives with Objects

- **Replace Data Value with Object:** When a primitive field (like a string for a phone number) starts to have its own logic or associated data, extract it into a dedicated class.
- **Replace Array with Object:** If an array is being used to store different types of data at specific indices, replace it with an object where each element is a clearly named field.
- **Replace Magic Number with Symbolic Constant:** Replace literal numbers that have specific meanings with named constants to provide live documentation.

### 3. Manage Type Codes

- **Replace Type Code with Class:** If a field contains a type code (like a number or string for roles) that doesn't affect behavior, replace it with a class to allow type hinting.
- **Replace Type Code with Subclasses/State/Strategy:** If the type code affects behavior (e.g., in switch statements), use polymorphism or the State/Strategy patterns.

### 4. Manage Object Identity and Associations

- **Change Value to Reference:** If you have many identical instances of a class representing the same real-world entity, convert them into a single reference object stored in a central registry.
- **Change Unidirectional Association to Bidirectional:** Add a missing association if two classes need to access features of each other.

## TypeScript Examples

### Replace Magic Number with Symbolic Constant

```typescript
// BEFORE: The meaning of 9.81 is not immediately obvious
function potentialEnergy(mass: number, height: number): number {
  return mass * height * 9.81;
}

// AFTER: Named constant provides context
const GRAVITATIONAL_CONSTANT = 9.81;

function potentialEnergy(mass: number, height: number): number {
  return mass * height * GRAVITATIONAL_CONSTANT;
}
```

### Encapsulate Collection

```typescript
// BEFORE: Clients can modify the courses array directly
class Student {
  public courses: string[] = [];
}

// AFTER: Access is controlled through methods
class Student {
  private _courses: string[] = [];

  get courses(): ReadonlyArray<string> {
    return this._courses;
  }

  addCourse(course: string): void {
    this._courses.push(course);
  }

  removeCourse(course: string): void {
    this._courses = this._courses.filter((c) => c !== course);
  }
}
```

### Replace Data Value with Object

```typescript
// BEFORE: Customer is just a primitive string with no behavior
class Order {
  constructor(public customer: string) {}
}

// AFTER: Customer is an object that can grow with its own behavior
class Customer {
  constructor(private name: string) {}
  getName(): string {
    return this.name;
  }
}

class Order {
  private customer: Customer;
  constructor(customerName: string) {
    this.customer = new Customer(customerName);
  }
}
```

## Payoff

- **Robustness:** Encapsulating fields and collections prevents unintended external modifications.
- **Clarity:** Symbolic constants and specialized objects make the code's intent obvious.
- **Maintainability:** Managing object lifecycles makes the system easier to evolve without breaking unrelated parts.
