---
name: code-smells/dispensables
description: >
  Detect and remove Dispensables — pointless and unneeded code elements.
  Trigger: When identifying Comments as deodorant, Duplicate Code, Lazy Class, Data Class, Dead Code, or Speculative Generality.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Reviewing code for unnecessary elements and duplication'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Detect and Refactor Dispensables

## Purpose

This skill enables the agent to identify and remove "Dispensables" — pointless and unneeded code elements whose absence makes the codebase cleaner, more efficient, and easier to understand.

## Domain Knowledge: The 6 Dispensables

1. **Comments:** A method is filled with explanatory comments. Comments often act as a "deodorant" for fishy code that should be improved instead.
2. **Duplicate Code:** Two code fragments look almost identical. Usually occurs through copy-paste programming or multiple developers working on the same feature.
3. **Lazy Class:** A class that doesn't do enough to earn the cost of its maintenance.
4. **Data Class:** A class containing only fields and basic accessors (getters/setters). These are mere containers that cannot independently operate on their data.
5. **Dead Code:** Variables, parameters, fields, methods, or classes that are no longer used.
6. **Speculative Generality:** Unused classes, methods, or parameters created "just in case" for future features that never arrived.

## Procedural Instructions

### 1. Detection Phase

- **Audit Comments:** Identify code fragments that cannot be understood without comments. If a comment explains _what_ the code does, it's a candidate for refactoring.
- **Scan for Duplication:** Look for similar logic in different methods of the same class or across different classes in the same hierarchy.
- **Evaluate Class Value:** Identify classes that have become ridiculously small after refactoring or were designed for features that don't exist.
- **Check Behavioral Encapsulation:** Identify classes that only hold data and lack methods for operating on that data.
- **Locate Dead Elements:** Use static analysis to find methods or variables that are never called or referenced.

### 2. Treatment Phase

- **For Comments:**
  - Use **Extract Variable** for complex expressions.
  - Use **Extract Method** and **Rename Method** to make the code self-explanatory.
- **For Duplicate Code:**
  - Use **Extract Method** to centralize logic.
  - Use **Pull Up Field/Method** if duplication is in subclasses.
  - Use **Substitute Algorithm** if two methods do the same thing differently.
- **For Lazy Classes & Speculative Generality:**
  - Use **Inline Class** or **Collapse Hierarchy** to merge or delete the redundant structure.
  - Use **Inline Method** or **Remove Parameter** for unused elements.
- **For Data Classes:**
  - Use **Encapsulate Field** to hide public fields.
  - Use **Move Method** and **Extract Method** to migrate functionality from the client into the Data Class itself.

## TypeScript Examples

### Comments vs. Self-Explanatory Code

```typescript
// BAD: Comment explaining a complex expression
// Check to see if the employee is eligible for full benefits
if (employee.flags & HOURLY_FLAG && employee.age > 65) {
  /* ... */
}

// GOOD: Refactored using Extract Variable
const isEligibleForFullBenefits =
  employee.flags & HOURLY_FLAG && employee.age > 65;
if (isEligibleForFullBenefits) {
  /* ... */
}
```

### Data Class to Rich Domain Object

```typescript
// BAD: A Data Class with no behavior
class Rectangle {
  constructor(
    public width: number,
    public height: number,
  ) {}
}
const rect = new Rectangle(10, 20);
const area = rect.width * rect.height; // Client does the work

// GOOD: Behavior moved into the class
class Rectangle {
  constructor(
    private width: number,
    private height: number,
  ) {}

  getArea(): number {
    return this.width * this.height;
  }
}
```

## Payoff

- **Reduced Size:** The codebase becomes slimmer and easier to navigate.
- **Lower Maintenance:** Fewer classes and methods mean less mental bandwidth required.
- **Improved Clarity:** Code becomes intuitive, making comments unnecessary and logic obvious.
