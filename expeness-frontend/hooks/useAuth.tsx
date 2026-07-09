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
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "@/lib/auth";
import type { LoginRequest, SignupRequest, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      setLoading(false);
      return;
    }

    setUser(session.user);
    authService
      .getMe()
      .then(setUser)
      .catch(() => {
        clearAuthSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);
    saveAuthSession({ user: response.user, token: response.token });
    setUser(response.user);
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    const response = await authService.signup(data);
    saveAuthSession({ user: response.user, token: response.token });
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
    }),
    [user, loading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [auth.loading, auth.isAuthenticated, router, redirectTo]);

  return auth;
}

export function useGuestOnly(redirectTo = "/") {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading && auth.isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [auth.loading, auth.isAuthenticated, router, redirectTo]);

  return auth;
}
