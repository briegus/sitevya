import { motion } from "motion/react";
import { Globe, Bot } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Sites vitrines avancés",
    description:
      "Des sites web personnalisés conçus pour présenter une entreprise, un projet, une marque, une association, une communauté ou une activité avec une expérience moderne et professionnelle.",
    features: [
      "Design 100 % personnalisé",
      "Responsive & mobile-first",
      "Animations & interactions",
      "Performances optimisées",
      "SEO technique",
      "Intégrations sur mesure",
    ],
    gradient: "from-[#3040a8] to-[#7855b8]",
    glow: "rgba(48,64,168,0.15)",
  },
  {
    icon: Bot,
    title: "Sites & dashboards pour bots Discord",
    description:
      "Des interfaces web permettant de gérer et d'administrer plus facilement un bot Discord, avec un panneau de contrôle intuitif et des fonctionnalités avancées.",
    features: [
      "Configuration & commandes",
      "Gestion des tickets",
      "Statistiques temps réel",
      "Gestion du serveur",
      "Logs & historique",
      "Fonctionnalités personnalisées",
    ],
    gradient: "from-[#7855b8] to-[#c570aa]",
    glow: "rgba(197,112,170,0.15)",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 px-6 bg-black">
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
            CE QUE NOUS FAISONS
          </p>
          <h2 className="section-heading text-white mb-5">
            Nos <span className="sv-gradient-text">services</span>
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Deux expertises complémentaires pour répondre à vos besoins
            numériques avec précision et créativité.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group relative rounded-2xl p-8 glass-card hover:border-white/[0.14] transition-all duration-500"
                style={{
                  boxShadow: `0 0 60px 0 ${service.glow}`,
                }}
              >
                {/* Gradient top line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${service.gradient} opacity-60`}
                />

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} mb-6 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3
                  className="text-xl font-semibold text-white mb-3"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {service.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full shrink-0 bg-purple-400/70" />
                      <span className="text-white/65 text-xs">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className={`mt-8 flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  Nous contacter →
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
