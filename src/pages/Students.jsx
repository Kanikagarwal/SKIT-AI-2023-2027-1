import { useState } from "react"
import { Link } from "react-router-dom"

function Students() {
  const students = [
    {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      className: "B.Tech CSE - 3A",
      evaluations: 8,
      score: "82%",
      status: "Active",
    },
    {
      name: "Priya Verma",
      email: "priya.verma@example.com",
      className: "B.Tech CSE - 3A",
      evaluations: 7,
      score: "76%",
      status: "Active",
    },
    {
      name: "Rohan Gupta",
      email: "rohan.gupta@example.com",
      className: "B.Tech CSE - 3B",
      evaluations: 6,
      score: "79%",
      status: "Active",
    },
    {
      name: "Neha Singh",
      email: "neha.singh@example.com",
      className: "B.Tech CSE - 3A",
      evaluations: 9,
      score: "88%",
      status: "Active",
    },
    {
      name: "Karan Mehta",
      email: "karan.mehta@example.com",
      className: "B.Tech CSE - 3B",
      evaluations: 5,
      score: "71%",
      status: "Active",
    },
    {
      name: "Simran Joshi",
      email: "simran.joshi@example.com",
      className: "B.Tech CSE - 3B",
      evaluations: 8,
      score: "84%",
      status: "Active",
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="h-14 bg-white border-b border-slate-200 flex items-center px-7">

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Students
          </h1>

          <p className="text-[11px] text-slate-400">
            Manage students and track their evaluation performance
          </p>
        </div>

      </header>

      <main className="p-7">

        <div className="grid grid-cols-3 gap-4 mb-5">

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Total Students
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              156
            </p>

            <p className="text-[10px] text-emerald-600 mt-1">
              Across all classes
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Active Students
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              148
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              Currently enrolled
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Average Score
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              80%
            </p>

            <p className="text-[10px] text-blue-600 mt-1">
              Across evaluations
            </p>
          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Student Directory
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                View student evaluation activity and performance
              </p>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students..."
              className="w-56 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div className="px-5 py-3 grid grid-cols-[2fr_1.4fr_1fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-slate-100 bg-slate-50">

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Student
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Class
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Evaluations
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Avg. Score
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Status
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Action
            </p>

          </div>

          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student.email}
                className="px-5 py-4 grid grid-cols-[2fr_1.4fr_1fr_0.8fr_0.8fr_0.7fr] gap-4 items-center border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
              >

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    {student.name}
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    {student.email}
                  </p>
                </div>

                <p className="text-xs text-slate-600">
                  {student.className}
                </p>

                <p className="text-xs font-semibold text-slate-700">
                  {student.evaluations}
                </p>

                <p className="text-sm font-bold text-slate-800">
                  {student.score}
                </p>

                <span className="w-fit text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                  {student.status}
                </span>

                <Link
                  to={`/students/${encodeURIComponent(student.email)}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View
                </Link>

              </div>
            ))
          ) : (
            <div className="px-5 py-12 text-center">

              <p className="text-sm font-semibold text-slate-700">
                No students found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Try searching with a different name or class.
              </p>

            </div>
          )}

        </div>

      </main>

    </div>
  )
}

export default Students