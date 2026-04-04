import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { OperatorsPage } from "./pages/OperatorsPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { RoleGuard } from "./components/RoleGuard"
import { OperatorDashboard } from "./pages/OperatorDashboard"
import { AdminDashboard } from "./pages/AdminDashboard"
import { ReportesPage } from "./pages/ReportesPage"
import { AuditoriaPage } from "./pages/AuditoriaPage"
import { PublicSearchPage } from "./pages/PublicSearchPage"
import { LandingPage } from "./pages/LandingPage"
import { NoTenantPage } from "./pages/NoTenantPage"
import { ChangePasswordModal } from "./components/ChangePasswordModal"
import { ToastProvider } from "./components/Toast"
import { useAuthStore } from "./store/authStore"
import { getBranding } from "./api/brandingApi"
import { useBrandingStore } from "./store/brandingStore"
import { getTenant } from "./utils/tenant"
import { applyPrimaryColor } from "./utils/color"

const hasTenant = !!getTenant();

function App() {
  const mustChangePassword = useAuthStore((s) => s.mustChangePassword);
  const clearMustChangePassword = useAuthStore((s) => s.clearMustChangePassword);
  const branding = useBrandingStore((s) => s.branding);
  const setBranding = useBrandingStore((s) => s.setBranding);

  useEffect(() => {
    if (!hasTenant) return; // No cargar branding en el dominio principal
    if (branding) {
      document.title = branding.appTitle;
      applyPrimaryColor(branding.primaryColor);
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
          zona: data.zona,
        });
        document.title = data.appTitle;
        applyPrimaryColor(data.primaryColor);
      })
      .catch(() => {});
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

        {hasTenant ? (
          /* ── Rutas con tenant (tenant.sigele.com.py) ── */
          <Routes>
            <Route path="/" element={<Navigate to="/padron" replace />} />
            <Route path="/padron" element={<PublicSearchPage />} />
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
              <Route path="/auditoria" element={
                <RoleGuard allowed={['coordinador', 'admin']}>
                  <AuditoriaPage />
                </RoleGuard>
              } />
            </Route>
          </Routes>
        ) : (
          /* ── Rutas sin tenant (sigele.com.py) ── */
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<NoTenantPage />} />
          </Routes>
        )}
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
