import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "@/imports/657e8584-5d7e-45d0-84aa-8c15c5f80e83.png";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20"
    >
      <div className="text-center max-w-5xl mx-auto flex flex-col items-center gap-10">
        {/* Logo — screen blend removes black background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={logo}
            alt="Sitévya"
            className="h-28 md:h-36 w-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-white/55 text-[11px] font-medium tracking-[0.28em] uppercase"
        >
          EXPÉRIENCES WEB AVANCÉES
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="section-heading text-5xl md:text-[76px] leading-[1.04]"
        >
          <span className="sv-gradient-text">Votre présence web,</span>
          <br />
          <span
            className="text-white"
            style={{
              textShadow: "0 0 80px rgba(120,85,184,0.25)",
            }}
          >
            créée autrement.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-white/55 text-base md:text-lg max-w-lg leading-relaxed"
        >
          Sites vitrines sur mesure &amp; dashboards pour bots Discord.
          <br className="hidden md:block" />
          Chaque projet est une expérience unique.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/contact"
            className="flex items-center gap-2 sv-gradient-bg rounded-full px-9 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-xl shadow-purple-900/30"
          >
            Démarrer un projet
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/services"
            className="liquid-glass rounded-full px-9 py-3.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Découvrir nos services
          </Link>
        </motion.div>

        {/* Scroll hint → now a nav hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex items-center gap-6 mt-2"
        >
          {["Services", "Réalisations", "Contact"].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
            >
              <Link
                to={`/${label.toLowerCase().replace("é", "e").replace("é", "e")}`}
                className="text-white/35 hover:text-white/70 transition-colors text-xs font-medium tracking-widest uppercase"
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
