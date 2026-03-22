import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { OperatorsPage } from "./pages/OperatorsPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { RoleGuard } from "./components/RoleGuard"
import { UnderConstructionPage } from "./pages/UnderConstructionPage"
import { OperatorDashboard } from "./pages/OperatorDashboard"
import { AdminDashboard } from "./pages/AdminDashboard"
import { PublicSearchPage } from "./pages/PublicSearchPage"
import { ChangePasswordModal } from "./components/ChangePasswordModal"
import { ToastProvider } from "./components/Toast"
import { useAuthStore } from "./store/authStore"

function App() {
  const mustChangePassword = useAuthStore((s) => s.mustChangePassword);
  const clearMustChangePassword = useAuthStore((s) => s.clearMustChangePassword);

  return (
    <ToastProvider>
    <BrowserRouter>
      {mustChangePassword && (
        <ChangePasswordModal
          forced
          onSuccess={clearMustChangePassword}
        />
      )}
      <Routes>
        <Route path="/" element={
          <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#b71c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UnderConstructionPage />
          </div>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/padron" element={<PublicSearchPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={
            <RoleGuard allowed={['OPERADOR']}>
              <OperatorDashboard />
            </RoleGuard>
          } />
          <Route path="/admin" element={
            <RoleGuard allowed={['coordinador', 'admin']}>
              <AdminDashboard />
            </RoleGuard>
          } />
          <Route path="/operators" element={<OperatorsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  )
}

export default App
