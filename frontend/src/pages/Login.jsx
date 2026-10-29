import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password || !role) {
      setError("Please fill in all fields.")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const data = await login(email, password)
      const backendRole = data.user.role.toLowerCase()

      if (backendRole !== role) {
        setError(
          `You selected ${role}, but this account is registered as ${backendRole}.`
        )
        return
      }

      if (backendRole === "admin") {
        navigate("/admin-dashboard")
      } else if (backendRole === "teacher") {
        navigate("/teacher-dashboard")
      } else if (backendRole === "student") {
        navigate("/student-dashboard")
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Invalid email or password."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700 text-3xl font-extrabold text-white shadow-lg shadow-blue-600/30">
            E
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            EvalAI
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Sign in to continue to your dashboard.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/30 sm:p-8">

          <div className="mb-7">
            <h2 className="text-xl font-semibold text-white">
              Sign in to your account
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter your credentials to get started.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

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
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
                Login as
              </label>

              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  setError("")
                }}
                className={`${inputClass} ${
                  role ? "text-white" : "text-slate-500"
                }`}
              >
                <option value="">Select your role</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
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
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in to EvalAI →"}
            </button>

          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-500">
              Secure access
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <p className="text-center text-sm text-slate-400">
            New to EvalAI?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Create an account
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

export default Login
