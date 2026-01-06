---
name: plan_review
description: "[DEPRECATED] Use /plan:review instead"
argument-hint: "[plan file path]"
---

# Command Renamed

**`/plan_review` has been renamed to `/plan:review`**

Please use the new command:

```
/plan:review $ARGUMENTS
```

## Why the change?

All planning commands now use the `/plan:*` namespace for better discoverability:

| Old Command | New Command |
|-------------|-------------|
| `/workflows:plan` | `/plan:compound` |
| `/deepen-plan` | `/plan:deepen` |
| `/plan_review` | `/plan:review` |

Plans are now stored in `~/.claude/plans/` to match Claude Code's built-in Plan Mode storage location.
