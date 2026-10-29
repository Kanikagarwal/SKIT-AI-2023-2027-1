
import { Link } from "react-router-dom"

function StudentResult() {
  const questionResults = [
    {
      question: "Q1",
      title: "Explain the concept of binary search.",
      marks: "8 / 10",
      aiScore: "8.2 / 10",
      status: "Verified",
    },
    {
      question: "Q2",
      title: "Describe different types of linked lists.",
      marks: "7 / 10",
      aiScore: "7.4 / 10",
      status: "Verified",
    },
    {
      question: "Q3",
      title: "Explain time complexity of common sorting algorithms.",
      marks: "9 / 10",
      aiScore: "8.8 / 10",
      status: "Verified",
    },
    {
      question: "Q4",
      title: "Compare stack and queue data structures.",
      marks: "8 / 10",
      aiScore: "8.1 / 10",
      status: "Verified",
    },
    {
      question: "Q5",
      title: "Explain the applications of trees in computer science.",
      marks: "9 / 10",
      aiScore: "8.7 / 10",
      status: "Verified",
    },
  ]

  const scoreCards = [
    {
      label: "Final Score",
      value: "82%",
      color: "text-blue-400",
      icon: "01",
    },
    {
      label: "Marks Obtained",
      value: "41 / 50",
      color: "text-emerald-400",
      icon: "02",
    },
    {
      label: "AI Score",
      value: "82.4%",
      color: "text-indigo-400",
      icon: "03",
    },
    {
      label: "Evaluation Status",
      value: "Completed",
      color: "text-emerald-400",
      icon: "04",
    },
  ]

  return (
    <div className="min-h-screen bg-[#080D19] text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-20 h-16 bg-[#0B1220] border-b border-white/10 flex items-center justify-between px-5 sm:px-8">

        <div>
          <p className="text-[10px] font-semibold tracking-[2px] text-blue-400">
            EVALAI / STUDENT WORKSPACE
          </p>

          <h1 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Evaluation Result
          </h1>
        </div>

        <Link
          to="/student-evaluations"
          className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors"
        >
          ← My Evaluations
        </Link>

      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">

        {/* Page Introduction */}
        <div className="mb-6">
          <p className="text-xs text-slate-500">
            Academic Performance / Evaluation Details
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
            Your Evaluation Report
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Review your final marks, AI evaluation and teacher feedback.
          </p>
        </div>

        {/* Exam Information */}
        <div className="bg-[#111B2D] border border-white/10 rounded-xl p-5 sm:p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <p className="text-xs font-medium text-blue-400">
                DATA STRUCTURES
              </p>

              <h3 className="text-lg font-bold text-white mt-1">
                Data Structures - Mid Term
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                Evaluated on Sep 10, 2026
              </p>
            </div>

            <span className="w-fit text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 px-3 py-2 rounded-lg">
              ✓ Teacher Verified
            </span>

          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

            {scoreCards.map((item) => (
              <div
                key={item.label}
                className="bg-[#0B1220] border border-white/10 rounded-xl p-4 hover:bg-[#16243A] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {item.label}
                  </p>

                  <span className="text-[10px] text-slate-600 font-semibold">
                    {item.icon}
                  </span>
                </div>

                <p className={`text-xl sm:text-2xl font-bold mt-3 ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}

          </div>

        </div>

        {/* Question-wise Evaluation */}
        <div className="bg-[#111B2D] border border-white/10 rounded-xl overflow-hidden mb-6">

          <div className="px-5 py-5 border-b border-white/10">
            <h3 className="text-base font-bold text-white">
              Question-wise Evaluation
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Detailed scoring and AI evaluation for each answer.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">

            <table className="w-full table-fixed text-left">

              <thead className="bg-[#0B1220]">
                <tr className="text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="w-[9%] px-5 py-4">Question</th>
                  <th className="w-[39%] px-4 py-4">Question Details</th>
                  <th className="w-[15%] px-4 py-4">Final Marks</th>
                  <th className="w-[17%] px-4 py-4">AI Score</th>
                  <th className="w-[20%] px-4 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {questionResults.map((result) => (
                  <tr
                    key={result.question}
                    className="border-t border-white/5 hover:bg-[#16243A] transition-colors"
                  >
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold">
                        {result.question}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <p className="text-sm font-medium text-slate-200 break-words">
                        {result.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        AI semantic evaluation completed
                      </p>
                    </td>

                    <td className="px-4 py-5">
                      <span className="text-sm font-bold text-white">
                        {result.marks}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <span className="text-sm font-semibold text-indigo-300">
                        {result.aiScore}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 px-2.5 py-1.5 rounded-md">
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

          {/* Mobile and Tablet Cards */}
          <div className="lg:hidden divide-y divide-white/5">

            {questionResults.map((result) => (
              <div key={result.question} className="p-4 sm:p-5">

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-start gap-3 min-w-0">
                    <span className="shrink-0 w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">
                      {result.question}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 leading-5">
                        {result.title}
                      </p>

                      <p className="text-[10px] text-slate-500 mt-1">
                        AI semantic evaluation completed
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 px-2 py-1 rounded-md">
                    {result.status}
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 ml-12">

                  <div className="bg-[#0B1220] border border-white/5 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500">
                      Final Marks
                    </p>
                    <p className="text-sm font-bold text-white mt-1">
                      {result.marks}
                    </p>
                  </div>

                  <div className="bg-[#0B1220] border border-white/5 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500">
                      AI Suggested Score
                    </p>
                    <p className="text-sm font-bold text-indigo-300 mt-1">
                      {result.aiScore}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>

          <div className="px-5 py-3 border-t border-white/10 bg-[#0B1220]">
            <p className="text-[10px] text-slate-500">
              Showing {questionResults.length} evaluated questions
            </p>
          </div>

        </div>

        {/* Evaluation Feedback */}
        <div className="bg-[#111B2D] border border-white/10 rounded-xl p-5 sm:p-6">

          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              ✦
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Evaluation Feedback
              </h3>

              <p className="text-[10px] text-slate-500 mt-0.5">
                Overall performance and improvement insights
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-6">
            Your answers demonstrate a good understanding of the core
            concepts. The evaluation shows strong performance in explaining
            concepts and applying them to technical questions.
          </p>

          {/* AI Insight */}
          <div className="mt-5 bg-blue-500/5 border border-blue-400/20 rounded-xl p-4">

            <div className="flex items-center gap-2">
              <span className="text-blue-400">✦</span>

              <p className="text-xs font-bold text-blue-300">
                AI Evaluation Insight
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-5 mt-2">
              Your answers showed good semantic relevance, concept coverage,
              and structured explanations across the evaluated questions.
            </p>

          </div>

        </div>

        {/* Footer */}
        <footer className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-[10px] text-slate-500">
            © 2026 EvalAI. AI-Based Theory Examination Evaluation System.
          </p>

          <Link
            to="/student-dashboard"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Back to Dashboard →
          </Link>

        </footer>

      </main>

    </div>
  )
}

export default StudentResult
