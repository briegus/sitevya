// Tout ce qui fait "vivre" le verre liquide (glass-card / glass-panel /
// liquid-glass) au-delà du CSS statique : le reflet qui suit le doigt/la
// souris, le pulse lumineux au tap/clic, et la légère parallaxe du fond
// "aurora" au scroll. Un seul jeu d'écouteurs globaux, aucun coût par élément.
const GLASS_SELECTOR = ".glass-card, .glass-panel, .liquid-glass";

let attached = false;
let lastEl: HTMLElement | null = null;
let rippleRoot: HTMLDivElement | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

// ── Reflet qui suit le curseur / le doigt (--gx/--gy, lus par index.css) ────
function updateHighlight(clientX: number, clientY: number, target: EventTarget | null) {
  const el = (target as HTMLElement | null)?.closest<HTMLElement>(GLASS_SELECTOR) ?? null;

  if (lastEl && lastEl !== el) {
    lastEl.style.removeProperty("--gx");
    lastEl.style.removeProperty("--gy");
  }
  lastEl = el;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  const gx = ((clientX - rect.left) / rect.width) * 100;
  const gy = ((clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--gx", `${gx}%`);
  el.style.setProperty("--gy", `${gy}%`);
}

// ── Pulse lumineux au tap/clic — le verre "capte" la lumière à l'endroit
//    pressé, comme un vrai retour haptique visuel. Rendu dans un calque à
//    part (jamais un enfant React) pour ne jamais interférer avec le DOM
//    que React gère lui-même. ─────────────────────────────────────────────
function getRippleRoot(): HTMLDivElement {
  if (rippleRoot) return rippleRoot;
  const root = document.createElement("div");
  root.id = "sv-ripple-root";
  document.body.appendChild(root);
  rippleRoot = root;
  return root;
}

function spawnRipple(clientX: number, clientY: number, target: EventTarget | null) {
  if (prefersReducedMotion()) return;
  const el = (target as HTMLElement | null)?.closest<HTMLElement>(GLASS_SELECTOR);
  if (!el) return;

  const ripple = document.createElement("span");
  ripple.className = "sv-ripple";
  ripple.style.left = `${clientX}px`;
  ripple.style.top = `${clientY}px`;
  getRippleRoot().appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  // Filet de sécurité si l'événement ne se déclenche pas (onglet en arrière-plan, etc.)
  setTimeout(() => ripple.remove(), 1200);
}

// ── Légère parallaxe de l'aurore au scroll — simule la profondeur, comme si
//    on voyait le fond à travers une épaisseur de verre qui bouge avec soi.
//    Selon les pages, c'est tantôt <html>, tantôt <body> qui défile vraiment
//    ici (mise en page en plein écran) : on lit les deux plutôt que de
//    supposer que c'est toujours window.scrollY qui bouge. L'écouteur est
//    posé sur `document` avec capture pour attraper le scroll quel que soit
//    l'élément qui défile réellement, puisqu'un scroll interne à <body> ne
//    déclenche pas toujours l'évènement "scroll" sur window. ───────────────
function currentScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function initScrollParallax() {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(currentScrollY() * 0.06, 40);
      document.documentElement.style.setProperty("--sv-scroll-parallax", `${y}px`);
      ticking = false;
    });
  };
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
}

export function initLiquidGlassEffects(): void {
  if (attached || typeof window === "undefined") return;
  attached = true;

  // pointermove couvre souris, stylet ET doigt (glissé) en un seul écouteur.
  window.addEventListener(
    "pointermove",
    (e) => updateHighlight(e.clientX, e.clientY, e.target),
    { passive: true }
  );

  // Un simple tap (sans glisser) ne déclenche pas pointermove sur mobile :
  // on positionne au moins le reflet à l'endroit du tap, et on déclenche le pulse.
  window.addEventListener(
    "pointerdown",
    (e) => {
      updateHighlight(e.clientX, e.clientY, e.target);
      spawnRipple(e.clientX, e.clientY, e.target);
    },
    { passive: true }
  );

  if (!prefersReducedMotion()) {
    initScrollParallax();
  }
}
