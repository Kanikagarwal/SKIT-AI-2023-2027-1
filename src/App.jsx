import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import TeacherDashboard from "./pages/TeacherDashboard"
import Evaluations from "./pages/Evaluations"
import NewEvaluation from "./pages/NewEvaluation"
import AnswerSheets from "./pages/AnswerSheets"
import Rubrics from "./pages/Rubrics"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/evaluations" element={<Evaluations />} />
        <Route path="/new-evaluation" element={<NewEvaluation />} />
        <Route path="/answer-sheets" element={<AnswerSheets />} />
        <Route path="/rubrics" element={<Rubrics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App