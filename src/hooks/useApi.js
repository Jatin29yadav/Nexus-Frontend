import axios from "axios";
import { useMemo } from "react";

const useApi = () => {
  const api = useMemo(
    () =>
      axios.create({
        baseURL:
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api",
        withCredentials: true,
      }),
    [],
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("Auth token missing or expired.");
      }
      return Promise.reject(error);
    },
  );

  return api;
};

export default useApi;
