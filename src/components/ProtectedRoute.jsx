import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 認証状態に応じてルートを保護するラッパーコンポーネント
export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  // 初期セッション確認中はローディング表示
  if (loading) return <p style={{ padding: '2rem', textAlign: 'center' }}>認証確認中...</p>

  // 未ログインの場合はログイン画面にリダイレクト
  if (!user) return <Navigate to="/login" replace />

  // 認証済みの場合は子ルートをレンダリング
  return <Outlet />
}
