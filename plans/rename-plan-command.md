# Rename `/workflows:plan` Command

## Overview

Explore renaming `/workflows:plan` to align better with Claude Code's built-in `/plan` command and improve discoverability.

## Problem Statement

The current `/workflows:plan` command name:
1. Is verbose compared to built-in `/plan`
2. Uses `workflows:` prefix which was chosen to avoid collision with future built-in commands
3. Users may not discover it when expecting a `/plan` command

## Research Findings

### Claude Code's Built-in Plan Mode

**Key insight:** Claude Code has **Plan Mode**, not a `/plan` command.

- **Activation:** `Shift+Tab` twice OR `claude --permission-mode plan`
- **Behavior:** Read-only mode - Claude can only analyze, not execute
- **Plans saved:** As markdown files in project's `plans/` folder
- **No extensibility:** Plugins cannot hook into Plan Mode

### Current Plugin Commands Structure

```
commands/
├── workflows/
│   ├── plan.md        → /workflows:plan (creates detailed plans)
│   ├── work.md        → /workflows:work (executes work)
│   ├── review.md      → /workflows:review (code review)
│   └── compound.md    → /workflows:compound (document learnings)
├── deepen-plan.md     → /deepen-plan (enhance plans with research)
├── plan_review.md     → /plan_review (have reviewers check plan)
└── ...
```

### Why `workflows:` Prefix Exists

From `CLAUDE.md`:
> **Why `workflows:`?** Claude Code has built-in `/plan` and `/review` commands. Using `name: workflows:plan` in frontmatter creates a unique `/workflows:plan` command with no collision.

**Note:** Research shows there is NO built-in `/plan` command currently. The concern may have been preemptive or based on older documentation.

## Options Analysis

### Option A: `/plan:compound` or `/plan:deep`

**Structure:**
```
/plan:compound  → Full planning workflow (current /workflows:plan)
/plan:deepen    → Enhance with parallel research (current /deepen-plan)
/plan:review    → Have reviewers check plan (current /plan_review)
```

**Pros:**
- Clear `/plan:*` namespace for all planning
- Short and discoverable
- `compound` connects to compounding engineering philosophy

**Cons:**
- Could collide if Claude adds `/plan:*` commands
- Changes namespace structure (not `workflows:`)

### Option B: `/deep-plan` (Simple Rename)

**Structure:**
```
/deep-plan      → Full planning workflow (renamed from /workflows:plan)
/deepen-plan    → Keep as is (already well-named)
/plan-review    → Rename for consistency (from /plan_review)
```

**Pros:**
- Simple, no namespace collision
- `deep` indicates thoroughness vs quick planning
- Clear differentiation from Plan Mode

**Cons:**
- Loses the `workflows:` grouping
- `deep` might be confused with `deepen`

### Option C: Keep `/workflows:plan` (No Change)

**Pros:**
- Consistent namespace for all workflow commands
- Zero collision risk
- Already documented and in use

**Cons:**
- Verbose
- Users may not discover it

### Option D: `/compound:plan` (Rebrand Namespace)

**Structure:**
```
/compound:plan    → Planning workflow
/compound:work    → Execute work
/compound:review  → Code review
/compound:learn   → Document learnings (rename compound)
```

**Pros:**
- Clear branding connection to "compounding engineering"
- Short and memorable
- Unique namespace

**Cons:**
- Requires renaming multiple commands
- More migration work

### Option E: Hybrid - Keep Both

**Structure:**
```
/workflows:plan   → Full (keep for compatibility)
/plan             → Alias to /workflows:plan (if possible)
```

**Analysis:** Claude Code plugins don't support command aliases currently.

## Recommendation: Option D - `/compound:*` Namespace

**Reasoning:**

1. **Brand alignment:** "Compound engineering" is the core philosophy
2. **Unique:** No collision risk with built-in commands
3. **Short:** Shorter than `workflows:` while being descriptive
4. **Cohesive:** All commands relate to compounding knowledge

**Proposed Renames:**

| Current | New | Purpose |
|---------|-----|---------|
| `/workflows:plan` | `/compound:plan` | Create implementation plans |
| `/workflows:work` | `/compound:work` | Execute work items |
| `/workflows:review` | `/compound:review` | Comprehensive code review |
| `/workflows:compound` | `/compound:learn` | Document solved problems |
| `/deepen-plan` | `/compound:deepen` | Enhance plans with research |
| `/plan_review` | `/compound:critique` | Have reviewers check plan |

**Alternative if staying conservative:** Option A (`/plan:compound`) for just the planning commands.

## Implementation Plan

### Phase 1: Rename Command Files

```bash
# Rename workflow commands
mv commands/workflows/plan.md commands/workflows/compound-plan.md
mv commands/workflows/work.md commands/workflows/compound-work.md
mv commands/workflows/review.md commands/workflows/compound-review.md
mv commands/workflows/compound.md commands/workflows/compound-learn.md

# Or restructure entirely
mkdir commands/compound/
mv commands/workflows/*.md commands/compound/
```

### Phase 2: Update Frontmatter

Each file needs `name:` updated:
```yaml
---
name: compound:plan  # Was: workflows:plan
description: ...
---
```

### Phase 3: Update Cross-References

Files reference each other (e.g., `/workflows:plan` mentions `/deepen-plan`):
- Update all internal references to new names
- Update CLAUDE.md documentation
- Update README.md

### Phase 4: Update Plugin Metadata

- `plugin.json` - Update command counts/descriptions
- `marketplace.json` - Update description
- `CHANGELOG.md` - Document breaking change

## Plan Save Location

Plans are saved to `plans/<issue-title>.md` in the project directory. This is:
- **Consistent** with Claude Code's Plan Mode expectations
- **Tracked** by git (unless gitignored)
- **Accessible** for `/deepen-plan` and `/plan_review`

## Acceptance Criteria

- [ ] Commands renamed to new namespace
- [ ] All cross-references updated
- [ ] Documentation updated (README, CHANGELOG)
- [ ] Plugin version bumped (MINOR - new command names)
- [ ] Old commands no longer available (breaking change)

## References

- Claude Code documentation: No built-in `/plan` command, only Plan Mode
- Current plugin CLAUDE.md: `plugins/compound-engineering/CLAUDE.md:35`
- Workflow commands: `plugins/compound-engineering/commands/workflows/`
