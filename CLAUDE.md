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

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Lint | `npm run lint` |
| Preview production build | `npm run preview` |

## Architecture

**Tech stack:** React 18 + Vite 5 + React Router DOM v6 + Supabase JS v2 + CSS Modules

**Auth flow:**
1. `src/lib/supabase.js` が `.env` から URL/Key を読み込みクライアントを生成する
2. `src/context/AuthContext.jsx` が `onAuthStateChange` でセッションを監視し、`{ user, loading, signOut }` をContext経由でアプリ全体に提供する
3. `src/components/ProtectedRoute.jsx` が `user === null` のとき `/login` へリダイレクトする

**Routing:** `/` → `/properties`（リダイレクト）、`/login`、`/register`、`/properties`（ProtectedRoute保護）

**Pages:** `src/pages/` 配下。各ページに対応する `*.module.css` が同階層にある。

**CRUD flow:**
- `src/hooks/useProperties.js` が SELECT/INSERT/UPDATE/DELETE を管理する
- `useProperties` の返り値: `{ properties, loading, error, addProperty, updateProperty, deleteProperty }`
- INSERT 時は `supabase.auth.getUser()` で取得した `user.id` を `user_id` にセットする
- 各操作の成功後は `fetchProperties()` で一覧を再取得する（楽観的更新なし）

**Modal pattern:**
- `PropertyModal` は `property` prop が `null` で追加モード、データありで編集モードになる
- `isOpen` が `false` の間は `null` を返してDOMに描画しない

## 参照ファイル

`references/` フォルダにユーザーが置いたMDファイルは、関連するタスクの際に参照すること。

**Supabase settings:**
- Authentication > Settings > Email Auth の「Confirm email」を無効にしないと、登録直後のリダイレクトが機能しない
- `supabase/migrations/create_properties.sql` を Supabase ダッシュボードの SQL Editor で手動実行が必要
