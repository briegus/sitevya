import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MessageCircle, ArrowRight, Check, ExternalLink } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { useData } from "@/contexts/DataContext";

const DISCORD_INVITE = "https://discord.gg/6x7khm5kKc";

type Method = "none" | "email" | "discord";
type FormState = "idle" | "sending" | "sent";

const PROJECT_TYPES = [
  "Site vitrine",
  "Site connecté à un bot Discord",
];

function EmailForm() {
  const { addDemande } = useData();
  const [formState, setFormState] = useState<FormState>("idle");
  const [data, setData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    description: "",
    deadline: "",
    extra: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Votre nom est requis.";
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) e.email = "Email invalide.";
    if (!data.projectType) e.projectType = "Choisissez un type de projet.";
    if (data.description.trim().length < 20) e.description = "Minimum 20 caractères.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setFormState("sending");

    try {
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company || undefined,
          projectType: data.projectType,
          description: data.description,
          deadline: data.deadline || undefined,
          extra: data.extra || undefined,
        }),
      });
      if (!res.ok) throw new Error("Échec de l'envoi.");

      // Copie locale pour affichage immédiat côté dashboard sur cet appareil ;
      // la vraie source de vérité reste la base Neon, lue par le dashboard.
      addDemande({
        name: data.name,
        email: data.email,
        company: data.company || undefined,
        projectType: data.projectType,
        description: data.description,
        deadline: data.deadline || undefined,
        extra: data.extra || undefined,
        channel: "email",
      });
      setFormState("sent");
    } catch {
      setFormState("idle");
      setErrors({ submit: "Une erreur est survenue. Réessayez ou contactez-nous sur Discord." });
    }
  }

  if (formState === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full sv-gradient-bg mb-5 shadow-lg shadow-purple-900/30">
          <Check className="w-7 h-7 text-white" />
        </div>
        <h4 className="text-white text-xl font-semibold mb-2">Demande envoyée !</h4>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          Votre demande a bien été reçue. Nous reviendrons vers vous rapidement à l&apos;adresse{" "}
          <span className="text-white/70">{data.email}</span>.
        </p>
      </motion.div>
    );
  }

  const inputClass =
    "w-full glass-card rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-purple-500/40 border border-transparent transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Nom *</label>
          <input
            type="text"
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
            placeholder="Votre nom"
            className={inputClass}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Email *</label>
          <input
            type="email"
            value={data.email}
            onChange={e => setData({ ...data, email: e.target.value })}
            placeholder="votre@email.com"
            className={inputClass}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-white/50 text-xs font-medium mb-1.5">Entreprise / Organisation</label>
        <input
          type="text"
          value={data.company}
          onChange={e => setData({ ...data, company: e.target.value })}
          placeholder="Facultatif"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-white/50 text-xs font-medium mb-1.5">Type de projet *</label>
        <select
          value={data.projectType}
          onChange={e => setData({ ...data, projectType: e.target.value })}
          className={`${inputClass} appearance-none cursor-pointer`}
          style={{ colorScheme: "dark" }}
        >
          <option value="" disabled>Choisir...</option>
          {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.projectType && <p className="text-red-400 text-xs mt-1">{errors.projectType}</p>}
      </div>

      <div>
        <label className="block text-white/50 text-xs font-medium mb-1.5">Description du projet *</label>
        <textarea
          value={data.description}
          onChange={e => setData({ ...data, description: e.target.value })}
          placeholder="Décrivez votre projet, vos objectifs, vos contraintes..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-white/50 text-xs font-medium mb-1.5">Délai souhaité</label>
        <input
          type="text"
          value={data.deadline}
          onChange={e => setData({ ...data, deadline: e.target.value })}
          placeholder="Ex : 1 mois, Dès que possible"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-white/50 text-xs font-medium mb-1.5">Informations complémentaires</label>
        <textarea
          value={data.extra}
          onChange={e => setData({ ...data, extra: e.target.value })}
          placeholder="Inspirations, contraintes particulières, contexte..."
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>

      {errors.submit && <p className="text-red-400 text-xs text-center">{errors.submit}</p>}

      <button
        type="submit"
        disabled={formState === "sending"}
        className="w-full flex items-center justify-center gap-2 sv-gradient-bg rounded-xl py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer shadow-lg shadow-purple-900/20"
      >
        {formState === "sending" ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>Envoyer ma demande <ArrowRight className="w-4 h-4" /></>
        )}
      </button>
    </form>
  );
}

function DiscordPath() {
  const steps = [
    { n: "1", text: "Rejoignez notre serveur Discord via le bouton ci-dessous." },
    { n: "2", text: "Rendez-vous dans le salon #support une fois connecté." },
    { n: "3", text: "Ouvrez un ticket en utilisant le bouton ou la commande dédiée." },
    { n: "4", text: "Décrivez votre projet : type, objectifs, délais." },
    { n: "5", text: "Notre équipe vous répondra rapidement." },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {steps.map(step => (
          <div key={step.n} className="flex gap-4 items-start">
            <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full sv-gradient-bg text-white text-xs font-bold">
              {step.n}
            </span>
            <p className="text-white/65 text-sm leading-relaxed pt-0.5">{step.text}</p>
          </div>
        ))}
      </div>
      <a
        href={DISCORD_INVITE}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-[#5865F2]/35 bg-[#5865F2]/10 text-white hover:bg-[#5865F2]/20 transition-colors text-sm font-semibold"
      >
        <MessageCircle className="w-4 h-4 text-[#5865F2]" />
        Rejoindre le serveur Discord
        <ExternalLink className="w-3.5 h-3.5 opacity-40" />
      </a>
    </div>
  );
}

export default function ContactPage() {
  const [method, setMethod] = useState<Method>("none");

  return (
    <PageWrapper centered>
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-white/40 mb-3">
            DÉMARRONS
          </p>
          <h1 className="section-heading text-4xl md:text-6xl text-white mb-3">
            Nous <span className="sv-gradient-text">contacter</span>
          </h1>
          <p className="text-white/45 text-sm">
            Choisissez votre moyen de contact préféré.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => setMethod("email")}
            className={`flex flex-col items-center gap-2.5 py-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
              method === "email"
                ? "border-purple-500/40 bg-purple-900/15 shadow-[0_0_40px_rgba(120,85,184,0.15)]"
                : "glass-card hover:border-white/[0.12]"
            }`}
          >
            <Mail className={`w-5 h-5 ${method === "email" ? "text-purple-300" : "text-white/40"}`} />
            <span className={`text-sm font-semibold ${method === "email" ? "text-white" : "text-white/55"}`}>Par email</span>
            <span className="text-white/25 text-[11px]">Formulaire de contact</span>
          </button>

          <button
            onClick={() => setMethod("discord")}
            className={`flex flex-col items-center gap-2.5 py-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
              method === "discord"
                ? "border-[#5865F2]/35 bg-[#5865F2]/10 shadow-[0_0_40px_rgba(88,101,242,0.12)]"
                : "glass-card hover:border-white/[0.12]"
            }`}
          >
            <MessageCircle className={`w-5 h-5 ${method === "discord" ? "text-[#5865F2]" : "text-white/40"}`} />
            <span className={`text-sm font-semibold ${method === "discord" ? "text-white" : "text-white/55"}`}>Via Discord</span>
            <span className="text-white/25 text-[11px]">Ticket support</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {method !== "none" && (
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="glass-panel rounded-3xl p-6 md:p-8"
            >
              {method === "email" ? <EmailForm /> : <DiscordPath />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
