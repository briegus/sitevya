import { Link } from "react-router-dom";
import { Globe, Bot, ArrowRight } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const services = [
  {
    icon: Globe,
    title: "Sites vitrines avancés",
    description:
      "Des sites web personnalisés conçus pour présenter une entreprise, un projet, une marque ou une communauté avec une expérience moderne et mémorable.",
    features: [
      "Design 100 % personnalisé",
      "Responsive & mobile-first",
      "Animations & interactions",
      "Performances optimisées",
      "SEO technique",
      "Intégrations sur mesure",
    ],
    gradient: "from-[#2836a0] to-[#7050b8]",
    accent: "rgba(48,64,168,0.18)",
    topLine: "from-[#3040a8] via-[#7050b8] to-transparent",
  },
  {
    icon: Bot,
    title: "Sites & dashboards Discord",
    description:
      "Des interfaces web permettant de gérer et d'administrer un bot Discord — configuration, tickets, statistiques, commandes — avec un panneau de contrôle intuitif.",
    features: [
      "Configuration & commandes",
      "Gestion des tickets",
      "Statistiques temps réel",
      "Gestion du serveur",
      "Logs & historique",
      "Fonctionnalités custom",
    ],
    gradient: "from-[#7050b8] to-[#c060a8]",
    accent: "rgba(197,112,170,0.18)",
    topLine: "from-transparent via-[#9060c0] to-[#c060a8]",
  },
];

export default function ServicesPage() {
  return (
    <PageWrapper centered>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-white/40 mb-3">
            CE QUE NOUS FAISONS
          </p>
          <h1 className="section-heading text-4xl md:text-6xl text-white mb-4">
            Nos <span className="sv-gradient-text">services</span>
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto leading-relaxed">
            Deux expertises complémentaires pour votre présence numérique.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="glass-panel rounded-3xl p-8 flex flex-col gap-6"
                style={{ boxShadow: `0 0 80px 0 ${service.accent}, 0 40px 100px rgba(0,0,0,0.55)` }}
              >
                {/* Gradient top accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${service.topLine} opacity-80`}
                />

                <div>
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${service.gradient} mb-5 shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2
                    className="text-xl font-semibold text-white mb-3 section-heading"
                    style={{ fontSize: "1.25rem" }}
                  >
                    {service.title}
                  </h2>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <ul className="grid grid-cols-2 gap-y-2.5 gap-x-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full shrink-0 bg-purple-400/60" />
                      <span className="text-white/60 text-xs">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="mt-auto flex items-center gap-2 text-sm font-medium sv-gradient-text hover:opacity-75 transition-opacity"
                >
                  Nous contacter
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: "#c570aa" }} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 sv-gradient-bg rounded-full px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-900/25"
          >
            Démarrer votre projet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
