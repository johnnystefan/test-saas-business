---
name: pattern-adapter
description: >
  Teaches and applies the Adapter structural design pattern — allowing objects with
  incompatible interfaces to collaborate by wrapping one interface into another.
  Trigger: When integrating third-party libraries, legacy code, or incompatible interfaces.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'adapter pattern, interface wrapper, legacy integration'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Adapter Pattern

## Purpose

Allows objects with incompatible interfaces to collaborate. It acts as a wrapper that converts the interface of one object so that another object can understand it.

## Procedural Instructions

1. **Identify Incompatibility:** Locate a useful class (service) whose interface doesn't match the client's requirements.
2. **Define Client Interface:** Describe the protocol the client uses.
3. **Create Adapter:** Implement the client interface and maintain a reference to the service object (the "adaptee").
4. **Map Methods:** In the adapter, translate client calls into a format the service understands.

## TypeScript Example

```typescript
// Client Interface
interface Target {
  request(): string;
}

// Service with incompatible interface (Adaptee)
class Adaptee {
  public specificRequest(): string {
    return '.eetpadA eht fo roivaheb laicepS';
  }
}

// Adapter translates the interface
class Adapter implements Target {
  constructor(private adaptee: Adaptee) {}

  public request(): string {
    const result = this.adaptee.specificRequest().split('').reverse().join('');
    return `Adapter: (TRANSLATED) ${result}`;
  }
}
```

## Payoff

- **SRP:** Separates the data conversion logic from the primary business logic.
- **OCP:** New adapters can be introduced without breaking existing client code.
