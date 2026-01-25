import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1/";
let isRefreshing = false;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

/* =======================
   REQUEST INTERCEPTOR
======================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    const isAuthEndpoint =
      config.url.includes("auth/login") ||
      config.url.includes("auth/register") ||
      config.url.includes("token/refresh");

    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =======================
   RESPONSE INTERCEPTOR
======================= */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response.status === 400) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("auth/login")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const res = await axios.post(
          `${BASE_URL}token/refresh/`,
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access_token", newAccess);
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        isRefreshing = false;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
