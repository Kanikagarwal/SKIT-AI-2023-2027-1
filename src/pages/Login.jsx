import { Link } from "react-router-dom"

function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white text-lg font-bold mb-2">
            E
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Sign in to continue to EvalAI
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Login as
              </label>

              <select
                defaultValue=""
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition">
              Sign in
            </button>

          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">
                Secure access
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-3">
          AI-powered theory answer evaluation
        </p>

      </div>
    </div>
  )
}

export default Login