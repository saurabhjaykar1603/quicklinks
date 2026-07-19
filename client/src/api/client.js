import axios from "axios";

// shared axios instance — sends httpOnly auth cookies with every request
const api = axios.create({
  withCredentials: true,
});

const AUTH_FREE_URLS = ["/api/users/login", "/api/users/refresh-token"];

// on 401, try refreshing the access token once, then retry the original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !AUTH_FREE_URLS.some((url) => original.url?.includes(url))
    ) {
      original._retry = true;
      try {
        await api.post("/api/users/refresh-token");
        return api(original);
      } catch {
        // refresh failed — user stays logged out
      }
    }

    return Promise.reject(error);
  }
);

export default api;
