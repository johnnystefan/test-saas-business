---
name: pattern-memento
description: >
  Teaches and applies the Memento behavioral design pattern — capturing and externalizing
  an object's internal state without violating encapsulation, enabling state restoration.
  Trigger: When implementing undo/redo, snapshots, or state history features.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'memento pattern, state snapshot, undo history'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Memento Pattern

## Purpose

Captures and externalizes an object's internal state without violating encapsulation, so the object can be restored to this state later.

## Procedural Instructions

1. **Define Originator:** The class whose state needs saving. It creates mementos and uses them to restore itself.
2. **Define Memento:** A value object that stores the Originator's state. It should be immutable.
3. **Define Caretaker:** Responsible for keeping track of the mementos (history) but never modifies them.
4. **Encapsulation Strategy:** Use nested classes (if supported) or restricted interfaces to keep the state private from the Caretaker.

## TypeScript Example

```typescript
class Memento {
  // Immutable
  constructor(private readonly state: string) {}
  getState() {
    return this.state;
  }
}

class Originator {
  private state: string = '';
  save(): Memento {
    return new Memento(this.state);
  }
  restore(m: Memento) {
    this.state = m.getState();
  }
}

class Caretaker {
  private history: Memento[] = [];
  // Manages the history array
}
```

## Payoff

- **Safety:** Allows producing snapshots of an object's state without violating its encapsulation.
- **Clean Originator:** Offloads history management to the Caretaker.
