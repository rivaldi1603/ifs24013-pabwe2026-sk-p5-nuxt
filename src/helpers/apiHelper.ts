export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

export function putAccessToken(token: string): void {
  localStorage.setItem("accessToken", token);
}

export function removeAccessToken(): void {
  localStorage.removeItem("accessToken");
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${DELCOM_BASEURL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  
  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers });
  
  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseData?.message || response.statusText || "Terjadi kesalahan pada server");
  }
  
  return responseData;
}
