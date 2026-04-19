import { Routes, Route, Navigate } from 'react-router-dom'
import { WelcomeScreen } from '@/features/welcome'
import { DashboardLayout } from '@/features/dashboard'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
