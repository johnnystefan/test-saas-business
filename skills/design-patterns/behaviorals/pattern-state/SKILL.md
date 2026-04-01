---
name: pattern-state
description: >
  Teaches and applies the State behavioral design pattern — allowing an object to alter
  its behavior when its internal state changes, appearing as if the object changed its class.
  Trigger: When implementing finite state machines, workflow states, or mode-based behavior.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'state pattern, finite state machine, workflow states'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement State Pattern

## Purpose

Allows an object to alter its behavior when its internal state changes. It appears as if the object changed its class.

## Procedural Instructions

1. **Map Finite States:** Identify the possible states and transitions.
2. **Declare State Interface:** Define methods for all state-dependent actions.
3. **Create Concrete State Classes:** Extract logic from the original class into these new classes, one per state.
4. **Define Context:** The original class (Context) stores a reference to a state object and delegates work to it.
5. **Manage Transitions:** Either the Context or the states themselves can trigger a state change.

## TypeScript Example

```typescript
interface State {
  handle(context: Context): void;
}

class Context {
  constructor(private state: State) {}
  transitionTo(state: State) {
    this.state = state;
  }
  request() {
    this.state.handle(this);
  }
}

class ConcreteStateA implements State {
  handle(context: Context) {
    context.transitionTo(new ConcreteStateB());
  }
}
```

## Payoff

- **SRP:** Organizes state-specific code into separate classes.
- **Simplified Logic:** Eliminates massive, complex conditionals based on state flags.
