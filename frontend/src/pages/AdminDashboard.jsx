
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllUsers,
  getEvaluationStats
} from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [evaluationCount, setEvaluationCount] = useState(0);
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError("");

    const [usersData, evaluationData] = await Promise.all([
      getAllUsers(),
      getEvaluationStats()
    ]);

    setUsers(usersData);
    setEvaluationCount(evaluationData.total_evaluations);

  } catch (err) {
    setError(err.message || "Failed to fetch dashboard data");
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
  fetchDashboardData();
}, []);

  const totalUsers = users.length;

  const totalTeachers = users.filter(
    (user) => user.role === "TEACHER"
  ).length;

  const totalStudents = users.filter(
    (user) => user.role === "STUDENT"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="min-h-screen overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-7">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="text-[11px] text-slate-400">
              Manage users and monitor EvalAI activities
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <Link
              to="/"
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Back to Login
            </Link>
          </div>
        </header>

        <div className="p-7">

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-5">

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Total Users
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {loading ? "..." : error ? "--" : totalUsers}
              </p>

              <p className="text-[10px] text-emerald-600 mt-1">
                Registered platform users
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Teachers
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {loading ? "..." : error ? "--" : totalTeachers}
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Registered teachers
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Students
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {loading ? "..." : error ? "--" : totalStudents}
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Registered students
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">
                Evaluations
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {loading ? "..." : error ? "--" : evaluationCount}
              </p>

              <p className="text-[10px] text-blue-600 mt-1">
                Placeholder statistic
              </p>
            </div>

          </div>

          {/* Platform Overview and Quick Actions */}
          <div className="grid grid-cols-3 gap-5">

            <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Platform Overview
                  </h2>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Current EvalAI platform activity
                  </p>
                </div>

                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                  System Active
                </span>
              </div>

              <div className="space-y-4">

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      Registered Users
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      {loading ? "..." : totalUsers}
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      Evaluations Completed
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      78%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[78%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">
                      Pending Evaluations
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      11%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[11%] rounded-full"></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <h2 className="text-sm font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-[10px] text-slate-400 mt-1 mb-4">
                Frequently used admin actions
              </p>

              <div className="space-y-2">

                <Link
                  to="/students"
                  className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Manage Users
                </Link>

                <Link
                  to="/evaluations"
                  className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Evaluations
                </Link>

                <Link
                  to="/answer-sheets"
                  className="block w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Answer Sheets
                </Link>

              </div>
            </div>

          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-slate-200 rounded-xl mt-5">

            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Platform Activity
                </h2>

                <p className="text-[10px] text-slate-400 mt-1">
                  Latest activity across EvalAI
                </p>
              </div>

              <span className="text-[10px] text-slate-400">
                Recent
              </span>
            </div>

            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  User management
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  {loading
                    ? "Fetching user data..."
                    : `${totalUsers} registered users on the platform`}
                </p>
              </div>

              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                Users
              </span>
            </div>

            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Theory evaluation
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Evaluation processing activity
                </p>
              </div>

              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                Evaluation
              </span>
            </div>

            <div className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Answer sheets
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Answer sheet processing activity
                </p>
              </div>

              <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md">
                Activity
              </span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
