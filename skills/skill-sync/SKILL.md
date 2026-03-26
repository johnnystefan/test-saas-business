---
name: skill-sync
description: >
  Syncs skill metadata to AGENTS.md Auto-invoke sections across the NX monorepo.
  Trigger: When creating or modifying a skill, updating metadata.scope/metadata.auto_invoke, or regenerating Auto-invoke tables.
license: MIT
metadata:
  author: gentleman-programming
  version: "1.0"
  scope: [root]
  auto_invoke:
    - "After creating/modifying a skill"
    - "Regenerate AGENTS.md Auto-invoke tables"
    - "Troubleshoot why a skill is missing from AGENTS.md auto-invoke"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

## Purpose

Keeps all `AGENTS.md` files in sync with skill metadata. When you create or modify a skill, run the sync script to automatically update the Auto-invoke tables in every affected `AGENTS.md`.

---

## Required Skill Metadata

Each skill that should appear in Auto-invoke sections needs these fields in frontmatter:

```yaml
metadata:
  author: gentleman-programming
  version: "1.0"
  scope: [root]           # Which AGENTS.md files to update
  auto_invoke: "Creating Zod schemas or validators"   # Single action

  # OR multiple actions:
  # auto_invoke:
  #   - "Creating Zod schemas or validators"
  #   - "Validating request DTOs"
```

---

## Scope Values — This Project

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

Skills can target multiple scopes: `scope: [root, admin, customer]`

---

## Usage

### After Creating or Modifying a Skill

```bash
# Sync all AGENTS.md files
./skills/skill-sync/assets/sync.sh

# Dry run — preview changes without writing
./skills/skill-sync/assets/sync.sh --dry-run

# Sync only one scope
./skills/skill-sync/assets/sync.sh --scope admin
./skills/skill-sync/assets/sync.sh --scope root
```

### What the Script Does

1. Reads all `skills/*/SKILL.md` files
2. Extracts `metadata.scope` and `metadata.auto_invoke` from each
3. Generates Auto-invoke tables sorted alphabetically by action
4. Updates (or inserts) the `### Auto-invoke Skills` section in each target `AGENTS.md`

---

## Example

Given this skill:

```yaml
# skills/zod/SKILL.md
metadata:
  author: gentleman-programming
  version: "1.0"
  scope: [root, api-gateway, auth-service]
  auto_invoke:
    - "Creating Zod schemas or validators"
    - "Validating request DTOs"
```

The sync script adds to `AGENTS.md`, `apps/api-gateway/AGENTS.md`, and `apps/auth-service/AGENTS.md`:

```markdown
### Auto-invoke Skills

| Action | Skill |
|--------|-------|
| Creating Zod schemas or validators | `zod` |
| Validating request DTOs | `zod` |
```

---

## Checklist After Modifying Skills

- [ ] Added `metadata.scope` to new/modified skill
- [ ] Added `metadata.auto_invoke` with clear action description
- [ ] Ran `./skills/skill-sync/assets/sync.sh`
- [ ] Verified AGENTS.md files updated correctly
- [ ] Committed both the skill and the updated AGENTS.md

## Resources

- **Sync script**: See [assets/sync.sh](assets/sync.sh)
- **Root orchestrator**: See [../../AGENTS.md](../../AGENTS.md)
