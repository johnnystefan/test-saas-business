---
name: pattern-factory-method
description: >
  Teaches and applies the Factory Method creational design pattern — providing an interface
  for creating objects in a superclass, allowing subclasses to decide which class to instantiate.
  Trigger: When decoupling object creation from usage or implementing extensible creation logic.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke:
    - 'factory method pattern, object creation, subclass instantiation'
    - 'domain entity needs a static create() method that encapsulates construction logic'
    - 'BusinessUnit.create(), Member.create(), or Membership.create() static factory'
    - 'construction logic must validate invariants before returning a valid entity'
    - 'decoupling caller from knowing how to construct a domain object'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Factory Method Pattern

## Purpose

Provides an interface for creating objects in a superclass but allows subclasses to alter the type of objects that will be created. It decouples the business logic from the concrete classes it needs to instantiate.

## Procedural Instructions

1. **Identify Direct Instantiation:** Look for `new ConcreteClass()` calls that make the code rigid.
2. **Define Product Interface:** Ensure all products follow a common interface.
3. **Create Creator Class:** Declare the factory method. It should return the product interface.
4. **Implement Subclasses:** Create concrete creators that override the factory method to return specific instances of products.

## TypeScript Example

```typescript
// Product Interface
interface Transport {
  deliver(): string;
}

// Concrete Products
class Truck implements Transport {
  deliver() {
    return 'Delivering by land in a box.';
  }
}

class Ship implements Transport {
  deliver() {
    return 'Delivering by sea in a container.';
  }
}

// Creator Class
abstract class Logistics {
  public abstract createTransport(): Transport;

  public planDelivery(): string {
    const transport = this.createTransport();
    return transport.deliver();
  }
}

// Concrete Creators
class RoadLogistics extends Logistics {
  public createTransport(): Transport {
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  public createTransport(): Transport {
    return new Ship();
  }
}
```

## Payoff

- **OCP Compliance:** You can introduce new types of products without breaking existing client code.
- **SRP Compliance:** Product creation code is localized in one place.
