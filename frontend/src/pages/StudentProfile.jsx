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

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-7">

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            My Profile
          </h1>

          <p className="text-[11px] text-slate-400">
            View and manage your academic and account information
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Dashboard
        </Link>

      </header>

      <main className="p-7">

        {saved && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium rounded-lg px-4 py-3 mb-5">
            Profile updated successfully.
          </div>
        )}

        <div className="grid grid-cols-3 gap-5">

          <div className="bg-white border border-slate-200 rounded-xl p-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                {profile.name.charAt(0)}
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {profile.name}
                </h2>

                <p className="text-[11px] text-slate-400 mt-1">
                  Student
                </p>
              </div>

            </div>

            <div className="border-t border-slate-100 mt-5 pt-5">

              <p className="text-[10px] text-slate-400">
                Email
              </p>

              <p className="text-xs font-medium text-slate-700 mt-1">
                {profile.email}
              </p>

            </div>

            <div className="mt-5">

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true)
                    setSaved(false)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-xs font-semibold transition"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-xs font-semibold transition"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border border-slate-200 text-slate-600 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                </div>
              )}

            </div>

          </div>

          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Academic Information
                </h2>

                <p className="text-[10px] text-slate-400 mt-1">
                  Your current academic details
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-5 mt-5">

              <div>
                <label className="text-[10px] text-slate-400">
                  Full Name
                </label>

                {isEditing ? (
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {profile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-slate-400">
                  Email
                </label>

                {isEditing ? (
                  <input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {profile.email}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-slate-400">
                  Program
                </label>

                {isEditing ? (
                  <input
                    name="program"
                    value={profile.program}
                    onChange={handleChange}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {profile.program}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-slate-400">
                  Semester
                </label>

                {isEditing ? (
                  <input
                    name="semester"
                    value={profile.semester}
                    onChange={handleChange}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {profile.semester}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-slate-400">
                  Student ID
                </label>

                <p className="text-xs font-semibold text-slate-700 mt-1">
                  {profile.studentId}
                </p>
              </div>

              <div>
                <label className="text-[10px] text-slate-400">
                  Section
                </label>

                {isEditing ? (
                  <input
                    name="section"
                    value={profile.section}
                    onChange={handleChange}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {profile.section}
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 mt-5">

          <h2 className="text-sm font-bold text-slate-900">
            Performance Summary
          </h2>

          <div className="grid grid-cols-3 gap-4 mt-5">

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-[10px] text-slate-500">
                Total Evaluations
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                12
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-[10px] text-slate-500">
                Average Score
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                82%
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-[10px] text-slate-500">
                Current Status
              </p>

              <p className="text-sm font-bold text-emerald-600 mt-3">
                Active
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 mt-5">

          <h2 className="text-sm font-bold text-slate-900">
            Account Information
          </h2>

          <div className="grid grid-cols-2 gap-5 mt-5">

            <div>
              <p className="text-[10px] text-slate-400">
                Account Role
              </p>

              <p className="text-xs font-semibold text-slate-700 mt-1">
                Student
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">
                Account Status
              </p>

              <p className="text-xs font-semibold text-emerald-600 mt-1">
                Active
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default StudentProfile