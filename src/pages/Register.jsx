import { Link } from "react-router-dom"

function Register() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white text-base font-bold mb-1">
            E
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Get started with EvalAI
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="space-y-3">

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Account type
              </label>

              <select
                defaultValue=""
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition">
              Create account
            </button>

          </div>

          <div className="border-t border-slate-200 mt-4 pt-3">
            <p className="text-center text-xs text-slate-500">
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

        <p className="text-center text-[11px] text-slate-400 mt-2">
          AI-powered theory answer evaluation
        </p>

      </div>
    </div>
  )
}

export default Register