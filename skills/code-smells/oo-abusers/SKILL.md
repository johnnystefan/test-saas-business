---
name: code-smells/oo-abusers
description: >
  Detect and refactor OO Abusers — incorrect or incomplete application of OOP principles.
  Trigger: When identifying Switch Statements, Temporary Fields, Refused Bequest, or Alternative Classes with Different Interfaces.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Reviewing OOP design and polymorphism usage'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Detect and Refactor Object-Orientation Abusers

## Purpose

This skill enables the agent to identify "OO Abusers" — code structures that result from an incomplete or incorrect application of object-oriented programming principles. The agent will replace these structures with proper polymorphic behavior and cleaner class hierarchies.

## Domain Knowledge: The 4 OO Abusers

1. **Switch Statements:** Complex `switch` operators or sequences of `if` statements that perform different actions based on an object's type or state.
2. **Temporary Field:** Fields that only get values under certain specific circumstances, remaining empty or `null` otherwise.
3. **Refused Bequest:** A subclass that uses only a small portion of the methods and properties inherited from its parent. The hierarchy is "off-kilter."
4. **Alternative Classes with Different Interfaces:** Two classes that perform identical or very similar functions but have different method names.

## Procedural Instructions

### 1. Detection Phase

- **Identify Switch logic:** Look for methods where behavior is branched based on a `type` code or class name.
- **Audit Field Usage:** Check if certain fields in a class are only used by one specific method and otherwise ignored.
- **Review Inheritance:** Check if a subclass throws "Not Supported" exceptions for inherited methods or simply leaves them empty.
- **Compare Classes:** Look for different classes that seem to do the same work but use different naming conventions (e.g., `getTotal()` vs `calculateSum()`).

### 2. Treatment Phase

- **For Switch Statements:**
  - Use **Extract Method** to isolate the switch.
  - Use **Move Method** to put it in the right class.
  - Apply **Replace Conditional with Polymorphism**.
- **For Temporary Fields:**
  - Use **Extract Class** to create a separate object for the fields and the operations that use them.
  - Use **Introduce Null Object** to eliminate conditional checks for the field's existence.
- **For Refused Bequest:**
  - If inheritance makes no sense, use **Replace Inheritance with Delegation**.
  - If inheritance is appropriate but the parent is too fat, use **Extract Superclass** to pull up only the common parts.
- **For Alternative Classes:**
  - Use **Rename Method** to align signatures.
  - Use **Move Method** or **Extract Superclass** to merge the functionalities.

## TypeScript Examples

### Switch Statements vs. Polymorphism

```typescript
// BAD: Switch statement based on type
class Bird {
  getSpeed(type: string) {
    switch (type) {
      case 'EUROPEAN':
        return 10;
      case 'AFRICAN':
        return 15;
      default:
        return 0;
    }
  }
}

// GOOD: Replace with Polymorphism
interface Bird {
  getSpeed(): number;
}

class European implements Bird {
  getSpeed() {
    return 10;
  }
}

class African implements Bird {
  getSpeed() {
    return 15;
  }
}
```

### Refused Bequest

```typescript
// BAD: A Chair is not an Animal, even if they both have legs
class Animal {
  eat() {
    console.log('Eating...');
  }
}

class Chair extends Animal {
  eat() {
    throw new Error("Chairs don't eat!");
  } // Refused Bequest
}

// GOOD: No false "is-a" relationship
class Chair {
  legs: number = 4;
}
```

## Payoff

- **Flexibility:** Adding a new type no longer requires finding and changing every switch statement in the codebase.
- **Code Clarity:** Classes no longer contain "ghost" fields that are only used 1% of the time.
- **Logical Hierarchies:** Inheritance trees represent real "is-a" relationships, making the code predictable.
