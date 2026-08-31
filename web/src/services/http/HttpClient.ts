import axios, { type AxiosError } from "axios";
import { ApiError } from "../../errors/ApiError";
import { isGatewayReconnectError } from '../../utils/isLeraTokenError';
import { clearToken, getToken } from "../../utils/storage";
import {
  isAuthAttemptRequest,
  notifySessionExpired
} from "./session";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const http = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    const url = error.config?.url;
    const status = error.response?.status;

    const message = error.response?.data?.message;
    const text = Array.isArray(message)
      ? message.join(", ")
      : (message ?? error.message);
    if (
      status === 401 &&
      getToken() &&
      !isAuthAttemptRequest(url) &&
      !isGatewayReconnectError(new ApiError(text, 401))
    ) {
      clearToken();
      notifySessionExpired();
    }
    throw new ApiError(text, status ?? 500);
  },
);

export { API_URL };
