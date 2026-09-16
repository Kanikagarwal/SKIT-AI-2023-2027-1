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
    <div className="min-h-screen bg-slate-50">

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-7">

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Answer Sheets
          </h1>

          <p className="text-[11px] text-slate-400">
            Upload and manage student answer sheets
          </p>
        </div>

        <Link
          to="/evaluations"
          className="text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          ← Back to Evaluations
        </Link>

      </header>

      <main className="p-7">

        <div className="max-w-4xl mx-auto">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Upload Answer Sheets
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Upload handwritten answer sheets for AI-powered evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Selected Files
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {files.length}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Processing
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {uploaded ? files.length : 0}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Evaluated
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                0
              </p>
            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-blue-400 transition">

              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-bold">
                ↑
              </div>

              <h3 className="text-sm font-bold text-slate-800 mt-4">
                Upload student answer sheets
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Select one or multiple PDF or image files
              </p>

              <label className="inline-block mt-5">

                <span className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition">
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

              <p className="text-[10px] text-slate-400 mt-4">
                Supported formats: PDF, JPG, JPEG, PNG
              </p>

            </div>

            {files.length > 0 && (
              <div className="mt-6">

                <div className="flex items-center justify-between mb-3">

                  <h3 className="text-sm font-bold text-slate-800">
                    Selected Answer Sheets
                  </h3>

                  <span className="text-xs text-slate-400">
                    {files.length} file{files.length !== 1 ? "s" : ""}
                  </span>

                </div>

                <div className="space-y-2">

                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
                          {file.type.includes("pdf") ? "PDF" : "IMG"}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {file.name}
                          </p>

                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                          uploaded
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {uploaded ? "Uploaded" : "Ready"}
                      </span>

                    </div>
                  ))}

                </div>

                {!uploaded && (
                  <div className="flex justify-end mt-5">

                    <button
                      type="button"
                      onClick={handleUpload}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                    >
                      Upload Answer Sheets
                    </button>

                  </div>
                )}

                {uploaded && (
                  <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">

                    <p className="text-xs font-semibold text-emerald-700">
                      Answer sheets uploaded successfully
                    </p>

                    <p className="text-[11px] text-emerald-600 mt-1">
                      Your files are ready for the AI evaluation pipeline.
                    </p>

                  </div>
                )}

              </div>
            )}

          </div>

          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">

            <p className="text-xs font-semibold text-blue-800">
              AI Evaluation Pipeline
            </p>

            <p className="text-[11px] text-blue-600 mt-1">
              Upload → OCR Extraction → Answer Analysis → Semantic Similarity → Rubric Scoring → Teacher Review
            </p>

          </div>

        </div>

      </main>

    </div>
  )
}

export default AnswerSheets