---
name: refactoring/composing-methods
description: >
  Streamline methods by extracting, inlining, and decomposing long or complex logic.
  Trigger: When methods are too long, contain complex expressions, or mix multiple levels of abstraction.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Refactoring long methods or extracting variables and sub-methods'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Refactoring — Composing Methods

## Purpose

This skill enables the agent to streamline methods, remove code duplication, and simplify execution logic. It addresses the root of all evil in code: excessively long methods that conceal execution logic and are hard to change.

## Procedural Instructions

### 1. Simplify Method Structure

- **Extract Method:** If a code fragment can be grouped, move it to a separate new method and replace the old code with a call. Use names that make the method's purpose self-evident.
- **Inline Method:** If a method body is more obvious than the method itself, replace calls with the method content and delete the method.

### 2. Manage Variables and Expressions

- **Extract Variable:** For hard-to-understand expressions, place the result in a self-explanatory variable.
- **Inline Temp:** If a temporary variable is assigned a simple expression and does nothing else, replace references with the expression itself.
- **Replace Temp with Query:** Move an entire expression to a separate method. Query the method instead of using a local variable — paves the way for Extract Method.
- **Split Temporary Variable:** If a variable is used for different intermediate values, create separate variables for each unique value.

### 3. Handle Parameters and Algorithms

- **Remove Assignments to Parameters:** Use a local variable instead of assigning values to a parameter passed to the method.
- **Replace Method with Method Object:** If local variables in a long method are too intertwined for Extract Method, transform the method into a separate class where variables become fields.
- **Substitute Algorithm:** Replace a cluttered or inefficient algorithm with a simpler, clearer implementation.

## TypeScript Examples

### Extract Method

```typescript
// BEFORE: Logic mixed in one method
function printOwing() {
  printBanner();
  console.log('name: ' + name);
  console.log('amount: ' + getOutstanding());
}

// AFTER: Details extracted into their own method
function printOwing() {
  printBanner();
  printDetails(getOutstanding());
}

function printDetails(outstanding: number) {
  console.log('name: ' + name);
  console.log('amount: ' + outstanding);
}
```

### Extract Variable

```typescript
// BEFORE: Complex conditional hard to parse
function renderBanner() {
  if (
    platform.toUpperCase().indexOf('MAC') > -1 &&
    browser.toUpperCase().indexOf('IE') > -1 &&
    wasInitialized() &&
    resize > 0
  ) {
    // do something
  }
}

// AFTER: Self-explanatory variables
function renderBanner() {
  const isMacOs = platform.toUpperCase().indexOf('MAC') > -1;
  const isIE = browser.toUpperCase().indexOf('IE') > -1;
  const wasResized = resize > 0;

  if (isMacOs && isIE && wasInitialized() && wasResized) {
    // do something
  }
}
```

### Replace Temp with Query

```typescript
// BEFORE: Using local variable for calculation
function calculateTotal(): number {
  const basePrice = quantity * itemPrice;
  if (basePrice > 1000) return basePrice * 0.95;
  return basePrice * 0.98;
}

// AFTER: Calculation extracted to a query method
function calculateTotal(): number {
  if (getBasePrice() > 1000) return getBasePrice() * 0.95;
  return getBasePrice() * 0.98;
}

function getBasePrice(): number {
  return quantity * itemPrice;
}
```

## Payoff

- **Readability:** Short, well-named methods act as live documentation.
- **Deduplication:** Isolated parts of code are easier to reuse in other places.
- **Maintainability:** Clear code structure makes it easier to find effective methods for restructuring and performance gains.
