---
name: code-smells/couplers
description: >
  Detect and refactor Couplers — excessive coupling or over-delegation between classes.
  Trigger: When identifying Feature Envy, Inappropriate Intimacy, Message Chains, or Middle Man.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Reviewing coupling and class communication patterns'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Detect and Refactor Couplers

## Purpose

This skill enables the agent to identify "Couplers" — code smells that represent excessive coupling between classes or the side effects of trying to avoid it through excessive delegation. The agent will apply specific refactoring techniques to ensure classes remain independent, maintainable, and respect the principle of encapsulation.

## Domain Knowledge: The 4 Couplers

1. **Feature Envy:** A method that seems more interested in the data of another class than in its own.
2. **Inappropriate Intimacy:** Two classes that are too closely intertwined, spending too much time delving into each other's private or internal parts.
3. **Message Chains:** A client requests one object, that object requests another, and so on (e.g., `a.getB().getC().doSomething()`).
4. **Middle Man:** A class that performs only one action: delegating work to another class.

## Procedural Instructions

### 1. Detection Phase

- **Audit Data Access:** Identify methods that invoke more than half of their calls to getters or fields of another object.
- **Check Access Levels:** Look for classes that frequently access `protected` or `public` fields of another class instead of interacting through a clean interface.
- **Identify Navigation Paths:** Scan for "long navigation" code patterns where an object navigates a deep relationship structure to perform a task.
- **Spot "Hollow" Classes:** Look for classes where most methods contain nothing but a call to a method in a different object.

### 2. Treatment Phase

- **For Feature Envy:**
  - Use **Move Method** to relocate the envious method to the class that owns the data it uses.
  - If only part of the method is envious, use **Extract Method** on that part before moving it.
- **For Inappropriate Intimacy:**
  - Use **Move Method** and **Move Field** to move shared pieces to the class that uses them most.
  - Use **Hide Delegate** to make relationships official and encapsulated.
  - If the classes are mutually dependent, use **Change Bidirectional Association to Unidirectional**.
- **For Message Chains:**
  - Use **Hide Delegate** so the client doesn't need to know about intermediate objects.
  - Sometimes better to **Extract Method** for the final behavior and **Move Method** it to the start of the chain.
- **For Middle Man:**
  - Use **Remove Middle Man** to allow the client to call the end object directly if the delegation adds no value.

## TypeScript Examples

### Feature Envy

```typescript
// BAD: printUserAddress is more interested in User data than its own class
class AddressPrinter {
  printUserAddress(user: User) {
    const city = user.getCity();
    const street = user.getStreet();
    const zip = user.getZipCode();
    console.log(`${street}, ${city} - ${zip}`);
  }
}

// GOOD: Logic moved to the data owner using Move Method
class User {
  getFullAddress(): string {
    return `${this.street}, ${this.city} - ${this.zipCode}`;
  }
}

class AddressPrinter {
  printUserAddress(user: User) {
    console.log(user.getFullAddress());
  }
}
```

### Message Chains vs. Hide Delegate

```typescript
// BAD: Coupled to the internal structure of Department and Manager
const managerName = employee.getDepartment().getManager().getName();

// GOOD: Employee encapsulates the navigation
class Employee {
  getManagerName(): string {
    return this.department.getManager().getName();
  }
}
const managerName = employee.getManagerName();
```

## Payoff

- **Independence:** Classes can be modified or reused without triggering a ripple effect in related objects.
- **Simpler Maintenance:** Reduces the complexity of navigating object structures.
- **Better Encapsulation:** Internal details of classes remain hidden from the outside world.
