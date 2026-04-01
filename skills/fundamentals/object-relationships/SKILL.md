---
name: fundamentals/object-relationships
description: >
  Identify and implement correct relationships between classes: Dependency, Association, Aggregation, and Composition.
  Trigger: When designing class structures, reviewing coupling, or deciding between inheritance and composition.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Designing class relationships or reviewing object lifecycle ownership'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Identify and Implement Object Relationships

## Purpose

This skill enables the agent to distinguish between different types of connections between classes. Understanding these relationships leads to better architectural decisions, such as choosing between inheritance and composition or identifying tight coupling.

## Relationship Types

### 1. Dependency

- **Definition:** The weakest relationship. Class A depends on Class B if changes to B's definition might affect A. Typically happens when Class B is used as a local variable, a parameter, or an instantiation inside a method.
- **Agent Task:** Identify if a class is "using" another only temporarily within a specific scope.

### 2. Association

- **Definition:** "Object A knows Object B." Typically represented as a permanent field in a class. Can be unidirectional or bidirectional.
- **Agent Task:** Check if a class maintains a permanent reference to another object through its member variables.

### 3. Aggregation

- **Definition:** A specialized association representing "whole-part" relationships where the "part" can exist independently of the "whole" (e.g., a Professor belongs to a Department but exists even if the Department is deleted).
- **Agent Task:** Determine if the child object's lifecycle is independent of its container.

### 4. Composition

- **Definition:** A strict "whole-part" relationship where the "part" is managed by the "whole." The component cannot exist without its container (e.g., a Room exists only as part of a House).
- **Agent Task:** Verify if the container class is responsible for creating and destroying the component.

## Procedural Instructions

- **Audit Connections:** When reviewing two related classes, determine the strength of the bond:
  - If Class B is only used as a parameter or local variable → **Dependency**
  - If Class B is stored as a field → **Association**
- **Lifecycle Check:** If an association exists, determine the child's survival:
  - If the child can live without the container → **Aggregation**
  - If the parent controls creation and destruction → **Composition**
- **Refactoring Hint:** When you see a Message Chain smell (`a.b().c().d()`), suggest using **Hide Delegate** to simplify the relationship.

## TypeScript Examples

```typescript
// DEPENDENCY — Order uses DataFormatter only as a method argument
class Order {
  print(formatter: DataFormatter) {
    formatter.format(this);
  }
}

// ASSOCIATION — Student knows about a specific Teacher via a field
class Student {
  private teacher: Teacher;
  constructor(teacher: Teacher) {
    this.teacher = teacher;
  }
}

// AGGREGATION — Professors are part of a Dept, but exist outside of it
class Department {
  private professors: Professor[] = [];
  addProfessor(p: Professor) {
    this.professors.push(p);
  }
}

// COMPOSITION — Rooms are created and managed by House; they die with it
class House {
  private rooms: Room[] = [];
  constructor() {
    this.rooms.push(new Room('Kitchen'));
    this.rooms.push(new Room('Bedroom'));
  }
}
```

## Payoff

- **Clarity:** Clearer understanding of how objects interact.
- **Decoupling:** Easier identification of tight coupling that should be reduced to simple dependencies.
- **Maintenance:** Better management of object lifecycles to prevent memory leaks.
