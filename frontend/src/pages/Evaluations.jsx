import { useState } from "react"
import { Link } from "react-router-dom"

function Evaluations() {
  const defaultEvaluations = [
    {
      title: "Data Structures - Mid Term",
      subject: "Data Structures",
      students: 42,
      status: "Completed",
      score: "78%",
      date: "Sep 10, 2026",
    },
    {
      title: "Operating Systems - Unit Test",
      subject: "Operating Systems",
      students: 36,
      status: "In Review",
      score: "72%",
      date: "Sep 9, 2026",
    },
    {
      title: "Computer Networks - Assignment",
      subject: "Computer Networks",
      students: 28,
      status: "Completed",
      score: "81%",
      date: "Sep 7, 2026",
    },
    {
      title: "DBMS - Internal Assessment",
      subject: "Database Management",
      students: 31,
      status: "Pending",
      score: "—",
      date: "Sep 5, 2026",
    },
  ]

  const savedEvaluations =
    JSON.parse(localStorage.getItem("evaluations")) || []

  const [evaluations] = useState([
    ...savedEvaluations,
    ...defaultEvaluations,
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All status")

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "All status" ||
      evaluation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-7">

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Evaluations
          </h1>

          <p className="text-[11px] text-slate-400">
            Manage and review your answer sheet evaluations
          </p>
        </div>

        <Link
          to="/new-evaluation"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          + New Evaluation
        </Link>

      </header>

      <main className="p-7">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              All Evaluations
            </h2>

            <p className="text-sm text-slate-500 mt-0.5">
              Track the progress of your theory answer evaluations.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search evaluations..."
              className="w-56 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 outline-none bg-white focus:border-blue-500"
            >
              <option>All status</option>
              <option>Completed</option>
              <option>In Review</option>
              <option>Pending</option>
            </select>

          </div>

        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Total Evaluations
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              128
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Completed
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              100
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Pending Review
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              14
            </p>
          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-200">

            <h3 className="text-sm font-bold text-slate-900">
              Evaluation History
            </h3>

            <p className="text-[10px] text-slate-400 mt-0.5">
              Recent and previous evaluation records
            </p>

          </div>

          <div>

            {filteredEvaluations.length > 0 ? (
              filteredEvaluations.map((evaluation, index) => (
                <div
                  key={`${evaluation.title}-${index}`}
                  className="px-5 py-4 border-b border-slate-100 last:border-b-0 flex items-center justify-between hover:bg-slate-50 transition"
                >

                  <div className="w-[38%]">
                    <p className="text-sm font-semibold text-slate-800">
                      {evaluation.title}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      {evaluation.subject}
                    </p>
                  </div>

                  <div className="w-[13%]">
                    <p className="text-[10px] text-slate-400">
                      Students
                    </p>

                    <p className="text-xs font-semibold text-slate-700 mt-1">
                      {evaluation.students}
                    </p>
                  </div>

                  <div className="w-[17%]">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                        evaluation.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : evaluation.status === "In Review"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {evaluation.status}
                    </span>
                  </div>

                  <div className="w-[12%]">
                    <p className="text-[10px] text-slate-400">
                      Avg. Score
                    </p>

                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {evaluation.score}
                    </p>
                  </div>

                  <div className="w-[15%]">
                    <p className="text-[10px] text-slate-400">
                      Date
                    </p>

                    <p className="text-xs text-slate-600 mt-1">
                      {evaluation.date}
                    </p>
                  </div>

                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    View
                  </button>

                </div>
              ))
            ) : (
              <div className="px-5 py-12 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No evaluations found
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Try changing your search or status filter.
                </p>
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  )
}

export default Evaluations