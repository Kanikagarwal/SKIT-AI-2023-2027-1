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

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-7">

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Evaluation Result
          </h1>

          <p className="text-[11px] text-slate-400">
            Data Structures - Mid Term
          </p>
        </div>

        <Link
          to="/student-evaluations"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          ← My Evaluations
        </Link>

      </header>

      <main className="p-7">

        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-slate-500">
                Data Structures - Mid Term
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Evaluated on Sep 10, 2026
              </p>
            </div>

            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
              Teacher Verified
            </span>

          </div>

          <div className="grid grid-cols-4 gap-4 mt-5">

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-[10px] text-slate-500">
                Final Score
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                82%
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-[10px] text-slate-500">
                Marks Obtained
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                41 / 50
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-[10px] text-slate-500">
                AI Score
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                82.4%
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-[10px] text-slate-500">
                Evaluation Status
              </p>

              <p className="text-sm font-bold text-emerald-600 mt-2">
                Completed
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-200">

            <h2 className="text-sm font-bold text-slate-900">
              Question-wise Evaluation
            </h2>

            <p className="text-[10px] text-slate-400 mt-1">
              Detailed scoring and AI evaluation for each answer
            </p>

          </div>

          {questionResults.map((result) => (
            <div
              key={result.question}
              className="px-5 py-4 border-b border-slate-100 last:border-b-0"
            >

              <div className="flex items-start justify-between">

                <div className="flex gap-3">

                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {result.question}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {result.title}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      AI semantic evaluation completed
                    </p>
                  </div>

                </div>

                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                  {result.status}
                </span>

              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 ml-11">

                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-slate-400">
                    Final Marks
                  </p>

                  <p className="text-xs font-bold text-slate-700 mt-1">
                    {result.marks}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-slate-400">
                    AI Suggested Score
                  </p>

                  <p className="text-xs font-bold text-slate-700 mt-1">
                    {result.aiScore}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 mt-5">

          <h2 className="text-sm font-bold text-slate-900">
            Evaluation Feedback
          </h2>

          <p className="text-xs text-slate-600 mt-3 leading-5">
            Your answers demonstrate a good understanding of the core
            concepts. The evaluation shows strong performance in explaining
            concepts and applying them to technical questions.
          </p>

          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">

            <p className="text-[10px] font-semibold text-blue-700">
              AI Evaluation Insight
            </p>

            <p className="text-[11px] text-blue-600 mt-1">
              Your answers showed good semantic relevance, concept coverage,
              and structured explanations across the evaluated questions.
            </p>

          </div>

        </div>

      </main>

    </div>
  )
}

export default StudentResult