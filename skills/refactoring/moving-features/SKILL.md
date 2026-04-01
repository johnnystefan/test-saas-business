---
name: refactoring/moving-features
description: >
  Safely redistribute functionality among classes — move methods/fields, extract/inline classes, hide delegates.
  Trigger: When redistributing responsibilities, improving class cohesion, or reducing coupling between objects.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Moving methods or fields between classes to improve cohesion'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Moving Features Between Objects

## Purpose

This skill enables the agent to safely redistribute functionality among classes, create new classes, and hide implementation details from public access. It addresses architectural issues where classes have become less coherent or where dependencies between classes are unnecessarily high.

## Procedural Instructions

### 1. Relocate Methods and Fields

- **Move Method:** If a method is used more by another class than its own, create the method in the target class and move the logic there. Turn the original into a simple reference or delete it.
- **Move Field:** When a field is used more frequently in another class, create the field in the target class and redirect all callers.

### 2. Manage Class Responsibilities

- **Extract Class:** If one class is doing the work of two, create a new class and move the relevant fields and methods responsible for that specific functionality into it.
- **Inline Class:** If a class does almost nothing and has no future responsibilities planned, move all its features into another class and delete the redundant one.

### 3. Encapsulate and Simplify Relationships

- **Hide Delegate:** To reduce client dependency on object navigation, create a new method in the "server" class that delegates calls to the "delegate" object — so the client doesn't need to know about it.
- **Remove Middle Man:** If a class has too many methods that simply delegate to other objects, delete these methods and have the client call the end objects directly.

### 4. Handle External Libraries

- **Introduce Foreign Method:** If a read-only utility class lacks a method you need, add the method to your client class and pass the utility object as an argument.
- **Introduce Local Extension:** If a utility class requires several new methods, create a new class as a subclass or wrapper to house the additional functionality.

## TypeScript Examples

### Hide Delegate (Encapsulation)

```typescript
// BEFORE: Client is dependent on the Department class structure
const manager = person.getDepartment().getManager();

// AFTER: Person hides the delegation to Department
class Person {
  private department: Department;

  getManager(): Manager {
    return this.department.getManager();
  }
}
const manager = person.getManager();
```

### Move Method (Improving Coherence)

```typescript
// BEFORE: Account has logic better suited for AccountType
class Account {
  private type: AccountType;
  private daysOverdrawn: number;

  overdraftCharge(): number {
    if (this.type.isPremium()) {
      let result = 10;
      if (this.daysOverdrawn > 7) result += (this.daysOverdrawn - 7) * 0.85;
      return result;
    }
    return this.daysOverdrawn * 1.75;
  }
}

// AFTER: Logic moved to AccountType where it belongs
class AccountType {
  overdraftCharge(daysOverdrawn: number): number {
    if (this.isPremium()) {
      let result = 10;
      if (daysOverdrawn > 7) result += (daysOverdrawn - 7) * 0.85;
      return result;
    }
    return daysOverdrawn * 1.75;
  }
}
```

## Payoff

- **Internal Coherence:** Classes remain focused as methods and fields live where they are most used.
- **Reduced Coupling:** Dependencies between classes are simplified, making the system more flexible.
- **Maintainability:** Cleaner object relationships reduce the ripple effect of future changes.
