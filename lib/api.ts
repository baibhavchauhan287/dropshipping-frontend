import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// ================= REQUEST =================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE =================
api.interceptors.response.use(
  (res) => res,
  async (err) => {

    const originalRequest = err.config;

    
    if (
      (err.response?.status === 401 ||
       err.response?.status === 403) &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        console.log("🔄 Refreshing token...");

        const res = await axios.post(
          "http://localhost:8080/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        console.log("✅ New Token:", newToken);

        localStorage.setItem("accessToken", newToken);

        // retry request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        console.log("Refresh failed");

        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;