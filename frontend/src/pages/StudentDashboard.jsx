import { Link } from "react-router-dom"

const stats = [
  { title: "Total Evaluations", value: "12", detail: "This semester", icon: "01", color: "text-blue-300", bg: "bg-blue-400/10" },
  { title: "Completed", value: "9", detail: "75% completion rate", icon: "02", color: "text-emerald-300", bg: "bg-emerald-400/10" },
  { title: "Average Score", value: "82%", detail: "Across evaluations", icon: "03", color: "text-indigo-300", bg: "bg-indigo-400/10" },
  { title: "Pending", value: "3", detail: "Awaiting evaluation", icon: "04", color: "text-amber-300", bg: "bg-amber-400/10" },
]

const evaluations = [
  { subject: "Data Structures", exam: "Mid Term Examination", date: "10 Oct 2026", score: "82%", status: "Evaluated", color: "bg-emerald-400/10 text-emerald-300" },
  { subject: "Operating Systems", exam: "Unit Test", date: "09 Oct 2026", score: "78%", status: "Evaluated", color: "bg-emerald-400/10 text-emerald-300" },
  { subject: "Computer Networks", exam: "Assignment", date: "07 Oct 2026", score: "85%", status: "Evaluated", color: "bg-emerald-400/10 text-emerald-300" },
  { subject: "Software Engineering", exam: "Unit Test", date: "05 Oct 2026", score: "-", status: "Pending", color: "bg-amber-400/10 text-amber-300" },
]

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#080D19] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#0B1220]/95 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[2px] text-blue-400">EVALAI / STUDENT WORKSPACE</p>
          <h1 className="mt-1 text-xl font-bold text-white">Student Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">Anshu Dhattarwal</p>
            <p className="text-xs text-slate-400">Student</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/30 bg-gradient-to-br from-blue-500/30 to-indigo-400/20 font-bold text-blue-300">A</div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-r from-[#14233D] via-[#172943] to-[#202447] p-6 sm:p-8">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute bottom-[-80px] right-1/3 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold tracking-wide text-blue-300">STUDENT ACADEMIC PORTAL</p>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Welcome back, Anshu!</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Track your examination results, monitor academic performance and stay updated with your evaluations.
              </p>
            </div>
            <Link to="/student-evaluations" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-[#2563EB]">
              View Evaluations <span className="text-lg">→</span>
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Academic Overview</h2>
              <p className="mt-1 text-xs text-slate-400">Your evaluation activity at a glance</p>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">October 2026</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.title} className="group rounded-2xl border border-white/10 bg-[#111B2D] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#16243A]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                </div>
                <h3 className="mt-5 text-3xl font-bold tracking-tight text-white">{stat.value}</h3>
                <p className={`mt-2 text-xs ${stat.color}`}>{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Performance and Quick Actions */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111B2D] p-6 xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">Performance Overview</h2>
                <p className="mt-1 text-xs text-slate-400">Your overall academic evaluation performance</p>
              </div>
              <span className="rounded-lg border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">Average: 82%</span>
            </div>
            <div className="mt-8 grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
              <div className="flex justify-center">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full" style={{ background: "conic-gradient(#3B82F6 0% 82%, rgba(255,255,255,0.08) 82% 100%)" }}>
                  <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#111B2D]">
                    <span className="text-3xl font-bold text-white">82%</span>
                    <span className="mt-1 text-xs text-slate-400">Average Score</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Completed Evaluations", value: "75%", color: "bg-emerald-400", width: "75%" },
                  { label: "Average Performance", value: "82%", color: "bg-blue-500", width: "82%" },
                  { label: "Pending Evaluations", value: "25%", color: "bg-amber-400", width: "25%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between gap-3">
                      <span className="text-xs text-slate-300">{item.label}</span>
                      <span className="text-xs font-bold text-white">{item.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/10 bg-[#111B2D] p-6">
            <h2 className="text-lg font-bold text-white">Quick Actions</h2>
            <p className="mt-1 text-xs text-slate-400">Access your student activities</p>
            <div className="mt-6 space-y-3">
              <Link to="/student-evaluations" className="flex items-center gap-3 rounded-xl border border-blue-400/20 bg-blue-400/10 p-4 transition hover:border-blue-400/40 hover:bg-blue-400/15">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-lg font-bold text-white">E</span>
                <span>
                  <span className="block text-sm font-semibold text-white">My Evaluations</span>
                  <span className="mt-1 block text-xs text-slate-400">View examination results</span>
                </span>
              </Link>
              <Link to="/student-answer-sheets" className="flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-4 transition hover:border-indigo-400/40 hover:bg-indigo-400/15">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-400/15 text-lg font-bold text-indigo-300">A</span>
                <span>
                  <span className="block text-sm font-semibold text-white">Answer Sheets</span>
                  <span className="mt-1 block text-xs text-slate-400">Access submitted answer sheets</span>
                </span>
              </Link>
              <Link to="/student-profile" className="flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-4 transition hover:border-indigo-400/40 hover:bg-indigo-400/15">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-400/15 text-lg font-bold text-indigo-300">P</span>
                <span>
                  <span className="block text-sm font-semibold text-white">My Profile</span>
                  <span className="mt-1 block text-xs text-slate-400">View personal information</span>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Evaluations */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111B2D]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Evaluations</h2>
              <p className="mt-1 text-xs text-slate-400">Your latest examination activity</p>
            </div>
            <Link to="/student-evaluations" className="text-xs font-semibold text-blue-400 transition hover:text-blue-300">View all →</Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">
              <thead className="bg-white/[0.03]">
                <tr className="text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((item) => (
                  <tr key={item.subject} className="border-t border-white/5 transition hover:bg-white/[0.03]">
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-white">{item.subject}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.exam}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400">{item.date}</td>
                    <td className="px-6 py-5 text-sm font-bold text-white">{item.score}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${item.color}`}>{item.status}</span>
                    </td>
                    <td className="px-6 py-5">
                      <Link to="/student-evaluations" className="text-xs font-semibold text-blue-400 transition hover:text-blue-300">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile and Tablet Cards */}
          <div className="divide-y divide-white/5 lg:hidden">
            {evaluations.map((item) => (
              <div key={item.subject} className="p-4 transition hover:bg-white/[0.03] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{item.subject}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.exam}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold ${item.color}`}>{item.status}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">Date</p>
                    <p className="mt-1 text-xs text-slate-300">{item.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">Score</p>
                    <p className="mt-1 text-xs font-bold text-white">{item.score}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/student-evaluations" className="text-xs font-semibold text-blue-400 transition hover:text-blue-300">View Evaluation →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-3 text-center text-xs text-slate-500">EvalAI · AI Based Theory Answer Sheet Evaluation</footer>
      </main>
    </div>
  )
}

export default StudentDashboard
