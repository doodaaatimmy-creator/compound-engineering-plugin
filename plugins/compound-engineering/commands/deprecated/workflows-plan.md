---
name: workflows:plan
description: "[DEPRECATED] Use /plan:compound instead"
argument-hint: "[feature description]"
---

# Command Renamed

**`/workflows:plan` has been renamed to `/plan:compound`**

Please use the new command:

```
/plan:compound $ARGUMENTS
```

## Why the change?

All planning commands now use the `/plan:*` namespace for better discoverability:

| Old Command | New Command |
|-------------|-------------|
| `/workflows:plan` | `/plan:compound` |
| `/deepen-plan` | `/plan:deepen` |
| `/plan_review` | `/plan:review` |

Plans are now stored in `~/.claude/plans/` to match Claude Code's built-in Plan Mode storage location.
