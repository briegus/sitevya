import { createContext, useContext, useState, type ReactNode } from "react";

// Client-side only auth — for production replace with real server-side authentication.
// Set VITE_TEAM_PASSWORD in your .env to configure the team password.
export const TEAM_PASSWORD = import.meta.env.VITE_TEAM_PASSWORD ?? "sitevya2026";
const SESSION_KEY = "sv_team_auth";

type AuthCtx = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );

  const login = (password: string) => {
    if (password === TEAM_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth requires AuthProvider");
  return ctx;
}
