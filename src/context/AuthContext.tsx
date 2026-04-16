import { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthResponse } from "../types";

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  useEffect(() => {
    if (!accessToken) return;

    fetch("https://dummyjson.com/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token expired");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        if (refreshToken) {
          refreshSession();
        } else {
          clearAuth();
        }
      });
  }, []);

  const refreshSession = async () => {
    try {
      const res = await fetch("https://dummyjson.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data: AuthResponse = await res.json();
      storeAuth(data);
    } catch {
      clearAuth();
    }
  };

  const login = async (username: string, password: string) => {
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Login failed");
    }

    const data: AuthResponse = await res.json();
    storeAuth(data);
  };

  const storeAuth = (data: AuthResponse) => {
    const { accessToken: token, refreshToken: refresh, ...userData } = data;
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refresh);
    setAccessToken(token);
    setRefreshToken(refresh);
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
