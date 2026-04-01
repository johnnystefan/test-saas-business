---
name: code-smells/change-preventers
description: >
  Detect and refactor Change Preventers — flaws that hinder software evolution.
  Trigger: When identifying Divergent Change, Shotgun Surgery, or Parallel Inheritance Hierarchies.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Reviewing architectural coupling and change patterns'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Detect and Refactor Change Preventers

## Purpose

This skill enables the agent to identify "Change Preventers" — architectural flaws that hinder software evolution by requiring widespread changes for single functional updates. The agent will apply refactoring techniques to consolidate responsibilities and reduce the ripple effect of code modifications.

## Domain Knowledge: The 3 Change Preventers

1. **Divergent Change:** When you find yourself having to change many unrelated methods inside a single class every time you make a modification (e.g., changing product logic requires changing finding, displaying, and ordering methods).
2. **Shotgun Surgery:** The opposite of Divergent Change. Making a single modification requires many small changes across many different classes.
3. **Parallel Inheritance Hierarchies:** A special case where whenever you create a subclass for one class, you find yourself forced to create a subclass for another class.

## Procedural Instructions

### 1. Detection Phase

- **Monitor Change Patterns:** If one class is constantly modified for different reasons, label it as **Divergent Change**.
- **Identify "Ripples":** If a single logical change (e.g., adding a new tax rule) forces edits across five or more files, label it as **Shotgun Surgery**.
- **Spot Hierarchy Pairs:** Look for class hierarchies that mirror each other (e.g., `Triangle` → `TriangleDrawing`, `Circle` → `CircleDrawing`). This is **Parallel Inheritance**.

### 2. Treatment Phase

- **For Divergent Change:**
  - Use **Extract Class** to split unrelated behaviors into separate components.
  - If classes share behavior, use **Extract Superclass**.
- **For Shotgun Surgery:**
  - Use **Move Method** and **Move Field** to consolidate all related behaviors into a single class.
  - If the original classes become empty, use **Inline Class** to eliminate them.
- **For Parallel Inheritance:**
  - Make instances of one hierarchy refer to instances of the other.
  - Use **Move Method** and **Move Field** to eliminate the redundant hierarchy.

## TypeScript Examples

### Divergent Change

```typescript
// BAD: This class changes for DB reasons, UI reasons, and logic reasons
class ProductManager {
  getProduct(id: string) {
    /* DB Logic */
  }
  renderProductHtml() {
    /* UI Logic */
  }
  calculateDiscount() {
    /* Business Logic */
  }
}

// GOOD: Responsibilities extracted into dedicated classes (SRP)
class ProductRepository {
  getProduct(id: string) {
    /* ... */
  }
}

class ProductPresenter {
  renderHtml(product: Product) {
    /* ... */
  }
}

class DiscountCalculator {
  calculate(product: Product) {
    /* ... */
  }
}
```

### Shotgun Surgery

```typescript
// BAD: A single change to "Account" forces changes in three separate classes
class AccountTransfer {
  execute(amount: number) {
    /* ... */
  }
}
class AccountInterest {
  apply(rate: number) {
    /* ... */
  }
}
class AccountAudit {
  log(action: string) {
    /* ... */
  }
}

// GOOD: Related behaviors consolidated into one class
class Account {
  transfer(amount: number) {
    /* ... */
  }
  applyInterest(rate: number) {
    /* ... */
  }
  logAction(action: string) {
    /* ... */
  }
}
```

## Payoff

- **Reduced Maintenance Cost:** Modifications are localized to a single class or method.
- **Code Organization:** Classes become more cohesive and follow the Single Responsibility Principle.
- **Predictability:** Developers can modify features without fearing unexpected breakages in unrelated parts of the system.
