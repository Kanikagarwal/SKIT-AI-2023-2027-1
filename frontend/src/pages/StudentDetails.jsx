import { Link, useParams } from "react-router-dom"

function StudentDetails() {
  const { email } = useParams()

  const students = [
    {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      className: "B.Tech CSE - 3A",
      evaluations: 8,
      score: "82%",
    },
    {
      name: "Priya Verma",
      email: "priya.verma@example.com",
      className: "B.Tech CSE - 3A",
      evaluations: 7,
      score: "76%",
    },
    {
      name: "Rohan Gupta",
      email: "rohan.gupta@example.com",
      className: "B.Tech CSE - 3B",
      evaluations: 6,
      score: "79%",
    },
    {
      name: "Neha Singh",
      email: "neha.singh@example.com",
      className: "B.Tech CSE - 3A",
      evaluations: 9,
      score: "88%",
    },
    {
      name: "Karan Mehta",
      email: "karan.mehta@example.com",
      className: "B.Tech CSE - 3B",
      evaluations: 5,
      score: "71%",
    },
    {
      name: "Simran Joshi",
      email: "simran.joshi@example.com",
      className: "B.Tech CSE - 3B",
      evaluations: 8,
      score: "84%",
    },
  ]

  const student = students.find(
    (item) => item.email === decodeURIComponent(email || "")
  )

  const evaluations = [
    {
      subject: "Data Structures",
      title: "Mid Term",
      date: "Sep 10, 2026",
      score: student?.score || "82%",
      status: "Evaluated",
    },
    {
      subject: "Operating Systems",
      title: "Unit Test",
      date: "Sep 9, 2026",
      score: "78%",
      status: "Evaluated",
    },
    {
      subject: "Computer Networks",
      title: "Assignment",
      date: "Sep 7, 2026",
      score: "85%",
      status: "Evaluated",
    },
    {
      subject: "Database Management",
      title: "Internal Assessment",
      date: "Sep 5, 2026",
      score: "81%",
      status: "Evaluated",
    },
  ]

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">
            Student not found
          </h1>

          <Link
            to="/students"
            className="inline-block mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Students
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-7">

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Student Details
          </h1>

          <p className="text-[11px] text-slate-400">
            View student performance and evaluation history
          </p>
        </div>

        <Link
          to="/students"
          className="text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          ← Back to Students
        </Link>

      </header>

      <main className="p-7">

        <div className="max-w-6xl mx-auto">

          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                {student.name.charAt(0)}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {student.name}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {student.email}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {student.className}
                </p>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-4 gap-4 mb-5">

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500">
                Total Evaluations
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {student.evaluations}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500">
                Average Score
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {student.score}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500">
                Recent Score
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {evaluations[0].score}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-500">
                Current Status
              </p>

              <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1 rounded-md mt-3">
                Active
              </p>
            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-200">

              <h3 className="text-sm font-bold text-slate-900">
                Evaluation History
              </h3>

              <p className="text-[10px] text-slate-400 mt-1">
                Recent evaluated answer sheets and performance
              </p>

            </div>

            <div className="divide-y divide-slate-100">

              {evaluations.map((evaluation, index) => (

                <div
                  key={index}
                  className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                >

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {evaluation.subject} - {evaluation.title}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      Evaluated on {evaluation.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-5">

                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {evaluation.status}
                    </span>

                    <span className="text-sm font-bold text-slate-800 w-12 text-right">
                      {evaluation.score}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default StudentDetails