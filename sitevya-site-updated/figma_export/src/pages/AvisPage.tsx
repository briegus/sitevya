import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Check, MessageSquarePlus } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { useData } from "@/contexts/DataContext";

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              n <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ onSuccess }: { onSuccess: () => void }) {
  const { addAvis } = useData();
  type FS = "idle" | "sending" | "sent";
  const [state, setState] = useState<FS>("idle");
  const [data, setData] = useState({ name: "", company: "", rating: 0, comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Votre prénom est requis.";
    if (data.rating === 0) e.rating = "Choisissez une note.";
    if (data.comment.trim().length < 15) e.comment = "Minimum 15 caractères.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    const ok = await addAvis({ name: data.name, company: data.company || undefined, rating: data.rating, comment: data.comment });
    if (ok) {
      setState("sent");
      setTimeout(onSuccess, 2000);
    } else {
      setState("idle");
      setErrors({ submit: "Une erreur est survenue. Réessayez plus tard." });
    }
  }

  if (state === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full sv-gradient-bg mb-4 shadow-lg shadow-purple-900/30">
          <Check className="w-6 h-6 text-white" />
        </div>
        <h4 className="text-white text-lg font-semibold mb-1">Avis envoyé, merci !</h4>
        <p className="text-white/45 text-sm">Il sera publié après vérification par notre équipe.</p>
      </motion.div>
    );
  }

  const inputClass =
    "w-full glass-card rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none border border-transparent focus:border-purple-500/40 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Prénom ou nom *</label>
          <input
            type="text"
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
            placeholder="Votre prénom"
            className={inputClass}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Entreprise / Projet</label>
          <input
            type="text"
            value={data.company}
            onChange={e => setData({ ...data, company: e.target.value })}
            placeholder="Facultatif"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-white/50 text-xs font-medium mb-2">Note *</label>
        <StarRating value={data.rating} onChange={n => { setData({ ...data, rating: n }); setErrors(p => ({ ...p, rating: "" })); }} />
        {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
      </div>

      <div>
        <label className="block text-white/50 text-xs font-medium mb-1.5">Votre avis *</label>
        <textarea
          value={data.comment}
          onChange={e => setData({ ...data, comment: e.target.value })}
          placeholder="Partagez votre expérience avec Sitévya..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
        {errors.comment && <p className="text-red-400 text-xs mt-1">{errors.comment}</p>}
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full flex items-center justify-center gap-2 sv-gradient-bg rounded-xl py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer shadow-lg shadow-purple-900/20"
      >
        {state === "sending" ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi...
          </>
        ) : "Envoyer mon avis"}
      </button>

      {errors.submit && <p className="text-red-400 text-xs text-center">{errors.submit}</p>}

      <p className="text-white/25 text-xs text-center">
        Votre avis sera vérifié avant publication.
      </p>
    </form>
  );
}

export default function AvisPage() {
  const { avis, refreshPublicAvis } = useData();
  const published = avis.filter(a => a.status === "published");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    refreshPublicAvis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const avg = published.length
    ? Math.round((published.reduce((s, a) => s + a.rating, 0) / published.length) * 10) / 10
    : null;

  return (
    <PageWrapper centered>
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-white/40 mb-3">
            TÉMOIGNAGES
          </p>
          <h1 className="section-heading text-4xl md:text-6xl text-white mb-5">
            Ce que disent{" "}
            <span className="sv-gradient-text">nos clients</span>
          </h1>

          {published.length > 0 && avg !== null && (
            <>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} className={`w-5 h-5 ${n <= Math.round(avg) ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                ))}
              </div>
              <p className="text-white/35 text-sm">
                {avg}/5 — {published.length} avis vérifié{published.length > 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>

        {published.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center mb-8">
            <MessageSquarePlus className="w-10 h-10 text-white/15 mx-auto mb-4" />
            <p className="text-white/40 text-base font-medium mb-1">Pas encore d&apos;avis publiés</p>
            <p className="text-white/25 text-sm">
              Les premiers avis clients apparaîtront ici après vérification.
            </p>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl overflow-hidden mb-8">
            {published.map((review, i) => (
              <div
                key={review.id}
                className={`p-7 flex flex-col gap-5 ${i < published.length - 1 ? "border-b border-white/[0.06]" : ""}`}
              >
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-base leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full sv-gradient-bg text-white text-xs font-bold shrink-0">
                    {review.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{review.name}</p>
                    {review.company && <p className="text-white/40 text-xs">{review.company}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="glass-panel rounded-3xl overflow-hidden">
          <button
            onClick={() => setShowForm(v => !v)}
            className="w-full flex items-center justify-between px-7 py-5 text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div>
              <p className="text-white font-medium text-sm">Laisser un avis</p>
              <p className="text-white/35 text-xs mt-0.5">Partagez votre expérience avec Sitévya</p>
            </div>
            <motion.div
              animate={{ rotate: showForm ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-white/40 text-xl font-light"
            >
              +
            </motion.div>
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-7 pb-7 pt-2 border-t border-white/[0.06]">
                  <ReviewForm onSuccess={() => setShowForm(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
