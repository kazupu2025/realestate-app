# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real estate web application (04_realestate-app). It is part of the SAMURAI_SPRINT series.

## Git Workflow — MANDATORY

**After every code change, commit and push to GitHub.** This is a hard rule with no exceptions.

```bash
git add <changed files>
git commit -m "<concise message describing the change>"
git push origin main
```

- Stage specific files by name, never `git add -A` blindly.
- Write commit messages in present tense, imperative form (e.g. "Add property search filter", "Fix map rendering bug").
- If the remote branch does not yet exist: `git push -u origin main`
- Never amend published commits. Create a new commit instead.
- Never force-push to `main`.

## Commands

This section will be updated as the project stack is decided and scaffolded.

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Lint | `npm run lint` |
| Run tests | `npm test` |
| Run a single test file | `npm test -- <path/to/test>` |

## Architecture

This section will be populated once the project structure is established. Update it here whenever major architectural decisions are made (routing strategy, data fetching patterns, state management, API layer, etc.).
