---
name: pattern-template-method
description: >
  Teaches and applies the Template Method behavioral design pattern — defining the skeleton
  of an algorithm in a superclass while letting subclasses override specific steps.
  Trigger: When defining invariant algorithm structure with customizable steps in subclasses.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke:
    - 'template method pattern, algorithm skeleton, hook methods'
    - 'NestJS provider class extends a base use case with shared pre/post steps'
    - 'multiple use cases share the same flow structure but differ in one or two steps'
    - 'base class defines the sequence of operations, subclasses fill in the details'
    - 'need invariant workflow with customizable steps across service variants'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Template Method Pattern

## Purpose

Defines the skeleton of an algorithm in a superclass but lets subclasses override specific steps of the algorithm without changing its structure.

## Procedural Instructions

1. **Identify Common Algorithm Structure:** Look for classes with similar methods that follow the same sequence of steps.
2. **Define Abstract Superclass:** Create a "template method" containing the sequence of calls to various steps.
3. **Declare Algorithm Steps:** Define the individual steps as abstract methods (must override) or hooks (optional override).
4. **Implement Subclasses:** Override the required steps to customize behavior.

## TypeScript Example

```typescript
abstract class DataMiner {
  public mine() {
    // Template Method
    this.openFile();
    this.extractData();
    this.closeFile();
  }
  abstract openFile(): void;
  abstract extractData(): void;
  closeFile() {
    console.log('File closed.');
  } // Default impl
}

class PDFMiner extends DataMiner {
  openFile() {
    console.log('Opening PDF...');
  }
  extractData() {
    console.log('Extracting PDF content...');
  }
}
```

## Payoff

- **Deduplication:** Pulls duplicate code from subclasses into a single superclass.
- **Control:** Subclasses can only override specific parts of a large algorithm, reducing risk.
