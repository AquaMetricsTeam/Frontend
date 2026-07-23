import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useMe } from "@/features/auth/hooks/useMe";
import type { AuthUser, UserRole } from "@/features/auth/types";


interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useMe();

  const user = data?.data ?? null;
  const isAuthenticated = !!user;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      hasRole: (role) => user?.roles.includes(role) ?? false,
      hasAnyRole: (roles) =>
        roles.some((r) => user?.roles.includes(r)) ?? false,
    }),
    [user, isLoading, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
