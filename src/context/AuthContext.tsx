"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const AuthContext = createContext<{
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  loginAdmin: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  isAdmin: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser | null> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return null;
    const u = data.user;
    setUser({ id: u.id, email: u.email, name: u.name, role: u.role });
    return { id: u.id, email: u.email, name: u.name, role: u.role };
  }, []);

  const loginAdmin = useCallback(async (email: string, password: string): Promise<AuthUser | null> => {
    const u = await login(email, password);
    return u?.role === "ADMIN" ? u : null;
  }, [login]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sign up failed");
    await login(email, password);
    return true;
  }, [login]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      loginAdmin,
      logout,
      signup,
      refresh,
      isAdmin: user?.role === "ADMIN",
    }),
    [user, loading, login, loginAdmin, logout, signup, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
