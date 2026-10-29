import { useState } from "react"
import { Link } from "react-router-dom"

function AnswerSheets() {
  const [files, setFiles] = useState([])
  const [uploaded, setUploaded] = useState(false)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])

    setFiles(selectedFiles)
    setUploaded(false)
  }

  const handleUpload = () => {
    if (files.length === 0) {
      return
    }

    setUploaded(true)
  }

  return (
    <div className="min-h-screen bg-[#080D19] text-white">

      {/* Header */}
      <header className="h-14 bg-[#0B1220] border-b border-white/10 flex items-center justify-between px-7">

        <div>
          <h1 className="text-lg font-bold text-white">
            Answer Sheets
          </h1>

          <p className="text-[11px] text-slate-400">
            Upload and manage student answer sheets
          </p>
        </div>

        <Link
          to="/evaluations"
          className="text-sm font-medium text-slate-400 hover:text-blue-400 transition"
        >
          ← Back to Evaluations
        </Link>

      </header>

      {/* Main Content */}
      <main className="p-7">

        <div className="max-w-4xl mx-auto">

          {/* Page Intro */}
          <div className="mb-6">

            <h2 className="text-xl font-bold text-white">
              Upload Answer Sheets
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Upload handwritten answer sheets for AI-powered evaluation.
            </p>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            {/* Selected Files */}
            <div className="bg-[#111B2D] border border-white/10 rounded-xl p-4">
              <p className="text-xs text-slate-400">
                Selected Files
              </p>

              <p className="text-2xl font-bold text-white mt-2">
                {files.length}
              </p>
            </div>

            {/* Processing */}
            <div className="bg-[#111B2D] border border-white/10 rounded-xl p-4">
              <p className="text-xs text-slate-400">
                Processing
              </p>

              <p className="text-2xl font-bold text-white mt-2">
                {uploaded ? files.length : 0}
              </p>
            </div>

            {/* Evaluated */}
            <div className="bg-[#111B2D] border border-white/10 rounded-xl p-4">
              <p className="text-xs text-slate-400">
                Evaluated
              </p>

              <p className="text-2xl font-bold text-white mt-2">
                0
              </p>
            </div>

          </div>

          {/* Upload Card */}
          <div className="bg-[#111B2D] border border-white/10 rounded-2xl shadow-lg shadow-black/10 p-6">

            {/* Upload Area */}
            <div className="border-2 border-dashed border-white/15 rounded-xl p-10 text-center hover:border-blue-500/50 hover:bg-blue-500/[0.02] transition">

              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl font-bold">
                ↑
              </div>

              <h3 className="text-sm font-bold text-slate-200 mt-4">
                Upload student answer sheets
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Select one or multiple PDF or image files
              </p>

              <label className="inline-block mt-5">

                <span
                  style={{ backgroundColor: "#3B82F6" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2563EB")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3B82F6")
                  }
                  className="inline-block cursor-pointer text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Choose Files
                </span>

                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>

              <p className="text-[10px] text-slate-500 mt-4">
                Supported formats: PDF, JPG, JPEG, PNG
              </p>

            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-6">

                <div className="flex items-center justify-between mb-3">

                  <h3 className="text-sm font-bold text-slate-200">
                    Selected Answer Sheets
                  </h3>

                  <span className="text-xs text-slate-500">
                    {files.length} file{files.length !== 1 ? "s" : ""}
                  </span>

                </div>

                <div className="space-y-2">

                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 hover:bg-[#16243A] transition"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-[9px] font-bold text-blue-400">
                          {file.type.includes("pdf") ? "PDF" : "IMG"}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-200">
                            {file.name}
                          </p>

                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                          uploaded
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-white/5 text-slate-400 border border-white/10"
                        }`}
                      >
                        {uploaded ? "Uploaded" : "Ready"}
                      </span>

                    </div>
                  ))}

                </div>

                {/* Upload Button */}
                {!uploaded && (
                  <div className="flex justify-end mt-5">

                    <button
                      type="button"
                      onClick={handleUpload}
                      style={{ backgroundColor: "#3B82F6" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2563EB")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#3B82F6")
                      }
                      className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition hover:-translate-y-0.5 shadow-lg shadow-blue-950/30"
                    >
                      Upload Answer Sheets
                    </button>

                  </div>
                )}

                {/* Success Message */}
                {uploaded && (
                  <div className="mt-5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">

                    <p className="text-xs font-semibold text-emerald-400">
                      Answer sheets uploaded successfully
                    </p>

                    <p className="text-[11px] text-emerald-500/80 mt-1">
                      Your files are ready for the AI evaluation pipeline.
                    </p>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* AI Pipeline */}
          <div className="mt-5 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">

            <p className="text-xs font-semibold text-blue-300">
              AI Evaluation Pipeline
            </p>

            <p className="text-[11px] text-blue-400/80 mt-1">
              Upload → OCR Extraction → Answer Analysis → Semantic Similarity → Rubric Scoring → Teacher Review
            </p>

          </div>

        </div>

      </main>

    </div>
  )
}

export default AnswerSheets