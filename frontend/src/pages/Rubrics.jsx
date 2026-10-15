import { useState } from "react"
import { Link } from "react-router-dom"

function Rubrics() {
  const defaultRubrics = [
    {
      id: 1,
      name: "Standard Evaluation",
      description: "General theory answer evaluation rubric",
      criteria: 4,
      totalMarks: 100,
    },
    {
      id: 2,
      name: "Technical Answer Evaluation",
      description: "Focused on technical accuracy and concepts",
      criteria: 4,
      totalMarks: 100,
    },
  ]

  const savedRubrics =
    JSON.parse(localStorage.getItem("rubrics")) || []

  const [rubrics, setRubrics] = useState([
    ...savedRubrics,
    ...defaultRubrics,
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingRubric, setEditingRubric] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [totalMarks, setTotalMarks] = useState("")
  const [error, setError] = useState("")

  const openCreateForm = () => {
    setEditingRubric(null)
    setName("")
    setDescription("")
    setTotalMarks("")
    setError("")
    setShowForm(true)
  }

  const openEditForm = (rubric) => {
    setEditingRubric(rubric)
    setName(rubric.name)
    setDescription(rubric.description)
    setTotalMarks(rubric.totalMarks)
    setError("")
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingRubric(null)
    setName("")
    setDescription("")
    setTotalMarks("")
    setError("")
  }

  const handleSaveRubric = (e) => {
    e.preventDefault()

    if (!name.trim() || !description.trim() || !totalMarks) {
      setError("Please fill in all fields.")
      return
    }

    if (Number(totalMarks) <= 0) {
      setError("Total marks must be greater than 0.")
      return
    }

    if (editingRubric) {
      const updatedRubrics = rubrics.map((rubric) =>
        rubric.id === editingRubric.id
          ? {
              ...rubric,
              name,
              description,
              totalMarks: Number(totalMarks),
            }
          : rubric
      )

      const customRubrics = updatedRubrics.filter(
        (rubric) =>
          !defaultRubrics.some(
            (item) => item.id === rubric.id
          )
      )

      localStorage.setItem(
        "rubrics",
        JSON.stringify(customRubrics)
      )

      setRubrics(updatedRubrics)
    } else {
      const newRubric = {
        id: Date.now(),
        name,
        description,
        criteria: 0,
        totalMarks: Number(totalMarks),
      }

      const existingRubrics =
        JSON.parse(localStorage.getItem("rubrics")) || []

      localStorage.setItem(
        "rubrics",
        JSON.stringify([newRubric, ...existingRubrics])
      )

      setRubrics([newRubric, ...rubrics])
    }

    closeForm()
  }

  const inputStyle =
    "w-full bg-[#0B1220] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"

  const labelStyle =
    "block text-xs font-medium text-slate-300 mb-1.5"

  return (
    <div className="min-h-screen bg-[#080D19] text-white">

      <header className="h-14 bg-[#0B1220] border-b border-white/10 flex items-center justify-between px-7">
        <div>
          <h1 className="text-lg font-bold text-white">Rubrics</h1>
          <p className="text-[11px] text-slate-400">
            Create and manage evaluation scoring criteria
          </p>
        </div>

        <button
          onClick={openCreateForm}
          style={{ backgroundColor: "#3B82F6" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563EB")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#3B82F6")
          }
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
        >
          + New Rubric
        </button>
      </header>

      <main className="p-7">
        <div className="max-w-5xl mx-auto">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Evaluation Rubrics
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Define how AI evaluates and scores student answers.
            </p>
          </div>

          {showForm && (
            <div className="bg-[#111B2D] border border-white/10 rounded-2xl shadow-lg p-6 mb-6">

              <div className="mb-5">
                <h3 className="text-sm font-bold text-white">
                  {editingRubric ? "Edit Rubric" : "Create New Rubric"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Set the basic scoring structure for an evaluation.
                </p>
              </div>

              <form onSubmit={handleSaveRubric} className="space-y-4">

                <div>
                  <label className={labelStyle}>Rubric Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setError("")
                    }}
                    placeholder="e.g. B.Tech Theory Evaluation"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      setError("")
                    }}
                    placeholder="Describe how this rubric will be used."
                    rows="3"
                    className={`${inputStyle} resize-none`}
                  />
                </div>

                <div className="max-w-xs">
                  <label className={labelStyle}>Total Marks</label>
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

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2.5 rounded-lg border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={{ backgroundColor: "#3B82F6" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2563EB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#3B82F6")
                    }
                    className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition"
                  >
                    {editingRubric ? "Update Rubric" : "Save Rubric"}
                  </button>
                </div>

              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rubrics.map((rubric, index) => (
              <div
                key={`${rubric.id}-${index}`}
                className="bg-[#111B2D] border border-white/10 rounded-xl p-5 hover:border-blue-500/30 hover:bg-[#16243A] transition"
              >

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {rubric.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-5">
                      {rubric.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-md">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-6 mt-5 pt-4 border-t border-white/10">

                  <div>
                    <p className="text-[10px] text-slate-500">Criteria</p>
                    <p className="text-sm font-bold text-slate-200 mt-1">
                      {rubric.criteria}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500">Total Marks</p>
                    <p className="text-sm font-bold text-slate-200 mt-1">
                      {rubric.totalMarks}
                    </p>
                  </div>

                  <button
                    onClick={() => openEditForm(rubric)}
                    className="ml-auto text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                  >
                    Edit
                  </button>

                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              to="/evaluations"
              className="text-xs font-semibold text-slate-400 hover:text-blue-400 transition"
            >
              ← Back to Evaluations
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Rubrics