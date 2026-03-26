---
name: skill-creator
description: >
  Creates new AI agent skills for the SaaS Business Platform project.
  Trigger: When user asks to create a new skill, add agent instructions, or document patterns for AI.
license: MIT
metadata:
  author: gentleman-programming
  version: "1.0"
  scope: [root]
  auto_invoke: "Creating new skills"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

## When to Create a Skill

Create a skill when:
- A pattern is used **repeatedly** and the AI needs explicit guidance
- Project-specific conventions differ from generic best practices
- Complex workflows need step-by-step instructions for the AI
- Decision trees help the AI choose the right approach for THIS project

**Don't create a skill when:**
- Documentation already exists and can be referenced
- The pattern is trivial or self-explanatory
- It's a one-off task

---

## Skill Structure

```
skills/{skill-name}/
├── SKILL.md              # Required — main skill file
├── assets/               # Optional — templates, schemas, examples
│   ├── template.ts
│   └── schema.zod.ts
└── references/           # Optional — links to local docs
    └── docs.md
```

---

## SKILL.md Template

See [assets/SKILL-TEMPLATE.md](assets/SKILL-TEMPLATE.md) for the base template.

Key sections every skill MUST have:
1. **Frontmatter** — name, description (with trigger), metadata
2. **When to Use** — clear conditions
3. **Critical Patterns** — the most important rules with code examples
4. **Commands** — copy-paste bash commands
5. **Resources** — links to assets/ or references/

---

## Naming Conventions

| Type | Pattern | Examples |
|------|---------|----------|
| Generic technology | `{technology}` | `typescript`, `zod`, `zustand`, `jest` |
| Project-wide | `saas-{domain}` | `saas-auth`, `saas-payments`, `saas-realtime` |
| App-specific | `saas-{app}` | `saas-admin`, `saas-customer-app` |
| Workflow | `{action}-{target}` | `skill-creator`, `skill-sync` |

---

## Scope Values for This Project

| Scope | Updates |
|-------|---------|
| `root` | `AGENTS.md` (repo root) |
| `admin` | `apps/admin/AGENTS.md` |
| `customer` | `apps/customer/AGENTS.md` |
| `api-gateway` | `apps/api-gateway/AGENTS.md` |
| `auth-service` | `apps/auth-service/AGENTS.md` |
| `club-service` | `apps/club-service/AGENTS.md` |
| `inventory-service` | `apps/inventory-service/AGENTS.md` |
| `booking-service` | `apps/booking-service/AGENTS.md` |
| `finance-service` | `apps/finance-service/AGENTS.md` |
| `libs` | `libs/AGENTS.md` |

---

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Skill identifier (lowercase, hyphens) |
| `description` | Yes | What + Trigger in one block |
| `license` | Yes | `MIT` |
| `metadata.author` | Yes | `gentleman-programming` |
| `metadata.version` | Yes | Semantic version as string `"1.0"` |
| `metadata.scope` | Yes | Array of scopes for sync.sh |
| `metadata.auto_invoke` | Yes | Action string(s) that trigger this skill |
| `allowed-tools` | No | Comma-separated list of tools the skill can use |

---

## Content Guidelines

### DO
- Start with the most critical patterns
- Use tables for decision trees
- Keep code examples minimal and focused
- Include Commands section with copy-paste commands
- Reference project stack (NestJS, React 19, Zod, Zustand, Prisma, NX)

### DON'T
- Duplicate content from `AGENTS.md` root (reference instead)
- Include lengthy explanations (link to docs)
- Use web URLs in references (use local paths)
- Add `any` types in code examples — use `unknown` and Zod

---

## After Creating a Skill

1. Add it to the Skills table in `AGENTS.md`
2. Add it to the Auto-invoke table if it has `metadata.auto_invoke`
3. Run sync script to auto-update:

```bash
./skills/skill-sync/assets/sync.sh
```

---

## Checklist Before Creating

- [ ] Skill doesn't already exist — check `skills/`
- [ ] Pattern is reusable, not one-off
- [ ] Name follows project conventions
- [ ] Frontmatter complete (description includes trigger keywords)
- [ ] `metadata.scope` and `metadata.auto_invoke` set
- [ ] Critical patterns are clear with code examples
- [ ] Commands section exists
- [ ] Added to `AGENTS.md` tables
- [ ] Ran `sync.sh`

## Resources

- **Template**: See [assets/SKILL-TEMPLATE.md](assets/SKILL-TEMPLATE.md)
- **Root orchestrator**: See [../../AGENTS.md](../../AGENTS.md)
