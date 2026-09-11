import { useState } from "react"
import { Link } from "react-router-dom"

function Register() {
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

    if (!name || !email || !role || !password || !confirmPassword) {
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
    alert("Account details are valid.")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-1">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-bold mb-1">
            E
          </div>

          <h1 className="text-lg font-bold text-slate-900">
            Create your account
          </h1>

          <p className="text-[11px] text-slate-500 mt-0.5">
            Get started with EvalAI
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
          <form onSubmit={handleRegister} className="space-y-2">

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
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
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
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
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                Account type
              </label>

              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  setError("")
                }}
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select your role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
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
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 pr-14 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
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
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 pr-14 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-blue-600 hover:text-blue-700"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-sm font-semibold transition"
            >
              Create account
            </button>

          </form>

          <div className="border-t border-slate-200 mt-2.5 pt-2.5">
            <p className="text-center text-[11px] text-slate-500">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[9px] text-slate-400 mt-1">
          AI-powered theory answer evaluation
        </p>

      </div>
    </div>
  )
}

export default Register