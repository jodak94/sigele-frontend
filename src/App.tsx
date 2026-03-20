import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { OperatorsPage } from "./pages/OperatorsPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { RoleGuard } from "./components/RoleGuard"
import { UnderConstructionPage } from "./pages/UnderConstructionPage"
import { OperatorDashboard } from "./pages/OperatorDashboard"
import { AdminDashboard } from "./pages/AdminDashboard"
import { PublicSearchPage } from "./pages/PublicSearchPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#b71c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UnderConstructionPage />
          </div>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/public" element={<PublicSearchPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={
            <RoleGuard allowed={['OPERADOR']}>
              <OperatorDashboard />
            </RoleGuard>
          } />
          <Route path="/admin" element={
            <RoleGuard allowed={['ADMIN', 'SUPER_ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          } />
          <Route path="/operators" element={<OperatorsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
