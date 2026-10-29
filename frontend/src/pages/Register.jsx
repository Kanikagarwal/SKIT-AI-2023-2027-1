
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleRegister = (e) => {
    e.preventDefault()

    if (!name.trim() || !email || !role || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setError("")
    navigate("/")
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">

        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700 text-3xl font-extrabold text-white shadow-lg shadow-blue-600/30">
            E
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            EvalAI
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Create your account
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Get started with intelligent answer evaluation.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/30 sm:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Join EvalAI
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter your details to continue.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError("")
                }}
                placeholder="Enter your full name"
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
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
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Account type
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  setError("")
                }}
                className={`${inputClass} ${role ? "" : "text-slate-500"}`}
              >
                <option value="">Select your role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Create account →
            </button>

          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-500">
              Already registered?
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          AI-powered theory answer evaluation
        </p>

      </div>
    </div>
  )
}

export default Register
