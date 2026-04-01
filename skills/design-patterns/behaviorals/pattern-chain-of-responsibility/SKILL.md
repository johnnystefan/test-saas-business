---
name: pattern-chain-of-responsibility
description: >
  Teaches and applies the Chain of Responsibility behavioral design pattern —
  passing requests along a chain of handlers where each handler decides to process or forward.
  Trigger: When implementing request handling pipelines, middleware chains, or event propagation.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke:
    - 'chain of responsibility pattern, handler chain, middleware pipeline'
    - 'NestJS guard, interceptor, or pipe chain that processes a request sequentially'
    - 'validation pipeline where each step decides to continue or reject'
    - 'request must pass through multiple checks before reaching the handler'
    - 'need to add or remove processing steps without changing the core flow'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Chain of Responsibility Pattern

## Purpose

Enables the agent to pass requests along a chain of handlers. Each handler decides either to process the request or pass it to the next handler in the chain.

## Procedural Instructions

1. **Identify Sequential Checks:** Look for code performing multiple validation or processing steps in a rigid order.
2. **Declare Handler Interface:** Define a common method (e.g., `handle()`) for all steps.
3. **Create Base Handler:** (Optional) Implement the default behavior of passing the request to the `next` handler.
4. **Implement Concrete Handlers:** Each handler performs its specific check. It can stop the chain or call the parent to pass the request forward.
5. **Compose the Chain:** Link handlers dynamically in the client code.

## TypeScript Example

```typescript
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}

abstract class AbstractHandler implements Handler {
  private nextHandler: Handler | null = null;
  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }
  public handle(request: string): string | null {
    if (this.nextHandler) return this.nextHandler.handle(request);
    return null;
  }
}

class AuthHandler extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === 'unauthorized') return 'Auth: Access denied.';
    return super.handle(request);
  }
}

class ValidationHandler extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === 'invalid') return 'Validation: Data invalid.';
    return super.handle(request);
  }
}
```

## Payoff

- **Decoupling:** Decouples senders of requests from their receivers.
- **Flexibility:** Handlers can be added or reordered at runtime without modifying client code.
