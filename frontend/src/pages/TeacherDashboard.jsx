
import { Link } from "react-router-dom"

const stats = [
  {
    title: "Total Evaluations",
    value: "128",
    detail: "+12% this month",
    icon: "▤",
    color: "text-blue-300",
    bg: "bg-blue-400/10",
  },
  {
    title: "Answer Sheets",
    value: "486",
    detail: "Uploaded this semester",
    icon: "▧",
    color: "text-indigo-300",
    bg: "bg-indigo-400/10",
  },
  {
    title: "Completed",
    value: "100",
    detail: "78% completion rate",
    icon: "✓",
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
  },
  {
    title: "Pending Review",
    value: "14",
    detail: "Requires attention",
    icon: "◷",
    color: "text-amber-300",
    bg: "bg-amber-400/10",
  },
]

const evaluations = [
  {
    subject: "Data Structures",
    exam: "Mid Term Examination",
    students: "42 Students",
    date: "10 Oct 2026",
    status: "Completed",
    color: "bg-emerald-400/10 text-emerald-300",
  },
  {
    subject: "Operating Systems",
    exam: "Unit Test",
    students: "36 Students",
    date: "12 Oct 2026",
    status: "In Review",
    color: "bg-blue-400/10 text-blue-300",
  },
  {
    subject: "Computer Networks",
    exam: "Internal Assessment",
    students: "28 Students",
    date: "14 Oct 2026",
    status: "Pending",
    color: "bg-amber-400/10 text-amber-300",
  },
]

function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-[#080D19] text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#0B1220]/95 px-5 py-4 backdrop-blur-xl sm:px-8">

        <div>
          <p className="text-xs font-semibold tracking-[2px] text-blue-400">
            EVALAI / WORKSPACE
          </p>

          <h1 className="mt-1 text-xl font-bold text-white">
            Teacher Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">Teacher</p>
            <p className="text-xs text-slate-400">Evaluation Portal</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/30 bg-gradient-to-br from-blue-500/30 to-indigo-400/20 font-bold text-blue-300">
            T
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-r from-[#14233D] via-[#172943] to-[#202447] p-6 sm:p-8">

          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="absolute bottom-[-80px] right-1/3 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>
              <p className="text-sm font-semibold tracking-wide text-blue-300">
                THURSDAY, OCTOBER 15, 2026
              </p>

              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Welcome back, Teacher!
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Manage examinations, review handwritten answer sheets
                and track evaluation progress from one place.
              </p>
            </div>

            <Link
              to="/new-evaluation"
              style={{ backgroundColor: "#3B82F6" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
              className="inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5"
            >
              <span className="text-lg">+</span>
              New Evaluation
            </Link>

          </div>
        </section>

        {/* Statistics */}
        <section>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">
                Performance Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your evaluation activity at a glance
              </p>
            </div>

            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
              October 2026
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => (
              <div
                key={stat.title}
                className="group rounded-2xl border border-white/10 bg-[#111B2D] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#16243A]"
              >
                <div className="flex items-center justify-between">

                  <p className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </p>

                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>

                <h3 className="mt-5 text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </h3>

                <p className={`mt-2 text-xs ${stat.color}`}>
                  {stat.detail}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* Analytics and Quick Actions */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Evaluation Analytics */}
          <div className="rounded-2xl border border-white/10 bg-[#111B2D] p-6 xl:col-span-2">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>
                <h2 className="text-lg font-bold text-white">
                  Evaluation Analytics
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Current examination evaluation status
                </p>
              </div>

              <Link
                to="/evaluations"
                className="text-xs font-semibold text-blue-400 transition hover:text-blue-300"
              >
                View all →
              </Link>

            </div>

            <div className="mt-8 grid grid-cols-1 items-center gap-8 sm:grid-cols-2">

              {/* Donut Chart */}
              <div className="flex justify-center">

                <div
                  className="relative flex h-48 w-48 items-center justify-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(#34d399 0% 78%, #3B82F6 78% 89%, #FBBF24 89% 100%)",
                  }}
                >

                  <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#111B2D]">

                    <span className="text-3xl font-bold text-white">
                      78%
                    </span>

                    <span className="mt-1 text-xs text-slate-400">
                      Completed
                    </span>

                  </div>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="space-y-6">

                {[
                  {
                    label: "Completed",
                    value: "78%",
                    color: "bg-emerald-400",
                    width: "78%",
                  },
                  {
                    label: "In Review",
                    value: "11%",
                    color: "bg-blue-500",
                    width: "11%",
                  },
                  {
                    label: "Pending",
                    value: "11%",
                    color: "bg-amber-400",
                    width: "11%",
                  },
                ].map((item) => (

                  <div key={item.label}>

                    <div className="mb-2 flex justify-between">

                      <span className="text-sm text-slate-300">
                        {item.label}
                      </span>

                      <span className="text-sm font-bold text-white">
                        {item.value}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">

                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: item.width }}
                      />

                    </div>
                  </div>

                ))}

              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/10 bg-[#111B2D] p-6">

            <h2 className="text-lg font-bold text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Frequently used tools
            </p>

            <div className="mt-6 space-y-3">

              {/* Create Evaluation */}
              <Link
                to="/new-evaluation"
                className="flex items-center gap-3 rounded-xl border border-blue-400/20 bg-blue-400/10 p-4 transition hover:border-blue-400/40 hover:bg-blue-400/15"
              >

                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-xl font-bold text-white">
                  +
                </span>

                <span>
                  <span className="block text-sm font-semibold text-white">
                    Create Evaluation
                  </span>

                  <span className="mt-1 block text-xs text-slate-400">
                    Set up a new examination
                  </span>
                </span>

              </Link>

              {/* Answer Sheets */}
              <Link
                to="/answer-sheets"
                className="flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-4 transition hover:border-indigo-400/40 hover:bg-indigo-400/15"
              >

                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-400/15 text-xl text-indigo-300">
                  ↑
                </span>

                <span>
                  <span className="block text-sm font-semibold text-white">
                    Answer Sheets
                  </span>

                  <span className="mt-1 block text-xs text-slate-400">
                    Manage uploaded answer sheets
                  </span>
                </span>

              </Link>

              {/* View Evaluations */}
              <Link
                to="/evaluations"
                className="flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-4 transition hover:border-indigo-400/40 hover:bg-indigo-400/15"
              >

                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-400/15 text-xl text-indigo-300">
                  ↗
                </span>

                <span>
                  <span className="block text-sm font-semibold text-white">
                    View Evaluations
                  </span>

                  <span className="mt-1 block text-xs text-slate-400">
                    Track examination progress
                  </span>
                </span>

              </Link>

            </div>
          </div>
        </section>

        {/* Recent Evaluations */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111B2D]">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-5">

            <div>
              <h2 className="text-lg font-bold text-white">
                Recent Evaluations
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Latest examination activity
              </p>
            </div>

            <Link
              to="/evaluations"
              className="text-xs font-semibold text-blue-400 transition hover:text-blue-300"
            >
              View all →
            </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px] text-left">

              <thead className="bg-white/[0.03]">

                <tr className="text-[11px] uppercase tracking-wider text-slate-400">

                  <th className="px-6 py-4 font-semibold">
                    Subject
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Students
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Date
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {evaluations.map((item) => (

                  <tr
                    key={item.subject}
                    className="border-t border-white/5 transition hover:bg-white/[0.03]"
                  >

                    <td className="px-6 py-5">

                      <p className="text-sm font-semibold text-white">
                        {item.subject}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.exam}
                      </p>

                    </td>

                    <td className="px-6 py-5 text-sm text-slate-300">
                      {item.students}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-400">
                      {item.date}
                    </td>

                    <td className="px-6 py-5">

                      <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${item.color}`}>
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))}

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

export default TeacherDashboard
