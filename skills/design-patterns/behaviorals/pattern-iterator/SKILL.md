---
name: pattern-iterator
description: >
  Teaches and applies the Iterator behavioral design pattern — providing sequential
  access to elements of a collection without exposing its internal representation.
  Trigger: When traversing complex data structures or building custom collection iterators.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke:
    - 'iterator pattern, collection traversal, custom iterator'
    - 'need to traverse a domain collection without exposing its internal structure'
    - 'custom traversal logic over a list of entities (paginated, filtered, lazy)'
    - 'aggregate root exposes children collection that needs controlled iteration'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Iterator Pattern

## Purpose

Provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation (list, stack, tree, etc.).

## Procedural Instructions

1. **Declare Iterator Interface:** Define methods for fetching the `next()` element and checking if there are `hasMore()` items.
2. **Declare Collection Interface:** Define a method to `createIterator()`.
3. **Implement Concrete Iterator:** Encapsulate traversal logic and maintain the current position for a specific collection type.
4. **Implement Concrete Collection:** Return a new instance of the appropriate iterator.

## TypeScript Example

```typescript
interface MyIterator<T> {
  next(): T;
  hasNext(): boolean;
}

class AlphabeticalIterator implements MyIterator<string> {
  private position: number = 0;
  constructor(private collection: string[]) {}
  next(): string {
    return this.collection[this.position++];
  }
  hasNext(): boolean {
    return this.position < this.collection.length;
  }
}

interface IterableCollection {
  getIterator(): MyIterator<string>;
}
```

## Payoff

- **Uniformity:** Client code can work with various collections using a single iterator interface.
- **Clean Code:** Moves bulky traversal algorithms out of business logic.
