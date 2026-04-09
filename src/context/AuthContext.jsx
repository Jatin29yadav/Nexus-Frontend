import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check user on initial load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("http://localhost:3005/api/users/profile", {
          withCredentials: true, // 🚨 Yeh JWT cookies bhejne ke liye zaroori hai
        });
        setUser(res.data.user); // Backend se jo user details aayin, wo save kar li
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  // 2. Real Login Function
  const login = async (email, password) => {
    const res = await axios.post(
      "http://localhost:3005/api/users/login",
      { email, password },
      { withCredentials: true },
    );
    setUser(res.data.user); // State update ki, taaki app ko pata chale hum login hain
    return res.data;
  };

  // 3. Real Logout Function
  const logout = async () => {
    await axios.post(
      "http://localhost:3005/api/users/logout",
      {},
      { withCredentials: true },
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
