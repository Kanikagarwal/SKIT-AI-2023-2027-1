import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import TeacherDashboard from "./pages/TeacherDashboard"
import Evaluations from "./pages/Evaluations"
import NewEvaluation from "./pages/NewEvaluation"
import AnswerSheets from "./pages/AnswerSheets"
import Rubrics from "./pages/Rubrics"
import Students from "./pages/Students"
import StudentDetails from "./pages/StudentDetails"
import TeacherLayout from "./pages/TeacherLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/teacher-dashboard"
          element={
            <TeacherLayout>
              <TeacherDashboard />
            </TeacherLayout>
          }
        />

        <Route
          path="/evaluations"
          element={
            <TeacherLayout>
              <Evaluations />
            </TeacherLayout>
          }
        />

        <Route
          path="/new-evaluation"
          element={
            <TeacherLayout>
              <NewEvaluation />
            </TeacherLayout>
          }
        />

        <Route
          path="/answer-sheets"
          element={
            <TeacherLayout>
              <AnswerSheets />
            </TeacherLayout>
          }
        />

        <Route
          path="/rubrics"
          element={
            <TeacherLayout>
              <Rubrics />
            </TeacherLayout>
          }
        />

        <Route
          path="/students"
          element={
            <TeacherLayout>
              <Students />
            </TeacherLayout>
          }
        />

        <Route
          path="/students/:email"
          element={
            <TeacherLayout>
              <StudentDetails />
            </TeacherLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App