import { useState } from "react"
import { Link } from "react-router-dom"

function TeacherDashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard")

const menuItems = [
  { name: "Dashboard", path: "/teacher-dashboard" },
  { name: "Evaluations", path: "/evaluations" },
  { name: "Answer Sheets", path: "/answer-sheets" },
  { name: "Rubrics", path: "/rubrics" },
  { name: "Students", path: "#" },
]

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">

      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col">

        <div className="h-16 px-5 flex items-center border-b border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            E
          </div>

          <div className="ml-3">
            <p className="text-sm font-bold text-slate-900">
              EvalAI
            </p>

            <p className="text-[10px] text-slate-400">
              Teacher Portal
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5">

          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Workspace
          </p>

          <div className="space-y-1">

            {menuItems.map((item) =>
              item.path === "#" ? (
                <button
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                    activeItem === item.name
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setActiveItem(item.name)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                    activeItem === item.name
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}

          </div>

        </nav>

        <div className="px-3 py-4 border-t border-slate-200">

          <Link
            to="/"
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Sign out
          </Link>

        </div>

      </aside>

      <main className="flex-1 overflow-hidden">

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-7">

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Teacher Dashboard
            </h1>

            <p className="text-[11px] text-slate-400">
              Overview of your theory evaluation activities
            </p>
          </div>

          <Link
            to="/new-evaluation"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            + New Evaluation
          </Link>

        </header>

        <div className="p-7">

          <div className="grid grid-cols-4 gap-4 mb-5">

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Total Evaluations
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                128
              </p>

              <p className="text-[10px] text-emerald-600 mt-1">
                +12% this month
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Answer Sheets
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                486
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Uploaded this semester
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Completed
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                100
              </p>

              <p className="text-[10px] text-emerald-600 mt-1">
                78% completion rate
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Pending Review
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                14
              </p>

              <p className="text-[10px] text-amber-600 mt-1">
                Needs attention
              </p>
            </div>

          </div>

          <div className="grid grid-cols-3 gap-5">

            <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Evaluation Overview
                  </h2>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Current evaluation progress
                  </p>
                </div>

                <Link
                  to="/evaluations"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>

              </div>

              <div className="space-y-4">

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      Completed
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      78%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[78%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      In Review
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      11%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[11%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      Pending
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
                Frequently used actions
              </p>

              <div className="space-y-2">

                <Link
                  to="/new-evaluation"
                  className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  + Create Evaluation
                </Link>

                <Link
                  to="/answer-sheets"
                  className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ↑ Upload Answer Sheets
                </Link>

                <Link
                  to="/evaluations"
                  className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Evaluations
                </Link>

              </div>

            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-xl mt-5">

            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Evaluations
                </h2>

                <p className="text-[10px] text-slate-400 mt-1">
                  Latest evaluation activity
                </p>
              </div>

              <Link
                to="/evaluations"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>

            </div>

            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Data Structures - Mid Term
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  42 students
                </p>
              </div>

              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                Completed
              </span>

            </div>

            <div className="px-5 py-3 flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Operating Systems - Unit Test
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  36 students
                </p>
              </div>

              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                In Review
              </span>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default TeacherDashboard