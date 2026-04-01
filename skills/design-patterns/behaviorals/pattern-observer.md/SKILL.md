---
name: pattern-observer
description: >
  Teaches and applies the Observer behavioral design pattern — defining a subscription
  mechanism to notify multiple objects about events in the observed object.
  Trigger: When implementing event-driven systems, reactive updates, or pub/sub mechanisms.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'observer pattern, pub sub, event driven, reactive updates'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Observer Pattern

## Purpose

Defines a subscription mechanism to notify multiple objects about any events that happen to the object they are observing. Essential for event-driven systems, real-time updates, and reactive architectures.

## Procedural Instructions

1. **Identify the Publisher:** The object with the interesting state that others need to react to.
2. **Declare Subscriber Interface:** Usually a single `update()` method with event data as parameter.
3. **Implement Subscription Logic:** Add `subscribe()`, `unsubscribe()`, and `notify()` methods to the Publisher.
4. **Trigger Notifications:** The Publisher calls `update()` on all its subscribers whenever an important event occurs.

## TypeScript Example

```typescript
interface Subscriber {
  update(event: string, data: unknown): void;
}

class Store {
  // Publisher
  private subscribers: Map<string, Subscriber[]> = new Map();

  subscribe(event: string, subscriber: Subscriber) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(subscriber);
  }

  unsubscribe(event: string, subscriber: Subscriber) {
    const subs = this.subscribers.get(event) ?? [];
    this.subscribers.set(
      event,
      subs.filter((s) => s !== subscriber),
    );
  }

  notify(event: string, data: unknown) {
    (this.subscribers.get(event) ?? []).forEach((s) => s.update(event, data));
  }

  changeStock(item: string, quantity: number) {
    // ... update logic
    this.notify('stockChanged', { item, quantity });
  }
}

class EmailAlert implements Subscriber {
  update(event: string, data: unknown) {
    console.log(`Email sent for event: ${event}`, data);
  }
}
```

## Payoff

- **OCP:** Introduce new subscriber classes without changing the publisher's code.
- **Dynamic Relationships:** Objects can subscribe and unsubscribe at runtime.
- **Loose Coupling:** Publisher and subscribers only know about the shared interface.
