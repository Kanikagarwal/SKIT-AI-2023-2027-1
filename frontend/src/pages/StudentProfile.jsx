
import { useState } from "react"
import { Link } from "react-router-dom"

function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name: "Anshu Dhattarwal",
    email: "anshu.dhattarwal@example.com",
    program: "B.Tech Computer Science & Engineering",
    semester: "7th Semester",
    studentId: "STU-2026-001",
    section: "CSE - 3A",
  })

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
    setSaved(false)
  }

  const handleSave = () => {
    setIsEditing(false)
    setSaved(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSaved(false)
  }

  const inputClass =
    "w-full mt-2 bg-[#0B1220] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"

  const fields = [
    { label: "Full Name", name: "name" },
    { label: "Email", name: "email", type: "email" },
    { label: "Program", name: "program" },
    { label: "Semester", name: "semester" },
    { label: "Student ID", name: "studentId", readOnly: true },
    { label: "Section", name: "section" },
  ]

  return (
    <div className="min-h-screen bg-[#080D19] text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-20 h-16 bg-[#0B1220] border-b border-white/10 flex items-center justify-between px-5 sm:px-8">

        <div>
          <p className="text-[10px] font-semibold tracking-[2px] text-blue-400">
            EVALAI / STUDENT WORKSPACE
          </p>

          <h1 className="text-base sm:text-lg font-bold text-white mt-0.5">
            My Profile
          </h1>
        </div>

        <Link
          to="/student-dashboard"
          className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors"
        >
          ← Dashboard
        </Link>

      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">

        {/* Page Introduction */}
        <div className="mb-6">
          <p className="text-xs text-slate-500">
            Account / Personal Details
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
            Student Profile
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            View and manage your academic and account information.
          </p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-medium rounded-lg px-4 py-3 mb-5 flex items-center gap-2">
            <span>✓</span>
            Profile updated successfully.
          </div>
        )}

        {/* Profile and Academic Information */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Profile Card */}
          <div className="bg-[#111B2D] border border-white/10 rounded-xl p-5 sm:p-6">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-blue-400/20 text-blue-300 flex items-center justify-center text-xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-white break-words">
                  {profile.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Student
                </p>

                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 px-2 py-1 rounded-md">
                  ● Active Account
                </span>
              </div>

            </div>

            <div className="border-t border-white/10 mt-6 pt-5">

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Email Address
              </p>

              <p className="text-xs font-medium text-slate-300 mt-2 break-all">
                {profile.email}
              </p>

            </div>

            <div className="border-t border-white/10 mt-5 pt-5">

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Student ID
              </p>

              <p className="text-sm font-semibold text-blue-300 mt-2">
                {profile.studentId}
              </p>

            </div>

            <div className="mt-6">

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true)
                    setSaved(false)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">

                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border border-white/10 text-slate-300 rounded-lg px-3 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* Academic Information */}
          <div className="xl:col-span-2 bg-[#111B2D] border border-white/10 rounded-xl p-5 sm:p-6">

            <div className="flex items-center justify-between gap-3">

              <div>
                <h3 className="text-base font-bold text-white">
                  Academic Information
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Your current academic details
                </p>
              </div>

              <span className="text-[10px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-400/20 px-2.5 py-1.5 rounded-md">
                Academic Profile
              </span>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mt-6">

              {fields.map((field) => (
                <div key={field.name} className="min-w-0">

                  <label className="text-xs font-medium text-slate-400">
                    {field.label}
                  </label>

                  {isEditing && !field.readOnly ? (
                    <input
                      name={field.name}
                      type={field.type || "text"}
                      value={profile[field.name]}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-200 mt-2 break-words">
                      {profile[field.name]}
                    </p>
                  )}

                  {field.readOnly && isEditing && (
                    <p className="text-[10px] text-slate-500 mt-2">
                      Student ID cannot be changed.
                    </p>
                  )}

                </div>
              ))}

            </div>

            {isEditing && (
              <div className="mt-6 p-3 rounded-lg bg-blue-500/5 border border-blue-400/10">
                <p className="text-[11px] text-slate-400">
                  Update your editable details and click Save Changes to apply them.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Performance Summary */}
        <div className="bg-[#111B2D] border border-white/10 rounded-xl p-5 sm:p-6 mt-5">

          <div>
            <h3 className="text-base font-bold text-white">
              Performance Summary
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Your overall academic performance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

            <div className="bg-[#0B1220] border border-white/10 rounded-xl p-4 hover:bg-[#16243A] transition-colors">
              <p className="text-xs text-slate-400">
                Total Evaluations
              </p>

              <p className="text-2xl font-bold text-blue-400 mt-3">
                12
              </p>

              <p className="text-[10px] text-slate-500 mt-1">
                Evaluations submitted
              </p>
            </div>

            <div className="bg-[#0B1220] border border-white/10 rounded-xl p-4 hover:bg-[#16243A] transition-colors">
              <p className="text-xs text-slate-400">
                Average Score
              </p>

              <p className="text-2xl font-bold text-emerald-400 mt-3">
                82%
              </p>

              <p className="text-[10px] text-slate-500 mt-1">
                Overall performance
              </p>
            </div>

            <div className="bg-[#0B1220] border border-white/10 rounded-xl p-4 hover:bg-[#16243A] transition-colors">
              <p className="text-xs text-slate-400">
                Current Status
              </p>

              <p className="text-xl font-bold text-emerald-400 mt-4">
                Active
              </p>

              <p className="text-[10px] text-slate-500 mt-1">
                Academic account status
              </p>
            </div>

          </div>

        </div>

        {/* Account Information */}
        <div className="bg-[#111B2D] border border-white/10 rounded-xl p-5 sm:p-6 mt-5">

          <h3 className="text-base font-bold text-white">
            Account Information
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Your account access and role details
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">

            <div className="bg-[#0B1220] rounded-lg border border-white/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Account Role
              </p>

              <p className="text-sm font-semibold text-slate-200 mt-2">
                Student
              </p>
            </div>

            <div className="bg-[#0B1220] rounded-lg border border-white/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Account Status
              </p>

              <p className="text-sm font-semibold text-emerald-300 mt-2">
                Active
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <footer className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-[10px] text-slate-500">
            © 2026 EvalAI. AI-Based Theory Examination Evaluation System.
          </p>

          <Link
            to="/student-dashboard"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Back to Dashboard →
          </Link>

        </footer>

      </main>

    </div>
  )
}

export default StudentProfile
