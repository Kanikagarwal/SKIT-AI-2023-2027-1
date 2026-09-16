import { useState } from "react"
import { Link } from "react-router-dom"

function StudentEvaluations() {
  const evaluations = [
    {
      title: "Data Structures - Mid Term",
      subject: "Data Structures",
      date: "Sep 10, 2026",
      score: "82%",
      marks: "41 / 50",
      status: "Evaluated",
    },
    {
      title: "Operating Systems - Unit Test",
      subject: "Operating Systems",
      date: "Sep 9, 2026",
      score: "78%",
      marks: "39 / 50",
      status: "Evaluated",
    },
    {
      title: "Computer Networks - Assignment",
      subject: "Computer Networks",
      date: "Sep 7, 2026",
      score: "85%",
      marks: "34 / 40",
      status: "Evaluated",
    },
    {
      title: "Database Management - Internal Assessment",
      subject: "Database Management",
      date: "Sep 5, 2026",
      score: "81%",
      marks: "40.5 / 50",
      status: "Evaluated",
    },
    {
      title: "Software Engineering - Unit Test",
      subject: "Software Engineering",
      date: "Sep 3, 2026",
      score: "-",
      marks: "-",
      status: "Pending",
    },
    {
      title: "Artificial Intelligence - Assignment",
      subject: "Artificial Intelligence",
      date: "Sep 1, 2026",
      score: "-",
      marks: "-",
      status: "Pending",
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "All" || evaluation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-7">

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            My Evaluations
          </h1>

          <p className="text-[11px] text-slate-400">
            View your theory evaluation results and progress
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

        <div className="grid grid-cols-3 gap-4 mb-5">

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Total Evaluations
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              12
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              This semester
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Evaluated
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              9
            </p>

            <p className="text-[10px] text-emerald-600 mt-1">
              Results available
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Average Score
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              82%
            </p>

            <p className="text-[10px] text-blue-600 mt-1">
              Across evaluated answers
            </p>
          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Evaluation History
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                Your submitted theory evaluations
              </p>
            </div>

            <div className="flex items-center gap-2">

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search evaluations..."
                className="w-52 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All</option>
                <option value="Evaluated">Evaluated</option>
                <option value="Pending">Pending</option>
              </select>

            </div>

          </div>

          <div className="px-5 py-3 grid grid-cols-[2.2fr_1.2fr_1fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-slate-100 bg-slate-50">

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Evaluation
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Subject
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Date
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Score
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Status
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Action
            </p>

          </div>

          {filteredEvaluations.length > 0 ? (
            filteredEvaluations.map((evaluation) => (
              <div
                key={evaluation.title}
                className="px-5 py-4 grid grid-cols-[2.2fr_1.2fr_1fr_0.8fr_0.8fr_0.7fr] gap-4 items-center border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
              >

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    {evaluation.title}
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    {evaluation.marks}
                  </p>
                </div>

                <p className="text-xs text-slate-600">
                  {evaluation.subject}
                </p>

                <p className="text-xs text-slate-600">
                  {evaluation.date}
                </p>

                <p className="text-sm font-bold text-slate-800">
                  {evaluation.score}
                </p>

                <span
                  className={`w-fit text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                    evaluation.status === "Evaluated"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {evaluation.status}
                </span>

                {evaluation.status === "Evaluated" ? (
                  <Link
                    to="/student-result"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View Result
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400">
                    Pending
                  </span>
                )}

              </div>
            ))
          ) : (
            <div className="px-5 py-12 text-center">

              <p className="text-sm font-semibold text-slate-700">
                No evaluations found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Try changing your search or filter.
              </p>

            </div>
          )}

        </div>

      </main>

    </div>
  )
}

export default StudentEvaluations