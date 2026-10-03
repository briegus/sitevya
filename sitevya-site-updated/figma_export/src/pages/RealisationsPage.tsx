import { useEffect } from "react";
import { ExternalLink, FolderOpen, Globe, Bot } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { useData } from "@/contexts/DataContext";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Site vitrine": Globe,
  "Portfolio": Globe,
  "Dashboard Discord": Bot,
  "Bot Discord": Bot,
  "Site connecté à un bot Discord": Bot,
};

export default function RealisationsPage() {
  const { realisations, refreshPublicRealisations } = useData();
  const published = realisations.filter(r => r.published);

  useEffect(() => {
    refreshPublicRealisations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper centered>
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-white/40 mb-3">
            NOS PROJETS
          </p>
          <h1 className="section-heading text-4xl md:text-6xl text-white mb-4">
            Nos <span className="sv-gradient-text">réalisations</span>
          </h1>
          <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
            Chaque projet est pensé et conçu sur mesure pour répondre à vos besoins.
          </p>
        </div>

        {published.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center">
            <FolderOpen className="w-10 h-10 text-white/12 mx-auto mb-4" />
            <p className="text-white/40 text-base font-medium mb-1">
              Nos premières réalisations seront bientôt disponibles.
            </p>
            <p className="text-white/20 text-sm">
              Revenez nous voir prochainement.
            </p>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
              {published.map((project, i) => {
                const Icon = CATEGORY_ICONS[project.category] ?? Globe;
                return (
                  <div
                    key={project.id}
                    className={`group flex flex-col ${i >= 2 ? "sm:border-t border-white/[0.06]" : ""}`}
                  >
                    <div className="relative h-36 sv-gradient-bg flex items-center justify-center overflow-hidden opacity-80">
                      <div className="absolute inset-0 bg-black/20" />
                      <Icon className="w-10 h-10 text-white/30 relative z-10" />
                    </div>
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-medium tracking-widest uppercase sv-gradient-text block mb-1">
                            {project.category}
                          </span>
                          <h3 className="text-white font-semibold leading-tight">{project.title}</h3>
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full liquid-glass hover:text-white transition-colors text-white/40"
                            aria-label="Voir le projet"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-white/45 text-xs leading-relaxed flex-1">{project.description}</p>
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map(tag => (
                            <span key={tag} className="glass-card text-[10px] font-medium px-2.5 py-1 rounded-full text-white/50">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-white/20 text-[11px]">{project.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
