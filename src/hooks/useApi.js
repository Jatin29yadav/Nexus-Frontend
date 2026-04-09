import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const useApi = () => {
  const { getToken } = useAuth();

  const api = axios.create({
    baseURL: "http://localhost:3005/api",
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export default useApi;
