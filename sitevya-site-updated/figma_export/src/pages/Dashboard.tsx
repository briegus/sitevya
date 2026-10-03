import { useState, useEffect, useRef } from "react";
import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  LayoutDashboard, FileText, Layers, Star, Settings, Newspaper,
  ArrowLeft, Bell, Search, CheckCircle2, Clock, XCircle, Eye, EyeOff,
  Plus, Trash2, Pencil, Check, X, LogOut, ChevronDown, ChevronUp,
  AlertCircle,
} from "lucide-react";
import logo from "@/imports/657e8584-5d7e-45d0-84aa-8c15c5f80e83.png";
import { useAuth } from "@/contexts/AuthContext";
import { useData, type Demande, type DemandeStatus, type Realisation, type Avis, type Post } from "@/contexts/DataContext";

type Tab = "overview" | "demandes" | "realisations" | "avis" | "posts" | "parametres";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "demandes", label: "Demandes", icon: FileText },
  { id: "realisations", label: "Réalisations", icon: Layers },
  { id: "avis", label: "Avis", icon: Star },
  { id: "posts", label: "Posts", icon: Newspaper },
  { id: "parametres", label: "Paramètres", icon: Settings },
];

const STATUS_CFG = {
  new: { label: "Nouveau", cls: "bg-blue-500/15 text-blue-400 border-blue-500/20", Icon: Bell },
  in_progress: { label: "En cours", cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", Icon: Clock },
  done: { label: "Terminé", cls: "bg-green-500/15 text-green-400 border-green-500/20", Icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: DemandeStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.cls}`}>
      <cfg.Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

const inputClass =
  "w-full glass-card rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/25 outline-none border border-transparent focus:border-purple-500/40 transition-colors";

// ── Overview ──────────────────────────────────────────────────────────────────

function Overview({ onTab }: { onTab: (t: Tab) => void }) {
  const { demandes, realisations, avis, posts, refreshDemandes, refreshRealisations, refreshAvis, refreshPosts } = useData();

  useEffect(() => {
    refreshDemandes();
    refreshRealisations();
    refreshAvis();
    refreshPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pending = avis.filter(a => a.status === "pending");
  const published = realisations.filter(r => r.published);
  const newDemandes = demandes.filter(d => d.status === "new");

  const stats = [
    { label: "Demandes", value: demandes.length, sub: `${newDemandes.length} nouveau${newDemandes.length > 1 ? "x" : ""}`, color: "sv-gradient-text", tab: "demandes" as Tab },
    { label: "En cours", value: demandes.filter(d => d.status === "in_progress").length, sub: "projets actifs", color: "text-yellow-400", tab: "demandes" as Tab },
    { label: "Réalisations", value: published.length, sub: "publiées", color: "text-green-400", tab: "realisations" as Tab },
    { label: "Avis en attente", value: pending.length, sub: "à modérer", color: "text-orange-400", tab: "avis" as Tab },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold mb-1">Tableau de bord</h2>
        <p className="text-white/35 text-sm">Vue d&apos;ensemble de l&apos;activité Sitévya</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <button
            key={s.label}
            onClick={() => onTab(s.tab)}
            className="glass-card rounded-2xl p-5 text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider mb-3">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/30 text-xs mt-1">{s.sub}</p>
          </button>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="glass-card rounded-2xl p-4 flex items-start gap-3 border-l-2 border-orange-400/50">
          <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-white text-sm font-medium">
              {pending.length} avis en attente de modération
            </p>
            <button onClick={() => onTab("avis")} className="text-orange-400 text-xs hover:underline mt-0.5 cursor-pointer">
              Gérer les avis →
            </button>
          </div>
        </div>
      )}

      {demandes.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center">
          <p className="text-white/25 text-sm">Aucune demande reçue pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-white font-medium text-sm">Dernières demandes</h3>
            <button onClick={() => onTab("demandes")} className="text-white/35 hover:text-white text-xs transition-colors cursor-pointer">
              Tout voir →
            </button>
          </div>
          {demandes.slice(0, 4).map(d => (
            <div key={d.id} className="px-6 py-4 flex items-center gap-4 border-b border-white/[0.04] last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{d.name}</p>
                <p className="text-white/35 text-xs truncate">{d.projectType}</p>
              </div>
              <StatusBadge status={d.status} />
              <span className="text-white/25 text-xs hidden sm:block whitespace-nowrap">{d.date}</span>
            </div>
          ))}
        </div>
      )}

      {posts.filter(p => p.published).length > 0 && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-white font-medium text-sm">Posts récents</h3>
          </div>
          {posts.filter(p => p.published).slice(0, 3).map(p => (
            <div key={p.id} className="px-6 py-3.5 flex items-center gap-4 border-b border-white/[0.04] last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{p.title}</p>
                <p className="text-white/30 text-xs">{p.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Demandes ──────────────────────────────────────────────────────────────────

function DemandesTab() {
  const { demandes, updateDemandeStatus, deleteDemande, refreshDemandes, demandesLoading } = useData();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    refreshDemandes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = demandes.filter(d =>
    [d.name, d.email, d.projectType].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-white text-xl font-semibold mb-1">Demandes</h2>
        <p className="text-white/35 text-sm">Demandes de projet reçues via le formulaire de contact</p>
      </div>

      {demandesLoading && demandes.length === 0 ? (
        <div className="glass-panel rounded-2xl p-14 text-center">
          <p className="text-white/30 text-sm">Chargement des demandes...</p>
        </div>
      ) : demandes.length === 0 ? (
        <div className="glass-panel rounded-2xl p-14 text-center">
          <p className="text-white/30 text-sm">Aucune demande reçue pour l&apos;instant.</p>
          <p className="text-white/18 text-xs mt-2">Les demandes envoyées via la page Contact apparaîtront ici.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-3">
            <Search className="w-4 h-4 text-white/25 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email, type..."
              className="flex-1 bg-transparent text-white/60 text-sm placeholder-white/25 outline-none"
            />
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(d => (
              <div key={d.id}>
                <div
                  className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.015] transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{d.name}</p>
                    <p className="text-white/35 text-xs truncate">{d.email} — {d.projectType}</p>
                  </div>
                  <StatusBadge status={d.status} />
                  <span className="text-white/25 text-xs hidden sm:block whitespace-nowrap">{d.date}</span>
                  {expanded === d.id ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
                </div>

                {expanded === d.id && (
                  <div className="px-5 pb-5 space-y-4 border-t border-white/[0.04] bg-white/[0.01]">
                    <div className="grid sm:grid-cols-2 gap-3 mt-4 text-xs">
                      {d.company && <div><span className="text-white/35">Entreprise : </span><span className="text-white/70">{d.company}</span></div>}
                      {d.deadline && <div><span className="text-white/35">Délai : </span><span className="text-white/70">{d.deadline}</span></div>}
                      <div><span className="text-white/35">Canal : </span><span className="text-white/70">{d.channel}</span></div>
                    </div>
                    <div>
                      <p className="text-white/35 text-xs mb-1">Description</p>
                      <p className="text-white/65 text-sm leading-relaxed">{d.description}</p>
                    </div>
                    {d.extra && (
                      <div>
                        <p className="text-white/35 text-xs mb-1">Infos complémentaires</p>
                        <p className="text-white/65 text-sm leading-relaxed">{d.extra}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-white/35 text-xs">Statut :</span>
                      {(["new", "in_progress", "done"] as DemandeStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => updateDemandeStatus(d.id, s)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            d.status === s
                              ? STATUS_CFG[s].cls
                              : "border-white/10 text-white/35 hover:border-white/20"
                          }`}
                        >
                          {STATUS_CFG[s].label}
                        </button>
                      ))}
                      <button
                        onClick={() => { setExpanded(null); deleteDemande(d.id); }}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-red-400/70 hover:text-red-400 border border-red-500/15 hover:border-red-500/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-5 py-10 text-center text-white/25 text-sm">
                Aucun résultat pour &ldquo;{search}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Réalisations ──────────────────────────────────────────────────────────────

const REALISATION_CATEGORIES = [
  "Site vitrine",
  "Portfolio",
  "Site communautaire",
  "E-commerce",
  "Site personnalisé",
  "Site connecté à un bot Discord",
  "Dashboard Discord",
];

type RForm = Omit<Realisation, "id">;
const emptyRForm = (): RForm => ({
  title: "",
  description: "",
  category: "",
  date: "",
  link: "",
  published: false,
  tags: [],
});

function RealisationsTab() {
  const { realisations, addRealisation, updateRealisation, deleteRealisation, refreshRealisations } = useData();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    refreshRealisations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<RForm>(emptyRForm());
  const [tagsInput, setTagsInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function openNew() {
    setEditId(null);
    setForm(emptyRForm());
    setTagsInput("");
    setErrors({});
    setShowForm(true);
  }

  function openEdit(r: Realisation) {
    setEditId(r.id);
    setForm({ ...r });
    setTagsInput(r.tags.join(", "));
    setErrors({});
    setShowForm(true);
  }

  function validate(f: RForm) {
    const e: Record<string, string> = {};
    if (!f.title.trim()) e.title = "Titre requis.";
    if (!f.category) e.category = "Catégorie requise.";
    if (!f.date.trim()) e.date = "Date requise.";
    return e;
  }

  async function handleSave() {
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const data = { ...form, tags };
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (editId) {
      await updateRealisation(editId, data);
    } else {
      const ok = await addRealisation(data);
      if (!ok) {
        setErrors({ title: "Échec de l'enregistrement. Vérifiez la connexion et TEAM_API_PASSWORD." });
        return;
      }
    }
    setShowForm(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold mb-1">Réalisations</h2>
          <p className="text-white/35 text-sm">Portfolio Sitévya — visible sur le site public</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 sv-gradient-bg rounded-xl px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-purple-900/20"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-medium text-sm">{editId ? "Modifier la réalisation" : "Nouvelle réalisation"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/40 text-xs mb-1">Titre *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Nom du projet" className={inputClass} />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-white/40 text-xs mb-1">Catégorie *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={`${inputClass} appearance-none cursor-pointer`} style={{ colorScheme: "dark" }}>
                <option value="" disabled>Choisir...</option>
                {REALISATION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>
          <div>
            <label className="block text-white/40 text-xs mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Décrivez ce projet..." rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/40 text-xs mb-1">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass} style={{ colorScheme: "dark" }} />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-white/40 text-xs mb-1">Lien du projet</label>
              <input value={form.link ?? ""} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-white/40 text-xs mb-1">Tags (séparés par des virgules)</label>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Design, Animation, SEO..." className={inputClass} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setForm({ ...form, published: !form.published })}
              className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${form.published ? "sv-gradient-bg" : "bg-white/10"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white m-0.5 transition-transform ${form.published ? "translate-x-4" : ""}`} />
            </div>
            <span className="text-white/50 text-sm">{form.published ? "Publié" : "Non publié"}</span>
          </label>
          <div className="flex items-center gap-2 pt-1">
            <button onClick={handleSave} className="flex items-center gap-1.5 sv-gradient-bg rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer">
              <Check className="w-4 h-4" /> Enregistrer
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-1.5 glass-card rounded-xl px-5 py-2.5 text-sm text-white/50 hover:text-white transition-colors cursor-pointer">
              <X className="w-4 h-4" /> Annuler
            </button>
          </div>
        </div>
      )}

      {realisations.length === 0 ? (
        <div className="glass-panel rounded-2xl p-14 text-center">
          <p className="text-white/30 text-sm">Aucune réalisation ajoutée.</p>
          <p className="text-white/18 text-xs mt-2">Cliquez sur &ldquo;Ajouter&rdquo; pour créer la première.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/[0.04]">
            {realisations.map(r => (
              <div key={r.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{r.title}</p>
                  <p className="text-white/35 text-xs">{r.category} — {r.date}</p>
                </div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${r.published ? "bg-green-500/15 text-green-400" : "bg-white/8 text-white/35"}`}>
                  {r.published ? "Publié" : "Brouillon"}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => updateRealisation(r.id, { published: !r.published })} className="w-8 h-8 flex items-center justify-center rounded-lg glass-card hover:bg-white/[0.08] transition-colors text-white/40 hover:text-white cursor-pointer" title={r.published ? "Dépublier" : "Publier"}>
                    {r.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => openEdit(r)} className="w-8 h-8 flex items-center justify-center rounded-lg glass-card hover:bg-white/[0.08] transition-colors text-white/40 hover:text-white cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteRealisation(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg glass-card hover:bg-red-500/15 transition-colors text-white/40 hover:text-red-400 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Avis ──────────────────────────────────────────────────────────────────────

function AvisTab() {
  const { avis, updateAvisStatus, deleteAvis, refreshAvis, avisLoading } = useData();
  const [filter, setFilter] = useState<"all" | "pending" | "published" | "rejected">("pending");

  useEffect(() => {
    refreshAvis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = filter === "all" ? avis : avis.filter(a => a.status === filter);
  const pendingCount = avis.filter(a => a.status === "pending").length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-white text-xl font-semibold mb-1">Avis</h2>
        <p className="text-white/35 text-sm">Modération des avis clients</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { v: "pending" as const, label: `En attente${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
          { v: "published" as const, label: "Publiés" },
          { v: "rejected" as const, label: "Refusés" },
          { v: "all" as const, label: "Tous" },
        ].map(({ v, label }) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              filter === v
                ? "sv-gradient-bg text-white border-transparent"
                : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {avisLoading && avis.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-white/30 text-sm">Chargement des avis...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-white/30 text-sm">Aucun avis dans cette catégorie.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
          {filtered.map(a => (
            <div key={a.id} className="p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-white text-sm font-medium">{a.name}</span>
                  {a.company && <span className="text-white/35 text-xs">— {a.company}</span>}
                  <div className="flex gap-0.5">
                    {Array.from({ length: a.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    a.status === "published" ? "bg-green-500/15 text-green-400"
                    : a.status === "rejected" ? "bg-red-500/15 text-red-400"
                    : "bg-orange-500/15 text-orange-400"
                  }`}>
                    {a.status === "published" ? "Publié" : a.status === "rejected" ? "Refusé" : "En attente"}
                  </span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{a.comment}</p>
                <p className="text-white/20 text-xs mt-1">{a.date}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {a.status !== "published" && (
                  <button
                    onClick={() => updateAvisStatus(a.id, "published")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass-card hover:bg-green-500/15 transition-colors text-white/40 hover:text-green-400 cursor-pointer text-xs"
                  >
                    <Check className="w-3 h-3" /> Valider
                  </button>
                )}
                {a.status !== "rejected" && (
                  <button
                    onClick={() => updateAvisStatus(a.id, "rejected")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass-card hover:bg-red-500/15 transition-colors text-white/40 hover:text-red-400 cursor-pointer text-xs"
                  >
                    <XCircle className="w-3 h-3" /> Refuser
                  </button>
                )}
                <button
                  onClick={() => deleteAvis(a.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg glass-card hover:bg-red-500/15 transition-colors text-white/30 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Posts ──────────────────────────────────────────────────────────────────────

type PForm = Omit<Post, "id" | "date">;
const emptyPForm = (): PForm => ({ title: "", content: "", published: false });

function PostsTab() {
  const { posts, addPost, updatePost, deletePost, refreshPosts } = useData();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    refreshPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PForm>(emptyPForm());
  const [errors, setErrors] = useState<Record<string, string>>({});

  function openNew() {
    setEditId(null);
    setForm(emptyPForm());
    setErrors({});
    setShowForm(true);
  }

  function openEdit(p: Post) {
    setEditId(p.id);
    setForm({ title: p.title, content: p.content, published: p.published });
    setErrors({});
    setShowForm(true);
  }

  async function handleSave() {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Titre requis.";
    if (!form.content.trim()) errs.content = "Contenu requis.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (editId) await updatePost(editId, form);
    else {
      const ok = await addPost(form);
      if (!ok) {
        setErrors({ title: "Échec de l'enregistrement. Vérifiez la connexion et TEAM_API_PASSWORD." });
        return;
      }
    }
    setShowForm(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold mb-1">Posts</h2>
          <p className="text-white/35 text-sm">Publications et actualités Sitévya</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 sv-gradient-bg rounded-xl px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-purple-900/20"
        >
          <Plus className="w-4 h-4" /> Nouveau post
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-medium text-sm">{editId ? "Modifier le post" : "Nouveau post"}</h3>
          <div>
            <label className="block text-white/40 text-xs mb-1">Titre *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Titre du post..." className={inputClass} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-white/40 text-xs mb-1">Contenu *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Contenu du post..." rows={6} className={`${inputClass} resize-none`} />
            {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setForm({ ...form, published: !form.published })}
              className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${form.published ? "sv-gradient-bg" : "bg-white/10"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white m-0.5 transition-transform ${form.published ? "translate-x-4" : ""}`} />
            </div>
            <span className="text-white/50 text-sm">{form.published ? "Publié" : "Brouillon"}</span>
          </label>
          <div className="flex items-center gap-2 pt-1">
            <button onClick={handleSave} className="flex items-center gap-1.5 sv-gradient-bg rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 cursor-pointer">
              <Check className="w-4 h-4" /> Enregistrer
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-1.5 glass-card rounded-xl px-5 py-2.5 text-sm text-white/50 hover:text-white transition-colors cursor-pointer">
              <X className="w-4 h-4" /> Annuler
            </button>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-14 text-center">
          <p className="text-white/30 text-sm">Pas encore de publication.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
          {posts.map(p => (
            <div key={p.id} className="px-5 py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{p.title}</p>
                <p className="text-white/35 text-xs mt-0.5">{p.date}</p>
                <p className="text-white/40 text-xs mt-1 line-clamp-1">{p.content}</p>
              </div>
              <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0 ${p.published ? "bg-green-500/15 text-green-400" : "bg-white/8 text-white/35"}`}>
                {p.published ? "Publié" : "Brouillon"}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => updatePost(p.id, { published: !p.published })} className="w-8 h-8 flex items-center justify-center rounded-lg glass-card hover:bg-white/[0.08] transition-colors text-white/40 hover:text-white cursor-pointer" title={p.published ? "Dépublier" : "Publier"}>
                  {p.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-lg glass-card hover:bg-white/[0.08] transition-colors text-white/40 hover:text-white cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deletePost(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg glass-card hover:bg-red-500/15 transition-colors text-white/40 hover:text-red-400 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Paramètres ────────────────────────────────────────────────────────────────

function ParametresTab() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-white text-xl font-semibold mb-1">Paramètres</h2>
        <p className="text-white/35 text-sm">Configuration et intégrations</p>
      </div>

      <div className="space-y-4">
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-white font-medium text-sm mb-4">Email</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
              <span className="text-white/45">Adresse officielle</span>
              <span className="text-white/70 font-mono text-xs">sitevya@outlook.fr</span>
            </div>
            <div className="glass-card rounded-xl p-4 text-xs text-white/40 leading-relaxed">
              Pour activer les notifications email lors des nouvelles demandes, configurez une intégration SMTP ou Microsoft Graph API dans votre environnement serveur. Utilisez des variables d&apos;environnement pour stocker les identifiants — ne jamais les exposer dans le frontend.
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-white font-medium text-sm mb-4">Discord</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
              <span className="text-white/45">Invitation serveur</span>
              <a href="https://discord.gg/6x7khm5kKc" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] font-mono text-xs hover:underline">
                discord.gg/6x7khm5kKc
              </a>
            </div>
            <div className="glass-card rounded-xl p-4 text-xs text-white/40 leading-relaxed">
              L&apos;intégration Discord (webhook, bot, notifications, création de tickets) nécessite un backend et un token bot configuré côté serveur. Préparez votre token via les variables d&apos;environnement.
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-white font-medium text-sm mb-4">Base de données</h3>
          <div className="glass-card rounded-xl p-4 text-xs text-white/40 leading-relaxed">
            Les demandes et les avis sont stockés dans Neon/PostgreSQL et lus en direct depuis ce dashboard. Les réalisations et les posts restent gérés localement (pas de table dédiée) — ajoutez-les au schéma si vous voulez aussi les persister côté serveur.
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-white font-medium text-sm mb-4">Authentification</h3>
          <div className="glass-card rounded-xl p-4 text-xs text-white/40 leading-relaxed">
            Le mot de passe est vérifié côté serveur : il correspond à la variable Netlify <span className="text-white/60 font-mono">TEAM_API_PASSWORD</span>. Pour le changer, modifiez cette variable puis redéployez.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard shell ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  const content: Record<Tab, React.ReactElement> = {
    overview: <Overview onTab={t => { setActiveTab(t); setSidebarOpen(false); }} />,
    demandes: <DemandesTab />,
    realisations: <RealisationsTab />,
    avis: <AvisTab />,
    posts: <PostsTab />,
    parametres: <ParametresTab />,
  };

  const dashboardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={dashboardRef}
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.5 }}
      // Même piège que PageWrapper : `filter` reste posé en style inline même à
      // "blur(0px)", ce qui coupe le `backdrop-filter` de tout le verre à l'intérieur
      // (sidebar, cartes) du fond animé derrière. On le retire une fois l'entrée finie.
      onAnimationComplete={(definition) => {
        if (definition === "animate" && dashboardRef.current) {
          dashboardRef.current.style.filter = "";
        }
      }}
      className="relative z-10 min-h-screen flex"
    >
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-60 flex flex-col glass-panel transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ borderRadius: 0, borderTop: "none", borderBottom: "none", borderLeft: "none" }}
      >
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <img src={logo} alt="Sitévya" className="h-7 w-auto object-contain" />
          <p className="text-white/25 text-[10px] mt-1 font-medium uppercase tracking-wider">Espace équipe</p>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active ? "sv-gradient-bg text-white shadow-lg shadow-purple-900/20" : "text-white/45 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-6 space-y-2">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/35 hover:text-white hover:bg-white/[0.04] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour au site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-20 flex items-center gap-4 px-6 py-3.5 glass-panel"
          style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}
        >
          <button onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu" className="lg:hidden text-white/40 hover:text-white cursor-pointer">
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <span className="text-white/30 text-sm hidden sm:block">
            {NAV_ITEMS.find(n => n.id === activeTab)?.label}
          </span>
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/40">Connecté</span>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8 max-w-4xl w-full">
          {content[activeTab]}
        </main>
      </div>
    </motion.div>
  );
}
