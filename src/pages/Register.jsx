import { Link } from "react-router-dom"
function Register() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Account
          </h1>
          <p className="text-slate-500 mt-2">
            Create your Theory Evaluation account
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
  defaultValue=""
>
  <option value="" disabled>
    Select role
  </option>
  <option value="teacher">Teacher</option>
  <option value="student">Student</option>
</select>

          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Create password"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
            Create Account
          </button>
          <div className="text-center mt-5 text-sm">
  <Link to="/" className="text-blue-600 hover:underline">
    Back to Login
  </Link>
</div>
        </div>

      </div>
    </div>
  )
}

export default Register