---
name: writing:feedback
description: Capture real-time feedback into scratchpad for iterative refinement
argument-hint: "[draft ID or 'general'] [feedback text]"
---

# Writing Feedback Command

Capture what works and what doesn't into a persistent scratchpad that guides future drafts.

## Input

<feedback_input> #$ARGUMENTS </feedback_input>

Parse input:
- First word: Draft ID (e.g., "draft-1", "3") or "general"
- Rest: The feedback text

## The Scratchpad System

The scratchpad is a persistent feedback log at `drafts/.scratchpad.md` that:
- Tracks preferences marked as "good" or "bad"
- Records specific draft feedback with IDs
- Builds a profile of what resonates
- Informs all future drafts in the session

## Workflow

### Phase 1: Parse Feedback

```
Extract from input:
- target: Draft ID or "general"
- sentiment: Detect if positive ("good", "love", "yes", "perfect")
             or negative ("bad", "weak", "no", "wrong")
- content: The actual feedback
- timestamp: Current time
```

### Phase 2: Categorize Feedback

Analyze feedback for patterns:

```markdown
## Feedback Categories

### Voice & Tone
- Too formal / too casual
- Personality level
- Emotional register

### Structure & Flow
- Opening strength
- Pacing issues
- Transition problems

### Content & Substance
- Missing examples
- Weak claims
- Good insights

### Style & Language
- Word choice
- Sentence rhythm
- Jargon level
```

### Phase 3: Update Scratchpad

Append to `drafts/.scratchpad.md`:

```markdown
---
## Feedback Entry [timestamp]

**Target**: [draft ID or general]
**Sentiment**: [positive/negative/neutral]
**Category**: [voice/structure/content/style]

> [Original feedback text]

**Extracted Principle**: [What this tells us about preferences]

---
```

### Phase 4: Extract Principles

From feedback, extract actionable principles:

| Feedback | Principle |
|----------|-----------|
| "draft-2's opening is too weak" | Openings need stronger hooks |
| "love the stats in draft-1" | Data points resonate |
| "too formal" | Prefer conversational tone |
| "the analogy about gardening was perfect" | Concrete analogies work |

### Phase 5: Summarize Patterns

After 3+ feedback entries, generate a preference summary:

```markdown
## Preference Profile (Auto-Generated)

### What Works ✓
- [Pattern 1 with example]
- [Pattern 2 with example]

### What Doesn't ✗
- [Anti-pattern 1]
- [Anti-pattern 2]

### Voice Tendency
- [Inferred voice preference]

### Strategy Recommendations
Based on feedback, prioritize these situational strategies:
- [strategy-1]: Because [reason from feedback]
- [strategy-2]: Because [reason from feedback]
```

## Output

### Updated Scratchpad

Save to `drafts/.scratchpad.md`:

```markdown
---
updated: [timestamp]
entries: [count]
---

# Writing Scratchpad

## Preference Profile

### What Works ✓
- Data and statistics resonate
- Conversational tone preferred
- Concrete examples > abstract concepts

### What Doesn't ✗
- Overly formal language
- Weak openings
- Generic statements without proof

## Recent Feedback

[Most recent 10 entries]

## All Feedback Log

[Complete history]
```

### Confirmation

```markdown
✓ Feedback captured for [target]

**Extracted**: [principle]
**Category**: [category]
**Pattern count**: [N] entries

The scratchpad now reflects:
- [Key preference 1]
- [Key preference 2]

Next drafts will incorporate these preferences.
```

## Quick Feedback Shortcuts

For fast feedback capture:

```bash
# Mark something as good
/writing:feedback 2 good - love the opening hook

# Mark something as bad
/writing:feedback 3 bad - too formal, sounds corporate

# General preference
/writing:feedback general prefer short punchy sentences

# Quick thumbs
/writing:feedback 1 👍
/writing:feedback 2 👎
```

## Integration with Other Commands

### /writing:draft reads scratchpad
```
Before creating drafts:
1. Load drafts/.scratchpad.md
2. Extract preference profile
3. Apply principles to strategy selection
4. Weight recent feedback higher
```

### /writing:review considers scratchpad
```
During review:
1. Check draft against scratchpad preferences
2. Flag violations of "What Doesn't Work"
3. Highlight alignment with "What Works"
```

### /writing:compound updates patterns
```
When compounding:
1. Merge scratchpad insights into pattern library
2. Promote recurring preferences to permanent patterns
3. Clear session-specific feedback
```

## Scratchpad Lifecycle

```
Session Start
    ↓
/writing:feedback → Add entries
    ↓
/writing:draft → Read & apply
    ↓
/writing:feedback → Refine preferences
    ↓
/writing:draft → Better alignment
    ↓
/writing:compound → Persist to patterns
    ↓
Session End (scratchpad can persist or clear)
```

## Advanced: Preference Conflicts

When feedback seems contradictory:

```markdown
## Conflict Detected

Entry 1: "too casual"
Entry 5: "too formal"

**Resolution**: Ask user to clarify
"I'm seeing mixed signals on formality. Entry 1 suggested more formal,
but Entry 5 suggests more casual. What's the right balance for this piece?"
```

## Example Session

```
User: /writing:feedback 1 the opening stat really grabbed me