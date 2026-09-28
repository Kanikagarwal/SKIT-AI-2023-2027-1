import { Link } from "react-router-dom"

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

      <main className="min-h-screen overflow-hidden">

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-7">

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="text-[11px] text-slate-400">
              Manage users and monitor EvalAI activities
            </p>
          </div>

          <Link
            to="/"
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Back to Login
          </Link>

        </header>

        <div className="p-7">

          <div className="grid grid-cols-4 gap-4 mb-5">

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Total Users
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                184
              </p>

              <p className="text-[10px] text-emerald-600 mt-1">
                Active platform users
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Teachers
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                32
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Registered teachers
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Students
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                151
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Registered students
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Evaluations
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                128
              </p>

              <p className="text-[10px] text-blue-600 mt-1">
                Created this semester
              </p>
            </div>

          </div>

          <div className="grid grid-cols-3 gap-5">

            <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Platform Overview
                  </h2>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Current EvalAI platform activity
                  </p>
                </div>

                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                  System Active
                </span>

              </div>

              <div className="space-y-4">

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      Active Users
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      92%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[92%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      Evaluations Completed
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      78%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[78%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      Pending Evaluations
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      11%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[11%] rounded-full"></div>
                  </div>
                </div>

              </div>

            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <h2 className="text-sm font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-[10px] text-slate-400 mt-1 mb-4">
                Frequently used admin actions
              </p>

              <div className="space-y-2">

                <Link
                  to="/students"
                  className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Manage Users
                </Link>

                <Link
                  to="/evaluations"
                  className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Evaluations
                </Link>

                <Link
                  to="/answer-sheets"
                  className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Answer Sheets
                </Link>

              </div>

            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-xl mt-5">

            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Platform Activity
                </h2>

                <p className="text-[10px] text-slate-400 mt-1">
                  Latest activity across EvalAI
                </p>
              </div>

              <span className="text-[10px] text-slate-400">
                Recent
              </span>

            </div>

            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  New teacher registered
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Teacher account activity
                </p>
              </div>

              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                User
              </span>

            </div>

            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Theory evaluation completed
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Evaluation processing activity
                </p>
              </div>

              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                Completed
              </span>

            </div>

            <div className="px-5 py-3 flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Answer sheets uploaded
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  New answer sheet activity
                </p>
              </div>

              <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md">
                Activity
              </span>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default AdminDashboard