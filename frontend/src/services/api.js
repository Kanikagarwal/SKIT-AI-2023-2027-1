const API_BASE_URL = "http://127.0.0.1:8000";

export const getAllUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/users/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};