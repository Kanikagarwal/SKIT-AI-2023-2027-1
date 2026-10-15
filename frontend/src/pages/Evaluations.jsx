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

  const completedCount = evaluations.filter(
    (item) => item.status === "Completed"
  ).length

  const pendingCount = evaluations.filter(
    (item) => item.status === "Pending" || item.status === "In Review"
  ).length

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    }

    if (status === "In Review") {
      return "border border-blue-400/20 bg-blue-400/10 text-blue-300"
    }

    return "border border-amber-400/20 bg-amber-400/10 text-amber-300"
  }

  return (
    <div className="min-h-screen bg-[#080D19] text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#0B1220]/95 px-5 py-4 backdrop-blur-xl sm:px-8">

        <div>
          <p className="text-xs font-semibold tracking-[2px] text-blue-400">
            EVALAI / WORKSPACE
          </p>

          <h1 className="mt-1 text-xl font-bold text-white">
            Evaluations
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Manage and review your answer sheet evaluations
          </p>
        </div>

        <Link
          to="/new-evaluation"
          style={{ backgroundColor: "#3B82F6" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563EB")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#3B82F6")
          }
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5"
        >
          <span className="text-lg">+</span>
          New Evaluation
        </Link>

      </header>

      <main className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">

        {/* Page Heading and Filters */}
        <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

          <div>
            <h2 className="text-xl font-bold text-white">
              All Evaluations
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Track the progress of your theory answer evaluations.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Search */}
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search evaluations..."
                className="w-full rounded-xl border border-white/10 bg-[#111B2D] py-3 pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/10 sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#111B2D] px-4 py-3 text-xs text-slate-300 outline-none transition focus:border-blue-400/50"
            >
              <option value="All status">All status</option>
              <option value="Completed">Completed</option>
              <option value="In Review">In Review</option>
              <option value="Pending">Pending</option>
            </select>

          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-[#111B2D] p-5 transition hover:border-blue-400/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Total Evaluations
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-xl text-blue-300">
                ▤
              </span>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-white">
              {evaluations.length}
            </h3>

            <p className="mt-2 text-xs text-blue-300">
              All examination records
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111B2D] p-5 transition hover:border-emerald-400/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Completed
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-xl text-emerald-300">
                ✓
              </span>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-white">
              {completedCount}
            </h3>

            <p className="mt-2 text-xs text-emerald-300">
              Successfully evaluated
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111B2D] p-5 transition hover:border-amber-400/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Pending Review
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-xl text-amber-300">
                ◷
              </span>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-white">
              {pendingCount}
            </h3>

            <p className="mt-2 text-xs text-amber-300">
              Requires attention
            </p>
          </div>

        </section>

        {/* Evaluation History */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111B2D]">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-5">

            <div>
              <h3 className="text-lg font-bold text-white">
                Evaluation History
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Recent and previous evaluation records
              </p>
            </div>

            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
              {filteredEvaluations.length} Records
            </span>

          </div>

          {/* Table */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px] text-left">

              <thead className="bg-white/[0.03]">
                <tr className="text-[11px] uppercase tracking-wider text-slate-400">

                  <th className="px-6 py-4 font-semibold">
                    Examination
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Students
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Avg. Score
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Date
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredEvaluations.length > 0 ? (
                  filteredEvaluations.map((evaluation, index) => (

                    <tr
                      key={`${evaluation.title}-${index}`}
                      className="border-t border-white/5 transition hover:bg-white/[0.03]"
                    >

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-white">
                          {evaluation.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {evaluation.subject}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {evaluation.students}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            evaluation.status
                          )}`}
                        >
                          {evaluation.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-white">
                        {evaluation.score}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-400">
                        {evaluation.date}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          type="button"
                          className="text-xs font-semibold text-blue-400 transition hover:text-blue-300"
                        >
                          View →
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (

                  <tr>
                    <td colSpan="6" className="px-6 py-14 text-center">

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl text-slate-500">
                        ⌕
                      </div>

                      <p className="mt-4 text-sm font-semibold text-white">
                        No evaluations found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try changing your search or status filter.
                      </p>

                    </td>
                  </tr>

                )}

              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-3 text-center text-xs text-slate-500">
          EvalAI · AI Based Theory Answer Sheet Evaluation
        </footer>

      </main>
    </div>
  )
}

export default Evaluations