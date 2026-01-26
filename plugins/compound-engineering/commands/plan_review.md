---
name: plan_review
description: Have multiple specialized agents review a plan in parallel
argument-hint: "[plan file path or plan content]"
---

# Plan Review

Review a plan using configured agents from `.claude/compound-engineering.json`.

## Load Configuration

<config_loading>

Check for configuration file:

```bash
# Check project config first, then global
if [ -f .claude/compound-engineering.json ]; then
  CONFIG_FILE=".claude/compound-engineering.json"
elif [ -f ~/.claude/compound-engineering.json ]; then
  CONFIG_FILE="~/.claude/compound-engineering.json"
else
  CONFIG_FILE=""
fi
```

**If config exists:** Read `planReviewAgents` array from the config file.

**If no config exists:** Use these defaults:
- `code-simplicity-reviewer`
- `architecture-strategist`

Or prompt: "No configuration found. Run `/compound-engineering-setup` to configure agents, or use defaults?"

</config_loading>

## Execute Review

For each agent in `planReviewAgents`:

```
Task {agent-name}("Review this plan: {plan content}")
```

Run all agents in parallel using multiple Task tool calls in a single message.

## Example Config

```json
{
  "planReviewAgents": [
    "kieran-rails-reviewer",
    "code-simplicity-reviewer"
  ]
}
```

## Fallback Defaults

If no config and user wants defaults:
- **Rails projects**: `kieran-rails-reviewer`, `code-simplicity-reviewer`
- **Python projects**: `kieran-python-reviewer`, `code-simplicity-reviewer`
- **TypeScript projects**: `kieran-typescript-reviewer`, `code-simplicity-reviewer`
- **General**: `code-simplicity-reviewer`, `architecture-strategist`
