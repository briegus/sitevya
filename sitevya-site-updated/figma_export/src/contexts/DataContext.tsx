import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { TEAM_PASSWORD } from "./AuthContext";

export type DemandeStatus = "new" | "in_progress" | "done";
export type AvisStatus = "pending" | "published" | "rejected";

export type Demande = {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  description: string;
  deadline?: string;
  extra?: string;
  date: string;
  status: DemandeStatus;
  channel: "email" | "discord";
};

export type Realisation = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  link?: string;
  published: boolean;
  tags: string[];
};

export type Avis = {
  id: string;
  name: string;
  company?: string;
  rating: number;
  comment: string;
  date: string;
  status: AvisStatus;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  date: string;
  published: boolean;
};

type DataCtx = {
  demandes: Demande[];
  addDemande: (d: Omit<Demande, "id" | "date" | "status">) => void;
  updateDemandeStatus: (id: string, status: DemandeStatus) => void;
  deleteDemande: (id: string) => void;
  refreshDemandes: () => Promise<void>;
  demandesLoading: boolean;

  realisations: Realisation[];
  addRealisation: (r: Omit<Realisation, "id">) => void;
  updateRealisation: (id: string, patch: Partial<Omit<Realisation, "id">>) => void;
  deleteRealisation: (id: string) => void;

  avis: Avis[];
  addAvis: (a: Omit<Avis, "id" | "date" | "status">) => Promise<boolean>;
  updateAvisStatus: (id: string, status: AvisStatus) => void;
  deleteAvis: (id: string) => void;
  refreshAvis: () => Promise<void>;
  refreshPublicAvis: () => Promise<void>;
  avisLoading: boolean;

  posts: Post[];
  addPost: (p: Omit<Post, "id" | "date">) => void;
  updatePost: (id: string, patch: Partial<Omit<Post, "id">>) => void;
  deletePost: (id: string) => void;
};

// ── Mapping avec le backend Neon (netlify/functions) ────────────────────────
// La base utilise des statuts en français ; l'UI utilise des statuts en anglais.
const DEMANDE_STATUS_TO_SERVER: Record<DemandeStatus, string> = {
  new: "nouveau",
  in_progress: "en_cours",
  done: "traite",
};
const DEMANDE_STATUS_FROM_SERVER: Record<string, DemandeStatus> = {
  nouveau: "new",
  en_cours: "in_progress",
  traite: "done",
  refuse: "done",
};

const AVIS_STATUS_TO_SERVER: Record<AvisStatus, string> = {
  pending: "en_attente",
  published: "approuve",
  rejected: "refuse",
};
const AVIS_STATUS_FROM_SERVER: Record<string, AvisStatus> = {
  en_attente: "pending",
  approuve: "published",
  refuse: "rejected",
};

const AUTH_HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TEAM_PASSWORD}`,
};

function formatServerDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function demandeFromServerRow(row: Record<string, unknown>): Demande {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    company: (row.company as string) ?? undefined,
    projectType: String(row.project_type ?? ""),
    description: String(row.description ?? ""),
    deadline: (row.deadline as string) ?? undefined,
    extra: (row.extra as string) ?? undefined,
    date: formatServerDate(String(row.created_at)),
    status: DEMANDE_STATUS_FROM_SERVER[String(row.status)] ?? "new",
    channel: (row.channel as "email" | "discord") ?? "email",
  };
}

function avisFromServerRow(row: Record<string, unknown>): Avis {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    company: (row.project_type as string) ?? undefined,
    rating: Number(row.rating ?? 0),
    comment: String(row.comment ?? ""),
    date: formatServerDate(String(row.created_at)),
    status: AVIS_STATUS_FROM_SERVER[String(row.status)] ?? "pending",
  };
}

const DataContext = createContext<DataCtx | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowFr() {
  return new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function DataProvider({ children }: { children: ReactNode }) {
  // Demandes et avis : la vraie source de vérité est Neon (via netlify/functions).
  // Le localStorage ne sert plus que de cache d'affichage instantané pendant le chargement.
  const [demandes, setDemandes] = useState<Demande[]>(() => load("sv_demandes", []));
  const [realisations, setRealisations] = useState<Realisation[]>(() => load("sv_realisations", []));
  const [avis, setAvis] = useState<Avis[]>(() => load("sv_avis", []));
  const [posts, setPosts] = useState<Post[]>(() => load("sv_posts", []));
  const [demandesLoading, setDemandesLoading] = useState(false);
  const [avisLoading, setAvisLoading] = useState(false);

  useEffect(() => { save("sv_demandes", demandes); }, [demandes]);
  useEffect(() => { save("sv_realisations", realisations); }, [realisations]);
  useEffect(() => { save("sv_avis", avis); }, [avis]);
  useEffect(() => { save("sv_posts", posts); }, [posts]);

  // ── Demandes (backend Neon, accès équipe) ──────────────────────────────────
  const refreshDemandes = useCallback(async () => {
    setDemandesLoading(true);
    try {
      const res = await fetch("/.netlify/functions/dashboard-data?resource=demandes", {
        headers: AUTH_HEADERS,
      });
      if (!res.ok) return;
      const data = await res.json();
      const rows = Array.isArray(data.demandes) ? data.demandes : [];
      setDemandes(rows.map(demandeFromServerRow));
    } catch {
      // Réseau indisponible : on garde la copie locale existante.
    } finally {
      setDemandesLoading(false);
    }
  }, []);

  const addDemande = (d: Omit<Demande, "id" | "date" | "status">) =>
    setDemandes(prev => [{ ...d, id: uid(), date: nowFr(), status: "new" }, ...prev]);

  const updateDemandeStatus = async (id: string, status: DemandeStatus) => {
    setDemandes(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    try {
      await fetch(`/.netlify/functions/dashboard-data?resource=demandes&id=${id}`, {
        method: "PATCH",
        headers: AUTH_HEADERS,
        body: JSON.stringify({ status: DEMANDE_STATUS_TO_SERVER[status] }),
      });
    } catch {
      // best-effort ; un refresh manuel resynchronisera si besoin
    }
  };

  const deleteDemande = async (id: string) => {
    setDemandes(prev => prev.filter(d => d.id !== id));
    try {
      await fetch(`/.netlify/functions/dashboard-data?resource=demandes&id=${id}`, {
        method: "DELETE",
        headers: AUTH_HEADERS,
      });
    } catch {
      // best-effort
    }
  };

  // ── Réalisations & posts : pas de table dédiée côté backend, restent locaux ─
  const addRealisation = (r: Omit<Realisation, "id">) =>
    setRealisations(prev => [{ ...r, id: uid() }, ...prev]);

  const updateRealisation = (id: string, patch: Partial<Omit<Realisation, "id">>) =>
    setRealisations(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));

  const deleteRealisation = (id: string) =>
    setRealisations(prev => prev.filter(r => r.id !== id));

  // ── Avis (backend Neon) ─────────────────────────────────────────────────────
  // GET public (sans auth) : uniquement les avis approuvés, pour les visiteurs.
  const refreshPublicAvis = useCallback(async () => {
    try {
      const res = await fetch("/.netlify/functions/avis");
      if (!res.ok) return;
      const data = await res.json();
      const rows = Array.isArray(data.avis) ? data.avis : [];
      setAvis(prev => {
        const fetched = rows.map(avisFromServerRow);
        const others = prev.filter(a => !fetched.some((f: Avis) => f.id === a.id));
        return [...fetched, ...others];
      });
    } catch {
      // best-effort
    }
  }, []);

  // GET équipe (avec auth) : tous les avis, tous statuts, pour le dashboard.
  const refreshAvis = useCallback(async () => {
    setAvisLoading(true);
    try {
      const res = await fetch("/.netlify/functions/dashboard-data?resource=avis", {
        headers: AUTH_HEADERS,
      });
      if (!res.ok) return;
      const data = await res.json();
      const rows = Array.isArray(data.avis) ? data.avis : [];
      setAvis(rows.map(avisFromServerRow));
    } catch {
      // best-effort
    } finally {
      setAvisLoading(false);
    }
  }, []);

  const addAvis = async (a: Omit<Avis, "id" | "date" | "status">): Promise<boolean> => {
    try {
      const res = await fetch("/.netlify/functions/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: a.name,
          rating: a.rating,
          comment: a.comment,
          projectType: a.company,
        }),
      });
      if (!res.ok) throw new Error("Échec de l'envoi.");
      // Copie locale immédiate (en attente) ; la vraie source reste Neon.
      setAvis(prev => [{ ...a, id: uid(), date: nowFr(), status: "pending" }, ...prev]);
      return true;
    } catch {
      return false;
    }
  };

  const updateAvisStatus = async (id: string, status: AvisStatus) => {
    setAvis(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      await fetch(`/.netlify/functions/dashboard-data?resource=avis&id=${id}`, {
        method: "PATCH",
        headers: AUTH_HEADERS,
        body: JSON.stringify({ status: AVIS_STATUS_TO_SERVER[status] }),
      });
    } catch {
      // best-effort
    }
  };

  const deleteAvis = async (id: string) => {
    setAvis(prev => prev.filter(a => a.id !== id));
    try {
      await fetch(`/.netlify/functions/dashboard-data?resource=avis&id=${id}`, {
        method: "DELETE",
        headers: AUTH_HEADERS,
      });
    } catch {
      // best-effort
    }
  };

  const addPost = (p: Omit<Post, "id" | "date">) =>
    setPosts(prev => [{ ...p, id: uid(), date: nowFr() }, ...prev]);

  const updatePost = (id: string, patch: Partial<Omit<Post, "id">>) =>
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));

  const deletePost = (id: string) =>
    setPosts(prev => prev.filter(p => p.id !== id));

  return (
    <DataContext.Provider value={{
      demandes, addDemande, updateDemandeStatus, deleteDemande, refreshDemandes, demandesLoading,
      realisations, addRealisation, updateRealisation, deleteRealisation,
      avis, addAvis, updateAvisStatus, deleteAvis, refreshAvis, refreshPublicAvis, avisLoading,
      posts, addPost, updatePost, deletePost,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData requires DataProvider");
  return ctx;
}
