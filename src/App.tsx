import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { OperatorsPage } from "./pages/OperatorsPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { RoleGuard } from "./components/RoleGuard"
import { OperatorDashboard } from "./pages/OperatorDashboard"
import { AdminDashboard } from "./pages/AdminDashboard"
import { ReportesPage } from "./pages/ReportesPage"
import { PublicSearchPage } from "./pages/PublicSearchPage"
import { ChangePasswordModal } from "./components/ChangePasswordModal"
import { ToastProvider } from "./components/Toast"
import { useAuthStore } from "./store/authStore"
import { getBranding } from "./api/brandingApi"
import { useBrandingStore } from "./store/brandingStore"

function App() {
  const mustChangePassword = useAuthStore((s) => s.mustChangePassword);
  const clearMustChangePassword = useAuthStore((s) => s.clearMustChangePassword);
  const branding = useBrandingStore((s) => s.branding);
  const setBranding = useBrandingStore((s) => s.setBranding);

  useEffect(() => {
    if (branding) {
      document.title = branding.appTitle;
      return;
    }

    getBranding()
      .then((data) => {
        setBranding({
          appTitle: data.appTitle,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          faviconUrl: data.faviconUrl,
          candidateImageUrl: data.candidateName,
          candidateTitle: data.candidateTitle,
        });
        document.title = data.appTitle;
      })
      .catch(() => {
        // Si falla, se mantienen los valores por defecto del HTML
      });
  }, []);

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
        <Route path="/" element={<PublicSearchPage />} />
        <Route path="/login" element={<LoginPage />} />
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
          <Route path="/reportes" element={
            <RoleGuard allowed={['coordinador', 'admin']}>
              <ReportesPage />
            </RoleGuard>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  )
}

export default App
