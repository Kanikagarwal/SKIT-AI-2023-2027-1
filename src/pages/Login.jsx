import { useState } from "react"
import { Link } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
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
    alert("Login details are valid.")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-2">
      <div className="w-full max-w-md">

        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white text-base font-bold mb-1">
            E
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Sign in to continue to EvalAI
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <form onSubmit={handleLogin} className="space-y-3">

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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
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
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-blue-600 hover:text-blue-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Login as
              </label>

              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  setError("")
                }}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select your role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
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
              Sign in
            </button>

          </form>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-[10px] text-slate-400">
                Secure access
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create account
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-1.5">
          AI-powered theory answer evaluation
        </p>

      </div>
    </div>
  )
}

export default Login