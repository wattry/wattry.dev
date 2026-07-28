# "checking" Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a project skill (`/checking`) that gathers 6 months of the user's GitHub activity via the gh CLI, anonymizes it, and writes a Mermaid Gantt chart to `src/work/` for the public website.

**Architecture:** Instruction-only skill — a single `SKILL.md` containing exact gh commands, a clustering/labeling procedure, an anonymization gate, and the output format. No bundled scripts; Claude executes the instructions at invocation time.

**Tech Stack:** Claude Code project skill, gh CLI, Mermaid gantt syntax.

## Global Constraints

- Repo convention: **no tests, no verification steps** — edit → commit only.
- Output must contain no repo names, org names, ticket IDs (`ABC-123` patterns), product/domain nouns, or usernames.
- Labels restricted to fixed vocabulary: API development, Auth & security, CI/CD & tooling, Refactoring, Frontend/UI, Infrastructure, Data & storage, Docs, Code review.
- Output file: `src/work/YYYY-MM-DD-public-gantt.mmd` (dated per run, prior files untouched).
- Spec (local, gitignored): `specs/2026-07-27-checking-skill-design.md`.

---

### Task 1: Create the skill

**Files:**
- Create: `.claude/skills/checking/SKILL.md`

**Interfaces:**
- Consumes: nothing (new skill).
- Produces: `/checking` skill invokable in this project; each run emits `src/work/<today>-public-gantt.mmd`.

- [ ] **Step 1: Write `.claude/skills/checking/SKILL.md`**

```markdown
---
name: checking
description: Generate an anonymized Mermaid Gantt chart of the last 6 months of GitHub work across all repos. Use when the user says "checking", "work gantt", "activity chart", or asks to regenerate the public work timeline.
---

# checking — anonymized 6-month work Gantt

Generate a public-safe Mermaid Gantt chart of all GitHub activity over the
trailing 6 months. The output goes on the public website: it must contain
**no project names or specifics** — only generic measures of work per period.

## 1. Gather data

Compute the window start date: today minus 6 months, formatted `YYYY-MM-DD`.
Substitute it for `$SINCE` and run:

    gh search commits --author=@me --committer-date=">$SINCE" --json repository,commit --limit 1000
    gh search prs --author=@me --created=">$SINCE" --json repository,title,createdAt,closedAt,state --limit 1000
    gh search prs --reviewed-by=@me --created=">$SINCE" --json repository,createdAt --limit 1000
    gh search issues --author=@me --created=">$SINCE" --json repository,title,createdAt,closedAt --limit 1000

If any command returns exactly its limit, the result is capped: re-run with
narrower date sub-ranges (e.g. month by month) and merge, so no activity is
missed. All repos visible to the gh auth are in scope, including private and
work-org repos — safe because the output is anonymized.

## 2. Cluster and label

- Group all activity by repository, then sort each repo's activity by date.
- Cluster into contiguous periods: a gap greater than ~2 weeks between
  consecutive activity dates splits the bar.
- Label each period by the dominant work type inferred from commit/PR/issue
  titles. Use ONLY this vocabulary (pick the closest match):
  API development, Auth & security, CI/CD & tooling, Refactoring,
  Frontend/UI, Infrastructure, Data & storage, Docs, Code review.
- Mark periods in the top quartile of commit volume `:crit`.
- Rename repos to "Project A", "Project B", … ordered by total activity
  volume (most active = Project A).
- If review activity is too thin for per-project bars, merge all of it into
  a single "Reviews" section.

## 3. Anonymization gate (mandatory)

Before writing the file, verify the chart contains:

- [ ] No repository names
- [ ] No organization names
- [ ] No ticket IDs (JIRA-style patterns like `ABC-123`)
- [ ] No product or domain nouns
- [ ] No usernames

Only the fixed label vocabulary, dates, and counts may appear. If any check
fails, fix the labels and re-check before writing.

## 4. Write output

Write to `src/work/YYYY-MM-DD-public-gantt.mmd` (today's date; never
overwrite prior runs). Format:

    gantt
        title 6-month engineering activity
        dateFormat YYYY-MM-DD
        axisFormat %b %Y

        section Project A
        API development            :a1, 2026-02-01, 2026-03-15
        Auth & security            :crit, a2, 2026-03-01, 2026-04-30

        section Project B
        CI/CD & tooling            :b1, 2026-02-10, 2026-02-25

Task IDs: lowercase section letter + counter (`a1`, `a2`, `b1`, …).

Do not run tests or verification steps. Write the file, then commit.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/checking/SKILL.md
git commit -m "feat: add checking skill for anonymized work gantt"
```

### Task 2: Commit this plan

**Files:**
- Create: `plans/2026-07-27-checking-skill.md` (this file)

**Interfaces:**
- Consumes: nothing.
- Produces: plan tracked in repo per convention (`plans/` holds implementation plans).

- [ ] **Step 1: Commit**

```bash
git add plans/2026-07-27-checking-skill.md
git commit -m "docs: add checking skill implementation plan"
```
