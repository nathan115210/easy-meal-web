# Claude Code Worktree Workflow Guide

This guide explains Claude Code’s worktree mode, why it is isolated, and how to integrate Claude’s changes back into your current branch safely.

## What Claude Code worktree mode is

Claude Code can start in **isolated worktree mode** instead of editing your current working directory directly.

CLI example:

```bash
claude --worktree feature-auth
```

In current Claude Code docs, `--worktree` (`-w`) creates an isolated worktree at:

```text
<repo>/.claude/worktrees/<name>
```

Claude creates it from the default remote branch, and the worktree branch is named:

```text
worktree-<name>
```

If no name is provided, Claude auto-generates one.

### Plain-language mental model

A Claude worktree is:

- a **separate folder**
- on its **own branch or isolated checkout**
- attached to the **same Git repository history/object database**
- but with its **own working tree and index**

That means Claude can edit files, run commands, and make commits in its own workspace **without touching your current branch directory directly**.

---

## Why worktree mode is useful

Use worktree mode when:

- your current branch already has uncommitted work
- you want Claude to try something risky without polluting your current checkout
- you want to compare multiple AI approaches in parallel
- you want to keep your own work and Claude’s work clearly separated

Worktree mode is especially useful when you do **not** want to disturb your existing local changes.

---

## How the isolation works

Git worktrees let one repository support **multiple working trees at the same time**.

In Git terms:

- your normal repo folder is the **main worktree**
- each additional worktree is a **linked worktree**

Each linked worktree has:

- its own checked-out branch or detached `HEAD`
- its own files on disk
- its own uncommitted state
- its own index/staging area

But it still points at the same underlying Git repository data.

### What this means in practice

If Claude edits code inside a worktree:

- your main repo folder does **not** change immediately
- your current branch’s unstaged/staged files remain as they were
- Claude can commit independently inside the worktree
- you later choose how to bring those commits back

So isolation is mostly about **working tree state** and **branch state**, not about creating a completely separate repository clone.

---

## How to list all worktrees in Git

To see all worktrees attached to the repository, use:

```bash
git worktree list
```

For normal day-to-day use, this is the command you usually want.

### More detailed version

If you want more detail, use:

```bash
git worktree list --verbose
```

Typical output shows:

- the worktree path
- the checked-out commit
- the branch

### If you only want paths

If you want machine-friendly output or only the path-oriented form, use:

```bash
git worktree list --porcelain
```

This is more useful for scripting than for everyday manual inspection.

---

## Direct mode vs worktree mode

### Direct mode

```bash
claude
```

Claude works in your **current checked-out branch and folder**.

Use this when:

- your branch is already the right place to edit
- your local state is clean or manageable
- you are okay with Claude touching your current working tree directly

### Worktree mode

```bash
claude --worktree <worktree-name>
```

Claude works in its **own isolated worktree**.

Use this when:

- your current branch is dirty
- you want safer experimentation
- you want easier rollback
- you want parallel sessions

---

## Recommended real-world workflow

If you already have local work in progress, this is the safest pattern:

1. Keep your normal work on your own branch
2. Let Claude work in a separate worktree
3. Ask Claude to make **one focused commit**
4. Import that commit into your branch with `git cherry-pick`
5. Resolve conflicts on your branch if needed

This keeps Claude’s output reviewable and easy to integrate.

---

## Copy-paste cheat sheet

### 1. Start Claude in a worktree

```bash
cd /path/to/your/repo
claude --worktree <worktree-name>
```

### 2. In the Claude session, ask for a small commit

Use a prompt like:

```text
Work only in this worktree. Keep the change minimal, run the relevant tests, and commit the result as one focused commit with a clear message. Do not refactor unrelated code.
```

### 3. Inspect Claude’s worktree

```bash
git worktree list
git -C .claude/worktrees/grid-tests status
git -C .claude/worktrees/grid-tests log --oneline -n 5
```

### 4. Bring Claude’s commit into your current branch

```bash
git switch my-feature-branch
git cherry-pick <claude_commit_sha>
```

---

## Safe integration when your branch already has uncommitted changes

Because `git cherry-pick` requires a clean working tree, stash your own WIP first.

```bash
git switch my-feature-branch
git stash push -u -m "wip before applying claude changes"
git cherry-pick <claude_commit_sha>
git stash pop
```

If conflicts appear after `stash pop`, resolve them on your branch.

### Important note about `git stash pop`

If `git stash pop` causes conflicts, Git keeps the stash entry instead of removing it.
After you resolve the conflicts, you may need to remove it manually with:

```bash
git stash drop
```

---

## Conflict workflow

If both you and Claude changed the same area, Git may stop with conflicts.

```bash
git status
```

Resolve the conflicted files, then continue:

```bash
git add <resolved-file-1> <resolved-file-2>
git cherry-pick --continue
```

If you decide not to keep Claude’s commit:

```bash
git cherry-pick --abort
```

---

## Bring in only selected files instead of the whole commit

If Claude changed more than you want, you can restore only specific files from Claude’s commit:

```bash
git switch my-feature-branch
git restore --source=<claude_commit_sha> -- \
  src/components/Grid.tsx \
  src/components/Grid.test.tsx
```

Then review and commit manually.

---

## Multiple Claude commits

If Claude made several useful commits, you have two main choices.

### Cherry-pick one by one

```bash
git switch my-feature-branch
git cherry-pick <sha-1>
git cherry-pick <sha-2>
git cherry-pick <sha-3>
```

### Cherry-pick a range

```bash
git switch my-feature-branch
git cherry-pick <oldest-sha>^..<newest-sha>
```

Use this only when the commit chain is clean and related.

---

## Clean up the worktree afterwards

If you no longer need the Claude worktree:

```bash
git worktree remove .claude/worktrees/grid-tests
```

If the Claude-created branch is also no longer needed:

```bash
git branch -d worktree-grid-tests
```

### `.gitignore` recommendation

Add this to your repo’s `.gitignore`:

```gitignore
.claude/worktrees/
```

This prevents worktree contents from appearing as untracked files in your main repository.

---

## Best practices

### 1. Ask Claude for one focused commit

Small commits are much easier to import than a branch full of mixed changes.

### 2. Prefer `cherry-pick` over merge for small Claude tasks

For most AI-assisted tasks, `cherry-pick` gives you tighter control and a cleaner history.

### 3. Keep your current branch as the integration branch

Treat Claude’s worktree as a temporary implementation workspace, not as the place where final integration happens.

### 4. Stash before importing if your branch is dirty

This avoids unnecessary cherry-pick failures and keeps your workflow predictable.

### 5. Expect occasional conflicts

Conflict resolution is normal when both you and Claude touch the same files. The goal of worktree mode is not to eliminate all conflicts, but to keep Claude’s work isolated until you are ready to integrate it.

---

## When not to use worktree mode

Skip worktree mode when:

- the change is tiny
- your current branch is already clean
- you want Claude to edit directly in your current branch
- you do not want the extra step of importing commits back

In that case, start Claude normally:

```bash
claude
```

---

## Recommended workflow summary

### Use direct mode when

- your branch is clean enough
- the task is small
- you want the fastest path

### Use worktree mode when

- your branch has ongoing WIP
- you want isolated experimentation
- you want safer AI-assisted changes
- you may run parallel Claude sessions

---

## References

- Claude Code common workflows: `--worktree` creates an isolated worktree under `<repo>/.claude/worktrees/<name>`, branches from the default remote branch, and names the branch `worktree-<name>`
- Claude Code common workflows: add `.claude/worktrees/` to `.gitignore`
- Git cherry-pick documentation: cherry-pick requires a clean working tree
- Git stash documentation: if `git stash pop` conflicts, the stash entry is not removed automatically
