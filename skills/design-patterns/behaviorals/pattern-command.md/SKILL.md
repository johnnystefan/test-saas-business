---
name: pattern-command
description: >
  Teaches and applies the Command behavioral design pattern — encapsulating requests
  as objects to support parameterization, queuing, logging, and undo/redo operations.
  Trigger: When implementing undoable operations, task queues, or action history.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'command pattern, undo redo, action queue, request encapsulation'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Command Pattern

## Purpose

Turns a request into a stand-alone object that contains all information about the request. This allows for parameterizing methods, queuing requests, and supporting undoable operations.

## Procedural Instructions

1. **Declare Command Interface:** Define a single execution method, usually `execute()`.
2. **Create Concrete Commands:** Map UI elements or triggers to specific business logic (Receivers). Store parameters within the command object.
3. **Define Senders (Invokers):** Senders should trigger the command without knowing what the command does or who the receiver is.
4. **Setup Receiver:** The class that actually knows how to perform the operation.

## TypeScript Example

```typescript
interface Command {
  execute(): void;
}

class Light {
  // Receiver
  turnOn() {
    console.log('Light is ON');
  }
}

class TurnOnCommand implements Command {
  constructor(private light: Light) {}
  execute() {
    this.light.turnOn();
  }
}

class RemoteControl {
  // Invoker
  private command!: Command;
  setCommand(c: Command) {
    this.command = c;
  }
  pressButton() {
    this.command.execute();
  }
}
```

## Payoff

- **Undo/Redo:** Commands can store state snapshots to reverse operations.
- **SRP:** Decouples the object that invokes the operation from the one that knows how to perform it.
