---
status: complete
priority: p2
issue_id: "002"
tags: [code-review, quality, codex, conversion]
dependencies: []
---

# Enforce Codex skill description limits and single-line format

Codex skill descriptions must be single-line and within Codex's current max length, but the converter allowed multiline descriptions and truncated at 1024 characters. The whitespace normalization also used the wrong regex and did not collapse newlines.

## Problem Statement

Converted Codex skills can violate Codex frontmatter constraints, leading to invalid or truncated skills in Codex. This is especially likely for agents/commands with long or multiline descriptions if the limit is lower than 1024.

## Findings

- `src/converters/claude-to-codex.ts:41-66` uses `sanitizeDescription` for generated skills but does not enforce Codex limits.
- `src/converters/claude-to-codex.ts:103-109` previously set `maxLength = 1024` and used `/\\s+/g`, which matches a literal "\s" instead of whitespace.
- `docs/specs/codex.md` states skill description is single-line with a max length (set to 1024 per current spec).

## Proposed Solutions

### Option 1: Enforce Codex limits in `sanitizeDescription` (recommended)

**Approach:**
- Confirm Codex's current max length and set `maxLength` accordingly (set to 1024 per spec).
- Normalize whitespace using `/\\s+/g` and trim.
- Ensure output has no newlines before formatting frontmatter.

**Pros:**
- Produces spec-compliant Codex skills
- Simple change with high impact

**Cons:**
- Truncation may be more aggressive than current output

**Effort:** 1-2 hours

**Risk:** Low

---

### Option 2: Add explicit validation and warnings

**Approach:**
- Add a validation step before writing skills to warn (or fail) if description violates spec.

**Pros:**
- Explicit feedback for plugin authors

**Cons:**
- Extra logic; still need to enforce to be safe

**Effort:** 2-3 hours

**Risk:** Low

---

### Option 3: Preserve long descriptions in body

**Approach:**
- Move long/multiline descriptions into the skill body and keep frontmatter short.

**Pros:**
- Keeps context without violating limits

**Cons:**
- Behavior change; may be unexpected

**Effort:** 2-4 hours

**Risk:** Medium

## Recommended Action

Normalize description whitespace, enforce single-line output, and cap length at the Codex limit (1024 per current spec). Update tests to assert the new limit and no newline output.


## Technical Details

**Affected files:**
- `src/converters/claude-to-codex.ts:41-66`
- `src/converters/claude-to-codex.ts:103-109`

## Resources

- Codex skill spec: `docs/specs/codex.md` (confirm description length and format requirements)

## Acceptance Criteria

- [x] Skill descriptions are single-line and match Codex's max length.
- [x] `sanitizeDescription` collapses whitespace correctly and removes newlines.
- [x] Tests cover multiline and long descriptions.
- [x] Existing tests updated to reflect new limit.

## Work Log

### 2026-01-21 - Initial Discovery

**By:** Codex

**Actions:**
- Compared converter output against Codex spec.
- Found incorrect regex and limit mismatch.

**Learnings:**
- Codex frontmatter constraints are stricter than current implementation; verify the exact length limit.

### 2026-01-21 - Approved for Work

**By:** Claude Triage System

**Actions:**
- Issue approved during triage session
- Status changed from pending → ready
- Ready to be picked up and worked on

**Learnings:**
- Confirm Codex limit before changing max length; single-line enforcement is required regardless.

### 2026-01-21 - Completed

**By:** Codex

**Actions:**
- Updated `sanitizeDescription` to normalize whitespace and cap at 1024 characters.
- Added test coverage for multiline descriptions and new limit.
- Ran `bun test`.

**Learnings:**
- Codex limits are stricter than earlier assumptions; aligning tests and docs prevents regressions.

## Notes

Keep prompt frontmatter unchanged; only generated skill descriptions need enforcement.
