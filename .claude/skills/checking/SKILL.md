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
  Frontend/UI, Infrastructure, Data & storage, Docs, Code review.
- Mark periods in the top quartile of activity volume (commits + PRs + issues) `:crit`.
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

Only the fixed label vocabulary, dates, counts, Project A/B aliases, section
names, the title, and task IDs may appear. If any check fails, fix the labels
and re-check before writing.

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

## 5. Render SVG for the site

The site's terminal `work` command (`src/components/Layout/Terminal.tsx`)
imports `src/static/work-gantt.svg`. Regenerate it from the new chart,
overwriting the fixed filename:

    npx -y @mermaid-js/mermaid-cli -i src/work/YYYY-MM-DD-public-gantt.mmd -o src/static/work-gantt.svg -t dark -b transparent

Do not run tests or verification steps. Write the `.mmd`, render the SVG,
then commit both.
