
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
  const [sortOrder, setSortOrder] = useState("newest")

  const filteredEvaluations = evaluations
    .filter((evaluation) => {
      const matchesSearch =
        evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.subject.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "All" || evaluation.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortOrder === "newest" || sortOrder === "oldest") {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB
      }

      if (a.status !== b.status) {
        return a.status === "Evaluated" ? -1 : 1
      }

      const scoreA = parseFloat(a.score)
      const scoreB = parseFloat(b.score)
      return sortOrder === "highest" ? scoreB - scoreA : scoreA - scoreB
    })

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("All")
    setSortOrder("newest")
  }

  const stats = [
    {
      title: "Total Evaluations",
      value: "12",
      detail: "This semester",
      color: "text-blue-300",
      bg: "bg-blue-400/10",
      icon: "01",
    },
    {
      title: "Evaluated",
      value: "9",
      detail: "Results available",
      color: "text-emerald-300",
      bg: "bg-emerald-400/10",
      icon: "02",
    },
    {
      title: "Average Score",
      value: "82%",
      detail: "Across evaluated answers",
      color: "text-indigo-300",
      bg: "bg-indigo-400/10",
      icon: "03",
    },
  ]

  return (
    <div className="min-h-screen bg-[#080D19] text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-20 h-16 bg-[#0B1220] border-b border-white/10 flex items-center justify-between px-5 sm:px-7">

        <div>
          <p className="text-[10px] font-semibold tracking-[2px] text-blue-400 uppercase">
            EvalAI / Student Workspace
          </p>

          <h1 className="text-lg font-bold text-white mt-0.5">
            My Evaluations
          </h1>
        </div>

        <Link
          to="/student-dashboard"
          className="text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg transition"
        >
          ← Dashboard
        </Link>

      </header>

      <main className="p-4 sm:p-6 lg:p-7 space-y-6">

        {/* Introduction */}
        <div>
          <h2 className="text-xl font-bold text-white">
            Evaluation History
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Track your submitted theory evaluations and academic performance.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-[#111B2D] border border-white/10 rounded-xl p-5 hover:bg-[#16243A] transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">
                  {stat.title}
                </p>

                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <span className={`text-xs font-bold ${stat.color}`}>
                    {stat.icon}
                  </span>
                </div>
              </div>

              <p className="text-2xl font-bold text-white mt-4">
                {stat.value}
              </p>

              <p className={`text-[11px] mt-1 ${stat.color}`}>
                {stat.detail}
              </p>
            </div>
          ))}

        </div>

        {/* Evaluation History */}
        <section className="bg-[#111B2D] border border-white/10 rounded-xl overflow-hidden">

          {/* Section Header */}
          <div className="p-4 sm:p-5 border-b border-white/10">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              <div>
                <h3 className="text-sm font-bold text-white">
                  All Evaluations
                </h3>

                <p className="text-[11px] text-slate-400 mt-1">
                  Your submitted theory evaluation records
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search evaluations..."
                  className="w-full sm:w-56 bg-[#080D19] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#080D19] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-blue-500 transition"
                >
                  <option value="All">All Status</option>
                  <option value="Evaluated">Evaluated</option>
                  <option value="Pending">Pending</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  aria-label="Sort evaluations"
                  className="bg-[#080D19] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-blue-500 transition"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Score</option>
                  <option value="lowest">Lowest Score</option>
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!searchTerm && statusFilter === "All" && sortOrder === "newest"}
                  className="text-xs font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2.5 rounded-lg transition"
                >
                  Clear Filters
                </button>

              </div>

            </div>

          </div>

          {/* Desktop Table - No Horizontal Scroll */}
          <div className="hidden lg:block w-full">

            <table className="w-full table-fixed text-left">

              <colgroup>
                <col className="w-[27%]" />
                <col className="w-[17%]" />
                <col className="w-[14%]" />
                <col className="w-[9%]" />
                <col className="w-[14%]" />
                <col className="w-[19%]" />
              </colgroup>

              <thead>
                <tr className="bg-[#0B1220] border-b border-white/10">

                  {["Evaluation", "Subject", "Date", "Score", "Status", "Action"].map((heading) => (
                    <th
                      key={heading}
                      className="px-3 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}

                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">

                {filteredEvaluations.map((evaluation) => (

                  <tr
                    key={evaluation.title}
                    className="hover:bg-[#16243A]/60 transition"
                  >

                    <td className="px-3 py-4">
                      <p className="text-xs font-semibold text-slate-200 truncate" title={evaluation.title}>
                        {evaluation.title}
                      </p>

                      <p className="text-[10px] text-slate-500 mt-1">
                        Marks: {evaluation.marks}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <p className="text-xs text-slate-400 truncate" title={evaluation.subject}>
                        {evaluation.subject}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <p className="text-xs text-slate-400 whitespace-nowrap">
                        {evaluation.date}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <p className="text-sm font-bold text-white">
                        {evaluation.score}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1.5 rounded-md whitespace-nowrap ${
                          evaluation.status === "Evaluated"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            evaluation.status === "Evaluated"
                              ? "bg-emerald-400"
                              : "bg-amber-400"
                          }`}
                        />
                        {evaluation.status}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      {evaluation.status === "Evaluated" ? (
                        <Link
                          to="/student-result"
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap transition"
                        >
                          View Result →
                        </Link>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Awaiting Result
                        </span>
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {filteredEvaluations.length === 0 && (
              <div className="px-5 py-16 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  No evaluations found
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Try changing your search or filter.
                </p>
              </div>
            )}

          </div>

          {/* Mobile and Tablet Cards */}
          <div className="lg:hidden divide-y divide-white/5">

            {filteredEvaluations.length > 0 ? (

              filteredEvaluations.map((evaluation) => (

                <div
                  key={evaluation.title}
                  className="p-4 sm:p-5 hover:bg-[#16243A]/50 transition"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200">
                        {evaluation.title}
                      </p>

                      <p className="text-[10px] text-slate-500 mt-1">
                        {evaluation.subject}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 text-[10px] font-semibold px-2 py-1 rounded-md ${
                        evaluation.status === "Evaluated"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {evaluation.status}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">

                    <div>
                      <p className="text-[9px] text-slate-500 uppercase">
                        Date
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
                        {evaluation.date}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-500 uppercase">
                        Score
                      </p>
                      <p className="text-xs font-bold text-white mt-1">
                        {evaluation.score}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-500 uppercase">
                        Marks
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
                        {evaluation.marks}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4">
                    {evaluation.status === "Evaluated" ? (
                      <Link
                        to="/student-result"
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                      >
                        View Result →
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Awaiting Result
                      </span>
                    )}
                  </div>

                </div>

              ))

            ) : (

              <div className="px-5 py-16 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  No evaluations found
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Try changing your search or filter.
                </p>
              </div>

            )}

          </div>

          {/* Footer */}
          <div className="px-4 sm:px-5 py-3 bg-[#0B1220] border-t border-white/10 flex items-center justify-between gap-2">

            <p className="text-[10px] text-slate-500">
              Showing {filteredEvaluations.length} of {evaluations.length} records
            </p>

            <p className="text-[10px] text-slate-500">
              EvalAI Student Portal
            </p>

          </div>

        </section>

      </main>

    </div>
  )
}

export default StudentEvaluations
