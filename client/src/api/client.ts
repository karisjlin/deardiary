import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

export const api = axios.create({
  baseURL
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};
