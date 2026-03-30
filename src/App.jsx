import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
