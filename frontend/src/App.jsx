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

import StudentDashboard from "./pages/StudentDashboard"
import StudentEvaluations from "./pages/StudentEvaluations"
import StudentAnswerSheets from "./pages/StudentAnswerSheets"
import StudentResult from "./pages/StudentResult"
import StudentProfile from "./pages/StudentProfile"
import StudentLayout from "./pages/StudentLayout"

import AdminDashboard from "./pages/AdminDashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Teacher Routes */}
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

        {/* Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          }
        />

        <Route
          path="/student-evaluations"
          element={
            <StudentLayout>
              <StudentEvaluations />
            </StudentLayout>
          }
        />

        <Route
          path="/student-answer-sheets"
          element={
            <StudentLayout>
              <StudentAnswerSheets />
            </StudentLayout>
          }
        />

        <Route
          path="/student-result"
          element={
            <StudentLayout>
              <StudentResult />
            </StudentLayout>
          }
        />

        <Route
          path="/student-profile"
          element={
            <StudentLayout>
              <StudentProfile />
            </StudentLayout>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App