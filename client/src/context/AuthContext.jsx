import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/users/current-user")
      .then((response) => setUser(response?.data?.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier, password) => {
    const payload = identifier.includes("@")
      ? { email: identifier, password }
      : { username: identifier, password };

    const response = await api.post("/api/users/login", payload);
    const loggedInUser = response?.data?.data?.user;
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async ({ username, email, fullName, password }) => {
    const response = await api.post("/api/users/register", {
      username,
      email,
      fullName,
      password,
    });
    return response?.data?.data;
  };

  const logout = async () => {
    try {
      await api.post("/api/users/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
