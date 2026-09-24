import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'
import { OfflineBanner } from '@/components/OfflineBanner'
import { UpdateToast } from '@/components/UpdateToast'
import { InstallPrompt } from '@/components/InstallPrompt'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineBanner />
        <InstallPrompt />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
        <UpdateToast />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
