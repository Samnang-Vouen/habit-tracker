import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'
import { OfflineBanner } from '@/components/OfflineBanner'
import { UpdateToast } from '@/components/UpdateToast'
import { InstallPrompt } from '@/components/InstallPrompt'
import { Spinner } from '@/components/ui/spinner'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'

// Dashboard pulls in the whole habits feature (dialogs, avatar upload,
// dropdown menu, all the shadcn primitives they use) — code nobody needs
// until after they've signed in. Splitting it here keeps /login and
// /signup's bundle to just what a form needs.
const Dashboard = lazy(() => import('@/pages/Dashboard'))

function DashboardFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="size-6" />
    </div>
  )
}

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
                <Suspense fallback={<DashboardFallback />}>
                  <Dashboard />
                </Suspense>
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
