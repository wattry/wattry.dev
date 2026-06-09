# Prompt eval Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `eval` in `prompt()` and `prompt_detached()` with exit-code-based returns, eliminating the risk of unintended code execution from interpolated arguments.

**Architecture:** `prompt()` becomes a pure yes/no gate — it asks the question and returns `0` for yes, `1` for no. Callers own the branching logic. `prompt_detached()` has no external call sites and will be removed. Two call sites in `restore.sh` and `import.sh` are updated to `if/else` blocks.

**Tech Stack:** Bash 3.2+, no additional dependencies

---

## File Map

| File | Action | Change |
|------|--------|--------|
| `scripts/util/prompt.sh` | Modify | Remove `eval`, return exit codes, remove `prompt_detached` |
| `scripts/db/restore.sh` | Modify | Replace `prompt` call with `if/else` block (line 90) |
| `scripts/db/import.sh` | Modify | Replace `prompt` call with `if/else` block, fix `$@` quoting (line 151) |

---

### Task 1: Refactor `prompt.sh`

**Files:**
- Modify: `scripts/util/prompt.sh`

- [ ] **Step 1: Replace the file contents**

```bash
#!/bin/bash

# Prompts (1st arg) the user for a yes or no answer.
# Returns 0 if yes, 1 if no.
# If $YES=1, auto-answers yes without prompting.

set -e

source "${PWD}/scripts/util/icons.sh"

prompt_help() {
  if [[ $1 = "-h" ]] || [[ $1 = "--help" ]] || [[ $1 = "help" ]]; then
    echo "Usage: prompt <message>"
    echo
    echo "Prompts the user for a yes or no answer."
    echo "Returns 0 for yes, 1 for no."
    echo
    echo "Args:"
    echo "1 Message"
    echo
    echo "Options:"
    echo "  --help, -h, help  Show this help message"
    exit 0
  fi
}

prompt() {
  prompt_help "$1"
  local answer=""

  if [[ $YES -eq 0 ]]; then
    read -n1 -p "${1}:${ques} y/N: " answer
    echo
  else
    answer="y"
  fi

  if [[ "$answer" == "y" ]] || [[ "$answer" == "Y" ]]; then
    return 0
  elif [[ "$answer" == "n" ]] || [[ "$answer" == "N" ]]; then
    return 1
  else
    prompt "$@"
  fi
}
```

- [ ] **Step 2: Verify the file looks correct**

```bash
cat scripts/util/prompt.sh
```

Expected: file contains `return 0` / `return 1`, no `eval`, no `prompt_detached`.

---

### Task 2: Update `restore.sh`

**Files:**
- Modify: `scripts/db/restore.sh` (line 90)

- [ ] **Step 1: Replace the `prompt` call in `check_migrations()`**

Current (line 90):
```bash
prompt "There are differing migrations on this branch Y = 'migrate dev' / N = 'migrate dev --create--only' or ctrl + c to exit" "npx prisma migrate dev" "npx prisma migrate dev --create-only"
```

Replace with:
```bash
set +e
prompt "There are differing migrations on this branch Y = 'migrate dev' / N = 'migrate dev --create-only' or ctrl + c to exit"
answer=$?
set -e

if [[ $answer -eq 0 ]]; then
  npx prisma migrate dev
else
  npx prisma migrate dev --create-only
fi
```

- [ ] **Step 2: Verify the surrounding context looks correct**

```bash
sed -n '85,100p' scripts/db/restore.sh
```

Expected: `check_migrations()` body shows the `if/else` block with no `prompt` receiving command-string arguments. Also note the typo fix: `--create--only` → `--create-only`.

---

### Task 3: Update `import.sh`

**Files:**
- Modify: `scripts/db/import.sh` (line 151)

- [ ] **Step 1: Replace the `prompt` call in `dump_file_check()`**

Current (line 151):
```bash
prompt "Cannot locate dump file run db export" "${PWD}/scripts/db/export.sh $@" "exit 1"
```

Replace with:
```bash
set +e
prompt "Cannot locate dump file run db export"
answer=$?
set -e

if [[ $answer -eq 0 ]]; then
  "${PWD}/scripts/db/export.sh" "$@"
else
  exit 1
fi
```

- [ ] **Step 2: Verify the surrounding context looks correct**

```bash
sed -n '144,157p' scripts/db/import.sh
```

Expected: `dump_file_check()` body shows the `if/else` block. Note the fix: `$@` is now properly quoted as `"$@"` and the path is quoted, preventing word-splitting of arguments passed to `export.sh`.

---

### Task 4: Smoke Test

- [ ] **Step 1: Verify `prompt.sh` sources cleanly**

```bash
source scripts/util/prompt.sh && echo "sourced OK"
```

Expected: `sourced OK` with no errors.

- [ ] **Step 2: Verify auto-yes path returns 0**

```bash
source scripts/util/icons.sh
source scripts/util/prompt.sh
YES=1 prompt "smoke test" && echo "exit 0 OK"
```

Expected: `smoke test::❔ y/N:` (or similar), then `exit 0 OK`.

- [ ] **Step 3: Verify no path returns 1**

```bash
source scripts/util/icons.sh
source scripts/util/prompt.sh
YES=0 prompt "smoke test" <<< "n"; echo "exit code: $?"
```

Expected: output ends with `exit code: 1`.

---

### Task 5: Commit

- [ ] **Step 1: Stage the three changed files**

```bash
git add scripts/util/prompt.sh scripts/db/restore.sh scripts/db/import.sh
```

- [ ] **Step 2: Commit**

```bash
git commit -m "refactor(scripts): replace eval in prompt() with exit-code returns

- prompt() now returns 0 for yes, 1 for no — callers own branching logic
- Removes prompt_detached (no external call sites)
- Updates restore.sh and import.sh call sites to if/else blocks
- Fixes unquoted \$@ in import.sh dump_file_check()
- Fixes typo --create--only → --create-only in restore.sh"
```
