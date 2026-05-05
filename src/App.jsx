import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PropertiesPage from './pages/PropertiesPage'

// アプリ全体のルーティング定義
export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProviderをBrowserRouter内に配置してuseNavigateを使用可能にする */}
      <AuthProvider>
        <Routes>
          {/* ルートアクセスは物件一覧にリダイレクト */}
          <Route path="/" element={<Navigate to="/properties" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* ProtectedRouteで囲まれたルートは認証必須 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/properties" element={<PropertiesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
