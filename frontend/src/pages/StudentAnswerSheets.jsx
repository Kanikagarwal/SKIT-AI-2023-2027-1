
import { Link } from "react-router-dom"

function StudentAnswerSheets() {
  const answerSheets = [
    {
      title: "Data Structures - Mid Term",
      subject: "Data Structures",
      submitted: "Sep 10, 2026",
      pages: 8,
      status: "Evaluated",
      score: "82%",
    },
    {
      title: "Operating Systems - Unit Test",
      subject: "Operating Systems",
      submitted: "Sep 9, 2026",
      pages: 6,
      status: "Evaluated",
      score: "78%",
    },
    {
      title: "Computer Networks - Assignment",
      subject: "Computer Networks",
      submitted: "Sep 7, 2026",
      pages: 5,
      status: "Evaluated",
      score: "85%",
    },
    {
      title: "Database Management - Internal Assessment",
      subject: "Database Management",
      submitted: "Sep 5, 2026",
      pages: 7,
      status: "Evaluated",
      score: "81%",
    },
    {
      title: "Software Engineering - Unit Test",
      subject: "Software Engineering",
      submitted: "Sep 3, 2026",
      pages: 6,
      status: "Under Evaluation",
      score: "-",
    },
  ]

  const stats = [
    {
      title: "Total Answer Sheets",
      value: "12",
      detail: "Submitted this semester",
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
      title: "Under Evaluation",
      value: "3",
      detail: "Processing in progress",
      color: "text-amber-300",
      bg: "bg-amber-400/10",
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
            My Answer Sheets
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
            Answer Sheet Overview
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            View your submitted theory answer sheets and track their evaluation progress.
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

        {/* Answer Sheets Section */}
        <section className="bg-[#111B2D] border border-white/10 rounded-xl overflow-hidden">

          {/* Section Header */}
          <div className="px-4 sm:px-5 py-5 border-b border-white/10">

            <h3 className="text-sm font-bold text-white">
              Submitted Answer Sheets
            </h3>

            <p className="text-[11px] text-slate-400 mt-1">
              Your answer sheet submission and evaluation history
            </p>

          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block w-full">

            <table className="w-full table-fixed text-left">

              <colgroup>
                <col className="w-[26%]" />
                <col className="w-[18%]" />
                <col className="w-[16%]" />
                <col className="w-[10%]" />
                <col className="w-[18%]" />
                <col className="w-[12%]" />
              </colgroup>

              <thead>
                <tr className="bg-[#0B1220] border-b border-white/10">

                  {["Evaluation", "Subject", "Submitted", "Pages", "Status", "Score"].map((heading) => (
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

                {answerSheets.map((sheet) => (

                  <tr
                    key={sheet.title}
                    className="hover:bg-[#16243A]/60 transition"
                  >

                    {/* Evaluation */}
                    <td className="px-3 py-5">
                      <p className="text-xs font-semibold text-slate-200 truncate" title={sheet.title}>
                        {sheet.title}
                      </p>

                      <p className="text-[10px] text-slate-500 mt-1">
                        Theory answer sheet
                      </p>
                    </td>

                    {/* Subject */}
                    <td className="px-3 py-5">
                      <p className="text-xs text-slate-400 truncate" title={sheet.subject}>
                        {sheet.subject}
                      </p>
                    </td>

                    {/* Submitted */}
                    <td className="px-3 py-5">
                      <p className="text-xs text-slate-400 whitespace-nowrap">
                        {sheet.submitted}
                      </p>
                    </td>

                    {/* Pages */}
                    <td className="px-3 py-5">
                      <p className="text-xs font-semibold text-slate-300">
                        {sheet.pages}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 w-fit text-[10px] font-semibold px-2 py-1.5 rounded-md whitespace-nowrap ${
                          sheet.status === "Evaluated"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-amber-400/10 text-amber-300"
                        }`}
                      >

                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            sheet.status === "Evaluated"
                              ? "bg-emerald-400"
                              : "bg-amber-400"
                          }`}
                        />

                        {sheet.status}

                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-3 py-5">
                      <p className="text-sm font-bold text-white">
                        {sheet.score}
                      </p>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Mobile and Tablet Cards */}
          <div className="lg:hidden divide-y divide-white/5">

            {answerSheets.map((sheet) => (

              <div
                key={sheet.title}
                className="p-4 sm:p-5 hover:bg-[#16243A]/50 transition"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200">
                      {sheet.title}
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      {sheet.subject}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-semibold px-2 py-1 rounded-md ${
                      sheet.status === "Evaluated"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {sheet.status}
                  </span>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">

                  <div>
                    <p className="text-[9px] text-slate-500 uppercase">
                      Submitted
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      {sheet.submitted}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-500 uppercase">
                      Pages
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      {sheet.pages}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-500 uppercase">
                      Score
                    </p>
                    <p className="text-xs font-bold text-white mt-1">
                      {sheet.score}
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Footer */}
          <div className="px-4 sm:px-5 py-3 bg-[#0B1220] border-t border-white/10 flex items-center justify-between gap-2">

            <p className="text-[10px] text-slate-500">
              Showing {answerSheets.length} of {answerSheets.length} records
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

export default StudentAnswerSheets
