import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { OperatorsPage } from "./pages/OperatorsPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { UnderConstructionPage } from "./pages/UnderConstructionPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#b71c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UnderConstructionPage />
          </div>
        }/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route element={<ProtectedRoute/>}>
          <Route path="/operators" element={<OperatorsPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
