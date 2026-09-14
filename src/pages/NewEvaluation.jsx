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

    if (totalMarks <= 0) {
      setError("Total marks must be greater than 0.")
      return
    }

    const newEvaluation = {
      title,
      subject,
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

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">

          <Link
            to="/evaluations"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to Evaluations
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mt-3">
            Create New Evaluation
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Set up an evaluation for AI-based answer sheet assessment.
          </p>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Evaluation Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setError("")
                }}
                placeholder="e.g. Data Structures - Mid Term"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subject *
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value)
                    setError("")
                  }}
                  placeholder="e.g. Data Structures"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Class / Section *
                </label>

                <input
                  type="text"
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value)
                    setError("")
                  }}
                  placeholder="e.g. B.Tech CSE - 3A"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Total Marks *
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
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Evaluation Rubric *
                </label>

                <select
                  value={rubric}
                  onChange={(e) => {
                    setRubric(e.target.value)
                    setError("")
                  }}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select rubric</option>
                  <option value="standard">Standard Evaluation</option>
                  <option value="technical">Technical Answer Evaluation</option>
                  <option value="custom">Custom Rubric</option>
                </select>
              </div>

            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Question Paper
              </label>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition">

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setQuestionPaper(e.target.files[0])}
                  className="w-full text-sm text-slate-500"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Upload PDF, JPG or PNG
                </p>

                {questionPaper && (
                  <p className="text-xs text-blue-600 mt-2">
                    Selected: {questionPaper.name}
                  </p>
                )}

              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">

              <Link
                to="/evaluations"
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
              >
                Create Evaluation
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default NewEvaluation