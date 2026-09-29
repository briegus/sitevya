import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ExternalLink } from "lucide-react";
import logo from "@/imports/657e8584-5d7e-45d0-84aa-8c15c5f80e83.png";

const NAV_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Réalisations", to: "/realisations" },
  { label: "Avis", to: "/avis" },
  { label: "FAQ", to: "/faq" },
  { label: "À propos", to: "/a-propos" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4"
      >
        <nav
          className={`liquid-glass rounded-2xl px-5 py-3 flex items-center justify-between max-w-6xl mx-auto transition-all duration-500 ${
            scrolled ? "bg-black/30" : "bg-white/[0.005]"
          }`}
        >
          {/* Logo — fond transparent natif, plus besoin de mix-blend-mode */}
          <Link to="/" className="flex items-center shrink-0" onClick={() => setMobileOpen(false)}>
            <img
              src={logo}
              alt="Sitévya"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "sv-gradient-bg text-white shadow-sm shadow-purple-900/30"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden md:flex items-center gap-1.5 sv-gradient-bg rounded-full px-5 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Espace équipe
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="liquid-glass lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/[0.06] transition-colors text-white"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{
              background: "rgba(4,2,14,0.4)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel absolute right-0 top-0 bottom-0 w-72 flex flex-col pt-20 pb-8 px-6"
            >
              <nav className="flex flex-col gap-1 flex-1">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `py-3 px-4 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? "sv-gradient-bg text-white"
                          : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 sv-gradient-bg rounded-xl py-3.5 text-sm font-semibold text-white"
              >
                Espace équipe <ExternalLink className="w-4 h-4 opacity-70" />
              </Link>
            </motion.div>
            {/* Tap outside to close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setMobileOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
