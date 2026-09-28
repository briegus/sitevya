import { motion } from "motion/react";
import { Globe, Bot } from "lucide-react";

const projects = [
  {
    title: "Portfolio Studio Lumière",
    category: "Site vitrine",
    description:
      "Site vitrine avec galerie immersive et animations sur mesure pour un studio de photographie professionnel.",
    gradient: "from-[#1a2480] via-[#3040a8] to-[#5548c8]",
    icon: Globe,
    tags: ["Design", "Animation", "Galerie"],
  },
  {
    title: "Dashboard YggBot",
    category: "Bot Discord",
    description:
      "Interface d'administration complète pour un bot Discord communautaire : tickets, stats, gestion des membres.",
    gradient: "from-[#5548c8] via-[#7855b8] to-[#a060b8]",
    icon: Bot,
    tags: ["Dashboard", "Tickets", "Statistiques"],
  },
  {
    title: "Association Trail Alpin",
    category: "Site vitrine",
    description:
      "Site événementiel pour une association sportive avec inscriptions en ligne et calendrier des courses.",
    gradient: "from-[#8048a8] via-[#a060b8] to-[#c570aa]",
    icon: Globe,
    tags: ["Événement", "Inscription", "SEO"],
  },
  {
    title: "Panel MusicWave",
    category: "Bot Discord",
    description:
      "Dashboard de gestion pour un bot musique Discord avec queue, historique et commandes avancées.",
    gradient: "from-[#3040a8] via-[#c570aa] to-[#e080c0]",
    icon: Bot,
    tags: ["Musique", "Commandes", "Interface"],
  },
];

export default function Realisations() {
  return (
    <section
      id="realisations"
      className="py-32 px-6"
      style={{ background: "linear-gradient(180deg, #000 0%, #05020d 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/50 mb-4">
            NOS PROJETS
          </p>
          <h2 className="section-heading text-white mb-5">
            Nos <span className="sv-gradient-text">réalisations</span>
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto leading-relaxed">
            Chaque projet est conçu sur mesure pour répondre aux besoins
            spécifiques de nos clients.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((project, i) => {
            const Icon = project.icon;
            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group relative rounded-2xl overflow-hidden glass-card hover:border-white/[0.14] transition-all duration-500"
              >
                {/* Thumbnail */}
                <div
                  className={`relative h-44 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <Icon className="w-12 h-12 text-white/30 relative z-10" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/10" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-[10px] font-medium tracking-widest uppercase sv-gradient-text mb-1 block">
                      {project.category}
                    </span>
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-white/50 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/[0.05] text-white/50 border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Coming soon notice */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/30 text-sm mt-12"
        >
          De nouvelles réalisations arrivent bientôt —{" "}
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="sv-gradient-text hover:opacity-80 transition-opacity cursor-pointer"
          >
            votre projet peut être le prochain.
          </button>
        </motion.p>
      </div>
    </section>
  );
}
