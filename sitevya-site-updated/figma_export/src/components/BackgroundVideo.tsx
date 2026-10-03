// Fond animé "aurora" — entièrement en CSS/SVG, aucune dépendance externe.
// L'ancienne version chargeait un flux vidéo Mux temporaire créé pendant le
// prototypage sur Figma Make ; ces liens expirent et ne doivent jamais être
// la base d'un site en production. Celui-ci ne peut jamais disparaître.
export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black" aria-hidden="true">
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" />
      <div className="page-vignette absolute inset-0" />
      {/* Grain très léger pour casser l'aspect "dégradé plat" */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-overlay">
        <filter id="sv-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sv-noise)" />
      </svg>

      {/* Filtre de réfraction du verre : déforme légèrement ce qu'il y a derrière,
          comme un vrai verre bombé (et pas juste flouté). Réservé à .liquid-glass
          (quelques éléments à l'écran à la fois : navbar, CTA) via @supports côté
          CSS, pour rester léger même sur mobile. Largeur/hauteur 0 = invisible. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="sv-liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="sv-noise" />
          <feDisplacementMap in="SourceGraphic" in2="sv-noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
}
