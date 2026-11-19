
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

  // Fetch all dashboard data
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

  // Calculate user statistics
  const totalUsers = users.length;

  const totalTeachers = users.filter(
    (user) => user.role === "TEACHER"
  ).length;

  const totalStudents = users.filter(
    (user) => user.role === "STUDENT"
  ).length;

  // Calculate evaluation percentages
  const completedPercentage =
    answerSheetStats.total_answer_sheets > 0
      ? Math.min(
          100,
          (answerSheetStats.evaluations_completed /
            answerSheetStats.total_answer_sheets) * 100
        )
      : 0;

  const pendingPercentage =
    answerSheetStats.total_answer_sheets > 0
      ? Math.min(
          100,
          (answerSheetStats.pending_evaluations /
            answerSheetStats.total_answer_sheets) * 100
        )
      : 0;

  const ocrPercentage =
    answerSheetStats.total_answer_sheets > 0
      ? Math.min(
          100,
          (answerSheetStats.ocr_completed /
            answerSheetStats.total_answer_sheets) * 100
        )
      : 0;

  const cardStyle =
    "bg-[#F7FAFF] border border-[#D4E2F3] rounded-xl p-4 shadow-sm";

  const headingStyle =
    "text-sm font-bold text-[#142D50]";

  const actionStyle =
    "block w-full border border-[#C9D9ED] rounded-lg px-3 py-3 text-xs font-semibold text-[#294667] hover:bg-[#E5EFFC] transition";

  const progressStyle =
    "h-2 bg-[#DFE9F6] rounded-full overflow-hidden";

  return (
    <div className="min-h-screen bg-[#EAF1FA]">

      <main className="min-h-screen overflow-hidden">

        {/* HEADER */}
        <header className="min-h-16 bg-[#142D50] border-b border-[#24456F] flex flex-wrap items-center justify-between gap-3 px-7 py-3">

          <div>
            <h1 className="text-lg font-bold text-white">
              Admin Dashboard
            </h1>

            <p className="text-[11px] text-blue-200">
              Manage users, examinations and monitor EvalAI activities
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

        <div className="p-5 md:p-7">

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ADMIN RESPONSIBILITIES */}
          <div className="mb-6">

            <div className="mb-3">
              <h2 className={headingStyle}>
                Admin Responsibilities
              </h2>

              <p className="text-[10px] text-[#7890AE] mt-1">
                Manage the complete examination and evaluation process
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">

              <Link to="/users" className={actionStyle}>
                <div className="text-[#315FAD] text-lg mb-2">
                  👥
                </div>
                Register & Manage Users
                <p className="font-normal text-[#7890AE] mt-1">
                  Register teachers and students
                </p>
              </Link>

              <Link to="/exams" className={actionStyle}>
                <div className="text-[#315FAD] text-lg mb-2">
                  📝
                </div>
                Create Examination
                <p className="font-normal text-[#7890AE] mt-1">
                  Create and manage examinations
                </p>
              </Link>

              <Link to="/exams" className={actionStyle}>
                <div className="text-[#315FAD] text-lg mb-2">
                  📄
                </div>
                Upload Question Paper
                <p className="font-normal text-[#7890AE] mt-1">
                  Upload examination question papers
                </p>
              </Link>

              <Link to="/answer-sheets" className={actionStyle}>
                <div className="text-[#315FAD] text-lg mb-2">
                  📚
                </div>
                Upload Answer Sheets
                <p className="font-normal text-[#7890AE] mt-1">
                  Upload students' handwritten sheets
                </p>
              </Link>

              <Link to="/evaluations" className={actionStyle}>
                <div className="text-[#315FAD] text-lg mb-2">
                  📊
                </div>
                View Evaluations
                <p className="font-normal text-[#7890AE] mt-1">
                  Monitor evaluation results
                </p>
              </Link>

            </div>
          </div>

          {/* STATISTICS CARDS */}
          <div className="mb-6">

            <h2 className={`${headingStyle} mb-3`}>
              Platform Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

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
          </div>

          {/* PROCESSING STATISTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

            {/* ANSWER SHEET OVERVIEW */}
            <div className="bg-[#F7FAFF] border border-[#D4E2F3] rounded-xl p-5 shadow-sm">

              <h2 className={headingStyle}>
                Answer Sheet Overview
              </h2>

              <p className="text-[10px] text-[#7890AE] mt-1 mb-5">
                Monitor uploaded answer sheets and their processing
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">

                <div className="bg-[#EAF1FA] rounded-lg p-3">
                  <p className="text-[10px] text-[#59718F]">
                    Total Answer Sheets
                  </p>

                  <p className="text-xl font-bold text-[#142D50] mt-1">
                    {loading ? "..." : answerSheetStats.total_answer_sheets}
                  </p>
                </div>

                <div className="bg-[#EAF1FA] rounded-lg p-3">
                  <p className="text-[10px] text-[#59718F]">
                    OCR Completed
                  </p>

                  <p className="text-xl font-bold text-[#142D50] mt-1">
                    {loading ? "..." : answerSheetStats.ocr_completed}
                  </p>
                </div>

              </div>

              {/* OCR PROGRESS */}
              <div className="mb-5">

                <div className="flex justify-between mb-2">
                  <span className="text-xs text-[#59718F]">
                    OCR Processing
                  </span>

                  <span className="text-xs font-semibold text-[#294667]">
                    {loading ? "..." : `${ocrPercentage.toFixed(1)}%`}
                  </span>
                </div>

                <div className={progressStyle}>
                  <div
                    className="h-full bg-[#315FAD] rounded-full transition-all duration-500"
                    style={{ width: `${ocrPercentage}%` }}
                  />
                </div>

              </div>

              {/* EVALUATION PROGRESS */}
              <div className="mb-5">

                <div className="flex justify-between mb-2">
                  <span className="text-xs text-[#59718F]">
                    Evaluations Completed
                  </span>

                  <span className="text-xs font-semibold text-[#294667]">
                    {loading ? "..." : `${completedPercentage.toFixed(1)}%`}
                  </span>
                </div>

                <div className={progressStyle}>
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${completedPercentage}%` }}
                  />
                </div>

              </div>

              {/* PENDING EVALUATIONS */}
              <div>

                <div className="flex justify-between mb-2">
                  <span className="text-xs text-[#59718F]">
                    Pending Evaluations
                  </span>

                  <span className="text-xs font-semibold text-[#294667]">
                    {loading ? "..." : answerSheetStats.pending_evaluations}
                  </span>
                </div>

                <div className={progressStyle}>
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${pendingPercentage}%` }}
                  />
                </div>

              </div>

            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-[#F7FAFF] border border-[#D4E2F3] rounded-xl p-5 shadow-sm">

              <h2 className={headingStyle}>
                Quick Actions
              </h2>

              <p className="text-[10px] text-[#7890AE] mt-1 mb-4">
                Frequently used administrative operations
              </p>

              <div className="space-y-3">

                <Link
                  to="/users"
                  className={actionStyle}
                >
                  Manage Registered Users →
                </Link>

                <Link
                  to="/exams"
                  className={actionStyle}
                >
                  Manage Examinations →
                </Link>

                <Link
                  to="/answer-sheets"
                  className={actionStyle}
                >
                  View Uploaded Answer Sheets →
                </Link>

                <Link
                  to="/evaluations"
                  className={actionStyle}
                >
                  Monitor Evaluations →
                </Link>

              </div>

            </div>

          </div>

          {/* RECENT PLATFORM ACTIVITY */}
          <div className="bg-[#F7FAFF] border border-[#D4E2F3] rounded-xl shadow-sm">

            <div className="px-5 py-4 border-b border-[#DCE7F4] flex items-center justify-between">

              <div>
                <h2 className={headingStyle}>
                  Recent Platform Activity
                </h2>

                <p className="text-[10px] text-[#7890AE] mt-1">
                  Latest answer-sheet uploads and processing statuses
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
                  className={`px-5 py-3 flex flex-wrap items-center justify-between gap-4 ${
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
                      {activity.created_at
                        ? new Date(activity.created_at).toLocaleString()
                        : "Date unavailable"}
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
