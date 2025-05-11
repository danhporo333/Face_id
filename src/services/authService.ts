import API_URL from "../config/apiConfig";

export async function loginApi(username: string, password: string) {
  const response = await fetch(`${API_URL}/v1/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
}

export async function getUserInfo(token: string) {
  const response = await fetch(`${API_URL}/v1/api/lich-hoc-ca-nhan`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Get user info failed");
  }
  return response.json();
}
