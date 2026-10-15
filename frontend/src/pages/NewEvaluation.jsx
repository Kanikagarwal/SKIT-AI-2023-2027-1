import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function NewEvaluation() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [className, setClassName] = useState("")
  const [totalMarks, setTotalMarks] = useState("")
  const [rubric, setRubric] = useState("")
  const [questionPaper, setQuestionPaper] = useState(null)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title || !subject || !className || !totalMarks || !rubric) {
      setError("Please fill in all required fields.")
      return
    }

    if (Number(totalMarks) <= 0) {
      setError("Total marks must be greater than 0.")
      return
    }

    const newEvaluation = {
      title,
      subject,
      className,
      totalMarks: Number(totalMarks),
      rubric,
      questionPaperName: questionPaper?.name || "",
      students: 0,
      status: "Pending",
      score: "—",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }

    const existingEvaluations =
      JSON.parse(localStorage.getItem("evaluations")) || []

    localStorage.setItem(
      "evaluations",
      JSON.stringify([newEvaluation, ...existingEvaluations])
    )

    navigate("/evaluations")
  }

  const inputStyle =
    "w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/10"

  const labelStyle =
    "mb-2 block text-sm font-semibold text-slate-300"

  return (
    <div className="min-h-screen bg-[#080D19] px-5 py-7 text-slate-100 sm:px-8 sm:py-9">

      <div className="mx-auto max-w-3xl">

        {/* Page Header */}
        <div className="mb-7">

          <Link
            to="/evaluations"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            ← Back to Evaluations
          </Link>

          <p className="mt-6 text-xs font-semibold tracking-[2px] text-blue-400">
            EVALAI / WORKSPACE
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Create New Evaluation
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Set up an evaluation for AI-based answer sheet assessment.
          </p>

        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111B2D] shadow-xl shadow-black/10">

          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <h2 className="text-base font-bold text-white">
              Examination Details
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Enter the required information to create an evaluation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">

            {/* Evaluation Title */}
            <div>
              <label className={labelStyle}>
                Evaluation Title <span className="text-blue-400">*</span>
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setError("")
                }}
                placeholder="e.g. Data Structures - Mid Term"
                className={inputStyle}
              />
            </div>

            {/* Subject and Class */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label className={labelStyle}>
                  Subject <span className="text-blue-400">*</span>
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value)
                    setError("")
                  }}
                  placeholder="e.g. Data Structures"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Class / Section <span className="text-blue-400">*</span>
                </label>

                <input
                  type="text"
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value)
                    setError("")
                  }}
                  placeholder="e.g. B.Tech CSE - 3A"
                  className={inputStyle}
                />
              </div>

            </div>

            {/* Marks and Rubric */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label className={labelStyle}>
                  Total Marks <span className="text-blue-400">*</span>
                </label>

                <input
                  type="number"
                  min="1"
                  value={totalMarks}
                  onChange={(e) => {
                    setTotalMarks(e.target.value)
                    setError("")
                  }}
                  placeholder="e.g. 100"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Evaluation Rubric <span className="text-blue-400">*</span>
                </label>

                <select
                  value={rubric}
                  onChange={(e) => {
                    setRubric(e.target.value)
                    setError("")
                  }}
                  className={inputStyle}
                >
                  <option value="">Select rubric</option>
                  <option value="standard">Standard Evaluation</option>
                  <option value="technical">Technical Answer Evaluation</option>
                  <option value="custom">Custom Rubric</option>
                </select>
              </div>

            </div>

            {/* Question Paper Upload */}
            <div>
              <label className={labelStyle}>
                Question Paper
              </label>

              <div className="rounded-xl border-2 border-dashed border-white/15 bg-[#0B1220] p-6 text-center transition hover:border-blue-400/50">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-6 w-6"
                  >
                    <path d="M12 16V4m0 0L7 9m5-5 5 5M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" />
                  </svg>
                </div>

                <p className="mt-3 text-sm font-semibold text-white">
                  Upload Question Paper
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  PDF, JPG or PNG formats supported
                </p>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setQuestionPaper(e.target.files[0] || null)
                  }
                  className="mt-4 block w-full cursor-pointer text-xs text-slate-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-500/15 file:px-4 file:py-2 file:font-semibold file:text-blue-300 hover:file:bg-blue-500/25"
                />

                {questionPaper && (
                  <p className="mt-3 break-all text-xs font-medium text-emerald-300">
                    ✓ Selected: {questionPaper.name}
                  </p>
                )}

              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-6 sm:flex-row">

              <Link
                to="/evaluations"
                className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                style={{ backgroundColor: "#3B82F6" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563EB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3B82F6")
                }
                className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5"
              >
                Create Evaluation →
              </button>

            </div>

          </form>
        </div>

        <footer className="mt-6 pb-3 text-center text-xs text-slate-500">
          EvalAI · AI Based Theory Answer Sheet Evaluation
        </footer>

      </div>
    </div>
  )
}

export default NewEvaluation