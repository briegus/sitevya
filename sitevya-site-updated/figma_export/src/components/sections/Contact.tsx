import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MessageCircle, ArrowRight, Check, ExternalLink } from "lucide-react";
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
    projectType: "",
    description: "",
    extra: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Votre nom est requis.";
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email))
      e.email = "Adresse email invalide.";
    if (!data.projectType) e.projectType = "Choisissez un type de projet.";
    if (!data.description.trim() || data.description.length < 20)
      e.description = "Décrivez votre projet (20 caractères min).";
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
          projectType: data.projectType,
          description: data.description,
          extra: data.extra || undefined,
        }),
      });
      if (!res.ok) throw new Error("Échec de l'envoi.");

      addDemande({
        name: data.name,
        email: data.email,
        projectType: data.projectType,
        description: data.description,
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
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full sv-gradient-bg mb-5">
          <Check className="w-7 h-7 text-white" />
        </div>
        <h4 className="text-white text-xl font-semibold mb-2">
          Message envoyé !
        </h4>
        <p className="text-white/55 text-sm">
          Nous reviendrons vers vous dans les plus brefs délais.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">
            Nom *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Votre nom"
            className="w-full glass-card rounded-xl border border-transparent px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">
            Email *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="votre@email.com"
            className="w-full glass-card rounded-xl border border-transparent px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-white/60 text-xs font-medium mb-1.5">
          Type de projet *
        </label>
        <select
          value={data.projectType}
          onChange={(e) => setData({ ...data, projectType: e.target.value })}
          className="w-full glass-card rounded-xl border border-transparent px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
          style={{ colorScheme: "dark" }}
        >
          <option value="" disabled>
            Choisir un type de projet...
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p className="text-red-400 text-xs mt-1">{errors.projectType}</p>
        )}
      </div>

      <div>
        <label className="block text-white/60 text-xs font-medium mb-1.5">
          Description du projet *
        </label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder="Décrivez votre projet, vos objectifs, vos contraintes..."
          rows={4}
          className="w-full glass-card rounded-xl border border-transparent px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
        />
        {errors.description && (
          <p className="text-red-400 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-white/60 text-xs font-medium mb-1.5">
          Informations complémentaires
        </label>
        <textarea
          value={data.extra}
          onChange={(e) => setData({ ...data, extra: e.target.value })}
          placeholder="Délais souhaités, inspirations, contraintes particulières..."
          rows={2}
          className="w-full glass-card rounded-xl border border-transparent px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={formState === "sending"}
        className="w-full flex items-center justify-center gap-2 sv-gradient-bg rounded-xl py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
      >
        {formState === "sending" ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
            Envoi en cours...
          </>
        ) : (
          <>
            Envoyer ma demande
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
      {errors.submit && <p className="text-red-400 text-xs text-center">{errors.submit}</p>}
    </form>
  );
}

function DiscordPath() {
  const steps = [
    {
      n: "1",
      text: "Rejoignez notre serveur Discord via le bouton ci-dessous.",
    },
    {
      n: "2",
      text: 'Rendez-vous dans le salon #support une fois connecté.',
    },
    {
      n: "3",
      text: "Ouvrez un ticket en utilisant la commande ou le bouton dédié.",
    },
    {
      n: "4",
      text: "Décrivez votre projet : type, objectifs, délais.",
    },
    { n: "5", text: "Notre équipe vous répondra dans les plus brefs délais." },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.n} className="flex gap-4 items-start">
            <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full sv-gradient-bg text-white text-xs font-bold">
              {step.n}
            </span>
            <p className="text-white/65 text-sm leading-relaxed pt-0.5">
              {step.text}
            </p>
          </div>
        ))}
      </div>

      <a
        href={DISCORD_INVITE}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/10 text-white hover:bg-[#5865F2]/20 transition-colors text-sm font-semibold"
      >
        <MessageCircle className="w-4 h-4 text-[#5865F2]" />
        Rejoindre le serveur Discord
        <ExternalLink className="w-3.5 h-3.5 opacity-50" />
      </a>

      <p className="text-white/30 text-xs text-center">
        Pensez à vérifier vos DM et les règles du serveur avant de contacter le support.
      </p>
    </div>
  );
}

export default function Contact() {
  const [method, setMethod] = useState<Method>("none");

  return (
    <section
      id="contact"
      className="py-32 px-6"
      style={{
        background:
          "linear-gradient(180deg, #000 0%, #060012 50%, #000 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/50 mb-4">
            DÉMARRONS
          </p>
          <h2 className="section-heading text-white mb-4">
            Nous <span className="sv-gradient-text">contacter</span>
          </h2>
          <p className="text-white/55 text-base leading-relaxed">
            Choisissez votre moyen de contact préféré.
          </p>
        </motion.div>

        {/* Method selector */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {/* Email */}
          <button
            onClick={() => setMethod("email")}
            className={`flex flex-col items-center gap-3 py-7 rounded-2xl transition-all duration-300 cursor-pointer ${
              method === "email"
                ? "glass-card border border-purple-500/50 shadow-[0_0_30px_rgba(120,85,184,0.12)]"
                : "glass-card hover:border-white/[0.14]"
            }`}
          >
            <Mail
              className={`w-6 h-6 ${method === "email" ? "text-purple-400" : "text-white/50"}`}
            />
            <span
              className={`text-sm font-semibold ${method === "email" ? "text-white" : "text-white/60"}`}
            >
              Par email
            </span>
            <span className="text-white/30 text-xs">Formulaire de contact</span>
          </button>

          {/* Discord */}
          <button
            onClick={() => setMethod("discord")}
            className={`flex flex-col items-center gap-3 py-7 rounded-2xl transition-all duration-300 cursor-pointer ${
              method === "discord"
                ? "glass-card border border-[#5865F2]/50 shadow-[0_0_30px_rgba(88,101,242,0.12)]"
                : "glass-card hover:border-white/[0.14]"
            }`}
          >
            <MessageCircle
              className={`w-6 h-6 ${method === "discord" ? "text-[#5865F2]" : "text-white/50"}`}
            />
            <span
              className={`text-sm font-semibold ${method === "discord" ? "text-white" : "text-white/60"}`}
            >
              Via Discord
            </span>
            <span className="text-white/30 text-xs">Ticket support</span>
          </button>
        </motion.div>

        {/* Dynamic content */}
        <AnimatePresence mode="wait">
          {method !== "none" && (
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl glass-panel p-6 md:p-8"
            >
              {method === "email" ? <EmailForm /> : <DiscordPath />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
