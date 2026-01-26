---
name: compound-engineering-setup
description: Configure compound-engineering plugin agents and preferences for your project
argument-hint: "[--global to configure globally]"
---

# Compound Engineering Setup

Configure which review agents and workflows to use for this project. Creates a `.claude/compound-engineering.json` configuration file.

## Detect Configuration Location

<config_detection>

Check if user passed `--global` argument:
- **If `--global`**: Configure at `~/.claude/compound-engineering.json` (applies to all projects)
- **Otherwise**: Configure at `.claude/compound-engineering.json` (project-specific)

Check if configuration already exists:
```bash
# Check project config
test -f .claude/compound-engineering.json && echo "Project config exists"

# Check global config
test -f ~/.claude/compound-engineering.json && echo "Global config exists"
```

If config exists, offer to edit existing or start fresh.

</config_detection>

## Step 1: Detect Project Type

<project_detection>

Detect the primary language/framework automatically:

```bash
# Check for common project indicators
ls -la Gemfile package.json requirements.txt pyproject.toml Cargo.toml go.mod pom.xml 2>/dev/null
ls -la *.xcodeproj *.xcworkspace Package.swift 2>/dev/null
```

**Detection Rules:**
- `Gemfile` + `config/routes.rb` → **Rails**
- `Gemfile` without Rails → **Ruby**
- `package.json` + `tsconfig.json` → **TypeScript**
- `package.json` without TypeScript → **JavaScript**
- `requirements.txt` OR `pyproject.toml` → **Python**
- `Cargo.toml` → **Rust**
- `go.mod` → **Go**
- `*.xcodeproj` OR `Package.swift` → **Swift/iOS**
- None of the above → **General**

Store detected type for recommendations.

</project_detection>

## Step 2: Quick vs Advanced Setup

<setup_mode>

Use AskUserQuestion to determine setup mode:

```
AskUserQuestion:
  questions:
    - question: "How would you like to configure compound-engineering?"
      header: "Setup mode"
      options:
        - label: "Quick Setup (Recommended)"
          description: "Use smart defaults based on your project type. Best for most users."
        - label: "Advanced Setup"
          description: "Manually select each agent and configure options. For power users."
        - label: "Minimal Setup"
          description: "Only essential agents (security + code quality). Fastest reviews."
```

</setup_mode>

## Step 3A: Quick Setup Flow

<quick_setup>

If user chose "Quick Setup":

### Rails Projects
Default config:
```json
{
  "projectType": "rails",
  "reviewAgents": [
    "kieran-rails-reviewer",
    "dhh-rails-reviewer",
    "code-simplicity-reviewer",
    "security-sentinel",
    "performance-oracle"
  ],
  "planReviewAgents": [
    "kieran-rails-reviewer",
    "code-simplicity-reviewer"
  ],
  "conditionalAgents": {
    "migrations": ["data-migration-expert", "deployment-verification-agent"],
    "frontend": ["julik-frontend-races-reviewer"],
    "architecture": ["architecture-strategist", "pattern-recognition-specialist"]
  }
}
```

### Python Projects
Default config:
```json
{
  "projectType": "python",
  "reviewAgents": [
    "kieran-python-reviewer",
    "code-simplicity-reviewer",
    "security-sentinel",
    "performance-oracle"
  ],
  "planReviewAgents": [
    "kieran-python-reviewer",
    "code-simplicity-reviewer"
  ],
  "conditionalAgents": {
    "architecture": ["architecture-strategist", "pattern-recognition-specialist"]
  }
}
```

### TypeScript Projects
Default config:
```json
{
  "projectType": "typescript",
  "reviewAgents": [
    "kieran-typescript-reviewer",
    "code-simplicity-reviewer",
    "security-sentinel",
    "performance-oracle"
  ],
  "planReviewAgents": [
    "kieran-typescript-reviewer",
    "code-simplicity-reviewer"
  ],
  "conditionalAgents": {
    "frontend": ["julik-frontend-races-reviewer"],
    "architecture": ["architecture-strategist", "pattern-recognition-specialist"]
  }
}
```

### General/Other Projects
Default config:
```json
{
  "projectType": "general",
  "reviewAgents": [
    "code-simplicity-reviewer",
    "security-sentinel",
    "performance-oracle"
  ],
  "planReviewAgents": [
    "code-simplicity-reviewer"
  ],
  "conditionalAgents": {
    "architecture": ["architecture-strategist", "pattern-recognition-specialist"]
  }
}
```

</quick_setup>

## Step 3B: Advanced Setup Flow

<advanced_setup>

If user chose "Advanced Setup", walk through each category:

### Question 1: Primary Code Review Agents

```
AskUserQuestion:
  questions:
    - question: "Which code review agents should run on every PR?"
      header: "Review agents"
      multiSelect: true
      options:
        - label: "kieran-rails-reviewer"
          description: "Rails conventions, naming, clarity (Rails projects)"
        - label: "kieran-typescript-reviewer"
          description: "TypeScript best practices, type safety"
        - label: "kieran-python-reviewer"
          description: "Python patterns, typing, best practices"
        - label: "dhh-rails-reviewer"
          description: "Opinionated Rails style from DHH's perspective"
```

### Question 2: Quality & Security Agents

```
AskUserQuestion:
  questions:
    - question: "Which quality and security agents should run?"
      header: "Quality agents"
      multiSelect: true
      options:
        - label: "code-simplicity-reviewer (Recommended)"
          description: "Ensures code is as simple as possible"
        - label: "security-sentinel (Recommended)"
          description: "Security vulnerabilities and OWASP compliance"
        - label: "performance-oracle"
          description: "Performance issues and optimization"
        - label: "architecture-strategist"
          description: "Architectural patterns and design decisions"
```

### Question 3: Plan Review Agents

```
AskUserQuestion:
  questions:
    - question: "Which agents should review implementation plans?"
      header: "Plan reviewers"
      multiSelect: true
      options:
        - label: "Use same as code review (Recommended)"
          description: "Reuse your code review agent selection"
        - label: "code-simplicity-reviewer only"
          description: "Lightweight plan reviews focused on simplicity"
        - label: "Custom selection"
          description: "Choose specific agents for plan reviews"
```

### Question 4: Conditional Agents

```
AskUserQuestion:
  questions:
    - question: "Enable conditional agents that run based on file changes?"
      header: "Smart agents"
      multiSelect: true
      options:
        - label: "Migration agents (Recommended)"
          description: "data-migration-expert + deployment-verification for DB changes"
        - label: "Frontend agents"
          description: "julik-frontend-races-reviewer for JS/Stimulus code"
        - label: "Architecture agents"
          description: "pattern-recognition-specialist for structural changes"
        - label: "None"
          description: "Only run configured review agents"
```

</advanced_setup>

## Step 3C: Minimal Setup Flow

<minimal_setup>

If user chose "Minimal Setup":

```json
{
  "projectType": "{detected}",
  "reviewAgents": [
    "code-simplicity-reviewer",
    "security-sentinel"
  ],
  "planReviewAgents": [
    "code-simplicity-reviewer"
  ],
  "conditionalAgents": {}
}
```

</minimal_setup>

## Step 4: Additional Options

<additional_options>

For all setup modes, ask:

```
AskUserQuestion:
  questions:
    - question: "Include agent-native-reviewer to verify features are accessible to AI agents?"
      header: "Agent-native"
      options:
        - label: "Yes (Recommended)"
          description: "Ensures new features can be used by Claude and other AI tools"
        - label: "No"
          description: "Skip agent accessibility checks"
```

If "Yes", add `"agent-native-reviewer"` to reviewAgents.

</additional_options>

## Step 5: Write Configuration

<write_config>

Create the configuration file:

```bash
# Ensure .claude directory exists
mkdir -p .claude

# Write configuration (or to ~/.claude/ if --global)
```

Write the JSON configuration:

```json
{
  "$schema": "https://raw.githubusercontent.com/EveryInc/compound-engineering-plugin/main/schemas/compound-engineering.schema.json",
  "version": "1.0",
  "projectType": "{detected_type}",
  "reviewAgents": [
    // Selected agents
  ],
  "planReviewAgents": [
    // Selected agents
  ],
  "conditionalAgents": {
    "migrations": ["data-migration-expert", "deployment-verification-agent"],
    "frontend": ["julik-frontend-races-reviewer"],
    "architecture": ["architecture-strategist", "pattern-recognition-specialist"]
  },
  "options": {
    "agentNative": true,
    "parallelReviews": true
  }
}
```

</write_config>

## Step 6: Confirm and Summarize

<summary>

Present the configuration summary:

```markdown
## Configuration Complete

**Location:** `.claude/compound-engineering.json`
**Project Type:** {type}

### Review Agents (run on every PR)
- {agent1}
- {agent2}
- ...

### Plan Review Agents
- {agent1}
- ...

### Conditional Agents
- **Migrations:** {agents or "disabled"}
- **Frontend:** {agents or "disabled"}
- **Architecture:** {agents or "disabled"}

### Options
- Agent-native reviews: {enabled/disabled}
- Parallel reviews: {enabled/disabled}

---

**Next steps:**
1. Run `/workflows:review` to test your configuration
2. Run `/compound-engineering-setup` again to modify settings
3. Commit `.claude/compound-engineering.json` to share with your team
```

</summary>

## Configuration File Reference

<config_reference>

### Full Schema

```json
{
  "$schema": "https://raw.githubusercontent.com/EveryInc/compound-engineering-plugin/main/schemas/compound-engineering.schema.json",
  "version": "1.0",
  "projectType": "rails|python|typescript|javascript|rust|go|swift|general",

  "reviewAgents": [
    "kieran-rails-reviewer",
    "dhh-rails-reviewer",
    "code-simplicity-reviewer",
    "security-sentinel",
    "performance-oracle"
  ],

  "planReviewAgents": [
    "kieran-rails-reviewer",
    "code-simplicity-reviewer"
  ],

  "conditionalAgents": {
    "migrations": ["data-migration-expert", "deployment-verification-agent"],
    "frontend": ["julik-frontend-races-reviewer"],
    "architecture": ["architecture-strategist", "pattern-recognition-specialist"],
    "data": ["data-integrity-guardian"]
  },

  "options": {
    "agentNative": true,
    "parallelReviews": true,
    "autoFix": false
  }
}
```

### Available Agents

**Code Review (language-specific):**
- `kieran-rails-reviewer` - Rails conventions and best practices
- `kieran-python-reviewer` - Python patterns and typing
- `kieran-typescript-reviewer` - TypeScript type safety
- `dhh-rails-reviewer` - Opinionated Rails style

**Quality & Security:**
- `code-simplicity-reviewer` - Code simplicity and YAGNI
- `security-sentinel` - Security vulnerabilities
- `performance-oracle` - Performance optimization
- `architecture-strategist` - Architectural patterns
- `pattern-recognition-specialist` - Code patterns and anti-patterns

**Specialized:**
- `data-migration-expert` - Database migration safety
- `deployment-verification-agent` - Deployment checklists
- `data-integrity-guardian` - Data model integrity
- `julik-frontend-races-reviewer` - JavaScript race conditions
- `agent-native-reviewer` - AI accessibility

</config_reference>

## Fallback Behavior

<fallback>

If no configuration file exists when running `/workflows:review` or `/plan_review`:

1. Check for `.claude/compound-engineering.json`
2. Check for `~/.claude/compound-engineering.json`
3. If neither exists, prompt: "No configuration found. Run `/compound-engineering-setup` to configure agents, or use defaults?"
4. If user chooses defaults, use the General project defaults

</fallback>
