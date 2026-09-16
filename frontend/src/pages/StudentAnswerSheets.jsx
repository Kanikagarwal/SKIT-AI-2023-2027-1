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

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-7">

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            My Answer Sheets
          </h1>

          <p className="text-[11px] text-slate-400">
            View your submitted theory answer sheets and evaluation status
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Dashboard
        </Link>

      </header>

      <main className="p-7">

        <div className="grid grid-cols-3 gap-4 mb-5">

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Total Answer Sheets
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              12
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              Submitted this semester
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Evaluated
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              9
            </p>

            <p className="text-[10px] text-emerald-600 mt-1">
              Results available
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Under Evaluation
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              3
            </p>

            <p className="text-[10px] text-amber-600 mt-1">
              Processing in progress
            </p>
          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-200">

            <h2 className="text-sm font-bold text-slate-900">
              Submitted Answer Sheets
            </h2>

            <p className="text-[10px] text-slate-400 mt-1">
              Your answer sheet submission and evaluation history
            </p>

          </div>

          <div className="px-5 py-3 grid grid-cols-[2.2fr_1.2fr_1fr_0.8fr_1fr_0.7fr] gap-4 border-b border-slate-100 bg-slate-50">

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Evaluation
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Subject
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Submitted
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Pages
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Status
            </p>

            <p className="text-[10px] font-semibold text-slate-400 uppercase">
              Score
            </p>

          </div>

          {answerSheets.map((sheet) => (
            <div
              key={sheet.title}
              className="px-5 py-4 grid grid-cols-[2.2fr_1.2fr_1fr_0.8fr_1fr_0.7fr] gap-4 items-center border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
            >

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  {sheet.title}
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Theory answer sheet
                </p>
              </div>

              <p className="text-xs text-slate-600">
                {sheet.subject}
              </p>

              <p className="text-xs text-slate-600">
                {sheet.submitted}
              </p>

              <p className="text-xs font-semibold text-slate-700">
                {sheet.pages}
              </p>

              <span
                className={`w-fit text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                  sheet.status === "Evaluated"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {sheet.status}
              </span>

              <p className="text-sm font-bold text-slate-800">
                {sheet.score}
              </p>

            </div>
          ))}

        </div>

      </main>

    </div>
  )
}

export default StudentAnswerSheets