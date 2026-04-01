---
name: technical-debt-management
description: >
  Identify, classify, communicate, and prioritize technical debt using the debt quadrant model.
  Trigger: When evaluating code quality, proposing refactors, or communicating the cost of shortcuts to stakeholders.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope: [root]
  auto_invoke: 'Identifying or communicating technical debt and refactoring cost'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

# Skill: Technical Debt Identification and Management

## Purpose

This skill enables the agent to identify, classify, and communicate "Technical Debt" — the "interest" paid in slowed development when quick, dirty solutions are chosen over clean ones.

## Domain Knowledge

- **Clean Code:** Code that is easy to read, write, and maintain. It makes development predictable and increases quality.
- **Technical Debt Quadrant:**
  1. **Reckless & Premeditated:** Choosing a mess to meet a deadline without a plan to fix it.
  2. **Prudent & Premeditated:** Shipping now with a documented plan to refactor immediately after.
  3. **Reckless & Inadvertent:** "We didn't know better" debt — lack of seniority or knowledge.
  4. **Prudent & Inadvertent:** Learning that the design is flawed only after implementation.

## Procedural Instructions

### 1. Identify Debt Interest

- Monitor velocity of changes. If a simple feature takes 3x longer than expected due to complex existing logic, label it as **High Interest Debt**.

### 2. Audit Debt Causes

- **Business Pressure:** Deadlines forcing a "get it done" approach.
- **Lack of Documentation:** No context on why things were done a certain way.
- **Tight Coupling:** Components that are hard to separate.

### 3. Communication Strategy

- When proposing a refactor, explain the **Technical Debt interest**: "Fixing this now will save X hours of work in the next feature addition."

### 4. Prioritization Logic

- **High Interest Debt:** Focus on code that is frequently modified and has high complexity (Change Preventers).
- **Low Interest Debt:** Leave alone code that is "ugly" but rarely changed and functional.

## Payoff

- **Economic Visibility:** Developers and stakeholders understand the cost of messy code.
- **Strategic Refactoring:** Focus on refactoring parts of the code that are modified most often — the most "expensive" debt.
- **Predictability:** Reduces the risk of "everything breaking" when a change is made.
