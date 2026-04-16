import { useState, useEffect } from "react";
import type { AuthResponse } from "../types";
import { AuthContext } from "./AuthContextType";
import { config } from "../config";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    if (!accessToken) return;

    const validateSession = async () => {
      try {
        const res = await fetch(`${config.authApiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Token expired");
        const data = await res.json();
        setUser(data);
      } catch {
        if (refreshToken) {
          await refreshSession();
        } else {
          clearAuth();
        }
      } finally {
        setIsLoading(false);
      }
    };
    validateSession();
  }, []);

  const refreshSession = async () => {
    try {
      const res = await fetch(`${config.authApiUrl}/auth/refresh`, {
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
    const res = await fetch(`${config.authApiUrl}/auth/login`, {
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
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
