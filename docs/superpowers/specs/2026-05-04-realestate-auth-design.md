# 不動産管理Webアプリ 設計仕様書

**日付:** 2026-05-04  
**ステータス:** 承認済み

---

## 概要

Supabase認証機能付きの不動産管理WebアプリをReact + Viteで構築する。メールアドレス＋パスワードによる会員登録・ログインを実装し、ログイン後は物件一覧画面を表示する。未ログインユーザーはログイン画面にリダイレクトされる。

---

## 技術スタック

| 項目 | 選択 |
|------|------|
| フレームワーク | React + Vite |
| ルーティング | React Router DOM v6 |
| スタイリング | CSS Modules |
| 認証・バックエンド | Supabase（メール＋パスワード認証） |
| 環境変数管理 | `.env`（`.gitignore`で除外） |

---

## ファイル構成

```
04_realestate-app/
├── .env                          # Supabase接続情報（gitignore対象）
├── .gitignore
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                  # エントリーポイント
    ├── App.jsx                   # ルーティング定義
    ├── App.module.css
    ├── lib/
    │   └── supabase.js           # Supabaseクライアント初期化
    ├── context/
    │   └── AuthContext.jsx       # 認証状態のContext Provider
    ├── components/
    │   ├── ProtectedRoute.jsx    # 未認証リダイレクトラッパー
    │   └── PropertyCard.jsx      # 物件カードUIコンポーネント
    └── pages/
        ├── LoginPage.jsx
        ├── LoginPage.module.css
        ├── RegisterPage.jsx
        ├── RegisterPage.module.css
        ├── PropertiesPage.jsx
        └── PropertiesPage.module.css
```

---

## ルート定義

| パス | コンポーネント | 認証保護 | 説明 |
|------|--------------|---------|------|
| `/` | — | — | `/properties` へリダイレクト |
| `/login` | `LoginPage` | なし | ログインフォーム |
| `/register` | `RegisterPage` | なし | 会員登録フォーム |
| `/properties` | `PropertiesPage` | `ProtectedRoute` | 物件一覧 |

---

## コンポーネント設計

### `AuthContext.jsx`
- `supabase.auth.getSession()` で初期セッションを取得
- `supabase.auth.onAuthStateChange` でセッション変化を監視
- `{ user, loading, signOut }` をContextに提供
- `loading` が `true` の間は子コンポーネントをレンダリングしない

### `ProtectedRoute.jsx`
- `loading === true` のとき：「認証確認中...」を表示
- `user === null` のとき：`<Navigate to="/login" replace />` でリダイレクト
- 認証済みのとき：`<Outlet />` で子ルートをレンダリング

### `LoginPage.jsx`
- 状態：`email`, `password`, `error`, `loading`
- `supabase.auth.signInWithPassword()` を呼び出す
- 成功時：`/properties` へ遷移
- エラー時：メッセージをフォーム下部に表示
- 会員登録ページへのリンクを設ける

### `RegisterPage.jsx`
- 状態：`email`, `password`, `error`, `loading`
- `supabase.auth.signUp()` を呼び出す
- 成功時：`/properties` へ遷移（Supabaseダッシュボードの Authentication > Settings で「Confirm email」を無効にしておく必要がある）
- エラー時：メッセージをフォーム下部に表示
- ログインページへのリンクを設ける

### `PropertiesPage.jsx`
- `AuthContext` から `signOut` を受け取りログアウトボタンに使用
- ダミー物件データ5件をハードコード
- 各物件を `PropertyCard` でレンダリング

### `PropertyCard.jsx`
- Props：`{ name, rent, area }`
- 物件名・家賃・エリアをカード形式で表示

---

## データ定義

### 物件ダミーデータ（PropertiesPage内にハードコード）

```js
const properties = [
  { id: 1, name: 'サンシャインマンション 301号室', rent: 85000, area: '渋谷区' },
  { id: 2, name: 'グリーンヒルズ 102号室',        rent: 72000, area: '新宿区' },
  { id: 3, name: 'パールコート 205号室',           rent: 95000, area: '港区' },
  { id: 4, name: 'スカイビュー 401号室',           rent: 110000, area: '中央区' },
  { id: 5, name: 'リバーサイド 103号室',           rent: 68000, area: '江東区' },
];
```

---

## 環境変数

`.env` ファイルに以下を定義し、`.gitignore` で除外する。

```
VITE_SUPABASE_URL=https://tkinojxeoumpfpabjryn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Fhkp6dId0374GFGiXe_rLQ_i9HRQO2G
```

`supabase.js` では `import.meta.env.VITE_SUPABASE_URL` で参照する。

---

## エラーハンドリング方針

- Supabaseが返す `error.message` をフォーム下部に日本語ラベル付きで表示する
- 認証処理中はボタンを `disabled` にして二重送信を防ぐ
- `loading` 中のUI状態は「送信中...」のテキストで示す

---

## スコープ外（今回は実装しない）

- パスワードリセット機能
- ソーシャルログイン（Google等）
- 物件の追加・編集・削除
- Supabaseデータベースからの物件データ取得
- テスト
