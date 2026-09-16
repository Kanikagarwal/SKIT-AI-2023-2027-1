import { Link } from "react-router-dom"

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-7">

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Student Dashboard
          </h1>

          <p className="text-[11px] text-slate-400">
            Track your theory evaluations and academic performance
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="text-right">
            <p className="text-xs font-semibold text-slate-700">
              Anshu Dhattarwal
            </p>

            <p className="text-[10px] text-slate-400">
              Student
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
            A
          </div>

        </div>

      </header>

      <main className="p-7">

        <div className="grid grid-cols-4 gap-4 mb-5">

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
              Completed
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              9
            </p>

            <p className="text-[10px] text-emerald-600 mt-1">
              75% completed
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
              Across evaluations
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Pending
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              3
            </p>

            <p className="text-[10px] text-amber-600 mt-1">
              Awaiting evaluation
            </p>
          </div>

        </div>

        <div className="grid grid-cols-3 gap-5">

          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Evaluations
                </h2>

                <p className="text-[10px] text-slate-400 mt-1">
                  Your latest theory evaluation results
                </p>
              </div>

              <Link
                to="/student-evaluations"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>

            </div>

            <div className="space-y-3">

              <div className="border border-slate-100 rounded-lg px-4 py-3 flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Data Structures - Mid Term
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Sep 10, 2026
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-sm font-bold text-slate-800">
                    82%
                  </p>

                  <span className="text-[10px] font-semibold text-emerald-600">
                    Evaluated
                  </span>

                </div>

              </div>

              <div className="border border-slate-100 rounded-lg px-4 py-3 flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Operating Systems - Unit Test
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Sep 9, 2026
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-sm font-bold text-slate-800">
                    78%
                  </p>

                  <span className="text-[10px] font-semibold text-emerald-600">
                    Evaluated
                  </span>

                </div>

              </div>

              <div className="border border-slate-100 rounded-lg px-4 py-3 flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Computer Networks - Assignment
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Sep 7, 2026
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-sm font-bold text-slate-800">
                    85%
                  </p>

                  <span className="text-[10px] font-semibold text-emerald-600">
                    Evaluated
                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">

            <h2 className="text-sm font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="text-[10px] text-slate-400 mt-1 mb-4">
              Access your student activities
            </p>

            <div className="space-y-2">

              <Link
                to="/student-evaluations"
                className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                View My Evaluations
              </Link>

              <Link
                to="/student-answer-sheets"
                className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Answer Sheets
              </Link>

              <Link
                to="/student-profile"
                className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Profile
              </Link>

            </div>

          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl mt-5 p-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Performance Overview
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                Your current academic evaluation performance
              </p>
            </div>

            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md">
              Average: 82%
            </span>

          </div>

          <div className="mt-5">

            <div className="flex items-center justify-between mb-1">

              <span className="text-xs text-slate-600">
                Overall Performance
              </span>

              <span className="text-xs font-semibold text-slate-700">
                82%
              </span>

            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[82%] rounded-full"></div>
            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default StudentDashboard