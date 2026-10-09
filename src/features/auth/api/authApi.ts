import { fetchApi, putAccessToken } from "../../../helpers/apiHelper";

export async function login(payload: Record<string, any>) {
  const response = await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  
  if (response?.data?.token) {
    putAccessToken(response.data.token);
  }
  
  return response;
}

export async function register(payload: Record<string, any>) {
  return fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
