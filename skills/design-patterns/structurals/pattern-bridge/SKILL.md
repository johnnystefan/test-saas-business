---
name: pattern-bridge
description: >
  Teaches and applies the Bridge structural design pattern — splitting a large class into
  two separate hierarchies (abstraction and implementation) that evolve independently.
  Trigger: When separating platform-independent abstractions from platform-specific implementations.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke:
    - 'bridge pattern, abstraction implementation split, platform independence'
    - 'abstracting notification sending from the notification channel (email, SMS, push)'
    - 'separating payment processing logic from the payment provider (Stripe, PayPal)'
    - 'need to vary both abstraction and implementation independently'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Bridge Pattern

## Purpose

Splits a large class or a set of closely related classes into two separate hierarchies—abstraction and implementation—which can be developed independently.

## Procedural Instructions

1. **Identify Orthogonal Dimensions:** Find independent dimensions in your classes (e.g., Abstraction vs. Platform).
2. **Define Implementation Interface:** Create a common interface for all concrete implementations.
3. **Define Abstraction:** Create a base class that maintains a reference to the implementation interface and delegates work to it.
4. **Refine Abstractions:** Create subclasses for specific logic variations.

## TypeScript Example

```typescript
// Implementation Interface
interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
}

// Concrete Implementation
class TV implements Device {
  private on = false;
  isEnabled() {
    return this.on;
  }
  enable() {
    this.on = true;
  }
  disable() {
    this.on = false;
  }
}

// Abstraction
class RemoteControl {
  constructor(protected device: Device) {}
  togglePower() {
    this.device.isEnabled() ? this.device.disable() : this.device.enable();
  }
}

// Refined Abstraction
class AdvancedRemote extends RemoteControl {
  mute() {
    console.log('Device muted');
  }
}
```

## Payoff

- **Platform Independence:** You can create apps that work across different platforms.
- **Scalability:** Avoids an exponential explosion of subclasses.
