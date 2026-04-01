---
name: refactoring/simplifying-conditionals
description: >
  Streamline complex conditional logic using guard clauses, decomposition, and polymorphism.
  Trigger: When simplifying nested conditionals, replacing switch/if-else chains, or introducing guard clauses.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Refactoring nested conditionals or replacing type-based branching with polymorphism'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Refactoring — Simplifying Conditional Expressions

## Purpose

This skill enables the agent to streamline complex conditional logic. Conditionals tend to become more complicated over time; these techniques allow an agent to decompose, consolidate, and flatten logic to make it more readable and maintainable.

## Procedural Instructions

### 1. Simplify Complex Branching

- **Decompose Conditional:** If you have a complex `if-then/else` or `switch` block, extract the condition, the `then` part, and the `else` part into separate, well-named methods.
- **Replace Nested Conditional with Guard Clauses:** Identify "arrow-shaped" code caused by deep nesting. Isolate special checks and edge cases into separate guard clauses at the beginning of the method to flatten the structure.
- **Replace Conditional with Polymorphism:** If a conditional performs various actions depending on object type or properties, create subclasses with a shared method and move the corresponding code branches into those subclasses.

### 2. Consolidate Logic

- **Consolidate Conditional Expression:** When multiple conditional checks lead to the same result or action, merge them into a single expression and extract it into a method.
- **Consolidate Duplicate Conditional Fragments:** If identical code exists in all branches of a conditional, move that code outside the conditional block to remove redundancy.

### 3. Clean Up State and Assumptions

- **Remove Control Flag:** Replace boolean variables acting as control flags with explicit `break`, `continue`, or `return` statements.
- **Introduce Null Object:** If your code is littered with null checks, return a "Null Object" that exhibits default behavior instead of `null`.
- **Introduce Assertion:** For code that assumes certain values must be true to function, replace those assumptions with specific assertion checks to act as live documentation and catch bugs early.

## TypeScript Examples

### Replace Nested Conditional with Guard Clauses

```typescript
// BEFORE: "Arrow" indentation makes the normal flow hard to see
function getPayAmount(): number {
  let result: number;
  if (isDead) {
    result = deadAmount();
  } else {
    if (isSeparated) {
      result = separatedAmount();
    } else {
      if (isRetired) {
        result = retiredAmount();
      } else {
        result = normalPayAmount();
      }
    }
  }
  return result;
}

// AFTER: Guard clauses flatten the method — happy path is obvious
function getPayAmount(): number {
  if (isDead) return deadAmount();
  if (isSeparated) return separatedAmount();
  if (isRetired) return retiredAmount();
  return normalPayAmount();
}
```

### Decompose Conditional

```typescript
// BEFORE: Hard to remember what the complex date check is for
if (date.before(SUMMER_START) || date.after(SUMMER_END)) {
  charge = quantity * winterRate + winterServiceCharge;
} else {
  charge = quantity * summerRate;
}

// AFTER: Logic is self-explanatory
if (isSummer(date)) {
  charge = summerCharge(quantity);
} else {
  charge = winterCharge(quantity);
}

function isSummer(date: Date): boolean {
  return !date.before(SUMMER_START) && !date.after(SUMMER_END);
}
```

### Introduce Null Object

```typescript
// BEFORE: Null checks scattered everywhere
const plan = customer === null ? BillingPlan.basic() : customer.getPlan();

// AFTER: Polymorphism handles the "missing" case
class NullCustomer extends Customer {
  getPlan() {
    return BillingPlan.basic();
  }
}

const plan = customer.getPlan(); // Works whether customer is real or NullCustomer
```

## Payoff

- **Clarity:** Well-named methods for conditions act as live documentation.
- **Readability:** Flattened logic allows developers to understand the normal execution path at a glance.
- **Reliability:** Assertions and Null Objects prevent runtime errors caused by unexpected states.
