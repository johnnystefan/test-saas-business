---
name: fundamentals/oop-pillars
description: >
  Design software using the four OOP pillars: Abstraction, Encapsulation, Inheritance, and Polymorphism.
  Trigger: When evaluating class design, replacing switch statements with polymorphism, or designing class hierarchies.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Evaluating OOP design or replacing switch logic with polymorphism'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Object-Oriented Programming (OOP) Pillars

## Purpose

This skill enables the agent to evaluate and design software using the four pillars of OOP: abstraction, encapsulation, inheritance, and polymorphism. These pillars are the foundation for achieving flexibility, reuse, and long-term maintainability.

## Procedural Instructions

### 1. Apply Abstraction

- **Definition:** Model objects by representing only relevant data and behaviors for a specific context, omitting unnecessary details.
- **Agent Task:** When analyzing a real-world entity (e.g., an Airplane), identify the specific context. In a flight simulator, focus on speed and altitude; in a booking system, focus only on seats and availability.
- **Action:** If a class contains attributes irrelevant to its current functional context, suggest splitting it or creating a more specialized abstraction.

### 2. Implement Encapsulation

- **Definition:** Hide internal state and implementation details, exposing only a limited public interface.
- **Agent Task:** Ensure fields are `private` or `protected`.
- **Action:**
  - Identify direct access to private fields and suggest replacing them with getters and setters.
  - Use interfaces or protocols to define contracts for interaction between objects.

### 3. Manage Inheritance

- **Definition:** Create new classes based on existing ones to reuse code.
- **Agent Task:** Identify common attributes and behaviors in multiple classes (e.g., `Cat` and `Dog`) and extract them into a common base class (e.g., `Animal`).
- **Action:** Use inheritance only when a real "is-a" relationship exists. If a subclass does not use most methods of its parent, consider **Replace Inheritance with Delegation**.

### 4. Leverage Polymorphism

- **Definition:** The ability of a program to detect an object's true class and invoke its specific implementation even when its type is unknown in the current context.
- **Agent Task:** Look for complex `switch` or `if-else` blocks that check for object types.
- **Action:** Suggest **Replace Conditional with Polymorphism** by creating a common interface and specific implementations for each branch.

## TypeScript Examples

### Polymorphism in Action

```typescript
// BAD: Switch checking types manually
function makeSound(animal: { type: string }) {
  switch (animal.type) {
    case 'cat':
      return 'meow';
    case 'dog':
      return 'woof';
  }
}

// GOOD: Polymorphism — each class knows how to make its sound
interface Animal {
  makeSound(): string;
}

class Cat implements Animal {
  makeSound() {
    return 'meow';
  }
}

class Dog implements Animal {
  makeSound() {
    return 'woof';
  }
}

const animals: Animal[] = [new Cat(), new Dog()];
animals.forEach((a) => console.log(a.makeSound()));
```

### Encapsulation

```typescript
// BAD: Direct field access — external code can corrupt state
class BankAccount {
  public balance: number = 0;
}

// GOOD: State protected behind a controlled interface
class BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}
```

## Payoff

- **Reusability:** Inheritance allows reusing code without duplication.
- **Maintainability:** Encapsulation protects the code from adverse effects of changes by isolating them.
- **Flexibility:** Abstraction and Polymorphism allow the program to work with new object types without breaking existing code.
