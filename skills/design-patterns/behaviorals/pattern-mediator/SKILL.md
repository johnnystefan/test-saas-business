---
name: pattern-mediator
description: >
  Teaches and applies the Mediator behavioral design pattern — reducing direct dependencies
  between objects by forcing them to communicate only through a mediator.
  Trigger: When decoupling tightly coupled components or implementing event buses.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'mediator pattern, event bus, component decoupling'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Mediator Pattern

## Purpose

Reduces chaotic dependencies between objects by forcing them to collaborate only through a mediator object.

## Procedural Instructions

1. **Identify Coupled Classes:** Look for components that frequently call each other directly.
2. **Declare Mediator Interface:** Define a `notify()` method that components use to report events.
3. **Implement Concrete Mediator:** Centralize coordination logic. It stores references to all components and directs traffic between them.
4. **Update Components:** Components must only talk to the mediator, not to each other.

## TypeScript Example

```typescript
interface Mediator {
  notify(sender: object, event: string): void;
}

class Dialog implements Mediator {
  constructor(
    private button: Button,
    private textbox: Textbox,
  ) {
    this.button.setMediator(this);
  }
  notify(sender: object, event: string) {
    if (event === 'click') {
      /* Coordination logic here */
    }
  }
}

class Button {
  private mediator!: Mediator;
  setMediator(m: Mediator) {
    this.mediator = m;
  }
  click() {
    this.mediator.notify(this, 'click');
  }
}
```

## Payoff

- **Reusability:** Individual components become easier to reuse as they are no longer tied to specific peers.
- **SRP:** Coordination logic is consolidated into one place.
