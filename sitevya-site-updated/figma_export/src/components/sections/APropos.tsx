import { motion } from "motion/react";
import { Sparkles, Zap, Heart, Shield } from "lucide-react";
import logo from "@/imports/657e8584-5d7e-45d0-84aa-8c15c5f80e83.png";

const values = [
  {
    icon: Sparkles,
    title: "Excellence créative",
    description:
      "Chaque projet est une opportunité de créer quelque chose d'exceptionnel. Nous ne livrons pas des templates.",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Des sites rapides, optimisés et accessibles sur tous les appareils. La performance fait partie du design.",
  },
  {
    icon: Heart,
    title: "Proximité client",
    description:
      "Un dialogue transparent à chaque étape. Vous êtes impliqué dans la création de votre projet.",
  },
  {
    icon: Shield,
    title: "Fiabilité",
    description:
      "Des livrables solides, maintenables et documentés. Votre investissement est protégé sur le long terme.",
  },
];

export default function APropos() {
  return (
    <section id="a-propos" className="py-32 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/50 mb-4">
              QUI SOMMES-NOUS
            </p>
            <h2 className="section-heading text-white mb-6">
              À propos de{" "}
              <span className="sv-gradient-text">Sitévya</span>
            </h2>
            <div className="space-y-4 text-white/60 text-[15px] leading-relaxed">
              <p>
                Sitévya est une entreprise spécialisée dans la création de sites
                web avancés et de solutions numériques sur mesure. Notre expertise
                couvre les sites vitrines modernes et les interfaces de gestion
                pour bots Discord.
              </p>
              <p>
                Nous croyons que chaque projet mérite une attention particulière.
                Pas de template générique, pas de livraison à la chaîne — chaque
                site que nous créons est pensé, conçu et développé spécifiquement
                pour vous.
              </p>
              <p>
                Notre mission : rendre votre présence web aussi mémorable que
                votre activité.
              </p>
            </div>

            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-8 flex items-center gap-2 sv-gradient-bg rounded-full px-7 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              Démarrer un projet
            </button>
          </motion.div>

          {/* Right — logo + values */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="flex flex-col gap-8"
          >
            {/* Logo display */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#3040a8]/20 via-[#7855b8]/20 to-[#c570aa]/20 rounded-full scale-150" />
                <img
                  src={logo}
                  alt="Sitévya"
                  className="relative h-32 w-auto object-contain"
                />
              </div>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-2 gap-4">
              {values.map((val, i) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="rounded-xl p-4 glass-card"
                  >
                    <Icon className="w-5 h-5 text-purple-400 mb-2" />
                    <p className="text-white text-sm font-semibold mb-1">
                      {val.title}
                    </p>
                    <p className="text-white/45 text-xs leading-relaxed">
                      {val.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
