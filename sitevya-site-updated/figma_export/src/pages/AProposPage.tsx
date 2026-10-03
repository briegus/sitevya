import { Link } from "react-router-dom";
import { Sparkles, Zap, Heart, Shield, ArrowRight } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import logo from "@/imports/657e8584-5d7e-45d0-84aa-8c15c5f80e83.png";

const values = [
  { icon: Sparkles, title: "Excellence créative", description: "Pas de templates — chaque site est pensé et créé spécifiquement pour vous." },
  { icon: Zap, title: "Performance", description: "Sites rapides, optimisés et accessibles sur tous les appareils." },
  { icon: Heart, title: "Proximité", description: "Un dialogue transparent à chaque étape. Vous êtes impliqué dans la création." },
  { icon: Shield, title: "Fiabilité", description: "Livrables solides et maintenables. Votre investissement est protégé." },
];

export default function AProposPage() {
  return (
    <PageWrapper centered>
      <div className="w-full max-w-5xl">
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
            {/* Left */}
            <div className="p-8 md:p-10 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-white/40 mb-3">
                  QUI SOMMES-NOUS
                </p>
                <h1 className="section-heading text-4xl md:text-5xl text-white mb-6">
                  À propos de{" "}
                  <span className="sv-gradient-text">Sitévya</span>
                </h1>
              </div>

              <div className="space-y-4 text-white/60 text-[15px] leading-relaxed">
                <p>
                  Sitévya est une entreprise spécialisée dans la création de
                  sites web avancés et de solutions numériques sur mesure. Notre
                  expertise couvre les sites vitrines modernes et les interfaces
                  de gestion pour bots Discord.
                </p>
                <p>
                  Nous croyons que chaque projet mérite une attention
                  particulière. Pas de template générique — chaque site est
                  pensé, conçu et développé spécifiquement pour vous.
                </p>
                <p>
                  Notre mission : rendre votre présence web aussi mémorable que
                  votre activité.
                </p>
              </div>

              <Link
                to="/contact"
                className="mt-2 inline-flex items-center gap-2 sv-gradient-bg rounded-full px-7 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity self-start shadow-lg shadow-purple-900/20"
              >
                Démarrer un projet <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right */}
            <div className="p-8 md:p-10 flex flex-col gap-8">
              {/* Logo */}
              <div className="flex justify-center py-4">
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#3040a8]/25 via-[#7855b8]/25 to-[#c570aa]/25 rounded-full scale-150" />
                  <img
                    src={logo}
                    alt="Sitévya"
                    className="relative h-24 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Values */}
              <div className="grid grid-cols-2 gap-3">
                {values.map((val) => {
                  const Icon = val.icon;
                  return (
                    <div key={val.title} className="glass-card rounded-2xl p-4">
                      <Icon className="w-4 h-4 text-purple-400 mb-2" />
                      <p className="text-white text-sm font-semibold mb-1">
                        {val.title}
                      </p>
                      <p className="text-white/40 text-xs leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
