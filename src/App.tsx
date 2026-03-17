import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { TestPage } from "./pages/TestPage";
import { OperatorsPage } from "./pages/OperatorsPage"
import { ProtectedRoute } from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route element={<ProtectedRoute/>}>
          <Route path="/operators" element={<OperatorsPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
