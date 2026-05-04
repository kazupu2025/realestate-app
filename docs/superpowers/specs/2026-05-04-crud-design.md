# 不動産管理アプリ CRUD機能 設計仕様書

**日付:** 2026-05-04  
**ステータス:** 承認済み  
**前提:** `docs/superpowers/specs/2026-05-04-realestate-auth-design.md` の認証基盤が実装済みであること

---

## 概要

Supabase に `properties` テーブルを作成し、RLS で「自分が登録した物件のみ操作可能」なセキュリティポリシーを設ける。React 側では `useProperties` カスタムフックに CRUD ロジックを集約し、物件一覧のダミーデータを実データに置き換える。追加・編集は共用モーダルで行い、削除はカードのボタンから直接実行する。

---

## データベース設計

### `properties` テーブル

```sql
CREATE TABLE properties (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  rent        integer NOT NULL,
  area        text NOT NULL,
  floor_plan  text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

### RLS ポリシー

```sql
-- RLS を有効化する
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 自分の物件のみ参照可能
CREATE POLICY "自分の物件のみ参照可能" ON properties
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT 時に user_id を自分の ID に強制する
CREATE POLICY "自分の物件のみ登録可能" ON properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分の物件のみ更新可能
CREATE POLICY "自分の物件のみ更新可能" ON properties
  FOR UPDATE USING (auth.uid() = user_id);

-- 自分の物件のみ削除可能
CREATE POLICY "自分の物件のみ削除可能" ON properties
  FOR DELETE USING (auth.uid() = user_id);
```

> **実行場所:** Supabase ダッシュボード → SQL Editor に上記 SQL を貼り付けて実行する。

---

## ファイル構成

### 新規作成

| ファイル | 役割 |
|---------|------|
| `src/hooks/useProperties.js` | Supabase CRUD + ローカル状態管理のカスタムフック |
| `src/components/PropertyModal.jsx` | 追加・編集共用モーダルコンポーネント |
| `src/components/PropertyModal.module.css` | モーダルスタイル |

### 変更

| ファイル | 変更内容 |
|---------|---------|
| `src/pages/PropertiesPage.jsx` | ダミーデータ削除・`useProperties` 呼び出し・追加ボタン・モーダル制御追加 |
| `src/pages/PropertiesPage.module.css` | 追加ボタン・エラーバナーのスタイル追加 |
| `src/components/PropertyCard.jsx` | 編集ボタン・削除ボタンの追加 |
| `src/components/PropertyCard.module.css` | ボタンスタイルの追加 |

---

## コンポーネント設計

### `useProperties.js`

```
返り値:
  properties   : Property[]   // 物件一覧（状態）
  loading      : boolean       // データ取得中フラグ
  error        : string|null   // エラーメッセージ
  fetchProperties()            // SELECT: 自分の物件を全件取得
  addProperty(data)            // INSERT: user_id は supabase.auth.getUser() で自動取得
  updateProperty(id, data)     // UPDATE: id 指定で更新
  deleteProperty(id)           // DELETE: id 指定で削除
```

- `fetchProperties` はマウント時に自動呼び出し（`useEffect` 内）
- 各 CRUD 操作の成功後に `fetchProperties` で一覧を再取得する
- エラー発生時は `error` state にメッセージを格納、操作完了後にクリアする

### `PropertyModal.jsx`

- Props: `{ isOpen, onClose, property, onSave }`
- `property === null` → 追加モード（フォームフィールドは空）
- `property !== null` → 編集モード（フォームフィールドに現在値をプリセット）
- フォームフィールド: 物件名 / 家賃（数値入力）/ エリア / 間取り
- 送信時に `onSave(data)` を呼び出し、成功後に `onClose()` で閉じる
- モーダル背景クリックで閉じる

### `PropertyCard.jsx`（変更）

- Props に `onEdit` / `onDelete` コールバックを追加
- 編集ボタン: `onEdit(property)` を呼び出す
- 削除ボタン: `onDelete(property.id)` を呼び出す（確認ダイアログなし）

### `PropertiesPage.jsx`（変更）

```
状態:
  modalOpen    : boolean    // モーダル表示フラグ
  editingProperty : Property|null  // 編集対象（nullなら追加モード）

処理フロー（追加）:
  「物件を追加」ボタン → editingProperty=null, modalOpen=true
  PropertyCard の編集ボタン → editingProperty=property, modalOpen=true
  PropertyCard の削除ボタン → deleteProperty(id) 呼び出し
  PropertyModal の onSave → addProperty or updateProperty → fetchProperties → modalOpen=false
```

---

## エラーハンドリング

| 発生箇所 | 処理 |
|---------|------|
| `fetchProperties` 失敗 | `error` state に格納、一覧上部にエラーバナー表示 |
| `addProperty` 失敗 | `error` state に格納、モーダルは開いたまま |
| `updateProperty` 失敗 | 同上 |
| `deleteProperty` 失敗 | `error` state に格納、一覧上部にエラーバナー表示 |

---

## 型定義（JSDoc）

```js
/**
 * @typedef {Object} Property
 * @property {string} id
 * @property {string} user_id
 * @property {string} name
 * @property {number} rent
 * @property {string} area
 * @property {string} floor_plan
 * @property {string} created_at
 */

/**
 * @typedef {Object} PropertyFormData
 * @property {string} name
 * @property {number} rent
 * @property {string} area
 * @property {string} floor_plan
 */
```

---

## スコープ外（今回は実装しない）

- 削除前の確認ダイアログ
- 物件の並び替え・フィルタリング
- 楽観的UI更新（操作後に必ず `fetchProperties` で再取得する）
- 物件画像のアップロード
