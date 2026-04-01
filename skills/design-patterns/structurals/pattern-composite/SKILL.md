---
name: pattern-composite
description: >
  Teaches and applies the Composite structural design pattern — composing objects into
  tree structures to represent part-whole hierarchies, treating individual and composite objects uniformly.
  Trigger: When working with tree hierarchies, nested components, or recursive structures.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke:
    - 'composite pattern, tree structure, part-whole hierarchy'
    - 'permission or role hierarchy where groups contain sub-groups and individual rules'
    - 'nested pricing or discount rules where combined rules evaluate as one'
    - 'organization or club hierarchy with departments containing sub-departments'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Skill: Implement Composite Pattern

## Purpose

Composes objects into tree structures to represent part-whole hierarchies. It lets clients treat individual objects and compositions of objects uniformly.

## Procedural Instructions

1. **Identify Tree Structure:** Ensure your model can be represented as a tree (e.g., File system, UI components).
2. **Define Component Interface:** Declare common operations for both simple and complex elements.
3. **Implement Leaf:** Create classes for basic elements that have no children.
4. **Implement Composite:** Create container classes that store child components and delegate work to them.

## TypeScript Example

```typescript
interface Component {
  execute(): string;
}

class Leaf implements Component {
  execute() {
    return 'Leaf';
  }
}

class Composite implements Component {
  private children: Component[] = [];

  add(c: Component) {
    this.children.push(c);
  }

  execute(): string {
    const results = this.children.map((child) => child.execute());
    return `Branch(${results.join('+')})`;
  }
}
```

## Payoff

- **Polymorphism:** Clients work with complex structures as if they were single objects.
- **Flexibility:** Easy to add new element types to the tree.
