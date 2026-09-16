import { useState } from "react"
import { Link } from "react-router-dom"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleReset = (e) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address.")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    setError("")
    alert("Password reset link sent.")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-2">
      <div className="w-full max-w-md">

        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white text-base font-bold mb-1">
            E
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Forgot your password?
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <form onSubmit={handleReset} className="space-y-3">

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {error && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition"
            >
              Send reset link
            </button>

          </form>

          <div className="border-t border-slate-200 mt-3 pt-3">
            <p className="text-center text-xs text-slate-500">
              Remember your password?{" "}
              <Link
                to="/"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-1.5">
          AI-powered theory answer evaluation
        </p>

      </div>
    </div>
  )
}

export default ForgotPassword