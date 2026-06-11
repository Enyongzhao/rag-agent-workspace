import { Navigate, Route, Routes } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DocumentsPage from './pages/DocumentsPage'
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import DashboardLayout from './components/DashboardLayout'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App