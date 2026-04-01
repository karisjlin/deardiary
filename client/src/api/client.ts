import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export const api = axios.create({
  baseURL
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 401
    ) {
      localStorage.removeItem("redditclone.auth");
      delete api.defaults.headers.common.Authorization;
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};
