import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/api/auth/login`,
    {
      email,
      password,
    }
  );

  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await axios.get(
    `${API_URL}/api/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};