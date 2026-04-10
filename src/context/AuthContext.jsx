import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api";

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/profile`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          console.error("System Sync Error:", error.message);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [API_URL]);

  const login = async (email, password) => {
    const res = await axios.post(
      `${API_URL}/users/login`,
      { email, password },
      { withCredentials: true },
    );
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_URL}/users/logout`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Logout sequence failed", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
