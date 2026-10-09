import { fetchApi } from "../../../helpers/apiHelper";

export async function getUsers() {
  return fetchApi("/users");
}

export async function getMe() {
  return fetchApi("/users/me");
}

export async function updateBio(payload: Record<string, any>) {
  return fetchApi("/users/me", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("photo", file);
  return fetchApi("/users/me/photo", {
    method: "POST",
    body: formData
  });
}

export async function updatePassword(payload: Record<string, any>) {
  return fetchApi("/users/me/password", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
