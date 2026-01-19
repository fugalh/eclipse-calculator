# Audit Plan: ECLIPSE_RULES.md vs Source Rulebook

## Problem

- `rules/ECLIPSE_RULES.md` (864 lines) - LLM-formatted rules
- `rules/eclipse-second-dawn-for-the-galaxy-rulebook.txt` (~30k tokens) - OCR export from PDF
- Source file too large to read directly; needs chunked comparison

## User Preferences

- **Output format**: Inline comments in ECLIPSE_RULES.md
- **Auto-correct**: Yes, apply fixes after identifying issues
- **Priority**: All sections audited equally

---

## Execution Plan

### Step 1: Create Section Splitter Script

Create `scripts/split-rulebook.ts` to:

1. Read the large `.txt` file
2. Split into ~20 chunk files by detecting section boundaries (page numbers, headers, blank lines)
3. Output to `rules/chunks/` directory with numbered files

This allows subagents to read individual chunks without token limits.

### Step 2: Launch Parallel Audit Agents (4 agents)

Each agent reads specific chunks from source + corresponding sections from ECLIPSE_RULES.md:

| Agent       | Source Chunks | MD Sections                  | Focus               |
| ----------- | ------------- | ---------------------------- | ------------------- |
| **Agent 1** | chunks 1-5    | Components, Overview, Setup  | Game setup accuracy |
| **Agent 2** | chunks 6-10   | Game Concepts, Actions       | Core mechanics      |
| **Agent 3** | chunks 11-15  | Combat, Upkeep, Cleanup, End | Combat rules        |
| **Agent 4** | chunks 16-20  | Species, Techs, Parts, FAQ   | Reference data      |

Each agent outputs a list of findings:

```
LINE 123: [ERROR] Hull absorbs damage, not "takes" damage
LINE 456: [MISSING] Retreat rules missing defender tie-breaker detail
LINE 789: [OK] Section verified accurate
```

### Step 3: Apply Corrections

Using agent findings on the **copy** (`ECLIPSE_RULES_AUDITED.md`):

1. Add inline `<!-- AUDIT: ... -->` comments for review items
2. Directly fix clear errors (wrong numbers, typos)
3. Add missing content from source

**Original `ECLIPSE_RULES.md` remains unchanged.**

### Step 4: Cleanup

1. Remove chunk files from `rules/chunks/`
2. Run final diff between original and audited version to summarize changes

---

## Files to Create/Modify

| File                             | Action                                     |
| -------------------------------- | ------------------------------------------ |
| `scripts/split-rulebook.ts`      | Create - splits source into chunks         |
| `rules/chunks/*.txt`             | Create (temp) - chunked source files       |
| `rules/ECLIPSE_RULES_AUDITED.md` | Create - copy of original with corrections |
| `rules/ECLIPSE_RULES.md`         | **Unchanged** - preserved as-is            |

---

## Estimated Workflow

```
[Copy] ECLIPSE_RULES.md → ECLIPSE_RULES_AUDITED.md
    ↓
[Script] Split source → 20 chunk files
    ↓
[4 Agents in Parallel] Read chunks + audited MD → Report findings
    ↓
[Main] Aggregate findings → Apply corrections to AUDITED copy
    ↓
[Cleanup] Delete chunk files
    ↓
[Diff] Compare original vs audited for summary
```
