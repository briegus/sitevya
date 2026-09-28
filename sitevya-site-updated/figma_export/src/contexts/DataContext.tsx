import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { getAuthHeaders } from "./AuthContext";

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
  addRealisation: (r: Omit<Realisation, "id">) => Promise<boolean>;
  updateRealisation: (id: string, patch: Partial<Omit<Realisation, "id">>) => void;
  deleteRealisation: (id: string) => void;
  refreshRealisations: () => Promise<void>;
  refreshPublicRealisations: () => Promise<void>;
  realisationsLoading: boolean;

  avis: Avis[];
  addAvis: (a: Omit<Avis, "id" | "date" | "status">) => Promise<boolean>;
  updateAvisStatus: (id: string, status: AvisStatus) => void;
  deleteAvis: (id: string) => void;
  refreshAvis: () => Promise<void>;
  refreshPublicAvis: () => Promise<void>;
  avisLoading: boolean;

  posts: Post[];
  addPost: (p: Omit<Post, "id" | "date">) => Promise<boolean>;
  updatePost: (id: string, patch: Partial<Omit<Post, "id">>) => void;
  deletePost: (id: string) => void;
  refreshPosts: () => Promise<void>;
  postsLoading: boolean;
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

function realisationFromServerRow(row: Record<string, unknown>): Realisation {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    category: String(row.category ?? ""),
    date: String(row.project_date ?? ""),
    link: (row.link as string) ?? undefined,
    published: Boolean(row.published),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
  };
}

function postFromServerRow(row: Record<string, unknown>): Post {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    content: String(row.content ?? ""),
    date: formatServerDate(String(row.created_at)),
    published: Boolean(row.published),
  };
}

const DataContext = createContext<DataCtx | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowFr() {
  return new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function DataProvider({ children }: { children: ReactNode }) {
  // Toutes les données viennent de Neon (via netlify/functions), rien n'est gardé dans le navigateur.
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [demandesLoading, setDemandesLoading] = useState(false);
  const [avisLoading, setAvisLoading] = useState(false);
  const [realisationsLoading, setRealisationsLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);


  // ── Demandes (backend Neon, accès équipe) ──────────────────────────────────
  const refreshDemandes = useCallback(async () => {
    setDemandesLoading(true);
    try {
      const res = await fetch("/.netlify/functions/dashboard-data?resource=demandes", {
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
      });
    } catch {
      // best-effort
    }
  };

  // ── Réalisations (backend Neon) ─────────────────────────────────────────────
  // GET public (sans auth) : uniquement les réalisations publiées, pour les visiteurs.
  const refreshPublicRealisations = useCallback(async () => {
    try {
      const res = await fetch("/.netlify/functions/content?resource=realisations");
      if (!res.ok) return;
      const data = await res.json();
      const rows = Array.isArray(data.realisations) ? data.realisations : [];
      setRealisations(rows.map(realisationFromServerRow));
    } catch {
      // best-effort
    }
  }, []);

  // GET équipe (avec auth) : toutes les réalisations, publiées ou non, pour le dashboard.
  const refreshRealisations = useCallback(async () => {
    setRealisationsLoading(true);
    try {
      const res = await fetch("/.netlify/functions/dashboard-data?resource=realisations", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      const rows = Array.isArray(data.realisations) ? data.realisations : [];
      setRealisations(rows.map(realisationFromServerRow));
    } catch {
      // best-effort
    } finally {
      setRealisationsLoading(false);
    }
  }, []);

  const addRealisation = async (r: Omit<Realisation, "id">): Promise<boolean> => {
    try {
      const res = await fetch("/.netlify/functions/dashboard-data?resource=realisations", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: r.title,
          description: r.description,
          category: r.category,
          projectDate: r.date,
          link: r.link,
          published: r.published,
          tags: r.tags,
        }),
      });
      if (!res.ok) throw new Error("Échec de la création.");
      const data = await res.json();
      setRealisations(prev => [realisationFromServerRow(data.row), ...prev]);
      return true;
    } catch {
      return false;
    }
  };

  const updateRealisation = async (id: string, patch: Partial<Omit<Realisation, "id">>) => {
    setRealisations(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
    try {
      await fetch(`/.netlify/functions/dashboard-data?resource=realisations&id=${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: patch.title,
          description: patch.description,
          category: patch.category,
          projectDate: patch.date,
          link: patch.link,
          published: patch.published,
          tags: patch.tags,
        }),
      });
    } catch {
      // best-effort
    }
  };

  const deleteRealisation = async (id: string) => {
    setRealisations(prev => prev.filter(r => r.id !== id));
    try {
      await fetch(`/.netlify/functions/dashboard-data?resource=realisations&id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } catch {
      // best-effort
    }
  };

  // ── Avis (backend Neon) ─────────────────────────────────────────────────────
  // GET public (sans auth) : uniquement les avis approuvés, pour les visiteurs.
  const refreshPublicAvis = useCallback(async () => {
    try {
      const res = await fetch("/.netlify/functions/avis");
      if (!res.ok) return;
      const data = await res.json();
      const rows = Array.isArray(data.avis) ? data.avis : [];
      setAvis(rows.map(avisFromServerRow));
    } catch {
      // best-effort
    }
  }, []);

  // GET équipe (avec auth) : tous les avis, tous statuts, pour le dashboard.
  const refreshAvis = useCallback(async () => {
    setAvisLoading(true);
    try {
      const res = await fetch("/.netlify/functions/dashboard-data?resource=avis", {
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
      });
    } catch {
      // best-effort
    }
  };

  // ── Posts (backend Neon, équipe uniquement) ─────────────────────────────────
  const refreshPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await fetch("/.netlify/functions/dashboard-data?resource=posts", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      const rows = Array.isArray(data.posts) ? data.posts : [];
      setPosts(rows.map(postFromServerRow));
    } catch {
      // best-effort
    } finally {
      setPostsLoading(false);
    }
  }, []);

  const addPost = async (p: Omit<Post, "id" | "date">): Promise<boolean> => {
    try {
      const res = await fetch("/.netlify/functions/dashboard-data?resource=posts", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: p.title, content: p.content, published: p.published }),
      });
      if (!res.ok) throw new Error("Échec de la création.");
      const data = await res.json();
      setPosts(prev => [postFromServerRow(data.row), ...prev]);
      return true;
    } catch {
      return false;
    }
  };

  const updatePost = async (id: string, patch: Partial<Omit<Post, "id">>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
    try {
      await fetch(`/.netlify/functions/dashboard-data?resource=posts&id=${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: patch.title, content: patch.content, published: patch.published }),
      });
    } catch {
      // best-effort
    }
  };

  const deletePost = async (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/.netlify/functions/dashboard-data?resource=posts&id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } catch {
      // best-effort
    }
  };

  return (
    <DataContext.Provider value={{
      demandes, addDemande, updateDemandeStatus, deleteDemande, refreshDemandes, demandesLoading,
      realisations, addRealisation, updateRealisation, deleteRealisation, refreshRealisations, refreshPublicRealisations, realisationsLoading,
      avis, addAvis, updateAvisStatus, deleteAvis, refreshAvis, refreshPublicAvis, avisLoading,
      posts, addPost, updatePost, deletePost, refreshPosts, postsLoading,
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
