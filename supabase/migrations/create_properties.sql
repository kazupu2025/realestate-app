-- properties テーブルを作成する
CREATE TABLE properties (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  rent        integer NOT NULL,
  area        text NOT NULL,
  floor_plan  text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS（行レベルセキュリティ）を有効化する
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 自分の物件のみ参照可能にするポリシー
CREATE POLICY "自分の物件のみ参照可能" ON properties
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT 時に user_id を自分の ID に強制するポリシー
CREATE POLICY "自分の物件のみ登録可能" ON properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分の物件のみ更新可能にするポリシー
CREATE POLICY "自分の物件のみ更新可能" ON properties
  FOR UPDATE USING (auth.uid() = user_id);

-- 自分の物件のみ削除可能にするポリシー
CREATE POLICY "自分の物件のみ削除可能" ON properties
  FOR DELETE USING (auth.uid() = user_id);
