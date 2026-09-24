import { createContext, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setUser(null);
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setUser(null);
        return null;
      }

      const result = await response.json();

      const currentUser = result.success ? result.data : null;

      setUser(currentUser);

      return currentUser;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      await refreshUser();
      setLoading(false);
    };

    loadUser();
  }, []);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();

      if (cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
