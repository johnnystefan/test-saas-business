---
name: refactoring/simplifying-method-calls
description: >
  Improve method interfaces by renaming, separating queries from modifiers, and introducing parameter objects.
  Trigger: When cleaning up method signatures, implementing CQRS, or reducing parameter lists.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Refactoring method signatures or separating queries from modifiers'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Refactoring — Simplifying Method Calls

## Purpose

This skill enables the agent to improve the interfaces of class methods. By simplifying how methods are called and what they return, the agent reduces the mental load for developers and makes the system's internal API more intuitive and robust.

## Procedural Instructions

### 1. Refine Method Signatures

- **Rename Method:** If a name doesn't explain what a method does, rename it to a descriptive one (e.g., `createOrder()`, `renderCustomerInfo()`).
- **Add/Remove Parameter:** Add parameters only when a method lacks necessary data; remove them if they are unused in the method body.
- **Hide Method:** If a method is only used within its own class or hierarchy, make it `private` or `protected` to reduce the public surface area.

### 2. Manage Logic and Parameters

- **Separate Query from Modifier:** Split methods that both return a value and change an object's state. One method should be a "Query" (no side effects) and the other a "Modifier."
- **Parameterize Method:** If multiple methods do similar things with different values, combine them into one method that accepts those values as parameters.
- **Replace Parameter with Explicit Methods:** If a method's behavior is dictated by a flag/parameter, split it into separate, explicitly named methods (e.g., `setHeight(val)` instead of `setValue('height', val)`).
- **Preserve Whole Object:** Instead of extracting several values from an object to pass as parameters, pass the entire object to simplify the call.
- **Introduce Parameter Object:** If a group of parameters is repeatedly passed together, replace them with a single object (e.g., `DateRange` instead of separate `start` and `end` dates).

### 3. Improve Object Creation and Error Handling

- **Replace Constructor with Factory Method:** Use a static factory method if the construction logic is complex or needs to return different subclasses.
- **Replace Error Code with Exception:** Instead of returning special error values (like `-1`), throw specific exceptions to separate normal execution flow from error handling.
- **Replace Exception with Test:** If an exception is being used for a case that can be easily checked with a simple conditional, use the test instead.

## TypeScript Examples

### Separate Query from Modifier (CQRS)

```typescript
// BEFORE: Method gets data AND changes state (side effect)
getTotalOutstandingAndSetReady(): number {
  this.isReady = true;         // Modifier
  return this.calculateTotal(); // Query
}

// AFTER: Responsibilities split
getTotalOutstanding(): number {
  return this.calculateTotal();
}
setReady(): void {
  this.isReady = true;
}
```

### Introduce Parameter Object

```typescript
// BEFORE: Repeating group of parameters
amountInvoicedIn(start: Date, end: Date): number { /* ... */ }
amountOverdueIn(start: Date, end: Date): number { /* ... */ }

// AFTER: Parameters grouped into an immutable object
class DateRange {
  constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {}
}

amountInvoicedIn(range: DateRange): number { /* ... */ }
amountOverdueIn(range: DateRange): number { /* ... */ }
```

### Replace Error Code with Exception

```typescript
// BEFORE: Returning special values for errors
withdraw(amount: number): number {
  if (amount > this.balance) return -1;
  this.balance -= amount;
  return 0;
}

// AFTER: Using proper exception handling
withdraw(amount: number): void {
  if (amount > this.balance) {
    throw new InsufficientFundsError();
  }
  this.balance -= amount;
}
```

## Payoff

- **Intuitive API:** Method names and signatures clearly communicate intent.
- **Reduced Coupling:** Passing objects or parameter objects makes signatures more resilient to changes.
- **Clean Flow:** Separating queries from modifiers and using exceptions instead of error codes results in much cleaner calling code.
