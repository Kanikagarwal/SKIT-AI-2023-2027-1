
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const getAllUsers = async () => {
  const token = localStorage.getItem("evalai_token");

  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/users/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch users");
  }

  return response.json();
};


export const getEvaluationStats = async () => {
  const token = localStorage.getItem("evalai_token");

  if (!token) {
    throw new Error("Admin token not found. Please log in again.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/answer-sheets/evaluation-stats`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Failed to fetch evaluation statistics");
  }

  return data;
};