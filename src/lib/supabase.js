import { createClient } from '@supabase/supabase-js'

// 環境変数からSupabase接続情報を読み込む（.envで管理）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// アプリ全体で共有するSupabaseクライアント
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
