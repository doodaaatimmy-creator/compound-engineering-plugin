---
status: complete
priority: p2
issue_id: "001"
tags: [code-review, security, parsing]
dependencies: []
---

# Validate plugin-relative paths to prevent path traversal

Custom component paths from Claude manifests are joined directly to the plugin root without validation. A malicious or malformed manifest can include "../" segments to read files outside the plugin root (hooks, agents, commands, skills, MCP configs), which then get copied into conversion outputs.

## Problem Statement

The CLI trusts manifest-supplied paths without ensuring they stay within the plugin root. This allows path traversal to read or copy files outside the plugin, which is a data exposure risk if users convert untrusted plugins.

## Findings

- `src/parsers/claude.ts:177-185` appends custom paths via `path.join(root, entry)` with no boundary checks.
- `src/parsers/claude.ts:117-134` reads custom hook paths the same way.
- `src/parsers/claude.ts:223-232` loads MCP path entries with the same pattern.
- `walkFiles` will recursively enumerate whatever directory is reached, increasing blast radius.

## Proposed Solutions

### Option 1: Enforce root containment (recommended)

**Approach:** Resolve each custom path with `path.resolve(root, entry)` and reject anything that does not start with `${root}${path.sep}` (or exact match). Skip or throw on invalid paths.

**Pros:**
- Prevents traversal and unintended file access
- Simple to implement and reason about

**Cons:**
- Could break existing plugins that relied on `../` paths (unsupported by spec)

**Effort:** 1-2 hours

**Risk:** Low

---

### Option 2: Allowlist specific escape paths

**Approach:** Permit only whitelisted paths outside root (e.g., shared assets) via CLI flags.

**Pros:**
- Backward-compatible escape hatch

**Cons:**
- Adds complexity and potential footguns

**Effort:** 2-4 hours

**Risk:** Medium

---

### Option 3: Soft validation with warnings

**Approach:** Warn when paths escape root but continue processing.

**Pros:**
- Non-breaking

**Cons:**
- Security issue remains

**Effort:** 1 hour

**Risk:** Medium

## Recommended Action

Resolve and validate custom path entries by enforcing plugin-root containment. Reject invalid paths with a clear error and add test coverage for traversal attempts.

## Technical Details

**Affected files:**
- `src/parsers/claude.ts:117-185`
- `src/parsers/claude.ts:223-232`

## Resources

- Claude spec: custom paths must be relative to plugin root (see `docs/specs/claude-code.md`).

## Acceptance Criteria

- [x] Custom component paths are rejected if they escape plugin root.
- [x] Hooks and MCP path lists use the same validation.
- [x] Tests cover a manifest with `../` paths and assert rejection.
- [x] Valid relative paths continue to load.

## Work Log

### 2026-01-21 - Initial Discovery

**By:** Codex

**Actions:**
- Identified unvalidated `path.join(root, entry)` usage.
- Noted traversal risk for hooks and MCP paths.

**Learnings:**
- Current loader assumes trusted manifests; adding validation aligns with spec.

### 2026-01-21 - Approved for Work

**By:** Claude Triage System

**Actions:**
- Issue approved during triage session
- Status changed from pending → ready
- Ready to be picked up and worked on

**Learnings:**
- Path containment validation should be consistent across components, hooks, and MCP paths.

### 2026-01-21 - Completed

**By:** Codex

**Actions:**
- Added root containment validation for custom component, hooks, and MCP paths.
- Added fixtures and tests to reject traversal paths.
- Ran `bun test`.

**Learnings:**
- Rejecting escaped paths early prevents partial conversions and aligns with Claude spec.

## Notes

Consider failing fast with a clear error message to avoid partial conversions.
