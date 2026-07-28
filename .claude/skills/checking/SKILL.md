---
name: checking
description: Generate an anonymized Mermaid Gantt chart of the last 18 months of GitHub work across all repos. Use when the user says "checking", "work gantt", "activity chart", or asks to regenerate the public work timeline.
---

# checking — anonymized 18-month work Gantt

Generate a public-safe Mermaid Gantt chart of all GitHub activity over the
trailing 18 months. The output goes on the public website: it must contain
**no project names or specifics** — only generic measures of work per period.

## 1. Gather data

Compute the window start date: today minus 18 months, formatted `YYYY-MM-DD`.
Substitute it for `$SINCE` and run:

    gh search commits --author=@me --committer-date=">$SINCE" --json repository,commit --limit 1000
    gh search prs --author=@me --created=">$SINCE" --json repository,title,createdAt,closedAt,state --limit 1000
    gh search prs --reviewed-by=@me --created=">$SINCE" --json repository,createdAt --limit 1000
    gh search issues --author=@me --created=">$SINCE" --json repository,title,createdAt,closedAt --limit 1000

Note: the `--reviewed-by` search filters by PR creation date (GitHub has no
reviewed-date qualifier), so reviews on older PRs are missed and `createdAt`
is a proxy for review timing only.

If any command returns exactly its limit, the result is capped: re-run with
narrower date sub-ranges (e.g. `--created=2026-01-01..2026-01-31` month by
month) and merge, deduplicating any items that appear in overlapping ranges,
so no activity is missed. All repos visible to the gh auth are in scope, including private and
work-org repos — safe because the output is anonymized.

## 2. Cluster and label

- Group all activity by repository, then sort each repo's activity by date.
- Cluster into contiguous periods: a gap greater than ~2 weeks between
  consecutive activity dates splits the bar.
- Label each period by the dominant work type inferred from commit/PR/issue
  titles. Use ONLY this vocabulary (pick the closest match):
  API development, Auth & security, CI/CD & tooling, Refactoring,
  Frontend/UI, Infrastructure, Data & storage, Docs, Code review,
  Issue reports.
- Mark periods in the top quartile of activity volume (commits + PRs + issues) `:crit`.
- Section names use a two-tier policy (brand value without leaking employer):
  - **Employer/work-org repos** (and any repo the user hasn't sanctioned by
    name): generic, non-identifying role names prefixed "Work — ", e.g.
    "Work — Platform API", "Work — Web client", "Work — Developer tooling".
    Never the repo, org, product, or ticket names.
  - **Personal repos**: real names, prefixed by kind — "OSS — <name> (npm)"
    for published libraries, "Personal Development — <name>" for personal
    projects (never "Side"), "Site — ", "Demo — ", "Tool — " as fits. Check
    visibility with `gh repo view <repo> --json visibility`; public repos
    always safe to name, private personal repos may be named (name only, no
    contents).
- Excluded repos (never chart, regardless of activity): `wattry/splitstupid`.
- Bars under ~4 events that are isolated noise (a lone review, a one-commit
  day) may be folded into an adjacent bar of the same section or dropped —
  but ONLY for the user's own repos (`wattry/*` and orgs the user owns).
  Activity on third-party repos (e.g. `google/clasp`) is an external OSS
  contribution: always chart it, no matter how small — even a single
  commit or issue. List every drop in the run summary, never silently.

## 3. Anonymization gate (mandatory)

Before writing the file, verify — for **work-org repos only** — that the
chart contains:

- [ ] No work repository names
- [ ] No work organization names
- [ ] No ticket IDs (JIRA-style patterns like `ABC-123`)
- [ ] No work product or domain nouns beyond generic role names
- [ ] No coworker usernames

Personal repo names (per the two-tier policy above) are allowed. If any
check fails, fix the labels and re-check before writing.

## 4. Write output

Write to `src/work/YYYY-MM-DD-public-gantt.mmd` (today's date; never
overwrite prior runs). Format:

    gantt
        title 18-month engineering activity
        dateFormat YYYY-MM-DD
        axisFormat %b %Y

        section Project A
        API development            :a1, 2026-02-01, 2026-03-15
        Auth & security            :crit, a2, 2026-03-01, 2026-04-30

        section Project B
        CI/CD & tooling            :b1, 2026-02-10, 2026-02-25

Task IDs: lowercase section letter + counter (`a1`, `a2`, `b1`, …).

## 5. Render SVG for the site

The site's terminal `work` command (`src/components/Layout/Terminal.tsx`)
imports `src/static/work-gantt.svg`. Regenerate it from the new chart,
overwriting the fixed filename:

    npx -y @mermaid-js/mermaid-cli -i src/work/YYYY-MM-DD-public-gantt.mmd -o src/static/work-gantt.svg -t dark -b transparent

Do not run tests or verification steps. Write the `.mmd`, render the SVG,
then commit both.
