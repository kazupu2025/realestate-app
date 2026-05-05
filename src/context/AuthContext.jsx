import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// 認証状態を提供するContext
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // 初期セッション確認が完了するまでtrueにしておく
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初期セッションを取得する
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // ログイン・ログアウト等のセッション変化を監視する
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // クリーンアップ時にリスナーを解除する
    return () => subscription.unsubscribe()
  }, [])

  // ログアウト処理
  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// AuthContextを簡単に参照するためのカスタムフック
export const useAuth = () => useContext(AuthContext)
