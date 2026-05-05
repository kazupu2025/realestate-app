import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Supabaseで新規ユーザーを登録する
    // 前提: SupabaseダッシュボードでConfirm emailを無効にしていること
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      navigate('/properties')
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <span className={styles.brandLogo}>🏠 不動産管理システム</span>
      </div>
      <div className={styles.body}>
        <div className={styles.card}>
          <h1 className={styles.title}>会員登録</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              メールアドレス
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </label>
            <label className={styles.label}>
              パスワード（6文字以上）
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                minLength={6}
                required
              />
            </label>
            {error && <p className={styles.error}>エラー: {error}</p>}
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? '送信中...' : '会員登録'}
            </button>
          </form>
          <p className={styles.link}>
            すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
