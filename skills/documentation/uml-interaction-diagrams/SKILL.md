---
name: documentation/uml-interaction-diagrams
description: >
  Document object interactions over time using UML Sequence Diagrams with Mermaid.
  Trigger: When documenting behavioral patterns, message flows, or interactions between objects/services.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Documenting behavioral patterns or service interactions with sequence diagrams'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Advanced UML — Interaction and Sequence Diagrams

## Purpose

This skill enables the agent to document and interpret how objects interact over time using Sequence Diagrams. It is crucial for explaining behavioral patterns like Observer, Mediator, and Command.

## Notation Guide

### 1. Lifelines and Activation

- **Lifelines:** Vertical dashed lines representing an object's existence over time.
- **Activation Bar:** Thin rectangle on the lifeline showing when an object is actively performing an operation.

### 2. Message Arrows

- **Synchronous Call:** Solid line with a filled arrowhead (waiting for response).
- **Return Message:** Dashed line with a simple arrowhead.
- **Asynchronous Call:** Solid line with a simple arrowhead (no waiting).

## Procedural Instructions

### 1. Mapping Patterns to Interaction

- **Observer:** Show the `Publisher` sending `notify()` to all `Subscriber` lifelines.
- **Mediator:** Show multiple `Component` lifelines sending events to the `Mediator`, and the `Mediator` dispatching calls back to them.

### 2. Generating Mermaid Sequence Code

When documenting logic, use the following structure:

```mermaid
sequenceDiagram
  participant A as ClassA
  participant B as ClassB
  A->>B: MethodCall()
  B-->>A: ReturnValue
```

### 3. Example: Observer Pattern

```mermaid
sequenceDiagram
  participant S as Store (Publisher)
  participant E as EmailAlert (Subscriber)
  participant L as Logger (Subscriber)
  S->>E: update("stock changed")
  S->>L: update("stock changed")
```

## Payoff

- **Clarity in Logic:** Visualizes complex message passing that is hard to trace in code.
- **Standardized Documentation:** Uses industry-standard notation understood by humans and agents.
- **Pattern Verification:** Confirms that behavioral patterns are implemented correctly.
