---
name: writing:knowledge
description: Manage workspace knowledge - voice profiles, patterns, and reference materials
argument-hint: "[add|search|list] [content or query]"
---

# Writing Knowledge Command

Build and query your writing knowledge base - voice profiles, proven patterns, and reference materials.

## Input

<knowledge_input> #$ARGUMENTS </knowledge_input>

Parse:
- Action: `add`, `search`, `list`, `import`
- Content: Query string or content to add

## Knowledge Architecture

```
.claude/writing-knowledge/
├── voice-profiles/          # Encoded writing voices
│   ├── kieran-blog.yaml
│   └── company-formal.yaml
├── patterns/                 # Proven patterns
│   ├── hooks/
│   ├── structures/
│   └── transitions/
├── references/              # Source materials
│   ├── style-guides/
│   └── exemplars/
└── index.md                 # Searchable index
```

## Actions

### `search` - Find Relevant Knowledge

```bash
/writing:knowledge search "opening hooks for technical content"
```

**Process**:
1. Search voice profiles for relevant traits
2. Search patterns for matching techniques
3. Search references for examples
4. Rank by relevance and recency

**Output**:
```markdown
## Knowledge Search: "opening hooks for technical content"

### Voice Profile Match
**kieran-blog** recommends:
- Lead with counterintuitive insight
- Concrete before abstract

### Relevant Patterns
**hook-stat-surprise** (used 12x, 89% positive feedback)
> "Most developers spend 40% of their time..."

**hook-question-challenge** (used 8x, 75% positive)
> "What if everything you knew about X was wrong?"

### Reference Examples
From `exemplars/best-openings.md`:
- [Example 1 with source]
- [Example 2 with source]
```

### `add` - Add New Knowledge

```bash
/writing:knowledge add pattern "The Callback Close - end by referencing the opening hook"
```

**Process**:
1. Categorize the knowledge (pattern/voice/reference)
2. Extract key attributes
3. Add to appropriate location
4. Update searchable index

### `list` - Browse Knowledge

```bash
/writing:knowledge list patterns
/writing:knowledge list voice-profiles
/writing:knowledge list references
```

### `import` - Import from External Source

```bash
/writing:knowledge import voice-profile samples/writing-samples/*.md
/writing:knowledge import patterns competitor-analysis.md
```

## Two-Level Knowledge System

### Level 1: Instant Access (Brief)
Core facts loaded into every writing session:
- Active voice profile traits
- Top 5 proven patterns
- Key prohibitions

### Level 2: Deep Lookup (Search)
Full knowledge base queried on demand:
- All pattern variations
- Complete exemplar library
- Historical feedback data

## Knowledge Index

The index at `.claude/writing-knowledge/index.md`:

```markdown
---
updated: 2025-01-16
profiles: 3
patterns: 47
references: 12
---

# Writing Knowledge Index

## Quick Stats
- **Most used pattern**: hook-stat-surprise (34 uses)
- **Best performing**: callback-close (94% positive)
- **Active voice**: kieran-blog

## Categories

### Hooks (12 patterns)
- hook-stat-surprise: Lead with surprising statistic
- hook-question: Open with provocative question
- hook-story: In media res narrative
...

### Structures (8 patterns)
- structure-problem-solution: Classic persuasion arc
- structure-listicle: Numbered insights
...

### Transitions (15 patterns)
...

### Closings (7 patterns)
...

## Voice Profiles
- kieran-blog: Conversational, direct, technically-informed
- company-formal: Professional, precise, authoritative
- newsletter: Personal, warm, insight-forward
```

## Integration with Commands

### /writing:plan
```
Before planning:
- Load Level 1 knowledge (brief)
- Check for relevant patterns
- Apply voice profile constraints
```

### /writing:draft
```
During drafting:
- Query Level 2 for specific techniques
- Match patterns to content type
- Enforce voice profile rules
```

### /writing:review
```
During review:
- Check against voice profile
- Verify pattern usage
- Flag knowledge violations
```

### /writing:compound
```
After success:
- Extract new patterns
- Update index
- Reinforce what worked
```

## Building Your Knowledge Base

### Start with Voice Profile
```bash
# Capture your voice from samples
/writing:knowledge import voice-profile my-best-posts/*.md

# Or define manually
/writing:knowledge add voice-profile "direct, uses analogies, avoids jargon"
```

### Add Patterns as You Write
```bash
# After a successful piece
/writing:compound draft-final.md

# Manually add a technique
/writing:knowledge add pattern hooks "Start with the ending - reveal outcome first"
```

### Import References
```bash
# Add style guides
/writing:knowledge import reference company-style-guide.pdf

# Add exemplars
/writing:knowledge import exemplar best-blog-post.md "Great hook technique"
```

## Knowledge Queries

Natural language queries work:

```bash
/writing:knowledge search "how do I write better openings?"
/writing:knowledge search "examples of data-driven hooks"
/writing:knowledge search "what does kieran-blog voice sound like?"
/writing:knowledge search "patterns for technical tutorials"
```

## Knowledge Lifecycle

```
Write → Get Feedback → Compound → Knowledge grows
   ↑                                    ↓
   ←←←←← Future writing benefits ←←←←←←
```

Each successful piece adds to knowledge:
- New patterns discovered
- Voice profile refined
- Feedback integrated

## Example: Building Hook Knowledge

```markdown
## Pattern: hook-stat-surprise

**Category**: hooks
**Uses**: 34
**Success Rate**: 89%

**Formula**:
"[Surprising statistic]. [Why it matters]. [What we'll explore]."

**Examples**:
1. "Developers spend 40% of their time debugging. That's 2 days a week lost. Here's how to cut it in half."
2. "93% of written content never gets read past the headline. Yours doesn't have to be one of them."

**When to use**:
- Technical content
- Persuasive pieces
- Data-rich topics

**Variations**:
- Lead with the stat
- Lead with the implication
- Lead with the question the stat answers

**Source**: Extracted from top-performing posts 2024-2025
```
