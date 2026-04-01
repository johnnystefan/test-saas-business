---
name: refactoring/strategy
description: >
  Manage refactoring as a strategic process — when to refactor, how to prioritize debt, and how to do it safely.
  Trigger: When planning a refactoring initiative, communicating technical debt, or deciding what to clean up first.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Planning a refactoring session or evaluating technical debt priority'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Refactoring Strategy

## Purpose

This skill enables the agent to move beyond simple code fixes and manage refactoring as a strategic process. It provides instructions on identifying technical debt, defining "clean code," and determining the optimal moments to refactor without disrupting production.

## Domain Knowledge

- **Clean Code:** Code that is easy to read, write, and maintain. It makes development predictable and increases quality.
- **Technical Debt:** The "interest" paid in slowed development speed when quick, dirty solutions are chosen over clean ones. If left unchecked, it can paralyze a project.
- **Refactoring:** A controllable process of improving code without creating new functionality.

## Procedural Instructions

### 1. Identify When to Refactor

- **Rule of Three:** Refactor when you find yourself doing something for the third time.
- **Feature Addition:** Refactor existing code to make it easier to integrate a new feature.
- **Bug Fix:** Use refactoring to clarify logic that is hiding a bug.
- **Code Review:** Refactor based on feedback before merging to keep the main branch clean.

### 2. Implementation Workflow

- **Test First:** Never start refactoring without a suite of tests that pass.
- **Atomic Steps:** Apply small, granular changes. If you break something, it should be easy to identify which small step caused it.
- **No New Features:** Do not mix refactoring with adding new functionality.
- **Validation:** Run all tests after every minor change to ensure external behavior remains unchanged.

### 3. Prioritization Logic

- **High Interest Debt:** Focus on code that is frequently modified and has high complexity (Change Preventers).
- **Low Interest Debt:** Leave alone code that is "ugly" but rarely changed and functional.

## TypeScript Example: Refactoring During Feature Addition

```typescript
// CONTEXT: We need to add "Export to CSV".
// STRATEGY: First, refactor the existing "Print" logic to use an interface.

// BEFORE: Hard to extend — print logic is locked inside Report
class Report {
  print() {
    /* printing logic */
  }
}

// DURING REFACTOR: Preparing for the new feature
interface ReportOutput {
  execute(data: string): void;
}
class PrinterOutput implements ReportOutput {
  execute(data: string) {
    /* printing logic */
  }
}

class Report {
  constructor(private output: ReportOutput) {}
  export() {
    this.output.execute('data');
  }
}

// PAYOFF: Adding CSVOutput requires zero changes to the Report class (OCP)
class CSVOutput implements ReportOutput {
  execute(data: string) {
    /* csv logic */
  }
}
```

## Payoff

- **Maintainability:** Code remains easy to evolve.
- **Predictability:** Reduces the risk of "everything breaking" when a change is made.
- **Efficiency:** Prevents project paralysis by keeping technical debt under control.
