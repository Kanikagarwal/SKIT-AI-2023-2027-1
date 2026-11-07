
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllUsers,
  getEvaluationStats,
  getAnswerSheetStats,
  getRecentActivity
} from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [evaluationCount, setEvaluationCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  const [answerSheetStats, setAnswerSheetStats] = useState({
    total_answer_sheets: 0,
    ocr_completed: 0,
    evaluations_completed: 0,
    pending_evaluations: 0
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        usersData,
        evaluationData,
        answerSheetData,
        activityData
      ] = await Promise.all([
        getAllUsers(),
        getEvaluationStats(),
        getAnswerSheetStats(),
        getRecentActivity()
      ]);

      setUsers(usersData);
      setEvaluationCount(evaluationData.total_evaluations);
      setAnswerSheetStats(answerSheetData);
      setRecentActivity(activityData);

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

  const completedPercentage =
    answerSheetStats.total_answer_sheets > 0
      ? (answerSheetStats.evaluations_completed /
          answerSheetStats.total_answer_sheets) * 100
      : 0;

  const pendingPercentage =
    answerSheetStats.total_answer_sheets > 0
      ? (answerSheetStats.pending_evaluations /
          answerSheetStats.total_answer_sheets) * 100
      : 0;

  const cardStyle =
    "bg-[#F7FAFF] border border-[#D4E2F3] rounded-xl p-4 shadow-sm";

  const headingStyle = "text-sm font-bold text-[#142D50]";

  const buttonStyle =
    "border border-[#C9D9ED] hover:bg-[#E5EFFC] text-[#294667] px-4 py-2 rounded-lg text-sm font-semibold transition";

  return (
    <div className="min-h-screen bg-[#EAF1FA]">

      <main className="min-h-screen overflow-hidden">

        {/* Header */}
        <header className="min-h-16 bg-[#142D50] border-b border-[#24456F] flex flex-wrap items-center justify-between gap-3 px-7 py-3">

          <div>
            <h1 className="text-lg font-bold text-white">
              Admin Dashboard
            </h1>

            <p className="text-[11px] text-blue-200">
              Manage users and monitor EvalAI activities
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="border border-[#45658D] hover:bg-[#294667] text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <Link
              to="/"
              className="border border-[#45658D] hover:bg-[#294667] text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">

            <div className={cardStyle}>
              <p className="text-xs text-[#59718F]">
                Total Users
              </p>

              <p className="text-2xl font-bold text-[#142D50] mt-2">
                {loading ? "..." : error ? "--" : totalUsers}
              </p>

              <p className="text-[10px] text-emerald-700 mt-1">
                Registered platform users
              </p>
            </div>

            <div className={cardStyle}>
              <p className="text-xs text-[#59718F]">
                Teachers
              </p>

              <p className="text-2xl font-bold text-[#142D50] mt-2">
                {loading ? "..." : error ? "--" : totalTeachers}
              </p>

              <p className="text-[10px] text-[#7890AE] mt-1">
                Registered teachers
              </p>
            </div>

            <div className={cardStyle}>
              <p className="text-xs text-[#59718F]">
                Students
              </p>

              <p className="text-2xl font-bold text-[#142D50] mt-2">
                {loading ? "..." : error ? "--" : totalStudents}
              </p>

              <p className="text-[10px] text-[#7890AE] mt-1">
                Registered students
              </p>
            </div>

            <div className={cardStyle}>
              <p className="text-xs text-[#59718F]">
                Evaluations
              </p>

              <p className="text-2xl font-bold text-[#142D50] mt-2">
                {loading ? "..." : error ? "--" : evaluationCount}
              </p>

              <p className="text-[10px] text-[#315FAD] mt-1">
                Total evaluation records
              </p>
            </div>

          </div>

          {/* Platform Overview and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Platform Overview */}
            <div className="lg:col-span-2 bg-[#F7FAFF] border border-[#D4E2F3] rounded-xl p-5 shadow-sm">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className={headingStyle}>
                    Platform Overview
                  </h2>

                  <p className="text-[10px] text-[#7890AE] mt-1">
                    Current EvalAI platform activity
                  </p>
                </div>

                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                  System Active
                </span>

              </div>

              <div className="space-y-5">

                {/* Registered Users */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#59718F]">
                      Registered Users
                    </span>

                    <span className="text-xs font-semibold text-[#294667]">
                      {loading ? "..." : error ? "--" : totalUsers}
                    </span>
                  </div>

                  <div className="h-2 bg-[#DFE9F6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#315FAD] w-full rounded-full"
                    ></div>
                  </div>
                </div>

                {/* Evaluations Completed */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#59718F]">
                      Evaluations Completed
                    </span>

                    <span className="text-xs font-semibold text-[#294667]">
                      {loading ? "..." : error ? "--" : answerSheetStats.evaluations_completed}
                    </span>
                  </div>

                  <div className="h-2 bg-[#DFE9F6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#315FAD] rounded-full transition-all duration-500"
                      style={{
                        width: `${completedPercentage}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Pending Evaluations */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#59718F]">
                      Pending Evaluations
                    </span>

                    <span className="text-xs font-semibold text-[#294667]">
                      {loading ? "..." : error ? "--" : answerSheetStats.pending_evaluations}
                    </span>
                  </div>

                  <div className="h-2 bg-[#DFE9F6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D69A36] rounded-full transition-all duration-500"
                      style={{
                        width: `${pendingPercentage}%`
                      }}
                    ></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#F7FAFF] border border-[#D4E2F3] rounded-xl p-5 shadow-sm">

              <h2 className={headingStyle}>
                Quick Actions
              </h2>

              <p className="text-[10px] text-[#7890AE] mt-1 mb-4">
                Frequently used admin actions
              </p>

              <div className="space-y-2">

                <Link
                  to="/students"
                  className="block w-full border border-[#C9D9ED] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#294667] hover:bg-[#E5EFFC] transition"
                >
                  Manage Users
                </Link>

                <Link
                  to="/evaluations"
                  className="block w-full border border-[#C9D9ED] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#294667] hover:bg-[#E5EFFC] transition"
                >
                  View Evaluations
                </Link>

                <Link
                  to="/answer-sheets"
                  className="block w-full border border-[#C9D9ED] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#294667] hover:bg-[#E5EFFC] transition"
                >
                  View Answer Sheets
                </Link>

              </div>
            </div>

          </div>

          {/* Recent Platform Activity */}
          <div className="bg-[#F7FAFF] border border-[#D4E2F3] rounded-xl mt-5 shadow-sm">

            <div className="px-5 py-4 border-b border-[#DCE7F4] flex items-center justify-between">

              <div>
                <h2 className={headingStyle}>
                  Recent Platform Activity
                </h2>

                <p className="text-[10px] text-[#7890AE] mt-1">
                  Latest activity across EvalAI
                </p>
              </div>

              <span className="text-[10px] text-[#7890AE]">
                Recent
              </span>

            </div>

            {loading ? (
              <div className="px-5 py-4 text-xs text-[#59718F]">
                Fetching recent activity...
              </div>
            ) : error ? (
              <div className="px-5 py-4 text-xs text-red-500">
                Unable to load recent activity.
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="px-5 py-4 text-xs text-[#59718F]">
                No recent activity found.
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`px-5 py-3 flex items-center justify-between gap-4 ${
                    index !== recentActivity.length - 1
                      ? "border-b border-[#E4ECF6]"
                      : ""
                  }`}
                >

                  <div>
                    <p className="text-xs font-semibold text-[#294667]">
                      Answer Sheet #{activity.id}
                    </p>

                    <p className="text-[10px] text-[#7890AE] mt-1">
                      {activity.file_name || "Answer sheet uploaded"}
                    </p>

                    <p className="text-[10px] text-[#8CA1BA] mt-1">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>

                    <p className="text-[10px] text-[#59718F] mt-1">
                      OCR: {activity.ocr_status || "PENDING"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                      activity.evaluation_status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {activity.evaluation_status || "PENDING"}
                  </span>

                </div>
              ))
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
