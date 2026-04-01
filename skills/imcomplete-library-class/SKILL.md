---
name: imcomplete-library-class
description: >
  Extend third-party libraries safely without modifying their source using Foreign Methods or Local Extensions.
  Trigger: When a library class lacks a needed method and cannot be modified directly.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Extending third-party or read-only library classes'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Detect and Resolve Incomplete Library Class

## Purpose

This skill enables the agent to identify when a third-party library or framework no longer meets the project's needs and provides strategies to extend it without access to the original source code.

## Procedural Instructions

### 1. Detection Phase

- **Identify Read-Only Limitations:** Spot scenarios where a library class lacks a necessary method but cannot be modified directly.
- **Audit Repetitive Client Logic:** Look for utility methods created by developers that should ideally live inside the library class itself.

### 2. Treatment Phase

- **Introduce Foreign Method:** If you only need one or two methods, add them to your client class and pass the library object as an argument.
- **Introduce Local Extension:** If you need many new methods, create a new class (subclass or wrapper) that houses the additional functionality.

## TypeScript Example

```typescript
// THIRD-PARTY LIBRARY (Read-Only)
class ExternalDate {
  getYear() {
    return 2024;
  }
  getMonth() {
    return 10;
  }
}

// FOREIGN METHOD — solution for 1-2 missing methods
class DateUtil {
  static nextDay(date: ExternalDate): ExternalDate {
    // Logic to calculate next day without modifying ExternalDate
    return date;
  }
}

// LOCAL EXTENSION — solution for many missing methods
class ExtendedDate extends ExternalDate {
  isWeekend(): boolean {
    /* ... */
  }
  addDays(n: number): ExtendedDate {
    /* ... */
  }
  format(pattern: string): string {
    /* ... */
  }
}
```

## Payoff

- **Reduced Duplication:** Avoids re-implementing library logic from scratch.
- **Clean API:** Provides a more intuitive interface for the team even when libraries are limited.
- **Non-Invasive:** The original library is never modified, so upgrades remain safe.
