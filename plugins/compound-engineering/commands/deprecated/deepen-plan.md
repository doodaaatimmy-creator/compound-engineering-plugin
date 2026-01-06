---
name: deepen-plan
description: "[DEPRECATED] Use /plan:deepen instead"
argument-hint: "[plan file path]"
---

# Command Renamed

**`/deepen-plan` has been renamed to `/plan:deepen`**

Please use the new command:

```
/plan:deepen $ARGUMENTS
```

## Why the change?

All planning commands now use the `/plan:*` namespace for better discoverability:

| Old Command | New Command |
|-------------|-------------|
| `/workflows:plan` | `/plan:compound` |
| `/deepen-plan` | `/plan:deepen` |
| `/plan_review` | `/plan:review` |

Plans are now stored in `~/.claude/plans/` to match Claude Code's built-in Plan Mode storage location.
