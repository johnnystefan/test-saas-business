---
name: code-smells/bloaters
description: >
  Detect and refactor Bloaters — code, methods, and classes that have grown too large.
  Trigger: When identifying Long Method, Large Class, Primitive Obsession, Long Parameter List, or Data Clumps.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Reviewing code for size and complexity issues'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Detect and Refactor Bloaters

## Purpose

This skill enables the agent to identify "Bloaters" — code, methods, and classes that have grown so large they are difficult to maintain and evolve. The agent will apply specific refactoring techniques to decompose these structures into smaller, more manageable units.

## Domain Knowledge: The 5 Bloaters

1. **Long Method:** A method containing too many lines of code (generally more than 10).
2. **Large Class:** A class containing an excessive number of fields, methods, or total lines of code.
3. **Primitive Obsession:** Using primitive types for simple tasks (e.g., currency, ranges, phone numbers) instead of small objects, or using constants to code information (e.g., `USER_ADMIN_ROLE = 1`).
4. **Long Parameter List:** A method with more than three or four parameters.
5. **Data Clumps:** Groups of variables that often appear together (e.g., database connection parameters).

## Procedural Instructions

### 1. Detection Phase

- **Audit Length:** Scan for any method > 10 lines or any class "wearing too many functional hats."
- **Check for Comments:** If a code fragment requires an explanatory comment, it is a candidate for extraction.
- **Validate Data Groups:** For potential Data Clumps, test if deleting one value makes the others lose meaning. If so, they belong together in an object.
- **Identify Primitive Patterns:** Look for arrays used as data records or long lists of primitive fields that could be grouped.

### 2. Treatment Phase

- **For Long Methods:**
  - Use **Extract Method** to group logic.
  - Use **Replace Temp with Query** if local variables interfere with extraction.
- **For Large Classes:**
  - Use **Extract Class** to spin off behavior into a separate component.
  - Use **Extract Interface** if the client only needs a specific subset of operations.
- **For Primitive Obsession:**
  - Use **Replace Data Value with Object**.
  - Use **Replace Type Code with Class** or **State/Strategy** if the primitive affects behavior.
- **For Long Parameter Lists & Data Clumps:**
  - Use **Introduce Parameter Object** to group related data.
  - Use **Preserve Whole Object** to pass an entire object instead of its individual fields.

## TypeScript Examples

### Primitive Obsession & Long Parameter List

```typescript
// BAD: Primitive obsession (role as number) and long parameter list
function createUser(
  name: string,
  email: string,
  phone: string,
  role: number,
  zipCode: string,
  city: string,
) {
  /* ... */
}

// GOOD: Data clump extracted to Address, role to Value Object
class Address {
  constructor(
    public zipCode: string,
    public city: string,
  ) {}
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address: Address;
}

function createUser(details: UserDetails) {
  /* ... */
}
```

## Payoff

- **Maintainability:** Classes with short methods live longer and are easier to understand.
- **Flexibility:** Using objects instead of primitives makes code more resilient to change.
- **Clarity:** Reduces the mental bandwidth required to remember large numbers of attributes.
