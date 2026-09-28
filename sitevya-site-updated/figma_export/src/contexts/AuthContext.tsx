import { createContext, useContext, useState, type ReactNode } from "react";

// Authentification vérifiée CÔTÉ SERVEUR : le mot de passe n'est plus dans le code JS du site.
// Il est comparé à TEAM_API_PASSWORD (variable Netlify) par la fonction dashboard-data.
// Une fois validé, il reste uniquement dans sessionStorage (effacé à la fermeture de l'onglet).
const PWD_KEY = "sv_team_pwd";

export function getAuthHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem(PWD_KEY) ?? ""}`,
  };
}

export type LoginResult = "ok" | "invalid" | "error";

type AuthCtx = {
  isAuthenticated: boolean;
  login: (password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!sessionStorage.getItem(PWD_KEY)
  );

  const login = async (password: string): Promise<LoginResult> => {
    try {
      const res = await fetch("/.netlify/functions/dashboard-data?resource=ping", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        sessionStorage.setItem(PWD_KEY, password);
        setIsAuthenticated(true);
        return "ok";
      }
      // 401 = mauvais mot de passe (ou TEAM_API_PASSWORD absente) ; le reste = fonctions indisponibles
      return res.status === 401 ? "invalid" : "error";
    } catch {
      return "error";
    }
  };

  const logout = () => {
    sessionStorage.removeItem(PWD_KEY);
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
