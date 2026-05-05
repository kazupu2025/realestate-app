# デザインリッチ化＋検索・フィルター機能 設計仕様書

**日付:** 2026-05-05
**ステータス:** 承認済み

---

## 概要

既存の不動産管理アプリのデザインを「不動産ポータル風（ネイビー×ゴールド）」にリッチ化し、キーワード検索・家賃上限スライダー・間取り選択の3種フィルターをクライアントサイドで実装する。

---

## デザインシステム

### カラーパレット（CSS Custom Properties）

```css
--color-primary: #1a2b4b;      /* ネイビー */
--color-accent:  #c9a84c;      /* ゴールド */
--color-bg:      #f4f6f9;      /* ページ背景 */
--color-card:    #ffffff;      /* カード背景 */
--color-text:    #1a2b4b;      /* メインテキスト */
--color-muted:   #6b7a99;      /* サブテキスト */
--color-error:   #e53e3e;      /* エラー */
--color-success: #22c55e;      /* 登録ボタン */
```

### タイポグラフィ
- フォント: `-apple-system, 'Hiragino Sans', 'Yu Gothic', sans-serif`（変更なし）
- 見出し: ネイビー（`--color-primary`）

---

## 変更ファイル一覧

| ファイル | 変更種別 | 内容 |
|---------|---------|------|
| `src/index.css` | 変更 | CSS Custom Properties定義・グローバルリセット更新 |
| `src/pages/LoginPage.module.css` | 変更 | ネイビーグラデーションヘッダー帯・ロゴ追加 |
| `src/pages/LoginPage.jsx` | 変更 | ロゴテキスト要素追加 |
| `src/pages/RegisterPage.module.css` | 変更 | LoginPageと同一スタイル |
| `src/pages/RegisterPage.jsx` | 変更 | ロゴテキスト要素追加 |
| `src/components/PropertyCard.jsx` | 変更 | 上部ネイビーバー・家賃ゴールド強調 |
| `src/components/PropertyCard.module.css` | 変更 | カラーバー・シャドウ・ゴールド家賃スタイル |
| `src/components/PropertyModal.module.css` | 変更 | モーダルヘッダーをネイビーに |
| `src/components/PropertyModal.jsx` | 変更 | ヘッダー構造を `div.header` で囲む |
| `src/pages/PropertiesPage.jsx` | 変更 | ヘッダーをネイビーバーに・useFilter追加 |
| `src/pages/PropertiesPage.module.css` | 変更 | ネイビーヘッダー・ゴールドボタンスタイル |

## 新規ファイル一覧

| ファイル | 役割 |
|---------|------|
| `src/hooks/useFilter.js` | フィルタリングロジック |
| `src/components/SearchFilter.jsx` | 検索・フィルターUIコンポーネント |
| `src/components/SearchFilter.module.css` | フィルタースタイル |

---

## コンポーネント設計

### `useFilter.js`

```
引数:
  properties: Property[]   // usePropertiesから受け取る全件リスト

返り値:
  filtered: Property[]     // フィルタリング後のリスト
  keyword: string          // キーワード状態
  setKeyword: fn
  maxRent: number          // 家賃上限（初期値: 150000）
  setMaxRent: fn
  floorPlan: string        // 間取り選択（初期値: ''=すべて）
  setFloorPlan: fn
```

フィルタリング条件（AND結合）:
1. `keyword` → `property.name` または `property.area` に部分一致（大文字小文字無視）
2. `maxRent` → `property.rent <= maxRent`
3. `floorPlan` → `''` なら全件、それ以外は `property.floor_plan === floorPlan`

### `SearchFilter.jsx`

Props: `{ keyword, setKeyword, maxRent, setMaxRent, floorPlan, setFloorPlan }`

UI構成:
```
┌─────────────────────────────────────────────┐
│ 🔍 [キーワード検索入力欄（物件名・エリア）]     │
├──────────────────────┬──────────────────────┤
│ 家賃上限: ¥XX,XXX    │ 間取り: [ドロップダウン]│
│ [─────●──────────]   │                      │
└──────────────────────┴──────────────────────┘
```

間取り選択肢: `すべて` / `1K` / `1DK` / `1LDK` / `2LDK` / `3LDK以上`

### ページ・コンポーネントの変更点

**LoginPage / RegisterPage:**
- フォームカードの上に全幅ネイビーグラデーションヘッダー帯を追加
- 帯内に「🏠 不動産管理システム」のロゴテキスト（ゴールド）を表示

**PropertiesPage:**
- ページ上部ヘッダーを全幅ネイビーバーに変更（高さ64px）
- 「＋ 物件を追加」ボタンをゴールド背景に変更
- ヘッダー直下に `SearchFilter` コンポーネントを配置
- `useFilter(properties)` でフィルタリング済み配列を取得し `PropertyCard` に渡す
- フィルター結果が0件の場合「条件に一致する物件が見つかりません」を表示

**PropertyCard:**
- カード上部に4px高さのネイビーカラーバーを追加
- 家賃テキストをゴールド（`--color-accent`）で表示
- `border-radius: 12px`・`box-shadow` を深くしてリッチ感を向上

**PropertyModal:**
- タイトル部分を `div.header` でラップし、ネイビー背景・ゴールドテキストに変更

---

## スコープ外

- サーバーサイドフィルタリング（Supabaseクエリ）
- 地図連携・物件画像アップロード
- ソート機能（登録日順・家賃順）
